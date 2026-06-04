import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';
import { client } from '@/lib/sanity';
import { groq } from 'next-sanity';

// Helper to escape CSV values
function escapeCsv(value: any): string {
  if (value === null || value === undefined) return '';
  const str = String(value);
  // If contains comma, quote, or newline, wrap in quotes and escape quotes
  if (str.includes(',') || str.includes('"') || str.includes('\n')) {
    return `"${str.replace(/"/g, '""')}"`;
  }
  return str;
}

export async function GET(request: NextRequest) {
  try {
    // Check admin authentication
    const isAuthenticated = request.cookies.get('studio_authenticated')?.value === 'true';
    
    if (!isAuthenticated) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    // Check if Supabase is configured
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
    
    if (!supabaseUrl || !supabaseKey || supabaseUrl.includes('placeholder')) {
      return NextResponse.json(
        { error: 'Database not configured' },
        { status: 500 }
      );
    }

    // Fetch quiz config to get questions
    const quiz = await client.fetch(groq`*[_type == "registrationQuiz" && isActive == true][0] {
      questions[] {
        text,
        type,
        options,
        correctOption,
        category
      }
    }`).catch(() => null);

    if (!quiz || !quiz.questions) {
      return NextResponse.json(
        { error: 'Quiz not found' },
        { status: 500 }
      );
    }

    // Fetch all submissions
    const { data: submissions, error } = await supabase
      .from('quiz_submissions')
      .select('*')
      .eq('submitted', true)
      .order('submitted_at', { ascending: true });

    if (error) {
      console.error('Error fetching submissions:', error);
      return NextResponse.json(
        { error: 'Failed to fetch submissions' },
        { status: 500 }
      );
    }

    // Group by team_email and keep only first submission
    const firstSubmissions = (submissions || []).reduce((acc: any[], submission: any) => {
      const existing = acc.find(s => s.team_email === submission.team_email);
      if (!existing) {
        acc.push(submission);
      }
      return acc;
    }, []);

    // Sort by score descending, then by submitted_at ascending (earlier submission wins tie)
    firstSubmissions.sort((a, b) => {
      const scoreDiff = (b.score || 0) - (a.score || 0);
      if (scoreDiff !== 0) return scoreDiff;
      return new Date(a.submitted_at).getTime() - new Date(b.submitted_at).getTime();
    });

    // Point values per question (from the example CSV SCORE row)
    // These should ideally come from Sanity schema, but for now we'll use the values from the example
    // Order: Question 1, 2, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 21a, 21b, 21c, 22, 23, 24, 25, 26, 27, 28, 29
    // Note: Question numbers may not be sequential, so we map by index
    const questionPoints = [5, 3, 2, 10, 3, 2, 3, 4, 5, 4, 5, 3, 5, 1, 5, 5, 1, 5, 3, 3, 3, 3, 2, 3, 2, 8, 13, 5, 3];
    
    // If we have more or fewer questions, pad or truncate
    // For now, we'll use the provided values and extend with 1 if needed
    const getQuestionPoints = (index: number): number => {
      return questionPoints[index] || 1;
    };

    // Filter questions based on vehicle category (use first submission's category as reference)
    // For CSV, we'll include all questions and mark which ones apply to which category
    const allQuestions = quiz.questions;
    const questionMap = new Map<number, any>();
    allQuestions.forEach((q: any, index: number) => {
      questionMap.set(index + 1, q);
    });

    // Build CSV rows
    const csvRows: string[] = [];
    
    // Header row: Score, Timestamp, Team Name, University Name, Country, then Question texts
    const headerRow: string[] = [
      'Score',
      'Timestamp',
      'Team Name ',
      'University Name',
      'Country'
    ];
    
    // Add question headers with full text
    allQuestions.forEach((q: any, index: number) => {
      const questionNum = index + 1;
      const questionText = q.text || `Question ${questionNum}`;
      // Clean up question text - remove extra newlines and format
      const cleanText = questionText.replace(/\n+/g, '\n').trim();
      headerRow.push(`Question ${questionNum}\n\n${cleanText}`);
    });
    
    csvRows.push(headerRow.map(escapeCsv).join(','));

    // Data rows
    firstSubmissions.forEach((submission) => {
      const submittedDate = new Date(submission.submitted_at);
      const timestamp = `${submittedDate.getHours().toString().padStart(2, '0')}:${submittedDate.getMinutes().toString().padStart(2, '0')}`;
      
      // Calculate per-question scores using actual point values
      const answers = submission.answers || {};
      const vehicleCategory = submission.vehicle_category || 'EV';
      const questionScores: (number | string)[] = [];
      let calculatedTotalScore = 0;
      
      allQuestions.forEach((question: any, index: number) => {
        const questionId = index + 1;
        const questionCategory = question.category;
        const questionType = question.type || 'multiple_choice';
        const questionPointsValue = getQuestionPoints(index);
        
        // Skip if question doesn't apply to this vehicle category
        if (questionCategory && questionCategory !== 'common' && questionCategory !== vehicleCategory) {
          questionScores.push(''); // Empty for non-applicable questions
          return;
        }
        
        const answer = answers[questionId];
        
        // Handle open text questions - show the text answer
        if (questionType === 'open_text') {
          if (answer && answer !== 'NO_ANSWER') {
            questionScores.push(answer); // Show the text answer
          } else {
            questionScores.push(''); // Empty if no answer
          }
          return; // Don't add to score calculation
        }
        
        // Handle multiple choice questions - calculate score
        let questionScore = 0;
        if (answer && answer !== 'NO_ANSWER') {
          if (answer === question.correctOption) {
            questionScore = questionPointsValue; // Full points for correct
          } else {
            questionScore = -questionPointsValue * 0.5; // -50% for incorrect
          }
        }
        // Unanswered = 0 (no change)
        
        questionScores.push(questionScore);
        calculatedTotalScore += questionScore;
      });
      
      const row: string[] = [
        String(calculatedTotalScore), // Use recalculated score to match per-question scores
        timestamp,
        submission.team_name || '',
        '', // University Name - not stored, leave empty
        ''  // Country - not stored, leave empty
      ];
      
      // Add per-question scores or text answers
      allQuestions.forEach((question: any, index: number) => {
        const questionCategory = question.category;
        
        // Skip if question doesn't apply to this vehicle category
        if (questionCategory && questionCategory !== 'common' && questionCategory !== vehicleCategory) {
          row.push('');
          return;
        }
        
        // Convert to string - can be number (score) or string (text answer)
        const scoreValue = questionScores[index];
        row.push(typeof scoreValue === 'number' ? String(scoreValue) : (scoreValue || ''));
      });
      
      csvRows.push(row.map(escapeCsv).join(','));
    });

    // Add empty rows for spacing (matching the format)
    csvRows.push(','.repeat(headerRow.length));
    csvRows.push(','.repeat(headerRow.length));

    // Add metadata rows: Vehicle Category, Question numbers, Answers, Scores, etc.
    const metadataRow1: string[] = ['', '', '', '', 'EV'];
    allQuestions.forEach((q: any, index: number) => {
      metadataRow1.push(`Question ${index + 1}`);
    });
    csvRows.push(metadataRow1.map(escapeCsv).join(','));

    // Add ANSWER rows (correct answers)
    const answerRow1: string[] = ['', '', '', '', 'ANSWER 1'];
    allQuestions.forEach((q: any) => {
      const questionType = q.type || 'multiple_choice';
      if (questionType === 'open_text') {
        answerRow1.push(''); // Open text questions don't have a single correct answer
      } else {
        answerRow1.push(q.correctOption || '');
      }
    });
    csvRows.push(answerRow1.map(escapeCsv).join(','));

    // Add ANSWER 2 row (if there are multiple correct answers, otherwise empty)
    const answerRow2: string[] = ['', '', '', '', 'ANSWER 2'];
    allQuestions.forEach(() => {
      answerRow2.push('');
    });
    csvRows.push(answerRow2.map(escapeCsv).join(','));

    // Add SCORE row (points per question) - using actual point values
    // Open text questions don't have point values
    const scoreRow: string[] = ['', '', '', '', 'SCORE'];
    allQuestions.forEach((q: any, index: number) => {
      const questionType = q.type || 'multiple_choice';
      if (questionType === 'open_text') {
        scoreRow.push(''); // Open text questions don't have point values
      } else {
        scoreRow.push(String(getQuestionPoints(index)));
      }
    });
    csvRows.push(scoreRow.map(escapeCsv).join(','));

    // Add BLANC row (empty)
    const blancRow: string[] = ['', '', '', '', 'BLANC'];
    allQuestions.forEach(() => {
      blancRow.push('');
    });
    csvRows.push(blancRow.map(escapeCsv).join(','));

    // Add BASELINE row (perfect score - all correct answers)
    // Calculate baseline as sum of all multiple choice question points (exclude open text)
    const baselineScore = allQuestions.reduce((sum: number, q: any, index: number) => {
      const questionType = q.type || 'multiple_choice';
      if (questionType === 'open_text') {
        return sum; // Don't count open text questions in baseline
      }
      return sum + getQuestionPoints(index);
    }, 0);
    const baselineRow: string[] = [baselineScore, '', '', '', 'BASELINE'];
    allQuestions.forEach((q: any, index: number) => {
      const questionType = q.type || 'multiple_choice';
      if (questionType === 'open_text') {
        baselineRow.push(''); // Open text questions don't have point values
      } else {
        baselineRow.push(String(getQuestionPoints(index)));
      }
    });
    csvRows.push(baselineRow.map(escapeCsv).join(','));

    const csvContent = csvRows.join('\n');

    // Return CSV file
    return new NextResponse(csvContent, {
      status: 200,
      headers: {
        'Content-Type': 'text/csv',
        'Content-Disposition': 'attachment; filename="Formula Hellas Quiz Scores.csv"',
      },
    });
  } catch (error: any) {
    console.error('Error exporting CSV:', error);
    return NextResponse.json(
      { error: 'Failed to export CSV', details: error.message },
      { status: 500 }
    );
  }
}

