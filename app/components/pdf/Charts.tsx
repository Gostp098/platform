// app/components/pdf/Charts.tsx
// ─── Graphiques SVG pour le rapport PDF ─────────────────────────────────────
// Tous les graphiques utilisent @react-pdf/renderer SVG — pas de canvas,
// pas de dépendances externes (fonctionne côté serveur Next.js).

import React from 'react'
import { Svg, Circle, Path, Line, Rect, Text as SvgText, G, Polygon } from '@react-pdf/renderer'
import {
  NAVY, GOLD, SLATE, BORDER, WHITE,
  PILIER_ORDER, PILIER_SCORES, PILIER_LABELS, PILIER_COLORS,
  STATUT_COLORS,
} from '../../lib/reportMeta'

// ─── GAUGE CHART ─────────────────────────────────────────────────────────────
// Jauge semi-circulaire. Utilisée pour IMNT global et par pilier.
// Props:
//   score   : 0–100
//   color   : couleur de l'arc actif
//   size    : 'lg' (page entière) | 'sm' (bloc pilier)

interface GaugeProps {
  score: number
  color?: string
  size?: 'lg' | 'sm'
}

export function GaugeChart({ score, color = GOLD, size = 'lg' }: GaugeProps) {
  const isLg = size === 'lg'
  const W = isLg ? 200 : 130
  const H = isLg ? 120 : 80
  const CX = W / 2
  const CY = isLg ? 105 : 68
  const R  = isLg ? 80 : 52
  const SW = isLg ? 14 : 9

  // Arc background : de 180° à 0° (semi-cercle)
  const bgStart = { x: CX - R, y: CY }
  const bgEnd   = { x: CX + R, y: CY }
  const bgPath  = `M ${bgStart.x} ${bgStart.y} A ${R} ${R} 0 0 1 ${bgEnd.x} ${bgEnd.y}`

  // Arc actif : de 180° jusqu'à l'angle correspondant au score
  const fraction = Math.min(Math.max(score / 100, 0), 1)
  const angleRad = Math.PI - fraction * Math.PI
  const activeEnd = {
    x: CX + R * Math.cos(angleRad),
    y: CY - R * Math.sin(angleRad),
  }
  const largeArc = fraction > 0.5 ? 1 : 0
  const activePath = `M ${bgStart.x} ${bgStart.y} A ${R} ${R} 0 ${largeArc} 1 ${activeEnd.x} ${activeEnd.y}`

  // Aiguille
  const needleX = CX + (R - SW / 2) * Math.cos(angleRad)
  const needleY = CY - (R - SW / 2) * Math.sin(angleRad)

  const scoreText = score % 1 === 0 ? score.toString() : score.toFixed(1)
  const fontSize1 = isLg ? 22 : 15
  const fontSize2 = isLg ? 9  : 7

  return (
    <Svg width={W} height={H} viewBox={`0 0 ${W} ${H}`}>
      {/* track */}
      <Path d={bgPath} stroke={BORDER} strokeWidth={SW} fill="none" strokeLinecap="round" />
      {/* active arc */}
      <Path d={activePath} stroke={color} strokeWidth={SW} fill="none" strokeLinecap="round" />
      {/* needle dot */}
      <Circle cx={needleX} cy={needleY} r={isLg ? 4 : 3} fill={NAVY} />
      {/* pivot */}
      <Circle cx={CX} cy={CY} r={isLg ? 5 : 3.5} fill={NAVY} />
      {/* score text */}
      <SvgText
        x={CX} y={CY - (isLg ? 16 : 10)}
        style={{ fontSize: fontSize1, fontWeight: 'bold' }} fill={NAVY} textAnchor="middle"
      >
        {scoreText}
      </SvgText>
      <SvgText
        x={CX} y={CY - (isLg ? 2 : 0)}
        style={{ fontSize: fontSize2 }} fill={SLATE} textAnchor="middle"
      >
        /100
      </SvgText>
      {/* scale marks */}
      <SvgText x={CX - R - 4} y={CY + 10} style={{ fontSize: isLg ? 7 : 6 }} fill={SLATE} textAnchor="end">0</SvgText>
      <SvgText x={CX + R + 4} y={CY + 10} style={{ fontSize: isLg ? 7 : 6 }} fill={SLATE}>100</SvgText>
    </Svg>
  )
}

// ─── RADAR CHART ──────────────────────────────────────────────────────────────
// Radar à 5 axes (un par pilier). Pentagone avec grille à 4 niveaux.
// Les labels sont réduits pour tenir dans la fenêtre SVG.

const SHORT_LABELS: Record<string, string> = {
  'Infrastructures':     'Infra.',
  'Capital humain':      'Cap. hum.',
  'Economie productive': 'Écon.',
  'Fintech':             'Fintech',
  'E-gouvernement':      'E-gouv.',
  'Gouvernance':         'Gouv.',
}

export function RadarChart() {
  const pillars = PILIER_ORDER
  const N = pillars.length
  const CX = 105, CY = 110, MAX_R = 78
  const levels = [0.25, 0.5, 0.75, 1.0]

  // angle de chaque axe (commence à -90° = sommet)
  const angles = pillars.map((_, i) => -Math.PI / 2 + (i * 2 * Math.PI) / N)

  // point sur un axe à un rayon donné
  const pt = (angle: number, r: number) => ({
    x: CX + r * Math.cos(angle),
    y: CY + r * Math.sin(angle),
  })

  // polygone de la grille à un niveau donné
  const gridPolygon = (level: number) =>
    pillars.map((_, i) => {
      const p = pt(angles[i], level * MAX_R)
      return `${p.x},${p.y}`
    }).join(' ')

  // polygone des scores
  const scorePolygon = pillars.map((p, i) => {
    const r = (PILIER_SCORES[p] / 100) * MAX_R
    const pos = pt(angles[i], r)
    return `${pos.x},${pos.y}`
  }).join(' ')

  return (
    <Svg width={210} height={220} viewBox="0 0 210 220">
      {/* grille */}
      {levels.map(lv => (
        <Polygon key={lv} points={gridPolygon(lv)} stroke={BORDER} strokeWidth={0.5} fill="none" />
      ))}
      {/* axes */}
      {pillars.map((_, i) => {
        const end = pt(angles[i], MAX_R)
        return <Line key={i} x1={CX} y1={CY} x2={end.x} y2={end.y} stroke={BORDER} strokeWidth={0.5} />
      })}
      {/* data polygon */}
      <Polygon points={scorePolygon} fill={GOLD} fillOpacity={0.25} stroke={GOLD} strokeWidth={2} />
      {/* data dots */}
      {pillars.map((p, i) => {
        const r = (PILIER_SCORES[p] / 100) * MAX_R
        const pos = pt(angles[i], r)
        return <Circle key={i} cx={pos.x} cy={pos.y} r={3} fill={GOLD} />
      })}
      {/* labels */}
      {pillars.map((p, i) => {
        const labelR = MAX_R + 16
        const pos = pt(angles[i], labelR)
        let anchor: 'start' | 'middle' | 'end' = 'middle'
        if (pos.x < CX - 10) anchor = 'end'
        if (pos.x > CX + 10) anchor = 'start'
        return (
          <SvgText key={i} x={pos.x} y={pos.y + 3}
            style={{ fontSize: 6.5 }} fill={SLATE} textAnchor={anchor}>
            {SHORT_LABELS[p] ?? p}
          </SvgText>
        )
      })}
      {/* niveau labels */}
      {[25, 50, 75].map(lv => (
        <SvgText key={lv} x={CX + 3} y={CY - (lv / 100) * MAX_R + 3}
          style={{ fontSize: 5.5 }} fill={SLATE}>
          {lv}
        </SvgText>
      ))}
    </Svg>
  )
}

// ─── BAR CHART ───────────────────────────────────────────────────────────────
// Barres horizontales — une par pilier. Couleurs individuelles.
// Valeur du score affichée en bout de barre.

export function BarChart() {
  const pillars = PILIER_ORDER
  const W = 260, barH = 14, gap = 8
  const labelW = 60, maxBarW = 150, startX = labelW + 8
  const H = pillars.length * (barH + gap) + 20

  return (
    <Svg width={W} height={H} viewBox={`0 0 ${W} ${H}`}>
      {/* grid line at 50 */}
      <Line
        x1={startX + (50 / 100) * maxBarW} y1={0}
        x2={startX + (50 / 100) * maxBarW} y2={H}
        stroke={BORDER} strokeWidth={0.8} strokeDasharray="3 2"
      />
      {pillars.map((p, i) => {
        const score = PILIER_SCORES[p]
        const barW = (score / 100) * maxBarW
        const y = i * (barH + gap) + 6
        const color = PILIER_COLORS[p] ?? NAVY
        const label = PILIER_LABELS[p] ?? p

        return (
          <G key={p}>
            {/* label */}
            <SvgText x={0} y={y + barH - 3}
              style={{ fontSize: 6.5 }} fill={SLATE} textAnchor="start">
              {label.length > 12 ? label.slice(0, 12) + '.' : label}
            </SvgText>
            {/* track */}
            <Rect x={startX} y={y} width={maxBarW} height={barH}
              fill={BORDER} rx={3} />
            {/* fill */}
            <Rect x={startX} y={y} width={barW} height={barH}
              fill={color} rx={3} />
            {/* score label */}
            <SvgText x={startX + barW + 4} y={y + barH - 3}
              style={{ fontSize: 7, fontWeight: 'bold' }} fill={NAVY}>
              {score}
            </SvgText>
          </G>
        )
      })}
      {/* axis */}
      <Line x1={startX} y1={0} x2={startX} y2={H} stroke={BORDER} strokeWidth={0.5} />
      <SvgText x={startX + (50/100)*maxBarW} y={H} style={{ fontSize: 5.5 }} fill={SLATE} textAnchor="middle">50</SvgText>
    </Svg>
  )
}

// ─── STATUT PILL (inline SVG dot) ─────────────────────────────────────────────
// Cercle coloré pour les badges de statut dans les tableaux.

export function StatutDot({ statut }: { statut: string }) {
  const color = STATUT_COLORS[statut] ?? STATUT_COLORS['gris']
  return (
    <Svg width={8} height={8} viewBox="0 0 8 8">
      <Circle cx={4} cy={4} r={3.5} fill={color} />
    </Svg>
  )
}