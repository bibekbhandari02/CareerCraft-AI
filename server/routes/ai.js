import express from 'express';
import rateLimit from 'express-rate-limit';
import { authenticate } from '../middleware/auth.js';
import { enhanceResume, generateCoverLetter, generatePortfolioContent } from '../services/ai.js';

const router = express.Router();

// Rate limiting for AI endpoints to prevent abuse
const aiRateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 10, // Limit each user to 10 requests per windowMs
  message: 'Too many AI requests, please try again later',
  standardHeaders: true,
  legacyHeaders: false,
  // Use user ID for authenticated requests
  keyGenerator: (req) => req.user?._id?.toString() || req.ip
});

// Enhance resume with AI
router.post('/enhance-resume', authenticate, aiRateLimiter, async (req, res) => {
  try {
    const { resumeData } = req.body;
    const enhanced = await enhanceResume(resumeData);
    res.json({ enhanced });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Generate cover letter with streaming support
router.post('/cover-letter', authenticate, aiRateLimiter, async (req, res) => {
  try {
    const { jobTitle, companyName, hiringManager, customPrompt, resumeData } = req.body;
    
    // Validate required fields
    if (!jobTitle || !resumeData) {
      return res.status(400).json({ error: 'Job title and resume data are required' });
    }
    
    // Check credits for free users (but don't deduct yet)
    if (req.user.subscription === 'free') {
      if (req.user.credits.coverLetters <= 0) {
        return res.status(403).json({ error: 'No cover letter credits remaining' });
      }
    }
    
    // Generate cover letter
    const coverLetter = await generateCoverLetter(jobTitle, resumeData, companyName, hiringManager, customPrompt);
    
    // Only deduct credit AFTER successful generation
    if (req.user.subscription === 'free') {
      req.user.credits.coverLetters -= 1;
      await req.user.save();
    }
    
    res.json({ coverLetter });
  } catch (error) {
    console.error('Cover letter generation error:', error);
    res.status(500).json({ error: error.message || 'Failed to generate cover letter' });
  }
});

// Generate portfolio content
router.post('/portfolio-content', authenticate, aiRateLimiter, async (req, res) => {
  try {
    const { userData, customPrompt } = req.body;
    const content = await generatePortfolioContent(userData, customPrompt);
    res.json({ content });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;
