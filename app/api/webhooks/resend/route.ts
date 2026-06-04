import { NextRequest, NextResponse } from 'next/server';
import { Resend } from 'resend';

/**
 * Resend Webhook Handler for Receiving Emails
 * 
 * This endpoint receives email events from Resend when emails are sent to:
 * - info@formulahellas.gr
 * - technical@formulahellas.gr
 * 
 * Documentation: https://resend.com/docs/dashboard/receiving/introduction
 */

export async function POST(request: NextRequest) {
  try {
    // Optional: Verify webhook signature for security
    const webhookSecret = process.env.RESEND_WEBHOOK_SECRET;
    let event: any;

    if (webhookSecret) {
      try {
        const resend = new Resend(process.env.RESEND_API_KEY);
        const body = await request.text();
        const headers = {
          'svix-id': request.headers.get('svix-id') || '',
          'svix-timestamp': request.headers.get('svix-timestamp') || '',
          'svix-signature': request.headers.get('svix-signature') || '',
        };

        // Verify webhook signature using Resend SDK
        event = resend.webhooks.verify({
          payload: body,
          headers: headers as any,
          webhookSecret: webhookSecret,
        });
      } catch (verifyError) {
        console.error('❌ Webhook verification failed:', verifyError);
        return NextResponse.json(
          { error: 'Invalid webhook signature' },
          { status: 401 }
        );
      }
    } else {
      // If no webhook secret is configured, parse JSON directly
      // Note: In production, you should always verify webhooks for security
      event = await request.json();
    }

    // Verify this is an email.received event
    if (event.type !== 'email.received') {
      return NextResponse.json(
        { message: 'Event type not handled', received: event.type },
        { status: 200 }
      );
    }

    const emailData = event.data;
    
    // Extract email information
    const {
      email_id,
      from,
      to,
      subject,
      message_id,
      created_at,
      attachments = [],
    } = emailData;

    // Log the received email (you can customize this to save to database, forward, etc.)
    console.log('📧 Email Received:', {
      emailId: email_id,
      from: from,
      to: to,
      subject: subject,
      messageId: message_id,
      receivedAt: created_at,
      attachmentsCount: attachments.length,
    });

    // Route based on the 'to' address
    const recipient = Array.isArray(to) ? to[0] : to;
    
    if (recipient === 'info@formulahellas.gr') {
      // Handle info@formulahellas.gr emails
      console.log('📬 Processing info@formulahellas.gr email');
      // TODO: Add your custom logic here (save to database, forward, etc.)
    } else if (recipient === 'technical@formulahellas.gr') {
      // Handle technical@formulahellas.gr emails
      console.log('🔧 Processing technical@formulahellas.gr email');
      // TODO: Add your custom logic here (save to database, forward, etc.)
    }

    // Note: The webhook only includes metadata, not the email body or attachments
    // To get the full email content, you need to call the Resend API:
    // GET https://api.resend.com/emails/{email_id}
    // To get attachments:
    // GET https://api.resend.com/emails/{email_id}/attachments/{attachment_id}

    return NextResponse.json(
      { 
        success: true, 
        message: 'Email received and processed',
        emailId: email_id,
        recipient: recipient,
      },
      { status: 200 }
    );

  } catch (error) {
    console.error('❌ Error processing webhook:', error);
    return NextResponse.json(
      { 
        error: 'Failed to process webhook',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}

// Optional: Add GET handler for webhook verification/testing
export async function GET() {
  return NextResponse.json(
    { 
      message: 'Resend webhook endpoint is active',
      endpoint: '/api/webhooks/resend',
      supportedEvents: ['email.received'],
    },
    { status: 200 }
  );
}

