import { NextResponse } from 'next/server';
import { renderToBuffer } from '@react-pdf/renderer';
import { ReportPDF } from '../../components/ReportPDF';
import React from 'react';  // ← Required for JSX

export async function GET() {
  try {
    const pdfBuffer = await renderToBuffer(<ReportPDF />);
    const pdfBytes = new Uint8Array(pdfBuffer);
    return new NextResponse(pdfBytes, {
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': 'attachment; filename="RENT_Tunisia_2025.pdf"',
      },
    });
  } catch (error) {
    console.error('PDF generation failed:', error);
    return NextResponse.json({ error: 'Failed to generate PDF' }, { status: 500 });
  }
}