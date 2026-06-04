import { NextRequest, NextResponse } from 'next/server';
import { writeClient } from '@/lib/sanity';
import { groq } from 'next-sanity';

export async function POST(request: NextRequest) {
  try {
    // Check admin authentication
    const isAuthenticated = request.cookies.get('studio_authenticated')?.value === 'true';
    
    if (!isAuthenticated) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    // Check if Sanity is configured
    const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID;
    if (!projectId) {
      return NextResponse.json(
        { error: 'Sanity client not configured' },
        { status: 500 }
      );
    }

    // Check if token is configured for write operations
    if (!process.env.SANITY_API_TOKEN) {
      return NextResponse.json(
        { error: 'SANITY_API_TOKEN not configured. Write operations require a token.' },
        { status: 500 }
      );
    }

    const body = await request.json();
    const { enabled } = body;

    if (typeof enabled !== 'boolean') {
      return NextResponse.json(
        { error: 'Invalid request. "enabled" must be a boolean.' },
        { status: 400 }
      );
    }

    // Get the active quiz (or latest quiz if none is active)
    const quiz = await writeClient.fetch(groq`*[_type == "registrationQuiz" && isActive == true][0]`).catch(() => null);
    
    let quizId: string;
    if (quiz) {
      quizId = quiz._id;
    } else {
      // If no active quiz, get the latest quiz
      const latestQuiz = await writeClient.fetch(groq`*[_type == "registrationQuiz"] | order(_createdAt desc)[0]`).catch(() => null);
      if (!latestQuiz) {
        return NextResponse.json(
          { error: 'No quiz found. Please create a quiz first.' },
          { status: 404 }
        );
      }
      quizId = latestQuiz._id;
    }

    // Update the redirectToGoogleForms field
    const updatedQuiz = await writeClient
      .patch(quizId)
      .set({ redirectToGoogleForms: enabled })
      .commit();

    return NextResponse.json({
      success: true,
      message: `Google Forms redirect ${enabled ? 'enabled' : 'disabled'}`,
      redirectToGoogleForms: enabled,
      quizId: updatedQuiz._id,
    });
  } catch (error: any) {
    console.error('Error toggling Google Forms redirect:', error);
    return NextResponse.json(
      { 
        error: 'Failed to toggle Google Forms redirect',
        details: error.message || 'Unknown error'
      },
      { status: 500 }
    );
  }
}
