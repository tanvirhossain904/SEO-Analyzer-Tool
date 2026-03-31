import React from 'react';
import { ClerkProvider, SignedIn, SignedOut, RedirectToSignIn } from '@clerk/clerk-react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { ThemeProvider } from './contexts/ThemeContext';
import SideNav from './components/SideNav';
import Dashboard from './components/Dashboard';
import History from './components/History';
import Landing from './components/Landing';
import './App.css';

// Placeholder components for missing pages
const Analytics = () => (
  <div className="flex-1 bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-950 dark:to-slate-900 p-8 flex items-center justify-center">
    <div className="text-center">
      <h1 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">
        Analytics
      </h1>
      <p className="text-slate-600 dark:text-slate-400">Coming soon...</p>
    </div>
  </div>
);

const Settings = () => (
  <div className="flex-1 bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-950 dark:to-slate-900 p-8 flex items-center justify-center">
    <div className="text-center">
      <h1 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">
        Settings
      </h1>
      <p className="text-slate-600 dark:text-slate-400">Coming soon...</p>
    </div>
  </div>
);

// Protected route wrapper
const ProtectedLayout = ({ children }) => (
  <div className="flex h-screen bg-slate-50 dark:bg-slate-950">
    <SideNav />
    {children}
  </div>
);

function App() {
  const clerkPublishableKey = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY;

  if (!clerkPublishableKey) {
    return (
      <div className="flex items-center justify-center h-screen bg-slate-900 text-white">
        <p>Missing Clerk Publishable Key. Please add VITE_CLERK_PUBLISHABLE_KEY to .env</p>
      </div>
    );
  }

  return (
    <ClerkProvider publishableKey={clerkPublishableKey}>
      <ThemeProvider>
        <BrowserRouter>
          <Routes>
            {/* Public Routes */}
            <Route path="/" element={<Landing />} />

            {/* Protected Routes */}
            <Route
              path="/dashboard"
              element={
                <>
                  <SignedIn>
                    <ProtectedLayout>
                      <Dashboard />
                    </ProtectedLayout>
                  </SignedIn>
                  <SignedOut>
                    <RedirectToSignIn />
                  </SignedOut>
                </>
              }
            />

            <Route
              path="/history"
              element={
                <>
                  <SignedIn>
                    <ProtectedLayout>
                      <History />
                    </ProtectedLayout>
                  </SignedIn>
                  <SignedOut>
                    <RedirectToSignIn />
                  </SignedOut>
                </>
              }
            />

            <Route
              path="/analytics"
              element={
                <>
                  <SignedIn>
                    <ProtectedLayout>
                      <Analytics />
                    </ProtectedLayout>
                  </SignedIn>
                  <SignedOut>
                    <RedirectToSignIn />
                  </SignedOut>
                </>
              }
            />

            <Route
              path="/settings"
              element={
                <>
                  <SignedIn>
                    <ProtectedLayout>
                      <Settings />
                    </ProtectedLayout>
                  </SignedIn>
                  <SignedOut>
                    <RedirectToSignIn />
                  </SignedOut>
                </>
              }
            />

            {/* Catch all */}
            <Route path="*" element={<Landing />} />
          </Routes>
        </BrowserRouter>
      </ThemeProvider>
    </ClerkProvider>
  );
}

export default App;
