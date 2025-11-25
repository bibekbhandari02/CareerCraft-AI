import mongoose from 'mongoose';

const resumeSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  title: {
    type: String,
    default: 'Untitled Resume'
  },
  template: {
    type: String,
    default: 'modern'
  },
  personalInfo: {
    fullName: String,
    email: String,
    phone: String,
    location: String,
    linkedin: String,
    github: String,
    website: String
  },
  summary: String,
  education: [{
    institution: String,
    degree: String,
    field: String,
    startDate: String,
    endDate: String,
    gpa: String,
    description: String
  }],
  experience: [{
    company: String,
    position: String,
    location: String,
    startDate: String,
    endDate: String,
    current: Boolean,
    description: [String]
  }],
  skills: [{
    category: String,
    items: [String]
  }],
  projects: [{
    name: String,
    description: String,
    technologies: [String],
    link: String,
    github: String
  }],
  certifications: [{
    name: String,
    issuer: String,
    date: String,
    link: String,
    imageUrl: String
  }],
  aiEnhanced: {
    type: Boolean,
    default: false
  },
  pdfUrl: String,
  docxUrl: String
}, {
  timestamps: true
});

export default mongoose.model('Resume', resumeSchema);
