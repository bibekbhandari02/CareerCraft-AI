import mongoose from 'mongoose';

const resumeVersionSchema = new mongoose.Schema({
  resumeId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Resume',
    required: true
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  versionNumber: {
    type: Number,
    required: true
  },
  versionName: {
    type: String,
    default: function() {
      return `Version ${this.versionNumber}`;
    }
  },
  data: {
    type: mongoose.Schema.Types.Mixed,
    required: true
  },
  changeDescription: String,
  isAutoSave: {
    type: Boolean,
    default: false
  }
}, {
  timestamps: true
});

// Indexes
resumeVersionSchema.index({ resumeId: 1, versionNumber: -1 });
resumeVersionSchema.index({ userId: 1, createdAt: -1 });

export default mongoose.model('ResumeVersion', resumeVersionSchema);
