# AI Resume Builder & Portfolio Generator

A full-stack SaaS application that generates ATS-friendly resumes, portfolios, and cover letters using AI (Google Gemini 2.0).

## 🚀 Features

- ✅ **AI-Powered Resume Enhancement** - Uses Google Gemini 2.0 to optimize resumes
- ✅ **PDF Export** - Download professional resumes as PDF
- ✅ **Portfolio Generator** - Create stunning portfolio websites
- ✅ **Cover Letter Generator** - AI-generated personalized cover letters
- ✅ **Multiple Resume Types** - Support for experienced professionals and freshers/students
- ✅ **Image Upload** - Upload certificate images via Cloudinary
- ✅ **Payment Integration** - eSewa payment gateway (Nepal)
- ✅ **Credit System** - Subscription-based with free tier
- ✅ **ATS-Friendly** - Optimized for Applicant Tracking Systems

## 🛠️ Tech Stack

### Frontend
- React 18
- Vite
- TailwindCSS
- React Router
- Zustand (State Management)
- React Hook Form
- jsPDF (PDF Generation)

### Backend
- Node.js
- Express.js
- MongoDB (Mongoose)
- JWT Authentication
- Google Gemini 2.0 API
- Cloudinary (Image Storage)
- eSewa Payment Gateway

## 📦 Installation

### Prerequisites
- Node.js (v18+)
- MongoDB (local or Atlas)
- Google Gemini API Key
- Cloudinary Account (optional)

### 1. Clone the repository
```bash
git clone <your-repo-url>
cd ai-resume-builder
```

### 2. Install dependencies

Backend:
```bash
cd server
npm install
```

Frontend:
```bash
cd client
npm install
```

### 3. Environment Setup

Create `server/.env` file:
```env
PORT=5000
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret_key
GEMINI_API_KEY=your_gemini_api_key

# eSewa Payment (Optional)
ESEWA_MERCHANT_ID=EPAYTEST
ESEWA_SECRET_KEY=8gBm/:&EnhH.1/q
ESEWA_SUCCESS_URL=http://localhost:5173/payment/success
ESEWA_FAILURE_URL=http://localhost:5173/payment/failure

# Cloudinary (Optional)
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret

CLIENT_URL=http://localhost:5173
```

### 4. Get API Keys

**Google Gemini API (Free):**
1. Go to https://aistudio.google.com/app/apikey
2. Create API key
3. Add to `.env` as `GEMINI_API_KEY`

**MongoDB Atlas (Free):**
1. Go to https://www.mongodb.com/cloud/atlas
2. Create free cluster
3. Get connection string
4. Add to `.env` as `MONGODB_URI`

**Cloudinary (Optional):**
1. Go to https://cloudinary.com/users/register/free
2. Get credentials from dashboard
3. Add to `.env`

### 5. Run the application

Development mode:
```bash
# Terminal 1 - Backend
cd server
npm run dev

# Terminal 2 - Frontend
cd client
npm run dev
```

Access the app at: http://localhost:5173

## 🎯 Usage

### For Experienced Professionals:
1. Select "Experienced Professional" type
2. Fill in work experience
3. Add skills and education
4. Click "Enhance with AI"
5. Download PDF

### For Students/Freshers:
1. Select "Student/Fresher" type
2. Focus on Projects section (most important!)
3. Add skills and education
4. Click "Enhance with AI"
5. Download PDF

## 📝 Features in Detail

### AI Enhancement
- Rewrites professional summary
- Creates action-oriented bullet points
- Organizes skills by category
- Enhances project descriptions
- Optimizes for ATS systems

### Resume Types
- **Experienced**: Focus on work experience and achievements
- **Fresher**: Emphasis on projects, skills, and education

### Payment System
- Free tier: 5 resume generations, 1 portfolio
- Starter: NPR 600/month - 20 resumes, 3 portfolios
- Pro: NPR 1800/month - Unlimited resumes, 10 portfolios
- Mock payment mode for development

## 🚀 Deployment

### Deploy to Render (Recommended)

**Quick Deploy (15 minutes):**
1. Push code to GitHub
2. Follow `QUICK_DEPLOY.md`
3. Use Render Blueprint for automatic deployment

**Detailed Instructions:**
- See `DEPLOYMENT_GUIDE.md` for comprehensive guide
- See `DEPLOYMENT_CHECKLIST.md` for systematic approach
- See `DEPLOYMENT_SUMMARY.md` for overview

**What you need:**
- MongoDB Atlas account (free)
- Cloudinary account (free)
- Render account (free)
- API keys (Gemini/OpenAI)

**Deployment files included:**
- `render.yaml` - Automatic deployment configuration
- Complete deployment guides
- Environment variable templates

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📄 License

MIT License

## 👨‍💻 Author

Built with ❤️ by Bibek Bhandari

## 🙏 Acknowledgments

- Google Gemini 2.0 for AI capabilities
- eSewa for payment gateway
- Cloudinary for image storage
