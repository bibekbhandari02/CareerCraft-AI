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
