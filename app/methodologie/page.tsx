'use client'

import Link from 'next/link'
import { Nav, Footer } from '@/app/components/NavFooter'

const SOURCES = [
  {
    name: 'Portulans Institute',
    desc: 'Network Readiness Index (NRI 2025) — classement mondial de préparation numérique',
    url: 'https://networkreadinessindex.org',
    icon: '🌐',
  },
  {
    name: 'UIT',
    desc: "Union Internationale des Télécommunications — Global Cybersecurity Index et indicateurs d'infrastructure",
    url: 'https://www.itu.int',
    icon: '📡',
  },
  {
    name: 'BCT',
    desc: 'Banque Centrale de Tunisie — données fintech, paiements mobiles, portefeuilles numériques',
    url: 'https://www.bct.gov.tn',
    icon: '💳',
  },
  {
    name: 'UN DESA',
    desc: 'Nations Unies — E-Government Development Index (EGDI), Online Service Index (OSI) et Human Capital Index',
    url: 'https://publicadministration.un.org',
    icon: '🏛️',
  },
  {
    name: 'Ookla / DataReportal',
    desc: 'Débits Internet fixe et mobile, pénétration Internet et connexions mobiles — mesures en conditions réelles',
    url: 'https://datareportal.com/reports/digital-2025-tunisia',
    icon: '⚡',
  },
  {
    name: 'StartupBlink',
    desc: "Classement mondial des écosystèmes startup — rang et dynamique de l'écosystème tunisien",
    url: 'https://www.startupblink.com/startup-ecosystem/tunisia',
    icon: '🚀',
  },
  {
    name: 'Startup Genome',
    desc: "Valeur estimée de l'écosystème technologique tunisien",
    url: 'https://startupgenome.com',
    icon: '📊',
  },
  {
    name: 'ID Tech Wire',
    desc: "Données sur l'adoption de l'identité numérique E-Houwiya",
    url: 'https://idtechwire.com/tunisias-mobile-id-subscribers-reach-200000/',
    icon: '🪪',
  },
  {
    name: 'JORT',
    desc: 'Journal Officiel de la République Tunisienne — cadre juridique, loi sur les données personnelles (2004)',
    url: 'https://www.iort.gov.tn',
    icon: '⚖️',
  },
  {
    name: 'Calculs internes IMNT',
    desc: 'Index composite construit sur les 5 piliers — pondération et normalisation des scores pilotes',
    url: null,
    icon: '🧮',
  },
]

const PILIERS_METHOD = [
  {
    num: '01',
    label: 'Infrastructures',
    icon: '📡',
    desc: 'Pénétration Internet, connexions mobiles, débits fixe et mobile, qualité de réseau.',
    kpis: ['KPI-02', 'KPI-03', 'KPI-04', 'KPI-05'],
  },
  {
    num: '02',
    label: 'Capital humain',
    icon: '🎓',
    desc: "Niveau de qualification numérique, ressources humaines disponibles dans l'écosystème tech.",
    kpis: ['KPI-06'],
  },
  {
    num: '03',
    label: 'Économie productive',
    icon: '🚀',
    desc: 'Écosystème startup, valeur tech, paiements mobiles, portefeuilles numériques actifs.',
    kpis: ['KPI-07', 'KPI-08', 'KPI-09', 'KPI-10'],
  },
  {
    num: '04',
    label: 'E-gouvernement',
    icon: '🏛️',
    desc: "EGDI (UN DESA), Online Service Index, adoption de l'identité numérique E-Houwiya.",
    kpis: ['KPI-11', 'KPI-12', 'KPI-13'],
  },
  {
    num: '05',
    label: 'Gouvernance & Cyber',
    icon: '⚖️',
    desc: 'Global Cybersecurity Index (UIT), maturité juridique, protection des données personnelles.',
    kpis: ['KPI-14', 'KPI-15'],
  },
]

export default function MetodologiePage() {
  return (
    <div className="min-h-screen bg-slate-50 font-sans">

      <Nav active="/methodologie" />

      {/* ── HEADER ── */}
      <section className="bg-[#0A192F] text-white py-14">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex items-center gap-2 text-sm text-slate-400 mb-4">
            <Link href="/" className="hover:text-white transition-colors">Accueil</Link>
            <span>/</span>
            <span className="text-white">Méthodologie</span>
          </div>
          <h1 className="text-3xl md:text-4xl font-black mb-3">
            <span className="text-[#D4A373]">Méthodologie</span> &amp; transparence
          </h1>
          <p className="text-slate-300 text-lg max-w-2xl">
            Sources officielles, construction de l'IMNT, fréquence de mise à jour et validation humaine — tout est documenté ici.
          </p>
        </div>
      </section>

      <main className="max-w-7xl mx-auto px-6 py-12 space-y-16">

        {/* ── INDEX IMNT ── */}
        <section>
          <p className="text-xs font-bold uppercase tracking-widest text-[#D4A373] mb-1">Définition</p>
          <h2 className="text-2xl font-black text-slate-800 mb-6">L'Index IMNT — présentation</h2>
          <div className="bg-white rounded-2xl border border-slate-100 p-6 md:p-8 shadow-sm">
            <p className="text-slate-600 leading-relaxed mb-6">
              L'<strong className="text-slate-800">IMNT (Indice de Maturité du Numérique en Tunisie)</strong> est
              un indice composite structuré autour de cinq piliers stratégiques. Dans cette version pilote,
              les statuts <strong className="text-slate-800">« favorable »</strong>,{' '}
              <strong className="text-slate-800">« à surveiller »</strong> et{' '}
              <strong className="text-slate-800">« critique »</strong> ont une fonction principalement
              interprétative : ils facilitent la lecture des résultats, sans se substituer à la logique
              complète de calcul de l'indice.
            </p>
            <p className="text-slate-600 leading-relaxed mb-6">
              Le score IMNT affiché repose sur une agrégation consolidée des indicateurs retenus,
              structurée par pilier. La présente plateforme constitue une <strong className="text-slate-800">version
              pilote publique</strong> du dispositif, conçue pour rendre lisible le rapport annuel,
              ses indicateurs et son tableau de bord.
            </p>
            {/* colour legend — kept as reading guides only */}
            <div className="grid md:grid-cols-3 gap-4">
              {[
                { color: 'bg-emerald-500', bg: 'bg-emerald-50', border: 'border-emerald-200', label: 'Favorable',    desc: 'Repère de lecture — résultat positif' },
                { color: 'bg-amber-400',   bg: 'bg-amber-50',   border: 'border-amber-200',   label: 'À surveiller', desc: 'Repère de lecture — vigilance recommandée' },
                { color: 'bg-red-500',     bg: 'bg-red-50',     border: 'border-red-200',      label: 'Critique',     desc: 'Repère de lecture — amélioration urgente' },
              ].map(({ color, bg, border, label, desc }) => (
                <div key={label} className={`flex items-start gap-3 p-4 rounded-xl border ${bg} ${border}`}>
                  <span className={`w-3 h-3 rounded-full ${color} mt-1 flex-shrink-0`} aria-hidden="true" />
                  <div>
                    <div className="font-semibold text-slate-800 text-sm">{label}</div>
                    <div className="text-xs text-slate-500 mt-1">{desc}</div>
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-5 bg-[#D4A373]/10 border border-[#D4A373]/20 rounded-xl p-4 flex items-center justify-between">
              <span className="text-sm text-slate-600">Score IMNT — Édition pilote 2025</span>
              <span className="text-2xl font-black text-[#0A192F]">48,7 <span className="text-sm font-normal text-slate-400">/ 100</span></span>
            </div>
          </div>
        </section>

        {/* ── 5 PILIERS ── */}
        <section>
          <p className="text-xs font-bold uppercase tracking-widest text-[#D4A373] mb-1">Architecture</p>
          <h2 className="text-2xl font-black text-slate-800 mb-6">Les 5 piliers de l'IMNT</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {PILIERS_METHOD.map(({ num, label, icon, desc, kpis }) => (
              <div key={num} className="bg-white rounded-2xl border border-slate-100 p-5 shadow-sm">
                <div className="flex items-center gap-3 mb-3">
                  <span className="text-2xl" aria-hidden="true">{icon}</span>
                  <div>
                    <div className="text-xs text-slate-400 font-bold">Pilier {num}</div>
                    <div className="font-black text-slate-800">{label}</div>
                  </div>
                </div>
                <p className="text-sm text-slate-500 leading-relaxed mb-4">{desc}</p>
                <div className="flex flex-wrap gap-1.5">
                  {kpis.map(k => (
                    <Link
                      key={k}
                      href={`/kpis/${k.toLowerCase()}`}
                      className="text-xs font-mono bg-slate-100 text-slate-600 hover:bg-[#0A192F] hover:text-white px-2 py-0.5 rounded transition-colors"
                    >
                      {k}
                    </Link>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* ── SOURCES ── */}
        <section>
          <p className="text-xs font-bold uppercase tracking-widest text-[#D4A373] mb-1">Transparence</p>
          <h2 className="text-2xl font-black text-slate-800 mb-6">Sources officielles utilisées</h2>
          <div className="grid md:grid-cols-2 gap-4">
            {SOURCES.map(({ name, desc, url, icon }) => (
              <div key={name} className="bg-white rounded-xl border border-slate-100 p-5 shadow-sm flex items-start gap-4">
                <span className="text-2xl flex-shrink-0" aria-hidden="true">{icon}</span>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-2 mb-1">
                    <span className="font-bold text-slate-800 text-sm">{name}</span>
                    {url && (
                      <a
                        href={url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-xs text-[#0A192F] hover:text-[#D4A373] transition-colors flex-shrink-0 font-semibold"
                      >
                        ↗ Source
                      </a>
                    )}
                  </div>
                  <p className="text-xs text-slate-500 leading-relaxed">{desc}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* ── FRÉQUENCE + VALIDATION ── */}
        <section className="grid md:grid-cols-2 gap-6">
          <div className="bg-white rounded-2xl border border-slate-100 p-6 shadow-sm">
            <div className="text-3xl mb-4" aria-hidden="true">🗓️</div>
            <h3 className="font-black text-slate-800 text-lg mb-2">Fréquence de mise à jour</h3>
            <p className="text-sm text-slate-500 leading-relaxed mb-4">
              Le rapport est mis à jour <strong className="text-slate-700">annuellement</strong>.
              Certains indicateurs (paiements mobiles, débits) bénéficient d'une révision{' '}
              <strong className="text-slate-700">semestrielle</strong> si les sources publient
              des données intermédiaires.
            </p>
            <div className="bg-slate-50 rounded-lg p-3 text-xs text-slate-500">
              Dernière mise à jour globale :{' '}
              <strong className="text-slate-700">Juin 2025</strong>
            </div>
          </div>

          <div className="bg-[#0A192F] rounded-2xl p-6 text-white">
            <div className="text-3xl mb-4" aria-hidden="true">🤖</div>
            <h3 className="font-black text-lg mb-2">IA + Validation humaine</h3>
            <p className="text-sm text-slate-300 leading-relaxed mb-4">
              Les algorithmes génèrent des analyses et recommandations préliminaires à partir des
              données brutes.{' '}
              <strong className="text-white">
                Aucun texte n'est publié sans validation humaine
              </strong>{' '}
              — zéro invention, zéro hallucination.
            </p>
            <div className="bg-white/10 border border-white/20 rounded-lg p-3 text-xs text-slate-300">
              Validation assurée par l'équipe éditoriale sous la direction de{' '}
              <strong className="text-white">Wahib Zaier</strong>
            </div>
          </div>
        </section>

        {/* ── ÉQUIPE ── */}
        <section>
          <p className="text-xs font-bold uppercase tracking-widest text-[#D4A373] mb-1">Équipe</p>
          <h2 className="text-2xl font-black text-slate-800 mb-6">Rôles &amp; responsabilités</h2>
          <div className="grid md:grid-cols-2 gap-6">
            {[
              {
                name: 'Madame Rim Jalouli',
                role: 'Idée & Copyright',
                desc: '© Idée originale, concept de la plateforme et droit de propriété intellectuelle. Toute utilisation, reproduction ou exploitation du concept, de la démarche et des contenus est soumise à autorisation préalable.',
                icon: '💡',
              },
              {
                name: 'Mr Wahib Zaier',
                role: 'Conception éditoriale & consultation approfondie',
                desc: 'Architecture de la plateforme, démarche éditoriale, consultation sur la méthodologie IMNT et validation des contenus publiés.',
                icon: '🏗️',
              },
            ].map(({ name, role, desc, icon }) => (
              <div key={name} className="bg-white rounded-2xl border border-slate-100 p-6 shadow-sm flex items-start gap-5">
                <div className="w-12 h-12 rounded-xl bg-[#0A192F]/5 flex items-center justify-center text-2xl flex-shrink-0" aria-hidden="true">
                  {icon}
                </div>
                <div>
                  <div className="font-black text-slate-800">{name}</div>
                  <div className="text-xs font-semibold text-[#D4A373] mb-2">{role}</div>
                  <p className="text-sm text-slate-500 leading-relaxed">{desc}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

      </main>

      <Footer />
    </div>
  )
}