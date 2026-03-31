# SEO Analyzer Tool - MERN Stack

A modern, full-stack SEO audit dashboard built with React, Express, Node.js, and Tailwind CSS. Analyze web pages for critical SEO issues in seconds.

## Features

✨ **Key Features:**
- 🔍 Extract page title and meta descriptions
- 📊 Count H1 headings
- 🖼️ Identify images missing alt tags
- 🎨 Beautiful, responsive UI with Tailwind CSS
- ⚡ Real-time error handling and validation
- 📱 Mobile-friendly design
- 🚀 Fast backend with Node.js/Express

## Project Structure

```
SEO-Analyzer-Tool/
├── backend/
│   ├── server.js              # Express server with SEO scraping endpoints
│   └── package.json           # Backend dependencies
├── frontend/
│   ├── public/
│   │   └── index.html         # HTML entry point
│   ├── src/
│   │   ├── App.js             # Main React component with dashboard UI
│   │   ├── App.css            # App styles
│   │   ├── index.js           # React entry point
│   │   └── index.css          # Global styles + Tailwind imports
│   ├── tailwind.config.js     # Tailwind CSS configuration
│   ├── postcss.config.js      # PostCSS configuration
│   └── package.json           # Frontend dependencies
├── package.json               # Root scripts for managing both projects
└── README.md                  # This file
```

## Installation

### Prerequisites
- Node.js (v14 or higher)
- npm or yarn

### Setup

1. **Clone and navigate to the project:**
   ```bash
   cd SEO-Analyzer-Tool
   ```

2. **Install all dependencies:**
   ```bash
   npm run install-all
   ```
   This installs both root dependencies and frontend dependencies.

## Running the Application

### Option 1: Run Both Servers Together (Recommended)

```bash
npm run dev
```

This starts both the backend (`localhost:5000`) and frontend (`localhost:3000`) concurrently.

### Option 2: Run Separately

**Terminal 1 - Backend:**
```bash
npm run server
```
Backend will run on `http://localhost:5000`

**Terminal 2 - Frontend:**
```bash
npm run client
```
Frontend will run on `http://localhost:3000`

## API Endpoints

### POST `/api/audit`
Analyzes a URL and returns SEO metrics.

**Request:**
```json
{
  "url": "https://example.com"
}
```

**Response:**
```json
{
  "title": "Page Title",
  "description": "Meta description text",
  "h1Count": 1,
  "imagesWithoutAlt": ["image-url-1", "image-url-2"]
}
```

### GET `/health`
Health check endpoint for the backend.

## Backend (server.js)

### Key Features:
- **Web Scraping**: Uses `axios` to fetch web pages and `cheerio` to parse HTML
- **CORS**: Enabled to allow cross-origin requests from the React frontend
- **Error Handling**: Comprehensive error messages for network issues
- **User Agent**: Includes browser user agent to avoid blocking
- **Timeout Protection**: 10-second timeout for requests

### Main Endpoint Flow:
1. Receives URL from frontend
2. Fetches the webpage with axios
3. Parses HTML with cheerio
4. Extracts:
   - Page title from `<title>` tag
   - Meta description from `<meta name="description">` tag
   - Counts all `<h1>` elements
   - Identifies all `<img>` tags without alt attributes
5. Returns results as JSON

## Frontend (App.js)

### Components & Features:
- **URL Input Form**: Accept website URLs with validation
- **Auto-URL Correction**: Automatically adds https:// if missing
- **Loading State**: Shows "Scanning..." while processing
- **Results Display**: 
  - **Metrics Section**: Title, description, H1 count with visual indicators
  - **Images Section**: Lists images without alt tags with pagination
- **Error Handling**: User-friendly error messages
- **Tailwind Styling**: Professional, responsive design

### Key Technologies:
- **React 18**: Modern hooks-based component
- **Axios**: HTTP client for API calls
- **Tailwind CSS**: Utility-first CSS framework
- **Responsive Design**: Works on mobile, tablet, and desktop

## Tailwind CSS Integration

Tailwind CSS is configured with:
- `tailwind.config.js`: Customization and plugin configuration
- `postcss.config.js`: PostCSS processing for Tailwind
- `src/index.css`: Imports Tailwind directives (@tailwind)

## Development

### Adding New Features

1. **Backend**: Add new scraping logic to `backend/server.js` in the `/api/audit` endpoint
2. **Frontend**: Update `frontend/src/App.js` to display new metrics in the results section

### Debugging

- **Backend Logs**: Check console output from `npm run server`
- **Frontend Logs**: Check browser DevTools console
- **Network Issues**: Use browser DevTools Network tab to inspect API calls

## Troubleshooting

### Port Already in Use
If port 5000 or 3000 is in use:
```bash
# Kill process using port 5000 (backend)
# Windows:
netstat -ano | findstr :5000
taskkill /PID <PID> /F

# macOS/Linux:
lsof -i :5000 | grep LISTEN | awk '{print $2}' | xargs kill -9
```

### CORS Errors
Ensure the backend server is running on port 5000 and CORS is enabled in `server.js`.

### Dependencies Not Installing
```bash
rm -rf node_modules frontend/node_modules
npm run install-all
```

## Performance Tips

1. **Cache Results**: Consider storing audit results in a database
2. **Rate Limiting**: Add rate limiting to prevent abuse
3. **Database Storage**: Store audit history for comparison
4. **Background Jobs**: Use job queues for large-scale scanning

## Future Enhancements

- [ ] User authentication and saved reports
- [ ] Audit history and progress tracking
- [ ] More detailed SEO metrics (canonical tags, structured data, etc.)
- [ ] Export reports as PDF
- [ ] Competitor analysis
- [ ] Performance metrics (Lighthouse integration)

## License

ISC

## Support

For issues or questions, please create an issue in the repository.
