'use client'

import Link from 'next/link'
import { useState } from 'react'
import { Nav, Footer } from '@/app/components/NavFooter'

const KEY_FIGURES = [
  { value: '15',    label: 'KPIs suivis',          icon: '📊' },
  { value: '5',     label: 'Piliers stratégiques',  icon: '🏛️' },
  { value: '48,7',  label: 'Score IMNT / 100',      icon: '📈' },
  { value: '39,29', label: 'Score NRI / 100',        icon: '🌐' },
  { value: '96ᵉ',   label: 'Rang mondial (NRI)',    icon: '🗺️' },
  { value: '10ᵉ',   label: 'Rang Arab States',      icon: '🏆' },
]

export default function RapportPage() {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError]         = useState<string | null>(null)

  const handleDownload = async () => {
    setIsLoading(true)
    setError(null)
    try {
      const response = await fetch('/api/generate-report')
      if (!response.ok) {
        const json = await response.json().catch(() => ({}))
        throw new Error(json.error ?? `HTTP ${response.status}`)
      }
      const blob = await response.blob()
      const url  = window.URL.createObjectURL(blob)
      const a    = document.createElement('a')
      a.href     = url
      a.download = 'ThinkDigital_ThinkTunisia_2025.pdf'
      document.body.appendChild(a)
      a.click()
      window.URL.revokeObjectURL(url)
      document.body.removeChild(a)
    } catch (err) {
      console.error('PDF generation error:', err)
      setError(err instanceof Error ? err.message : 'Erreur inconnue')
    } finally {
      setIsLoading(false)
    }
  }

  const handlePreview = () => {
    window.open('/api/generate-report?preview', '_blank')
  }

  return (
    <div className="min-h-screen bg-slate-50 font-sans">

      <Nav active="/rapport" />

      {/* ── ERROR BANNER ── */}
      {error && (
        <div className="bg-red-50 border-b border-red-200 px-6 py-3 text-center text-sm text-red-700">
          ⚠ Erreur lors de la génération : <span className="font-semibold">{error}</span>
          <button onClick={() => setError(null)} className="ml-4 underline">Fermer</button>
        </div>
      )}

      {/* ── HERO ── */}
      <section className="bg-[#0A192F] text-white py-16">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex items-center gap-2 text-sm text-slate-400 mb-4">
            <Link href="/" className="hover:text-white transition-colors">Accueil</Link>
            <span>/</span>
            <span className="text-white">Rapport</span>
          </div>
          <div className="grid lg:grid-cols-2 gap-12 items-center">

            {/* text */}
            <div>
              <div className="inline-flex items-center gap-2 bg-[#D4A373]/20 border border-[#D4A373]/30 rounded-full px-4 py-1.5 mb-5">
                <span className="w-2 h-2 rounded-full bg-[#D4A373] animate-pulse" aria-hidden="true" />
                <span className="text-[#D4A373] text-xs font-semibold tracking-wider uppercase">Édition 2025</span>
              </div>
              <h1 className="text-3xl md:text-4xl font-black mb-4 leading-tight">
                Rapport Annuel de<br />
                <span className="text-[#D4A373]">l'Économie Numérique</span><br />
                en Tunisie
              </h1>
              <p className="text-slate-300 leading-relaxed mb-8 max-w-xl">
                15 indicateurs clés. Un score IMNT. Des analyses par pilier.
                Des recommandations court, moyen et long terme.
                Tout ce que vous devez savoir sur l'économie numérique tunisienne,
                dans un document unique.
              </p>
              <div className="flex flex-wrap gap-4">
                {/* FIX: CTA label aligned with doc corrections */}
                <button
                  onClick={handleDownload}
                  disabled={isLoading}
                  className="bg-[#D4A373] hover:bg-[#c49a6c] text-[#0A192F] font-bold px-8 py-3.5 rounded-xl transition-all hover:scale-105 shadow-lg flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <span aria-hidden="true">📄</span>
                  {isLoading ? 'Génération en cours...' : 'Télécharger le rapport PDF'}
                </button>
                <button
                  onClick={handlePreview}
                  className="bg-white/10 hover:bg-white/20 border border-white/20 text-white font-semibold px-8 py-3.5 rounded-xl transition-colors flex items-center gap-2"
                >
                  <span aria-hidden="true">🖥️</span> Consulter en ligne
                </button>
              </div>
            </div>

            {/* mockup */}
            <div className="hidden lg:flex justify-center" aria-hidden="true">
              <div className="relative">
                <div className="absolute -bottom-4 left-1/2 -translate-x-1/2 w-48 h-8 bg-black/30 blur-xl rounded-full" />
                <div
                  className="w-64 h-80 bg-white rounded-2xl shadow-2xl flex flex-col overflow-hidden border border-white/20"
                  style={{ transform: 'perspective(800px) rotateY(-8deg) rotateX(3deg)' }}
                >
                  <div className="bg-[#0A192F] h-4 w-full" />
                  <div className="flex-1 bg-gradient-to-br from-slate-50 to-white p-6 flex flex-col justify-between">
                    <div>
                      <div className="w-8 h-8 rounded-lg bg-[#D4A373] flex items-center justify-center mb-4">
                        <span className="text-[#0A192F] font-black text-sm">T</span>
                      </div>
                      <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-1">Rapport Annuel</p>
                      <p className="text-lg font-black text-[#0A192F] leading-tight">Économie Numérique en Tunisie</p>
                      <p className="text-[#D4A373] font-bold text-sm mt-1">Édition 2025</p>
                    </div>
                    <div className="space-y-2">
                      {[
                        { color: 'bg-emerald-500', text: '15 indicateurs clés' },
                        { color: 'bg-amber-400',   text: 'Score IMNT : 48,7/100' },
                        { color: 'bg-blue-500',    text: '5 piliers stratégiques' },
                      ].map(({ color, text }) => (
                        <div key={text} className="flex items-center gap-2 text-xs text-slate-500">
                          <span className={`w-2 h-2 rounded-full ${color}`} />
                          {text}
                        </div>
                      ))}
                    </div>
                    <div className="border-t border-slate-100 pt-3">
                      <p className="text-[9px] text-slate-400">Think Digital, Think Tunisia</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── CHIFFRES CLÉS ── */}
      <section className="max-w-7xl mx-auto px-6 -mt-6 relative z-10 mb-12">
        <div className="bg-white rounded-2xl shadow-xl border border-slate-100 p-6">
          <p className="text-xs font-bold uppercase tracking-widest text-slate-400 mb-4">
            Résumé visuel — chiffres clés du rapport
          </p>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {KEY_FIGURES.map(({ value, label, icon }) => (
              <div key={label} className="text-center p-3">
                <div className="text-2xl mb-2" aria-hidden="true">{icon}</div>
                <div className="text-2xl font-black text-[#0A192F]">{value}</div>
                <div className="text-xs text-slate-400 mt-1 leading-tight">{label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CONTENU DU RAPPORT ── */}
      <section className="max-w-7xl mx-auto px-6 py-4 mb-12">
        <div className="grid md:grid-cols-3 gap-6">
          {[
            {
              icon: '📊',
              title: 'Tableau de bord KPIs',
              body: "15 indicateurs clés couvrant les 5 piliers de l'IMNT — Infrastructure, Capital humain, Économie productive, E-gouvernement et Gouvernance & Cyber.",
            },
            {
              icon: '🔬',
              title: 'Analyses par pilier',
              body: "Chaque pilier fait l'objet d'une analyse qualitative et quantitative, avec identification des forces, faiblesses et leviers d'action prioritaires.",
            },
            {
              icon: '🎯',
              title: 'Recommandations',
              body: "Des recommandations classées par horizon (court, moyen, long terme) et par acteur (gouvernement, secteur privé, société civile).",
            },
          ].map(c => (
            <div key={c.title} className="bg-white rounded-2xl border border-slate-100 p-6 shadow-sm">
              <div className="text-3xl mb-4" aria-hidden="true">{c.icon}</div>
              <h3 className="font-black text-slate-800 text-lg mb-2">{c.title}</h3>
              <p className="text-sm text-slate-500 leading-relaxed">{c.body}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── CITATION ── */}
      <section className="bg-[#0A192F] py-14">
        <div className="max-w-3xl mx-auto px-6 text-center">
          <p className="text-[#D4A373] text-xs font-bold uppercase tracking-widest mb-4">Extrait du manifeste</p>
          <blockquote className="text-xl md:text-2xl font-bold text-white leading-relaxed mb-6">
            "La transformation digitale ne s'improvise pas. Elle se mesure."
          </blockquote>
          <p className="text-slate-400 text-sm">
            — Une initiative pensée par{' '}
            <span className="text-white font-semibold">Rim Jalouli</span>
            {' '}· Conception &amp; consultation :{' '}
            <span className="text-white font-semibold">Wahib Zaier</span>
          </p>
        </div>
      </section>

      {/* ── ARCHIVES ── */}
      <section className="max-w-7xl mx-auto px-6 py-14">
        <p className="text-xs font-bold uppercase tracking-widest text-[#D4A373] mb-1">Historique</p>
        <h2 className="text-2xl font-black text-slate-800 mb-2">Archives des rapports</h2>
        {/* FIX: honest archive wording from corrections doc */}
        <p className="text-sm text-slate-500 mb-6">
          Cette plateforme en est à sa version pilote. Les éditions antérieures correspondent
          à des travaux préparatoires internes et ne sont pas diffusées publiquement dans
          cette version.
        </p>
        <div className="grid md:grid-cols-3 gap-4">
          {[
            { year: '2025', label: 'Édition actuelle',  current: true  },
            { year: '2024', label: 'Travaux internes',  current: false },
            { year: '2023', label: 'Travaux internes',  current: false },
          ].map(({ year, label, current }) => (
            <div
              key={year}
              className={`rounded-2xl border p-6 flex items-center justify-between ${
                current ? 'bg-[#0A192F] border-[#0A192F] text-white' : 'bg-white border-slate-200'
              }`}
            >
              <div>
                <div className={`text-2xl font-black ${current ? 'text-[#D4A373]' : 'text-slate-400'}`}>{year}</div>
                <div className={`text-sm mt-0.5 ${current ? 'text-slate-300' : 'text-slate-400'}`}>{label}</div>
              </div>
              <button
                onClick={current ? handleDownload : undefined}
                disabled={!current}
                className={`text-sm font-semibold px-4 py-2 rounded-lg transition-colors ${
                  current
                    ? 'bg-[#D4A373] text-[#0A192F] hover:bg-[#c49a6c] disabled:opacity-50'
                    : 'bg-slate-100 text-slate-400 cursor-not-allowed'
                }`}
              >
                {/* FIX: "Non disponible" instead of "Archivé" for older editions */}
                {current ? (isLoading ? 'Génération...' : 'Télécharger') : 'Non disponible'}
              </button>
            </div>
          ))}
        </div>
      </section>

      <Footer />
    </div>
  )
}