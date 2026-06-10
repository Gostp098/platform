'use client'

import Link from 'next/link'

// ─── Nav ─────────────────────────────────────────────────────────────────────

export function Nav({ active }: { active: string }) {
  const links = [
    { label: 'Accueil',      href: '/' },
    { label: 'KPIs',         href: '/kpis' },
    { label: 'Actualités',   href: '/actualites' },
    { label: 'Rapport',      href: '/rapport' },
    { label: 'Méthodologie', href: '/methodologie' },
    { label: 'À propos',     href: '/about' },
  ]
  return (
    <header className="bg-[#0A192F] sticky top-0 z-50 shadow-md">
      <nav
        className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between"
        aria-label="Principale"
      >
        {/* Logo */}
        <Link
          href="/"
          className="flex items-center gap-3 focus:outline-none focus:ring-2 focus:ring-[#64FFDA] rounded"
        >
          <div
            className="w-8 h-8 rounded bg-[#D4A373] flex items-center justify-center"
            aria-hidden="true"
          >
            <span className="text-[#0A192F] font-black text-sm">T</span>
          </div>
          <div className="leading-tight">
            <span className="text-white font-black text-sm tracking-tight block">
              Think Digital
            </span>
            <span className="text-[#D4A373] text-[10px] font-semibold tracking-widest uppercase -mt-0.5 block">
              Think Tunisia
            </span>
          </div>
        </Link>

        {/* Links */}
        <div className="hidden md:flex items-center gap-1">
          {links.map(item => (
            <Link
              key={item.label}
              href={item.href}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-[#64FFDA] ${
                item.href === active
                  ? 'bg-white/15 text-white'
                  : 'text-slate-300 hover:text-white hover:bg-white/10'
              }`}
            >
              {item.label}
            </Link>
          ))}
        </div>

        {/* CTA */}
        <Link
          href="/rapport"
          className="bg-[#D4A373] hover:bg-[#c49a6c] text-[#0A192F] font-semibold text-sm px-4 py-2 rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-[#64FFDA] focus:ring-offset-2 focus:ring-offset-[#0A192F]"
        >
          Voir le rapport
        </Link>
      </nav>
    </header>
  )
}

// ─── Footer ──────────────────────────────────────────────────────────────────

export function Footer() {
  // Only active routes — no broken links
  const navLinks = [
    { label: 'Accueil',      href: '/' },
    { label: 'KPIs',         href: '/kpis' },
    { label: 'Rapport',      href: '/rapport' },
    { label: 'Actualités',   href: '/actualites' },
    { label: 'Méthodologie', href: '/methodologie' },
    { label: 'À propos',     href: '/about' },
  ]

  const legalLinks = [
    { label: 'Mentions légales',      href: '/mentions-legales' },
    { label: 'Contact',               href: '/about#contact' },
  ]

  return (
    <footer className="bg-[#0A192F] text-slate-400 pt-12 pb-6">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="grid md:grid-cols-3 gap-10 pb-10 border-b border-slate-800">

          {/* Brand */}
          <div>
            <div className="flex items-center gap-3 mb-3">
              <div
                className="w-8 h-8 rounded bg-[#D4A373] flex items-center justify-center"
                aria-hidden="true"
              >
                <span className="text-[#0A192F] font-black text-sm">T</span>
              </div>
              <div>
                <div className="text-white font-black text-sm">Think Digital</div>
                <div className="text-[#D4A373] text-[10px] font-semibold tracking-widest uppercase">
                  Think Tunisia
                </div>
              </div>
            </div>
            <p className="text-sm leading-relaxed text-slate-500">
              Là où les données dessinent l'avenir numérique de la Tunisie.
            </p>
          </div>

          {/* Navigation */}
          <div>
            <p className="text-xs font-bold uppercase tracking-widest text-slate-600 mb-4">
              Navigation
            </p>
            <ul className="flex flex-col gap-2 text-sm">
              {navLinks.map(l => (
                <li key={l.label}>
                  <Link
                    href={l.href}
                    className="hover:text-white transition-colors focus:outline-none focus:underline"
                  >
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Legal */}
          <div>
            <p className="text-xs font-bold uppercase tracking-widest text-slate-600 mb-4">
              Légal
            </p>
            <ul className="flex flex-col gap-2 text-sm">
              {legalLinks.map(l => (
                <li key={l.label}>
                  <Link
                    href={l.href}
                    className="hover:text-white transition-colors focus:outline-none focus:underline"
                  >
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Credits */}
        <div className="pt-6 pb-4 border-b border-slate-800/50 text-xs text-slate-500 space-y-1">
          <p>
            © Idée &amp; Concept — Madame Rim Jalouli. Tous droits réservés. Toute utilisation,
            reproduction ou exploitation du concept, de la démarche et des contenus est soumise
            à autorisation préalable.
          </p>
          <p>
            © Conception, démarche éditoriale &amp; consultation approfondie — Mr Wahib Zaier.
          </p>
        </div>

        {/* Bottom bar */}
        <div className="pt-6 flex flex-col md:flex-row items-center justify-between gap-3 text-xs text-slate-600">
          <span>© 2025 Think Digital, Think Tunisia. Conçu avec rigueur en Tunisie.</span>
          <span>
            Sources : Portulans Institute (NRI 2025), UIT, UN DESA, BCT, DataReportal, Ookla,
            StartupBlink, JORT et calculs internes IMNT.
          </span>
        </div>
      </div>
    </footer>
  )
}
