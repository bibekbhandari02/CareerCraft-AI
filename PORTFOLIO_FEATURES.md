# Portfolio Builder Features

## Overview
The Portfolio Builder allows users to create professional, customizable portfolio websites with AI assistance.

## Key Features

### 1. Portfolio Builder UI
- **Hero Section**: Name, title, and introduction
- **About Me**: Detailed background and story
- **Skills**: Organized by categories (Frontend, Backend, Tools, etc.)
- **Projects**: Showcase with images, descriptions, technologies, and links
- **Contact**: Email, phone, LinkedIn, GitHub
- **Theme Customization**: Choose colors (primary, secondary, accent)
- **SEO Settings**: Title, description, and keywords

### 2. AI-Powered Content Generation
- Generate complete portfolio content with one click
- AI creates:
  - Compelling hero section
  - Professional about section
  - Organized skills by category
  - 3-4 impressive project ideas with descriptions
- Uses Gemini AI for intelligent content creation

### 3. Live Preview
- Real-time preview of portfolio as you edit
- Toggle preview on/off
- Sticky sidebar for easy reference

### 4. Image Upload
- Upload project images via Cloudinary
- Automatic image optimization
- Preview uploaded images

### 5. Public Portfolio Viewing
- Each portfolio gets a unique subdomain (e.g., john-doe.resumeai.com)
- Beautiful, responsive public view
- View counter tracking
- No navbar for clean presentation
- Optimized for sharing

### 6. Portfolio Management
- Create multiple portfolios
- Edit existing portfolios
- Publish/unpublish portfolios
- View analytics (views count)

## Routes

### Client Routes
- `/portfolio/new` - Create new portfolio
- `/portfolio/:id` - Edit existing portfolio
- `/portfolio/public/:subdomain` - Public portfolio view

### API Endpoints
- `GET /api/portfolio` - Get user's portfolios
- `GET /api/portfolio/:id` - Get portfolio by ID
- `GET /api/portfolio/public/:subdomain` - Get public portfolio
- `POST /api/portfolio` - Create portfolio (requires credits)
- `PUT /api/portfolio/:id` - Update portfolio
- `POST /api/ai/portfolio-content` - Generate AI content

## Database Schema

```javascript
{
  userId: ObjectId,
  subdomain: String (unique),
  customDomain: String,
  theme: String (modern/minimal/creative),
  colors: {
    primary: String,
    secondary: String,
    accent: String
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
  published: Boolean,
  views: Number
}
```

## Usage Flow

1. **Create Portfolio**
   - Click "Create Portfolio" from dashboard
   - Fill in subdomain (required)
   - Optionally use AI to generate content
   - Fill in sections manually or edit AI-generated content

2. **Add Projects**
   - Click "Add Project"
   - Fill in project details
   - Upload project image
   - Add live demo and GitHub links

3. **Customize Theme**
   - Choose theme (Modern/Minimal/Creative)
   - Select custom colors
   - Preview changes in real-time

4. **Publish**
   - Click "Publish" button
   - Portfolio becomes publicly accessible
   - Share subdomain link

5. **View Analytics**
   - Check view count on dashboard
   - Track portfolio performance

## Credits System
- Creating a portfolio requires 1 portfolio credit
- Free plan: 1 portfolio
- Basic plan: 3 portfolios
- Pro plan: Unlimited portfolios

## Future Enhancements
- [ ] Custom domain support
- [ ] More theme options
- [ ] Blog integration
- [ ] Contact form with email notifications
- [ ] Analytics dashboard (detailed views, clicks)
- [ ] Export portfolio as static site
- [ ] Social media integration
- [ ] Testimonials section
- [ ] Resume integration (auto-populate from resume)
