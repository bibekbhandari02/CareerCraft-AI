import mongoose from 'mongoose';

const portfolioSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  subdomain: {
    type: String,
    unique: true,
    sparse: true
  },
  customDomain: String,
  theme: {
    type: String,
    default: 'modern'
  },
  template: {
    type: String,
    enum: ['modern', 'minimal', 'creative', 'professional'],
    default: 'modern'
  },
  colorTheme: {
    type: String,
    default: 'purple-pink'
  },
  colors: {
    primary: { type: String, default: '#3b82f6' },
    secondary: { type: String, default: '#1e293b' },
    accent: { type: String, default: '#f59e0b' }
  },
  content: {
    hero: {
      title: String,
      subtitle: String,
      description: String
    },
    about: String,
    skills: [{
      category: String,
      items: [String]
    }],
    projects: [{
      name: String,
      description: String,
      image: String,
      technologies: [String],
      liveLink: String,
      githubLink: String,
      tag: String
    }],
    contact: {
      email: String,
      phone: String,
      linkedin: String,
      github: String
    }
  },
  seo: {
    title: String,
    description: String,
    keywords: [String]
  },
  resumeUrl: {
    type: String,
    default: ''
  },
  logoUrl: {
    type: String,
    default: ''
  },
  logoText: {
    type: String,
    default: ''
  },
  profileImageUrl: {
    type: String,
    default: ''
  },
  published: {
    type: Boolean,
    default: false
  },
  views: {
    type: Number,
    default: 0
  }
}, {
  timestamps: true
});

// Add indexes for better query performance
portfolioSchema.index({ userId: 1 });
portfolioSchema.index({ subdomain: 1, published: 1 });

export default mongoose.model('Portfolio', portfolioSchema);
