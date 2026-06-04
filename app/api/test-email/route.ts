import { NextRequest, NextResponse } from 'next/server';

/**
 * Test endpoint for the quiz email function
 * 
 * Usage:
 * POST /api/test-email
 * Body: {
 *   "teamEmail": "test@example.com",
 *   "teamName": "Test Team"
 * }
 * 
 * Or visit GET /api/test-email to see instructions
 */
export async function GET() {
  return NextResponse.json({
    message: 'Quiz Email Test Endpoint',
    instructions: {
      method: 'POST',
      endpoint: '/api/test-email',
      body: {
        teamEmail: 'your-email@example.com',
        teamName: 'Test Team Name',
        timeTaken: 3600, // seconds (optional, defaults to 3600)
        questions: [
          {
            id: 1,
            text: 'What is the maximum speed limit?',
            options: ['100 km/h', '120 km/h', '150 km/h', '200 km/h']
          },
          {
            id: 2,
            text: 'What is the minimum tire pressure?',
            options: ['15 psi', '20 psi', '25 psi', '30 psi']
          }
        ],
        answers: {
          1: '120 km/h',
          2: '25 psi'
        }
      }
    },
    example: {
      curl: `curl -X POST http://localhost:3333/api/test-email \\
  -H "Content-Type: application/json" \\
  -d '{
    "teamEmail": "test@example.com",
    "teamName": "Test Team",
    "timeTaken": 3600,
    "questions": [
      {
        "id": 1,
        "text": "What is the maximum speed limit?",
        "options": ["100 km/h", "120 km/h", "150 km/h", "200 km/h"]
      }
    ],
    "answers": {
      "1": "120 km/h"
    }
  }'`
    }
  });
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { teamEmail, teamName, timeTaken, questions, answers } = body;

    // Validate required fields
    if (!teamEmail || !teamName) {
      return NextResponse.json(
        { 
          error: 'Missing required fields',
          required: ['teamEmail', 'teamName'],
          received: { teamEmail: !!teamEmail, teamName: !!teamName }
        },
        { status: 400 }
      );
    }

    // Use default test data if not provided
    const testTimeTaken = timeTaken || 3600; // 1 hour default
    const testQuestions = questions || [
      {
        id: 1,
        text: 'What is the maximum speed limit for Formula Student vehicles?',
        options: ['100 km/h', '120 km/h', '150 km/h', '200 km/h']
      },
      {
        id: 2,
        text: 'What is the minimum tire pressure required?',
        options: ['15 psi', '20 psi', '25 psi', '30 psi']
      },
      {
        id: 3,
        text: 'How many team members are required for the competition?',
        options: ['2-4', '5-8', '9-12', '13+']
      }
    ];
    const testAnswers = answers || {
      1: '120 km/h',
      2: '25 psi',
      3: '5-8'
    };

    // Call the actual email endpoint
    const emailResponse = await fetch(
      new URL('/api/send-quiz-email', request.url),
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          teamName,
          teamEmail,
          timeTaken: testTimeTaken,
          questions: testQuestions,
          answers: testAnswers,
        }),
      }
    );

    // Check if response is JSON before parsing
    const contentType = emailResponse.headers.get('content-type');
    let emailResult;
    
    if (contentType && contentType.includes('application/json')) {
      try {
        emailResult = await emailResponse.json();
      } catch (parseError) {
        // If JSON parsing fails, return error
        return NextResponse.json({
          success: false,
          test: true,
          error: 'Failed to parse email service response',
          message: 'The email service returned an invalid response. Please check the server logs.',
          details: process.env.NODE_ENV === 'development' 
            ? `Parse error: ${parseError instanceof Error ? parseError.message : String(parseError)}` 
            : undefined,
        }, { status: 500 });
      }
    } else {
      // Response is not JSON (likely HTML error page)
      const textResponse = await emailResponse.text();
      return NextResponse.json({
        success: false,
        test: true,
        error: 'Email service returned non-JSON response',
        message: `The email service returned an error (status ${emailResponse.status}). This usually means the API endpoint has an error.`,
        details: process.env.NODE_ENV === 'development' 
          ? `Response preview: ${textResponse.substring(0, 200)}...` 
          : undefined,
        statusCode: emailResponse.status,
      }, { status: 500 });
    }

    return NextResponse.json({
      success: emailResponse.ok && emailResult?.success !== false,
      test: true,
      emailResult,
      testData: {
        teamName,
        teamEmail,
        timeTaken: testTimeTaken,
        questionsCount: testQuestions.length,
        answersCount: Object.keys(testAnswers).length,
      },
      message: emailResult?.success !== false
        ? '✅ Test email sent successfully!'
        : '⚠️ Email sending failed (check emailResult for details)',
    });
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        error: 'Test failed',
        message: error instanceof Error ? error.message : 'Unknown error',
        details: process.env.NODE_ENV === 'development' ? String(error) : undefined,
      },
      { status: 500 }
    );
  }
}

