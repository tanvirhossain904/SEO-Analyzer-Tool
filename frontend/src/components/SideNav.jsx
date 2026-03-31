import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useTheme } from '../contexts/ThemeContext';
import {
  BarChart3,
  Clock,
  Home,
  LogOut,
  Moon,
  Settings,
  Sun,
} from 'lucide-react';
import { UserButton, useUser } from '@clerk/clerk-react';

const SideNav = () => {
  const { isDark, toggleTheme } = useTheme();
  const location = useLocation();
  const { user } = useUser();

  const navItems = [
    { icon: Home, label: 'Dashboard', path: '/dashboard' },
    { icon: BarChart3, label: 'Analytics', path: '/analytics' },
    { icon: Clock, label: 'History', path: '/history' },
    { icon: Settings, label: 'Settings', path: '/settings' },
  ];

  const isActive = (path) => location.pathname === path;

  return (
    <aside className="w-64 bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800 min-h-screen flex flex-col transition-colors duration-200">
      {/* Logo */}
      <div className="p-6 border-b border-slate-200 dark:border-slate-800">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gradient-to-br from-indigo-500 to-indigo-700 rounded-lg flex items-center justify-center">
            <BarChart3 className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-slate-900 dark:text-white">
              SEO-Vision
            </h1>
            <p className="text-xs text-slate-500 dark:text-slate-400">Enterprise</p>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-2">
        {navItems.map(({ icon: Icon, label, path }) => (
          <Link
            key={path}
            to={path}
            className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 ${
              isActive(path)
                ? 'bg-indigo-500 text-white shadow-lg'
                : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
            }`}
          >
            <Icon className="w-5 h-5" />
            <span className="font-medium">{label}</span>
          </Link>
        ))}
      </nav>

      {/* User Section */}
      <div className="p-4 border-t border-slate-200 dark:border-slate-800 space-y-3">
        {/* Theme Toggle */}
        <button
          onClick={toggleTheme}
          className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors duration-200"
        >
          {isDark ? (
            <>
              <Sun className="w-5 h-5" />
              <span className="font-medium">Light Mode</span>
            </>
          ) : (
            <>
              <Moon className="w-5 h-5" />
              <span className="font-medium">Dark Mode</span>
            </>
          )}
        </button>

        {/* User Button */}
        <div className="flex items-center justify-between px-2 py-3 rounded-lg bg-slate-50 dark:bg-slate-800">
          <div className="flex-1">
            <p className="text-sm font-medium text-slate-900 dark:text-white">
              {user?.firstName || 'User'}
            </p>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              {user?.primaryEmailAddress?.emailAddress}
            </p>
          </div>
          <UserButton />
        </div>
      </div>
    </aside>
  );
};

export default SideNav;
