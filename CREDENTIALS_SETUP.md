# SEO-Vision: MongoDB & Clerk Setup Guide

## 🚀 Quick Setup (10-15 minutes)

### Step 1: MongoDB Atlas Configuration

#### 1.1 Create a New Project
1. Go to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Sign in to your account
3. Click **"Create"** to create a new project
4. Name it: `seo-vision`
5. Click **"Create Project"**

#### 1.2 Create a Database Cluster
1. Click **"Create"** cluster button
2. Choose **"M0 FREE"** tier (free forever)
3. Select your preferred cloud provider (AWS recommended)
4. Select region closest to you
5. Click **"Create Cluster"** (wait 2-3 minutes)

#### 1.3 Create Database Access Credentials
1. Go to **"Database Access"** (left sidebar)
2. Click **"Add New Database User"**
3. Username: `seo_vision_user`
4. Password: Create a strong password (save this!)
5. Click **"Add User"**

#### 1.4 Set up Network Access
1. Go to **"Network Access"** (left sidebar)
2. Click **"Add IP Address"**
3. Select **"Allow Access from Anywhere"** (for development)
4. Click **"Confirm"**

#### 1.5 Get Your Connection String
1. Go back to **"Clusters"** tab
2. Click **"CONNECT"** button
3. Choose **"Connect your application"**
4. Select **"Node.js"** and version **"4.0 or later"**
5. Copy the connection string
6. Replace `<password>` with your database password from Step 1.3
7. Save this connection string!

**Example format:**
```
mongodb+srv://seo_vision_user:YOUR_PASSWORD@cluster0.xxxxx.mongodb.net/seo-vision?retryWrites=true&w=majority
```

---

### Step 2: Clerk Configuration

#### 2.1 Create a New Application
1. Go to [Clerk Dashboard](https://dashboard.clerk.com)
2. Sign in to your account
3. Click **"Create Application"**
4. Name: `SEO-Vision`
5. Choose **"Sign in with email & password"** (or social login)
6. Click **"Create Application"**

#### 2.2 Get Your API Keys
1. Go to **"API Keys"** section
2. Copy these values:
   - **Publishable Key** (starts with `pk_`)
   - **Secret Key** (starts with `sk_`)

#### 2.3 Configure Allowed URLs
1. Go to **"Domains"** in Clerk Dashboard
2. Add your development URLs:
   - `http://localhost:3000` (Frontend)
   - `http://localhost:5000` (Backend - optional)

---

### Step 3: Update Your Environment Files

#### 3.1 Backend (.env)
Create/update `backend/.env`:
```
# MongoDB
MONGODB_URI=mongodb+srv://seo_vision_user:YOUR_PASSWORD@cluster0.xxxxx.mongodb.net/seo-vision?retryWrites=true&w=majority
DB_NAME=seo-vision

# Clerk
CLERK_SECRET_KEY=sk_test_xxxxxxxxxxxxx
CLERK_PUBLISHABLE_KEY=pk_test_xxxxxxxxxxxxx

# Server
PORT=5000
NODE_ENV=development
```

#### 3.2 Frontend (.env.local)
Create/update `frontend/.env.local`:
```
REACT_APP_CLERK_PUBLISHABLE_KEY=pk_test_xxxxxxxxxxxxx
REACT_APP_API_URL=http://localhost:5000
```

---

### Step 4: Verify Your Configuration

#### 4.1 Test MongoDB Connection
```bash
cd backend
node -e "const mongoose = require('mongoose'); mongoose.connect(process.env.MONGODB_URI).then(() => console.log('✅ MongoDB connected!')).catch(e => console.error('❌ Error:', e.message))"
```

#### 4.2 Test Clerk Keys
```bash
# Check if keys are loaded
cat .env | grep CLERK
```

Expected output:
```
CLERK_SECRET_KEY=sk_test_...
CLERK_PUBLISHABLE_KEY=pk_test_...
```

---

### Step 5: Start Your Application

```bash
# From root directory
npm run dev
```

The application should start with:
- ✅ Backend on `http://localhost:5000`
- ✅ Frontend on `http://localhost:3000`
- ✅ Clerk authentication ready
- ✅ MongoDB connection active

---

### Troubleshooting

| Issue | Solution |
|-------|----------|
| "ECONNREFUSED" | MongoDB URI is incorrect or network access not allowed |
| "Clerk key not found" | Check .env file paths and variable names |
| "Origin not allowed" | Add your URL to Clerk's allowed domains |
| "Cannot find module" | Run `npm install` in frontend and backend |

---

### Next Steps

1. ✅ Update `.env` files with your credentials
2. ✅ Run `npm run dev` to start both servers
3. ✅ Visit `http://localhost:3000` in your browser
4. ✅ Sign up with Clerk
5. ✅ Scan your first website!

Need help? Let me know if you encounter any errors! 🚀
