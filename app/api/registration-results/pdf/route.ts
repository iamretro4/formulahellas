import { NextResponse } from 'next/server';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { getRegistrationQuizResults } from '@/lib/registration-results';
import type { RegistrationCategoryResults } from '@/lib/registration-results';

const PAGE_MARGIN = 14;
const TITLE_FONT_SIZE = 18;
const SECTION_FONT_SIZE = 12;
const TABLE_FONT_SIZE = 9;

function addCategoryToPdf(
  doc: jsPDF,
  data: RegistrationCategoryResults,
  startY: number
): number {
  let y = startY;

  doc.setFontSize(SECTION_FONT_SIZE);
  doc.setFont('helvetica', 'bold');
  doc.text(data.title, PAGE_MARGIN, y);
  y += 8;

  data.sections.forEach((section) => {
    if (y > 250) {
      doc.addPage();
      y = 20;
    }

    doc.setFontSize(10);
    doc.setFont('helvetica', 'bold');
    doc.text(section.title, PAGE_MARGIN, y);
    y += 6;

    const tableData = section.rows.map((row) => [
      row.teamName,
      String(row.score),
      row.time || '-',
    ]);

    autoTable(doc, {
      head: [['Team', 'Score', 'Time (h:mm)']],
      body: tableData,
      startY: y,
      styles: { fontSize: TABLE_FONT_SIZE },
      headStyles: { fillColor: [31, 69, 252] },
      alternateRowStyles: { fillColor: [249, 250, 251] },
      margin: { left: PAGE_MARGIN, right: PAGE_MARGIN },
    });

    const lastTable = (doc as unknown as { lastAutoTable: { finalY: number } }).lastAutoTable;
    y = lastTable ? lastTable.finalY + 10 : y + 10;
  });

  return y;
}

export async function GET() {
  try {
    const results = await getRegistrationQuizResults();

    if (!results) {
      return NextResponse.json(
        { error: 'Registration results not available' },
        { status: 404 }
      );
    }

    const doc = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' });

    // Title
    doc.setFontSize(TITLE_FONT_SIZE);
    doc.setFont('helvetica', 'bold');
    doc.text('Formula Hellas 2026 - Registration Quiz Results', PAGE_MARGIN, 20);

    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(100, 100, 100);
    doc.text(`Generated: ${new Date().toLocaleString()}`, PAGE_MARGIN, 28);
    doc.setTextColor(0, 0, 0);

    let y = 36;

    // EV section
    y = addCategoryToPdf(doc, results.ev, y);

    // New page for CV
    doc.addPage();
    y = 20;

    // CV section
    addCategoryToPdf(doc, results.cv, y);

    const pdfBuffer = Buffer.from(doc.output('arraybuffer'));

    return new NextResponse(pdfBuffer, {
      status: 200,
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition':
          'attachment; filename="formula-hellas-2026-registration-results.pdf"',
      },
    });
  } catch (error: unknown) {
    console.error('Registration results PDF export error:', error);
    return NextResponse.json(
      {
        error: 'Failed to generate PDF',
        details: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}
