import { revalidatePath, revalidateTag } from 'next/cache';
import { NextRequest, NextResponse } from 'next/server';

// Allowed origins for CORS.
// TODO: update these to the final Formula Hellas domains once confirmed.
const allowedOrigins = [
  'https://formulahellas.gr',
  'https://www.formulahellas.gr',
  'http://localhost:3000',
  'http://localhost:3333',
];

// Helper function to get CORS headers
function getCorsHeaders(origin: string | null) {
  const originHeader = origin && allowedOrigins.includes(origin) ? origin : allowedOrigins[0];
  
  return {
    'Access-Control-Allow-Origin': originHeader,
    'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization, X-Requested-With',
    'Access-Control-Allow-Credentials': 'true',
  };
}

// Handle CORS preflight requests
export async function OPTIONS(request: NextRequest) {
  const origin = request.headers.get('origin');
  return new NextResponse(null, {
    status: 200,
    headers: getCorsHeaders(origin),
  });
}

export async function POST(request: NextRequest) {
  const secret = request.nextUrl.searchParams.get('secret');
  
  // Verify the secret token
  if (secret !== process.env.REVALIDATE_SECRET) {
    const origin = request.headers.get('origin');
    const response = NextResponse.json(
      { message: 'Invalid token' },
      { status: 401 }
    );
    
    // Add CORS headers
    const corsHeaders = getCorsHeaders(origin);
    Object.entries(corsHeaders).forEach(([key, value]) => {
      response.headers.set(key, value);
    });
    
    return response;
  }

  try {
    // Revalidate all pages that use Sanity content
    revalidatePath('/', 'layout');
    revalidatePath('/about');
    revalidatePath('/registration');
    revalidatePath('/events');
    revalidatePath('/rules');
    revalidatePath('/posts');
    
    // Revalidate dynamic routes
    // Note: We can't revalidate specific dynamic paths without knowing them,
    // but revalidating the parent will help
    revalidatePath('/events/[year]', 'page');
    revalidatePath('/posts/[slug]', 'page');
    
    const origin = request.headers.get('origin');
    const response = NextResponse.json({
      revalidated: true,
      now: Date.now(),
      message: 'All pages revalidated successfully',
    });

    // Add CORS headers
    const corsHeaders = getCorsHeaders(origin);
    Object.entries(corsHeaders).forEach(([key, value]) => {
      response.headers.set(key, value);
    });

    return response;
  } catch (err) {
    const origin = request.headers.get('origin');
    const response = NextResponse.json(
      { message: 'Error revalidating', error: err instanceof Error ? err.message : 'Unknown error' },
      { status: 500 }
    );

    // Add CORS headers even for errors
    const corsHeaders = getCorsHeaders(origin);
    Object.entries(corsHeaders).forEach(([key, value]) => {
      response.headers.set(key, value);
    });

    return response;
  }
}

