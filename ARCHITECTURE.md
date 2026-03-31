# SEO-Vision Architecture & Component Guide

## 🏗️ Architecture Overview

SEO-Vision is built on a **Client-Server Architecture** with:
- **Frontend**: React 18 SPA with Clerk auth
- **Backend**: Express REST API with MongoDB
- **Database**: MongoDB for persistence
- **Auth**: Clerk for user management

```
┌─────────────────────────────────────────────────────────────┐
│                       USER BROWSER                          │
│  ┌──────────────────────────────────────────────────────┐  │
│  │  React App (Clerk Protected)                        │  │
│  │  ├─ Landing Page (Framer Motion)                   │  │
│  │  ├─ Dashboard (Bento Grid + Charts)                │  │
│  │  ├─ History (Audit List)                           │  │
│  │  └─ SideNav (Theme Toggle)                         │  │
│  └──────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────┘
           ↓ HTTPS / REST API ↓
┌─────────────────────────────────────────────────────────────┐
│                    EXPRESS BACKEND                          │
│  ┌──────────────────────────────────────────────────────┐  │
│  │ Routes                                              │  │
│  │ ├─ POST /api/v1/audit (Clerk Auth)                │  │
│  │ ├─ GET /api/v1/audits (Protected)                 │  │
│  │ ├─ DELETE /api/v1/audits/:id (Protected)         │  │
│  │ └─ GET /api/v1/dashboard (Protected)             │  │
│  └──────────────────────────────────────────────────────┘  │
│  ┌──────────────────────────────────────────────────────┐  │
│  │ Controllers                                         │  │
│  │ └─ auditController (Core Logic)                    │  │
│  │    ├─ performAudit() - Main audit logic            │  │
│  │    ├─ getCachedAudit() - 24hr cache check          │  │
│  │    ├─ extractSeoData() - Scraping logic            │  │
│  │    └─ getUserAudits() - History retrieval          │  │
│  └──────────────────────────────────────────────────────┘  │
│  ┌──────────────────────────────────────────────────────┐  │
│  │ Utilities                                           │  │
│  │ └─ seoScorer.js                                     │  │
│  │    ├─ calculateScore() - 0-100 scoring             │  │
│  │    ├─ getGrade() - A-F grading                      │  │
│  │    └─ getRecommendations() - Improvement tips      │  │
│  └──────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────┘
           ↓ Database Queries ↓
┌─────────────────────────────────────────────────────────────┐
│                     MONGODB ATLAS                           │
│  Database: seo-vision                                       │
│  ├─ Collection: audits                                      │
│  │  ├─ userId (indexed)                                │   │
│  │  ├─ url (indexed)                                   │   │
│  │  ├─ seoScore                                        │   │
│  │  ├─ performanceData                                 │   │
│  │  ├─ lastScannedAt (for 24hr cache)                │   │
│  │  └─ [other audit fields]                           │   │
│  └─ Indexes: (userId, url, lastScannedAt)            │   │
└─────────────────────────────────────────────────────────────┘
```

---

## 📦 Frontend Components Architecture

### Component Tree

```
App (BrowserRouter + Clerk Provider)
├─ ThemeProvider
│  └─ ThemeContext (isDark, toggleTheme)
│
├─ Landing (Public Route)
│  ├─ Hero Section (Framer Motion)
│  ├─ Features Grid
│  └─ CTA Buttons
│
└─ Protected Routes
   ├─ SideNav (Layout Component)
   │  ├─ Navigation Links
   │  ├─ Theme Toggle Button
   │  ├─ UserButton (from Clerk)
   │  └─ Dark Mode Styling
   │
   ├─ Dashboard (Protected)
   │  ├─ URL Input Form
   │  ├─ Bento Grid Layout
   │  │  ├─ SEO Score Card (Pie Chart)
   │  │  ├─ Performance Metrics (Line Chart)
   │  │  ├─ Security Status Card
   │  │  ├─ Content Analysis Card
   │  │  ├─ Meta Description Card
   │  │  ├─ H1 Status Card
   │  │  └─ Missing Alt Tags Card
   │  └─ Empty State (when no audit)
   │
   ├─ History (Protected)
   │  ├─ Audit List
   │  │  ├─ Domain Name with Link
   │  │  ├─ Quick Stats Grid
   │  │  ├─ Grade Badge
   │  │  ├─ Title & Meta Preview
   │  │  └─ Delete Button
   │  └─ Empty State (when no audits)
   │
   ├─ Analytics (Placeholder)
   └─ Settings (Placeholder)
```

### Component Details

#### **App.jsx**
- Routing with React Router
- Clerk Provider wrapper
- Protected route logic
- Theme Provider integration

```javascript
// Key Features:
- ClerkProvider for auth
- BrowserRouter for navigation
- SignedIn/SignedOut components
- RedirectToSignIn on auth fail
```

#### **SideNav.jsx**
- Navigation sidebar with active state
- Theme toggle button
- User profile display (Clerk)
- Responsive layout

```javascript
// Key Features:
- useTheme hook for theme toggle
- useLocation for active route
- UserButton from Clerk
- Tailwind dark mode classes
```

#### **Dashboard.jsx**
- Main audit interface
- URL input and scanning
- Real-time error handling
- Bento grid layout with cards
- Recharts data visualization

```javascript
// Key Features:
- useState for auditData, scanning state
- Framer Motion animations
- Recharts for pie/line charts
- Responsive grid (grid-cols-4)
- Error state handling
```

#### **History.jsx**
- Display user's audit history
- Delete audit functionality
- Pagination support
- Stats display per audit

```javascript
// Key Features:
- Fetch from /api/v1/audits
- User-specific data retrieval
- Delete with confirmation
- Grade calculation logic
```

#### **Landing.jsx**
- Public landing page
- Framer Motion animations
- Hero section with CTA
- Feature showcase
- Clerk Sign In/Up buttons

```javascript
// Key Features:
- containerVariants for stagger animation
- whileHover effects on cards
- Gradient backgrounds
- Responsive grid layout
```

#### **ThemeContext.jsx**
- Global theme state management
- localStorage persistence
- Dark/Light mode toggle
- System preference fallback

```javascript
// Key Features:
- Context API for global state
- localStorage for persistence
- useEffect for DOM updates
- Custom useTheme hook
```

---

## 🔌 Backend Architecture

### File Structure

```
backend/
├─ server.js (Express app, routes)
├─ controllers/
│  └─ auditController.js (Business logic)
├─ models/
│  └─ Audit.js (MongoDB schema)
└─ utils/
   └─ seoScorer.js (Scoring algorithm)
```

### Data Flow

```
HTTP Request
    ↓
Express Route Handler
    ↓
Clerk Auth Middleware (verify token)
    ↓
Controller Function
    ↓
Cache Check (24-hour)
    ├─ Cache Hit: Return cached data
    └─ Cache Miss: ↓
        Robots.txt Check
        ↓
        Axios Fetch (with headers)
        ↓
        Cheerio Parse (HTML extraction)
        ↓
        Extract SEO Data
        ↓
        SEO Scorer (calculate score 0-100)
        ↓
        MongoDB Save
        ↓
        Return Response
```

### Route Handlers

#### **POST /api/v1/audit**
```javascript
// Request
{
  url: "https://example.com"
}

// Process
1. Verify Clerk authentication
2. Check for cached result (24 hours)
3. Check robots.txt compliance
4. Fetch URL with custom User-Agent
5. Parse HTML with Cheerio
6. Extract: title, meta, H1s, images, keywords
7. Calculate SEO score (0-100)
8. Save to MongoDB
9. Return full audit data
```

#### **GET /api/v1/audits**
```javascript
// Query Parameters
?limit=50

// Process
1. Verify authentication
2. Find audits by userId
3. Sort by creation date descending
4. Limit results
5. Return audit list
```

#### **GET /api/v1/audits/:id**
```javascript
// Process
1. Verify authentication
2. Find audit by ID and userId
3. Verify ownership
4. Return audit details
```

#### **DELETE /api/v1/audits/:id**
```javascript
// Process
1. Verify authentication
2. Find and delete by ID and userId
3. Verify ownership
4. Return success message
```

#### **GET /api/v1/dashboard**
```javascript
// Returns
{
  totalAudits: number,
  averageScore: number,
  recentAudits: [array of last 5]
}
```

---

## 📊 SEO Scoring Algorithm

### Scoring Rules (Total: 100 points)

```javascript
Base Score: 100

Penalties:

1. Title (10 pts)
   - No title: -10
   - < 30 chars: -5
   - > 60 chars: -3

2. Meta Description (15 pts)
   - No description: -15
   - < 120 chars: -8
   - > 160 chars: -5

3. H1 Tags (15 pts)
   - No H1: -15
   - Multiple H1s: -3 per extra

4. Duplicate H1s (10 pts)
   - -2 per duplicate

5. Alt Tags (15 pts)
   - -1 per missing alt tag
   - Max -15

6. HTTPS/SSL (10 pts)
   - Not HTTPS: -10

7. Content (10 pts)
   - < 300 words: -5
   - Poor readability: -5

8. Robots.txt (5 pts)
   - Blocked by robots.txt: -5

Final Score: Min 0, Max 100
```

### Grades

```
A: 90-100
B: 80-89
C: 70-79
D: 60-69
F: 0-59
```

---

## 🔐 Authentication Flow

```
1. User visits app
   ↓
2. Clerk checks session token
   ↓
3a. Token Valid → Redirect to /dashboard
   ↓
3b. No Token → Show Sign Up/Sign In
   ↓
4. User signs up/in via Clerk UI
   ↓
5. Clerk redirects to /dashboard
   ↓
6. Frontend sends API requests with Clerk token
   ↓
7. Backend middleware verifies token
   ↓
8. Controller accesses userId from token
   ↓
9. Query MongoDB filtered by userId
```

### Clerk Integration

```javascript
// Frontend
import { ClerkProvider, SignedIn, SignedOut } from '@clerk/clerk-react';

// Backend
import { ClerkExpressWithAuth } from '@clerk/express';
app.use(ClerkExpressWithAuth());

// Get userId
const userId = req.auth.userId;
```

---

## 💾 Database Operations

### Mongoose Schema (Audit.js)

```javascript
{
  userId: String,              // Clerk user ID (indexed)
  url: String,                 // Website URL (indexed)
  title: String,
  metaDescription: String,
  h1Count: Number,
  duplicateH1s: [String],
  imagesWithoutAlt: [{
    src: String,
    alt: String
  }],
  keywordDensity: {
    keyword: String,
    density: Number
  },
  seoScore: Number,            // 0-100
  performanceData: {
    lcp: Number,
    fcp: Number,
    clsScore: Number,
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
  lastScannedAt: Date,         // For 24hr cache
  createdAt: Date,
  updatedAt: Date
}
```

### Indexes

```javascript
// Compound index for efficient queries
auditSchema.index({ userId: 1, url: 1, lastScannedAt: -1 });
```

### Cache Logic

```javascript
// Check if cached version exists (within 24 hours)
const twentyFourHoursAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);
const cachedAudit = await Audit.findOne({
  userId,
  url,
  lastScannedAt: { $gte: twentyFourHoursAgo }
});

if (cachedAudit) return cachedAudit; // Use cache
```

---

## 🎨 Styling Architecture

### Tailwind CSS Configuration

```javascript
// tailwind.config.js
export default {
  darkMode: 'class',           // Dark mode support
  content: ['./src/**/*.{jsx}'],
  theme: {
    extend: {
      colors: {
        // Indigo primary theme (#4F46E5)
      }
    }
  }
};
```

### Color Scheme

```
Primary: Indigo (#4F46E5)
Success: Green (#10B981)
Warning: Amber (#F59E0B)
Error: Red (#EF4444)
Neutral: Slate (#xxx)
```

### Dark Mode Classes

```jsx
// Light mode (default)
className="bg-white text-slate-900"

// Dark mode (automatic with 'dark' class on <html>)
className="dark:bg-slate-800 dark:text-white"
```

---

## 🔄 API Request/Response Flow

### Audit Request

```javascript
// Frontend
const response = await fetch('/api/v1/audit', {
  method: 'POST',
  headers: {
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({ url })
});

// Backend Response
{
  userId: "user_xxx",
  url: "https://example.com",
  title: "Example Domain",
  metaDescription: "This is an example webpage",
  h1Count: 1,
  seoScore: 85,
  grade: "B",
  cached: false, // or true if from cache
  cached: true,
  recommendations: [
    { priority: "medium", issue: "...", suggestion: "..." }
  ]
}
```

---

## ⚡ Performance Optimizations

### Frontend
- Lazy loading with React.lazy()
- Memoization with React.memo
- Framer Motion optimization
- Recharts responsive rendering

### Backend
- MongoDB indexes on userId, url
- 24-hour caching strategy
- Connection pooling
- Efficient HTML parsing with Cheerio

### Database
- Compound indexes for queries
- Appropriate data types
- Indexed timestamps

---

## 🛡️ Security Measures

### Frontend
- Clerk authentication enforced
- Protected routes with SignedIn wrapper
- No sensitive data in localStorage
- HTTPS only for production

### Backend
- Clerk token validation middleware
- User ID verification on all queries
- Input sanitization with Mongoose
- CORS restricted

### Data
- MongoDB encryption enabled
- User ID filtering on all queries
- No cross-user data access

---

## 📝 Code Examples

### Adding New API Endpoint

```javascript
// In server.js
app.get('/api/v1/new-endpoint', async (req, res) => {
  try {
    const userId = req.auth.userId;
    if (!userId) return res.status(401).json({ error: 'Unauthorized' });
    
    // Your logic here
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});
```

### Adding New Dashboard Card

```javascript
// In Dashboard.jsx
<motion.div
  variants={itemVariants}
  className="bg-white dark:bg-slate-800 rounded-2xl p-6"
>
  <div className="flex items-center gap-2 mb-4">
    <Icon className="w-5 h-5" />
    <h3 className="text-sm font-semibold">Card Title</h3>
  </div>
  {/* Card content */}
</motion.div>
```

---

## 🧪 Testing Checklist

- [ ] User can sign up/login
- [ ] Protected routes redirect unsigned users
- [ ] Audit performs successfully
- [ ] Results display correctly
- [ ] Cache returns after 1st audit
- [ ] History shows all user audits
- [ ] Delete audit works
- [ ] Theme persists on refresh
- [ ] Responsive on mobile
- [ ] Dark mode works properly
- [ ] All error states handled
- [ ] Loading states display

---

## 📚 Key Dependencies

| Package | Purpose |
|---------|---------|
| express | Web server |
| mongoose | MongoDB ODM |
| @clerk/express | Backend auth |
| @clerk/clerk-react | Frontend auth |
| axios | HTTP requests |
| cheerio | HTML parsing |
| recharts | Charting |
| framer-motion | Animations |
| tailwindcss | Styling |
| react-router-dom | Routing |

---

**This architecture provides a scalable, secure, and maintainable SEO SaaS platform! 🚀**
