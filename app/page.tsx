'use client'

import Link from 'next/link'
import { useEffect, useRef, useState } from 'react'
import { KPIS, NEWS, ARTICLES, type KPI, type AlertStatus } from './lib/kpis/kpis'
import { Nav, Footer } from './components/NavFooter'

// ─── types & maps ─────────────────────────────────────────────────────────────

const STATUS_MAP: Record<AlertStatus, { bg: string; text: string; border: string; dot: string; label: string }> = {
  vert:   { bg: 'bg-emerald-50', text: 'text-emerald-700', border: 'border-emerald-200', dot: 'bg-emerald-500', label: 'Favorable' },
  orange: { bg: 'bg-amber-50',   text: 'text-amber-700',   border: 'border-amber-200',   dot: 'bg-amber-400',   label: 'À surveiller' },
  rouge:  { bg: 'bg-red-50',     text: 'text-red-700',     border: 'border-red-200',     dot: 'bg-red-500',     label: 'Critique' },
  gris:   { bg: 'bg-slate-50',   text: 'text-slate-600',   border: 'border-slate-200',   dot: 'bg-slate-400',   label: 'Contexte' },
}

const PILIER_ICONS: Record<string, string> = {
  'Contexte':            '🗺️',
  'Infrastructures':     '📡',
  'Capital humain':      '🎓',
  'Economie productive': '🚀',
  'E-gouvernement':      '🏛️',
  'Gouvernance':         '⚖️',
}

// 5 piliers IMNT
const IMNT_PILIERS = [
  { num: '01', label: 'Infrastructures',               icon: '📡', pilierKey: 'Infrastructures' },
  { num: '02', label: 'Capital humain',                icon: '🎓', pilierKey: 'Capital humain' },
  { num: '03', label: 'Économie numérique productive', icon: '🚀', pilierKey: 'Economie productive' },
  { num: '04', label: 'E-gouvernement',                icon: '🏛️', pilierKey: 'E-gouvernement' },
  { num: '05', label: 'Gouvernance & Cyber',           icon: '⚖️', pilierKey: 'Gouvernance' },
]

// ─── composants réutilisables ─────────────────────────────────────────────────

function SectionHeader({ eyebrow, title, description, center = true }: {
  eyebrow: string; title: string; description?: string; center?: boolean
}) {
  return (
    <div className={`mb-12 ${center ? 'text-center' : ''}`}>
      <p className="text-xs font-bold uppercase tracking-widest text-[#D4A373] mb-2">{eyebrow}</p>
      <h2 className="text-2xl md:text-3xl lg:text-4xl font-black text-[#0A192F]">{title}</h2>
      {description && <p className="text-slate-500 mt-2 max-w-2xl mx-auto">{description}</p>}
    </div>
  )
}

function Card({ children, className = '', hover = true }: {
  children: React.ReactNode; className?: string; hover?: boolean
}) {
  return (
    <div className={`bg-white rounded-2xl border border-slate-100 shadow-sm ${
      hover ? 'transition-all duration-200 hover:-translate-y-1 hover:shadow-lg' : ''
    } ${className}`}>
      {children}
    </div>
  )
}

// ─── score par pilier ─────────────────────────────────────────────────────────

function pilierScore(pilierKey: string): number {
  const kpis = KPIS.filter(k => k.pilier === pilierKey && k.statut !== 'gris')
  if (!kpis.length) return 0
  const total = kpis.reduce((acc, k) => {
    if (k.statut === 'vert')   return acc + 1
    if (k.statut === 'orange') return acc + 0.5
    return acc
  }, 0)
  return Math.round((total / kpis.length) * 100)
}

// ─── jauge SVG ────────────────────────────────────────────────────────────────

function GaugeSVG({ score }: { score: number }) {
  const r = 80, cx = 110, cy = 110, strokeW = 18
  const angle = (score / 100) * 180
  const rad = (angle - 180) * (Math.PI / 180)
  const x = cx + r * Math.cos(rad)
  const y = cy + r * Math.sin(rad)
  const circumference = Math.PI * r
  const dashOffset = circumference - (score / 100) * circumference
  const color = score >= 65 ? '#10b981' : score >= 40 ? '#f59e0b' : '#ef4444'
  const displayScore = Number.isInteger(score) ? score : score.toFixed(1)
  return (
    <svg
      viewBox="0 0 220 130"
      className="w-full max-w-xs mx-auto"
      aria-label={`Score IMNT : ${displayScore} sur 100`}
    >
      <path d={`M ${cx - r} ${cy} A ${r} ${r} 0 0 1 ${cx + r} ${cy}`}
        fill="none" stroke="#e2e8f0" strokeWidth={strokeW} strokeLinecap="round" />
      <path d={`M ${cx - r} ${cy} A ${r} ${r} 0 0 1 ${cx + r} ${cy}`}
        fill="none" stroke={color} strokeWidth={strokeW} strokeLinecap="round"
        strokeDasharray={circumference} strokeDashoffset={dashOffset}
        style={{ transition: 'stroke-dashoffset 1s ease' }} />
      <line x1={cx} y1={cy} x2={x} y2={y} stroke="#1e293b" strokeWidth={3} strokeLinecap="round" />
      <circle cx={cx} cy={cy} r={6} fill="#1e293b" />
      <text x={cx - r - 6} y={cy + 18} fontSize="11" fill="#94a3b8" textAnchor="middle">0</text>
      <text x={cx + r + 6} y={cy + 18} fontSize="11" fill="#94a3b8" textAnchor="middle">100</text>
      <text x={cx} y={cy - 14} fontSize="28" fontWeight="700" fill="#0f172a" textAnchor="middle">{displayScore}</text>
      <text x={cx} y={cy + 4} fontSize="11" fill="#64748b" textAnchor="middle">/100</text>
    </svg>
  )
}

// ─── ticker ───────────────────────────────────────────────────────────────────

function Ticker() {
  // FIX: use only numbers already present in KPI data — no invented figures
  const items = [
    'IMNT Global : 48,7/100',
    'NRI 2025 : 39,29/100 · Rang 96e/127',
    'Population totale : 12,3 millions',
    'Utilisateurs Internet : 10,5 millions',
    'Connexions mobiles / population : 128 %',
    'Score E-gouvernement (EGDI) : 0,6935',
    "Paiements mobiles : 8,4 millions d'operations",
    'Human Capital Index : 0,8032',
  ]
  return (
    <div
      className="overflow-hidden border-t border-[#D4A373]/20 mt-10 pt-4"
      aria-label="Données clés en continu"
    >
      <div className="flex animate-ticker gap-0 whitespace-nowrap">
        {[...items, ...items].map((item, i) => (
          <span key={i} className="flex items-center gap-6 px-6 text-sm text-[#D4A373]/80 font-medium">
            <span className="w-1.5 h-1.5 rounded-full bg-[#D4A373] inline-block" aria-hidden="true" />
            {item}
          </span>
        ))}
      </div>
      <style>{`
        @keyframes ticker { from { transform: translateX(0) } to { transform: translateX(-50%) } }
        .animate-ticker { animation: ticker 30s linear infinite; }
      `}</style>
    </div>
  )
}

// ─── page principale ──────────────────────────────────────────────────────────

export default function HomePage() {
  const IMNT_SCORE = 48.7

  const statusCounts = {
    vert:   KPIS.filter(k => k.statut === 'vert').length,
    orange: KPIS.filter(k => k.statut === 'orange').length,
    rouge:  KPIS.filter(k => k.statut === 'rouge').length,
  }

  // FIX: use KPI-02, KPI-06, KPI-09 as highlight KPIs
  const highlights = KPIS.filter(k => ['KPI-02', 'KPI-06', 'KPI-09'].includes(k.id))

  return (
    <div className="min-h-screen bg-slate-50 font-sans">
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 bg-white p-2 rounded shadow-lg z-50 focus:outline-none focus:ring-2 focus:ring-[#64FFDA]"
      >
        Aller au contenu principal
      </a>

      <Nav active="/" />

      <main id="main-content">

        {/* ── HERO ── */}
        <section className="bg-[#0A192F] text-white relative overflow-hidden">
          <div
            className="absolute inset-0 opacity-5"
            aria-hidden="true"
            style={{
              backgroundImage: 'linear-gradient(#ffffff 1px, transparent 1px), linear-gradient(90deg, #ffffff 1px, transparent 1px)',
              backgroundSize: '48px 48px',
            }}
          />
          <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-[#D4A373] to-transparent opacity-60" aria-hidden="true" />
          <div className="relative max-w-7xl mx-auto px-4 sm:px-6 py-20 md:py-28">
            <div className="max-w-3xl">
              <div className="inline-flex items-center gap-2 bg-[#D4A373]/20 border border-[#D4A373]/30 rounded-full px-4 py-1.5 mb-6">
                <span className="w-2 h-2 rounded-full bg-[#D4A373] animate-pulse" aria-hidden="true" />
                <span className="text-[#D4A373] text-xs font-semibold tracking-wider uppercase">
                  Rapport Annuel de l'Économie Numérique en Tunisie
                </span>
              </div>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-black leading-tight mb-3 tracking-tight">
                Think Digital,
              </h1>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-black leading-tight mb-6 tracking-tight">
                <span className="text-[#D4A373]">Think Tunisia.</span>
              </h1>
              <p className="text-slate-300 text-lg md:text-xl leading-relaxed mb-10 max-w-2xl">
                Là où les données dessinent l'avenir numérique de la Tunisie.
              </p>
              <div className="flex flex-wrap gap-4">
                {/* FIX: "Explorer les KPIs" — no more "Dashboard" */}
                <Link
                  href="/kpis"
                  className="bg-[#D4A373] hover:bg-[#c49a6c] text-[#0A192F] font-bold px-8 py-3.5 rounded-xl transition-all hover:scale-105 shadow-lg shadow-amber-900/30 focus:outline-none focus:ring-2 focus:ring-[#64FFDA] focus:ring-offset-2 focus:ring-offset-[#0A192F]"
                >
                  Explorer les KPIs →
                </Link>
                <Link
                  href="/rapport"
                  className="bg-white/10 hover:bg-white/20 border border-white/20 text-white font-semibold px-8 py-3.5 rounded-xl transition-colors backdrop-blur-sm focus:outline-none focus:ring-2 focus:ring-white"
                >
                  {/* FIX: "Voir le rapport" — no false promise of PDF */}
                  Voir le rapport
                </Link>
                <Link
                  href="/about"
                  className="text-slate-400 hover:text-white font-semibold px-4 py-3.5 rounded-xl transition-colors text-sm underline underline-offset-4 focus:outline-none focus:text-white"
                >
                  En savoir plus
                </Link>
              </div>
            </div>
          </div>
          <Ticker />
        </section>

        {/* ── SCORE IMNT + NRI ── */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 py-12">
          <div className="bg-white rounded-2xl shadow-xl border border-slate-100 p-6 md:p-8">
            <div className="grid md:grid-cols-2 gap-10 items-center">

              {/* Gauge */}
              <div className="text-center">
                {/* FIX: "15 indicateurs clés retenus dans la version pilote · Édition 2025" */}
                <SectionHeader
                  eyebrow="Indice IMNT"
                  title="Score composite"
                  description="15 indicateurs clés retenus dans la version pilote · Édition 2025"
                  center
                />
                <GaugeSVG score={IMNT_SCORE} />
                <div className="mt-3 inline-flex items-center gap-2 bg-amber-50 border border-amber-200 rounded-full px-4 py-1.5">
                  <span className="w-2 h-2 rounded-full bg-amber-400" aria-hidden="true" />
                  <span className="text-amber-700 text-sm font-semibold">Performance intermédiaire</span>
                </div>
              </div>

              {/* NRI */}
              <div>
                <SectionHeader eyebrow="NRI 2025" title="Network Readiness Index" description="Portulans Institute" center={false} />
                <div className="grid grid-cols-2 gap-3 mb-6">
                  {[
                    { label: 'Score NRI global',    value: '39,29', sub: '/ 100' },
                    { label: 'Rang mondial',         value: '96ᵉ',   sub: 'sur 127 économies' },
                    { label: 'Rang groupe revenus',  value: '14ᵉ',   sub: 'Lower-middle-income' },
                    { label: 'Rang région',          value: '10ᵉ',   sub: 'Arab States' },
                  ].map(({ label, value, sub }) => (
                    <div key={label} className="bg-slate-50 rounded-xl p-4">
                      <div className="text-2xl font-black text-[#0A192F]">{value}</div>
                      <div className="text-xs text-slate-400 mt-0.5">{sub}</div>
                      <div className="text-xs font-medium text-slate-600 mt-1">{label}</div>
                    </div>
                  ))}
                </div>
                <div className="space-y-2">
                  {[
                    { label: 'Favorables',   count: statusCounts.vert,   color: 'bg-emerald-500' },
                    { label: 'À surveiller', count: statusCounts.orange, color: 'bg-amber-400' },
                    { label: 'Critiques',    count: statusCounts.rouge,  color: 'bg-red-500' },
                  ].map(({ label, count, color }) => (
                    <div key={label} className="flex items-center gap-3">
                      <div className="flex items-center gap-2 w-28">
                        <span className={`w-2.5 h-2.5 rounded-full ${color}`} aria-hidden="true" />
                        <span className="text-xs font-medium text-slate-600">{label}</span>
                      </div>
                      <div className="flex-1 bg-slate-100 rounded-full h-2 overflow-hidden">
                        <div className={`h-full rounded-full ${color}`} style={{ width: `${(count / 15) * 100}%` }} />
                      </div>
                      <span className="text-xs font-bold text-slate-600 w-5 text-right">{count}</span>
                    </div>
                  ))}
                </div>
                <p className="text-xs text-slate-400 mt-4">
                  *Sources : Portulans Institute (NRI 2025), UIT, UN DESA, BCT, DataReportal, Ookla, JORT et calculs internes IMNT.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* ── CHIFFRES CLÉS (FIX: static, from KPI data only) ── */}
        <section className="bg-slate-100 py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6">
            <SectionHeader eyebrow="Chiffres clés" title="La Tunisie en données" description="Indicateurs directement issus des KPIs 2025" />
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
              {[
                { value: '12,3 M',   label: 'Population totale',              detail: 'DataReportal 2025',         highlight: false },
                { value: '10,5 M',   label: 'Utilisateurs Internet',          detail: 'KPI-02 · DataReportal',     highlight: false },
                { value: '128 %',    label: 'Connexions mobiles / population', detail: 'KPI-03 · DataReportal',     highlight: false },
                { value: '0,6935',   label: 'Score EGDI',                     detail: 'KPI-11 · UN DESA 2024',     highlight: false },
                { value: '48,7',     label: 'Score IMNT',                     detail: 'Index composite 2025',      highlight: true  },
                { value: '39,29',    label: 'Score NRI',                      detail: 'Rang 96e/127 · NRI 2025',   highlight: false },
              ].map(({ value, label, detail, highlight }) => (
                <div
                  key={label}
                  className={`rounded-2xl p-6 text-center border transition-all hover:-translate-y-1 hover:shadow-lg ${
                    highlight
                      ? 'bg-[#D4A373] border-[#D4A373] text-[#0A192F]'
                      : 'bg-white border-slate-100 shadow-sm'
                  }`}
                >
                  <div className="text-3xl font-black leading-none mb-1 text-[#0A192F]">{value}</div>
                  <div className="text-sm font-bold mt-2 mb-0.5 text-slate-700">{label}</div>
                  <div className="text-xs text-slate-400">{detail}</div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── À PROPOS / MANIFESTE ── */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 py-16">
          <div className="grid lg:grid-cols-2 gap-12">
            <div>
              <SectionHeader
                eyebrow="À propos"
                title="Une plateforme dédiée au suivi annuel de l'économie numérique en Tunisie"
                center={false}
              />
              <p className="text-slate-600 leading-relaxed mb-6">
                Cette plateforme a été conçue pour structurer, centraliser et automatiser la production du Rapport Annuel de l'Économie Numérique en Tunisie. Elle s'appuie sur des sources officielles et spécialisées, enrichies par des analyses générées sous contrôle humain, afin d'offrir un référentiel fiable aux décideurs, investisseurs et acteurs de l'écosystème digital.
              </p>
              <Card className="p-5" hover={false}>
                <div className="text-sm text-slate-600 space-y-2">
                  <p><span className="font-semibold text-slate-800">Idée &amp; Copyright :</span> © Madame Rim Jalouli. Tous droits réservés.</p>
                  <p><span className="font-semibold text-slate-800">Conception &amp; consultation :</span> Mr Wahib Zaier</p>
                </div>
              </Card>
            </div>
            <div className="bg-[#0A192F] rounded-2xl p-8 text-white relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-[#D4A373]/10 rounded-full -translate-y-1/2 translate-x-1/2" aria-hidden="true" />
              <p className="text-[#D4A373] text-xs font-bold uppercase tracking-widest mb-4">Le Manifeste</p>
              <blockquote className="text-lg md:text-xl font-bold leading-relaxed mb-6">
                "La transformation digitale ne s'improvise pas. Elle se mesure."
              </blockquote>
              <p className="text-slate-300 text-sm leading-relaxed mb-6">
                Nous avons construit cet observatoire pour offrir à la Tunisie un miroir précis de son économie numérique. Pas de slogans creux, pas de chiffres inventés : uniquement des indicateurs sourcés, des analyses validées par des experts et un index composite unique — l'IMNT — pour évaluer, comparer et décider.
              </p>
              <p className="text-slate-300 text-sm leading-relaxed mb-6">
                Parce que l'avenir du pays se joue aussi dans la qualité de sa connexion, de ses talents et de sa gouvernance.
              </p>
              <p className="text-slate-500 text-xs border-t border-white/10 pt-4">
                Une initiative pensée par Rim Jalouli · Conception &amp; consultation : Wahib Zaier
              </p>
            </div>
          </div>
        </section>

        {/* ── POURQUOI LA TUNISIE ── */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 py-16">
          <SectionHeader eyebrow="Positionnement" title="Pourquoi la Tunisie numérique ?" description="Six atouts qui font la différence" />
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              { icon: '🧠', title: 'Capital Humain',    sub: 'Le cerveau du continent',     body: 'Human Capital Index à 0,8032 (UN DESA 2024). Une jeunesse bilingue, connectée et recherchée par les grands comptes européens.' },
              { icon: '📡', title: 'Infrastructure',    sub: 'Connectée, et en accélération', body: 'Fibre optique, 4G nationale, 128 % de taux de pénétration mobile. Les fondations d\'une économie sans frontières.' },
              { icon: '🚀', title: 'Écosystème Startup', sub: 'De Tunis à l\'international', body: '82e rang mondial (StartupBlink 2025), écosystème tech estimé à 241,5 M USD. La Tunisie s\'exporte en Afrique et en Europe.' },
              { icon: '⚖️', title: 'Cadre Légal',       sub: 'En cours de modernisation',
                // FIX: honest wording aligned with KPI-15 (loi 2004 = critique)
                body: 'Un cadre juridique existant, mais nécessitant une modernisation pour répondre pleinement aux exigences actuelles de la gouvernance des données et de l\'innovation numérique.' },
              { icon: '🌍', title: 'Nearshore',         sub: "L'Europe à deux heures",      body: 'Francophonie, décalage horaire réduit, coûts maîtrisés. La destination privilégiée de l\'externalisation digitale.' },
              { icon: '🔗', title: 'Hub Géostratégique', sub: 'La porte de trois continents', body: 'À la croisée de l\'Afrique, de l\'Europe et du Moyen-Orient. Un accès privilégié à 1,5 milliard de consommateurs.' },
            ].map(card => (
              <Card key={card.title} className="p-6">
                <div className="text-3xl mb-4" aria-hidden="true">{card.icon}</div>
                <div className="text-xs font-bold text-[#D4A373] uppercase tracking-wider mb-1">{card.sub}</div>
                <h3 className="text-lg font-black text-slate-800 mb-2">{card.title}</h3>
                <p className="text-sm text-slate-500 leading-relaxed">{card.body}</p>
              </Card>
            ))}
          </div>
        </section>

        {/* ── 5 PILIERS IMNT (single source of truth via pilierScore()) ── */}
        <section className="bg-[#0A192F] py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6">
            <SectionHeader
              eyebrow="Architecture"
              title="L'Index IMNT : cinq piliers, un score"
              description="Cliquez sur un pilier pour explorer ses indicateurs"
              center
            />
            <div className="grid grid-cols-1 sm:grid-cols-5 gap-4">
              {IMNT_PILIERS.map(({ num, label, icon, pilierKey }) => {
                const score = pilierScore(pilierKey)
                const color = score >= 65 ? 'text-emerald-400' : score >= 40 ? 'text-amber-400' : 'text-red-400'
                return (
                  <Link
                    key={num}
                    href={`/kpis?pilier=${encodeURIComponent(pilierKey)}`}
                    className="bg-white/5 hover:bg-white/10 border border-white/10 hover:border-[#D4A373]/40 rounded-xl p-5 text-center transition-all group focus:outline-none focus:ring-2 focus:ring-[#64FFDA]"
                  >
                    <div className="text-2xl mb-2" aria-hidden="true">{icon}</div>
                    <div className="text-slate-400 text-xs font-bold mb-1">{num}</div>
                    <div className="text-white text-sm font-bold leading-tight mb-3">{label}</div>
                    <div className={`text-2xl font-black ${color}`}>{score}</div>
                    <div className="text-slate-500 text-xs">/100</div>
                  </Link>
                )
              })}
            </div>
          </div>
        </section>

        {/* ── NOTRE MISSION ── */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 py-16">
          <SectionHeader eyebrow="Raison d'être" title="Pourquoi ce rapport ?" center />
          <div className="grid md:grid-cols-3 gap-6">
            {[
              { icon: '📐', title: 'Mesurer',  sub: 'Des données sourcées, jamais des impressions.', body: "Nous agrégeons des indicateurs officiels (BCT, UIT, UN DESA) avec une méthodologie transparente et une date de fraîcheur affichée." },
              { icon: '🔬', title: 'Analyser', sub: "L'IA au service de l'expertise.", body: "Nos algorithmes génèrent des analyses et recommandations. Mais aucun texte n'est publié sans validation humaine. Zéro invention, zéro hallucination." },
              { icon: '🎯', title: 'Décider',  sub: 'Un référentiel pour agir.', body: "Investisseurs, décideurs publics, chercheurs : trouvez ici les arguments chiffrés pour orienter vos stratégies et vos politiques." },
            ].map(m => (
              <Card key={m.title} className="p-7">
                <div className="w-12 h-12 rounded-xl bg-[#0A192F]/5 flex items-center justify-center text-2xl mb-5" aria-hidden="true">{m.icon}</div>
                <h3 className="text-xl font-black text-[#0A192F] mb-1">{m.title}</h3>
                <p className="text-xs font-semibold text-[#D4A373] mb-3">{m.sub}</p>
                <p className="text-sm text-slate-500 leading-relaxed">{m.body}</p>
              </Card>
            ))}
          </div>
        </section>

        {/* ── KPIs EN LUMIÈRE (version pilote badge) ── */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 py-16">
          <div className="flex flex-wrap items-end justify-between gap-4 mb-8">
            <div>
              <SectionHeader eyebrow="Indicateurs phares" title="KPIs en lumière" center={false} />
              {/* FIX: version pilote badge */}
              <span className="inline-flex items-center gap-1.5 bg-slate-100 text-slate-500 text-xs font-semibold px-3 py-1 rounded-full -mt-8">
                Version pilote / MVP
              </span>
            </div>
            <Link href="/kpis" className="text-[#0A192F] font-semibold text-sm hover:underline focus:outline-none focus:ring-2 focus:ring-[#64FFDA] rounded">
              Voir les 15 KPIs →
            </Link>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            {highlights.map(kpi => {
              const s = STATUS_MAP[kpi.statut]
              return (
                <Link key={kpi.id} href={`/kpis/${kpi.id.toLowerCase()}`} className="group focus:outline-none focus:ring-2 focus:ring-[#64FFDA] rounded-2xl">
                  <Card className="p-6 h-full">
                    <div className="flex items-start justify-between mb-4">
                      <span className="text-2xl" aria-hidden="true">{PILIER_ICONS[kpi.pilier] ?? '📊'}</span>
                      <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold border ${s.bg} ${s.text} ${s.border}`}>
                        <span className={`w-1.5 h-1.5 rounded-full ${s.dot}`} aria-hidden="true" />{s.label}
                      </span>
                    </div>
                    <div className="text-3xl font-black text-[#0A192F] mb-1 group-hover:text-[#D4A373] transition-colors">{kpi.valeur}</div>
                    <div className="text-xs text-slate-400 mb-3">{kpi.unite} · {kpi.annee}</div>
                    <div className="font-semibold text-slate-700 text-sm mb-1">{kpi.nom}</div>
                    <div className="text-xs text-slate-400 line-clamp-2">{kpi.definition}</div>
                    <div className="mt-4 pt-4 border-t border-slate-50 flex items-center justify-between">
                      <span className="text-xs text-slate-400">{kpi.source}</span>
                      <span className="text-xs font-medium text-[#0A192F] opacity-0 group-hover:opacity-100 transition-opacity">Détail →</span>
                    </div>
                  </Card>
                </Link>
              )
            })}
          </div>
        </section>

        {/* ── RAPPORT EN VEDETTE ── */}
        <section className="bg-gradient-to-r from-[#0A192F] to-[#0d2b4a] py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6">
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              <div className="hidden lg:flex justify-center" aria-hidden="true">
                <div className="w-56 h-72 bg-white/5 border border-white/10 rounded-2xl flex flex-col items-center justify-center gap-4 shadow-2xl">
                  <div className="text-6xl">📊</div>
                  <div className="text-center">
                    {/* FIX: unified branding — no "RENT 2025" competing with "Think Digital" */}
                    <div className="text-white font-black text-lg">Édition 2025</div>
                    <div className="text-[#D4A373] text-xs font-semibold mt-1">Rapport Annuel</div>
                  </div>
                  <div className="w-16 h-0.5 bg-[#D4A373]/40" />
                  <div className="text-slate-400 text-xs">Think Digital, Think Tunisia</div>
                </div>
              </div>
              <div>
                <p className="text-[#D4A373] text-xs font-bold uppercase tracking-widest mb-3">Rapport en vedette</p>
                <h2 className="text-2xl md:text-3xl font-black text-white mb-4">
                  Think Digital, Think Tunisia — Édition 2025
                </h2>
                <p className="text-slate-300 leading-relaxed mb-6">
                  15 indicateurs clés. Un score IMNT. Des analyses par pilier. Des recommandations court, moyen et long terme. Tout ce que vous devez savoir sur l'économie numérique tunisienne, dans un document unique.
                </p>
                <div className="flex flex-wrap gap-4">
                  <Link href="/rapport" className="bg-[#D4A373] hover:bg-[#c49a6c] text-[#0A192F] font-bold px-7 py-3 rounded-xl transition-all hover:scale-105 focus:outline-none focus:ring-2 focus:ring-[#64FFDA]">
                    Voir le rapport
                  </Link>
                  <Link href="/kpis" className="bg-white/10 hover:bg-white/20 border border-white/20 text-white font-semibold px-7 py-3 rounded-xl transition-colors focus:outline-none focus:ring-2 focus:ring-white">
                    Explorer les KPIs
                  </Link>
                </div>
                {/* FIX: honest archive wording */}
                <p className="mt-4 text-xs text-slate-500">
                  Les versions antérieures correspondent à des travaux préparatoires internes et ne sont pas diffusées publiquement dans cette version de la plateforme.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* ── ACTUALITÉS + BLOG ── */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 py-16">
          <div className="grid lg:grid-cols-2 gap-12">
            <div>
              <SectionHeader eyebrow="Dernières nouvelles" title="Actualités" center={false} />
              <div className="space-y-4">
                {NEWS.map(item => (
                  <Card key={item.id} className="p-5">
                    <div className="flex items-start gap-4">
                      <div className="w-10 h-10 rounded-lg bg-[#0A192F]/5 flex items-center justify-center flex-shrink-0 mt-0.5" aria-hidden="true">📰</div>
                      <div>
                        <div className="text-xs text-slate-400 mb-1">{item.date}</div>
                        <div className="font-semibold text-slate-800 text-sm mb-1 leading-snug">{item.titre}</div>
                        <div className="text-xs text-slate-500 line-clamp-2">{item.extrait}</div>
                      </div>
                    </div>
                  </Card>
                ))}
                <Link href="/actualites" className="block text-center text-sm font-semibold text-[#0A192F] hover:text-[#D4A373] transition-colors pt-2 focus:outline-none focus:underline">
                  Toutes les actualités →
                </Link>
              </div>
            </div>
            <div>
              <SectionHeader eyebrow="Analyses & insights" title="Blog" center={false} />
              <div className="space-y-4">
                {ARTICLES.map(article => (
                  <Card key={article.id} className="p-5 group cursor-pointer">
                    <div className="flex items-start gap-4">
                      <div className="w-10 h-10 rounded-lg bg-[#D4A373]/10 flex items-center justify-center flex-shrink-0 mt-0.5" aria-hidden="true">✍️</div>
                      <div>
                        <div className="text-xs text-slate-400 mb-1">{article.date}</div>
                        <div className="font-semibold text-slate-800 text-sm mb-1 leading-snug group-hover:text-[#0A192F] transition-colors">{article.titre}</div>
                        <div className="text-xs text-slate-500 line-clamp-2">{article.extrait}</div>
                      </div>
                    </div>
                  </Card>
                ))}
                {/* FIX: blog link removed — page doesn't exist yet, show as teaser only */}
              </div>
            </div>
          </div>
        </section>

      </main>

      <Footer />
    </div>
  )
}