import express from 'express';
import { authenticate } from '../middleware/auth.js';
import ResumeVersion from '../models/ResumeVersion.js';
import Resume from '../models/Resume.js';

const router = express.Router();

// Get all versions for a resume
router.get('/resume/:resumeId', authenticate, async (req, res) => {
  try {
    const versions = await ResumeVersion.find({
      resumeId: req.params.resumeId,
      userId: req.userId
    })
    .sort({ versionNumber: -1 })
    .select('versionNumber versionName createdAt changeDescription isAutoSave')
    .lean();
    
    res.json({ versions });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get specific version
router.get('/resume/:resumeId/version/:versionNumber', authenticate, async (req, res) => {
  try {
    const version = await ResumeVersion.findOne({
      resumeId: req.params.resumeId,
      userId: req.userId,
      versionNumber: parseInt(req.params.versionNumber)
    });
    
    if (!version) {
      return res.status(404).json({ error: 'Version not found' });
    }
    
    res.json({ version });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Create new version (manual save)
router.post('/resume/:resumeId', authenticate, async (req, res) => {
  try {
    const { data, versionName, changeDescription } = req.body;
    
    // Get current version count
    const versionCount = await ResumeVersion.countDocuments({
      resumeId: req.params.resumeId
    });
    
    const version = new ResumeVersion({
      resumeId: req.params.resumeId,
      userId: req.userId,
      versionNumber: versionCount + 1,
      versionName: versionName || `Version ${versionCount + 1}`,
      data,
      changeDescription,
      isAutoSave: false
    });
    
    await version.save();
    
    res.status(201).json({ version });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Restore version
router.post('/resume/:resumeId/restore/:versionNumber', authenticate, async (req, res) => {
  try {
    const version = await ResumeVersion.findOne({
      resumeId: req.params.resumeId,
      userId: req.userId,
      versionNumber: parseInt(req.params.versionNumber)
    });
    
    if (!version) {
      return res.status(404).json({ error: 'Version not found' });
    }
    
    // Update the resume with version data
    const resume = await Resume.findOneAndUpdate(
      { _id: req.params.resumeId, userId: req.userId },
      version.data,
      { new: true }
    );
    
    if (!resume) {
      return res.status(404).json({ error: 'Resume not found' });
    }
    
    res.json({ resume, message: 'Version restored successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Delete version
router.delete('/resume/:resumeId/version/:versionNumber', authenticate, async (req, res) => {
  try {
    const version = await ResumeVersion.findOneAndDelete({
      resumeId: req.params.resumeId,
      userId: req.userId,
      versionNumber: parseInt(req.params.versionNumber)
    });
    
    if (!version) {
      return res.status(404).json({ error: 'Version not found' });
    }
    
    res.json({ message: 'Version deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Auto-save version (called periodically)
router.post('/resume/:resumeId/autosave', authenticate, async (req, res) => {
  try {
    const { data } = req.body;
    
    // Check if there's a recent autosave (within last 5 minutes)
    const recentAutoSave = await ResumeVersion.findOne({
      resumeId: req.params.resumeId,
      isAutoSave: true,
      createdAt: { $gte: new Date(Date.now() - 5 * 60 * 1000) }
    });
    
    if (recentAutoSave) {
      // Update existing autosave
      recentAutoSave.data = data;
      await recentAutoSave.save();
      return res.json({ version: recentAutoSave, updated: true });
    }
    
    // Create new autosave
    const versionCount = await ResumeVersion.countDocuments({
      resumeId: req.params.resumeId
    });
    
    const version = new ResumeVersion({
      resumeId: req.params.resumeId,
      userId: req.userId,
      versionNumber: versionCount + 1,
      versionName: 'Auto-save',
      data,
      isAutoSave: true
    });
    
    await version.save();
    
    res.json({ version, updated: false });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;
