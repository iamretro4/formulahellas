import { NextRequest, NextResponse } from 'next/server';
import { client } from '@/lib/sanity';
import Papa from 'papaparse';

// Expected CSV format:
// text,option1,option2,option3,option4,correctOption
// "What is...?","Answer A","Answer B","Answer C","Answer D","Answer A"
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

    const formData = await request.formData();
    const file = formData.get('file') as File;

    if (!file) {
      return NextResponse.json(
        { error: 'No file provided' },
        { status: 400 }
      );
    }

    // Read file content
    const text = await file.text();

    // Parse CSV
    const parseResult = Papa.parse(text, {
      header: true,
      skipEmptyLines: true,
      transformHeader: (header) => header.trim().toLowerCase(),
    });

    if (parseResult.errors.length > 0) {
      return NextResponse.json(
        { 
          error: 'CSV parsing errors',
          details: parseResult.errors 
        },
        { status: 400 }
      );
    }

    const rows = parseResult.data as any[];
    
    if (rows.length === 0) {
      return NextResponse.json(
        { error: 'CSV file is empty' },
        { status: 400 }
      );
    }

    // Transform CSV rows to quiz questions
    const questions = rows.map((row, index) => {
      // Extract question text
      const text = row.text || row.question || row['question text'] || '';
      
      // Extract options (option1, option2, etc. or option_1, option_2, etc.)
      const options: string[] = [];
      for (let i = 1; i <= 6; i++) {
        const option = row[`option${i}`] || row[`option_${i}`] || row[`option ${i}`] || '';
        if (option && option.trim()) {
          options.push(option.trim());
        }
      }

      // Extract correct option
      const correctOption = row.correctoption || row['correct option'] || row.correct || '';

      if (!text) {
        throw new Error(`Row ${index + 2}: Missing question text`);
      }

      if (options.length < 2) {
        throw new Error(`Row ${index + 2}: Need at least 2 options`);
      }

      if (!correctOption) {
        throw new Error(`Row ${index + 2}: Missing correct option`);
      }

      // Verify correct option exists in options
      if (!options.includes(correctOption.trim())) {
        throw new Error(`Row ${index + 2}: Correct option "${correctOption}" not found in options`);
      }

      return {
        text: text.trim(),
        options: options,
        correctOption: correctOption.trim(),
      };
    });

    // Get quiz ID from query params or create new quiz
    const { searchParams } = new URL(request.url);
    const quizId = searchParams.get('quizId');
    const title = searchParams.get('title') || 'Formula Hellas Registration Quiz';
    const isActive = searchParams.get('isActive') === 'true';
    const scheduledStartTime = searchParams.get('scheduledStartTime') || null;

    if (quizId) {
      // Update existing quiz
      const updatedQuiz = await client
        .patch(quizId)
        .set({ questions })
        .commit();

      return NextResponse.json({
        success: true,
        message: `Successfully imported ${questions.length} questions`,
        quizId: updatedQuiz._id,
        questionsCount: questions.length,
      });
    } else {
      // Create new quiz
      const newQuiz = await client.create({
        _type: 'registrationQuiz',
        title,
        isActive: isActive,
        scheduledStartTime: scheduledStartTime,
        questions,
        instructions: 'Please read all questions carefully. You have one attempt. Your progress will be saved automatically.',
      });

      return NextResponse.json({
        success: true,
        message: `Successfully created quiz with ${questions.length} questions`,
        quizId: newQuiz._id,
        questionsCount: questions.length,
      });
    }
  } catch (error: any) {
    console.error('Error importing quiz:', error);
    return NextResponse.json(
      { 
        error: 'Failed to import quiz',
        details: error.message || 'Unknown error'
      },
      { status: 500 }
    );
  }
}












