import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { ClerkProvider, SignedIn, SignedOut, RedirectToSignIn } from '@clerk/clerk-react';
import { ThemeProvider } from './contexts/ThemeContext';
import Landing from './components/Landing';
import Dashboard from './components/Dashboard';
import Navbar from './components/Navbar';
import Footer from './components/Footer';

const publishableKey = process.env.REACT_APP_CLERK_PUBLISHABLE_KEY;

const App = () => {
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
      <ThemeProvider>
        <BrowserRouter>
          <div className="min-h-screen bg-white dark:bg-slate-950 transition-colors duration-300">
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
      </ThemeProvider>
    </ClerkProvider>
  );
};

export default App;
