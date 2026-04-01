import React from 'react';
import { Globe, Github, Linkedin, Twitter } from 'lucide-react';
import { Link } from 'react-router-dom';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="border-t dark:border-slate-800 bg-slate-50 dark:bg-slate-900">
      <div className="max-w-7xl mx-auto px-6 py-12">
        <div className="grid md:grid-cols-4 gap-8 mb-8">
          {/* Brand */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <div className="bg-blue-600 p-1.5 rounded-lg text-white">
                <Globe size={20} />
              </div>
              <span className="font-black text-xl dark:text-white">
                SEO<span className="text-blue-600">Vision</span>
              </span>
            </div>
            <p className="text-slate-600 dark:text-slate-400">
              Professional SEO auditing platform built for modern web developers.
            </p>
          </div>

          {/* Product */}
          <div>
            <h4 className="font-bold mb-4 dark:text-white">Product</h4>
            <ul className="space-y-2 text-slate-600 dark:text-slate-400">
              <li><Link to="/" className="hover:text-blue-600 dark:hover:text-blue-400 transition">Features</Link></li>
              <li><button onClick={(e) => e.preventDefault()} className="hover:text-blue-600 dark:hover:text-blue-400 transition text-left">Pricing</button></li>
              <li><button onClick={(e) => e.preventDefault()} className="hover:text-blue-600 dark:hover:text-blue-400 transition text-left">Documentation</button></li>
              <li><button onClick={(e) => e.preventDefault()} className="hover:text-blue-600 dark:hover:text-blue-400 transition text-left">API</button></li>
            </ul>
          </div>

          {/* Company */}
          <div>
            <h4 className="font-bold mb-4 dark:text-white">Company</h4>
            <ul className="space-y-2 text-slate-600 dark:text-slate-400">
              <li><button onClick={(e) => e.preventDefault()} className="hover:text-blue-600 dark:hover:text-blue-400 transition text-left">About</button></li>
              <li><button onClick={(e) => e.preventDefault()} className="hover:text-blue-600 dark:hover:text-blue-400 transition text-left">Blog</button></li>
              <li><button onClick={(e) => e.preventDefault()} className="hover:text-blue-600 dark:hover:text-blue-400 transition text-left">Jobs</button></li>
              <li><button onClick={(e) => e.preventDefault()} className="hover:text-blue-600 dark:hover:text-blue-400 transition text-left">Contact</button></li>
            </ul>
          </div>

          {/* Social */}
          <div>
            <h4 className="font-bold mb-4 dark:text-white">Follow Us</h4>
            <div className="flex gap-4">
              <button onClick={(e) => e.preventDefault()} className="text-slate-600 dark:text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 transition">
                <Twitter size={20} />
              </button>
              <button onClick={(e) => e.preventDefault()} className="text-slate-600 dark:text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 transition">
                <Linkedin size={20} />
              </button>
              <button onClick={(e) => e.preventDefault()} className="text-slate-600 dark:text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 transition">
                <Github size={20} />
              </button>
            </div>
          </div>
        </div>

        {/* Divider */}
        <hr className="dark:border-slate-800 my-8" />

        {/* Bottom */}
        <div className="flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-slate-600 dark:text-slate-400">
            © {currentYear} SEOVision. All rights reserved.
          </p>
          <div className="flex gap-6 text-slate-600 dark:text-slate-400">
            <button onClick={(e) => e.preventDefault()} className="hover:text-blue-600 dark:hover:text-blue-400 transition">Privacy Policy</button>
            <button onClick={(e) => e.preventDefault()} className="hover:text-blue-600 dark:hover:text-blue-400 transition">Terms of Service</button>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
