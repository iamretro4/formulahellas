'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Home, ArrowLeft, Search, FileText, Calendar, Users } from 'lucide-react';

export default function NotFound() {
  const router = useRouter();
  const quickLinks = [
    { href: '/', label: 'Home', icon: Home },
    { href: '/events', label: 'Events', icon: Calendar },
    { href: '/posts', label: 'News & Posts', icon: FileText },
    { href: '/about', label: 'About Us', icon: Users },
    { href: '/contact', label: 'Contact', icon: Search },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 flex items-center justify-center px-4">
      <div className="max-w-2xl w-full text-center">
        {/* 404 Visual */}
        <div className="mb-8">
          <h1 className="text-9xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-[#0066FF] to-[#0052CC] mb-4">
            404
          </h1>
          <div className="w-24 h-1 bg-gradient-to-r from-[#0066FF] to-[#0052CC] mx-auto mb-6"></div>
        </div>

        {/* Error Message */}
        <div className="mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Page Not Found
          </h2>
          <p className="text-lg text-gray-600 mb-2">
            Oops! The page you're looking for doesn't exist or has been moved.
          </p>
          <p className="text-gray-500">
            Don't worry, let's get you back on track.
          </p>
        </div>

        {/* Quick Links */}
        <div className="mb-8">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Popular Pages
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {quickLinks.map((link) => {
              const Icon = link.icon;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className="flex flex-col items-center justify-center p-4 bg-white rounded-lg border-2 border-gray-200 hover:border-[#0066FF] hover:shadow-lg transition-all group"
                >
                  <Icon className="w-6 h-6 text-gray-600 group-hover:text-[#0066FF] mb-2 transition-colors" />
                  <span className="text-sm font-medium text-gray-700 group-hover:text-[#0066FF] transition-colors">
                    {link.label}
                  </span>
                </Link>
              );
            })}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            href="/"
            className="inline-flex items-center justify-center px-6 py-3 bg-[#0066FF] text-white font-semibold rounded-lg hover:bg-[#0052CC] transition-colors shadow-lg hover:shadow-xl"
          >
            <Home className="w-5 h-5 mr-2" />
            Go to Homepage
          </Link>
          <button
            onClick={() => router.back()}
            className="inline-flex items-center justify-center px-6 py-3 bg-white text-gray-700 font-semibold rounded-lg border-2 border-gray-300 hover:border-[#0066FF] hover:text-[#0066FF] transition-colors"
          >
            <ArrowLeft className="w-5 h-5 mr-2" />
            Go Back
          </button>
        </div>

        {/* Help Text */}
        <div className="mt-12 pt-8 border-t border-gray-200">
          <p className="text-sm text-gray-500">
            If you believe this is an error, please{' '}
            <Link href="/contact" className="text-[#0066FF] hover:underline">
              contact us
            </Link>
            {' '}and let us know what you were looking for.
          </p>
        </div>
      </div>
    </div>
  );
}

