import { NextRequest, NextResponse } from 'next/server';
import { Resend } from 'resend';
import { EMAIL_FROM_NOTIFICATIONS, EMAIL_BASE_URL } from '@/lib/site-config';

function generateFormNotificationEmail(
  formType: string,
  formData: Record<string, any>,
  baseUrl: string = EMAIL_BASE_URL
): string {
  const formatField = (label: string, value: any): string => {
    if (!value || value === '') return '';
    return `
      <tr>
        <td style="padding: 8px 0; font-weight: bold; color: #1f2937; width: 150px; vertical-align: top;">${label}:</td>
        <td style="padding: 8px 0; color: #4b5563;">${typeof value === 'object' ? JSON.stringify(value, null, 2) : String(value)}</td>
      </tr>
    `;
  };

  const fields = Object.entries(formData)
    .map(([key, value]) => {
      const label = key
        .replace(/([A-Z])/g, ' $1')
        .replace(/^./, (str) => str.toUpperCase())
        .trim();
      return formatField(label, value);
    })
    .join('');

  const formTypeLabels: Record<string, string> = {
    judge: 'Judge Application',
    scrutineer: 'Scrutineer Application',
    volunteer: 'Volunteer Application',
    contact: 'Contact Form Submission',
    sponsor: 'Sponsor Application',
  };

  return `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>New ${formTypeLabels[formType] || formType} - Formula Hellas</title>
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
                    <p style="margin: 8px 0 0; color: #6b7280; font-size: 16px;">New ${formTypeLabels[formType] || formType}</p>
                  </td>
                </tr>
                
                <!-- Content -->
                <tr>
                  <td style="padding: 40px;">
                    <h2 style="margin: 0 0 20px; color: #1f2937; font-size: 24px; font-weight: bold;">Form Submission Details</h2>
                    <p style="margin: 0 0 24px; color: #4b5563; font-size: 16px; line-height: 1.6;">
                      A new ${formTypeLabels[formType] || formType} has been submitted.
                    </p>
                    
                    <!-- Form Data -->
                    <div style="background-color: #f9fafb; border-radius: 8px; padding: 24px; margin: 24px 0; border: 1px solid #e5e7eb;">
                      <table role="presentation" style="width: 100%; border-collapse: collapse;">
                        ${fields}
                      </table>
                    </div>
                    
                    <!-- Footer Message -->
                    <div style="margin-top: 32px; padding-top: 24px; border-top: 1px solid #e5e7eb;">
                      <p style="margin: 0; color: #6b7280; font-size: 14px; line-height: 1.6;">
                        This is an automated notification from the Formula Hellas website.
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
    const { formType, formData } = body;

    // Validate required fields
    if (!formType || !formData) {
      return NextResponse.json(
        { error: 'Missing required fields: formType and formData' },
        { status: 400 }
      );
    }

    // Get recipient emails from environment variable (comma-separated)
    const notificationEmails = process.env.NOTIFICATION_EMAILS || process.env.NEXT_PUBLIC_NOTIFICATION_EMAILS || '';
    const recipientEmails = notificationEmails.split(',').map(email => email.trim()).filter(email => email);
    
    if (recipientEmails.length === 0) {
      return NextResponse.json(
        { error: 'No recipient emails configured. Please set NOTIFICATION_EMAILS environment variable.' },
        { status: 400 }
      );
    }

    // Get base URL for logo and links
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 
                    process.env.NEXT_PUBLIC_DOMAIN ? `https://${process.env.NEXT_PUBLIC_DOMAIN}` :
                    new URL(request.url).origin;

    // Generate email HTML
    const emailHtml = generateFormNotificationEmail(formType, formData, baseUrl);

    // Get email configuration
    const RESEND_API_KEY = process.env.RESEND_API_KEY;
    const FROM_EMAIL = EMAIL_FROM_NOTIFICATIONS;

    if (!RESEND_API_KEY) {
      // In development, log the email instead of failing
      if (process.env.NODE_ENV === 'development') {
        console.log('='.repeat(60));
        console.log('FORM NOTIFICATION EMAIL WOULD BE SENT TO:', recipientEmails.join(', '));
        console.log('FORM TYPE:', formType);
        console.log('='.repeat(60));
        console.log('Email HTML preview (first 500 chars):');
        console.log(emailHtml.substring(0, 500));
        console.log('='.repeat(60));
        
        return NextResponse.json(
          { 
            success: true, 
            message: 'Email logged (RESEND_API_KEY not configured)',
            debug: {
              recipients: recipientEmails,
              formType,
              emailLength: emailHtml.length
            }
          },
          { status: 200 }
        );
      }
      
      return NextResponse.json(
        { error: 'Email service not configured. Please set RESEND_API_KEY in environment variables.' },
        { status: 500 }
      );
    }

    // Initialize Resend client
    const resend = new Resend(RESEND_API_KEY);

    // Send email via Resend API
    const { data, error } = await resend.emails.send({
      from: FROM_EMAIL,
      to: recipientEmails,
      subject: `New ${formType.charAt(0).toUpperCase() + formType.slice(1)} Application - Formula Hellas`,
      html: emailHtml,
    });

    if (error) {
      console.error('Resend API error:', error);
      return NextResponse.json(
        { 
          error: 'Failed to send email', 
          details: error.message || 'Unknown error',
          statusCode: error.statusCode
        },
        { status: 500 }
      );
    }

    return NextResponse.json(
      { 
        success: true, 
        message: 'Email sent successfully',
        emailId: data?.id
      },
      { status: 200 }
    );

  } catch (error) {
    console.error('Error sending form notification email:', error);
    return NextResponse.json(
      { error: 'Failed to send email', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}

