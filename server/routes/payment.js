import express from 'express';
import { authenticate } from '../middleware/auth.js';
import User from '../models/User.js';
import { ESEWA_CONFIG, PLANS } from '../config/esewa.js';

const router = express.Router();

// Development mode flag
const isDevelopment = process.env.NODE_ENV !== 'production';

// Initiate payment
router.post('/initiate', authenticate, async (req, res) => {
  try {
    const { plan } = req.body;
    
    if (!PLANS[plan]) {
      return res.status(400).json({ error: 'Invalid plan' });
    }

    const planDetails = PLANS[plan];
    const transactionId = `TXN-${Date.now()}-${req.userId}`;
    
    // In development mode, use mock payment
    if (isDevelopment) {
      // Mock payment - directly redirect to success page with mock data
      return res.json({
        success: true,
        mock: true,
        redirectUrl: `/payment/mock-success?plan=${plan}&amount=${planDetails.amount}&txn=${transactionId}`
      });
    }

    // Production eSewa payment
    const paymentData = {
      amt: planDetails.amount,
      psc: 0,
      pdc: 0,
      txAmt: 0,
      tAmt: planDetails.amount,
      pid: transactionId,
      scd: ESEWA_CONFIG.merchantId,
      su: ESEWA_CONFIG.successUrl,
      fu: ESEWA_CONFIG.failureUrl,
      userId: req.userId.toString(),
      plan: plan
    };

    res.json({
      success: true,
      paymentUrl: ESEWA_CONFIG.paymentUrl,
      paymentData
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Mock payment success (for development)
router.post('/mock-success', authenticate, async (req, res) => {
  try {
    const { plan } = req.body;
    
    if (!PLANS[plan]) {
      return res.status(400).json({ error: 'Invalid plan' });
    }

    // Update user subscription
    await User.findByIdAndUpdate(req.userId, {
      subscription: plan,
      credits: PLANS[plan].credits
    });

    res.json({
      success: true,
      message: 'Subscription activated (Mock Payment)',
      plan: plan
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Verify eSewa payment
router.get('/verify', async (req, res) => {
  try {
    const { oid, amt, refId } = req.query;

    if (!oid || !amt || !refId) {
      return res.status(400).json({ error: 'Missing payment parameters' });
    }

    // In development, mock verification
    if (isDevelopment) {
      return res.json({
        success: true,
        message: 'Payment verified (Mock)',
        transactionId: oid,
        refId: refId,
        mock: true
      });
    }

    // Production verification
    const verifyUrl = ESEWA_CONFIG.verifyUrl;
    const verifyParams = new URLSearchParams({
      amt: amt,
      rid: refId,
      pid: oid,
      scd: ESEWA_CONFIG.merchantId
    });

    const response = await fetch(`${verifyUrl}?${verifyParams}`);
    const result = await response.text();

    if (result.includes('Success')) {
      const parts = oid.split('-');
      const userId = parts[parts.length - 1];
      
      await User.findByIdAndUpdate(userId, {
        subscription: 'starter',
        credits: PLANS.starter.credits
      });

      res.json({
        success: true,
        message: 'Payment verified successfully',
        transactionId: oid,
        refId: refId
      });
    } else {
      res.status(400).json({
        success: false,
        error: 'Payment verification failed'
      });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;
