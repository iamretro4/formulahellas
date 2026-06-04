import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function GET(request: NextRequest) {
  // Check admin authentication via cookie
  const isAuthenticated = request.cookies.get('studio_authenticated')?.value === 'true';
  
  if (!isAuthenticated) {
    return NextResponse.json(
      { error: 'Unauthorized' },
      { status: 401 }
    );
  }

  try {
    // Check if Supabase is configured
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
    
    if (!supabaseUrl || !supabaseKey || supabaseUrl.includes('placeholder')) {
      console.error('Supabase not configured:', { hasUrl: !!supabaseUrl, hasKey: !!supabaseKey });
      return NextResponse.json(
        { error: 'Database not configured. Please check environment variables.', submissions: [] },
        { status: 500 }
      );
    }

    // Get only the first submission per team (ordered by submitted_at ASC)
    const { data, error } = await supabase
      .from('quiz_submissions')
      .select('*')
      .eq('submitted', true)
      .order('submitted_at', { ascending: true });
    
    if (error) {
      console.error('Error fetching submissions:', error);
      console.error('Error details:', JSON.stringify(error, null, 2));
      return NextResponse.json(
        { 
          error: 'Failed to fetch submissions',
          details: error.message || error.code || 'Unknown error',
          submissions: [] 
        },
        { status: 500 }
      );
    }
    
    // Group by team_email and keep only the first submission for each team
    const firstSubmissions = (data || []).reduce((acc: any[], submission: any) => {
      const existing = acc.find(s => s.team_email === submission.team_email);
      if (!existing) {
        acc.push(submission);
      }
      return acc;
    }, []);
    
    // Sort by submitted_at descending for display
    firstSubmissions.sort((a, b) => 
      new Date(b.submitted_at).getTime() - new Date(a.submitted_at).getTime()
    );

    return NextResponse.json({ submissions: firstSubmissions });
  } catch (error: any) {
    console.error('Error in submissions route:', error);
    console.error('Error stack:', error?.stack);
    return NextResponse.json(
      { 
        error: 'Internal server error',
        details: error?.message || 'Unknown error',
        submissions: [] 
      },
      { status: 500 }
    );
  }
}

