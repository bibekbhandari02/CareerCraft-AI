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
      githubLink: String
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

export default mongoose.model('Portfolio', portfolioSchema);
