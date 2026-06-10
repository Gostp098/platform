'use client'

import Link from 'next/link'
import { useParams } from 'next/navigation'
import { KPIS } from '@/app/lib/kpis/kpis'
import { Nav, Footer } from '@/app/components/NavFooter'

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

// FIX: renamed from "Priorité" to "Niveau d'attention"
const NIVEAU_MAP: Record<string, { bg: string; text: string; border: string }> = {
  'Très haute': { bg: 'bg-red-50',    text: 'text-red-700',    border: 'border-red-200' },
  'Haute':      { bg: 'bg-amber-50',  text: 'text-amber-700',  border: 'border-amber-200' },
  'Moyenne':    { bg: 'bg-blue-50',   text: 'text-blue-700',   border: 'border-blue-200' },
}

function ThresholdBar({ kpi }: { kpi: typeof KPIS[0] }) {
  if (!kpi.seuil_vert && !kpi.seuil_orange && !kpi.seuil_rouge) return null
  return (
    <div className="mt-2">
      <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-3">Seuils d'alerte</p>
      <div className="flex rounded-lg overflow-hidden h-8 text-xs font-semibold">
        <div className="flex-1 bg-red-100 text-red-700 flex items-center justify-center px-2 text-center leading-tight">
          {kpi.seuil_rouge ?? '—'}
        </div>
        <div className="flex-1 bg-amber-100 text-amber-700 flex items-center justify-center px-2 text-center leading-tight border-x border-white">
          {kpi.seuil_orange ?? '—'}
        </div>
        <div className="flex-1 bg-emerald-100 text-emerald-700 flex items-center justify-center px-2 text-center leading-tight">
          {kpi.seuil_vert ?? '—'}
        </div>
      </div>
      <div className="flex text-xs text-slate-400 mt-1" aria-hidden="true">
        <div className="flex-1 text-center">🔴 Critique</div>
        <div className="flex-1 text-center">🟠 À surveiller</div>
        <div className="flex-1 text-center">🟢 Favorable</div>
      </div>
    </div>
  )
}

export default function KPIDetailPage() {
  const params = useParams()
  const idParam = (params?.id as string ?? '').toUpperCase()

  const kpi = KPIS.find(k => k.id === idParam)
  const currentIndex = KPIS.findIndex(k => k.id === idParam)
  const prev = currentIndex > 0 ? KPIS[currentIndex - 1] : null
  const next = currentIndex < KPIS.length - 1 ? KPIS[currentIndex + 1] : null

  if (!kpi) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="text-center">
          <div className="text-6xl mb-4" aria-hidden="true">🔍</div>
          <h1 className="text-2xl font-black text-slate-800 mb-2">KPI introuvable</h1>
          <p className="text-slate-500 mb-6">L'identifiant « {idParam} » n'existe pas.</p>
          <Link href="/kpis" className="bg-[#0A192F] text-white font-semibold px-6 py-3 rounded-xl hover:bg-[#0d3a6b] transition-colors">
            ← Retour aux KPIs
          </Link>
        </div>
      </div>
    )
  }

  const s = STATUS_MAP[kpi.statut]
  const n = NIVEAU_MAP[kpi.priorite] ?? { bg: 'bg-slate-50', text: 'text-slate-600', border: 'border-slate-200' }

  return (
    <div className="min-h-screen bg-slate-50 font-sans">

      <Nav active="/kpis" />

      {/* ── PAGE HEADER ── */}
      <section className="bg-[#0A192F] text-white py-12">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex items-center gap-2 text-sm text-slate-400 mb-5">
            <Link href="/" className="hover:text-white transition-colors">Accueil</Link>
            <span>/</span>
            <Link href="/kpis" className="hover:text-white transition-colors">KPIs</Link>
            <span>/</span>
            <span className="text-white">{kpi.id}</span>
          </div>

          <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-6">
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-3">
                <span className="text-3xl" aria-hidden="true">{PILIER_ICONS[kpi.pilier] ?? '📊'}</span>
                <span className="text-slate-400 text-sm font-medium">{kpi.pilier}</span>
                <span className="text-slate-600">·</span>
                <span className="text-slate-400 text-sm font-mono">{kpi.id}</span>
              </div>
              <h1 className="text-3xl md:text-4xl font-black mb-3 leading-tight">{kpi.nom}</h1>
              <p className="text-slate-300 text-lg max-w-2xl">{kpi.definition}</p>
            </div>

            {/* value card */}
            <div className="bg-white/10 border border-white/20 rounded-2xl p-6 text-center min-w-[160px] backdrop-blur-sm">
              <div className="text-4xl font-black text-[#D4A373] leading-none mb-1">{kpi.valeur}</div>
              <div className="text-slate-300 text-sm mb-3">{kpi.unite}</div>
              <div className="text-slate-400 text-xs">Données {kpi.annee}</div>
            </div>
          </div>
        </div>
      </section>

      {/* ── CONTENT ── */}
      <main className="max-w-7xl mx-auto px-6 py-10">
        <div className="grid lg:grid-cols-3 gap-8">

          {/* left */}
          <div className="lg:col-span-2 space-y-6">

            {/* FIX: "Statut & Niveau d'attention" — renamed from "Priorité" */}
            <div className="bg-white rounded-2xl border border-slate-100 p-6 shadow-sm">
              <h2 className="text-sm font-bold uppercase tracking-widest text-slate-400 mb-4">
                Statut &amp; Niveau d'attention
              </h2>
              <div className="flex flex-wrap gap-3">
                <div className={`inline-flex items-center gap-2 px-4 py-2.5 rounded-xl border ${s.bg} ${s.text} ${s.border}`}>
                  <span className={`w-2.5 h-2.5 rounded-full ${s.dot}`} aria-hidden="true" />
                  <span className="font-semibold">{s.label}</span>
                </div>
                <div className={`inline-flex items-center gap-2 px-4 py-2.5 rounded-xl border ${n.bg} ${n.text} ${n.border}`}>
                  {/* FIX: "Niveau d'attention" instead of "Priorité" */}
                  <span className="font-semibold">Niveau d'attention : {kpi.priorite}</span>
                </div>
              </div>

              <p className="mt-4 text-sm text-slate-600 leading-relaxed">
                {kpi.statut === 'vert'   && 'Cet indicateur est dans la zone favorable selon les seuils définis. La Tunisie performe bien sur cette dimension.'}
                {kpi.statut === 'orange' && 'Cet indicateur est dans la zone de vigilance. Des améliorations sont souhaitables pour atteindre le seuil favorable.'}
                {kpi.statut === 'rouge'  && 'Cet indicateur est dans la zone critique. Une action urgente est recommandée pour améliorer cette dimension.'}
                {kpi.statut === 'gris'   && "Cet indicateur est un indicateur de contexte. Il sert de base de calcul pour les ratios et n'est pas évalué selon des seuils."}
              </p>
            </div>

            {/* thresholds */}
            {(kpi.seuil_vert || kpi.seuil_orange || kpi.seuil_rouge) && (
              <div className="bg-white rounded-2xl border border-slate-100 p-6 shadow-sm">
                <h2 className="text-sm font-bold uppercase tracking-widest text-slate-400 mb-4">Seuils d'évaluation</h2>
                <ThresholdBar kpi={kpi} />
              </div>
            )}

            {/* recommendation */}
            <div className="bg-[#0A192F] rounded-2xl p-6 text-white">
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-xl bg-[#D4A373]/20 flex items-center justify-center flex-shrink-0" aria-hidden="true">
                  <span className="text-xl">💡</span>
                </div>
                <div>
                  <h2 className="text-sm font-bold uppercase tracking-widest text-[#D4A373] mb-2">Recommandation</h2>
                  <p className="text-slate-200 leading-relaxed">{kpi.recommandation}</p>
                </div>
              </div>
            </div>

          </div>

          {/* right — metadata */}
          <div className="space-y-6">

            <div className="bg-white rounded-2xl border border-slate-100 p-6 shadow-sm">
              <h2 className="text-sm font-bold uppercase tracking-widest text-slate-400 mb-4">Source &amp; Métadonnées</h2>
              <div className="space-y-3">
                {[
                  { label: 'Source',      value: kpi.source },
                  { label: 'Année',       value: String(kpi.annee) },
                  { label: 'Unité',       value: kpi.unite },
                  { label: 'Identifiant', value: kpi.id },
                  { label: 'Pilier',      value: kpi.pilier },
                ].map(({ label, value }) => (
                  <div key={label} className="flex items-start justify-between gap-4 py-2 border-b border-slate-50 last:border-0">
                    <span className="text-xs font-medium text-slate-400 flex-shrink-0">{label}</span>
                    <span className="text-sm font-semibold text-slate-700 text-right">{value}</span>
                  </div>
                ))}
              </div>
              {kpi.url && (
                <a
                  href={kpi.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-4 flex items-center gap-2 text-sm font-semibold text-[#0A192F] hover:text-[#D4A373] transition-colors"
                >
                  Consulter la source ↗
                </a>
              )}
            </div>

            {/* other KPIs in same pillar */}
            <div className="bg-white rounded-2xl border border-slate-100 p-6 shadow-sm">
              <h2 className="text-sm font-bold uppercase tracking-widest text-slate-400 mb-4">
                <span aria-hidden="true">{PILIER_ICONS[kpi.pilier]}</span> Pilier {kpi.pilier}
              </h2>
              <div className="space-y-2">
                {KPIS.filter(k => k.pilier === kpi.pilier).map(k => {
                  const ks = STATUS_MAP[k.statut]
                  return (
                    <Link
                      key={k.id}
                      href={`/kpis/${k.id.toLowerCase()}`}
                      className={`flex items-center justify-between p-2.5 rounded-lg transition-colors ${
                        k.id === kpi.id
                          ? 'bg-[#0A192F]/5 border border-[#0A192F]/10'
                          : 'hover:bg-slate-50'
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        <span className={`w-2 h-2 rounded-full ${ks.dot}`} aria-hidden="true" />
                        <span className={`text-sm ${k.id === kpi.id ? 'font-bold text-[#0A192F]' : 'text-slate-600'}`}>
                          {k.nom}
                        </span>
                      </div>
                      <span className="text-xs text-slate-400">{k.id}</span>
                    </Link>
                  )
                })}
              </div>
            </div>

          </div>
        </div>

        {/* ── PREV / NEXT ── */}
        <div className="mt-10 grid grid-cols-2 gap-4">
          {prev ? (
            <Link href={`/kpis/${prev.id.toLowerCase()}`} className="bg-white rounded-xl border border-slate-100 p-5 hover:shadow-md transition-all group">
              <div className="text-xs text-slate-400 mb-1">← Précédent</div>
              <div className="font-semibold text-slate-700 group-hover:text-[#0A192F] transition-colors text-sm">{prev.nom}</div>
              <div className="text-xs text-slate-400 mt-0.5">{prev.id} · {prev.pilier}</div>
            </Link>
          ) : <div />}

          {next ? (
            <Link href={`/kpis/${next.id.toLowerCase()}`} className="bg-white rounded-xl border border-slate-100 p-5 hover:shadow-md transition-all group text-right">
              <div className="text-xs text-slate-400 mb-1">Suivant →</div>
              <div className="font-semibold text-slate-700 group-hover:text-[#0A192F] transition-colors text-sm">{next.nom}</div>
              <div className="text-xs text-slate-400 mt-0.5">{next.id} · {next.pilier}</div>
            </Link>
          ) : <div />}
        </div>
      </main>

      <Footer />
    </div>
  )
}