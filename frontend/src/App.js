import React, { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { ClerkProvider, SignedIn, SignedOut, RedirectToSignIn } from '@clerk/clerk-react';
import { ThemeContext } from './contexts/ThemeContext';
import Landing from './components/Landing';
import Dashboard from './components/Dashboard';
import Navbar from './components/Navbar';
import Footer from './components/Footer';

const publishableKey = process.env.REACT_APP_CLERK_PUBLISHABLE_KEY;

const App = () => {
  const [darkMode, setDarkMode] = useState(() => {
    const saved = localStorage.getItem('darkMode');
    return saved ? JSON.parse(saved) : false;
  });

  useEffect(() => {
    localStorage.setItem('darkMode', JSON.stringify(darkMode));
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [darkMode]);

  const toggleDarkMode = () => setDarkMode(!darkMode);

  if (!publishableKey) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-red-50">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-red-600 mb-4">Configuration Error</h1>
          <p className="text-gray-600 mb-2">Clerk Publishable Key is not set.</p>
          <p className="text-gray-600">Check your .env.local file for REACT_APP_CLERK_PUBLISHABLE_KEY</p>
        </div>
      </div>
    );
  }

  return (
    <ClerkProvider publishableKey={publishableKey}>
      <ThemeContext.Provider value={{ darkMode, toggleDarkMode }}>
        <BrowserRouter>
          <div className={`min-h-screen bg-white dark:bg-slate-950 transition-colors duration-300 ${darkMode ? 'dark' : ''}`}>
            <Navbar />
            <Routes>
              <Route path="/" element={<Landing />} />
              <Route
                path="/dashboard"
                element={
                  <SignedIn>
                    <Dashboard />
                  </SignedIn>
                }
              />
              <Route
                path="/dashboard"
                element={
                  <SignedOut>
                    <RedirectToSignIn />
                  </SignedOut>
                }
              />
            </Routes>
            <Footer />
          </div>
        </BrowserRouter>
      </ThemeContext.Provider>
    </ClerkProvider>
  );
};

export default App;
