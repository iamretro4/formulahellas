import { NextRequest, NextResponse } from 'next/server';
import { Resend } from 'resend';
import { EMAIL_FROM_QUIZ, EMAIL_REPLY_TO, EMAIL_BASE_URL } from '@/lib/site-config';

// Email template for quiz submission confirmation
function generateEmailTemplate(
  teamName: string,
  timeTaken: number,
  questions: Array<{ id: number; text: string; options: string[] }>,
  answers: Record<number, string>,
  baseUrl: string = EMAIL_BASE_URL
): string {
  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const answersList = questions.map((q, index) => {
    const answer = answers[q.id] || 'No answer';
    const isNoAnswer = answer === 'NO_ANSWER';
    return `
      <tr style="border-bottom: 1px solid #e5e7eb;">
        <td style="padding: 12px 0; vertical-align: top;">
          <strong style="color: #0066FF;">Q${index + 1}.</strong>
        </td>
        <td style="padding: 12px 0; padding-left: 12px;">
          <p style="margin: 0 0 8px 0; color: #1f2937; font-size: 14px;">${q.text}</p>
          <p style="margin: 0; color: ${isNoAnswer ? '#6b7280' : '#059669'}; font-size: 14px; font-style: ${isNoAnswer ? 'italic' : 'normal'};">
            <strong>Your answer:</strong> ${isNoAnswer ? 'No answer' : answer}
          </p>
        </td>
      </tr>
    `;
  }).join('');

  return `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Quiz Submission Confirmation - Formula Hellas</title>
      </head>
      <body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; background-color: #f3f4f6;">
        <table role="presentation" style="width: 100%; border-collapse: collapse;">
          <tr>
            <td style="padding: 40px 20px; text-align: center;">
              <table role="presentation" style="max-width: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 8px; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);">
                <!-- Header -->
                <tr>
                  <td style="padding: 40px 40px 20px; text-align: center; background-color: #ffffff; border-radius: 8px 8px 0 0; border-bottom: 2px solid #e5e7eb;">
                    <img src="${baseUrl}/logo-placeholder.svg" alt="Formula Hellas" style="max-width: 200px; height: auto; margin-bottom: 16px; display: block; margin-left: auto; margin-right: auto;" />
                    <p style="margin: 8px 0 0; color: #6b7280; font-size: 16px;">Registration Quiz Submission</p>
                  </td>
                </tr>
                
                <!-- Content -->
                <tr>
                  <td style="padding: 40px;">
                    <h2 style="margin: 0 0 20px; color: #1f2937; font-size: 24px; font-weight: bold;">Submission Confirmed!</h2>
                    <p style="margin: 0 0 24px; color: #4b5563; font-size: 16px; line-height: 1.6;">
                      Thank you, <strong style="color: #1f2937;">${teamName}</strong>. Your quiz submission has been successfully received and recorded.
                    </p>
                    
                    <!-- Time Taken -->
                    <div style="background-color: #f3f4f6; border-radius: 8px; padding: 24px; margin: 24px 0; text-align: center; border: 2px solid #e5e7eb;">
                      <p style="margin: 0 0 8px; color: #6b7280; font-size: 14px; font-weight: 500; text-transform: uppercase; letter-spacing: 0.5px;">Time Taken</p>
                      <p style="margin: 0; color: #0066FF; font-size: 48px; font-weight: bold; font-variant-numeric: tabular-nums;">${formatTime(timeTaken)}</p>
                      <p style="margin: 8px 0 0; color: #6b7280; font-size: 14px;">minutes:seconds</p>
                    </div>
                    
                    <!-- Answers Summary -->
                    <div style="margin: 32px 0;">
                      <h3 style="margin: 0 0 20px; color: #1f2937; font-size: 20px; font-weight: bold;">Your Answers</h3>
                      <table role="presentation" style="width: 100%; border-collapse: collapse; background-color: #ffffff; border: 1px solid #e5e7eb; border-radius: 8px; overflow: hidden;">
                        ${answersList}
                      </table>
                    </div>
                    
                    <!-- Footer Message -->
                    <div style="margin-top: 32px; padding-top: 24px; border-top: 1px solid #e5e7eb;">
                      <p style="margin: 0 0 12px; color: #6b7280; font-size: 14px; line-height: 1.6;">
                        The correct answers and official rankings will be released after the quiz period has ended for all teams.
                      </p>
                      <p style="margin: 0; color: #6b7280; font-size: 14px; line-height: 1.6;">
                        If you have any questions, please contact the Formula Hellas team.
                      </p>
                    </div>
                  </td>
                </tr>
                
                <!-- Footer -->
                <tr>
                  <td style="padding: 24px 40px; background-color: #f9fafb; border-radius: 0 0 8px 8px; text-align: center; border-top: 1px solid #e5e7eb;">
                    <p style="margin: 0; color: #6b7280; font-size: 12px;">
                      © ${new Date().getFullYear()} Formula Hellas. All rights reserved.
                    </p>
                    <p style="margin: 8px 0 0; color: #9ca3af; font-size: 12px;">
                      This is an automated email. Please do not reply.
                    </p>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
        </table>
      </body>
    </html>
  `;
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { teamName, teamEmail, timeTaken, questions, answers } = body;

    // Validate required fields
    if (!teamName || !teamEmail || timeTaken === undefined || !questions || !answers) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Get base URL for logo and links
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 
                    process.env.NEXT_PUBLIC_DOMAIN ? `https://${process.env.NEXT_PUBLIC_DOMAIN}` :
                    new URL(request.url).origin;

    // Generate email HTML
    const emailHtml = generateEmailTemplate(teamName, timeTaken, questions, answers, baseUrl);

    // Send email using Resend (or your preferred email service)
    const RESEND_API_KEY = process.env.RESEND_API_KEY;
    const FROM_EMAIL = EMAIL_FROM_QUIZ;

    if (!RESEND_API_KEY) {
      // In development, return success but don't send email
      if (process.env.NODE_ENV === 'development') {
        return NextResponse.json(
          { 
            success: true, 
            message: 'Email would be sent (RESEND_API_KEY not configured in development)',
            recipient: teamEmail
          },
          { status: 200 }
        );
      }
      
      // In production, return error but don't fail the submission
      return NextResponse.json(
        { 
          success: false,
          error: 'Email service not configured',
          message: 'Submission was successful, but email could not be sent. Please contact support if you need a confirmation.'
        },
        { status: 200 } // Return 200 so it doesn't fail the submission
      );
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(teamEmail)) {
      return NextResponse.json(
        { 
          success: false,
          error: 'Invalid email address',
          message: 'Submission was successful, but email could not be sent due to invalid email format.'
        },
        { status: 200 } // Return 200 so it doesn't fail the submission
      );
    }

    // Initialize Resend client
    const resend = new Resend(RESEND_API_KEY);

    // Send email via Resend API with retry logic
    const maxRetries = 2;
    let lastError: Error | null = null;
    
    for (let attempt = 1; attempt <= maxRetries; attempt++) {
      try {
        const { data, error } = await resend.emails.send({
          from: FROM_EMAIL,
          to: [teamEmail],
          replyTo: EMAIL_REPLY_TO,
          subject: 'Quiz Submission Confirmation - Formula Hellas',
          html: emailHtml,
        });

        if (error) {
          // If it's a client error (4xx), don't retry
          if (error.statusCode && error.statusCode >= 400 && error.statusCode < 500) {
            console.error('Resend API client error:', error);
            return NextResponse.json(
              { 
                success: false,
                error: 'Email service error',
                message: 'Submission was successful, but email could not be sent. Please contact support if you need a confirmation.',
                details: process.env.NODE_ENV === 'development' ? error.message : undefined
              },
              { status: 200 } // Return 200 so it doesn't fail the submission
            );
          }
          
          // Server error (5xx) - will retry
          lastError = new Error(error.message || 'Resend API error');
          if (attempt < maxRetries) {
            // Wait before retry (exponential backoff)
            await new Promise(resolve => setTimeout(resolve, Math.pow(2, attempt) * 1000));
            continue;
          }
        }

        if (data) {
          return NextResponse.json(
            { 
              success: true, 
              message: 'Email sent successfully',
              emailId: data.id
            },
            { status: 200 }
          );
        }
      } catch (error) {
        lastError = error instanceof Error ? error : new Error(String(error));
        console.error(`Email send attempt ${attempt} failed:`, lastError);
        
        if (attempt < maxRetries) {
          // Wait before retry (exponential backoff)
          await new Promise(resolve => setTimeout(resolve, Math.pow(2, attempt) * 1000));
        }
      }
    }

    // All retries failed - return success but note email failure
    console.error('Email sending failed after all retries:', lastError);
    return NextResponse.json(
      { 
        success: false,
        error: 'Email sending failed after retries',
        message: 'Submission was successful, but email could not be sent after multiple attempts. Please contact support if you need a confirmation.',
        details: process.env.NODE_ENV === 'development' ? (lastError?.message || 'Unknown error') : undefined
      },
      { status: 200 } // Return 200 so it doesn't fail the submission
    );

  } catch (error) {
    // Unexpected error - return success but note email failure
    console.error('Unexpected error in send-quiz-email:', error);
    return NextResponse.json(
      { 
        success: false,
        error: 'Unexpected error',
        message: 'Submission was successful, but email could not be sent. Please contact support if you need a confirmation.',
        details: process.env.NODE_ENV === 'development' ? (error instanceof Error ? error.message : String(error)) : undefined
      },
      { status: 200 } // Return 200 so it doesn't fail the submission
    );
  }
}

