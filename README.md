# Inventory Tracker

A mobile-first inventory management app that connects to Google Sheets.

## Local Development

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Run the development server:**
   ```bash
   npm run dev
   ```

3. **Open in browser:**
   Visit `http://localhost:5173`

## Deploy to Vercel

### Option 1: Vercel CLI

1. **Install Vercel CLI:**
   ```bash
   npm install -g vercel
   ```

2. **Deploy:**
   ```bash
   vercel
   ```

3. **Add environment variable:**
   ```bash
   vercel env add VITE_API_URL
   ```
   Then paste your Google Apps Script URL when prompted.

4. **Redeploy with environment variable:**
   ```bash
   vercel --prod
   ```

### Option 2: Vercel Website

1. **Push to GitHub** (if not already)
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git remote add origin <your-github-repo-url>
   git push -u origin main
   ```

2. **Deploy on Vercel:**
   - Go to [vercel.com](https://vercel.com)
   - Click "New Project"
   - Import your GitHub repository
   - Add environment variable:
     - Name: `VITE_API_URL`
     - Value: Your Google Apps Script URL
   - Click "Deploy"

## Environment Variables

The app requires one environment variable:

- `VITE_API_URL` - Your Google Apps Script deployment URL

**Local:** Add to `.env` file (already configured)
**Production:** Add in Vercel dashboard under Project Settings → Environment Variables

## Features

- ✅ Sales entry with invoice management
- ✅ Real-time stock dashboard
- ✅ Sales history tracking
- ✅ Mobile-optimized interface
