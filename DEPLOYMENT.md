# 🚀 Deployment Guide

This guide will help you deploy the Hackathon Tracker application to production.

## 📋 Prerequisites

- GitHub account
- Vercel account (for frontend)
- Railway account (for backend)
- Node.js 18+ installed locally

## 🎯 Deployment Steps

### 1. Backend Deployment (Railway)

1. **Push code to GitHub**
   ```bash
   git add .
   git commit -m "Prepare for deployment"
   git push origin main
   ```

2. **Deploy to Railway**
   - Go to [Railway.app](https://railway.app)
   - Sign up/Login with GitHub
   - Click "New Project" → "Deploy from GitHub repo"
   - Select your repository
   - Railway will automatically detect the Node.js app

3. **Configure Environment Variables in Railway**
   - Go to your Railway project dashboard
   - Click on "Variables" tab
   - Add these environment variables:
     ```
     PORT=5000
     NODE_ENV=production
     CORS_ORIGIN=https://your-frontend-url.vercel.app
     ```

4. **Get your Railway URL**
   - Railway will provide a URL like: `https://your-app-name.railway.app`
   - Copy this URL for the frontend configuration

### 2. Frontend Deployment (Vercel)

1. **Update Vercel Configuration**
   - Edit `vercel.json` and replace `https://your-backend-url.railway.app` with your actual Railway URL
   - Edit `env.example` and replace the placeholder URLs with your actual URLs

2. **Deploy to Vercel**
   - Go to [Vercel.com](https://vercel.com)
   - Sign up/Login with GitHub
   - Click "New Project" → "Import Git Repository"
   - Select your repository
   - Configure project:
     - Framework Preset: Vite
     - Build Command: `npm run build`
     - Output Directory: `dist`
     - Install Command: `npm install`

3. **Set Environment Variables in Vercel**
   - In your Vercel project dashboard
   - Go to "Settings" → "Environment Variables"
   - Add:
     ```
     VITE_API_URL=https://your-backend-url.railway.app
     ```

4. **Deploy**
   - Click "Deploy"
   - Vercel will build and deploy your app
   - You'll get a URL like: `https://your-app-name.vercel.app`

### 3. Final Configuration

1. **Update CORS in Railway**
   - Go back to Railway project
   - Update the `CORS_ORIGIN` variable with your Vercel URL

2. **Test the Deployment**
   - Visit your Vercel URL
   - Check if hackathons are loading
   - Test the filter functionality

## 🔧 Alternative Deployment Options

### Option 2: Netlify + Render
- Frontend: Deploy to [Netlify](https://netlify.com)
- Backend: Deploy to [Render](https://render.com)

### Option 3: Full Vercel (with API routes)
- Deploy both frontend and backend to Vercel using their API routes feature

### Option 4: Self-hosted (VPS)
- Use DigitalOcean, AWS EC2, or similar
- Deploy using Docker containers

## 🐛 Troubleshooting

### Common Issues:

1. **CORS Errors**
   - Make sure `CORS_ORIGIN` in Railway matches your frontend URL
   - Check that the backend is running and accessible

2. **API Not Found (404)**
   - Verify the `VITE_API_URL` environment variable is set correctly
   - Check that Railway deployment is successful

3. **Build Failures**
   - Check that all dependencies are in `package.json`
   - Verify TypeScript compilation is successful

4. **Environment Variables Not Working**
   - Make sure environment variables are set in both platforms
   - Restart deployments after changing environment variables

## 📊 Monitoring

- **Vercel**: Check deployment logs in the Vercel dashboard
- **Railway**: Monitor logs and metrics in Railway dashboard
- **Performance**: Use browser dev tools to check API response times

## 🔄 Updates

To update your deployment:
1. Make changes to your code
2. Push to GitHub
3. Both Vercel and Railway will automatically redeploy

## 💰 Cost Estimates

- **Vercel**: Free tier includes 100GB bandwidth/month
- **Railway**: Free tier includes $5 credit/month
- **Total**: ~$0-5/month for small to medium traffic

## 🎉 You're Done!

Your hackathon tracker is now live and accessible to users worldwide!
