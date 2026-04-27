require('dotenv').config();
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const mongoose = require('mongoose');
const { clerkMiddleware, getAuth } = require('@clerk/express');

const auditController = require('./controllers/auditController');
const { assertUrlIsPublic } = require('./utils/urlGuard');

const app = express();

// Log all environment variables on startup
console.log('🔧 Environment Configuration:');
console.log(`- NODE_ENV: ${process.env.NODE_ENV || 'development'}`);
console.log(`- PORT: ${process.env.PORT || 5000}`);
console.log(`- MONGODB_URI: ${process.env.MONGODB_URI ? '✅ Configured' : '❌ Not set'}`);
console.log(`- CLERK_SECRET_KEY: ${process.env.CLERK_SECRET_KEY ? '✅ Configured' : '❌ Not set'}`);
console.log(`- FRONTEND_URL: ${process.env.FRONTEND_URL || 'Not set (will use localhost)'}`);
console.log('');

app.set('trust proxy', 1);
app.use(helmet());

const allowedOrigins = [
  'http://localhost:3000',
  'http://localhost:3001',
  'http://localhost:3002',
  process.env.FRONTEND_URL,
].filter(Boolean);

app.use(cors({
  origin(origin, callback) {
    if (!origin) return callback(null, true);
    if (allowedOrigins.includes(origin)) return callback(null, true);
    return callback(new Error(`Origin ${origin} not allowed by CORS`));
  },
  credentials: true,
}));
app.use(express.json({ limit: '32kb' }));

const clerkAuth = clerkMiddleware({
  secretKey: process.env.CLERK_SECRET_KEY,
  publishableKey: process.env.CLERK_PUBLISHABLE_KEY,
});

const auditLimiter = rateLimit({
  windowMs: 60 * 60 * 1000,
  max: 20,
  standardHeaders: true,
  legacyHeaders: false,
  // Auth middleware runs first, so req.auth.userId is always set here.
  keyGenerator: (req) => req.auth.userId,
  message: { error: 'Too many audits this hour. Try again later.' },
});

// Resolve the real Clerk user ID for the request, or 401 if unauthenticated.
const authMiddleware = (req, res, next) => {
  const { userId } = getAuth(req);
  if (!userId) {
    return res.status(401).json({ error: 'Unauthorized' });
  }
  req.auth = { userId };
  next();
};

// MongoDB Connection
mongoose
  .connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/seo-vision')
  .then(() => {
    console.log('✅ MongoDB connected successfully');
  })
  .catch((err) => {
    console.error('❌ MongoDB connection error:', err.message);
    // Continue running even if MongoDB fails (for development)
  });

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ 
    status: 'Backend is running!',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'development'
  });
});

// =====================
// 🔐 PROTECTED ROUTES - Enterprise Audit API
// =====================

const v1Router = express.Router();

v1Router.post('/audit', auditLimiter, async (req, res) => {
  try {
    const userId = req.auth.userId;

    const { url } = req.body || {};
    if (!url || typeof url !== 'string' || url.length > 2048) {
      return res.status(400).json({ error: 'A valid URL (≤2048 chars) is required' });
    }

    try {
      await assertUrlIsPublic(url);
    } catch (guardErr) {
      return res.status(400).json({ error: guardErr.message });
    }

    const result = await auditController.performAudit(userId, url);
    res.json(result);
  } catch (error) {
    console.error('Audit error:', error);
    const status = error.status || 500;
    res.status(status).json({ error: error.message || 'Audit failed' });
  }
});

// Get user's audit history
v1Router.get('/audits', async (req, res) => {
  try {
    const userId = req.auth.userId;
    if (!userId) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    const limit = parseInt(req.query.limit) || 50;
    const audits = await auditController.getUserAudits(userId, limit);
    
    res.json({
      total: audits.length,
      audits,
    });
  } catch (error) {
    console.error('History fetch error:', error);
    res.status(500).json({ error: 'Failed to fetch audit history' });
  }
});

// Get specific audit
v1Router.get('/audits/:id', async (req, res) => {
  try {
    const userId = req.auth.userId;
    if (!userId) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    const audit = await auditController.getAuditById(req.params.id, userId);
    res.json(audit);
  } catch (error) {
    const status = error.status || 500;
    res.status(status).json({ error: error.message });
  }
});

// Delete audit
v1Router.delete('/audits/:id', async (req, res) => {
  try {
    const userId = req.auth.userId;
    if (!userId) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    const result = await auditController.deleteAudit(req.params.id, userId);
    res.json(result);
  } catch (error) {
    const status = error.status || 500;
    res.status(status).json({ error: error.message });
  }
});

// Get dashboard summary
v1Router.get('/dashboard', async (req, res) => {
  try {
    const userId = req.auth.userId;
    if (!userId) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    const Audit = mongoose.model('Audit');
    
    const totalAudits = await Audit.countDocuments({ userId });
    const averageScore = await Audit.aggregate([
      { $match: { userId } },
      { $group: { _id: null, avgScore: { $avg: '$seoScore' } } }
    ]);

    const recentAudits = await Audit.find({ userId })
      .sort({ createdAt: -1 })
      .limit(5)
      .lean();

    res.json({
      totalAudits,
      averageScore: averageScore[0]?.avgScore || 0,
      recentAudits,
    });
  } catch (error) {
    console.error('Dashboard error:', error);
    res.status(500).json({ error: 'Failed to fetch dashboard data' });
  }
});

// Mount Clerk + auth only on protected routes so /health stays public.
app.use('/api/v1', clerkAuth, authMiddleware, v1Router);

const PORT = process.env.PORT || 5000;

const server = app.listen(PORT, () => {
  console.log(`\n✅ SEO-Vision Backend is running!`);
  console.log(`📍 Server URL: ${process.env.FRONTEND_URL || `http://localhost:${PORT}`}`);
  console.log(`📊 Dashboard API: http://localhost:${PORT}/api/v1/dashboard`);
  console.log(`🔍 Audit API: http://localhost:${PORT}/api/v1/audit`);
  console.log(`❤️  Health Check: http://localhost:${PORT}/health`);
  console.log('');
});

// Handle server errors
server.on('error', (error) => {
  console.error('❌ Server Error:', error);
  process.exit(1);
});

// Graceful shutdown
process.on('SIGINT', () => {
  console.log('\n📴 Shutting down gracefully...');
  server.close(() => {
    console.log('✅ Server closed');
    process.exit(0);
  });
});
