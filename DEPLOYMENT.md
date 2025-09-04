# 🚀 Deployment Guide

This guide will help you deploy your AI-Powered Study Notebook to various platforms.

## 📋 Prerequisites

Before deploying, make sure you have:

1. **GitHub Account**: For hosting your code
2. **Environment Variables**: API keys and database credentials
3. **Domain (Optional)**: For custom domain setup

## 🌐 Deployment Options

### 1. **Vercel (Recommended)**

Vercel is the easiest and most popular option for Next.js applications.

#### Step 1: Create GitHub Repository

1. Go to [GitHub](https://github.com) and create a new repository
2. Name it `ai-study-notebook` (or your preferred name)
3. Make it public or private (your choice)
4. Don't initialize with README (we already have one)

#### Step 2: Push to GitHub

```bash
# Add your GitHub repository as remote
git remote add origin https://github.com/YOUR_USERNAME/ai-study-notebook.git

# Push your code
git branch -M main
git push -u origin main
```

#### Step 3: Deploy to Vercel

1. Go to [Vercel](https://vercel.com)
2. Sign up/Login with your GitHub account
3. Click "New Project"
4. Import your `ai-study-notebook` repository
5. Configure environment variables (see below)
6. Click "Deploy"

#### Step 4: Configure Environment Variables

In Vercel dashboard, go to your project → Settings → Environment Variables:

```env
# Database (Required)
TURSO_CONNECTION_URL=your_turso_database_url
TURSO_AUTH_TOKEN=your_turso_auth_token

# OpenAI (Optional, for advanced NLP)
OPENAI_API_KEY=your_openai_api_key

# Next.js
NEXT_PUBLIC_APP_URL=https://your-app.vercel.app
```

### 2. **Netlify**

#### Step 1: Build Settings

```toml
# netlify.toml
[build]
  command = "npm run build"
  publish = ".next"

[build.environment]
  NODE_VERSION = "18"
```

#### Step 2: Deploy

1. Connect your GitHub repository to Netlify
2. Set build command: `npm run build`
3. Set publish directory: `.next`
4. Add environment variables
5. Deploy

### 3. **Railway**

#### Step 1: Connect Repository

1. Go to [Railway](https://railway.app)
2. Connect your GitHub repository
3. Railway will auto-detect Next.js

#### Step 2: Configure

1. Add environment variables
2. Railway will automatically deploy

### 4. **DigitalOcean App Platform**

#### Step 1: Create App

1. Go to DigitalOcean App Platform
2. Create new app from GitHub
3. Select your repository

#### Step 2: Configure

1. Set build command: `npm run build`
2. Set run command: `npm start`
3. Add environment variables

## 🗄️ Database Setup

### Option 1: Turso (Recommended)

1. Go to [Turso](https://turso.tech)
2. Create account and database
3. Get connection URL and auth token
4. Add to environment variables

### Option 2: Local SQLite (Development)

```env
TURSO_CONNECTION_URL=file:./local.db
TURSO_AUTH_TOKEN=dummy
```

### Option 3: Other Databases

You can modify `src/db/index.ts` to use other databases like:
- PostgreSQL
- MySQL
- MongoDB

## 🔑 Environment Variables

### Required Variables

```env
# Database
TURSO_CONNECTION_URL=your_database_url
TURSO_AUTH_TOKEN=your_database_token

# App URL
NEXT_PUBLIC_APP_URL=https://your-domain.com
```

### Optional Variables

```env
# OpenAI (for advanced NLP features)
OPENAI_API_KEY=your_openai_api_key

# Node Environment
NODE_ENV=production
```

## 📱 Custom Domain Setup

### Vercel

1. Go to your project settings
2. Add your domain in "Domains" section
3. Follow DNS configuration instructions
4. Update `NEXT_PUBLIC_APP_URL` to your domain

### Netlify

1. Go to Domain settings
2. Add custom domain
3. Configure DNS records
4. Update environment variables

## 🔧 Post-Deployment

### 1. Database Migration

After deployment, run database migrations:

```bash
# If using Turso CLI
turso db shell your-database-name < drizzle/0000_cynical_fabian_cortez.sql
turso db shell your-database-name < drizzle/0001_slim_marten_broadcloak.sql
turso db shell your-database-name < drizzle/0002_clear_absorbing_man.sql
turso db shell your-database-name < drizzle/0003_goofy_gorgon.sql
```

### 2. Seed Data (Optional)

```bash
# Run seed scripts
npm run db:seed
```

### 3. Test Your Deployment

1. Visit your deployed URL
2. Test the AI layout generation
3. Create a notebook and test functionality
4. Verify all features work correctly

## 🚨 Troubleshooting

### Common Issues

1. **Build Failures**
   - Check Node.js version (18+)
   - Verify all dependencies are installed
   - Check for TypeScript errors

2. **Database Connection Issues**
   - Verify environment variables
   - Check database URL format
   - Ensure database is accessible

3. **API Errors**
   - Check OpenAI API key (if using)
   - Verify API routes are working
   - Check browser console for errors

### Debug Mode

Enable debug mode by setting:

```env
NODE_ENV=development
DEBUG=true
```

## 📊 Monitoring

### Vercel Analytics

1. Enable Vercel Analytics in dashboard
2. Monitor performance and errors
3. Track user interactions

### Error Tracking

Consider adding error tracking services:
- Sentry
- LogRocket
- Bugsnag

## 🔄 Continuous Deployment

### Automatic Deployments

Most platforms support automatic deployments:
- Push to `main` branch → Auto deploy
- Pull requests → Preview deployments
- Branch deployments for testing

### GitHub Actions (Optional)

Create `.github/workflows/deploy.yml`:

```yaml
name: Deploy
on:
  push:
    branches: [main]
jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - name: Deploy to Vercel
        uses: amondnet/vercel-action@v20
        with:
          vercel-token: ${{ secrets.VERCEL_TOKEN }}
          vercel-org-id: ${{ secrets.ORG_ID }}
          vercel-project-id: ${{ secrets.PROJECT_ID }}
```

## 🎉 Success!

Once deployed, your AI-Powered Study Notebook will be live and accessible to users worldwide!

### Next Steps

1. **Share your app**: Share the URL with friends and users
2. **Monitor usage**: Track analytics and user feedback
3. **Iterate**: Make improvements based on user feedback
4. **Scale**: Add more features and optimize performance

---

**Need help?** Check the [README.md](README.md) for more information or open an issue on GitHub.
