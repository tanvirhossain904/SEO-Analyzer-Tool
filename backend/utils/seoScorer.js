// SEO Scoring Algorithm
// Calculates a score out of 100 based on various SEO factors

class SeoScorer {
  calculateScore(auditData) {
    let score = 100;
    const penalties = {};

    // 1. Title Check (10 points)
    if (!auditData.title) {
      penalties.noTitle = 10;
      score -= 10;
    } else if (auditData.title.length < 30) {
      penalties.shortTitle = 5;
      score -= 5;
    } else if (auditData.title.length > 60) {
      penalties.longTitle = 3;
      score -= 3;
    }

    // 2. Meta Description Check (15 points)
    if (!auditData.metaDescription) {
      penalties.noMetaDescription = 15;
      score -= 15;
    } else if (auditData.metaDescription.length < 120) {
      penalties.shortMetaDescription = 8;
      score -= 8;
    } else if (auditData.metaDescription.length > 160) {
      penalties.longMetaDescription = 5;
      score -= 5;
    }

    // 3. H1 Tags Check (15 points)
    if (auditData.h1Count === 0) {
      penalties.noH1 = 15;
      score -= 15;
    } else if (auditData.h1Count > 1) {
      const extraH1s = Math.min(auditData.h1Count - 1, 3);
      penalties.multipleH1s = extraH1s * 3;
      score -= extraH1s * 3;
    }

    // 4. Duplicate H1s (10 points)
    if (auditData.duplicateH1s && auditData.duplicateH1s.length > 0) {
      penalties.duplicateH1s = Math.min(auditData.duplicateH1s.length * 2, 10);
      score -= penalties.duplicateH1s;
    }

    // 5. Images without Alt Tags (15 points)
    if (auditData.imagesWithoutAlt && auditData.imagesWithoutAlt.length > 0) {
      const missingAlts = Math.min(auditData.imagesWithoutAlt.length, 15);
      penalties.missingAltTags = missingAlts;
      score -= missingAlts;
    }

    // 6. HTTPS/SSL Security (10 points)
    if (auditData.securityStatus && !auditData.securityStatus.isHttps) {
      penalties.notHttps = 10;
      score -= 10;
    }

    // 7. Content Analysis (10 points)
    if (auditData.contentAnalysis) {
      const { wordCount, readabilityScore } = auditData.contentAnalysis;
      
      if (!wordCount || wordCount < 300) {
        penalties.thinContent = 5;
        score -= 5;
      }
      
      if (readabilityScore && readabilityScore < 60) {
        penalties.poorReadability = 5;
        score -= 5;
      }
    }

    // 8. Robots.txt Compliance (5 points)
    if (auditData.robotsAllowed === false) {
      penalties.robotsBlocked = 5;
      score -= 5;
    }

    // Ensure score doesn't go below 0
    score = Math.max(0, score);

    return {
      score: Math.round(score),
      maxScore: 100,
      penalties,
      grade: this.getGrade(score),
    };
  }

  getGrade(score) {
    if (score >= 90) return 'A';
    if (score >= 80) return 'B';
    if (score >= 70) return 'C';
    if (score >= 60) return 'D';
    return 'F';
  }

  getRecommendations(auditData) {
    const recommendations = [];

    if (!auditData.title) {
      recommendations.push({
        priority: 'high',
        issue: 'Missing Page Title',
        suggestion: 'Add a clear, descriptive title tag (30-60 characters)',
      });
    }

    if (!auditData.metaDescription) {
      recommendations.push({
        priority: 'high',
        issue: 'Missing Meta Description',
        suggestion: 'Add a meta description (120-160 characters) that includes target keywords',
      });
    }

    if (auditData.h1Count === 0) {
      recommendations.push({
        priority: 'high',
        issue: 'No H1 Tags Found',
        suggestion: 'Add exactly one H1 tag per page that matches the main topic',
      });
    }

    if (auditData.h1Count > 1) {
      recommendations.push({
        priority: 'medium',
        issue: 'Multiple H1 Tags',
        suggestion: 'Use only one H1 tag per page. Use H2-H6 for subheadings',
      });
    }

    if (auditData.imagesWithoutAlt && auditData.imagesWithoutAlt.length > 0) {
      recommendations.push({
        priority: 'medium',
        issue: `${auditData.imagesWithoutAlt.length} Images Missing Alt Text`,
        suggestion: 'Add descriptive alt text to all images for accessibility and SEO',
      });
    }

    if (auditData.securityStatus && !auditData.securityStatus.isHttps) {
      recommendations.push({
        priority: 'high',
        issue: 'Website Not Using HTTPS',
        suggestion: 'Migrate to HTTPS for security and SEO ranking benefits',
      });
    }

    return recommendations;
  }
}

module.exports = new SeoScorer();
