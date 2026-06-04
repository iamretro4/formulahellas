import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  env: {
    // Environment variables are automatically available in Next.js
    // Client-side variables must be prefixed with NEXT_PUBLIC_
    // Server-side variables can be any name
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'cdn.sanity.io',
      },
    ],
    formats: ['image/avif', 'image/webp'],
    minimumCacheTTL: 60,
  },
  // Performance optimizations
  compress: true,
  poweredByHeader: false,
  // Enable React strict mode for better development experience
  reactStrictMode: true,
  // Use webpack instead of Turbopack to avoid port binding issues
  // Note: Turbopack can have permission issues on some systems
};

export default nextConfig;
