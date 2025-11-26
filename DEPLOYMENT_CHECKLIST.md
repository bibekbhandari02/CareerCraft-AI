# ✅ Deployment Checklist

Use this checklist to ensure smooth deployment to Render.

## 📝 Pre-Deployment

### Code Preparation
- [ ] All code is committed to Git
- [ ] `.env` files are in `.gitignore`
- [ ] `render.yaml` is in repository root
- [ ] All dependencies are in `package.json`
- [ ] Build commands work locally (`npm run build` in client folder)

### Test Locally
- [ ] Backend starts without errors (`cd server && npm start`)
- [ ] Frontend builds successfully (`cd client && npm run build`)
- [ ] Database connection works
- [ ] Image uploads work (Cloudinary)
- [ ] AI features work (if enabled)

## 🔑 Required Accounts & Keys

### MongoDB Atlas
- [ ] Account created
- [ ] Free cluster created
- [ ] Database user created
- [ ] IP whitelist set to `0.0.0.0/0`
- [ ] Connection string copied

### Cloudinary
- [ ] Account created
- [ ] Cloud name copied
- [ ] API key copied
- [ ] API secret copied

### Render
- [ ] Account created
- [ ] GitHub/GitLab connected
- [ ] Payment method added (even for free tier)

### Optional Services
- [ ] OpenAI API key (for AI features)
- [ ] Gemini API key (alternative to OpenAI)
- [ ] eSewa credentials (for payments)

## 🚀 Deployment Steps

### 1. Push to Repository
- [ ] Code pushed to GitHub/GitLab
- [ ] Repository is public or Render has access

### 2. Create Services on Render
- [ ] Blueprint deployed OR
- [ ] Backend service created manually
- [ ] Frontend service created manually

### 3. Configure Backend
- [ ] `MONGODB_URI` added
- [ ] `JWT_SECRET` added (32+ random characters)
- [ ] `SESSION_SECRET` added (32+ random characters)
- [ ] `CLOUDINARY_CLOUD_NAME` added
- [ ] `CLOUDINARY_API_KEY` added
- [ ] `CLOUDINARY_API_SECRET` added
- [ ] `NODE_ENV` set to `production`
- [ ] `CLIENT_URL` added (frontend URL)
- [ ] Optional: `OPENAI_API_KEY` added
- [ ] Optional: `GEMINI_API_KEY` added
- [ ] Optional: `ESEWA_MERCHANT_ID` added
- [ ] Optional: `ESEWA_SECRET_KEY` added

### 4. Configure Frontend
- [ ] `VITE_API_URL` added (backend URL + `/api`)

### 5. Deploy
- [ ] Backend deployed successfully
- [ ] Frontend deployed successfully
- [ ] Both services show "Live" status

## ✅ Post-Deployment Testing

### Basic Functionality
- [ ] Frontend loads without errors
- [ ] Can access homepage
- [ ] Can navigate between pages

### Authentication
- [ ] Can register new account
- [ ] Can login
- [ ] Can logout
- [ ] Session persists on refresh

### Portfolio Features
- [ ] Can create new portfolio
- [ ] Can upload logo
- [ ] Can upload profile picture
- [ ] Can add content (hero, about, skills, projects)
- [ ] Can save draft
- [ ] Can publish portfolio
- [ ] Published portfolio is accessible via subdomain URL
- [ ] Portfolio displays correctly

### Resume Features
- [ ] Can create new resume
- [ ] Can fill in resume sections
- [ ] Can generate PDF
- [ ] PDF downloads correctly

### AI Features (if enabled)
- [ ] AI content generation works
- [ ] AI suggestions appear
- [ ] No API errors in console

### Image Uploads
- [ ] Logo uploads successfully
- [ ] Profile picture uploads successfully
- [ ] Project images upload successfully
- [ ] Images display correctly
- [ ] Images are accessible via Cloudinary URLs

## 🐛 Troubleshooting Checklist

### If Backend Won't Start
- [ ] Check Render logs for errors
- [ ] Verify MongoDB connection string
- [ ] Verify all required environment variables are set
- [ ] Check MongoDB Atlas IP whitelist
- [ ] Verify database user credentials

### If Frontend Won't Load
- [ ] Check build logs in Render
- [ ] Verify `VITE_API_URL` is correct
- [ ] Check browser console for errors
- [ ] Verify static site publish directory is `client/dist`

### If API Calls Fail
- [ ] Check browser Network tab
- [ ] Verify CORS settings
- [ ] Check `CLIENT_URL` matches frontend URL exactly
- [ ] Verify `withCredentials: true` in API config
- [ ] Check backend logs for errors

### If Images Won't Upload
- [ ] Verify Cloudinary credentials
- [ ] Check Cloudinary dashboard for errors
- [ ] Verify file size limits
- [ ] Check backend logs for upload errors

### If AI Features Don't Work
- [ ] Verify API key is correct
- [ ] Check API key has credits/quota
- [ ] Check backend logs for API errors
- [ ] Verify API endpoint is accessible

## 📊 Performance Checklist

### Free Tier Considerations
- [ ] Understand 15-minute spin-down
- [ ] First request may take 30-60 seconds
- [ ] Consider upgrade for production use

### Optimization
- [ ] Images are optimized (Cloudinary handles this)
- [ ] Frontend is minified (Vite handles this)
- [ ] No console errors in production
- [ ] No unnecessary API calls

## 🔒 Security Checklist

### Environment Variables
- [ ] No secrets in code
- [ ] `.env` files not committed
- [ ] Strong JWT_SECRET (32+ characters)
- [ ] Strong SESSION_SECRET (32+ characters)

### API Keys
- [ ] API keys are private
- [ ] API keys have usage limits set
- [ ] Monitoring enabled for API usage

### Database
- [ ] Database user has strong password
- [ ] Only necessary IPs whitelisted (or 0.0.0.0/0 for Render)
- [ ] Regular backups enabled (MongoDB Atlas)

## 📈 Monitoring

### After Deployment
- [ ] Check Render dashboard regularly
- [ ] Monitor MongoDB Atlas usage
- [ ] Monitor Cloudinary usage
- [ ] Monitor API key usage (OpenAI/Gemini)
- [ ] Check for errors in logs

### User Feedback
- [ ] Test with real users
- [ ] Collect feedback
- [ ] Monitor for issues
- [ ] Plan improvements

## 🎉 Launch Checklist

### Before Public Launch
- [ ] All features tested
- [ ] No critical bugs
- [ ] Performance is acceptable
- [ ] Documentation is ready
- [ ] Support plan in place

### Launch Day
- [ ] Announce to users
- [ ] Monitor closely
- [ ] Be ready to fix issues
- [ ] Collect user feedback

## 📝 Notes

**Deployment Date:** _______________

**Backend URL:** _______________

**Frontend URL:** _______________

**Issues Encountered:**
- 
- 
- 

**Resolutions:**
- 
- 
- 

---

**Remember:** First deployment takes 10-15 minutes. Be patient! ⏱️
