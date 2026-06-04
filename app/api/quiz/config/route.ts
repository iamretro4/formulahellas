import { NextResponse } from 'next/server';
import { client } from '@/lib/sanity';
import { groq } from 'next-sanity';
import { getCachedQuiz, setCachedQuiz, shouldRefreshCache } from '@/lib/quiz-cache';

export const revalidate = 30; // Revalidate every 30 seconds (optimized)

export async function GET() {
  try {
    // Check if Sanity client is configured
    const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID;
    if (!projectId) {
      return NextResponse.json(
        { error: 'Sanity client not configured' },
        { status: 500 }
      );
    }

    // Check shared cache first to prevent duplicate API calls
    const cachedData = getCachedQuiz(30000); // 30 second cache
    if (cachedData) {
      // Check if we should refresh cache (near quiz start time)
      if (cachedData.scheduledStartTime && !shouldRefreshCache(cachedData.scheduledStartTime)) {
        const cachedResponse = NextResponse.json(cachedData);
        cachedResponse.headers.set('Cache-Control', 'public, s-maxage=30, stale-while-revalidate=60');
        cachedResponse.headers.set('X-Cache', 'HIT');
        return cachedResponse;
      }
    }

    // First try to get an active quiz
    let quiz = await client.fetch(groq`*[_type == "registrationQuiz" && isActive == true][0] {
      _id,
      title,
      isActive,
      scheduledStartTime,
      redirectToGoogleForms,
      questions[] {
        text,
        type,
        options,
        correctOption,
        category,
        image {
          asset-> {
            _id,
            url,
            metadata {
              dimensions {
                width,
                height
              }
            }
          }
        },
        file {
          asset-> {
            _id,
            url,
            originalFilename,
            size,
            mimeType
          }
        }
      },
      instructions
    }`).catch(() => {
      return null;
    });

    // If no active quiz, get the latest quiz (active or not) so teams can prepare
    if (!quiz) {
      quiz = await client.fetch(groq`*[_type == "registrationQuiz"] | order(_createdAt desc)[0] {
        _id,
        title,
        isActive,
        scheduledStartTime,
        redirectToGoogleForms,
        questions[] {
          text,
          type,
          options,
          correctOption,
          category,
          image {
            asset-> {
              _id,
              url,
              metadata {
                dimensions {
                  width,
                  height
                }
              }
            }
          },
          file {
            asset-> {
              _id,
              url,
              originalFilename,
              size,
              mimeType
            }
          }
        },
        instructions
      }`).catch(() => {
        return null;
      });
    }

    if (!quiz) {
      // Check if there are any quizzes at all
      const allQuizzes = await client.fetch(groq`*[_type == "registrationQuiz"] { _id, title, isActive }`).catch(() => []);
      
      return NextResponse.json(
        { 
          error: 'No quiz found',
          availableQuizzes: allQuizzes.length,
          message: allQuizzes.length === 0 
            ? 'No quiz documents exist in Sanity. Please create one in the Studio.'
            : 'No quiz is currently available.'
        },
        { status: 404 }
      );
    }

    // Store full quiz data in cache (including correctOption for server-side scoring)
    const fullQuizData = {
      id: quiz._id,
      title: quiz.title || 'Formula Hellas Registration Quiz',
      scheduledStartTime: quiz.scheduledStartTime,
      durationMinutes: 120,
      questions: (quiz.questions || []).map((q: any, index: number) => ({
        id: index + 1,
        text: q.text,
        type: q.type || 'multiple_choice',
        options: q.options || [],
        correctOption: q.correctOption, // Include for server-side scoring
        image: q.image?.asset?.url || null,
        file: q.file?.asset ? {
          url: q.file.asset.url,
          filename: q.file.asset.originalFilename || 'download',
          size: q.file.asset.size,
          mimeType: q.file.asset.mimeType,
        } : null,
        category: q.category || 'common',
      })),
      instructions: quiz.instructions || '',
    };

    // Transform questions for client (remove correctOption for security)
    const transformedQuestions = fullQuizData.questions.map((q: any) => {
      const { correctOption, ...questionWithoutAnswer } = q;
      return questionWithoutAnswer;
    });

    // Response data for client (without correctOption)
    const responseData = {
      id: fullQuizData.id,
      title: fullQuizData.title,
      scheduledStartTime: fullQuizData.scheduledStartTime,
      durationMinutes: fullQuizData.durationMinutes,
      questions: transformedQuestions, // No correctOption sent to client
      instructions: fullQuizData.instructions,
      redirectToGoogleForms: quiz.redirectToGoogleForms || false,
    };

    // Update shared cache with full data (includes correctOption for server-side use)
    setCachedQuiz(fullQuizData, quiz._id);

    const response = NextResponse.json(responseData);

    // Add caching headers for scalability (30 seconds cache, stale-while-revalidate for better UX)
    response.headers.set('Cache-Control', 'public, s-maxage=30, stale-while-revalidate=60');
    response.headers.set('X-Cache', 'MISS');
    
    return response;
  } catch {
    return NextResponse.json(
      { error: 'Failed to fetch quiz configuration' },
      { status: 500 }
    );
  }
}

