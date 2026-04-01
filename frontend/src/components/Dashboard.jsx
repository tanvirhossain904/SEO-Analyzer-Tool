import React, { useState, useRef } from 'react';
import { useUser } from '@clerk/clerk-react';
import axios from 'axios';
import { motion } from 'framer-motion';
import { Download, Search, AlertCircle, CheckCircle, Clock, Loader } from 'lucide-react';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import { useTheme } from '../contexts/ThemeContext';

const Dashboard = () => {
  const { user } = useUser();
  const [url, setUrl] = useState('');
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const targetRef = useRef();

  const handleAudit = async () => {
    if (!url) {
      setError('Please enter a URL');
      return;
    }
    setLoading(true);
    setError(null);
    setResult(null);

    try {
      let auditUrl = url;
      if (!auditUrl.startsWith('http://') && !auditUrl.startsWith('https://')) {
        auditUrl = 'https://' + auditUrl;
      }

      const apiUrl = process.env.REACT_APP_API_URL || 'http://localhost:5000';
      const res = await axios.post(`${apiUrl}/api/v1/audit`, 
        { url: auditUrl },
        {
          timeout: 15000,
          headers: {
            Authorization: `Bearer ${await user.getIdToken()}`,
          },
        }
      );
      setResult(res.data);
      setError(null);
    } catch (err) {
      let errorMessage = 'Error connecting to server.';
      if (err.code === 'ECONNABORTED') {
        errorMessage = 'Request timeout. Please try again.';
      } else if (err.message === 'Network Error') {
        errorMessage = 'Cannot connect to backend server.';
      } else if (err.response?.data?.error) {
        errorMessage = err.response.data.error;
      } else if (err.response?.status === 500) {
        errorMessage = 'Server error. Please try another URL.';
      }
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleDownloadPDF = async () => {
    if (!targetRef.current) return;
    try {
      const canvas = await html2canvas(targetRef.current, { scale: 2, backgroundColor: '#ffffff' });
      const pdf = new jsPDF('p', 'mm', 'a4');
      const imgData = canvas.toDataURL('image/png');
      const imgWidth = 190;
      const imgHeight = (canvas.height * imgWidth) / canvas.width;
      pdf.addImage(imgData, 'PNG', 10, 10, imgWidth, imgHeight);
      pdf.save('SEO-Report.pdf');
    } catch (err) {
      console.error('PDF generation error:', err);
      setError('Failed to generate PDF');
    }
  };

  return (
    <div className="pt-24 min-h-screen pb-12">
      <div className="max-w-7xl mx-auto px-6">
        {/* Header */}
        <motion.div
          className="mb-8"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <h1 className="text-4xl font-extrabold dark:text-white mb-2">
            SEO Audit Dashboard
          </h1>
          <p className="text-slate-600 dark:text-slate-400">
            Welcome back, {user?.firstName || 'User'}! Scan your website for SEO insights.
          </p>
        </motion.div>

        {/* Scanner Section */}
        <motion.div
          className="bg-white dark:bg-slate-800 rounded-xl border dark:border-slate-700 p-8 mb-8 shadow-lg"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <div className="flex gap-4 flex-col md:flex-row">
            <input
              type="text"
              placeholder="Enter website URL (e.g., example.com)"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleAudit()}
              className="flex-1 px-6 py-3 border dark:border-slate-600 dark:bg-slate-700 dark:text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
            />
            <button
              onClick={handleAudit}
              disabled={loading}
              className="bg-blue-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-blue-700 transition disabled:opacity-50 flex items-center gap-2 whitespace-nowrap"
            >
              {loading ? (
                <>
                  <Loader size={20} className="animate-spin" />
                  Scanning...
                </>
              ) : (
                <>
                  <Search size={20} />
                  Start Audit
                </>
              )}
            </button>
          </div>
          {error && (
            <motion.div
              className="mt-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-600 dark:text-red-400 p-4 rounded-lg flex gap-2"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
            >
              <AlertCircle size={20} className="flex-shrink-0 mt-0.5" />
              <span>{error}</span>
            </motion.div>
          )}
        </motion.div>

        {/* Results Section */}
        {result && (
          <motion.div
            ref={targetRef}
            className="space-y-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            {/* PDF Download Button */}
            <div className="flex justify-end">
              <button
                onClick={handleDownloadPDF}
                className="bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 transition flex items-center gap-2 shadow-lg"
              >
                <Download size={20} />
                Save PDF Report
              </button>
            </div>

            {/* Main Score Card */}
            <motion.div
              className="bg-gradient-to-br from-blue-600 to-blue-700 text-white rounded-xl p-8 shadow-xl"
              whileHover={{ scale: 1.02 }}
            >
              <h2 className="text-sm font-semibold opacity-90 mb-4">SEO HEALTH SCORE</h2>
              <div className="flex items-end gap-4">
                <div className="flex-1">
                  <span className="text-6xl font-extrabold">{result.seoScore || 0}</span>
                  <span className="text-2xl opacity-90">/100</span>
                </div>
                <div className="text-sm opacity-75">
                  <p>Grade: <span className="font-bold text-lg">{result.grade || 'N/A'}</span></p>
                </div>
              </div>
              <div className="mt-4 text-sm opacity-75">
                <p>URL: {result.url}</p>
                <p>Scanned: {new Date(result.scannedAt).toLocaleString()}</p>
              </div>
            </motion.div>

            {/* Metrics Grid */}
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              {/* Title */}
              <motion.div
                className="bg-white dark:bg-slate-800 p-6 rounded-xl border dark:border-slate-700 shadow-lg"
                whileHover={{ y: -5 }}
              >
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-semibold dark:text-white">Page Title</h3>
                  {result.title ? (
                    <CheckCircle size={20} className="text-green-600" />
                  ) : (
                    <AlertCircle size={20} className="text-red-600" />
                  )}
                </div>
                <p className="text-sm text-slate-600 dark:text-slate-400 line-clamp-2">
                  {result.title || 'No title found'}
                </p>
                <p className="text-xs text-slate-500 dark:text-slate-500 mt-2">
                  {result.title?.length || 0} characters
                </p>
              </motion.div>

              {/* Meta Description */}
              <motion.div
                className="bg-white dark:bg-slate-800 p-6 rounded-xl border dark:border-slate-700 shadow-lg"
                whileHover={{ y: -5 }}
              >
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-semibold dark:text-white">Meta Description</h3>
                  {result.metaDescription ? (
                    <CheckCircle size={20} className="text-green-600" />
                  ) : (
                    <AlertCircle size={20} className="text-red-600" />
                  )}
                </div>
                <p className="text-sm text-slate-600 dark:text-slate-400 line-clamp-2">
                  {result.metaDescription || 'No meta description found'}
                </p>
                <p className="text-xs text-slate-500 dark:text-slate-500 mt-2">
                  {result.metaDescription?.length || 0} characters
                </p>
              </motion.div>

              {/* H1 Tags */}
              <motion.div
                className="bg-white dark:bg-slate-800 p-6 rounded-xl border dark:border-slate-700 shadow-lg"
                whileHover={{ y: -5 }}
              >
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-semibold dark:text-white">H1 Tags</h3>
                  {result.h1Count === 1 ? (
                    <CheckCircle size={20} className="text-green-600" />
                  ) : (
                    <AlertCircle size={20} className="text-yellow-600" />
                  )}
                </div>
                <p className="text-3xl font-bold text-blue-600 mb-2">{result.h1Count || 0}</p>
                <p className="text-xs text-slate-500 dark:text-slate-500">
                  {result.h1Count === 1 ? 'Perfect: One H1 tag' : result.h1Count === 0 ? 'Warning: No H1 tags found' : `Warning: ${result.h1Count} H1 tags found`}
                </p>
              </motion.div>

              {/* Missing Alt Tags */}
              <motion.div
                className="bg-white dark:bg-slate-800 p-6 rounded-xl border dark:border-slate-700 shadow-lg"
                whileHover={{ y: -5 }}
              >
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-semibold dark:text-white">Missing Alt Tags</h3>
                  {result.missingAltTags?.length === 0 ? (
                    <CheckCircle size={20} className="text-green-600" />
                  ) : (
                    <AlertCircle size={20} className="text-orange-600" />
                  )}
                </div>
                <p className="text-3xl font-bold text-orange-600 mb-2">
                  {result.missingAltTags?.length || 0}
                </p>
                <p className="text-xs text-slate-500 dark:text-slate-500">
                  {result.missingAltTags?.length === 0
                    ? 'All images have alt tags'
                    : `${result.missingAltTags.length} images need alt tags`}
                </p>
              </motion.div>

              {/* HTTPS Status */}
              <motion.div
                className="bg-white dark:bg-slate-800 p-6 rounded-xl border dark:border-slate-700 shadow-lg"
                whileHover={{ y: -5 }}
              >
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-semibold dark:text-white">HTTPS Status</h3>
                  {result.isHttps ? (
                    <CheckCircle size={20} className="text-green-600" />
                  ) : (
                    <AlertCircle size={20} className="text-red-600" />
                  )}
                </div>
                <p className={`text-lg font-bold ${result.isHttps ? 'text-green-600' : 'text-red-600'}`}>
                  {result.isHttps ? 'Secure' : 'Not Secure'}
                </p>
                <p className="text-xs text-slate-500 dark:text-slate-500 mt-2">
                  {result.isHttps ? 'SSL certificate is valid' : 'HTTPS not enabled'}
                </p>
              </motion.div>

              {/* Content Length */}
              <motion.div
                className="bg-white dark:bg-slate-800 p-6 rounded-xl border dark:border-slate-700 shadow-lg"
                whileHover={{ y: -5 }}
              >
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-semibold dark:text-white">Content Length</h3>
                  <Clock size={20} className="text-slate-400" />
                </div>
                <p className="text-3xl font-bold text-slate-600 dark:text-slate-300 mb-2">
                  {result.contentLength?.toLocaleString() || 0}
                </p>
                <p className="text-xs text-slate-500 dark:text-slate-500">Total words on page</p>
              </motion.div>

              {/* Performance Score */}
              <motion.div
                className="bg-white dark:bg-slate-800 p-6 rounded-xl border dark:border-slate-700 shadow-lg"
                whileHover={{ y: -5 }}
              >
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-semibold dark:text-white">Performance</h3>
                  <CheckCircle size={20} className="text-blue-600" />
                </div>
                <p className="text-3xl font-bold text-blue-600 mb-2">
                  {result.performanceScore || 'N/A'}
                </p>
                <p className="text-xs text-slate-500 dark:text-slate-500">Overall speed score</p>
              </motion.div>
            </div>

            {/* Recommendations */}
            {result.recommendations && result.recommendations.length > 0 && (
              <motion.div
                className="bg-white dark:bg-slate-800 rounded-xl border dark:border-slate-700 p-8 shadow-lg"
                whileHover={{ y: -2 }}
              >
                <h3 className="text-2xl font-bold mb-6 dark:text-white">Recommendations</h3>
                <div className="space-y-4">
                  {result.recommendations.map((rec, idx) => (
                    <div
                      key={idx}
                      className="flex gap-4 p-4 bg-slate-50 dark:bg-slate-700/50 rounded-lg border-l-4 border-blue-600"
                    >
                      <div className="flex-shrink-0 text-blue-600 mt-1">
                        <AlertCircle size={20} />
                      </div>
                      <div>
                        <p className="font-semibold dark:text-white">{rec}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </motion.div>
            )}
          </motion.div>
        )}

        {/* Empty State */}
        {!result && !loading && (
          <motion.div
            className="text-center py-16"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            <div className="text-slate-400 mb-4">
              <Search size={64} className="mx-auto" />
            </div>
            <h3 className="text-2xl font-bold dark:text-white mb-2">No Audits Yet</h3>
            <p className="text-slate-600 dark:text-slate-400">
              Enter a URL above and start your first SEO audit!
            </p>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
