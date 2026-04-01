# SEO-Vision Setup & Configuration Guide

## Complete Step-by-Step Setup Instructions

### 🔧 Prerequisites Installation

1. **Install Node.js** (v18 or higher)
   - Download from https://nodejs.org
   - Verify installation: `node --version && npm --version`

2. **Install Git**
   - Download from https://git-scm.com
   - Verify installation: `git --version`

3. **MongoDB Setup**
   - Create free MongoDB Atlas account: https://www.mongodb.com/cloud/atlas
   - Create a cluster and get your connection string
   - Save the connection string for later

4. **Clerk Authentication Setup**
   - Create Clerk account: https://dashboard.clerk.com/sign-up
   - Create new application
   - Get your Publishable Key and Secret Key

---

## 📝 Environment Configuration

### Step 1: Create Root `.env` File

In `c:\Projects\SEO-Analyzer-Tool\.env`:

```env
# MongoDB Atlas Connection String
MONGODB_URI=mongodb+srv://username:password@cluster0.xxxxx.mongodb.net/seo-vision?retryWrites=true&w=majority

# Clerk Keys (from Clerk Dashboard)
CLERK_SECRET_KEY=sk_test_your_secret_key_here
VITE_CLERK_PUBLISHABLE_KEY=pk_test_your_public_key_here

# Server Configuration
PORT=5000
NODE_ENV=development
```

### Step 2: Create Frontend `.env.local` File

In `c:\Projects\SEO-Analyzer-Tool\frontend\.env.local`:

```env
# Only Publishable Key needed for frontend
VITE_CLERK_PUBLISHABLE_KEY=pk_test_your_public_key_here
```

### Getting Your Keys

#### MongoDB Connection String:
1. Go to MongoDB Atlas: https://cloud.mongodb.com
2. Select your cluster
3. Click "Connect"
4. Choose "Drivers" → Node.js
5. Copy the connection string
6. Replace `<password>` with your database password

#### Clerk Keys:
1. Go to Clerk Dashboard: https://dashboard.clerk.com
2. Select your application
3. Go to "Developers" → "API Keys"
4. Copy Publishable Key and Secret Key

---

## 🚀 Installation Steps

### Step 1: Install Dependencies

```bash
cd c:\Projects\SEO-Analyzer-Tool

# Install backend dependencies
npm install

# Install frontend dependencies
cd frontend
npm install
cd ..
```

### Step 2: Verify Installation

```bash
# Check MongoDB connection (from backend)
node -e "const mongoose = require('mongoose'); mongoose.connect(process.env.MONGODB_URI).then(() => console.log('✅ MongoDB Connected')).catch(e => console.log('❌ MongoDB Error:', e.message))"
```

---

## 🎯 Running the Application

### Option 1: Run Both Servers (Recommended)

```bash
npm run dev
```

This starts:
- ✅ Backend on http://localhost:5000
- ✅ Frontend on http://localhost:3000

### Option 2: Run Servers Separately

**Terminal 1 - Backend:**
```bash
npm run server
```

**Terminal 2 - Frontend:**
```bash
cd frontend
npm start
```

---

## 🔐 Configuring Clerk Authentication

### 1. Set Up Allowed Redirect URLs

1. Go to Clerk Dashboard
2. Select your application
3. Go to "Session Settings" → "Redirect URLs"
4. Add these URLs:
   - `http://localhost:3000` (development)
   - `http://localhost:3000/dashboard` (after sign-in)
   - Your production domain (if deployed)

### 2. Configure API Endpoints

1. In Clerk Dashboard → "API Keys"
2. Copy the Secret Key to `.env` as `CLERK_SECRET_KEY`
3. Copy the Publishable Key to `frontend/.env.local` as `VITE_CLERK_PUBLISHABLE_KEY`

### 3. Create a Test User

1. Go to Clerk Dashboard → "Users"
2. Click "Add User"
3. Create a test account
4. Use these credentials to sign in to the app

---

## 💾 MongoDB Configuration

### 1. Create a Collection

The application automatically creates the following collection:

```
Database: seo-vision
Collections:
  - audits (stores SEO audit data)
```

### 2. Create Indexes for Performance

In MongoDB Atlas:
1. Go to your cluster
2. Click "Collections"
3. Select `seo-vision` database
4. Click on `audits` collection
5. Go to "Indexes"
6. MongoDB creates necessary indexes automatically

### 3. Setting Up MongoDB Atlas

#### Free Tier Setup:
1. Create MongoDB Atlas account
2. Create a M0 free cluster
3. Create a database user:
   - Username: your_username
   - Password: strong_password
4. Get connection string:
   - Format: `mongodb+srv://username:password@cluster0.xxxxx.mongodb.net/seo-vision?retryWrites=true&w=majority`

#### Network Access:
1. Go to "Network Access"
2. Add your IP address (or 0.0.0.0/0 for development)
3. Save

---

## 🧪 Testing the Application

### 1. Start the Application

```bash
npm run dev
```

### 2. Access the Landing Page

Open http://localhost:3000 in your browser

### 3. Sign Up / Sign In

- Click "Get Started" or "Sign In"
- Use Clerk's authentication UI
- If using test account from Clerk Dashboard, use those credentials

### 4. Test SEO Audit

1. Go to Dashboard
2. Enter a URL (e.g., `https://example.com`)
3. Click "Scan"
4. Wait for results

### 5. Check Audit History

1. Navigate to "History" from sidebar
2. View all previous audits
3. Click on any audit to view details

---

## 🌓 Testing Dark/Light Mode

1. Look for sun/moon icon in sidebar
2. Click to toggle theme
3. Refresh page to verify theme persists

---

## 📊 Testing API Endpoints

### Using curl or Postman:

#### 1. Get Clerk Token (for authentication)
```bash
# First sign in through the UI and get your token from browser console:
# In browser DevTools Console:
# const token = await window.__sessionToken();
```

#### 2. Test Protected endpoints
```bash
# Test v1/audit endpoint
curl -X POST http://localhost:5000/api/v1/audit \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"url": "https://example.com"}'

# View your audits
curl http://localhost:5000/api/v1/audits \
  -H "Authorization: Bearer YOUR_TOKEN"

# View dashboard summary
curl http://localhost:5000/api/v1/dashboard \
  -H "Authorization: Bearer YOUR_TOKEN"
```

---

## 🐛 Troubleshooting

### Issue: "Cannot find module '@clerk/express'"
**Solution:**
```bash
npm install @clerk/express
```

### Issue: MongoDB Connection Refused
**Solution:**
1. Check your connection string in `.env`
2. Verify MongoDB Atlas cluster is running
3. Check IP whitelist in MongoDB Atlas
4. Ensure database user has correct credentials

### Issue: "Clerk Publishable Key undefined"
**Solution:**
1. Verify `VITE_CLERK_PUBLISHABLE_KEY` is in `frontend/.env.local`
2. Do NOT commit .env files to git
3. Restart the frontend server after adding .env variables

### Issue: Port 3000 or 5000 already in use
**Solution:**
```bash
# Windows: Kill process using port
netstat -ano | findstr :5000
taskkill /PID <PID> /F

# macOS/Linux: Kill process using port
lsof -i :5000
kill -9 <PID>
```

### Issue: Blank page after login
**Solution:**
1. Check browser console for errors
2. Verify frontend and backend are running
3. Check network tab for API call failures
4. Clear browser cache and cookies

---

## 📈 Performance Optimization

### For Development:
- Keep concurrent servers running (`npm run dev`)
- Use browser DevTools for debugging
- Monitor MongoDB usage

### For Production:
- Enable MongoDB Atlas encryption
- Set up rate limiting in Express
- Deploy on a CDN
- Use environment-specific configurations

---

## 🚀 Deployment Guide

### Deploying to Heroku (Backend)

```bash
# 1. Install Heroku CLI
# https://devcenter.heroku.com/articles/heroku-cli

# 2. Login
heroku login

# 3. Create app
heroku create your-app-name

# 4. Set environment variables
heroku config:set MONGODB_URI=your_mongodb_uri
heroku config:set CLERK_SECRET_KEY=your_clerk_secret_key
heroku config:set NODE_ENV=production

# 5. Deploy
git push heroku main

# 6. View logs
heroku logs --tail
```

### Deploying to Vercel (Frontend)

```bash
# 1. Install Vercel CLI
npm install -g vercel

# 2. Deploy
vercel

# 3. Add environment variables in Vercel dashboard
# Set VITE_CLERK_PUBLISHABLE_KEY
```

---

## 📝 Important Notes

- **Never commit `.env` files** to git
- **Keep Clerk Secret Key private** - never share it
- **MongoDB backup regularly** - set up Atlas backups
- **Test on staging** before production
- **Monitor API usage** on Clerk dashboard
- **Set up alert rules** on MongoDB Atlas

---

## 🆘 Quick Help

### Check if ports are accessible:
```bash
# Backend
curl http://localhost:5000/health

# Frontend should load at
http://localhost:3000
```

### Verify all dependencies:
```bash
npm list
cd frontend && npm list && cd ..
```

### View Clerk logs:
- Go to Clerk Dashboard
- Check "Logs" section for authentication events

### View MongoDB logs:
- Go to MongoDB Atlas cluster
- Check "Activity" section for connection logs

---

## 📚 Additional Resources

- **Clerk Documentation**: https://clerk.com/docs
- **MongoDB Atlas Guide**: https://docs.atlas.mongodb.com
- **Express.js**: https://expressjs.com
- **React Documentation**: https://react.dev
- **Tailwind CSS**: https://tailwindcss.com

---

## ✅ Checklist

- [ ] Node.js v18+ installed
- [ ] MongoDB Atlas account created
- [ ] Clerk account created
- [ ] `.env` file configured with MongoDB URI
- [ ] `.env` file configured with Clerk keys
- [ ] `frontend/.env.local` configured with Clerk Publishable Key
- [ ] Dependencies installed (`npm install`)
- [ ] Backend starts without errors
- [ ] Frontend starts without errors
- [ ] Can sign up/login through Clerk
- [ ] Can perform SEO audit
- [ ] Dark/Light mode works
- [ ] Audit history loads data

---

**You're all set! 🎉 Start building with SEO-Vision!**
