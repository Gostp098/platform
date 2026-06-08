'use client'

import Link from 'next/link'

const SOURCES = [
  { name: 'Portulans Institute', desc: 'Network Readiness Index (NRI 2025) — classement mondial de préparation numérique', url: 'https://networkreadinessindex.org', icon: '🌐' },
  { name: 'UIT', desc: "Union Internationale des Télécommunications — indicateurs d'infrastructure et connectivité", url: 'https://www.itu.int', icon: '📡' },
  { name: 'APII / Startup Tunisia', desc: 'Agence de Promotion de l\'Industrie et de l\'Innovation — données écosystème startup', url: 'https://www.apii.tn', icon: '🚀' },
  { name: 'BCT', desc: 'Banque Centrale de Tunisie — données fintech, paiements mobiles, wallets', url: 'https://www.bct.gov.tn', icon: '💳' },
  { name: 'UN DESA', desc: 'Nations Unies — E-Government Development Index (EGDI) et OSI', url: 'https://publicadministration.un.org', icon: '🏛️' },
  { name: 'Ookla / DataReportal', desc: 'Débits Internet fixe et mobile — mesures en conditions réelles', url: 'https://datareportal.com', icon: '⚡' },
  { name: 'StartupBlink', desc: 'Classement mondial des écosystèmes startup — rang et valeur de l\'écosystème tunisien', url: 'https://startupblink.com', icon: '📊' },
  { name: 'Calculs internes IMNT', desc: 'Index composite construit sur les 5 piliers — pondération et normalisation des scores', url: null, icon: '🧮' },
]

const PILIERS_METHOD = [
  {
    num: '01', label: 'Infrastructures',     icon: '📡',
    desc: 'Pénétration Internet, connexions mobiles, débits fixe et mobile, qualité de réseau.',
    kpis: ['KPI-02', 'KPI-03', 'KPI-04', 'KPI-05'],
  },
  {
    num: '02', label: 'Capital humain',      icon: '🎓',
    desc: 'Diplômés ICT par an, taux d\'alphabétisation numérique, ressources qualifiées disponibles.',
    kpis: ['KPI-06'],
  },
  {
    num: '03', label: 'Économie productive', icon: '🚀',
    desc: 'Écosystème startup, valeur tech, paiements mobiles, portefeuilles numériques actifs.',
    kpis: ['KPI-07', 'KPI-08', 'KPI-09', 'KPI-10'],
  },
  {
    num: '04', label: 'E-gouvernement',      icon: '🏛️',
    desc: 'EGDI (UN DESA), Online Service Index, adoption de l\'identité numérique E-Houwiya.',
    kpis: ['KPI-11', 'KPI-12', 'KPI-13'],
  },
  {
    num: '05', label: 'Gouvernance & Cyber', icon: '⚖️',
    desc: 'Global Cybersecurity Index (UIT), maturité juridique, protection des données personnelles.',
    kpis: ['KPI-14', 'KPI-15'],
  },
]

export default function MetodologiePage() {
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
                  item.href === '/methodologie' ? 'bg-white/15 text-white' : 'text-slate-300 hover:text-white hover:bg-white/10'
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
            <span className="text-white">Méthodologie</span>
          </div>
          <h1 className="text-3xl md:text-4xl font-black mb-3">
            <span className="text-[#D4AF37]">Méthodologie</span> & transparence
          </h1>
          <p className="text-slate-300 text-lg max-w-2xl">
            Sources officielles, construction de l'IMNT, fréquence de mise à jour et validation humaine — tout est documenté ici.
          </p>
        </div>
      </section>

      <main className="max-w-7xl mx-auto px-6 py-12 space-y-14">

        {/* ── INDEX IMNT ── */}
        <section>
          <p className="text-xs font-bold uppercase tracking-widest text-[#D4AF37] mb-1">Définition</p>
          <h2 className="text-2xl font-black text-slate-800 mb-4">L'Index IMNT — qu'est-ce que c'est ?</h2>
          <div className="bg-white rounded-2xl border border-slate-100 p-6 shadow-sm">
            <p className="text-slate-600 leading-relaxed mb-4">
              L'<strong className="text-slate-800">IMNT (Indice de Maturité du Numérique en Tunisie)</strong> est un index composite construit sur 5 piliers stratégiques. Il agrège 14 KPIs évaluatifs (hors indicateur de contexte KPI-01) selon un système de notation à 3 niveaux :
            </p>
            <div className="grid md:grid-cols-3 gap-4 mb-6">
              {[
                { color: 'bg-emerald-500', label: 'Favorable (vert)', score: '1 point', desc: 'L\'indicateur dépasse le seuil minimal défini' },
                { color: 'bg-amber-400',   label: 'À surveiller (orange)', score: '0,5 point', desc: 'L\'indicateur est dans la zone intermédiaire' },
                { color: 'bg-red-500',     label: 'Critique (rouge)', score: '0 point', desc: 'L\'indicateur est en dessous du seuil critique' },
              ].map(({ color, label, score, desc }) => (
                <div key={label} className="flex items-start gap-3 p-4 bg-slate-50 rounded-xl">
                  <span className={`w-3 h-3 rounded-full ${color} mt-1 flex-shrink-0`} />
                  <div>
                    <div className="font-semibold text-slate-800 text-sm">{label}</div>
                    <div className="text-[#D4AF37] font-bold text-sm">{score}</div>
                    <div className="text-xs text-slate-500 mt-1">{desc}</div>
                  </div>
                </div>
              ))}
            </div>
            <div className="bg-[#0A2B4E]/5 border border-[#0A2B4E]/10 rounded-xl p-4 text-sm text-slate-600">
              <strong className="text-slate-800">Formule :</strong> Score IMNT = (Σ points obtenus / nombre de KPIs évaluatifs) × 100<br />
              <span className="text-slate-400 text-xs mt-1 block">Résultat actuel : <strong className="text-[#0A2B4E]">48,7 / 100</strong> — performance intermédiaire</span>
            </div>
          </div>
        </section>

        {/* ── 5 PILIERS ── */}
        <section>
          <p className="text-xs font-bold uppercase tracking-widest text-[#D4AF37] mb-1">Architecture</p>
          <h2 className="text-2xl font-black text-slate-800 mb-4">Les 5 piliers de l'IMNT</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {PILIERS_METHOD.map(({ num, label, icon, desc, kpis }) => (
              <div key={num} className="bg-white rounded-2xl border border-slate-100 p-5 shadow-sm">
                <div className="flex items-center gap-3 mb-3">
                  <span className="text-2xl">{icon}</span>
                  <div>
                    <div className="text-xs text-slate-400 font-bold">{num}</div>
                    <div className="font-black text-slate-800">{label}</div>
                  </div>
                </div>
                <p className="text-sm text-slate-500 leading-relaxed mb-3">{desc}</p>
                <div className="flex flex-wrap gap-1.5">
                  {kpis.map(k => (
                    <Link key={k} href={`/kpis/${k.toLowerCase()}`}
                      className="text-xs font-mono bg-slate-100 text-slate-600 hover:bg-[#0A2B4E] hover:text-white px-2 py-0.5 rounded transition-colors">
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
          <p className="text-xs font-bold uppercase tracking-widest text-[#D4AF37] mb-1">Transparence</p>
          <h2 className="text-2xl font-black text-slate-800 mb-4">Sources officielles utilisées</h2>
          <div className="grid md:grid-cols-2 gap-4">
            {SOURCES.map(({ name, desc, url, icon }) => (
              <div key={name} className="bg-white rounded-xl border border-slate-100 p-5 shadow-sm flex items-start gap-4">
                <span className="text-2xl flex-shrink-0">{icon}</span>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-2">
                    <span className="font-bold text-slate-800 text-sm">{name}</span>
                    {url && (
                      <a href={url} target="_blank" rel="noopener noreferrer"
                        className="text-xs text-[#0A2B4E] hover:text-[#D4AF37] transition-colors flex-shrink-0">
                        ↗ Source
                      </a>
                    )}
                  </div>
                  <p className="text-xs text-slate-500 mt-1 leading-relaxed">{desc}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* ── FRÉQUENCE + VALIDATION ── */}
        <section className="grid md:grid-cols-2 gap-6">
          <div className="bg-white rounded-2xl border border-slate-100 p-6 shadow-sm">
            <div className="text-3xl mb-4">🗓️</div>
            <h3 className="font-black text-slate-800 text-lg mb-2">Fréquence de mise à jour</h3>
            <p className="text-sm text-slate-500 leading-relaxed mb-4">
              Le rapport est mis à jour <strong className="text-slate-700">annuellement</strong>. Certains indicateurs (paiements mobiles, débits) bénéficient d'une révision <strong className="text-slate-700">semestrielle</strong> si les sources publient des données intermédiaires.
            </p>
            <div className="bg-slate-50 rounded-lg p-3 text-xs text-slate-500">
              Dernière mise à jour globale : <strong className="text-slate-700">Juin 2025</strong>
            </div>
          </div>

          <div className="bg-[#0A2B4E] rounded-2xl p-6 text-white">
            <div className="text-3xl mb-4">🤖</div>
            <h3 className="font-black text-lg mb-2">IA + Validation humaine</h3>
            <p className="text-sm text-slate-300 leading-relaxed mb-4">
              Les algorithmes génèrent des analyses et recommandations préliminaires à partir des données brutes. <strong className="text-white">Aucun texte n'est publié sans validation humaine</strong> — zéro invention, zéro hallucination.
            </p>
            <div className="bg-white/10 border border-white/20 rounded-lg p-3 text-xs text-slate-300">
              Validation assurée par l'équipe éditoriale sous la direction de <strong className="text-white">Wahib Zaier</strong>
            </div>
          </div>
        </section>

        {/* ── ÉQUIPE ── */}
        <section>
          <p className="text-xs font-bold uppercase tracking-widest text-[#D4AF37] mb-1">Équipe</p>
          <h2 className="text-2xl font-black text-slate-800 mb-4">Rôles & responsabilités</h2>
          <div className="grid md:grid-cols-2 gap-6">
            {[
              {
                name: 'Madame Rim Jalouli',
                role: 'Idée & Copyright',
                desc: '© Idée originale, concept de la plateforme et droit de propriété intellectuelle. Toute utilisation, reproduction ou exploitation du concept est soumise à autorisation préalable.',
                icon: '💡',
              },
              {
                name: 'Mr Wahib Zaier',
                role: 'Conception éditoriale & consultation approfondie',
                desc: 'Architecture de la plateforme, démarche éditoriale, consultation sur la méthodologie et validation des contenus publiés.',
                icon: '🏗️',
              },
            ].map(({ name, role, desc, icon }) => (
              <div key={name} className="bg-white rounded-2xl border border-slate-100 p-6 shadow-sm flex items-start gap-5">
                <div className="w-12 h-12 rounded-xl bg-[#0A2B4E]/5 flex items-center justify-center text-2xl flex-shrink-0">{icon}</div>
                <div>
                  <div className="font-black text-slate-800">{name}</div>
                  <div className="text-xs font-semibold text-[#D4AF37] mb-2">{role}</div>
                  <p className="text-sm text-slate-500 leading-relaxed">{desc}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

      </main>

      {/* ── FOOTER ── */}
      <footer className="bg-slate-900 text-slate-400 py-10 mt-4">
        <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-4">
          <span className="text-white font-bold">Think Digital, Think Tunisia</span>
          <div className="flex items-center gap-6 text-sm">
            <Link href="/about" className="hover:text-white transition-colors">À propos</Link>
            <Link href="/kpis" className="hover:text-white transition-colors">KPIs</Link>
            <Link href="/rapport" className="hover:text-white transition-colors">Rapport</Link>
          </div>
          <div className="text-xs text-slate-600">© 2025 Think Digital, Think Tunisia.</div>
        </div>
      </footer>
    </div>
  )
}
