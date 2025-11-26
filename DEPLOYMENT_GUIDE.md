# 🚀 Deployment Guide - Render

This guide will help you deploy your Portfolio Builder to Render.

## 📋 Prerequisites

1. A [Render account](https://render.com) (free tier available)
2. A [MongoDB Atlas](https://www.mongodb.com/cloud/atlas) account (free tier available)
3. Your project pushed to a Git repository (GitHub, GitLab, or Bitbucket)
4. API keys for:
   - Cloudinary (for image uploads)
   - OpenAI or Google Gemini (for AI features)
   - eSewa (for payments - optional)

## 🗄️ Step 1: Set Up MongoDB Atlas

1. Go to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Create a free cluster
3. Create a database user with password
4. Whitelist all IP addresses (0.0.0.0/0) for Render access
5. Get your connection string (looks like: `mongodb+srv://username:password@cluster.mongodb.net/dbname`)

## 🔧 Step 2: Prepare Your Repository

1. Make sure all your code is committed:
   ```bash
   git add .
   git commit -m "Prepare for deployment"
   git push origin main
   ```

2. Ensure these files are in your repository:
   - `render.yaml` (already created)
   - `server/.env.example`
   - `client/.env.example`

## 🌐 Step 3: Deploy Backend (API)

### Option A: Using Blueprint (Recommended)

1. Go to [Render Dashboard](https://dashboard.render.com/)
2. Click **"New +"** → **"Blueprint"**
3. Connect your Git repository
4. Render will detect `render.yaml` and show both services
5. Click **"Apply"**

### Option B: Manual Setup

1. Go to [Render Dashboard](https://dashboard.render.com/)
2. Click **"New +"** → **"Web Service"**
3. Connect your Git repository
4. Configure:
   - **Name**: `portfolio-builder-api`
   - **Region**: Choose closest to you
   - **Branch**: `main`
   - **Root Directory**: Leave empty
   - **Environment**: `Node`
   - **Build Command**: `cd server && npm install`
   - **Start Command**: `cd server && npm start`
   - **Plan**: Free

5. Add Environment Variables (click "Advanced" → "Add Environment Variable"):

   ```
   NODE_ENV=production
   MONGODB_URI=your_mongodb_connection_string
   JWT_SECRET=your_random_secret_key_here
   SESSION_SECRET=your_random_session_secret_here
   CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
   CLOUDINARY_API_KEY=your_cloudinary_api_key
   CLOUDINARY_API_SECRET=your_cloudinary_api_secret
   OPENAI_API_KEY=your_openai_api_key
   GEMINI_API_KEY=your_gemini_api_key
   ESEWA_MERCHANT_ID=your_esewa_merchant_id
   ESEWA_SECRET_KEY=your_esewa_secret_key
   CLIENT_URL=https://your-frontend-url.onrender.com
   ```

   **Generate secrets:**
   ```bash
   # Generate random secrets (run in terminal)
   node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
   ```

6. Click **"Create Web Service"**
7. Wait for deployment (5-10 minutes)
8. Copy your backend URL (e.g., `https://portfolio-builder-api.onrender.com`)

## 🎨 Step 4: Deploy Frontend (Client)

### Option A: Using Blueprint
If you used Blueprint in Step 3, the frontend is already deploying!

### Option B: Manual Setup

1. Click **"New +"** → **"Static Site"**
2. Connect your Git repository
3. Configure:
   - **Name**: `portfolio-builder-client`
   - **Branch**: `main`
   - **Root Directory**: Leave empty
   - **Build Command**: `cd client && npm install && npm run build`
   - **Publish Directory**: `client/dist`

4. Add Environment Variable:
   ```
   VITE_API_URL=https://your-backend-url.onrender.com/api
   ```
   (Use the backend URL from Step 3)

5. Click **"Create Static Site"**
6. Wait for deployment (5-10 minutes)

## 🔄 Step 5: Update Backend with Frontend URL

1. Go back to your backend service
2. Update the `CLIENT_URL` environment variable with your frontend URL
3. Click **"Save Changes"** (this will redeploy)

## ✅ Step 6: Verify Deployment

1. Visit your frontend URL
2. Try to register a new account
3. Create a portfolio
4. Publish and view it

## 🐛 Troubleshooting

### Backend Issues

**Check logs:**
1. Go to your backend service in Render
2. Click "Logs" tab
3. Look for errors

**Common issues:**
- MongoDB connection: Check your connection string and IP whitelist
- Missing environment variables: Verify all required vars are set
- Build failures: Check Node version compatibility

### Frontend Issues

**Check build logs:**
1. Go to your static site in Render
2. Click "Events" tab
3. Look for build errors

**Common issues:**
- API connection: Verify `VITE_API_URL` is correct
- CORS errors: Check backend `CLIENT_URL` matches frontend URL
- 404 on refresh: Render should handle this automatically with the rewrite rule

### CORS Errors

If you see CORS errors:
1. Make sure `CLIENT_URL` in backend matches your frontend URL exactly
2. Ensure `withCredentials: true` is in `client/src/lib/api.js`
3. Check that backend CORS config includes `credentials: true`

## 🔒 Security Notes

1. **Never commit `.env` files** - they're in `.gitignore`
2. **Use strong secrets** - generate random strings for JWT_SECRET and SESSION_SECRET
3. **Rotate API keys** regularly
4. **Monitor usage** of your API keys (OpenAI, Cloudinary, etc.)

## 💰 Free Tier Limitations

**Render Free Tier:**
- Services spin down after 15 minutes of inactivity
- First request after spin-down takes 30-60 seconds
- 750 hours/month of runtime
- Shared resources

**MongoDB Atlas Free Tier:**
- 512 MB storage
- Shared cluster
- Good for development and small projects

## 🚀 Upgrade Options

For production use, consider:
- **Render Starter Plan** ($7/month) - No spin-down, better performance
- **MongoDB Atlas Dedicated** - Better performance and storage
- **Custom domain** - Add your own domain in Render settings

## 📝 Post-Deployment Checklist

- [ ] Backend is running and accessible
- [ ] Frontend is deployed and loads
- [ ] User registration works
- [ ] Login/logout works
- [ ] Portfolio creation works
- [ ] Image uploads work (Cloudinary)
- [ ] AI generation works
- [ ] Portfolio publishing works
- [ ] Public portfolio URLs work
- [ ] Resume generation works

## 🎉 Success!

Your Portfolio Builder is now live! Share your frontend URL with users.

**Example URLs:**
- Frontend: `https://portfolio-builder-client.onrender.com`
- Backend API: `https://portfolio-builder-api.onrender.com/api`
- User portfolios: `https://portfolio-builder-client.onrender.com/portfolio/:subdomain`

## 📞 Support

If you encounter issues:
1. Check Render logs
2. Review this guide
3. Check Render documentation: https://render.com/docs
4. MongoDB Atlas docs: https://docs.atlas.mongodb.com/

---

**Note:** First deployment may take 10-15 minutes. Subsequent deployments are faster (3-5 minutes).
