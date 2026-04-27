const axios = require('axios');
const cheerio = require('cheerio');
const Audit = require('../models/Audit');
const seoScorer = require('../utils/seoScorer');

// Check if URL is allowed by robots.txt
async function checkRobotsAllowed(url) {
  try {
    const urlObj = new URL(url);
    const robotsUrl = `${urlObj.protocol}//${urlObj.hostname}/robots.txt`;
    
    const response = await axios.get(robotsUrl, { 
      timeout: 5000,
      headers: { 'User-Agent': 'SEO-Vision-Crawler/1.0' }
    });
    
    const robots = response.data;
    // Simple check - in production, use robotsparser library
    const disallowAll = robots.includes('Disallow: /');
    return !disallowAll;
  } catch (error) {
    // If robots.txt doesn't exist or error occurs, assume allowed
    return true;
  }
}

// Get cached audit if available (within 24 hours)
async function getCachedAudit(userId, url) {
  try {
    const twentyFourHoursAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);
    
    const cachedAudit = await Audit.findOne({
      userId,
      url,
      lastScannedAt: { $gte: twentyFourHoursAgo },
    });

    return cachedAudit;
  } catch (error) {
    console.error('Cache lookup error:', error);
    return null;
  }
}

// Extract SEO data from HTML
function extractSeoData(html, url) {
  const $ = cheerio.load(html);
  const urlObj = new URL(url);

  // Extract basic metadata
  const title = $('title').text().trim();
  const metaDescription = $('meta[name="description"]').attr('content') || '';
  const h1Tags = [];
  const h1Count = $('h1').length;

  // Get H1 texts
  $('h1').each((_, el) => {
    h1Tags.push($(el).text().trim());
  });

  // Find duplicate H1s
  const duplicateH1s = h1Tags.filter((h1, index) => h1Tags.indexOf(h1) !== index);

  // Find images without alt tags
  const imagesWithoutAlt = [];
  $('img').each((_, el) => {
    const alt = $(el).attr('alt');
    const src = $(el).attr('src');
    if ((!alt || alt.trim() === '') && src) {
      imagesWithoutAlt.push({
        src: src.startsWith('http') ? src : `${urlObj.origin}${src}`,
        alt: '',
      });
    }
  });

  // Extract text for content analysis
  const bodyText = $('body').text();
  const wordCount = bodyText.split(/\s+/).filter(word => word.length > 0).length;

  // Simple keyword density (most frequent words)
  const words = bodyText.toLowerCase().match(/\b\w+\b/g) || [];
  const wordFreq = {};
  words.forEach(word => {
    if (word.length > 3) {
      wordFreq[word] = (wordFreq[word] || 0) + 1;
    }
  });

  const topKeyword = Object.keys(wordFreq).sort((a, b) => wordFreq[b] - wordFreq[a])[0];
  const keywordDensity = topKeyword
    ? ((wordFreq[topKeyword] / words.length) * 100).toFixed(2)
    : 0;

  // Check HTTPS
  const isHttps = url.startsWith('https');

  return {
    title,
    metaDescription,
    h1Count,
    duplicateH1s,
    imagesWithoutAlt,
    keywordDensity: {
      keyword: topKeyword || 'N/A',
      density: parseFloat(keywordDensity),
    },
    contentAnalysis: {
      wordCount,
      readabilityScore: calculateReadability(bodyText),
      keywordCount: topKeyword ? wordFreq[topKeyword] : 0,
      metaLength: metaDescription.length,
      titleLength: title.length,
    },
    securityStatus: {
      isHttps,
      hasSslCertificate: isHttps,
    },
    performanceData: {
      lcp: 0, // Would be measured via Lighthouse API in production
      fcp: 0,
      clsScore: 0,
      speedScore: 75, // Placeholder
    },
  };
}

// Simple readability score calculation (Flesch Reading Ease)
function calculateReadability(text) {
  const sentences = text.split(/[.!?]+/).length;
  const words = text.split(/\s+/).length;
  const syllables = estimateSyllables(text);

  if (words === 0 || sentences === 0) return 0;

  const score = 206.835 - 1.015 * (words / sentences) - 84.6 * (syllables / words);
  return Math.max(0, Math.min(100, Math.round(score)));
}

// Estimate syllables in text
function estimateSyllables(text) {
  const words = text.match(/\b\w+\b/g) || [];
  let count = 0;

  words.forEach(word => {
    word = word.toLowerCase();
    const syllableCount = word.split(/[aeiouy]/).length - 1;
    count += Math.max(1, syllableCount);
  });

  return count;
}

// Main audit controller
async function performAudit(userId, url) {
  try {
    // Check cache first
    const cachedAudit = await getCachedAudit(userId, url);
    if (cachedAudit) {
      return {
        ...cachedAudit.toObject(),
        cached: true,
        cacheMessage: 'Results from last 24 hours',
      };
    }

    // Check robots.txt
    const robotsAllowed = await checkRobotsAllowed(url);

    // Fetch the page
    const { data } = await axios.get(url, {
      timeout: 10000,
      maxContentLength: 5 * 1024 * 1024, // 5 MB cap on response body
      maxRedirects: 3,
      responseType: 'text',
      headers: {
        'User-Agent': 'SEO-Vision-Crawler/1.0 (Enterprise SEO Platform; +https://seo-vision.io)',
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
        'Accept-Language': 'en-US,en;q=0.5',
      },
    });

    // Extract SEO data
    const seoData = extractSeoData(data, url);

    // Calculate SEO score
    const scoringResult = seoScorer.calculateScore(seoData);

    // Save to database
    const audit = new Audit({
      userId,
      url,
      ...seoData,
      seoScore: scoringResult.score,
      robotsAllowed,
    });

    await audit.save();

    return {
      ...audit.toObject(),
      cached: false,
      score: scoringResult.score,
      grade: scoringResult.grade,
      recommendations: seoScorer.getRecommendations(seoData),
    };
  } catch (error) {
    console.error('Audit error:', error.message);
    throw {
      status: 400,
      message: `Failed to audit URL: ${error.message}`,
    };
  }
}

// Get user's audit history
async function getUserAudits(userId, limit = 50) {
  try {
    const audits = await Audit.find({ userId })
      .sort({ createdAt: -1 })
      .limit(limit)
      .lean();

    return audits;
  } catch (error) {
    console.error('History fetch error:', error);
    throw {
      status: 500,
      message: 'Failed to fetch audit history',
    };
  }
}

// Get single audit by ID
async function getAuditById(auditId, userId) {
  try {
    const audit = await Audit.findOne({ _id: auditId, userId });
    if (!audit) {
      throw {
        status: 404,
        message: 'Audit not found',
      };
    }
    return audit;
  } catch (error) {
    throw error;
  }
}

// Delete audit
async function deleteAudit(auditId, userId) {
  try {
    const result = await Audit.findOneAndDelete({ _id: auditId, userId });
    if (!result) {
      throw {
        status: 404,
        message: 'Audit not found',
      };
    }
    return { message: 'Audit deleted successfully' };
  } catch (error) {
    throw error;
  }
}

module.exports = {
  performAudit,
  getUserAudits,
  getAuditById,
  deleteAudit,
};
