require('dotenv').config();
const express = require('express');
const axios = require('axios');
const cheerio = require('cheerio');
const cors = require('cors');
const mongoose = require('mongoose');

const auditController = require('./controllers/auditController');

const app = express();

// Middleware
const allowedOrigins = [
  'http://localhost:3000',
  'http://localhost:3002',
  'http://localhost:3001',
  'https://*.vercel.app', // Will match any Vercel deployment
  process.env.FRONTEND_URL, // For production frontend URL
];

app.use(cors({
  origin: function (origin, callback) {
    // Allow requests with no origin (like mobile apps or curl requests)
    if (!origin) return callback(null, true);
    
    // Check if origin matches allowed patterns
    const isAllowed = allowedOrigins.some(allowed => {
      if (allowed.includes('*')) {
        const pattern = allowed.replace('*.', '').replace('*', '.*');
        return new RegExp(pattern).test(origin);
      }
      return origin === allowed;
    });
    
    if (isAllowed) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true
}));
app.use(express.json());

// ✅ Simple Auth Middleware - Extract userId from Clerk token or use guest
const authMiddleware = (req, res, next) => {
  const token = req.headers.authorization?.replace('Bearer ', '');
  
  // For development, assign a guest user ID if no token is provided
  if (!token) {
    req.auth = { userId: 'guest-' + Math.random().toString(36).substr(2, 9) };
    return next();
  }

  // In production, you would verify the token with Clerk here
  // For now, we'll extract a user ID from the token or use guest
  try {
    // Decode the token (in production, properly verify it)
    req.auth = { userId: token.substring(0, 20) || 'user-' + Date.now() };
  } catch (error) {
    req.auth = { userId: 'guest-' + Math.random().toString(36).substr(2, 9) };
  }
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
// ✅ LEGACY ENDPOINT (for backward compatibility)
// =====================
app.post('/api/audit', async (req, res) => {
  const { url } = req.body;

  if (!url) {
    return res.status(400).json({ error: 'URL is required' });
  }

  try {
    const { data } = await axios.get(url, {
      timeout: 10000,
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
      }
    });

    const $ = cheerio.load(data);

    const audit = {
      title: $('title').text() || 'No title found',
      description: $('meta[name="description"]').attr('content') || 'No description found',
      h1Count: $('h1').length,
      imagesWithoutAlt: []
    };

    $('img').each((i, el) => {
      const alt = $(el).attr('alt');
      if (!alt || alt.trim() === '') {
        const src = $(el).attr('src');
        if (src) {
          audit.imagesWithoutAlt.push(src);
        }
      }
    });

    res.json(audit);
  } catch (error) {
    console.error('Error:', error.message);
    
    let errorMessage = 'Failed to audit the URL.';
    
    if (error.code === 'ENOTFOUND') {
      errorMessage = 'Domain not found. Please check the URL and try again.';
    } else if (error.code === 'ECONNREFUSED') {
      errorMessage = 'Connection refused. Please check the URL.';
    } else if (error.code === 'ECONNABORTED') {
      errorMessage = 'Request timeout. The website took too long to respond.';
    } else if (error.response?.status === 404) {
      errorMessage = 'Website returned 404 (Not Found).';
    } else if (error.response?.status === 403) {
      errorMessage = 'Access to this website is blocked or restricted.';
    }
    
    res.status(500).json({ error: errorMessage });
  }
});

// =====================
// 🔐 PROTECTED ROUTES - Enterprise Audit API
// =====================

// Create a router for v1 API
const v1Router = express.Router();

// Perform new audit (requires authentication)
v1Router.post('/audit', async (req, res) => {
  try {
    const userId = req.auth.userId;
    if (!userId) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    const { url } = req.body;
    if (!url) {
      return res.status(400).json({ error: 'URL is required' });
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

// Start server
// Mount the v1 router with auth middleware
app.use('/api/v1', authMiddleware, v1Router);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 SEO-Vision Backend running on http://localhost:${PORT}`);
  console.log(`📊 Dashboard API: http://localhost:${PORT}/api/v1/dashboard`);
  console.log(`🔍 Audit API: http://localhost:${PORT}/api/v1/audit`);
});
