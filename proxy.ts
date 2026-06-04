import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { client } from '@/lib/sanity';
import { groq } from 'next-sanity';

// Paths that should never be redirected
const EXCLUDED_PATHS = [
  '/api',
  '/studio',
  '/_next',
  '/favicon.ico',
  '/logo.png',
  '/next.svg',
  '/vercel.svg',
  '/window.svg',
  '/file.svg',
  '/globe.svg',
];

// Cache for quiz status to avoid hitting Sanity on every request
let quizStatusCache: {
  isActive: boolean;
  testMode: boolean;
  redirectToGoogleForms: boolean;
  timestamp: number;
} | null = null;

const CACHE_DURATION = 30000; // 30 seconds cache

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Allow access to API routes, admin routes, and static files
  if (
    pathname.startsWith('/api') ||
    pathname.startsWith('/_next') ||
    pathname.startsWith('/studio') ||
    pathname.startsWith('/registration-tests/admin') ||
    pathname.match(/\.(ico|png|jpg|jpeg|svg|gif|woff|woff2|ttf|eot)$/) ||
    EXCLUDED_PATHS.some((path) => pathname.startsWith(path))
  ) {
    return NextResponse.next();
  }

  // Check if quiz is active
  try {
    const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID;
    if (!projectId) {
      // If Sanity is not configured, allow normal navigation
      return NextResponse.next();
    }

    // Check cache first
    const now = Date.now();
    let isQuizActive = false;

    if (quizStatusCache && (now - quizStatusCache.timestamp) < CACHE_DURATION) {
      // Use cached value
      isQuizActive = quizStatusCache.isActive;
    } else {
      // Fetch active quiz from Sanity
      const query = groq`*[_type == "registrationQuiz" && isActive == true][0] {
        _id,
        isActive,
        testMode,
        redirectToGoogleForms,
        scheduledStartTime
      }`;

      const quiz = await client.fetch(query).catch((error) => {
        console.error('Error fetching quiz in proxy:', error);
        return null;
      });

      // Check if quiz exists, is marked as active, and is within the scheduled time window
      if (quiz && quiz.isActive && quiz.scheduledStartTime) {
        const startTime = new Date(quiz.scheduledStartTime).getTime();
        const endTime = startTime + (2 * 60 * 60 * 1000); // 2 hours from start
        const currentTime = now;
        
        // Quiz is active only if current time is within the scheduled window
        isQuizActive = currentTime >= startTime && currentTime < endTime;
      } else {
        isQuizActive = false;
      }

      // Update cache
      quizStatusCache = {
        isActive: isQuizActive,
        testMode: quiz?.testMode || false,
        redirectToGoogleForms: quiz?.redirectToGoogleForms || false,
        timestamp: now,
      };
    }

    // If quiz is active and NOT in test mode, redirect appropriately
    if (isQuizActive && !quizStatusCache?.testMode) {
      // Check if Google Forms redirect is enabled
      if (quizStatusCache?.redirectToGoogleForms) {
        // Redirect to Google Forms (for all paths including /registration-tests)
        return NextResponse.redirect('https://forms.gle/f4QXcT2t2Csm9ooGA');
      } else {
        // Only redirect to /registration-tests if not already there
        if (pathname !== '/registration-tests') {
          const redirectUrl = new URL('/registration-tests', request.url);
          // Preserve query parameters if any
          redirectUrl.search = request.nextUrl.search;
          return NextResponse.redirect(redirectUrl);
        }
      }
    }
  } catch (error) {
    // On error, allow normal navigation (fail open)
    console.error('Proxy error:', error);
  }

  return NextResponse.next();
}

// Configure which routes this proxy should run on
export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public files (images, etc.)
     */
    '/((?!api|_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
};
