import express from 'express';
import { authenticate, checkCredits } from '../middleware/auth.js';
import Portfolio from '../models/Portfolio.js';
import User from '../models/User.js';

const router = express.Router();

// Get user's portfolios
router.get('/', authenticate, async (req, res) => {
  try {
    const portfolios = await Portfolio.find({ userId: req.userId });
    res.json({ portfolios });
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

// Get portfolio by subdomain (public) - MUST come before /:id route
router.get('/public/:subdomain', async (req, res) => {
  try {
    console.log('🔍 Looking for portfolio with subdomain:', req.params.subdomain);
    
    const portfolio = await Portfolio.findOne({ 
      subdomain: req.params.subdomain,
      published: true 
    });
    
    if (!portfolio) {
      console.log('❌ Portfolio not found or not published');
      return res.status(404).json({ error: 'Portfolio not found' });
    }

    console.log('✅ Portfolio found:', portfolio._id);
    
    // Increment views
    portfolio.views += 1;
    await portfolio.save();

    res.json({ portfolio });
  } catch (error) {
    console.error('❌ Error fetching portfolio:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Get portfolio by ID
router.get('/:id', authenticate, async (req, res) => {
  try {
    const portfolio = await Portfolio.findOne({ 
      _id: req.params.id, 
      userId: req.userId 
    });
    
    if (!portfolio) {
      return res.status(404).json({ error: 'Portfolio not found' });
    }

    res.json({ portfolio });
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

// Create portfolio
router.post('/', authenticate, checkCredits('portfolio'), async (req, res) => {
  try {
    const portfolio = new Portfolio({
      userId: req.userId,
      ...req.body
    });

    await portfolio.save();

    // Deduct credit
    await User.findByIdAndUpdate(req.userId, {
      $inc: { 'credits.portfolios': -1 }
    });

    res.status(201).json({ portfolio });
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

// Update portfolio
router.put('/:id', authenticate, async (req, res) => {
  try {
    const portfolio = await Portfolio.findOneAndUpdate(
      { _id: req.params.id, userId: req.userId },
      req.body,
      { new: true }
    );

    if (!portfolio) {
      return res.status(404).json({ error: 'Portfolio not found' });
    }

    res.json({ portfolio });
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

// Delete portfolio
router.delete('/:id', authenticate, async (req, res) => {
  try {
    const portfolio = await Portfolio.findOneAndDelete({ 
      _id: req.params.id, 
      userId: req.userId 
    });
    
    if (!portfolio) {
      return res.status(404).json({ error: 'Portfolio not found' });
    }
    
    res.json({ message: 'Portfolio deleted' });
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

export default router;
