const mongoose = require('mongoose');

const auditSchema = new mongoose.Schema(
  {
    userId: {
      type: String,
      required: true,
      index: true,
    },
    url: {
      type: String,
      required: true,
      index: true,
    },
    title: String,
    metaDescription: String,
    h1Count: Number,
    duplicateH1s: [String],
    imagesWithoutAlt: [
      {
        src: String,
        alt: String,
      },
    ],
    keywordDensity: {
      keyword: String,
      density: Number,
    },
    seoScore: {
      type: Number,
      min: 0,
      max: 100,
    },
    performanceData: {
      lcp: Number, // Largest Contentful Paint in ms
      fcp: Number, // First Contentful Paint in ms
      clsScore: Number, // Cumulative Layout Shift
      speedScore: Number, // 0-100
    },
    securityStatus: {
      isHttps: Boolean,
      hasSslCertificate: Boolean,
    },
    contentAnalysis: {
      wordCount: Number,
      readabilityScore: Number,
      keywordCount: Number,
      metaLength: Number,
      titleLength: Number,
    },
    robotsAllowed: Boolean,
    lastScannedAt: {
      type: Date,
      default: Date.now,
      index: true,
    },
    createdAt: {
      type: Date,
      default: Date.now,
      index: true,
    },
  },
  { timestamps: true }
);

// Index for efficient caching lookups
auditSchema.index({ userId: 1, url: 1, lastScannedAt: -1 });
// Index for the history listing query: find({ userId }).sort({ createdAt: -1 })
auditSchema.index({ userId: 1, createdAt: -1 });

module.exports = mongoose.model('Audit', auditSchema);
