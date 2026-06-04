import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';
import { client } from '@/lib/sanity';
import { groq } from 'next-sanity';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

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

    // Sort by score descending, then by time ascending
    firstSubmissions.sort((a, b) => {
      if (b.score !== a.score) {
        return b.score - a.score;
      }
      return a.time_taken - b.time_taken;
    });

    // Try to fetch quiz config for question details
    let quizConfig: any = null;
    try {
      const query = groq`*[_type == "registrationQuiz" && isActive == true][0] {
        _id,
        title,
        questions[] {
          text,
          options,
          correctOption
        }
      }`;
      quizConfig = await client.fetch(query).catch(() => null);
    } catch (err) {
      // Continue without quiz config
    }

    // Create PDF
    const doc = new jsPDF();
    
    // Title
    doc.setFontSize(20);
    doc.text('Formula Hellas Registration Quiz - Results', 14, 20);
    
    // Date
    doc.setFontSize(10);
    doc.setTextColor(100, 100, 100);
    doc.text(`Generated: ${new Date().toLocaleString()}`, 14, 30);
    doc.setTextColor(0, 0, 0);

    // Summary statistics
    const totalSubmissions = firstSubmissions.length;
    const totalQuestions = quizConfig?.questions?.length || 
      (firstSubmissions[0]?.questions?.length || 0);
    const averageScore = totalSubmissions > 0
      ? (firstSubmissions.reduce((sum, s) => sum + (s.score || 0), 0) / totalSubmissions).toFixed(2)
      : '0.00';
    const averageTime = totalSubmissions > 0
      ? Math.round(firstSubmissions.reduce((sum, s) => sum + (s.time_taken || 0), 0) / totalSubmissions)
      : 0;

    let yPos = 40;
    doc.setFontSize(12);
    doc.text('Summary Statistics', 14, yPos);
    yPos += 8;
    
    doc.setFontSize(10);
    doc.text(`Total Submissions: ${totalSubmissions}`, 14, yPos);
    yPos += 6;
    doc.text(`Total Questions: ${totalQuestions}`, 14, yPos);
    yPos += 6;
    doc.text(`Average Score: ${averageScore}/${totalQuestions}`, 14, yPos);
    yPos += 6;
    doc.text(`Average Time: ${Math.floor(averageTime / 60)}m ${averageTime % 60}s`, 14, yPos);
    yPos += 10;

    // Results table
    const tableData = firstSubmissions.map((submission, index) => {
      const timeMinutes = Math.floor((submission.time_taken || 0) / 60);
      const timeSeconds = (submission.time_taken || 0) % 60;
      const timeFormatted = `${timeMinutes}m ${timeSeconds}s`;
      const submittedDate = new Date(submission.submitted_at).toLocaleString();
      
      return [
        index + 1,
        submission.team_name || 'N/A',
        submission.team_email || 'N/A',
        `${submission.score || 0}/${totalQuestions}`,
        timeFormatted,
        submittedDate
      ];
    });

    autoTable(doc, {
      head: [['Rank', 'Team Name', 'Email', 'Score', 'Time', 'Submitted At']],
      body: tableData,
      startY: yPos,
      styles: { fontSize: 8 },
      headStyles: { fillColor: [0, 102, 255] },
      alternateRowStyles: { fillColor: [245, 245, 245] },
      margin: { left: 14, right: 14 },
    });

    // Get final Y position after table
    const finalY = (doc as any).lastAutoTable.finalY || yPos + 50;

    // Add page break if needed and add detailed breakdown
    if (quizConfig && quizConfig.questions) {
      doc.addPage();
      doc.setFontSize(16);
      doc.text('Question Breakdown', 14, 20);
      
      let questionY = 30;
      quizConfig.questions.forEach((q: any, index: number) => {
        if (questionY > 250) {
          doc.addPage();
          questionY = 20;
        }
        
        doc.setFontSize(10);
        doc.setFont('helvetica', 'bold');
        doc.text(`Question ${index + 1}: ${q.text}`, 14, questionY);
        questionY += 6;
        
        doc.setFont('helvetica', 'normal');
        doc.setFontSize(9);
        q.options?.forEach((opt: string, optIndex: number) => {
          const isCorrect = opt === q.correctOption;
          if (isCorrect) {
            doc.setTextColor(0, 150, 0);
          } else {
            doc.setTextColor(0, 0, 0);
          }
          doc.text(`${String.fromCharCode(65 + optIndex)}. ${opt}${isCorrect ? ' ✓' : ''}`, 20, questionY);
          questionY += 5;
        });
        doc.setTextColor(0, 0, 0);
        questionY += 5;
      });
    }

    // Generate PDF buffer
    const pdfBuffer = Buffer.from(doc.output('arraybuffer'));

    // Return PDF file
    return new NextResponse(pdfBuffer, {
      status: 200,
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': `attachment; filename="quiz-results-${new Date().toISOString().split('T')[0]}.pdf"`,
      },
    });
  } catch (error: any) {
    console.error('Error exporting PDF:', error);
    return NextResponse.json(
      { error: 'Failed to export PDF', details: error.message },
      { status: 500 }
    );
  }
}

