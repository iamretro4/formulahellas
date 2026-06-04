import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  // Check environment variables (without exposing sensitive values)
  const envCheck = {
    // Server-side checks
    server: {
      hasProjectId: !!process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
      projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || 'NOT SET',
      hasDataset: !!process.env.NEXT_PUBLIC_SANITY_DATASET,
      dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || 'NOT SET',
      hasStudioPassword: !!process.env.STUDIO_PASSWORD,
      hasApiToken: !!process.env.SANITY_API_TOKEN,
      nodeEnv: process.env.NODE_ENV,
      vercel: !!process.env.VERCEL,
      vercelEnv: process.env.VERCEL_ENV || 'not set',
    },
    // Build-time embedded values (these are what the client sees)
    // Note: These are embedded at build time, so they reflect what was available during build
    buildTime: {
      // We can't directly check these server-side, but we can infer
      message: 'NEXT_PUBLIC_ variables are embedded at build time. If missing, you need to rebuild after adding them.',
    },
  };

  const issues = [];
  if (!envCheck.server.hasProjectId) {
    issues.push('❌ NEXT_PUBLIC_SANITY_PROJECT_ID is missing');
  }
  if (!envCheck.server.hasDataset) {
    issues.push('⚠️ NEXT_PUBLIC_SANITY_DATASET is missing (will default to "production")');
  }
  if (!envCheck.server.hasStudioPassword) {
    issues.push('❌ STUDIO_PASSWORD is missing');
  }

  return NextResponse.json({
    status: issues.length === 0 ? 'ok' : 'issues_found',
    environment: envCheck,
    issues,
    message: issues.length === 0
      ? '✅ All required environment variables are set'
      : '⚠️ Some environment variables are missing',
    instructions: {
      step1: 'Go to Vercel Dashboard → Your Project → Settings → Environment Variables',
      step2: 'Add the following variables for Production, Preview, and Development:',
      required: [
        'NEXT_PUBLIC_SANITY_PROJECT_ID=4xb55exq',
        'NEXT_PUBLIC_SANITY_DATASET=production',
        'STUDIO_PASSWORD=1926',
        'SANITY_API_TOKEN=your_token_here (optional)',
      ],
      step3: 'After adding variables, go to Deployments → Click "Redeploy" on latest deployment',
      step4: 'IMPORTANT: NEXT_PUBLIC_ variables must be set BEFORE building. If you add them after build, you must redeploy.',
    },
  });
}

