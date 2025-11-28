import mongoose from 'mongoose';

const analyticsSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  resumeId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Resume'
  },
  portfolioId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Portfolio'
  },
  eventType: {
    type: String,
    enum: [
      'resume_view', 
      'resume_download', 
      'resume_created', 
      'resume_updated', 
      'portfolio_view', 
      'portfolio_created', 
      'portfolio_published',
      'cover_letter_generated', 
      'cover_letter_download',
      'ai_enhancement',
      'ai_enhancement_used'
    ],
    required: true
  },
  metadata: {
    type: mongoose.Schema.Types.Mixed,
    default: {}
  },
  ipAddress: String,
  userAgent: String
}, {
  timestamps: true
});

// Indexes for faster queries
analyticsSchema.index({ userId: 1, createdAt: -1 });
analyticsSchema.index({ resumeId: 1, eventType: 1 });
analyticsSchema.index({ portfolioId: 1, eventType: 1 });
analyticsSchema.index({ eventType: 1, createdAt: -1 });

export default mongoose.model('Analytics', analyticsSchema);
