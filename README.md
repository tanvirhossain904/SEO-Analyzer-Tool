# SEO-Vision: Enterprise SEO SaaS Platform

A professional-grade SEO Audit and Analytics Dashboard built with the MERN stack (MongoDB, Express, React, Node.js).

## 🚀 Features

### Frontend
- ✅ **Clerk Authentication** - Secure user authentication and management
- ✅ **Responsive Dashboard** - Beautiful UI with Tailwind CSS
- ✅ **Dark/Light Mode** - Persistent theme support with ThemeContext
- ✅ **Bento Grid Layout** - Modern dashboard with key metrics
- ✅ **Real-time Charts** - SEO score visualization with Recharts
- ✅ **Audit History** - View and manage all previous audits
- ✅ **Framer Motion Animations** - Smooth transitions and interactions
- ✅ **Lucide React Icons** - Professional icon system

### Backend
- ✅ **MongoDB Integration** - Persistent data storage with Mongoose
- ✅ **Web Scraping** - Advanced HTML parsing with Cheerio
- ✅ **24-Hour Caching** - Smart caching to avoid re-scraping
- ✅ **SEO Scoring Algorithm** - Enterprise-grade scoring (0-100)
- ✅ **Robots.txt Compliance** - Respects site crawling rules
- ✅ **Custom User-Agent** - Professional crawler identification
- ✅ **RESTful API** - V1 API with protected routes
- ✅ **Dashboard Aggregation** - Real-time analytics endpoints

## 📋 Tech Stack

### Frontend
- React 18
- Framer Motion (animations)
- Recharts (visualizations)
- Tailwind CSS (styling)
- Lucide React (icons)
- Clerk (authentication)
- React Router (navigation)

### Backend
- Node.js & Express
- MongoDB & Mongoose
- Axios & Cheerio (web scraping)
- @clerk/express (Clerk middleware)
- Dotenv (environment config)

## 📁 Project Structure

```
SEO-Analyzer-Tool/
├── backend/
│   ├── controllers/
│   │   └── auditController.js      # Core audit logic & caching
│   ├── models/
│   │   └── Audit.js                # MongoDB schema
│   ├── utils/
│   │   └── seoScorer.js            # Scoring algorithm
│   └── server.js                   # Express app & routes
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── SideNav.jsx         # Navigation sidebar
│   │   │   ├── Dashboard.jsx       # Main dashboard
│   │   │   ├── History.jsx         # Audit history
│   │   │   └── Landing.jsx         # Landing page
│   │   ├── contexts/
│   │   │   └── ThemeContext.jsx    # Dark/Light mode
│   │   ├── App.jsx                 # Main routing
│   │   ├── index.js                # React entry point
│   │   └── index.css               # Global styles
│   ├── public/
│   │   └── index.html
│   ├── package.json
│   ├── tailwind.config.js
│   └── postcss.config.js
├── .env                            # Environment variables
├── package.json                    # Root dependencies
└── README.md                       # This file
```

## 🔧 Setup Instructions

### Prerequisites
- Node.js 18+
- MongoDB 7.0+ (local or MongoDB Atlas)
- Clerk account (https://clerk.com)

### 1. Clone & Install

```bash
cd SEO-Analyzer-Tool
npm install                        # Install backend dependencies
cd frontend && npm install         # Install frontend dependencies
```

### 2. Configure Environment Variables

Create `.env` in the root directory:

```env
# MongoDB
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/seo-vision?retryWrites=true&w=majority

# Clerk
CLERK_SECRET_KEY=your_clerk_secret_key
VITE_CLERK_PUBLISHABLE_KEY=your_clerk_publishable_key

# Server
PORT=5000
NODE_ENV=development
```

Create `frontend/.env.local`:

```env
VITE_CLERK_PUBLISHABLE_KEY=your_clerk_publishable_key
```

### 3. Start Development Servers

**Option A: Run both concurrently**
```bash
npm run dev
```

**Option B: Run separately**

Terminal 1 (Backend):
```bash
npm run server
# Backend runs on http://localhost:5000
```

Terminal 2 (Frontend):
```bash
npm run client
# Frontend runs on http://localhost:3000
```

## 🎯 API Endpoints

### Legacy Endpoints (Backward Compatible)
- `POST /api/audit` - Basic audit endpoint

### Enterprise API (v1) - Protected Routes
- `POST /api/v1/audit` - Perform SEO audit
- `GET /api/v1/audits` - Get user's audit history
- `GET /api/v1/audits/:id` - Get specific audit
- `DELETE /api/v1/audits/:id` - Delete audit
- `GET /api/v1/dashboard` - Get dashboard summary

**All v1 endpoints require Clerk authentication**

## 📊 SEO Scoring Algorithm

The platform uses an enterprise-grade scoring system (0-100):

- **Title Tag** (10 pts) - Presence, length (30-60 chars)
- **Meta Description** (15 pts) - Presence, length (120-160 chars)
- **H1 Tags** (15 pts) - Exactly one H1 per page
- **Duplicate H1s** (10 pts) - Penalizes duplicates
- **Alt Tags** (15 pts) - All images have alt text
- **HTTPS/SSL** (10 pts) - Secure connection required
- **Content Quality** (10 pts) - Word count, readability
- **Robots.txt** (5 pts) - Crawler compliance

## 🔐 Database Schema

### Audit Model
```javascript
{
  userId: String,                     // Clerk user ID
  url: String,                        // Website URL
  title: String,
  metaDescription: String,
  h1Count: Number,
  duplicateH1s: [String],
  imagesWithoutAlt: [Object],
  keywordDensity: Object,
  seoScore: Number,                   // 0-100
  performanceData: {
    lcp: Number,                      // Largest Contentful Paint
    fcp: Number,                      // First Contentful Paint
    clsScore: Number,                 // Cumulative Layout Shift
    speedScore: Number
  },
  securityStatus: {
    isHttps: Boolean,
    hasSslCertificate: Boolean
  },
  contentAnalysis: {
    wordCount: Number,
    readabilityScore: Number,
    keywordCount: Number,
    metaLength: Number,
    titleLength: Number
  },
  robotsAllowed: Boolean,
  lastScannedAt: Date,               // For 24-hour cache
  createdAt: Date,
  updatedAt: Date
}
```

## 🎨 UI Components

### SideNav
- Theme toggle (Dark/Light mode)
- Navigation links
- User profile from Clerk
- Responsive on mobile

### Dashboard
- URL input with automatic protocol detection
- SEO Health Score (Pie chart)
- Performance Metrics (Line chart)
- Security Status card
- Content Analysis metrics
- Real-time error handling

### History
- Paginated audit list
- Quick stats for each audit
- Delete functionality
- Sort by date

### Landing
- Hero section with CTA
- Feature showcase
- Clerk Sign In/Up buttons
- Framer Motion animations

## 🌓 Dark/Light Mode

- Persists to localStorage
- Syncs across all pages
- System preference fallback
- Tailwind CSS dark mode support

## 📱 Responsive Design

- Mobile-first approach
- Tailwind breakpoints (sm, md, lg)
- Touch-friendly components
- Optimized for all screen sizes

## 🔒 Security Features

- Clerk authentication for all protected routes
- User ID validation on all API endpoints
- HTTPS detection and reporting
- Custom User-Agent to prevent blocking
- Robots.txt compliance checking
- MongoDB input sanitization

## 🚀 Production Deployment

### Backend Deployment (Heroku, Render, etc.)
```bash
npm install -g heroku-cli
heroku login
heroku create your-app-name
heroku config:set MONGODB_URI=your_uri
heroku config:set CLERK_SECRET_KEY=your_key
git push heroku main
```

### Frontend Deployment (Vercel, Netlify, etc.)
```bash
npm run build
# Deploy the 'build' folder
```

## 🛠️ Development Tips

### Adding New Audit Metrics
Edit `backend/utils/seoScorer.js` to add scoring rules.

### Customizing Theme Colors
Edit `frontend/tailwind.config.js` to change the Indigo primary color (#4F46E5).

### Adding Dashboard Cards
Create new cards in `frontend/src/components/Dashboard.jsx` using the Bento grid pattern.

## 📈 Performance Optimization

- 24-hour caching reduces API calls
- MongoDB indexing on userId and URL
- Responsive image handling
- Lazy loading of audit history
- Optimized Recharts rendering

## 🐛 Troubleshooting

### MongoDB Connection Error
- Verify connection string in `.env`
- Check IP whitelist in MongoDB Atlas
- Ensure database exists

### Clerk Authentication Issues
- Verify publishable and secret keys
- Check Clerk dashboard settings
- Clear browser cookies and cache

### Port Already in Use
```bash
# Find process on port 5000
lsof -i :5000
# Kill process
kill -9 <PID>
```

## 📞 Support & Contribution

For issues, questions, or contributions, please open an issue or pull request.

## 📄 License

ISC Licensed. See LICENSE file for details.

---

**Built with ❤️ for SEO Excellence**
- [ ] Performance metrics (Lighthouse integration)

## License

ISC

## Support

For issues or questions, please create an issue in the repository.
