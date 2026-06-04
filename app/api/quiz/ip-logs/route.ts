import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

// Get IP logs for admin review
export async function GET(request: NextRequest) {
  try {
    // Optional: Add authentication check here
    // const authHeader = request.headers.get('authorization');
    // if (authHeader !== `Bearer ${process.env.ADMIN_SECRET}`) {
    //   return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    // }

    const { searchParams } = new URL(request.url);
    const limit = parseInt(searchParams.get('limit') || '100');
    const offset = parseInt(searchParams.get('offset') || '0');

    // Get submissions with IP addresses
    const { data, error } = await supabase
      .from('quiz_submissions')
      .select('id, team_name, team_email, ip_address, submitted_at, score, time_taken')
      .order('submitted_at', { ascending: false })
      .range(offset, offset + limit - 1);

    if (error) {
      console.error('Error fetching IP logs:', error);
      return NextResponse.json(
        { error: 'Failed to fetch IP logs' },
        { status: 500 }
      );
    }

    // Group by IP to see multiple submissions from same IP
    const ipGroups: { [key: string]: any[] } = {};
    data?.forEach((submission: any) => {
      const ip = submission.ip_address || 'unknown';
      if (!ipGroups[ip]) {
        ipGroups[ip] = [];
      }
      ipGroups[ip].push(submission);
    });

    // Get IP statistics
    const ipStats = Object.entries(ipGroups).map(([ip, submissions]) => ({
      ip,
      count: submissions.length,
      teams: submissions.map((s: any) => ({
        teamName: s.team_name,
        teamEmail: s.team_email,
        submittedAt: s.submitted_at,
        score: s.score,
        timeTaken: s.time_taken,
      })),
    }));

    return NextResponse.json({
      total: data?.length || 0,
      uniqueIPs: Object.keys(ipGroups).length,
      ipStats: ipStats.sort((a, b) => b.count - a.count), // Sort by count descending
      allSubmissions: data,
    });
  } catch (error) {
    console.error('Error in IP logs endpoint:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
