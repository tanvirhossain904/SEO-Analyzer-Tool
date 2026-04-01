import React from 'react';
import { Link } from 'react-router-dom';
import { SignInButton, SignUpButton, SignedIn, SignedOut, UserButton } from '@clerk/clerk-react';
import { Moon, Sun, Globe } from 'lucide-react';
import { useTheme } from '../contexts/ThemeContext';
import { motion } from 'framer-motion';

const Navbar = () => {
  const { isDark, toggleTheme } = useTheme();

  return (
    <motion.nav
      className="fixed top-0 w-full z-50 backdrop-blur-md bg-white/80 dark:bg-slate-950/80 border-b dark:border-slate-800"
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ type: 'spring', stiffness: 300, damping: 30 }}
    >
      <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2 font-black text-2xl dark:text-white hover:text-blue-600 dark:hover:text-blue-400 transition">
          <div className="bg-blue-600 p-1.5 rounded-lg text-white">
            <Globe size={24} />
          </div>
          <span>SEO<span className="text-blue-600">Vision</span></span>
        </Link>

        {/* Center Menu */}
        <div className="hidden md:flex items-center gap-8">
          <Link to="/" className="text-slate-600 dark:text-slate-300 hover:text-blue-600 dark:hover:text-blue-400 transition font-medium">
            Home
          </Link>
          <a href="#features" className="text-slate-600 dark:text-slate-300 hover:text-blue-600 dark:hover:text-blue-400 transition font-medium">
            Features
          </a>
          <a href="#pricing" className="text-slate-600 dark:text-slate-300 hover:text-blue-600 dark:hover:text-blue-400 transition font-medium">
            Pricing
          </a>
        </div>

        {/* Right Side */}
        <div className="flex items-center gap-4">
          {/* Dark Mode Toggle */}
          <button
            onClick={toggleTheme}
            className="p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300 transition"
            aria-label="Toggle dark mode"
          >
            {isDark ? <Sun size={20} /> : <Moon size={20} />}
          </button>

          {/* Auth Buttons */}
          <SignedOut>
            <div className="flex gap-2">
              <SignInButton mode="modal">
                <button className="px-4 py-2 text-sm font-semibold text-blue-600 hover:bg-blue-50 dark:hover:bg-slate-800 rounded-lg transition">
                  Sign In
                </button>
              </SignInButton>
              <SignUpButton mode="modal">
                <button className="px-6 py-2 text-sm font-semibold bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition shadow-lg shadow-blue-500/30">
                  Get Started
                </button>
              </SignUpButton>
            </div>
          </SignedOut>

          <SignedIn>
            <Link
              to="/dashboard"
              className="px-4 py-2 text-sm font-semibold bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
            >
              Dashboard
            </Link>
            <UserButton
              appearance={{
                elements: {
                  avatarBox: 'w-10 h-10',
                },
              }}
            />
          </SignedIn>
        </div>
      </div>
    </motion.nav>
  );
};

export default Navbar;
