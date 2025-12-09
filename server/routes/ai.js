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
  // Use user ID for authenticated requests, skip keyGenerator to use default
  skip: (req) => false, // Don't skip any requests
  ...(process.env.NODE_ENV !== 'production' && { skipFailedRequests: true })
});

// Enhance resume with AI
router.post('/enhance-resume', authenticate, aiRateLimiter, async (req, res) => {
  try {
    const { resumeData } = req.body;
    const parsed = await enhanceResume(resumeData);
    
    // The new enhanceResume returns structured JSON directly
    // No need for text parsing anymore
    
    res.json({ parsed });
  } catch (error) {
    console.error('Resume enhancement error:', error);
    res.status(500).json({ error: error.message });
  }
});

// Helper function to parse enhanced resume text into structured data
function parseEnhancedResume(enhancedText, originalData) {
  const parsed = {
    skills: [],
    projects: [],
    education: [],
    certifications: []
  };
  
  // Extract Skills section
  const skillsMatch = enhancedText.match(/\*\*Skills\*\*([\s\S]*?)(?=\*\*|$)/);
  if (skillsMatch) {
    const skillsText = skillsMatch[1];
    const lines = skillsText.split('\n').filter(line => line.trim() && line.includes(':'));
    
    lines.forEach(line => {
      const [category, items] = line.split(':').map(s => s.trim());
      if (category && items) {
        parsed.skills.push({
          category: category,
          items: items.split(',').map(item => item.trim()).filter(item => item)
        });
      }
    });
  }
  
  // If no skills parsed, use original
  if (parsed.skills.length === 0 && originalData.skills) {
    parsed.skills = originalData.skills;
  }
  
  // Extract Projects section
  const projectsMatch = enhancedText.match(/\*\*Projects\*\*([\s\S]*?)(?=\*\*Education|$)/);
  if (projectsMatch) {
    const projectsText = projectsMatch[1];
    const projectBlocks = projectsText.split(/\*\*([^*]+)\*\*/).filter(s => s.trim());
    
    for (let i = 0; i < projectBlocks.length; i += 2) {
      if (projectBlocks[i] && projectBlocks[i + 1]) {
        const name = projectBlocks[i].trim();
        const content = projectBlocks[i + 1].trim();
        
        const descMatch = content.match(/^([^\n]+)/);
        const techMatch = content.match(/Technologies?:\s*([^\n]+)/i);
        const githubMatch = content.match(/GitHub:\s*([^\n]+)/i);
        const liveMatch = content.match(/Live:\s*([^\n]+)/i);
        
        parsed.projects.push({
          name: name,
          description: descMatch ? descMatch[1].trim() : '',
          technologies: techMatch ? techMatch[1].trim() : '',
          github: githubMatch ? githubMatch[1].trim() : '',
          link: liveMatch ? liveMatch[1].trim() : ''
        });
      }
    }
  }
  
  // If no projects parsed, use original
  if (parsed.projects.length === 0 && originalData.projects) {
    parsed.projects = originalData.projects;
  }
  
  // Extract Education
  const educationMatch = enhancedText.match(/\*\*Education\*\*([\s\S]*?)(?=\*\*|$)/);
  if (educationMatch) {
    const educationText = educationMatch[1];
    const lines = educationText.split('\n').filter(line => line.trim() && line.includes('|'));
    
    lines.forEach(line => {
      const parts = line.split('|').map(s => s.trim());
      if (parts.length >= 3) {
        parsed.education.push({
          degree: parts[0],
          institution: parts[1],
          graduationDate: parts[2]
        });
      }
    });
  }
  
  // If no education parsed, use original
  if (parsed.education.length === 0 && originalData.education) {
    parsed.education = originalData.education;
  }
  
  // Extract Certifications
  const certificationsMatch = enhancedText.match(/\*\*Certifications\*\*([\s\S]*?)(?=\*\*|$)/);
  if (certificationsMatch) {
    const certificationsText = certificationsMatch[1];
    const lines = certificationsText.split('\n').filter(line => line.trim() && line.includes('|'));
    
    lines.forEach(line => {
      const cleanLine = line.replace(/^-\s*/, '').trim();
      const parts = cleanLine.split('|').map(s => s.trim());
      if (parts.length >= 2) {
        parsed.certifications.push({
          name: parts[0],
          issuer: parts[1],
          date: parts[2] || ''
        });
      }
    });
  }
  
  // If no certifications parsed, use original
  if (parsed.certifications.length === 0 && originalData.certifications) {
    parsed.certifications = originalData.certifications;
  }
  
  return parsed;
}

// Generate cover letter with streaming support
router.post('/cover-letter', authenticate, aiRateLimiter, async (req, res) => {
  try {
    const { jobTitle, companyName, hiringManager, customPrompt, resumeData, jobDescription, tone } = req.body;
    
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
    const coverLetter = await generateCoverLetter(jobTitle, resumeData, companyName, hiringManager, customPrompt, jobDescription, tone);
    
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
    console.error('Portfolio AI error:', error);
    res.status(500).json({ error: error.message });
  }
});

// Score resume
router.post('/score-resume', authenticate, aiRateLimiter, async (req, res) => {
  try {
    const { resumeData, jobDescription, useAI } = req.body;
    
    if (!resumeData) {
      return res.status(400).json({ error: 'Resume data is required' });
    }
    
    // Import scoring service
    const { calculateATSScore, scoreResumeWithAI } = await import('../services/resumeScoring.js');
    
    if (useAI && req.user.subscription !== 'free') {
      // AI scoring for paid users
      const score = await scoreResumeWithAI(resumeData, jobDescription);
      res.json({ score });
    } else {
      // Basic scoring for free users or when AI not requested
      const score = calculateATSScore(resumeData);
      res.json({ score: { basic: score } });
    }
  } catch (error) {
    console.error('Resume scoring error:', error);
    res.status(500).json({ error: error.message || 'Failed to score resume' });
  }
});

export default router;
