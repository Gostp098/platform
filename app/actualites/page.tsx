'use client'

import Link from 'next/link'
import { useState } from 'react'

const TAGS = ['Tous', 'Infrastructure', 'Capital humain', 'Startup', 'E-gouvernement', 'Fintech', 'Gouvernance', 'Rapport']

const ALL_NEWS = [
  {
    id: 1,
    titre: 'Lancement officiel de la plateforme Think Digital, Think Tunisia',
    date: '1ᵉʳ juin 2025',
    extrait: "La plateforme officielle de suivi de l'économie numérique tunisienne est en ligne. Elle centralise 15 KPIs couvrant 5 piliers stratégiques.",
    tag: 'Rapport',
    important: true,
  },
  {
    id: 2,
    titre: 'Paiements mobiles : hausse de 25 % en 2025',
    date: '15 mai 2025',
    extrait: 'Selon la BCT, les opérations de paiement mobile ont atteint 8,4 millions en 2025, confirmant la dynamique fintech tunisienne.',
    tag: 'Fintech',
    important: false,
  },
  {
    id: 3,
    titre: 'Nouvelle stratégie e-gouvernement 2025–2030 annoncée',
    date: '10 avril 2025',
    extrait: 'Le gouvernement tunisien annonce un plan ambitieux de digitalisation des services publics à horizon 2030.',
    tag: 'E-gouvernement',
    important: false,
  },
  {
    id: 4,
    titre: 'E-Houwiya atteint 200 000 abonnés',
    date: '22 mars 2025',
    extrait: "L'identité numérique mobile tunisienne franchit le cap des 200 000 abonnés, mais la progression reste en dessous des objectifs fixés.",
    tag: 'E-gouvernement',
    important: false,
  },
  {
    id: 5,
    titre: 'StartupBlink 2025 : la Tunisie classée 82ᵉ écosystème mondial',
    date: '5 mars 2025',
    extrait: "La Tunisie consolide sa position sur la carte mondiale de l'entrepreneuriat tech, avec plus de 1 400 startups enregistrées sous le Startup Act.",
    tag: 'Startup',
    important: false,
  },
  {
    id: 6,
    titre: 'NRI 2025 : la Tunisie obtient 39,29/100, rang 96ᵉ mondial',
    date: '18 février 2025',
    extrait: 'Le Portulans Institute publie son rapport NRI 2025. La Tunisie se classe 10ᵉ dans la région Arab States et 14ᵉ dans son groupe de revenus.',
    tag: 'Rapport',
    important: true,
  },
  {
    id: 7,
    titre: 'Débit mobile : 26,56 Mbps en médiane selon Ookla',
    date: '10 janvier 2025',
    extrait: "La qualité du réseau mobile s'améliore légèrement mais reste en zone de vigilance par rapport aux benchmarks régionaux.",
    tag: 'Infrastructure',
    important: false,
  },
  {
    id: 8,
    titre: 'Portefeuilles numériques actifs : 815 000 en Tunisie',
    date: '3 janvier 2025',
    extrait: 'Le nombre de wallets électroniques actifs confirme une croissance soutenue de l\'inclusion financière numérique en Tunisie.',
    tag: 'Fintech',
    important: false,
  },
]

const TAG_COLORS: Record<string, string> = {
  'Infrastructure':  'bg-blue-50 text-blue-700',
  'Capital humain':  'bg-purple-50 text-purple-700',
  'Startup':         'bg-orange-50 text-orange-700',
  'E-gouvernement':  'bg-teal-50 text-teal-700',
  'Fintech':         'bg-emerald-50 text-emerald-700',
  'Gouvernance':     'bg-slate-100 text-slate-700',
  'Rapport':         'bg-amber-50 text-amber-700',
}

export default function ActualitesPage() {
  const [activeTag, setActiveTag] = useState('Tous')

  const filtered = ALL_NEWS.filter(n => activeTag === 'Tous' || n.tag === activeTag)

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
                  item.href === '/actualites' ? 'bg-white/15 text-white' : 'text-slate-300 hover:text-white hover:bg-white/10'
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

      {/* ── HEADER ── */}
      <section className="bg-[#0A2B4E] text-white py-14">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex items-center gap-2 text-sm text-slate-400 mb-4">
            <Link href="/" className="hover:text-white transition-colors">Accueil</Link>
            <span>/</span>
            <span className="text-white">Actualités</span>
          </div>
          <h1 className="text-3xl md:text-4xl font-black mb-3">
            <span className="text-[#D4AF37]">Actualités</span> & mises à jour
          </h1>
          <p className="text-slate-300 text-lg max-w-2xl">
            Dernières nouvelles sur l'économie numérique tunisienne — données fraîches, événements et analyses.
          </p>
        </div>
      </section>

      {/* ── TAG FILTERS ── */}
      <div className="bg-white border-b border-slate-100 sticky top-16 z-40 shadow-sm">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex items-center gap-2 overflow-x-auto py-3 scrollbar-hide">
            {TAGS.map(tag => (
              <button key={tag}
                onClick={() => setActiveTag(tag)}
                className={`flex-shrink-0 px-4 py-2 rounded-lg text-sm font-semibold transition-all ${
                  activeTag === tag ? 'bg-[#0A2B4E] text-white' : 'text-slate-600 hover:bg-slate-100'
                }`}>
                {tag}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* ── NEWS LIST ── */}
      <main className="max-w-7xl mx-auto px-6 py-10">
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map(item => (
            <article key={item.id}
              className={`bg-white rounded-2xl border p-6 hover:shadow-lg transition-all hover:-translate-y-1 ${
                item.important ? 'border-[#D4AF37]/40 shadow-md' : 'border-slate-100 shadow-sm'
              }`}>
              {item.important && (
                <div className="flex items-center gap-1.5 mb-3">
                  <span className="w-2 h-2 rounded-full bg-[#D4AF37] animate-pulse" />
                  <span className="text-xs font-bold text-[#D4AF37] uppercase tracking-wider">À la une</span>
                </div>
              )}
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs text-slate-400">{item.date}</span>
                <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${TAG_COLORS[item.tag] ?? 'bg-slate-100 text-slate-600'}`}>
                  {item.tag}
                </span>
              </div>
              <h2 className="font-bold text-slate-800 text-sm leading-snug mb-3">{item.titre}</h2>
              <p className="text-xs text-slate-500 leading-relaxed line-clamp-3">{item.extrait}</p>
              <div className="mt-5 pt-4 border-t border-slate-50">
                <span className="text-xs font-semibold text-[#0A2B4E] hover:text-[#D4AF37] transition-colors cursor-pointer">
                  Lire la suite →
                </span>
              </div>
            </article>
          ))}
        </div>

        {filtered.length === 0 && (
          <div className="text-center py-20 text-slate-400">
            <div className="text-4xl mb-3">📭</div>
            <p className="font-semibold">Aucune actualité pour ce filtre</p>
          </div>
        )}
      </main>

      {/* ── FOOTER ── */}
      <footer className="bg-slate-900 text-slate-400 py-10 mt-10">
        <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-4">
          <span className="text-white font-bold">Think Digital, Think Tunisia</span>
          <div className="flex items-center gap-6 text-sm">
            <Link href="/about" className="hover:text-white transition-colors">À propos</Link>
            <Link href="/methodologie" className="hover:text-white transition-colors">Méthodologie</Link>
          </div>
          <div className="text-xs text-slate-600">© 2025 Think Digital, Think Tunisia.</div>
        </div>
      </footer>
    </div>
  )
}
