import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from 'recharts';
import {
  AlertCircle,
  Zap,
  Lock,
  FileText,
  ArrowUp,
  Globe,
} from 'lucide-react';
import { useUser } from '@clerk/clerk-react';

const Dashboard = () => {
  const { user } = useUser();
  const [auditData, setAuditData] = useState(null);
  const [dashboardSummary, setDashboardSummary] = useState(null);
  const [loading, setLoading] = useState(true);
  const [scanning, setScanning] = useState(false);
  const [url, setUrl] = useState('');
  const [error, setError] = useState('');

  const COLORS = ['#4F46E5', '#10B981', '#F59E0B', '#EF4444'];

  // Fetch dashboard summary on mount
  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        const response = await fetch('http://localhost:5000/api/v1/dashboard', {
          headers: { Authorization: `Bearer ${await user?.getIdToken()}` },
        });

        if (!response.ok) throw new Error('Failed to fetch dashboard');
        const data = await response.json();
        setDashboardSummary(data);
      } catch (err) {
        console.error('Dashboard fetch error:', err);
      } finally {
        setLoading(false);
      }
    };

    if (user) {
      fetchDashboard();
    }
  }, [user]);

  const handleAudit = async (e) => {
    e.preventDefault();
    setError('');
    setScanning(true);

    try {
      let auditUrl = url.trim();
      if (!auditUrl.startsWith('http')) {
        auditUrl = `https://${auditUrl}`;
      }

      const response = await fetch('http://localhost:5000/api/v1/audit', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${await user?.getIdToken()}`,
        },
        body: JSON.stringify({ url: auditUrl }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Audit failed');
      }

      const data = await response.json();
      setAuditData(data);
      setUrl('');
    } catch (err) {
      setError(err.message);
    } finally {
      setScanning(false);
    }
  };

  const scoreData = auditData
    ? [
        { name: 'Score', value: auditData.seoScore, fill: '#4F46E5' },
        { name: 'Remaining', value: 100 - auditData.seoScore, fill: '#E5E7EB' },
      ]
    : [];

  const performanceData = auditData
    ? [
        { name: 'LCP', value: auditData.performanceData?.lcp || 0 },
        { name: 'FCP', value: auditData.performanceData?.fcp || 0 },
        { name: 'Speed', value: auditData.performanceData?.speedScore || 0 },
      ]
    : [];

  const containerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5 },
    },
  };

  return (
    <div className="flex-1 bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-950 dark:to-slate-900 p-8 overflow-y-auto">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <h1 className="text-4xl font-bold text-slate-900 dark:text-white mb-2">
          Welcome back, {user?.firstName}!
        </h1>
        <p className="text-slate-600 dark:text-slate-400">
          Monitor and optimize your website's SEO performance
        </p>
      </motion.div>

      {/* URL Input */}
      <motion.form
        onSubmit={handleAudit}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="mb-8"
      >
        <div className="flex gap-3">
          <input
            type="text"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            placeholder="Enter website URL (e.g., example.com)"
            className="flex-1 px-4 py-3 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            disabled={scanning}
          />
          <button
            type="submit"
            disabled={scanning || !url.trim()}
            className="px-6 py-3 bg-indigo-500 hover:bg-indigo-600 text-white rounded-lg font-semibold disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
          >
            {scanning ? 'Scanning...' : 'Scan'}
          </button>
        </div>
        {error && (
          <div className="mt-3 p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg flex items-center gap-2">
            <AlertCircle className="w-5 h-5 text-red-600" />
            <p className="text-red-600 dark:text-red-200">{error}</p>
          </div>
        )}
      </motion.form>

      {/* Bento Grid Dashboard */}
      {auditData && (
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
        >
          {/* SEO Health Score */}
          <motion.div
            variants={itemVariants}
            className="lg:col-span-1 bg-white dark:bg-slate-800 rounded-2xl p-6 shadow-lg hover:shadow-xl transition-shadow duration-300"
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-semibold text-slate-600 dark:text-slate-300">
                SEO Score
              </h3>
              <div className="w-10 h-10 bg-indigo-100 dark:bg-indigo-900/30 rounded-lg flex items-center justify-center">
                <Zap className="w-5 h-5 text-indigo-600" />
              </div>
            </div>
            <div className="flex items-center justify-center mb-4">
              <ResponsiveContainer width="100%" height={120}>
                <PieChart>
                  <Pie
                    data={scoreData}
                    cx="50%"
                    cy="50%"
                    innerRadius={40}
                    outerRadius={60}
                    dataKey="value"
                    startAngle={90}
                    endAngle={-270}
                  >
                    {scoreData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.fill} />
                    ))}
                  </Pie>
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="text-center">
              <p className="text-3xl font-bold text-slate-900 dark:text-white">
                {auditData.seoScore}
              </p>
              <p className={`text-sm font-semibold ${
                auditData.seoScore >= 80
                  ? 'text-green-600'
                  : auditData.seoScore >= 60
                  ? 'text-yellow-600'
                  : 'text-red-600'
              }`}>
                Grade: {auditData.grade || 'N/A'}
              </p>
            </div>
          </motion.div>

          {/* Performance Metrics */}
          <motion.div
            variants={itemVariants}
            className="lg:col-span-2 bg-white dark:bg-slate-800 rounded-2xl p-6 shadow-lg hover:shadow-xl transition-shadow duration-300"
          >
            <div className="flex items-center gap-2 mb-4">
              <Zap className="w-5 h-5 text-amber-600" />
              <h3 className="text-sm font-semibold text-slate-600 dark:text-slate-300">
                Performance Metrics
              </h3>
            </div>
            <ResponsiveContainer width="100%" height={200}>
              <LineChart data={performanceData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
                <XAxis dataKey="name" stroke="#6B7280" />
                <YAxis stroke="#6B7280" />
                <Tooltip />
                <Line
                  type="monotone"
                  dataKey="value"
                  stroke="#F59E0B"
                  strokeWidth={2}
                  dot={{ fill: '#F59E0B' }}
                />
              </LineChart>
            </ResponsiveContainer>
          </motion.div>

          {/* Security Status */}
          <motion.div
            variants={itemVariants}
            className="bg-white dark:bg-slate-800 rounded-2xl p-6 shadow-lg hover:shadow-xl transition-shadow duration-300 flex flex-col justify-between"
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-semibold text-slate-600 dark:text-slate-300">
                Security
              </h3>
              <div className="w-10 h-10 bg-green-100 dark:bg-green-900/30 rounded-lg flex items-center justify-center">
                <Lock className="w-5 h-5 text-green-600" />
              </div>
            </div>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm text-slate-600 dark:text-slate-400">HTTPS</span>
                <span
                  className={`text-sm font-semibold ${
                    auditData.securityStatus?.isHttps
                      ? 'text-green-600'
                      : 'text-red-600'
                  }`}
                >
                  {auditData.securityStatus?.isHttps ? '✓ Secure' : '✗ Insecure'}
                </span>
              </div>
              <div className="w-full h-2 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-indigo-500 to-indigo-600"
                  style={{
                    width: auditData.securityStatus?.isHttps ? '100%' : '0%',
                  }}
                />
              </div>
            </div>
          </motion.div>

          {/* Content Analysis */}
          <motion.div
            variants={itemVariants}
            className="md:col-span-2 lg:col-span-1 bg-white dark:bg-slate-800 rounded-2xl p-6 shadow-lg hover:shadow-xl transition-shadow duration-300"
          >
            <div className="flex items-center gap-2 mb-4">
              <FileText className="w-5 h-5 text-blue-600" />
              <h3 className="text-sm font-semibold text-slate-600 dark:text-slate-300">
                Content
              </h3>
            </div>
            <div className="space-y-3">
              <div>
                <p className="text-xs text-slate-500 dark:text-slate-400 mb-1">
                  Title Length
                </p>
                <p className="text-lg font-bold text-slate-900 dark:text-white">
                  {auditData.contentAnalysis?.titleLength} chars
                </p>
              </div>
              <div>
                <p className="text-xs text-slate-500 dark:text-slate-400 mb-1">
                  Word Count
                </p>
                <p className="text-lg font-bold text-slate-900 dark:text-white">
                  {auditData.contentAnalysis?.wordCount}
                </p>
              </div>
            </div>
          </motion.div>

          {/* Meta Description */}
          <motion.div
            variants={itemVariants}
            className="md:col-span-2 lg:col-span-1 bg-white dark:bg-slate-800 rounded-2xl p-6 shadow-lg hover:shadow-xl transition-shadow duration-300"
          >
            <div className="flex items-center gap-2 mb-3">
              <Globe className="w-5 h-5 text-purple-600" />
              <h3 className="text-sm font-semibold text-slate-600 dark:text-slate-300">
                Meta Description
              </h3>
            </div>
            <p className="text-sm text-slate-600 dark:text-slate-300 line-clamp-3 mb-2">
              {auditData.metaDescription || 'Not found'}
            </p>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              {auditData.contentAnalysis?.metaLength} / 160 characters
            </p>
          </motion.div>

          {/* H1 Status */}
          <motion.div
            variants={itemVariants}
            className="md:col-span-2 lg:col-span-1 bg-white dark:bg-slate-800 rounded-2xl p-6 shadow-lg hover:shadow-xl transition-shadow duration-300"
          >
            <div className="flex items-center gap-2 mb-4">
              <heading className="w-5 h-5 text-red-600" />
              <h3 className="text-sm font-semibold text-slate-600 dark:text-slate-300">
                H1 Tags
              </h3>
            </div>
            <div className="space-y-2">
              <p className="text-2xl font-bold text-slate-900 dark:text-white">
                {auditData.h1Count}
              </p>
              <p
                className={`text-sm ${
                  auditData.h1Count === 1
                    ? 'text-green-600 dark:text-green-400'
                    : 'text-yellow-600 dark:text-yellow-400'
                }`}
              >
                {auditData.h1Count === 0
                  ? 'No H1 tags found'
                  : auditData.h1Count === 1
                  ? 'Perfect: 1 H1 tag'
                  : `Consider using only 1 H1 tag`}
              </p>
            </div>
          </motion.div>

          {/* Images without Alt */}
          <motion.div
            variants={itemVariants}
            className="md:col-span-2 lg:col-span-1 bg-white dark:bg-slate-800 rounded-2xl p-6 shadow-lg hover:shadow-xl transition-shadow duration-300"
          >
            <div className="flex items-center gap-2 mb-4">
              <AlertCircle className="w-5 h-5 text-orange-600" />
              <h3 className="text-sm font-semibold text-slate-600 dark:text-slate-300">
                Missing Alt Tags
              </h3>
            </div>
            <p className="text-2xl font-bold text-slate-900 dark:text-white">
              {auditData.imagesWithoutAlt?.length || 0}
            </p>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-2">
              {auditData.imagesWithoutAlt?.length === 0
                ? '✓ All images have alt tags'
                : `Images need alt text`}
            </p>
          </motion.div>
        </motion.div>
      )}

      {/* Empty State */}
      {!auditData && !loading && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center py-12"
        >
          <Globe className="w-16 h-16 text-slate-300 dark:text-slate-700 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-slate-900 dark:text-white mb-2">
            No audits yet
          </h3>
          <p className="text-slate-600 dark:text-slate-400">
            Start by entering a website URL above to begin your SEO analysis
          </p>
        </motion.div>
      )}
    </div>
  );
};

export default Dashboard;
