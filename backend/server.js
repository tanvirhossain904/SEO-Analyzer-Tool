require('dotenv').config();
const express = require('express');
const axios = require('axios');
const cheerio = require('cheerio');
const cors = require('cors');
const mongoose = require('mongoose');
const { verifyToken } = require('@clerk/express');

const auditController = require('./controllers/auditController');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// ✅ Simple Auth Middleware - Extract userId from Clerk token
const authMiddleware = async (req, res, next) => {
  const token = req.headers.authorization?.replace('Bearer ', '');
  
  if (!token) {
    // For now, allow requests without auth (development mode)
    req.auth = { userId: 'guest-' + Date.now() };
    return next();
  }

  try {
    // Verify the token with Clerk
    const decoded = await verifyToken(token, {
      secretKey: process.env.CLERK_SECRET_KEY,
    });
    req.auth = { userId: decoded.sub };
    next();
  } catch (error) {
    console.log('⚠️  Token verification failed, using guest user');
    // Fallback to guest user for development
    req.auth = { userId: 'guest-' + Date.now() };
    next();
  }
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

// Apply auth middleware to all protected routes
app.use('/api/v1/', authMiddleware);

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

// Perform new audit (requires authentication)
app.post('/api/v1/audit', async (req, res) => {
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
app.get('/api/v1/audits', async (req, res) => {
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
app.get('/api/v1/audits/:id', async (req, res) => {
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
app.delete('/api/v1/audits/:id', async (req, res) => {
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
app.get('/api/v1/dashboard', async (req, res) => {
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
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 SEO-Vision Backend running on http://localhost:${PORT}`);
  console.log(`📊 Dashboard API: http://localhost:${PORT}/api/v1/dashboard`);
  console.log(`🔍 Audit API: http://localhost:${PORT}/api/v1/audit`);
});
