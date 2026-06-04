import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';
import { client } from '@/lib/sanity';
import { groq } from 'next-sanity';
import { getCachedQuiz } from '@/lib/quiz-cache';

// Check if team submitted
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const teamEmail = searchParams.get('teamEmail');

    if (!teamEmail) {
      return NextResponse.json(
        { error: 'Team email is required' },
        { status: 400 }
      );
    }

    // Get the first submission (ordered by submitted_at ASC to get the earliest)
    const { data, error } = await supabase
      .from('quiz_submissions')
      .select('id, submitted_at, submitted, time_taken, score')
      .eq('team_email', teamEmail)
      .eq('submitted', true)
      .order('submitted_at', { ascending: true })
      .limit(1)
      .maybeSingle();

    if (error && error.code !== 'PGRST116') {
      return NextResponse.json(
        { error: 'Failed to check submission' },
        { status: 500 }
      );
    }

    return NextResponse.json({ submitted: !!data, submission: data || null });
  } catch {
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    // Check if Supabase is configured
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
    
    if (!supabaseUrl || !supabaseKey || supabaseUrl.includes('placeholder')) {
      return NextResponse.json(
        { error: 'Database not configured. Please contact support.' },
        { status: 500 }
      );
    }

    // Extract IP address from request headers
    const getClientIP = (request: NextRequest): string => {
      // Check various headers for IP (Vercel, Cloudflare, etc.)
      const forwardedFor = request.headers.get('x-forwarded-for');
      const realIP = request.headers.get('x-real-ip');
      const cfConnectingIP = request.headers.get('cf-connecting-ip');
      
      if (forwardedFor) {
        // x-forwarded-for can contain multiple IPs, take the first one
        return forwardedFor.split(',')[0].trim();
      }
      if (realIP) {
        return realIP;
      }
      if (cfConnectingIP) {
        return cfConnectingIP;
      }
      // Fallback if no IP headers found
      return 'unknown';
    };

    const clientIP = getClientIP(request);

    const body = await request.json();
    const { teamName, teamEmail, vehicleCategory, preferredTeamNumber, alternativeTeamNumber, fuelType, answers, timeTaken, questions } = body;

    if (!teamName || !teamEmail || !answers) {
      return NextResponse.json(
        { error: 'Missing required fields', received: { teamName: !!teamName, teamEmail: !!teamEmail, answers: !!answers } },
        { status: 400 }
      );
    }

    // Log IP address for verification (rate limiting can be added here if needed)
    // For 200 concurrent users, Vercel's edge network handles load balancing
    console.log(`[QUIZ SUBMISSION] IP: ${clientIP}, Email: ${teamEmail}, Team: ${teamName}, Time: ${new Date().toISOString()}`);
    
    // Basic validation: prevent empty submissions
    if (Object.keys(answers || {}).length === 0) {
      return NextResponse.json(
        { error: 'No answers provided' },
        { status: 400 }
      );
    }

    // SECURITY: Calculate score server-side using correct answers from Sanity
    // Never trust client-calculated score
    let calculatedScore = 0;
    try {
      // Try to use cached quiz data first (reduces API calls)
      // Cache is safe because questions don't change during active quiz period
      let quiz: any = null;
      const cachedQuiz = getCachedQuiz(60000); // 60 second cache for scoring
      
      if (cachedQuiz && cachedQuiz.questions) {
        // Use cached quiz data - safe because questions are set before quiz activation
        quiz = {
          questions: cachedQuiz.questions.map((q: any) => ({
            text: q.text,
            type: q.type,
            options: q.options,
            correctOption: q.correctOption, // Needed for scoring
            category: q.category,
          })),
        };
      } else {
        // Fallback to fresh fetch if cache unavailable
        const quizPromise = client.fetch(groq`*[_type == "registrationQuiz" && isActive == true][0] {
          questions[] {
            text,
            type,
            options,
            correctOption,
            category
          }
        }`);
        
        const timeoutPromise = new Promise((_, reject) => 
          setTimeout(() => reject(new Error('Sanity fetch timeout')), 10000)
        );
        
        quiz = await Promise.race([quizPromise, timeoutPromise]).catch(() => null) as any;
      }

      if (quiz && quiz.questions && Array.isArray(quiz.questions) && quiz.questions.length > 0) {
        // Filter questions based on vehicle category
        const filteredQuestions = quiz.questions.filter((q: any) => 
          !q.category || q.category === 'common' || q.category === vehicleCategory
        );

        // Calculate score: correct = full points, incorrect = -50%, unanswered = 0
        // Open text questions are not auto-scored
        filteredQuestions.forEach((question: any, index: number) => {
          const questionId = index + 1;
          const answer = answers[questionId];
          const questionType = question.type || 'multiple_choice';
          
          // Skip scoring for open text questions
          if (questionType === 'open_text') {
            return; // Open text questions are not auto-scored
          }
          
          if (answer && answer !== 'NO_ANSWER') {
            if (answer === question.correctOption) {
              calculatedScore += 1; // Full points for correct
            } else {
              calculatedScore -= 0.5; // -50% for incorrect
            }
          }
          // Unanswered = 0 points (no change)
        });
      } else {
        // Quiz not found or no questions - log but allow submission with 0 score
        console.warn('Quiz not found or has no questions, allowing submission with score 0');
        calculatedScore = 0;
      }
    } catch (error) {
      console.error('Error calculating score:', error);
      // If score calculation fails, allow submission with 0 score rather than blocking
      // This prevents legitimate submissions from being rejected due to temporary Sanity issues
      calculatedScore = 0;
      console.warn('Score calculation failed, proceeding with score 0');
    }

    // Prepare submission data
    const submissionData: any = {
      team_name: teamName,
      team_email: teamEmail,
      vehicle_category: vehicleCategory,
      preferred_team_number: preferredTeamNumber,
      alternative_team_number: alternativeTeamNumber,
      fuel_type: fuelType,
      time_taken: timeTaken,
      score: calculatedScore, // Use server-calculated score (supports decimals: correct = +1, incorrect = -0.5)
      questions: questions,
      answers: answers,
      submitted: true,
      submitted_at: new Date().toISOString(),
    };

    // Add IP address to submission data
    submissionData.ip_address = clientIP;

    // Use database-level transaction to prevent race conditions
    // First, try to insert with conflict handling - this is atomic
    const { data, error } = await supabase
      .from('quiz_submissions')
      .insert([submissionData])
      .select()
      .single();

    if (error) {
      // Check if it's a unique constraint violation (duplicate email) - race condition detected
      if (error.code === '23505' || error.message?.includes('duplicate') || error.message?.includes('unique')) {
        // Another submission happened simultaneously - fetch the first one
        const { data: firstSubmission } = await supabase
          .from('quiz_submissions')
          .select('id, submitted_at, time_taken, score')
          .eq('team_email', teamEmail)
          .order('submitted_at', { ascending: true })
          .limit(1)
          .maybeSingle();
        
        return NextResponse.json(
          { 
            error: 'Team has already submitted the quiz. Only the first submission is kept.',
            submissionId: firstSubmission?.id,
            alreadySubmitted: true,
            submission: firstSubmission || null
          },
          { status: 400 }
        );
      }
      
      // For other errors, log but don't expose internal details
      return NextResponse.json(
        { 
          error: 'Failed to save submission. Please try again.',
          details: process.env.NODE_ENV === 'development' ? error.message : undefined
        },
        { status: 500 }
      );
    }

    // Delete progress after successful submission
    await supabase
      .from('quiz_progress')
      .delete()
      .eq('team_email', teamEmail);

    return NextResponse.json({ success: true, submissionId: data.id });
  } catch (error) {
    // Log error for monitoring but don't expose details to client
    console.error('[QUIZ SUBMISSION ERROR]', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    return NextResponse.json(
      { 
        error: 'An error occurred while submitting. Please try again.',
        details: process.env.NODE_ENV === 'development' ? errorMessage : undefined
      },
      { status: 500 }
    );
  }
}

