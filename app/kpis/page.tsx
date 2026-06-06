'use client'

import Link from 'next/link'
import { useState } from 'react'
import { KPIS, PILIERS } from '@/app/lib/kpis/kpis'
import type { KPI } from '@/app/lib/kpis/kpis'

const STATUS_MAP = {
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
  'Fintech':             '💳',
  'E-gouvernement':      '🏛️',
  'Gouvernance':         '⚖️',
}

function KPICard({ kpi }: { kpi: KPI }) {
  const s = STATUS_MAP[kpi.statut]
  return (
    <Link
      href={`/kpis/${kpi.id.toLowerCase()}`}
      className="group bg-white rounded-2xl border border-slate-100 p-6 shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all duration-200 flex flex-col"
    >
      {/* top row */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-2">
          <span className="text-xl">{PILIER_ICONS[kpi.pilier] ?? '📊'}</span>
          <span className="text-xs font-medium text-slate-400">{kpi.id}</span>
        </div>
        <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold border ${s.bg} ${s.text} ${s.border}`}>
          <span className={`w-1.5 h-1.5 rounded-full ${s.dot}`} />
          {s.label}
        </span>
      </div>

      {/* value */}
      <div className="text-3xl font-black text-[#0A2B4E] mb-1 group-hover:text-[#D4AF37] transition-colors leading-none">
        {kpi.valeur}
      </div>
      <div className="text-xs text-slate-400 mb-3">{kpi.unite} · {kpi.annee}</div>

      {/* name + definition */}
      <div className="font-semibold text-slate-800 text-sm mb-1 leading-snug">{kpi.nom}</div>
      <div className="text-xs text-slate-400 line-clamp-2 flex-1">{kpi.definition}</div>

      {/* footer */}
      <div className="mt-4 pt-4 border-t border-slate-50 flex items-center justify-between">
        <span className={`text-xs font-medium px-2 py-0.5 rounded-md bg-slate-100 text-slate-500`}>
          {kpi.pilier}
        </span>
        <span className="text-xs font-medium text-[#0A2B4E] opacity-0 group-hover:opacity-100 transition-opacity">
          Voir le détail →
        </span>
      </div>
    </Link>
  )
}

export default function KPIsPage() {
  const [activePilier, setActivePilier] = useState<string>('Tous')
  const [activeStatut, setActiveStatut] = useState<string>('Tous')

  const filtered = KPIS.filter(k => {
    const pilierMatch = activePilier === 'Tous' || k.pilier === activePilier
    const statutMatch = activeStatut === 'Tous' || k.statut === activeStatut
    return pilierMatch && statutMatch
  })

  const counts = {
    vert:   KPIS.filter(k => k.statut === 'vert').length,
    orange: KPIS.filter(k => k.statut === 'orange').length,
    rouge:  KPIS.filter(k => k.statut === 'rouge').length,
    gris:   KPIS.filter(k => k.statut === 'gris').length,
  }

  return (
    <div className="min-h-screen bg-slate-50 font-sans">

      {/* ── NAV ── */}
      <header className="bg-[#0A2B4E] sticky top-0 z-50 shadow-md">
        <nav className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-3">
            <div className="w-8 h-8 rounded bg-[#D4AF37] flex items-center justify-center">
              <span className="text-[#0A2B4E] font-black text-sm">R</span>
            </div>
            <span className="text-white font-bold text-lg tracking-tight">RENT Tunisia</span>
            <span className="hidden sm:block text-[#D4AF37] text-xs font-medium tracking-widest uppercase ml-1 opacity-80">2025</span>
          </Link>
          <div className="hidden md:flex items-center gap-1">
            {[
              { label: 'Accueil', href: '/' },
              { label: 'KPIs', href: '/kpis' },
              { label: 'Actualités', href: '/actualites' },
              { label: 'Rapport', href: '/rapport' },
              { label: 'À propos', href: '/about' },
            ].map(item => (
              <Link
                key={item.label}
                href={item.href}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  item.href === '/kpis'
                    ? 'bg-white/15 text-white'
                    : 'text-slate-300 hover:text-white hover:bg-white/10'
                }`}
              >
                {item.label}
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
            Filtrez par pilier ou par statut d'alerte pour explorer les données 2025.
          </p>

          {/* status summary pills */}
          <div className="flex flex-wrap gap-3 mt-6">
            {[
              { statut: 'vert',   label: 'Favorables',    count: counts.vert,   dot: 'bg-emerald-400' },
              { statut: 'orange', label: 'À surveiller',  count: counts.orange, dot: 'bg-amber-400' },
              { statut: 'rouge',  label: 'Critiques',     count: counts.rouge,  dot: 'bg-red-400' },
              { statut: 'gris',   label: 'Contexte',      count: counts.gris,   dot: 'bg-slate-400' },
            ].map(({ statut, label, count, dot }) => (
              <button
                key={statut}
                onClick={() => setActiveStatut(activeStatut === statut ? 'Tous' : statut)}
                className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-sm font-medium border transition-all ${
                  activeStatut === statut
                    ? 'bg-white text-[#0A2B4E] border-white'
                    : 'bg-white/10 text-white border-white/20 hover:bg-white/20'
                }`}
              >
                <span className={`w-2 h-2 rounded-full ${dot}`} />
                {count} {label}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* ── PILIER FILTERS ── */}
      <div className="bg-white border-b border-slate-100 sticky top-16 z-40 shadow-sm">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex items-center gap-2 overflow-x-auto py-3 scrollbar-hide">
            <button
              onClick={() => setActivePilier('Tous')}
              className={`flex-shrink-0 px-4 py-2 rounded-lg text-sm font-semibold transition-all ${
                activePilier === 'Tous'
                  ? 'bg-[#0A2B4E] text-white'
                  : 'text-slate-600 hover:bg-slate-100'
              }`}
            >
              Tous ({KPIS.length})
            </button>
            {PILIERS.map(pilier => {
              const count = KPIS.filter(k => k.pilier === pilier).length
              return (
                <button
                  key={pilier}
                  onClick={() => setActivePilier(activePilier === pilier ? 'Tous' : pilier)}
                  className={`flex-shrink-0 inline-flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-semibold transition-all ${
                    activePilier === pilier
                      ? 'bg-[#D4AF37] text-[#0A2B4E]'
                      : 'text-slate-600 hover:bg-slate-100'
                  }`}
                >
                  <span>{PILIER_ICONS[pilier]}</span>
                  {pilier}
                  <span className={`text-xs px-1.5 py-0.5 rounded-full ${
                    activePilier === pilier ? 'bg-[#0A2B4E]/20' : 'bg-slate-200'
                  }`}>
                    {count}
                  </span>
                </button>
              )
            })}
          </div>
        </div>
      </div>

      {/* ── KPI GRID ── */}
      <main className="max-w-7xl mx-auto px-6 py-10">

        {/* result count */}
        <div className="flex items-center justify-between mb-6">
          <p className="text-sm text-slate-500">
            <span className="font-bold text-slate-800">{filtered.length}</span> indicateur{filtered.length > 1 ? 's' : ''}
            {activePilier !== 'Tous' && <span> · pilier <span className="font-semibold text-[#0A2B4E]">{activePilier}</span></span>}
            {activeStatut !== 'Tous' && <span> · statut <span className="font-semibold text-[#0A2B4E]">{STATUS_MAP[activeStatut as keyof typeof STATUS_MAP]?.label}</span></span>}
          </p>
          {(activePilier !== 'Tous' || activeStatut !== 'Tous') && (
            <button
              onClick={() => { setActivePilier('Tous'); setActiveStatut('Tous') }}
              className="text-xs text-slate-400 hover:text-slate-700 transition-colors underline"
            >
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
      </main>

      {/* ── FOOTER ── */}
      <footer className="bg-slate-900 text-slate-400 py-10 mt-10">
        <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-4">
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
          <div className="text-xs text-slate-600">© 2025 RENT Tunisia. Données publiques.</div>
        </div>
      </footer>

    </div>
  )
}