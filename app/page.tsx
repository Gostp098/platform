'use client'

import Link from 'next/link'
import { KPIS, HIGHLIGHT_KPIS, NEWS, ARTICLES, type KPI, type AlertStatus } from './lib/kpis/kpis'

const STATUS_MAP: Record<AlertStatus, { bg: string; text: string; border: string; dot: string; label: string }> = {
  vert:   { bg: 'bg-emerald-50', text: 'text-emerald-700', border: 'border-emerald-200', dot: 'bg-emerald-500', label: 'Favorable' },
  orange: { bg: 'bg-amber-50',   text: 'text-amber-700',   border: 'border-amber-200',   dot: 'bg-amber-400',   label: 'À surveiller' },
  rouge:  { bg: 'bg-red-50',     text: 'text-red-700',     border: 'border-red-200',     dot: 'bg-red-500',     label: 'Critique' },
  gris:   { bg: 'bg-slate-50',   text: 'text-slate-600',   border: 'border-slate-200',   dot: 'bg-slate-400',   label: 'Contexte' },
}


function computeIMNT() {
  const scored = KPIS.filter((k: KPI) => k.statut !== 'gris')
  const total = scored.reduce((acc: number, k: KPI) => {
    if (k.statut === 'vert') return acc + 1
    if (k.statut === 'orange') return acc + 0.5
    return acc
  }, 0)
  return Math.round((total / scored.length) * 100)
}

// ... rest of your code (GaugeSVG, HomePage) unchanged,
// but inside HomePage add types to the callbacks:
// ─── helpers ────────────────────────────────────────────────────────────────



const PILIER_ICONS: Record<string, string> = {
  'Contexte':           '🗺️',
  'Infrastructures':    '📡',
  'Capital humain':     '🎓',
  'Economie productive':'🚀',
  'Fintech':            '💳',
  'E-gouvernement':     '🏛️',
  'Gouvernance':        '⚖️',
}


function GaugeSVG({ score }: { score: number }) {
  const r = 80
  const cx = 110
  const cy = 110
  const strokeW = 18
  const angle = (score / 100) * 180
  const rad = (angle - 180) * (Math.PI / 180)
  const x = cx + r * Math.cos(rad)
  const y = cy + r * Math.sin(rad)
  const circumference = Math.PI * r
  const dashOffset = circumference - (score / 100) * circumference

  const color = score >= 65 ? '#10b981' : score >= 40 ? '#f59e0b' : '#ef4444'

  return (
    <svg viewBox="0 0 220 130" className="w-full max-w-xs mx-auto">
      {/* track */}
      <path
        d={`M ${cx - r} ${cy} A ${r} ${r} 0 0 1 ${cx + r} ${cy}`}
        fill="none" stroke="#e2e8f0" strokeWidth={strokeW} strokeLinecap="round"
      />
      {/* fill */}
      <path
        d={`M ${cx - r} ${cy} A ${r} ${r} 0 0 1 ${cx + r} ${cy}`}
        fill="none" stroke={color} strokeWidth={strokeW} strokeLinecap="round"
        strokeDasharray={circumference}
        strokeDashoffset={dashOffset}
        style={{ transition: 'stroke-dashoffset 1s ease' }}
      />
      {/* needle */}
      <line
        x1={cx} y1={cy}
        x2={x} y2={y}
        stroke="#1e293b" strokeWidth={3} strokeLinecap="round"
      />
      <circle cx={cx} cy={cy} r={6} fill="#1e293b" />
      {/* labels */}
      <text x={cx - r - 6} y={cy + 18} fontSize="11" fill="#94a3b8" textAnchor="middle">0</text>
      <text x={cx + r + 6} y={cy + 18} fontSize="11" fill="#94a3b8" textAnchor="middle">100</text>
      <text x={cx} y={cy - 14} fontSize="28" fontWeight="700" fill="#0f172a" textAnchor="middle">{score}</text>
      <text x={cx} y={cy + 4} fontSize="11" fill="#64748b" textAnchor="middle">/100</text>
    </svg>
  )
}

// ─── page ────────────────────────────────────────────────────────────────────

export default function HomePage() {
  const imnt = computeIMNT()
  const highlights = KPIS.filter(k => HIGHLIGHT_KPIS.includes(k.id))

  const statusCounts = {
    vert:   KPIS.filter(k => k.statut === 'vert').length,
    orange: KPIS.filter(k => k.statut === 'orange').length,
    rouge:  KPIS.filter(k => k.statut === 'rouge').length,
  }

  return (
    <div className="min-h-screen bg-slate-50 font-sans">

      {/* ── NAV ── */}
      <header className="bg-[#0A2B4E] sticky top-0 z-50 shadow-md">
        <nav className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded bg-[#D4AF37] flex items-center justify-center">
              <span className="text-[#0A2B4E] font-black text-sm">R</span>
            </div>
            <span className="text-white font-bold text-lg tracking-tight">RENT Tunisia</span>
            <span className="hidden sm:block text-[#D4AF37] text-xs font-medium tracking-widest uppercase ml-1 opacity-80">2025</span>
          </div>
          <div className="hidden md:flex items-center gap-1">
            {['Accueil', 'KPIs', 'Actualités', 'Rapport', 'À propos'].map((item, i) => (
              <Link
                key={item}
                href={i === 0 ? '/' : `/${item.toLowerCase().replace('à ', '').replace(' ', '-')}`}
                className="px-4 py-2 text-slate-300 hover:text-white hover:bg-white/10 rounded-lg text-sm font-medium transition-colors"
              >
                {item}
              </Link>
            ))}
          </div>
          <Link
            href="/rapport"
            className="bg-[#D4AF37] hover:bg-[#c4a030] text-[#0A2B4E] font-semibold text-sm px-4 py-2 rounded-lg transition-colors"
          >
            Télécharger le rapport
          </Link>
        </nav>
      </header>

      {/* ── HERO ── */}
      <section className="bg-[#0A2B4E] text-white relative overflow-hidden">
        {/* decorative grid */}
        <div
          className="absolute inset-0 opacity-5"
          style={{
            backgroundImage: 'linear-gradient(#ffffff 1px, transparent 1px), linear-gradient(90deg, #ffffff 1px, transparent 1px)',
            backgroundSize: '48px 48px',
          }}
        />
        {/* gold accent bar */}
        <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-[#D4AF37] to-transparent opacity-60" />

        <div className="relative max-w-7xl mx-auto px-6 py-20 md:py-28">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 bg-[#D4AF37]/20 border border-[#D4AF37]/30 rounded-full px-4 py-1.5 mb-6">
              <span className="w-2 h-2 rounded-full bg-[#D4AF37] animate-pulse" />
              <span className="text-[#D4AF37] text-xs font-semibold tracking-wider uppercase">Édition 2025</span>
            </div>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-black leading-tight mb-6 tracking-tight">
              Rapport Annuel de<br />
              <span className="text-[#D4AF37]">l'Économie Numérique</span><br />
              en Tunisie
            </h1>
            <p className="text-slate-300 text-lg md:text-xl leading-relaxed mb-10 max-w-2xl">
              Le RENT suit et évalue la transformation digitale de la Tunisie à travers 15 indicateurs clés couvrant les infrastructures, le capital humain, la fintech et la gouvernance.
            </p>
            <div className="flex flex-wrap gap-4">
              <Link
                href="/kpis"
                className="bg-[#D4AF37] hover:bg-[#c4a030] text-[#0A2B4E] font-bold px-8 py-3.5 rounded-xl transition-all hover:scale-105 active:scale-100 shadow-lg shadow-amber-900/30"
              >
                Explorer les 15 KPIs →
              </Link>
              <Link
                href="/rapport"
                className="bg-white/10 hover:bg-white/20 border border-white/20 text-white font-semibold px-8 py-3.5 rounded-xl transition-colors backdrop-blur-sm"
              >
                Télécharger le rapport PDF
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ── IMNT SCORE + STATS ── */}
      <section className="max-w-7xl mx-auto px-6 -mt-8 relative z-10">
        <div className="bg-white rounded-2xl shadow-xl border border-slate-100 p-6 md:p-8">
          <div className="grid md:grid-cols-2 gap-8 items-center">

            {/* gauge */}
            <div className="text-center">
              <p className="text-xs font-bold uppercase tracking-widest text-slate-400 mb-1">Indice IMNT</p>
              <p className="text-sm text-slate-500 mb-4">Score composite — moyenne des 14 KPIs pondérés</p>
              <GaugeSVG score={imnt} />
              <div className="mt-3 inline-flex items-center gap-2 bg-amber-50 border border-amber-200 rounded-full px-4 py-1.5">
                <span className="w-2 h-2 rounded-full bg-amber-400" />
                <span className="text-amber-700 text-sm font-semibold">Performance intermédiaire</span>
              </div>
            </div>

            {/* kpi status summary */}
            <div>
              <h2 className="text-xl font-bold text-slate-800 mb-2">Vue d'ensemble 2025</h2>
              <p className="text-slate-500 text-sm mb-6">Répartition des 15 KPIs selon leur statut d'alerte</p>

              <div className="space-y-3">
                {[
                  { statut: 'vert',   count: statusCounts.vert,   label: 'Favorables', color: 'bg-emerald-500' },
                  { statut: 'orange', count: statusCounts.orange, label: 'À surveiller', color: 'bg-amber-400' },
                  { statut: 'rouge',  count: statusCounts.rouge,  label: 'Critiques', color: 'bg-red-500' },
                ].map(({ statut, count, label, color }) => (
                  <div key={statut} className="flex items-center gap-4">
                    <div className="flex items-center gap-2 w-32">
                      <span className={`w-3 h-3 rounded-full ${color}`} />
                      <span className="text-sm font-medium text-slate-700">{label}</span>
                    </div>
                    <div className="flex-1 bg-slate-100 rounded-full h-2.5 overflow-hidden">
                      <div
                        className={`h-full rounded-full ${color} transition-all duration-1000`}
                        style={{ width: `${(count / 15) * 100}%` }}
                      />
                    </div>
                    <span className="text-sm font-bold text-slate-600 w-6 text-right">{count}</span>
                  </div>
                ))}
              </div>

              <div className="mt-6 pt-6 border-t border-slate-100 grid grid-cols-3 gap-4 text-center">
                {[
                  { n: '15', label: 'KPIs suivis' },
                  { n: '7', label: 'Piliers' },
                  { n: '2025', label: 'Édition' },
                ].map(({ n, label }) => (
                  <div key={label}>
                    <div className="text-2xl font-black text-[#0A2B4E]">{n}</div>
                    <div className="text-xs text-slate-400 mt-0.5">{label}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── HIGHLIGHT KPIs ── */}
      <section className="max-w-7xl mx-auto px-6 py-16">
        <div className="flex items-end justify-between mb-8">
          <div>
            <p className="text-xs font-bold uppercase tracking-widest text-[#D4AF37] mb-1">Indicateurs phares</p>
            <h2 className="text-2xl md:text-3xl font-black text-slate-800">KPIs en lumière</h2>
          </div>
          <Link href="/kpis" className="text-[#0A2B4E] font-semibold text-sm hover:underline hidden sm:block">
            Voir les 15 KPIs →
          </Link>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          {highlights.map(kpi => {
            const s = STATUS_MAP[kpi.statut]
            return (
              <Link
                key={kpi.id}
                href={`/kpis/${kpi.id.toLowerCase()}`}
                className="group bg-white rounded-2xl border border-slate-100 p-6 shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all duration-200"
              >
                <div className="flex items-start justify-between mb-4">
                  <span className="text-2xl">{PILIER_ICONS[kpi.pilier] ?? '📊'}</span>
                  <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold border ${s.bg} ${s.text} ${s.border}`}>
                    <span className={`w-1.5 h-1.5 rounded-full ${s.dot}`} />
                    {s.label}
                  </span>
                </div>
                <div className="text-3xl font-black text-[#0A2B4E] mb-1 group-hover:text-[#D4AF37] transition-colors">
                  {kpi.valeur}
                </div>
                <div className="text-xs text-slate-400 mb-3">{kpi.unite} · {kpi.annee}</div>
                <div className="font-semibold text-slate-700 text-sm mb-1">{kpi.nom}</div>
                <div className="text-xs text-slate-400 line-clamp-2">{kpi.definition}</div>
                <div className="mt-4 pt-4 border-t border-slate-50 flex items-center justify-between">
                  <span className="text-xs text-slate-400">{kpi.source}</span>
                  <span className="text-xs font-medium text-[#0A2B4E] opacity-0 group-hover:opacity-100 transition-opacity">
                    Détail →
                  </span>
                </div>
              </Link>
            )
          })}
        </div>
      </section>

      {/* ── PILLARS GRID ── */}
      <section className="bg-[#0A2B4E] py-16">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-10">
            <p className="text-xs font-bold uppercase tracking-widest text-[#D4AF37] mb-1">Architecture</p>
            <h2 className="text-2xl md:text-3xl font-black text-white">7 piliers de l'économie numérique</h2>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-7 gap-3">
            {['Contexte', 'Infrastructures', 'Capital humain', 'Economie productive', 'Fintech', 'E-gouvernement', 'Gouvernance'].map(pilier => {
              const count = KPIS.filter(k => k.pilier === pilier).length
              const vertCount = KPIS.filter(k => k.pilier === pilier && k.statut === 'vert').length
              return (
                <Link
                  key={pilier}
                  href={`/kpis?pilier=${encodeURIComponent(pilier)}`}
                  className="bg-white/5 hover:bg-white/10 border border-white/10 hover:border-[#D4AF37]/40 rounded-xl p-4 text-center transition-all group"
                >
                  <div className="text-2xl mb-2">{PILIER_ICONS[pilier]}</div>
                  <div className="text-white text-xs font-semibold leading-tight mb-2">{pilier}</div>
                  <div className="text-slate-400 text-xs">{count} KPI{count > 1 ? 's' : ''}</div>
                </Link>
              )
            })}
          </div>
        </div>
      </section>

      {/* ── NEWS + BLOG ── */}
      <section className="max-w-7xl mx-auto px-6 py-16">
        <div className="grid lg:grid-cols-2 gap-12">

          {/* actualités */}
          <div>
            <p className="text-xs font-bold uppercase tracking-widest text-[#D4AF37] mb-1">Dernières nouvelles</p>
            <h2 className="text-2xl font-black text-slate-800 mb-6">Actualités</h2>
            <div className="space-y-4">
              {NEWS.map(item => (
                <div key={item.id} className="bg-white rounded-xl border border-slate-100 p-5 hover:shadow-md transition-shadow">
                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 rounded-lg bg-[#0A2B4E]/5 flex items-center justify-center flex-shrink-0 mt-0.5">
                      <span className="text-lg">📰</span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="text-xs text-slate-400 mb-1">{item.date}</div>
                      <div className="font-semibold text-slate-800 text-sm mb-1 leading-snug">{item.titre}</div>
                      <div className="text-xs text-slate-500 line-clamp-2">{item.extrait}</div>
                    </div>
                  </div>
                </div>
              ))}
              <Link href="/actualites" className="block text-center text-sm font-semibold text-[#0A2B4E] hover:text-[#D4AF37] transition-colors pt-2">
                Toutes les actualités →
              </Link>
            </div>
          </div>

          {/* blog */}
          <div>
            <p className="text-xs font-bold uppercase tracking-widest text-[#D4AF37] mb-1">Analyses & insights</p>
            <h2 className="text-2xl font-black text-slate-800 mb-6">Blog</h2>
            <div className="space-y-4">
              {ARTICLES.map(article => (
                <div key={article.id} className="bg-white rounded-xl border border-slate-100 p-5 hover:shadow-md transition-shadow group cursor-pointer">
                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 rounded-lg bg-[#D4AF37]/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                      <span className="text-lg">✍️</span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="text-xs text-slate-400 mb-1">{article.date}</div>
                      <div className="font-semibold text-slate-800 text-sm mb-1 leading-snug group-hover:text-[#0A2B4E] transition-colors">
                        {article.titre}
                      </div>
                      <div className="text-xs text-slate-500 line-clamp-2">{article.extrait}</div>
                    </div>
                  </div>
                </div>
              ))}
              <Link href="/blog" className="block text-center text-sm font-semibold text-[#0A2B4E] hover:text-[#D4AF37] transition-colors pt-2">
                Tous les articles →
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ── CTA BAND ── */}
      <section className="bg-gradient-to-r from-[#0A2B4E] to-[#0d3a6b] py-14">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <h2 className="text-2xl md:text-3xl font-black text-white mb-4">
            Accédez au rapport complet 2025
          </h2>
          <p className="text-slate-300 mb-8 text-lg">
            Analyse détaillée, méthodologie, recommandations et données brutes — disponibles en PDF.
          </p>
          <div className="flex flex-wrap gap-4 justify-center">
            <Link
              href="/rapport"
              className="bg-[#D4AF37] hover:bg-[#c4a030] text-[#0A2B4E] font-bold px-8 py-3.5 rounded-xl transition-all hover:scale-105 shadow-lg"
            >
              📄 Télécharger le rapport PDF
            </Link>
            <Link
              href="/kpis"
              className="bg-white/10 hover:bg-white/20 border border-white/20 text-white font-semibold px-8 py-3.5 rounded-xl transition-colors"
            >
              Explorer les KPIs en ligne
            </Link>
          </div>
        </div>
      </section>

      {/* ── FOOTER ── */}
      <footer className="bg-slate-900 text-slate-400 py-10">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-7 h-7 rounded bg-[#D4AF37] flex items-center justify-center">
                <span className="text-[#0A2B4E] font-black text-xs">R</span>
              </div>
              <span className="text-white font-bold">RENT Tunisia</span>
              <span className="text-slate-600">·</span>
              <span className="text-sm">Édition 2025</span>
            </div>
            <div className="flex items-center gap-6 text-sm">
              <Link href="/about" className="hover:text-white transition-colors">À propos</Link>
              <Link href="/mentions-legales" className="hover:text-white transition-colors">Mentions légales</Link>
              <a href="mailto:contact@rent-tunisia.tn" className="hover:text-white transition-colors">Contact</a>
            </div>
            <div className="text-xs text-slate-600">
              © 2025 RENT Tunisia. Données publiques.
            </div>
          </div>
        </div>
      </footer>

    </div>
  )
}
