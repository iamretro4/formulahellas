'use client';

/**
 * This route is responsible for the built-in authoring environment using Sanity Studio.
 * All routes under your studio path is handled by this file using Next.js' catch-all routes:
 * https://nextjs.org/docs/routing/dynamic-routes#catch-all-routes
 *
 * You can learn more about the next-sanity package here:
 * https://github.com/sanity-io/next-sanity
 */

import { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';
import { Lock } from 'lucide-react';
import Button from '@/components/ui/Button';

const Studio = dynamic(
  () =>
    Promise.all([
      import('next-sanity/studio').then((mod) => mod.NextStudio),
      import('../../../sanity.config').catch((err) => {
        console.error('Failed to import sanity.config:', err);
        // Return a minimal config that will show Sanity's error UI
        return {
          default: {
            projectId: '',
            dataset: 'production',
            basePath: '/studio',
          },
        };
      }),
    ]).then(([NextStudio, config]) => {
      return function StudioComponent() {
        // Check if projectId is missing
        if (!config.default?.projectId) {
          return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
              <div className="max-w-md w-full text-center">
                <h2 className="text-2xl font-bold text-red-600 mb-4">Configuration Error</h2>
                <p className="text-gray-600 mb-4">
                  The Sanity project ID is not configured. Please add <code className="bg-gray-100 px-2 py-1 rounded">NEXT_PUBLIC_SANITY_PROJECT_ID</code> to your environment variables.
                </p>
                <p className="text-sm text-gray-500">
                  In Vercel: Go to Settings → Environment Variables and add the variable for Production, Preview, and Development environments.
                </p>
              </div>
            </div>
          );
        }
        return <NextStudio config={config.default} />;
      };
    }).catch((error) => {
      console.error('Failed to load Sanity Studio:', error);
      return function ErrorComponent() {
        return (
          <div className="min-h-screen flex items-center justify-center bg-gray-50">
            <div className="text-center">
              <h2 className="text-2xl font-bold text-red-600 mb-4">Failed to Load Studio</h2>
              <p className="text-gray-600 mb-2">Error: {error.message}</p>
              <p className="text-sm text-gray-500">Please check your environment variables and try again.</p>
            </div>
          </div>
        );
      };
    }),
  {
    ssr: false,
    loading: () => (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading Sanity Studio...</p>
        </div>
      </div>
    ),
  }
);

const getClientEnv = () => {
  if (typeof window === 'undefined') return null;
  return {
    hasProjectId: !!(window as any).__NEXT_DATA__?.env?.NEXT_PUBLIC_SANITY_PROJECT_ID || 
                   process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
    projectId: (window as any).__NEXT_DATA__?.env?.NEXT_PUBLIC_SANITY_PROJECT_ID || 
               process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || 'NOT AVAILABLE IN CLIENT',
    hasDataset: !!(window as any).__NEXT_DATA__?.env?.NEXT_PUBLIC_SANITY_DATASET || 
                process.env.NEXT_PUBLIC_SANITY_DATASET,
  };
};

export default function StudioPage() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isClient] = useState(true);
  const [debugInfo] = useState<any>(() => {
    const clientEnv = getClientEnv();
    if (clientEnv) {
      // Log for debugging
      console.log('Client-side env check:', clientEnv);
      if (!clientEnv.hasProjectId) {
        console.error('⚠️ NEXT_PUBLIC_SANITY_PROJECT_ID is not available in the client bundle. This means it was missing during build time.');
      }
    }
    return clientEnv;
  });

  const checkAuth = async () => {
    try {
      const response = await fetch('/api/studio-auth');
      if (!response.ok) {
        console.error('Auth check failed:', response.status);
        return;
      }
      const data = await response.json();
      if (data.authenticated) {
        setIsAuthenticated(true);
      }
    } catch (err) {
      console.error('Auth check error:', err);
      // Ignore errors, user not authenticated
    }
  };

  useEffect(() => {
    checkAuth();
  }, []);

  const handlePasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    try {
      const response = await fetch('/api/studio-auth', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ password }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        setError(errorData.error || `Server error (${response.status}). Please try again.`);
        setPassword('');
        return;
      }

      const data = await response.json();

      if (data.success) {
        setIsAuthenticated(true);
        setPassword('');
      } else {
        setError(data.error || 'Incorrect password. Please try again.');
        setPassword('');
        
        // If in development and error mentions default password, show helpful message
        if (data.error?.includes('default password')) {
          console.log('💡 Tip: Set STUDIO_PASSWORD in .env.local to use a custom password');
        }
      }
    } catch (err) {
      console.error('Password submit error:', err);
      setError('Network error. Please check your connection and try again.');
      setPassword('');
    }
  };

  if (!isClient) {
    return null; // Prevent hydration mismatch
  }

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="max-w-md w-full space-y-8 p-8 bg-white rounded-lg shadow-lg">
          <div className="text-center">
            <Lock className="mx-auto h-12 w-12 text-gray-400" />
            <h2 className="mt-6 text-3xl font-extrabold text-gray-900">
              Sanity Studio Access
            </h2>
            <p className="mt-2 text-sm text-gray-600">
              Please enter the password to access the content management system
            </p>
            {debugInfo && !debugInfo.hasProjectId && (
              <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded text-left">
                <p className="text-xs text-red-700 font-semibold mb-1">⚠️ Configuration Issue:</p>
                <p className="text-xs text-red-600">
                  Project ID not available in client. This usually means environment variables were added after the build. Please redeploy.
                </p>
              </div>
            )}
          </div>
          <form className="mt-8 space-y-6" onSubmit={handlePasswordSubmit}>
            <div>
              <label htmlFor="password" className="sr-only">
                Password
              </label>
              <input
                id="password"
                name="password"
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="appearance-none rounded-md relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                placeholder="Enter password"
              />
            </div>
            {error && (
              <div className="text-red-600 text-sm text-center">{error}</div>
            )}
            <div>
              <Button type="submit" className="w-full">
                Access Studio
              </Button>
            </div>
          </form>
        </div>
      </div>
    );
  }

  return <Studio />;
}

