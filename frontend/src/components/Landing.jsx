import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { SignUpButton, SignInButton, useUser } from '@clerk/clerk-react';
import { ArrowRight, BarChart3, Zap, Shield, Sparkles } from 'lucide-react';

const Landing = () => {
  const { isSignedIn } = useUser();

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.3,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.8, ease: 'easeOut' },
    },
  };

  const features = [
    {
      icon: BarChart3,
      title: 'SEO Health Score',
      description: 'Get an instant 0-100 score with detailed breakdowns',
    },
    {
      icon: Zap,
      title: 'Performance Metrics',
      description: 'Monitor LCP, FCP, and overall speed performance',
    },
    {
      icon: Shield,
      title: 'Security Analysis',
      description: 'Check SSL certificates and HTTPS compliance',
    },
    {
      icon: Sparkles,
      title: 'Content Insights',
      description: 'Analyze keywords, meta tags, and content structure',
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-indigo-900 to-slate-900 text-white overflow-hidden">
      {/* Navigation */}
      <nav className="fixed w-full z-50 bg-slate-900/80 backdrop-blur-md border-b border-slate-700/50">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex items-center gap-3"
          >
            <div className="w-10 h-10 bg-gradient-to-br from-indigo-500 to-indigo-700 rounded-lg flex items-center justify-center">
              <BarChart3 className="w-6 h-6 text-white" />
            </div>
            <span className="text-2xl font-bold">SEO-Vision</span>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="flex items-center gap-4"
          >
            {isSignedIn ? (
              <Link
                to="/dashboard"
                className="px-6 py-2 bg-indigo-600 hover:bg-indigo-700 rounded-lg font-semibold transition-colors"
              >
                Dashboard
              </Link>
            ) : (
              <>
                <SignInButton mode="modal">
                  <button className="px-6 py-2 text-indigo-300 hover:text-indigo-100 transition-colors">
                    Sign In
                  </button>
                </SignInButton>
                <SignUpButton mode="modal">
                  <button className="px-6 py-2 bg-indigo-600 hover:bg-indigo-700 rounded-lg font-semibold transition-colors">
                    Get Started
                  </button>
                </SignUpButton>
              </>
            )}
          </motion.div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-32 pb-20 px-6">
        <div className="max-w-6xl mx-auto">
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="space-y-8"
          >
            {/* Main Hero */}
            <motion.div variants={itemVariants} className="text-center space-y-6">
              <h1 className="text-6xl md:text-7xl font-black leading-tight">
                Enterprise SEO{' '}
                <span className="bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
                  Made Simple
                </span>
              </h1>

              <p className="text-xl md:text-2xl text-slate-300 max-w-3xl mx-auto">
                Analyze your website's SEO performance with professional-grade insights.
                Get actionable recommendations to improve rankings and visibility.
              </p>

              <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                {isSignedIn ? (
                  <Link
                    to="/dashboard"
                    className="px-8 py-4 bg-gradient-to-r from-indigo-500 to-indigo-600 hover:from-indigo-600 hover:to-indigo-700 rounded-lg font-bold text-lg flex items-center gap-2 transition-all duration-300 transform hover:scale-105"
                  >
                    Open Dashboard
                    <ArrowRight className="w-5 h-5" />
                  </Link>
                ) : (
                  <SignUpButton mode="modal">
                    <button className="px-8 py-4 bg-gradient-to-r from-indigo-500 to-indigo-600 hover:from-indigo-600 hover:to-indigo-700 rounded-lg font-bold text-lg flex items-center gap-2 transition-all duration-300 transform hover:scale-105">
                      Start Free Trial
                      <ArrowRight className="w-5 h-5" />
                    </button>
                  </SignUpButton>
                )}

                <button className="px-8 py-4 border-2 border-slate-400 hover:border-slate-300 rounded-lg font-bold transition-colors">
                  Learn More
                </button>
              </div>
            </motion.div>

            {/* Floating Cards Animation */}
            <motion.div
              variants={itemVariants}
              className="mt-20 grid grid-cols-1 md:grid-cols-2 gap-4"
            >
              {[
                { label: 'Audits Completed', value: '10,000+' },
                { label: 'Average Score Improvement', value: '+23%' },
              ].map((stat, i) => (
                <motion.div
                  key={i}
                  whileHover={{ scale: 1.05 }}
                  className="bg-slate-800/50 backdrop-blur border border-slate-700/50 rounded-lg p-6"
                >
                  <p className="text-slate-400 text-sm">{stat.label}</p>
                  <p className="text-4xl font-bold text-indigo-400">{stat.value}</p>
                </motion.div>
              ))}
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-6">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-bold mb-4">
              Powerful Features for SEO Excellence
            </h2>
            <p className="text-xl text-slate-400">
              Everything you need to optimize your website's SEO performance
            </p>
          </motion.div>

          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="grid grid-cols-1 md:grid-cols-2 gap-8"
          >
            {features.map(({ icon: Icon, title, description }, i) => (
              <motion.div
                key={i}
                variants={itemVariants}
                whileHover={{ translateY: -5 }}
                className="bg-gradient-to-br from-slate-800/50 to-slate-900/50 backdrop-blur border border-slate-700/50 rounded-2xl p-8 hover:border-indigo-500/50 transition-all duration-300"
              >
                <div className="w-14 h-14 bg-gradient-to-br from-indigo-500 to-indigo-600 rounded-lg flex items-center justify-center mb-6">
                  <Icon className="w-7 h-7 text-white" />
                </div>
                <h3 className="text-xl font-bold mb-3">{title}</h3>
                <p className="text-slate-400">{description}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="max-w-4xl mx-auto bg-gradient-to-r from-indigo-600/20 to-purple-600/20 backdrop-blur border border-indigo-500/50 rounded-2xl p-12 text-center"
        >
          <h2 className="text-4xl font-bold mb-6">
            Ready to Boost Your SEO?
          </h2>
          <p className="text-xl text-slate-300 mb-8">
            Join thousands of businesses using SEO-Vision to improve their organic rankings
          </p>

          {isSignedIn ? (
            <Link
              to="/dashboard"
              className="inline-block px-8 py-4 bg-indigo-600 hover:bg-indigo-700 rounded-lg font-bold transition-colors"
            >
              Go to Dashboard
            </Link>
          ) : (
            <SignUpButton mode="modal">
              <button className="px-8 py-4 bg-indigo-600 hover:bg-indigo-700 rounded-lg font-bold transition-colors">
                Get Started Free
              </button>
            </SignUpButton>
          )}
        </motion.div>
      </section>

      {/* Footer */}
      <footer className="border-t border-slate-800 py-8 px-6">
        <div className="max-w-6xl mx-auto text-center text-slate-400">
          <p>&copy; 2026 SEO-Vision. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};

export default Landing;
