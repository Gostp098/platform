'use client'

import Link from 'next/link'
import { useState } from 'react'
import { KPIS, type KPI } from '@/app/lib/kpis/kpis'

const STATUS_MAP = {
  vert:   { bg: 'bg-emerald-50', text: 'text-emerald-700', border: 'border-emerald-200', dot: 'bg-emerald-500', bar: 'bg-emerald-500', label: 'Favorable' },
  orange: { bg: 'bg-amber-50',   text: 'text-amber-700',   border: 'border-amber-200',   dot: 'bg-amber-400',   bar: 'bg-amber-400',   label: 'À surveiller' },
  rouge:  { bg: 'bg-red-50',     text: 'text-red-700',     border: 'border-red-200',     dot: 'bg-red-500',     bar: 'bg-red-500',     label: 'Critique' },
  gris:   { bg: 'bg-slate-50',   text: 'text-slate-600',   border: 'border-slate-200',   dot: 'bg-slate-400',   bar: 'bg-slate-400',   label: 'Contexte' },
}

// 5 piliers IMNT — mapping vers les piliers du fichier kpis.ts
const IMNT_PILIERS = [
  { num: '01', label: 'Infrastructures',     icon: '📡', keys: ['Infrastructures'] },
  { num: '02', label: 'Capital humain',      icon: '🎓', keys: ['Capital humain'] },
  { num: '03', label: 'Économie productive', icon: '🚀', keys: ['Economie productive', 'Fintech'] },
  { num: '04', label: 'E-gouvernement',      icon: '🏛️', keys: ['E-gouvernement'] },
  { num: '05', label: 'Gouvernance & Cyber', icon: '⚖️', keys: ['Gouvernance'] },
]

const PILIER_ICONS: Record<string, string> = {
  'Contexte':            '🗺️',
  'Infrastructures':     '📡',
  'Capital humain':      '🎓',
  'Economie productive': '🚀',
  'Fintech':             '💳',
  'E-gouvernement':      '🏛️',
  'Gouvernance':         '⚖️',
}

function pilierScore(keys: string[]): number {
  const kpis = KPIS.filter(k => keys.includes(k.pilier) && k.statut !== 'gris')
  if (!kpis.length) return 0
  const total = kpis.reduce((acc, k) => {
    if (k.statut === 'vert') return acc + 1
    if (k.statut === 'orange') return acc + 0.5
    return acc
  }, 0)
  return Math.round((total / kpis.length) * 100)
}

function ScoreGauge({ score, size = 'md' }: { score: number; size?: 'sm' | 'md' }) {
  const color = score >= 65 ? '#10b981' : score >= 40 ? '#f59e0b' : '#ef4444'
  const r = size === 'sm' ? 36 : 50
  const cx = size === 'sm' ? 46 : 62
  const cy = size === 'sm' ? 46 : 62
  const sw = size === 'sm' ? 8 : 10
  const circ = Math.PI * r
  const offset = circ - (score / 100) * circ
  const angle = (score / 100) * 180
  const rad = (angle - 180) * (Math.PI / 180)
  const x = cx + r * Math.cos(rad)
  const y = cy + r * Math.sin(rad)
  const vb = size === 'sm' ? '0 0 92 54' : '0 0 124 74'
  return (
    <svg viewBox={vb} className={size === 'sm' ? 'w-24' : 'w-36'}>
      <path d={`M ${cx-r} ${cy} A ${r} ${r} 0 0 1 ${cx+r} ${cy}`} fill="none" stroke="#e2e8f0" strokeWidth={sw} strokeLinecap="round"/>
      <path d={`M ${cx-r} ${cy} A ${r} ${r} 0 0 1 ${cx+r} ${cy}`} fill="none" stroke={color} strokeWidth={sw} strokeLinecap="round"
        strokeDasharray={circ} strokeDashoffset={offset} style={{transition:'stroke-dashoffset 1s ease'}}/>
      <line x1={cx} y1={cy} x2={x} y2={y} stroke="#1e293b" strokeWidth={2} strokeLinecap="round"/>
      <circle cx={cx} cy={cy} r={4} fill="#1e293b"/>
      <text x={cx} y={cy-6} fontSize={size==='sm'?'11':'14'} fontWeight="700" fill="#0f172a" textAnchor="middle">{score}</text>
      <text x={cx} y={cy+6} fontSize="8" fill="#94a3b8" textAnchor="middle">/100</text>
    </svg>
  )
}

function KPICard({ kpi }: { kpi: KPI }) {
  const s = STATUS_MAP[kpi.statut]
  return (
    <Link href={`/kpis/${kpi.id.toLowerCase()}`}
      className="group bg-white rounded-2xl border border-slate-100 p-6 shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all duration-200 flex flex-col">
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-2">
          <span className="text-xl">{PILIER_ICONS[kpi.pilier] ?? '📊'}</span>
          <span className="text-xs font-medium text-slate-400">{kpi.id}</span>
        </div>
        <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold border ${s.bg} ${s.text} ${s.border}`}>
          <span className={`w-1.5 h-1.5 rounded-full ${s.dot}`}/>{s.label}
        </span>
      </div>
      <div className="text-3xl font-black text-[#0A2B4E] mb-1 group-hover:text-[#D4AF37] transition-colors leading-none">{kpi.valeur}</div>
      <div className="text-xs text-slate-400 mb-3">{kpi.unite} · {kpi.annee}</div>
      <div className="font-semibold text-slate-800 text-sm mb-1 leading-snug">{kpi.nom}</div>
      <div className="text-xs text-slate-400 line-clamp-2 flex-1">{kpi.definition}</div>
      <div className="mt-4 pt-4 border-t border-slate-50 flex items-center justify-between">
        <span className="text-xs font-medium px-2 py-0.5 rounded-md bg-slate-100 text-slate-500">{kpi.pilier}</span>
        <span className="text-xs font-medium text-[#0A2B4E] opacity-0 group-hover:opacity-100 transition-opacity">Voir le détail →</span>
      </div>
    </Link>
  )
}

export default function KPIsPage() {
  const [activePilier, setActivePilier] = useState<string>('Tous')
  const [activeStatut, setActiveStatut] = useState<string>('Tous')

  // Filter using IMNT pilier keys
  const getKeysForFilter = (label: string): string[] => {
    const found = IMNT_PILIERS.find(p => p.label === label)
    return found ? found.keys : []
  }

  const filtered = KPIS.filter(k => {
    const pilierMatch = activePilier === 'Tous' || getKeysForFilter(activePilier).includes(k.pilier)
    const statutMatch = activeStatut === 'Tous' || k.statut === activeStatut
    return pilierMatch && statutMatch
  })

  const counts = {
    vert:   KPIS.filter(k => k.statut === 'vert').length,
    orange: KPIS.filter(k => k.statut === 'orange').length,
    rouge:  KPIS.filter(k => k.statut === 'rouge').length,
    gris:   KPIS.filter(k => k.statut === 'gris').length,
  }

  const imnt = (() => {
    const scored = KPIS.filter(k => k.statut !== 'gris')
    const total = scored.reduce((acc, k) => {
      if (k.statut === 'vert') return acc + 1
      if (k.statut === 'orange') return acc + 0.5
      return acc
    }, 0)
    return Math.round((total / scored.length) * 100)
  })()

  return (
    <div className="min-h-screen bg-slate-50 font-sans">

      {/* ── NAV ── */}
      <header className="bg-[#0A2B4E] sticky top-0 z-50 shadow-md">
        <nav className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-3">
            <div className="w-8 h-8 rounded bg-[#D4AF37] flex items-center justify-center">
              <span className="text-[#0A2B4E] font-black text-sm">T</span>
            </div>
            <div className="leading-tight">
              <span className="text-white font-black text-sm tracking-tight block">Think Digital</span>
              <span className="text-[#D4AF37] text-[10px] font-semibold tracking-widest uppercase -mt-0.5 block">Think Tunisia</span>
            </div>
          </Link>
          <div className="hidden md:flex items-center gap-1">
            {[
              { label: 'Accueil', href: '/' },
              { label: 'KPIs', href: '/kpis' },
              { label: 'Actualités', href: '/actualites' },
              { label: 'Rapport', href: '/rapport' },
              { label: 'Méthodologie', href: '/methodologie' },
              { label: 'À propos', href: '/about' },
            ].map(item => (
              <Link key={item.label} href={item.href}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  item.href === '/kpis' ? 'bg-white/15 text-white' : 'text-slate-300 hover:text-white hover:bg-white/10'
                }`}>
                {item.label}
              </Link>
            ))}
          </div>
          <Link href="/rapport" className="bg-[#D4AF37] hover:bg-[#c4a030] text-[#0A2B4E] font-semibold text-sm px-4 py-2 rounded-lg transition-colors">
            Télécharger le rapport
          </Link>
        </nav>
      </header>

      {/* ── PAGE HEADER ── */}
      <section className="bg-[#0A2B4E] text-white py-14">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex items-center gap-2 text-sm text-slate-400 mb-4">
            <Link href="/" className="hover:text-white transition-colors">Accueil</Link>
            <span>/</span>
            <span className="text-white">KPIs</span>
          </div>
          <h1 className="text-3xl md:text-4xl font-black mb-3">
            Les <span className="text-[#D4AF37]">15 indicateurs</span> de l'économie numérique
          </h1>
          <p className="text-slate-300 text-lg max-w-2xl">
            Dashboard chiffré — scores, classements et indicateurs par pilier IMNT 2025.
          </p>
          <div className="flex flex-wrap gap-3 mt-6">
            {[
              { statut: 'vert',   label: 'Favorables',   count: counts.vert,   dot: 'bg-emerald-400' },
              { statut: 'orange', label: 'À surveiller', count: counts.orange, dot: 'bg-amber-400' },
              { statut: 'rouge',  label: 'Critiques',    count: counts.rouge,  dot: 'bg-red-400' },
              { statut: 'gris',   label: 'Contexte',     count: counts.gris,   dot: 'bg-slate-400' },
            ].map(({ statut, label, count, dot }) => (
              <button key={statut}
                onClick={() => setActiveStatut(activeStatut === statut ? 'Tous' : statut)}
                className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-sm font-medium border transition-all ${
                  activeStatut === statut ? 'bg-white text-[#0A2B4E] border-white' : 'bg-white/10 text-white border-white/20 hover:bg-white/20'
                }`}>
                <span className={`w-2 h-2 rounded-full ${dot}`}/>{count} {label}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* ── SCORE GLOBAL + NRI ── */}
      <div className="max-w-7xl mx-auto px-6 -mt-6 relative z-10 mb-8">
        <div className="bg-white rounded-2xl shadow-xl border border-slate-100 p-6">
          <p className="text-xs font-bold uppercase tracking-widest text-[#D4AF37] mb-4">Score global & Classement</p>
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {[
              { label: 'Score NRI global',   value: '39,29', sub: '/ 100',           accent: false },
              { label: 'Score IMNT',          value: '48,7',  sub: '/ 100',           accent: true  },
              { label: 'Rang mondial',        value: '96ᵉ',   sub: 'sur 127',         accent: false },
              { label: 'Rang revenus',        value: '14ᵉ',   sub: 'Lower-middle',    accent: false },
              { label: 'Rang Arab States',    value: '10ᵉ',   sub: 'région',          accent: false },
              { label: 'Pilier fort',         value: 'Tech',  sub: 'Technology',      accent: false },
            ].map(({ label, value, sub, accent }) => (
              <div key={label} className={`rounded-xl p-4 text-center ${accent ? 'bg-[#D4AF37] text-[#0A2B4E]' : 'bg-slate-50'}`}>
                <div className={`text-2xl font-black ${accent ? 'text-[#0A2B4E]' : 'text-[#0A2B4E]'}`}>{value}</div>
                <div className={`text-xs mt-0.5 ${accent ? 'text-[#0A2B4E]/70' : 'text-slate-400'}`}>{sub}</div>
                <div className={`text-xs font-semibold mt-1 ${accent ? 'text-[#0A2B4E]' : 'text-slate-600'}`}>{label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── 5 PILIERS SCORES ── */}
      <div className="max-w-7xl mx-auto px-6 mb-8">
        <p className="text-xs font-bold uppercase tracking-widest text-slate-500 mb-3">Scores détaillés par pilier IMNT</p>
        <div className="grid grid-cols-1 sm:grid-cols-5 gap-3">
          {IMNT_PILIERS.map(({ num, label, icon, keys }) => {
            const score = pilierScore(keys)
            const color = score >= 65 ? 'text-emerald-600' : score >= 40 ? 'text-amber-600' : 'text-red-600'
            const kpiCount = KPIS.filter(k => keys.includes(k.pilier)).length
            return (
              <button key={num}
                onClick={() => setActivePilier(activePilier === label ? 'Tous' : label)}
                className={`rounded-xl p-4 text-center border transition-all ${
                  activePilier === label
                    ? 'bg-[#0A2B4E] border-[#0A2B4E] text-white'
                    : 'bg-white border-slate-200 hover:border-[#D4AF37]/50 hover:shadow-md'
                }`}>
                <div className="text-2xl mb-1">{icon}</div>
                <div className={`text-xs font-bold mb-1 ${activePilier === label ? 'text-slate-300' : 'text-slate-400'}`}>{num}</div>
                <div className={`text-sm font-bold leading-tight mb-2 ${activePilier === label ? 'text-white' : 'text-slate-700'}`}>{label}</div>
                <ScoreGauge score={score} size="sm" />
                <div className={`text-xs mt-1 ${activePilier === label ? 'text-slate-400' : 'text-slate-400'}`}>{kpiCount} KPI{kpiCount > 1 ? 's' : ''}</div>
              </button>
            )
          })}
        </div>
      </div>

      {/* ── PILIER FILTER BAR ── */}
      <div className="bg-white border-b border-slate-100 sticky top-16 z-40 shadow-sm">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex items-center gap-2 overflow-x-auto py-3 scrollbar-hide">
            <button onClick={() => setActivePilier('Tous')}
              className={`flex-shrink-0 px-4 py-2 rounded-lg text-sm font-semibold transition-all ${
                activePilier === 'Tous' ? 'bg-[#0A2B4E] text-white' : 'text-slate-600 hover:bg-slate-100'
              }`}>
              Tous ({KPIS.length})
            </button>
            {IMNT_PILIERS.map(({ label, icon, keys }) => {
              const count = KPIS.filter(k => keys.includes(k.pilier)).length
              return (
                <button key={label}
                  onClick={() => setActivePilier(activePilier === label ? 'Tous' : label)}
                  className={`flex-shrink-0 inline-flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-semibold transition-all ${
                    activePilier === label ? 'bg-[#D4AF37] text-[#0A2B4E]' : 'text-slate-600 hover:bg-slate-100'
                  }`}>
                  <span>{icon}</span>{label}
                  <span className={`text-xs px-1.5 py-0.5 rounded-full ${activePilier === label ? 'bg-[#0A2B4E]/20' : 'bg-slate-200'}`}>{count}</span>
                </button>
              )
            })}
          </div>
        </div>
      </div>

      {/* ── KPI GRID ── */}
      <main className="max-w-7xl mx-auto px-6 py-10">
        <div className="flex items-center justify-between mb-6">
          <p className="text-sm text-slate-500">
            <span className="font-bold text-slate-800">{filtered.length}</span> indicateur{filtered.length > 1 ? 's' : ''}
            {activePilier !== 'Tous' && <span> · pilier <span className="font-semibold text-[#0A2B4E]">{activePilier}</span></span>}
            {activeStatut !== 'Tous' && <span> · statut <span className="font-semibold text-[#0A2B4E]">{STATUS_MAP[activeStatut as keyof typeof STATUS_MAP]?.label}</span></span>}
          </p>
          {(activePilier !== 'Tous' || activeStatut !== 'Tous') && (
            <button onClick={() => { setActivePilier('Tous'); setActiveStatut('Tous') }}
              className="text-xs text-slate-400 hover:text-slate-700 transition-colors underline">
              Réinitialiser les filtres
            </button>
          )}
        </div>

        {filtered.length === 0 ? (
          <div className="text-center py-24 text-slate-400">
            <div className="text-5xl mb-4">🔍</div>
            <p className="font-semibold text-lg">Aucun résultat</p>
            <p className="text-sm mt-1">Essayez une autre combinaison de filtres</p>
          </div>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filtered.map(kpi => <KPICard key={kpi.id} kpi={kpi} />)}
          </div>
        )}

        {/* benchmark note */}
        <div className="mt-12 bg-slate-100 rounded-xl p-5 text-sm text-slate-500">
          <span className="font-semibold text-slate-700">Benchmark régional :</span> La Tunisie se classe <strong>10ᵉ sur les Arab States</strong> et <strong>14ᵉ dans le groupe Lower-middle-income</strong> selon le NRI 2025 (Portulans Institute). Les comparatifs détaillés par indicateur sont disponibles dans le rapport annuel.{' '}
          <Link href="/rapport" className="text-[#0A2B4E] font-semibold hover:underline">Télécharger →</Link>
        </div>
      </main>

      {/* ── FOOTER ── */}
      <footer className="bg-slate-900 text-slate-400 py-10 mt-10">
        <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-7 h-7 rounded bg-[#D4AF37] flex items-center justify-center">
              <span className="text-[#0A2B4E] font-black text-xs">T</span>
            </div>
            <span className="text-white font-bold">Think Digital, Think Tunisia</span>
          </div>
          <div className="flex items-center gap-6 text-sm">
            <Link href="/about" className="hover:text-white transition-colors">À propos</Link>
            <Link href="/methodologie" className="hover:text-white transition-colors">Méthodologie</Link>
            <Link href="/mentions-legales" className="hover:text-white transition-colors">Mentions légales</Link>
          </div>
          <div className="text-xs text-slate-600">© 2025 Think Digital, Think Tunisia.</div>
        </div>
      </footer>
    </div>
  )
}
