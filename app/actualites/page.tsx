'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Nav, Footer } from '@/app/components/NavFooter'

const TAGS = ['Tous', 'Infrastructure', 'Startup', 'E-gouvernement', 'Fintech', 'Rapport']

const ALL_NEWS = [
  {
    id: 1,
    titre: 'Lancement officiel de la plateforme Think Digital, Think Tunisia',
    date: '1ᵉʳ juin 2025',
    extrait:
      "La plateforme officielle de suivi de l'économie numérique tunisienne est en ligne. Elle centralise 15 KPIs couvrant 5 piliers stratégiques et produit un rapport annuel automatisé.",
    tag: 'Rapport',
    important: true,
    source: null, // internal launch — no external link
    sourceLabel: null,
  },
  {
    id: 2,
    titre: "Paiements mobiles en Tunisie : 8,4 millions d'opérations en 2025",
    date: '15 mai 2025',
    extrait:
      "La Banque Centrale de Tunisie publie ses données sur les paiements mobiles. Le nombre d'opérations atteint 8,4 millions, confirmant la progression de l'inclusion financière numérique.",
    tag: 'Fintech',
    important: false,
    source: 'https://www.bct.gov.tn/bct/siteprod/page.jsp?id=209',
    sourceLabel: 'Banque Centrale de Tunisie',
  },
  {
    id: 3,
    titre: 'Nouvelle stratégie e-gouvernement tunisien 2025–2030',
    date: '10 avril 2025',
    extrait:
      'Le gouvernement tunisien annonce un plan ambitieux de digitalisation des services publics à horizon 2030, avec un objectif de 80 % de services disponibles en ligne.',
    tag: 'E-gouvernement',
    important: false,
    source: 'https://www.mdici.gov.tn/',
    sourceLabel: 'Ministère des Technologies de la Communication',
  },
  {
    id: 4,
    titre: "E-Houwiya : l'identité numérique mobile atteint 200 000 abonnés",
    date: '22 mars 2025',
    extrait:
      "L'identité numérique mobile tunisienne franchit le cap des 200 000 abonnés, mais la progression reste en dessous des objectifs fixés pour 2025.",
    tag: 'E-gouvernement',
    important: false,
    source: 'https://idtechwire.com/tunisias-mobile-id-subscribers-reach-200000/',
    sourceLabel: 'ID Tech Wire',
  },
  {
    id: 5,
    titre: 'StartupBlink 2025 : la Tunisie classée 82ᵉ écosystème mondial',
    date: '5 mars 2025',
    extrait:
      "La Tunisie consolide sa position sur la carte mondiale de l'entrepreneuriat tech, avec plus de 1 400 startups enregistrées sous le Startup Act.",
    tag: 'Startup',
    important: false,
    source: 'https://www.startupblink.com/startup-ecosystem/tunisia',
    sourceLabel: 'StartupBlink 2025',
  },
  {
    id: 6,
    // FIX: date corrected to février 2026 (NRI 2025 published Feb 2026)
    titre: 'NRI 2025 : la Tunisie obtient 39,29/100, rang 96ᵉ mondial',
    date: '18 février 2026',
    extrait:
      'Le Portulans Institute publie son rapport NRI 2025. La Tunisie se classe 10ᵉ dans la région Arab States et 14ᵉ dans son groupe de revenus (lower-middle-income).',
    tag: 'Rapport',
    important: true,
    source: 'https://networkreadinessindex.org/countries/tunisia/',
    sourceLabel: 'Portulans Institute — NRI 2025',
  },
  {
    id: 7,
    titre: 'Débit mobile médian : 26,56 Mbps selon Ookla Speedtest',
    date: '10 janvier 2025',
    extrait:
      "La qualité du réseau mobile s'améliore légèrement mais reste en zone de vigilance par rapport aux benchmarks régionaux. Le débit fixe médian s'établit à 11,55 Mbps.",
    tag: 'Infrastructure',
    important: false,
    source: 'https://www.speedtest.net/global-index/tunisia',
    sourceLabel: 'Ookla Speedtest Global Index',
  },
  {
    id: 8,
    titre: 'Portefeuilles numériques actifs : 815 000 en Tunisie',
    date: '3 janvier 2025',
    extrait:
      "Le nombre de wallets électroniques actifs confirme une croissance soutenue de l'inclusion financière numérique en Tunisie, selon les données de la BCT.",
    tag: 'Fintech',
    important: false,
    source: 'https://www.bct.gov.tn/bct/siteprod/page.jsp?id=209',
    sourceLabel: 'Banque Centrale de Tunisie',
  },
]

const TAG_COLORS: Record<string, string> = {
  'Infrastructure': 'bg-blue-50 text-blue-700 border-blue-100',
  'Capital humain': 'bg-purple-50 text-purple-700 border-purple-100',
  'Startup':        'bg-orange-50 text-orange-700 border-orange-100',
  'E-gouvernement': 'bg-teal-50 text-teal-700 border-teal-100',
  'Fintech':        'bg-emerald-50 text-emerald-700 border-emerald-100',
  'Gouvernance':    'bg-slate-100 text-slate-700 border-slate-200',
  'Rapport':        'bg-amber-50 text-amber-700 border-amber-100',
}

export default function ActualitesPage() {
  const [activeTag, setActiveTag] = useState('Tous')

  const filtered = ALL_NEWS.filter(n => activeTag === 'Tous' || n.tag === activeTag)

  return (
    <div className="min-h-screen bg-slate-50 font-sans">

      <Nav active="/actualites" />

      {/* ── PAGE HEADER ── */}
      <section className="bg-[#0A192F] text-white py-14">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex items-center gap-2 text-sm text-slate-400 mb-4">
            <Link href="/" className="hover:text-white transition-colors">Accueil</Link>
            <span>/</span>
            <span className="text-white">Actualités</span>
          </div>
          <h1 className="text-3xl md:text-4xl font-black mb-3">
            <span className="text-[#D4A373]">Actualités</span>
          </h1>
          <p className="text-slate-300 text-lg max-w-2xl">
            Dernières nouvelles sur l'économie numérique tunisienne — données fraîches, événements et analyses.
          </p>
          <div className="mt-4 flex items-center gap-2 text-xs text-slate-400">
            <span className="w-2 h-2 rounded-full bg-[#D4A373] animate-pulse" aria-hidden="true" />
            {ALL_NEWS.length} actualités · Chaque news renvoie vers sa source officielle
          </div>
        </div>
      </section>

      {/* ── TAG FILTERS ── */}
      <div className="bg-white border-b border-slate-100 sticky top-16 z-40 shadow-sm">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex items-center gap-2 overflow-x-auto py-3">
            {TAGS.map(tag => (
              <button
                key={tag}
                onClick={() => setActiveTag(tag)}
                className={`flex-shrink-0 px-4 py-2 rounded-lg text-sm font-semibold transition-all ${
                  activeTag === tag
                    ? 'bg-[#0A192F] text-white'
                    : 'text-slate-600 hover:bg-slate-100'
                }`}
              >
                {tag}
                <span className={`ml-2 text-xs px-1.5 py-0.5 rounded-full ${
                  activeTag === tag ? 'bg-white/20' : 'bg-slate-200'
                }`}>
                  {tag === 'Tous'
                    ? ALL_NEWS.length
                    : ALL_NEWS.filter(n => n.tag === tag).length}
                </span>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* ── NEWS GRID ── */}
      <main className="max-w-7xl mx-auto px-6 py-10">

        <p className="text-sm text-slate-500 mb-6">
          <span className="font-bold text-slate-800">{filtered.length}</span> article{filtered.length > 1 ? 's' : ''}
          {activeTag !== 'Tous' && (
            <span> · filtre <span className="font-semibold text-[#0A192F]">{activeTag}</span></span>
          )}
        </p>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map(item => (
            <article
              key={item.id}
              className={`bg-white rounded-2xl border flex flex-col p-6 hover:shadow-lg transition-all hover:-translate-y-1 ${
                item.important
                  ? 'border-[#D4A373]/40 shadow-md'
                  : 'border-slate-100 shadow-sm'
              }`}
            >
              {/* à la une badge */}
              {item.important && (
                <div className="flex items-center gap-1.5 mb-3">
                  <span className="w-2 h-2 rounded-full bg-[#D4A373] animate-pulse" aria-hidden="true" />
                  <span className="text-xs font-bold text-[#D4A373] uppercase tracking-wider">À la une</span>
                </div>
              )}

              {/* date + tag */}
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs text-slate-400">{item.date}</span>
                <span className={`text-xs font-semibold px-2.5 py-1 rounded-full border ${TAG_COLORS[item.tag] ?? 'bg-slate-100 text-slate-600 border-slate-200'}`}>
                  {item.tag}
                </span>
              </div>

              {/* title */}
              <h2 className="font-bold text-slate-800 text-sm leading-snug mb-3">{item.titre}</h2>

              {/* excerpt */}
              <p className="text-xs text-slate-500 leading-relaxed line-clamp-3 flex-1">{item.extrait}</p>

              {/* FIX: real clickable source link */}
              <div className="mt-5 pt-4 border-t border-slate-50 flex items-center justify-between gap-2">
                {item.source ? (
                  <a
                    href={item.source}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#0A192F] hover:text-[#D4A373] transition-colors group"
                  >
                    <span
                      className="w-4 h-4 rounded-full bg-[#0A192F]/10 flex items-center justify-center group-hover:bg-[#D4A373]/20 transition-colors"
                      aria-hidden="true"
                    >
                      ↗
                    </span>
                    {item.sourceLabel}
                  </a>
                ) : (
                  <span className="text-xs text-slate-400 italic">Source interne</span>
                )}
              </div>
            </article>
          ))}
        </div>

        {filtered.length === 0 && (
          <div className="text-center py-20 text-slate-400">
            <div className="text-4xl mb-3" aria-hidden="true">📭</div>
            <p className="font-semibold">Aucune actualité pour ce filtre</p>
            <button
              onClick={() => setActiveTag('Tous')}
              className="mt-3 text-sm text-[#0A192F] hover:underline"
            >
              Voir toutes les actualités
            </button>
          </div>
        )}

        {/* disclaimer */}
        <div className="mt-10 bg-slate-100 rounded-xl p-5 text-xs text-slate-500 leading-relaxed">
          <span className="font-semibold text-slate-700">Note éditoriale :</span> Les actualités référencées sur cette page renvoient vers leurs sources officielles
          (BCT, Portulans Institute, StartupBlink, ministères tunisiens, etc.). Think Digital, Think Tunisia n'est pas l'auteur de ces publications — la plateforme les
          agrège à titre informatif dans le cadre du suivi de l'économie numérique tunisienne.
        </div>
      </main>

      <Footer />
    </div>
  )
}