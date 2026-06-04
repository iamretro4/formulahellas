import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const { password } = await request.json();
    
    // Get password from environment variable (server-side only)
    const correctPassword = process.env.STUDIO_PASSWORD || 'admin';
    
    // Debug logging (remove in production if needed)
    if (process.env.NODE_ENV === 'development') {
      console.log('Studio auth attempt:', {
        hasPassword: !!password,
        passwordLength: password?.length || 0,
        hasEnvPassword: !!process.env.STUDIO_PASSWORD,
        envPasswordLength: process.env.STUDIO_PASSWORD?.length || 0,
      });
    }
    
    if (password === correctPassword) {
      const response = NextResponse.json({ success: true });
      
      // Set a secure HTTP-only cookie
      // In production (Vercel), always use secure cookies for HTTPS
      const isProduction = !!process.env.VERCEL || process.env.NODE_ENV === 'production';
      response.cookies.set('studio_authenticated', 'true', {
        httpOnly: true,
        secure: isProduction,
        sameSite: 'lax',
        maxAge: 60 * 60 * 24 * 7, // 7 days
        path: '/',
      });
      
      // Debug logging
      if (process.env.NODE_ENV === 'development') {
        console.log('Studio auth successful, cookie set:', {
          isProduction,
          secure: isProduction,
          path: '/',
        });
      }
      
      return response;
    } else {
      // Provide helpful error message
      const errorMessage = process.env.NODE_ENV === 'development' && !process.env.STUDIO_PASSWORD
        ? `Incorrect password. Since STUDIO_PASSWORD is not set, the default password is 'admin'.`
        : 'Incorrect password. Please try again.';
      
      return NextResponse.json(
        { success: false, error: errorMessage },
        { status: 401 }
      );
    }
  } catch (error) {
    return NextResponse.json(
      { success: false, error: 'Invalid request' },
      { status: 400 }
    );
  }
}

export async function GET(request: NextRequest) {
  // Check if user is authenticated
  const isAuthenticated = request.cookies.get('studio_authenticated')?.value === 'true';
  return NextResponse.json({ authenticated: isAuthenticated });
}

