import express from 'express';
import { authenticate, checkCredits } from '../middleware/auth.js';
import Resume from '../models/Resume.js';
import User from '../models/User.js';

const router = express.Router();

// Get all resumes for user
router.get('/', authenticate, async (req, res) => {
  try {
    const resumes = await Resume.find({ userId: req.userId }).sort({ updatedAt: -1 });
    res.json({ resumes });
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

// Get single resume
router.get('/:id', authenticate, async (req, res) => {
  try {
    const resume = await Resume.findOne({ _id: req.params.id, userId: req.userId });
    if (!resume) {
      return res.status(404).json({ error: 'Resume not found' });
    }
    res.json({ resume });
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

// Create resume
router.post('/', authenticate, checkCredits('resume'), async (req, res) => {
  try {
    const resume = new Resume({
      userId: req.userId,
      ...req.body
    });

    await resume.save();

    // Deduct credit
    await User.findByIdAndUpdate(req.userId, {
      $inc: { 'credits.resumeGenerations': -1 }
    });

    res.status(201).json({ resume });
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

// Update resume
router.put('/:id', authenticate, async (req, res) => {
  try {
    const resume = await Resume.findOneAndUpdate(
      { _id: req.params.id, userId: req.userId },
      req.body,
      { new: true }
    );

    if (!resume) {
      return res.status(404).json({ error: 'Resume not found' });
    }

    res.json({ resume });
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

// Delete resume
router.delete('/:id', authenticate, async (req, res) => {
  try {
    const resume = await Resume.findOneAndDelete({ _id: req.params.id, userId: req.userId });
    if (!resume) {
      return res.status(404).json({ error: 'Resume not found' });
    }
    res.json({ message: 'Resume deleted' });
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

export default router;
