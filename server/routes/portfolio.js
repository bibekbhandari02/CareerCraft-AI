import express from 'express';
import { authenticate, checkCredits } from '../middleware/auth.js';
import Portfolio from '../models/Portfolio.js';
import User from '../models/User.js';
import { trackEvent } from '../services/analytics.js';

const router = express.Router();

// Get user's portfolios
router.get('/', authenticate, async (req, res) => {
  try {
    const portfolios = await Portfolio.find({ userId: req.userId })
      .select('_id userId subdomain views updatedAt')
      .lean();
    res.json({ portfolios });
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

// Track recent views to prevent duplicates (in-memory cache)
const recentViews = new Map();
const VIEW_COOLDOWN = 5 * 60 * 1000; // 5 minutes

// Get portfolio by subdomain (public) - MUST come before /:id route
router.get('/public/:subdomain', async (req, res) => {
  try {
    const portfolio = await Portfolio.findOne({ 
      subdomain: req.params.subdomain,
      published: true 
    });
    
    if (!portfolio) {
      return res.status(404).json({ error: 'Portfolio not found' });
    }
    
    // Create a unique key for this view (IP + portfolio ID)
    const viewKey = `${req.ip || req.headers['x-forwarded-for']}_${portfolio._id}`;
    const now = Date.now();
    const lastView = recentViews.get(viewKey);
    
    // Only track if this is a new view or cooldown period has passed
    const shouldTrack = !lastView || (now - lastView) > VIEW_COOLDOWN;
    
    if (shouldTrack) {
      // Increment views
      portfolio.views += 1;
      await portfolio.save();
      
      // Track portfolio view (for portfolio owner's analytics)
      if (portfolio.userId) {
        try {
          await trackEvent(portfolio.userId, 'portfolio_view', { 
            portfolioId: portfolio._id,
            subdomain: req.params.subdomain 
          }, req);
          
          // Update the last view time
          recentViews.set(viewKey, now);
          
          // Clean up old entries (older than cooldown period)
          for (const [key, time] of recentViews.entries()) {
            if (now - time > VIEW_COOLDOWN) {
              recentViews.delete(key);
            }
          }
        } catch (trackError) {
          console.error('Failed to track portfolio view:', trackError.message);
          // Don't fail the request if tracking fails
        }
      }
    }

    res.json({ portfolio });
  } catch (error) {
    console.error('Error fetching portfolio:', error);
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
