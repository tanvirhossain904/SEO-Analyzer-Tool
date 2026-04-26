import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Trash2, ExternalLink, Calendar, TrendingUp } from 'lucide-react';
import { useUser } from '@clerk/clerk-react';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';

const History = () => {
  const { user } = useUser();
  const [audits, setAudits] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchAudits = async () => {
      try {
        setLoading(true);
        const response = await fetch(`${API_URL}/api/v1/audits`, {
          headers: { Authorization: `Bearer ${await user?.getIdToken()}` },
        });

        if (!response.ok) throw new Error('Failed to fetch audits');
        const data = await response.json();
        setAudits(data.audits);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    if (user) {
      fetchAudits();
    }
  }, [user]);

  const handleDelete = async (auditId) => {
    if (!window.confirm('Are you sure you want to delete this audit?')) return;

    try {
      const response = await fetch(`${API_URL}/api/v1/audits/${auditId}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${await user?.getIdToken()}` },
      });

      if (!response.ok) throw new Error('Failed to delete audit');
      setAudits(audits.filter((a) => a._id !== auditId));
    } catch (err) {
      setError(err.message);
    }
  };

  const getGradeColor = (score) => {
    if (score >= 80) return 'text-green-600 bg-green-50 dark:bg-green-900/20';
    if (score >= 60) return 'text-yellow-600 bg-yellow-50 dark:bg-yellow-900/20';
    return 'text-red-600 bg-red-50 dark:bg-red-900/20';
  };

  const getGrade = (score) => {
    if (score >= 90) return 'A';
    if (score >= 80) return 'B';
    if (score >= 70) return 'C';
    if (score >= 60) return 'D';
    return 'F';
  };

  if (loading) {
    return (
      <div className="flex-1 bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-950 dark:to-slate-900 p-8 flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-indigo-200 border-t-indigo-500 rounded-full animate-spin mx-auto mb-4" />
          <p className="text-slate-600 dark:text-slate-400">Loading audits...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-950 dark:to-slate-900 p-8 overflow-y-auto">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <h1 className="text-4xl font-bold text-slate-900 dark:text-white mb-2">
          Audit History
        </h1>
        <p className="text-slate-600 dark:text-slate-400">
          View all previous website audits and their results
        </p>
      </motion.div>

      {error && (
        <div className="mb-4 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg text-red-600 dark:text-red-200">
          {error}
        </div>
      )}

      {audits.length === 0 ? (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center py-12"
        >
          <Calendar className="w-16 h-16 text-slate-300 dark:text-slate-700 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-slate-900 dark:text-white mb-2">
            No audits yet
          </h3>
          <p className="text-slate-600 dark:text-slate-400">
            Your audit history will appear here once you scan websites
          </p>
        </motion.div>
      ) : (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="space-y-4"
        >
          {audits.map((audit, index) => (
            <motion.div
              key={audit._id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              className="bg-white dark:bg-slate-800 rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300"
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <a
                      href={audit.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-lg font-bold text-indigo-600 dark:text-indigo-400 hover:underline flex items-center gap-2"
                    >
                      {new URL(audit.url).hostname}
                      <ExternalLink className="w-4 h-4" />
                    </a>
                    <span className={`px-3 py-1 rounded-full font-bold text-sm ${getGradeColor(audit.seoScore)}`}>
                      Grade: {getGrade(audit.seoScore)}
                    </span>
                  </div>

                  <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mt-4">
                    {/* SEO Score */}
                    <div>
                      <p className="text-xs text-slate-500 dark:text-slate-400 mb-1">
                        SEO Score
                      </p>
                      <p className="text-2xl font-bold text-slate-900 dark:text-white">
                        {audit.seoScore}
                      </p>
                    </div>

                    {/* H1 Tags */}
                    <div>
                      <p className="text-xs text-slate-500 dark:text-slate-400 mb-1">
                        H1 Tags
                      </p>
                      <p className="text-2xl font-bold text-slate-900 dark:text-white">
                        {audit.h1Count}
                      </p>
                    </div>

                    {/* Missing Alts */}
                    <div>
                      <p className="text-xs text-slate-500 dark:text-slate-400 mb-1">
                        Missing Alt Tags
                      </p>
                      <p className="text-2xl font-bold text-red-600">
                        {audit.imagesWithoutAlt?.length || 0}
                      </p>
                    </div>

                    {/* Word Count */}
                    <div>
                      <p className="text-xs text-slate-500 dark:text-slate-400 mb-1">
                        Word Count
                      </p>
                      <p className="text-2xl font-bold text-slate-900 dark:text-white">
                        {audit.contentAnalysis?.wordCount || 0}
                      </p>
                    </div>

                    {/* Scanned Date */}
                    <div>
                      <p className="text-xs text-slate-500 dark:text-slate-400 mb-1">
                        Scanned
                      </p>
                      <p className="text-sm font-semibold text-slate-900 dark:text-white">
                        {new Date(audit.lastScannedAt).toLocaleDateString()}
                      </p>
                    </div>
                  </div>

                  {/* Title & Meta */}
                  <div className="mt-4 p-3 bg-slate-50 dark:bg-slate-900/50 rounded-lg">
                    <p className="text-xs font-semibold text-slate-600 dark:text-slate-300 mb-1">
                      Title
                    </p>
                    <p className="text-sm text-slate-600 dark:text-slate-400 line-clamp-1 mb-3">
                      {audit.title || 'Not found'}
                    </p>
                    <p className="text-xs font-semibold text-slate-600 dark:text-slate-300 mb-1">
                      Meta Description
                    </p>
                    <p className="text-sm text-slate-600 dark:text-slate-400 line-clamp-1">
                      {audit.metaDescription || 'Not found'}
                    </p>
                  </div>
                </div>

                {/* Delete Button */}
                <button
                  onClick={() => handleDelete(audit._id)}
                  className="ml-4 p-2 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors duration-200"
                  title="Delete audit"
                >
                  <Trash2 className="w-5 h-5" />
                </button>
              </div>
            </motion.div>
          ))}
        </motion.div>
      )}
    </div>
  );
};

export default History;
