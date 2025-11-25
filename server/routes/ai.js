import express from 'express';
import { authenticate } from '../middleware/auth.js';
import { enhanceResume, generateCoverLetter, generatePortfolioContent } from '../services/ai.js';

const router = express.Router();

// Enhance resume with AI
router.post('/enhance-resume', authenticate, async (req, res) => {
  try {
    const { resumeData } = req.body;
    const enhanced = await enhanceResume(resumeData);
    res.json({ enhanced });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Generate cover letter
router.post('/cover-letter', authenticate, async (req, res) => {
  try {
    const { jobTitle, resumeData } = req.body;
    const coverLetter = await generateCoverLetter(jobTitle, resumeData);
    res.json({ coverLetter });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Generate portfolio content
router.post('/portfolio-content', authenticate, async (req, res) => {
  try {
    const { userData, customPrompt } = req.body;
    const content = await generatePortfolioContent(userData, customPrompt);
    res.json({ content });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;
