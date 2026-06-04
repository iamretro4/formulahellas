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

// Formula separator: Google Sheets uses ; in most locales (Europe etc), US uses ,
// Using ; so formulas work after CSV import in more locales; US users can Find & Replace ; with ,
const F = ';';

// Helper function to convert column index to Excel column letter (A, B, C, ..., Z, AA, AB, ...)
function getColumnLetter(colIndex: number): string {
  let result = '';
  colIndex++; // Convert to 1-based
  while (colIndex > 0) {
    colIndex--;
    result = String.fromCharCode(65 + (colIndex % 26)) + result;
    colIndex = Math.floor(colIndex / 26);
  }
  return result;
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

    // If no active quiz, get the latest quiz
    const quizData = quiz || await client.fetch(groq`*[_type == "registrationQuiz"] | order(_createdAt desc)[0] {
      questions[] {
        text,
        type,
        options,
        correctOption,
        category
      }
    }`).catch(() => null);

    if (!quizData || !quizData.questions) {
      return NextResponse.json(
        { error: 'Quiz not found' },
        { status: 500 }
      );
    }

    const allQuestions = quizData.questions;

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

    // Sort by submitted_at ascending (earlier submission wins tie)
    firstSubmissions.sort((a, b) => 
      new Date(a.submitted_at).getTime() - new Date(b.submitted_at).getTime()
    );

    // Build CSV rows
    const csvRows: string[] = [];
    
    // Base columns: Team Name, Email, Vehicle Category, Submission Time, Time Taken
    const baseColumnCount = 5;
    
    // Track column positions for questions
    const questionColumnInfo: Array<{
      weightCol: number;
      correctAnswerCol: number;
      answerCol: number;
      scoreCol: number;
      questionNum: number;
      type: string;
      correctOption?: string;
    }> = [];
    
    let currentCol = baseColumnCount;
    
    // Header row: Team Name, Email, Vehicle Category, Submission Time, Time Taken,
    //              Q1 Weight, Q1 Correct Answer, Q1 Answer, Q1 Score, Q2 Weight, Q2 Correct Answer, Q2 Answer, Q2 Score, ..., Final Score
    const headerRow: string[] = [
      'Team Name',
      'Email',
      'Vehicle Category',
      'Submission Time',
      'Time Taken (seconds)'
    ];
    
    // Add question headers: Weight, Correct Answer, Answer, Score for each question
    allQuestions.forEach((q: any, index: number) => {
      const questionNum = index + 1;
      
      headerRow.push(`Q${questionNum} Weight`);
      const weightCol = currentCol++;
      
      headerRow.push(`Q${questionNum} Correct Answer`);
      const correctAnswerCol = currentCol++;
      
      headerRow.push(`Q${questionNum} Answer`);
      const answerCol = currentCol++;
      
      headerRow.push(`Q${questionNum} Score`);
      const scoreCol = currentCol++;
      
      questionColumnInfo.push({
        weightCol,
        correctAnswerCol,
        answerCol,
        scoreCol,
        questionNum,
        type: q.type || 'multiple_choice',
        correctOption: q.correctOption
      });
    });
    
    headerRow.push('Final Score');
    const finalScoreCol = currentCol;
    
    csvRows.push(headerRow.map(escapeCsv).join(','));

    // Configuration row (Row 2): Contains weights and correct answers for all questions
    const configRow: string[] = [
      'CONFIG: Fill weights and correct answers below. Scores use ; in formulas. US locale: replace ; with , in Score columns if needed.',
      '',
      '',
      '',
      ''
    ];
    
    allQuestions.forEach((q: any, index: number) => {
      const colInfo = questionColumnInfo[index];
      const questionType = q.type || 'multiple_choice';
      
      // Weight column (to be filled manually)
      configRow.push('');
      
      // Correct Answer column (pre-filled for multiple choice, empty for open text)
      if (questionType === 'multiple_choice') {
        configRow.push(q.correctOption || ''); // Pre-fill correct answer for multiple choice
      } else {
        configRow.push(''); // Empty for open text (to be filled manually)
      }
      
      // Empty for answer and score columns (these are for data rows)
      configRow.push('');
      configRow.push('');
    });
    
    configRow.push(''); // Final Score column
    csvRows.push(configRow.map(escapeCsv).join(','));

    // Data rows starting from row 3
    const configRowIndex = 2; // Row 2 is the config row
    let dataRowIndex = 3; // Start data rows at row 3
    
    firstSubmissions.forEach((submission) => {
      const submittedDate = new Date(submission.submitted_at);
      const submissionTime = submittedDate.toISOString().replace('T', ' ').substring(0, 19);
      const timeTaken = submission.time_taken || 0;
      
      const answers = submission.answers || {};
      const vehicleCategory = submission.vehicle_category || 'EV';
      
      const row: string[] = [
        submission.team_name || '',
        submission.team_email || '',
        vehicleCategory,
        submissionTime,
        String(timeTaken)
      ];
      
      const scoreColumns: string[] = []; // For final score formula
      
      // Process each question
      allQuestions.forEach((question: any, index: number) => {
        const questionId = index + 1;
        const questionType = question.type || 'multiple_choice';
        const questionCategory = question.category;
        const colInfo = questionColumnInfo[index];
        
        // Check if question applies to this vehicle category
        const questionApplies = !questionCategory || 
                                questionCategory === 'common' || 
                                questionCategory === vehicleCategory;
        
        if (!questionApplies) {
          // Question doesn't apply - add empty cells for Weight, Correct Answer, Answer, Score
          row.push(''); // Weight
          row.push(''); // Correct Answer
          row.push(''); // Answer
          row.push(''); // Score
          return;
        }
        
        const answer = answers[questionId];
        const answerText = (answer && answer !== 'NO_ANSWER') ? answer : '';
        
        // Weight column - empty (referenced from config row)
        row.push('');
        
        // Correct Answer column - empty (referenced from config row)
        row.push('');
        
        // Add answer
        row.push(answerText);
        
        // Build formula for score column
        // Reference config row (row 2) for weight and correct answer
        const answerColLetter = getColumnLetter(colInfo.answerCol);
        const weightColLetter = getColumnLetter(colInfo.weightCol);
        const correctAnswerColLetter = getColumnLetter(colInfo.correctAnswerCol);
        
        const answerCell = `${answerColLetter}${dataRowIndex}`;
        const weightCell = `${weightColLetter}${configRowIndex}`; // Reference config row
        const correctAnswerCell = `${correctAnswerColLetter}${configRowIndex}`; // Reference config row
        
        // Formula: IF empty -> 0, IF matches correct -> weight, ELSE -> -weight*0.5
        // Use LEN(...)=0 instead of ="", and semicolons, so CSV import doesn't break (no quotes in formula)
        const scoreFormula = `=IF(LEN(TRIM(${answerCell}))=0${F} 0${F} IF(TRIM(${answerCell})=TRIM(${correctAnswerCell})${F} ${weightCell}${F} -${weightCell}*0.5))`;
        
        row.push(scoreFormula);
        scoreColumns.push(`${getColumnLetter(colInfo.scoreCol)}${dataRowIndex}`);
      });
      
      // Build final score formula (sum of all score columns)
      const finalScoreFormula = `=SUM(${scoreColumns.join(F)})`;
      row.push(finalScoreFormula);
      
      csvRows.push(row.map(escapeCsv).join(','));
      dataRowIndex++;
    });

    const csvContent = csvRows.join('\n');

    // Return CSV file
    return new NextResponse(csvContent, {
      status: 200,
      headers: {
        'Content-Type': 'text/csv',
        'Content-Disposition': 'attachment; filename="quiz-scoring-template.csv"',
      },
    });
  } catch (error: any) {
    console.error('Error exporting scoring CSV:', error);
    return NextResponse.json(
      { error: 'Failed to export scoring CSV', details: error.message },
      { status: 500 }
    );
  }
}
