// app/api/generate-report/route.ts
// ─── Route API de génération du rapport PDF ──────────────────────────────────
// GET /api/generate-report         → téléchargement PDF
// GET /api/generate-report?preview → affichage inline navigateur

import { NextRequest, NextResponse } from 'next/server'
import { renderToBuffer } from '@react-pdf/renderer'
import React from 'react'
import { ReportPDF } from '../../components/pdf/ReportPDF'
import { REPORT_YEAR } from '../../lib/reportMeta'

// Force Node.js runtime (react-pdf ne fonctionne pas dans l'Edge runtime)
export const runtime = 'nodejs'

// Désactiver le cache statique — le rapport doit refléter les données du moment
export const dynamic = 'force-dynamic'

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const preview = searchParams.has('preview')

  try {
    const pdfBuffer = await renderToBuffer(React.createElement(ReportPDF))
    const pdfBytes  = new Uint8Array(pdfBuffer)

    const filename = `RENT_Tunisia_${REPORT_YEAR}.pdf`
    const disposition = preview ? 'inline' : `attachment; filename="${filename}"`

    return new NextResponse(pdfBytes, {
      status: 200,
      headers: {
        'Content-Type':        'application/pdf',
        'Content-Disposition': disposition,
        'Content-Length':      pdfBytes.byteLength.toString(),
        'Cache-Control':       'no-store',
      },
    })
  } catch (error) {
    console.error('[generate-report] PDF generation failed:', error)

    const message = error instanceof Error ? error.message : 'Unknown error'
    return NextResponse.json(
      {
        error:   'Failed to generate PDF',
        details: message,
        hint:    'Check that @react-pdf/renderer is installed and runtime is nodejs',
      },
      { status: 500 }
    )
  }
}
