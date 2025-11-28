import express from 'express';
import { authenticate } from '../middleware/auth.js';
import User from '../models/User.js';

const router = express.Router();

// Get current user
router.get('/me', authenticate, async (req, res) => {
  try {
    res.json({ user: req.user });
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

// Get dashboard data (combined endpoint for performance)
router.get('/dashboard', authenticate, async (req, res) => {
  try {
    const Resume = (await import('../models/Resume.js')).default;
    const Portfolio = (await import('../models/Portfolio.js')).default;
    const CoverLetter = (await import('../models/CoverLetter.js')).default;

    // Fetch all data in parallel with lean() for better performance
    const [resumes, portfolios, coverLetters] = await Promise.all([
      Resume.find({ userId: req.userId }).sort({ updatedAt: -1 }).lean(),
      Portfolio.find({ userId: req.userId }).lean(),
      CoverLetter.find({ user: req.user.id }).sort({ updatedAt: -1 }).lean()
    ]);

    res.json({
      user: req.user,
      resumes,
      portfolios,
      coverLetters
    });
  } catch (error) {
    console.error('Dashboard error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Update profile
router.put('/profile', authenticate, async (req, res) => {
  try {
    const { name, profile } = req.body;
    
    const user = await User.findByIdAndUpdate(
      req.userId,
      { name, profile },
      { new: true }
    ).select('-password');

    res.json({ user });
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

export default router;
