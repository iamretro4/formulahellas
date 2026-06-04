import { NextResponse } from 'next/server';
import { client } from '@/lib/sanity';
import { groq } from 'next-sanity';

export const revalidate = 30;

// Fetch the latest quiz (active or not) - useful for getting correct answers
export async function GET() {
  try {
    const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID;
    if (!projectId) {
      return NextResponse.json(
        { error: 'Sanity client not configured' },
        { status: 500 }
      );
    }

    // Fetch the most recent quiz (by creation date) regardless of active status
    const query = groq`*[_type == "registrationQuiz"] | order(_createdAt desc)[0] {
      _id,
      title,
      isActive,
      scheduledStartTime,
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
    }`;

    const quiz = await client.fetch(query).catch((error) => {
      console.error('Error fetching latest quiz from Sanity:', error);
      return null;
    });

    if (!quiz) {
      return NextResponse.json(
        { error: 'No quiz found' },
        { status: 404 }
      );
    }

    // Transform questions to match expected format
    const transformedQuestions = (quiz.questions || []).map((q: any, index: number) => ({
      id: q.id || (index + 1),
      text: q.text,
      type: q.type || 'multiple_choice', // Default to multiple_choice for backward compatibility
      options: q.options || [],
      correctOption: q.correctOption,
      image: q.image?.asset?.url || null,
      file: q.file?.asset ? {
        url: q.file.asset.url,
        filename: q.file.asset.originalFilename || 'download',
        size: q.file.asset.size,
        mimeType: q.file.asset.mimeType,
      } : null,
      category: q.category || 'common',
    }));

    return NextResponse.json({
      id: quiz._id,
      title: quiz.title || 'Formula Hellas Registration Quiz',
      scheduledStartTime: quiz.scheduledStartTime,
      isActive: quiz.isActive,
      questions: transformedQuestions,
      instructions: quiz.instructions || '',
    });
  } catch (error) {
    console.error('Error fetching latest quiz:', error);
    return NextResponse.json(
      { error: 'Failed to fetch quiz' },
      { status: 500 }
    );
  }
}

