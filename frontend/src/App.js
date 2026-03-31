import React, { useState } from 'react';
import axios from 'axios';
import './App.css';

function App() {
  const [url, setUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState(null);
  const [error, setError] = useState('');

  const handleScan = async (e) => {
    e.preventDefault();
    
    if (!url.trim()) {
      setError('Please enter a URL');
      return;
    }

    setLoading(true);
    setError('');
    setResults(null);

    try {
      let urlToScan = url;
      if (!urlToScan.startsWith('http://') && !urlToScan.startsWith('https://')) {
        urlToScan = 'https://' + urlToScan;
      }

      const response = await axios.post('http://localhost:5000/api/audit', {
        url: urlToScan,
      });

      setResults(response.data);
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to audit the URL. Check if the backend is running.');
      setResults(null);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12 pt-8">
          <h1 className="text-4xl font-bold text-gray-800 mb-2">
            🔍 SEO Audit Dashboard
          </h1>
          <p className="text-gray-600 text-lg">
            Analyze your website for SEO issues in seconds
          </p>
        </div>

        {/* Search Section */}
        <div className="bg-white rounded-lg shadow-lg p-8 mb-8">
          <form onSubmit={handleScan} className="flex gap-4 flex-col sm:flex-row">
            <input
              type="text"
              placeholder="Enter website URL (e.g., example.com or https://example.com)"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              disabled={loading}
            />
            <button
              type="submit"
              disabled={loading}
              className="px-8 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-colors disabled:bg-gray-400 whitespace-nowrap"
            >
              {loading ? 'Scanning...' : 'Scan Website'}
            </button>
          </form>
        </div>

        {/* Error Message */}
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-6 py-4 rounded-lg mb-8">
            <p className="font-semibold">⚠️ Error</p>
            <p>{error}</p>
          </div>
        )}

        {/* Results Section */}
        {results && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Key Metrics */}
            <div className="space-y-6">
              <h2 className="text-2xl font-bold text-gray-800">SEO Metrics</h2>

              {/* Title Card */}
              <div className="bg-white rounded-lg shadow p-6 border-l-4 border-blue-500">
                <h3 className="text-gray-600 text-sm font-semibold uppercase mb-2">
                  Page Title
                </h3>
                <p className="text-gray-800 text-lg font-medium break-words">
                  {results.title || <span className="text-red-500">Missing</span>}
                </p>
                <p className="text-gray-500 text-xs mt-2">
                  {results.title ? `${results.title.length} characters` : 'Recommended: 30-60 characters'}
                </p>
              </div>

              {/* Meta Description Card */}
              <div className="bg-white rounded-lg shadow p-6 border-l-4 border-green-500">
                <h3 className="text-gray-600 text-sm font-semibold uppercase mb-2">
                  Meta Description
                </h3>
                <p className="text-gray-800 text-lg font-medium break-words">
                  {results.description || <span className="text-red-500">Missing</span>}
                </p>
                <p className="text-gray-500 text-xs mt-2">
                  {results.description ? `${results.description.length} characters` : 'Recommended: 120-160 characters'}
                </p>
              </div>

              {/* H1 Count Card */}
              <div className="bg-white rounded-lg shadow p-6 border-l-4 border-purple-500">
                <h3 className="text-gray-600 text-sm font-semibold uppercase mb-2">
                  H1 Headings
                </h3>
                <div className="flex items-center justify-between">
                  <p className="text-gray-800 text-4xl font-bold">{results.h1Count}</p>
                  <div className={`text-sm font-semibold px-3 py-1 rounded-full ${
                    results.h1Count === 1 ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'
                  }`}>
                    {results.h1Count === 1 ? '✓ Good' : results.h1Count === 0 ? '✗ Missing' : '⚠ Multiple'}
                  </div>
                </div>
                <p className="text-gray-500 text-xs mt-2">
                  Recommended: Exactly 1 H1 per page
                </p>
              </div>
            </div>

            {/* Images Without Alt Tags */}
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-2xl font-bold text-gray-800 mb-4">
                Images Missing Alt Tags
              </h2>
              
              {results.imagesWithoutAlt.length === 0 ? (
                <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg">
                  <p className="font-semibold">✓ All images have alt tags!</p>
                  <p className="text-sm mt-1">Great job! All images are properly optimized for accessibility.</p>
                </div>
              ) : (
                <div className="space-y-3 max-h-96 overflow-y-auto">
                  <p className="text-red-600 font-semibold mb-3">
                    Found {results.imagesWithoutAlt.length} image(s) without alt tags
                  </p>
                  {results.imagesWithoutAlt.slice(0, 20).map((src, index) => (
                    <div key={index} className="bg-red-50 border border-red-200 rounded p-3">
                      <p className="text-xs text-gray-600 font-mono break-all">
                        {src}
                      </p>
                    </div>
                  ))}
                  {results.imagesWithoutAlt.length > 20 && (
                    <div className="text-center text-gray-600 text-sm font-semibold py-2">
                      ... and {results.imagesWithoutAlt.length - 20} more
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        )}

        {/* Empty State */}
        {!results && !loading && !error && (
          <div className="bg-white rounded-lg shadow-lg p-12 text-center">
            <p className="text-gray-500 text-lg">
              Enter a URL and click "Scan Website" to analyze your site's SEO
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

export default App;
