# ⚡ Quick Deploy to Render

## 🎯 Fastest Way to Deploy

### 1. Push to GitHub
```bash
git add .
git commit -m "Ready for deployment"
git push origin main
```

### 2. Deploy with Blueprint (Automatic)

1. Go to https://dashboard.render.com/
2. Click **"New +"** → **"Blueprint"**
3. Connect your GitHub repository
4. Render will detect `render.yaml`
5. Click **"Apply"**

### 3. Add Environment Variables

Render will create both services. Add these environment variables to the **backend service**:

#### Required Variables:
```
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/portfolio
JWT_SECRET=generate_random_32_char_string
SESSION_SECRET=generate_random_32_char_string
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
```

#### Optional (for AI features):
```
OPENAI_API_KEY=sk-...
GEMINI_API_KEY=...
```

#### Optional (for payments):
```
ESEWA_MERCHANT_ID=...
ESEWA_SECRET_KEY=...
```

**Generate secrets:**
```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

### 4. Update URLs

After both services deploy:

1. **Backend service** → Add environment variable:
   ```
   CLIENT_URL=https://your-frontend-name.onrender.com
   ```

2. **Frontend service** → Add environment variable:
   ```
   VITE_API_URL=https://your-backend-name.onrender.com/api
   ```

3. Save changes (both will redeploy automatically)

### 5. Done! 🎉

Visit your frontend URL and start using your portfolio builder!

---

## 📦 What You Need Before Deploying

### MongoDB Atlas (Free)
1. Create account: https://www.mongodb.com/cloud/atlas
2. Create free cluster
3. Create database user
4. Whitelist IP: `0.0.0.0/0`
5. Get connection string

### Cloudinary (Free)
1. Create account: https://cloudinary.com/
2. Get credentials from dashboard:
   - Cloud Name
   - API Key
   - API Secret

### OpenAI or Gemini (Optional)
- OpenAI: https://platform.openai.com/api-keys
- Gemini: https://makersuite.google.com/app/apikey

---

## ⏱️ Deployment Time

- **First deployment**: 10-15 minutes
- **Subsequent deployments**: 3-5 minutes
- **Cold start** (free tier): 30-60 seconds

---

## 🆘 Quick Troubleshooting

**Backend won't start?**
- Check MongoDB connection string
- Verify all required environment variables are set
- Check logs in Render dashboard

**Frontend can't connect to backend?**
- Verify `VITE_API_URL` is correct
- Check `CLIENT_URL` in backend matches frontend URL
- Look for CORS errors in browser console

**Images not uploading?**
- Verify Cloudinary credentials
- Check Cloudinary dashboard for errors

---

## 💡 Pro Tips

1. **Use Blueprint** - It's the easiest way to deploy both services
2. **Check logs** - Render has excellent logging
3. **Free tier sleeps** - First request after 15 min takes longer
4. **Custom domain** - Add in Render settings (free)
5. **Auto-deploy** - Enable in Render for automatic deployments on git push

---

**Need detailed instructions?** See `DEPLOYMENT_GUIDE.md`
