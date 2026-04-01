import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { SignUpButton, useUser } from '@clerk/clerk-react';
import { 
  ArrowRight, 
  BarChart3, 
  Zap, 
  Shield, 
  Sparkles, 
  TrendingUp,
  Lock,
  Gauge,
  Code,
  Smartphone,
  Headphones,
  CheckCircle
} from 'lucide-react';
import { useTheme } from '../contexts/ThemeContext';

const Landing = () => {
  const { isSignedIn } = useUser();
  const { isDark } = useTheme();

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1, delayChildren: 0.2 },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.8 } },
  };

  const features = [
    {
      icon: BarChart3,
      title: 'SEO Health Score',
      description: 'Get an instant 0-100 score with detailed breakdowns and actionable insights',
    },
    {
      icon: Zap,
      title: 'Performance Metrics',
      description: 'Monitor LCP, FCP, and overall speed to stay ahead of competitors',
    },
    {
      icon: Shield,
      title: 'Security Analysis',
      description: 'Check SSL certificates, HTTPS compliance, and security headers',
    },
    {
      icon: Sparkles,
      title: 'Content Insights',
      description: 'Analyze keywords, meta tags, and content structure automatically',
    },
    {
      icon: TrendingUp,
      title: 'Historical Tracking',
      description: 'Monitor your improvements over time with detailed audit history',
    },
    {
      icon: Code,
      title: 'Technical SEO',
      description: 'Detect and fix technical issues that impact your rankings',
    },
  ];

  const benefits = [
    'Real-time website analysis',
    'AI-powered recommendations',
    '24-hour smart caching',
    'Multi-user collaboration',
    'PDF report generation',
    'API access for automation',
  ];

  return (
    <div className="pt-20">
      {/* HERO SECTION */}
      <motion.section
        className="py-20 px-6 text-center max-w-5xl mx-auto"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <motion.h1
          className="text-5xl md:text-7xl font-extrabold mb-6 dark:text-white tracking-tight"
          variants={itemVariants}
        >
          Is your SEO <span className="text-blue-600">invisible?</span>
        </motion.h1>

        <motion.p
          className="text-lg text-slate-600 dark:text-slate-400 mb-10 max-w-2xl mx-auto leading-relaxed"
          variants={itemVariants}
        >
          Get a professional-grade audit in seconds. We analyze your metadata, headers, images, and performance to help you climb Google rankings.
        </motion.p>

        <motion.div className="flex gap-4 justify-center mb-20 flex-wrap" variants={itemVariants}>
          {isSignedIn ? (
            <Link
              to="/dashboard"
              className="bg-blue-600 text-white px-8 py-4 rounded-full font-bold hover:bg-blue-700 transition shadow-lg shadow-blue-500/30 flex items-center gap-2 text-lg"
            >
              Go to Dashboard <ArrowRight size={20} />
            </Link>
          ) : (
            <SignUpButton mode="modal">
              <button className="bg-blue-600 text-white px-8 py-4 rounded-full font-bold hover:bg-blue-700 transition shadow-lg shadow-blue-500/30 flex items-center gap-2 text-lg">
                Start Free Trial <ArrowRight size={20} />
              </button>
            </SignUpButton>
          )}
          <a
            href="#features"
            className="border-2 border-blue-600 text-blue-600 dark:text-blue-400 px-8 py-4 rounded-full font-bold hover:bg-blue-50 dark:hover:bg-slate-800 transition text-lg"
          >
            Learn More
          </a>
        </motion.div>

        {/* Stats Section */}
        <motion.div
          className="grid grid-cols-3 gap-4 md:gap-8 mt-16"
          variants={containerVariants}
        >
          {[
            { label: '500+', value: 'Active Users' },
            { label: '50K+', value: 'Audits Run' },
            { label: '99.9%', value: 'Uptime' },
          ].map((stat, idx) => (
            <motion.div key={idx} variants={itemVariants}>
              <div className="text-3xl md:text-4xl font-bold text-blue-600">{stat.label}</div>
              <p className="text-slate-600 dark:text-slate-400 mt-2">{stat.value}</p>
            </motion.div>
          ))}
        </motion.div>
      </motion.section>

      {/* FEATURES SECTION */}
      <section id="features" className="py-24 px-6 bg-slate-50 dark:bg-slate-900">
        <div className="max-w-6xl mx-auto">
          <motion.div
            className="text-center mb-16"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <h2 className="text-5xl font-extrabold mb-4 dark:text-white">
              Powerful Features for <span className="text-blue-600">Modern SEO</span>
            </h2>
            <p className="text-xl text-slate-600 dark:text-slate-400">
              Everything you need to optimize your website and dominate search results
            </p>
          </motion.div>

          <motion.div
            className="grid md:grid-cols-2 lg:grid-cols-3 gap-8"
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
          >
            {features.map((feature, idx) => (
              <motion.div
                key={idx}
                className="bg-white dark:bg-slate-800 p-8 rounded-xl border border-slate-200 dark:border-slate-700 hover:shadow-lg dark:hover:shadow-blue-900/20 transition"
                variants={itemVariants}
                whileHover={{ y: -5 }}
              >
                <feature.icon className="w-12 h-12 text-blue-600 mb-4" />
                <h3 className="text-xl font-bold mb-3 dark:text-white">{feature.title}</h3>
                <p className="text-slate-600 dark:text-slate-400">{feature.description}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section className="py-24 px-6">
        <div className="max-w-6xl mx-auto">
          <motion.div
            className="text-center mb-16"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <h2 className="text-5xl font-extrabold mb-4 dark:text-white">
              How It <span className="text-blue-600">Works</span>
            </h2>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              { step: '1', title: 'Enter URL', description: 'Paste your website URL into our scanner' },
              { step: '2', title: 'Analyze', description: 'We scan your entire website in seconds' },
              { step: '3', title: 'Get Results', description: 'Receive detailed SEO insights and recommendations' },
            ].map((item, idx) => (
              <motion.div
                key={idx}
                className="relative"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: idx * 0.2 }}
                viewport={{ once: true }}
              >
                <div className="text-center">
                  <div className="w-16 h-16 bg-blue-600 text-white rounded-full flex items-center justify-center text-3xl font-bold mx-auto mb-4">
                    {item.step}
                  </div>
                  <h3 className="text-2xl font-bold mb-2 dark:text-white">{item.title}</h3>
                  <p className="text-slate-600 dark:text-slate-400">{item.description}</p>
                </div>
                {idx < 2 && (
                  <div className="hidden md:block absolute right-0 top-8 text-blue-600 text-3xl">→</div>
                )}
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* BENEFITS SECTION */}
      <section className="py-24 px-6 bg-blue-600">
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
            >
              <h2 className="text-5xl font-extrabold text-white mb-8">
                Why Choose SEOVision?
              </h2>
              <div className="space-y-4">
                {benefits.map((benefit, idx) => (
                  <motion.div
                    key={idx}
                    className="flex items-center gap-3"
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.5, delay: idx * 0.1 }}
                    viewport={{ once: true }}
                  >
                    <CheckCircle className="w-6 h-6 text-white flex-shrink-0" />
                    <span className="text-lg text-white">{benefit}</span>
                  </motion.div>
                ))}
              </div>
            </motion.div>

            <motion.div
              className="grid grid-cols-2 gap-4"
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
            >
              {[
                { icon: Gauge, label: 'Fast Scanning' },
                { icon: Lock, label: 'Secure' },
                { icon: TrendingUp, label: 'Accurate' },
                { icon: Headphones, label: '24/7 Support' },
              ].map((item, idx) => (
                <div key={idx} className="bg-white bg-opacity-10 backdrop-blur p-6 rounded-xl text-white text-center">
                  <item.icon className="w-12 h-12 mx-auto mb-3" />
                  <p className="font-semibold">{item.label}</p>
                </div>
              ))}
            </motion.div>
          </div>
        </div>
      </section>

      {/* CTA SECTION */}
      <section className="py-24 px-6 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="max-w-2xl mx-auto"
        >
          <h2 className="text-5xl font-extrabold mb-6 dark:text-white">
            Ready to <span className="text-blue-600">Boost Your SEO?</span>
          </h2>
          <p className="text-xl text-slate-600 dark:text-slate-400 mb-8">
            Get started today with a free trial. No credit card required.
          </p>
          {isSignedIn ? (
            <Link
              to="/dashboard"
              className="inline-block bg-blue-600 text-white px-8 py-4 rounded-full font-bold hover:bg-blue-700 transition shadow-lg shadow-blue-500/30"
            >
              Go to Dashboard
            </Link>
          ) : (
            <SignUpButton mode="modal">
              <button className="bg-blue-600 text-white px-8 py-4 rounded-full font-bold hover:bg-blue-700 transition shadow-lg shadow-blue-500/30">
                Start Free Trial
              </button>
            </SignUpButton>
          )}
        </motion.div>
      </section>
    </div>
  );
};

export default Landing;
