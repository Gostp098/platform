'use client'

import Link from 'next/link'
import { useEffect, useRef, useState } from 'react'
import { KPIS, NEWS, ARTICLES, type KPI, type AlertStatus } from './lib/kpis/kpis'

// ─── types & maps ──────────────────────────────────────────────────────────

const STATUS_MAP: Record<AlertStatus, { bg: string; text: string; border: string; dot: string; label: string }> = {
  vert:   { bg: 'bg-emerald-50', text: 'text-emerald-700', border: 'border-emerald-200', dot: 'bg-emerald-500', label: 'Favorable' },
  orange: { bg: 'bg-amber-50',   text: 'text-amber-700',   border: 'border-amber-200',   dot: 'bg-amber-400',   label: 'À surveiller' },
  rouge:  { bg: 'bg-red-50',     text: 'text-red-700',     border: 'border-red-200',     dot: 'bg-red-500',     label: 'Critique' },
  gris:   { bg: 'bg-slate-50',   text: 'text-slate-600',   border: 'border-slate-200',   dot: 'bg-slate-400',   label: 'Contexte' },
}

const PILIER_ICONS: Record<string, string> = {
  'Contexte':            '🗺️',
  'Infrastructures':     '📡',
  'Capital humain':      '🎓',
  'Economie productive': '🚀',   // inclut désormais la Fintech
  'E-gouvernement':      '🏛️',
  'Gouvernance':         '⚖️',
}

// 5 piliers IMNT (Fintech intégré à Économie numérique productive)
const IMNT_PILIERS = [
  { num: '01', label: 'Infrastructures',               icon: '📡', pilierKey: 'Infrastructures' },
  { num: '02', label: 'Capital humain',                icon: '🎓', pilierKey: 'Capital humain' },
  { num: '03', label: 'Économie numérique productive', icon: '🚀', pilierKey: 'Economie productive' },
  { num: '04', label: 'E-gouvernement',                icon: '🏛️', pilierKey: 'E-gouvernement' },
  { num: '05', label: 'Gouvernance & Cyber',           icon: '⚖️', pilierKey: 'Gouvernance' },
]

// ─── composants réutilisables ──────────────────────────────────────────────

function SectionHeader({ eyebrow, title, description, center = true }: { eyebrow: string; title: string; description?: string; center?: boolean }) {
  return (
    <div className={`mb-12 ${center ? 'text-center' : ''}`}>
      <p className="text-xs font-bold uppercase tracking-widest text-[#D4A373] mb-2">{eyebrow}</p>
      <h2 className="text-2xl md:text-3xl lg:text-4xl font-black text-[#0A192F]">{title}</h2>
      {description && <p className="text-slate-500 mt-2 max-w-2xl mx-auto">{description}</p>}
    </div>
  )
}

function Card({ children, className = '', hover = true }: { children: React.ReactNode; className?: string; hover?: boolean }) {
  return (
    <div className={`bg-white rounded-2xl border border-slate-100 shadow-sm ${hover ? 'transition-all duration-200 hover:-translate-y-1 hover:shadow-lg' : ''} ${className}`}>
      {children}
    </div>
  )
}

// ─── compteur animé ────────────────────────────────────────────────────────

function useCountUp(target: number, duration = 1800, start = false) {
  const [value, setValue] = useState(0)
  useEffect(() => {
    if (!start) return
    const step = target / (duration / 16)
    let current = 0
    const timer = setInterval(() => {
      current = Math.min(current + step, target)
      setValue(Math.round(current))
      if (current >= target) clearInterval(timer)
    }, 16)
    return () => clearInterval(timer)
  }, [target, duration, start])
  return value
}

function CounterCard({ value, suffix, label, detail, highlight = false }: {
  value: number; suffix: string; label: string; detail: string; highlight?: boolean
}) {
  const ref = useRef<HTMLDivElement>(null)
  const [started, setStarted] = useState(false)
  const count = useCountUp(value, 1600, started)

  useEffect(() => {
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) setStarted(true) }, { threshold: 0.3 })
    if (ref.current) obs.observe(ref.current)
    return () => obs.disconnect()
  }, [])

  return (
    <div
      ref={ref}
      className={`rounded-2xl p-6 text-center border transition-all hover:-translate-y-1 hover:shadow-lg ${
        highlight
          ? 'bg-[#D4A373] border-[#D4A373] text-[#0A192F]'
          : 'bg-white border-slate-100 shadow-sm'
      }`}
    >
      <div className={`text-4xl font-black leading-none mb-1 ${highlight ? 'text-[#0A192F]' : 'text-[#0A192F]'}`}>
        {count.toLocaleString('fr-FR')}{suffix}
      </div>
      <div className={`text-sm font-bold mt-2 mb-0.5 ${highlight ? 'text-[#0A192F]' : 'text-slate-700'}`}>{label}</div>
      <div className={`text-xs ${highlight ? 'text-[#0A192F]/70' : 'text-slate-400'}`}>{detail}</div>
    </div>
  )
}

function pilierScore(pilierKey: string): number {
  const kpis = KPIS.filter(k => k.pilier === pilierKey && k.statut !== 'gris')
  if (!kpis.length) return 0
  const total = kpis.reduce((acc, k) => {
    if (k.statut === 'vert') return acc + 1
    if (k.statut === 'orange') return acc + 0.5
    return acc
  }, 0)
  return Math.round((total / kpis.length) * 100)
}

// ─── jauge (supporte les décimaux pour l’affichage) ────────────────────────

function GaugeSVG({ score }: { score: number }) {
  // score peut être décimal (ex: 48.7)
  const r = 80, cx = 110, cy = 110, strokeW = 18
  const angle = (score / 100) * 180
  const rad = (angle - 180) * (Math.PI / 180)
  const x = cx + r * Math.cos(rad)
  const y = cy + r * Math.sin(rad)
  const circumference = Math.PI * r
  const dashOffset = circumference - (score / 100) * circumference
  const color = score >= 65 ? '#10b981' : score >= 40 ? '#f59e0b' : '#ef4444'
  const displayScore = Number.isInteger(score) ? score : score.toFixed(1)
  return (
    <svg viewBox="0 0 220 130" className="w-full max-w-xs mx-auto" aria-label={`Score IMNT : ${displayScore} sur 100`}>
      <path d={`M ${cx - r} ${cy} A ${r} ${r} 0 0 1 ${cx + r} ${cy}`} fill="none" stroke="#e2e8f0" strokeWidth={strokeW} strokeLinecap="round" />
      <path d={`M ${cx - r} ${cy} A ${r} ${r} 0 0 1 ${cx + r} ${cy}`} fill="none" stroke={color} strokeWidth={strokeW} strokeLinecap="round"
        strokeDasharray={circumference} strokeDashoffset={dashOffset} style={{ transition: 'stroke-dashoffset 1s ease' }} />
      <line x1={cx} y1={cy} x2={x} y2={y} stroke="#1e293b" strokeWidth={3} strokeLinecap="round" />
      <circle cx={cx} cy={cy} r={6} fill="#1e293b" />
      <text x={cx - r - 6} y={cy + 18} fontSize="11" fill="#94a3b8" textAnchor="middle">0</text>
      <text x={cx + r + 6} y={cy + 18} fontSize="11" fill="#94a3b8" textAnchor="middle">100</text>
      <text x={cx} y={cy - 14} fontSize="28" fontWeight="700" fill="#0f172a" textAnchor="middle">{displayScore}</text>
      <text x={cx} y={cy + 4} fontSize="11" fill="#64748b" textAnchor="middle">/100</text>
    </svg>
  )
}

// ─── bandeau défilant (ticker) ─────────────────────────────────────────────

function Ticker() {
  const items = [
    'IMNT Global : 48,7/100',
    'Startups : +1 400',
    'Pénétration Internet : 78,5 %',
    'Connexions mobiles : 124 %',
    'Diplômés ICT : 32 000/an',
    'NRI 2025 : 39,29/100 · Rang 96e/127',
    'Score E-gouvernement : 0,6935',
    'Parcs technologiques : 12',
  ]
  return (
    <div className="overflow-hidden border-t border-[#D4A373]/20 mt-10 pt-4" aria-label="Dernières données en continu">
      <div className="flex animate-ticker gap-0 whitespace-nowrap">
        {[...items, ...items].map((item, i) => (
          <span key={i} className="flex items-center gap-6 px-6 text-sm text-[#D4A373]/80 font-medium">
            <span className="w-1.5 h-1.5 rounded-full bg-[#D4A373] inline-block" />
            {item}
          </span>
        ))}
      </div>
      <style>{`@keyframes ticker { from { transform: translateX(0) } to { transform: translateX(-50%) } } .animate-ticker { animation: ticker 30s linear infinite; }`}</style>
    </div>
  )
}

// ─── navigation et pied de page ────────────────────────────────────────────

function Nav({ active }: { active: string }) {
  const links = [
    { label: 'Accueil', href: '/' },
    { label: 'KPIs', href: '/kpis' },
    { label: 'Actualités', href: '/actualites' },
    { label: 'Rapport', href: '/rapport' },
    { label: 'Méthodologie', href: '/methodologie' },
    { label: 'À propos', href: '/about' },
  ]
  return (
    <header className="bg-[#0A192F] sticky top-0 z-50 shadow-md">
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between" aria-label="Principale">
        <Link href="/" className="flex items-center gap-3 focus:outline-none focus:ring-2 focus:ring-[#64FFDA] rounded">
          <div className="w-8 h-8 rounded bg-[#D4A373] flex items-center justify-center">
            <span className="text-[#0A192F] font-black text-sm">T</span>
          </div>
          <div className="leading-tight">
            <span className="text-white font-black text-sm tracking-tight block">Think Digital</span>
            <span className="text-[#D4A373] text-[10px] font-semibold tracking-widest uppercase -mt-0.5 block">Think Tunisia</span>
          </div>
        </Link>
        <div className="hidden md:flex items-center gap-1">
          {links.map(item => (
            <Link key={item.label} href={item.href}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-[#64FFDA] ${
                item.href === active ? 'bg-white/15 text-white' : 'text-slate-300 hover:text-white hover:bg-white/10'
              }`}>
              {item.label}
            </Link>
          ))}
        </div>
        <Link href="/rapport" className="bg-[#D4A373] hover:bg-[#c49a6c] text-[#0A192F] font-semibold text-sm px-4 py-2 rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-[#64FFDA] focus:ring-offset-2 focus:ring-offset-[#0A192F]">
          Télécharger le rapport
        </Link>
      </nav>
    </header>
  )
}

function Footer() {
  return (
    <footer className="bg-[#0A192F] text-slate-400 pt-12 pb-6">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="grid md:grid-cols-3 gap-10 pb-10 border-b border-slate-800">
          <div>
            <div className="flex items-center gap-3 mb-3">
              <div className="w-8 h-8 rounded bg-[#D4A373] flex items-center justify-center">
                <span className="text-[#0A192F] font-black text-sm">T</span>
              </div>
              <div>
                <div className="text-white font-black text-sm">Think Digital</div>
                <div className="text-[#D4A373] text-[10px] font-semibold tracking-widest uppercase">Think Tunisia</div>
              </div>
            </div>
            <p className="text-sm leading-relaxed text-slate-500">Là où les données dessinent l'avenir numérique de la Tunisie.</p>
          </div>
          <div>
            <p className="text-xs font-bold uppercase tracking-widest text-slate-600 mb-4">Navigation</p>
            <ul className="flex flex-col gap-2 text-sm">
              {['Dashboard', 'KPIs', 'Rapport', 'Actualités', 'Blog', 'Contact', 'Méthodologie'].map(l => (
                <li key={l}><Link href={`/${l.toLowerCase()}`} className="hover:text-white transition-colors focus:outline-none focus:underline">{l}</Link></li>
              ))}
            </ul>
          </div>
          <div>
            <p className="text-xs font-bold uppercase tracking-widest text-slate-600 mb-4">Légal</p>
            <ul className="flex flex-col gap-2 text-sm">
              {['Mentions légales', 'Confidentialité', 'Cookies', "Conditions d'utilisation"].map(l => (
                <li key={l}><Link href={`/${l.toLowerCase().replace(/\s+/g, '-').replace(/'/g, '')}`} className="hover:text-white transition-colors focus:outline-none focus:underline">{l}</Link></li>
              ))}
            </ul>
          </div>
        </div>
        <div className="pt-6 pb-4 border-b border-slate-800/50 text-xs text-slate-500 space-y-1">
          <p>© Idée & Concept — Madame Rim Jalouli. Tous droits réservés. Toute utilisation, reproduction ou exploitation du concept, de la démarche et des contenus est soumise à autorisation préalable.</p>
          <p>© Conception, démarche éditoriale & consultation approfondie — Mr Wahib Zaier.</p>
        </div>
        <div className="pt-6 flex flex-col md:flex-row items-center justify-between gap-3 text-xs text-slate-600">
          <span>© 2025 Think Digital, Think Tunisia. Conçu avec rigueur en Tunisie.</span>
          <span>Sources : Portulans Institute (NRI 2025), UIT, APII / Startup Tunisia, et calcul interne IMNT.</span>
        </div>
      </div>
    </footer>
  )
}

// ─── page principale ────────────────────────────────────────────────────────

export default function HomePage() {
  // Valeur corrigée : IMNT 2025 = 48,7 / 100 (au lieu de 57)
  const IMNT_CORRECTED = 48.7

  // On conserve le calcul d’origine pour les pourcentages de statuts (vert/orange/rouge)
  const statusCounts = {
    vert:   KPIS.filter(k => k.statut === 'vert').length,
    orange: KPIS.filter(k => k.statut === 'orange').length,
    rouge:  KPIS.filter(k => k.statut === 'rouge').length,
  }

  const highlights = KPIS.filter(k => ['KPI-02', 'KPI-06', 'KPI-09'].includes(k.id))

  return (
    <div className="min-h-screen bg-slate-50 font-sans">
      <a href="#main-content" className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 bg-white p-2 rounded shadow-lg z-50 focus:outline-none focus:ring-2 focus:ring-[#64FFDA]">
        Aller au contenu principal
      </a>
      <Nav active="/" />
      <main id="main-content">

        {/* HERO */}
        <section className="bg-[#0A192F] text-white relative overflow-hidden">
          <div className="absolute inset-0 opacity-5" style={{
            backgroundImage: 'linear-gradient(#ffffff 1px, transparent 1px), linear-gradient(90deg, #ffffff 1px, transparent 1px)',
            backgroundSize: '48px 48px',
          }} />
          <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-[#D4A373] to-transparent opacity-60" />
          <div className="relative max-w-7xl mx-auto px-4 sm:px-6 py-20 md:py-28">
            <div className="max-w-3xl">
              <div className="inline-flex items-center gap-2 bg-[#D4A373]/20 border border-[#D4A373]/30 rounded-full px-4 py-1.5 mb-6">
                <span className="w-2 h-2 rounded-full bg-[#D4A373] animate-pulse" />
                <span className="text-[#D4A373] text-xs font-semibold tracking-wider uppercase">Rapport Annuel de l'Économie Numérique en Tunisie</span>
              </div>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-black leading-tight mb-3 tracking-tight">Think Digital,</h1>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-black leading-tight mb-6 tracking-tight">
                <span className="text-[#D4A373]">Think Tunisia.</span>
              </h1>
              <p className="text-slate-300 text-lg md:text-xl leading-relaxed mb-10 max-w-2xl">Là où les données dessinent l'avenir numérique de la Tunisie.</p>
              <div className="flex flex-wrap gap-4">
                <Link href="/kpis" className="bg-[#D4A373] hover:bg-[#c49a6c] text-[#0A192F] font-bold px-8 py-3.5 rounded-xl transition-all hover:scale-105 shadow-lg shadow-amber-900/30 focus:outline-none focus:ring-2 focus:ring-[#64FFDA] focus:ring-offset-2 focus:ring-offset-[#0A192F]">
                  Explorer le Dashboard →
                </Link>
                <Link href="/rapport" className="bg-white/10 hover:bg-white/20 border border-white/20 text-white font-semibold px-8 py-3.5 rounded-xl transition-colors backdrop-blur-sm focus:outline-none focus:ring-2 focus:ring-white">
                  Télécharger le Rapport
                </Link>
                <Link href="/about" className="text-slate-400 hover:text-white font-semibold px-4 py-3.5 rounded-xl transition-colors text-sm underline underline-offset-4 focus:outline-none focus:text-white">
                  En savoir plus
                </Link>
              </div>
            </div>
          </div>
          <Ticker />
        </section>
<br></br> <br></br><br></br><br></br>



        {/* SCORE NRI + IMNT (avec la valeur corrigée 48,7) */}

        <section className="max-w-7xl mx-auto px-4 sm:px-6 -mt-8 relative z-10">
          <div className="bg-white rounded-2xl shadow-xl border border-slate-100 p-6 md:p-8">
            <div className="grid md:grid-cols-2 gap-10 items-center">
              <div className="text-center">
                <SectionHeader eyebrow="Indice IMNT" title="Score composite" description="15 KPIs pondérés · Mise à jour 2025" center />
                <GaugeSVG score={IMNT_CORRECTED} />
                <div className="mt-3 inline-flex items-center gap-2 bg-amber-50 border border-amber-200 rounded-full px-4 py-1.5">
                  <span className="w-2 h-2 rounded-full bg-amber-400" />
                  <span className="text-amber-700 text-sm font-semibold">Performance intermédiaire</span>
                </div>
              </div>
              <div>
                <SectionHeader eyebrow="NRI 2025" title="Network Readiness Index" description="Portulans Institute" center={false} />
                <div className="grid grid-cols-2 gap-3 mb-6">
                  {[
                    { label: 'Score NRI global', value: '39,29', sub: '/ 100' },
                    { label: 'Rang mondial', value: '96ᵉ', sub: 'sur 127 économies' },
                    { label: 'Rang groupe revenus', value: '14ᵉ', sub: 'Lower-middle-income' },
                    { label: 'Rang région', value: '10ᵉ', sub: 'Arab States' },
                  ].map(({ label, value, sub }) => (
                    <div key={label} className="bg-slate-50 rounded-xl p-4">
                      <div className="text-2xl font-black text-[#0A192F]">{value}</div>
                      <div className="text-xs text-slate-400 mt-0.5">{sub}</div>
                      <div className="text-xs font-medium text-slate-600 mt-1">{label}</div>
                    </div>
                  ))}
                </div>
                <div className="space-y-2">
                  {[
                    { label: 'Favorables',    count: statusCounts.vert,   color: 'bg-emerald-500' },
                    { label: 'À surveiller',  count: statusCounts.orange, color: 'bg-amber-400' },
                    { label: 'Critiques',     count: statusCounts.rouge,  color: 'bg-red-500' },
                  ].map(({ label, count, color }) => (
                    <div key={label} className="flex items-center gap-3">
                      <div className="flex items-center gap-2 w-28">
                        <span className={`w-2.5 h-2.5 rounded-full ${color}`} />
                        <span className="text-xs font-medium text-slate-600">{label}</span>
                      </div>
                      <div className="flex-1 bg-slate-100 rounded-full h-2 overflow-hidden">
                        <div className={`h-full rounded-full ${color}`} style={{ width: `${(count / 15) * 100}%` }} />
                      </div>
                      <span className="text-xs font-bold text-slate-600 w-5 text-right">{count}</span>
                    </div>
                  ))}
                </div>
                <p className="text-xs text-slate-400 mt-4">*Sources : Portulans Institute (NRI 2025), UIT, APII / Startup Tunisia, calcul interne IMNT.</p>
              </div>
            </div>
          </div>
        </section>

        {/* ABOUT / MANIFESTE */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 py-16">
          <div className="grid lg:grid-cols-2 gap-12">
            <div>
              <SectionHeader eyebrow="À propos" title="Une plateforme dédiée au suivi annuel de l'économie numérique en Tunisie" center={false} />
              <p className="text-slate-600 leading-relaxed mb-6">
                Cette plateforme a été conçue pour structurer, centraliser et automatiser la production du Rapport Annuel de l'Économie Numérique en Tunisie. Elle s'appuie sur des sources officielles et spécialisées, enrichies par des analyses générées sous contrôle humain, afin d'offrir un référentiel fiable aux décideurs, investisseurs et acteurs de l'écosystème digital.
              </p>
              <Card className="p-5" hover={false}>
                <div className="text-sm text-slate-600 space-y-2">
                  <p><span className="font-semibold text-slate-800">Idée & Copyright :</span> © Madame Rim Jalouli. Tous droits réservés.</p>
                  <p><span className="font-semibold text-slate-800">Conception & consultation :</span> Mr Wahib Zaier</p>
                </div>
              </Card>
            </div>
            <div className="bg-[#0A192F] rounded-2xl p-8 text-white relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-[#D4A373]/10 rounded-full -translate-y-1/2 translate-x-1/2" />
              <p className="text-[#D4A373] text-xs font-bold uppercase tracking-widest mb-4">Le Manifeste</p>
              <blockquote className="text-lg md:text-xl font-bold leading-relaxed mb-6">"La transformation digitale ne s'improvise pas. Elle se mesure."</blockquote>
              <p className="text-slate-300 text-sm leading-relaxed mb-6">
                Nous avons construit cet observatoire pour offrir à la Tunisie un miroir précis de son économie numérique. Pas de slogans creux, pas de chiffres inventés : uniquement des indicateurs sourcés, des analyses validées par des experts et un index composite unique — l'IMNT — pour évaluer, comparer et décider.
              </p>
              <p className="text-slate-300 text-sm leading-relaxed mb-6">Parce que l'avenir du pays se joue aussi dans la qualité de sa connexion, de ses talents et de sa gouvernance.</p>
              <p className="text-slate-500 text-xs border-t border-white/10 pt-4">Une initiative pensée par Rim Jalouli · Conception & consultation : Wahib Zaier</p>
            </div>
          </div>
        </section>

        {/* TUNISIA IN NUMBERS */}
        <section className="bg-slate-100 py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6">
            <SectionHeader eyebrow="Chiffres clés" title="La Tunisie en données" description="Quelques repères qui comptent" />
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
              <CounterCard value={1400}  suffix="+"   label="Startups enregistrées" detail="Sous le Startup Act" />
              <CounterCard value={78}    suffix=" %"  label="Pénétration Internet"  detail="Population connectée" />
              <CounterCard value={124}   suffix=" %"  label="Mobile / 100 hab."     detail="UIT" />
              <CounterCard value={32000} suffix=""    label="Diplômés ICT / an"     detail="Ressources qualifiées (Capital humain)" />
              <CounterCard value={48.7}  suffix=""    label="Score IMNT"             detail="Notre index composite 2025" highlight />
              <CounterCard value={12}    suffix=""    label="Parcs technologiques"   detail="Écosystème structuré" />
            </div>
          </div>
        </section>

        {/* WHY THINK DIGITAL */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 py-16">
          <SectionHeader eyebrow="Positionnement" title="Pourquoi la Tunisie numérique ?" description="Six atouts qui font la différence" />
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              { icon: '🧠', title: 'Capital Humain', sub: 'Le cerveau du continent', body: '32 000 diplômés en ICT chaque année. Une jeunesse bilingue, connectée et recherchée par les grands comptes européens.' },
              { icon: '📡', title: 'Infrastructure', sub: 'Connectée, et en accélération', body: 'Fibre optique, 4G nationale, data centers certifiés. Les fondations d\'une économie sans frontières.' },
              { icon: '🚀', title: 'Écosystème Startup', sub: 'De Tunis à l\'international', body: 'Plus de 1 400 startups, accélérateurs actifs et levées record. La Tunisie s\'exporte en Afrique et en Europe.' },
              { icon: '⚖️', title: 'Cadre Légal', sub: 'Une gouvernance rassurante', body: 'Protection des données, cybercriminalité, signature électronique. Un cadre qui protège et encourage l\'innovation.' },
              { icon: '🌍', title: 'Nearshore', sub: "L'Europe à deux heures", body: 'Francophonie, décalage horaire réduit, coûts maîtrisés. La destination privilégiée de l\'externalisation digitale.' },
              { icon: '🔗', title: 'Hub Géostratégique', sub: 'La porte de trois continents', body: 'À la croisée de l\'Afrique, de l\'Europe et du Moyen-Orient. Un accès privilégié à 1,5 milliard de consommateurs.' },
            ].map(card => (
              <Card key={card.title} className="p-6">
                <div className="text-3xl mb-4">{card.icon}</div>
                <div className="text-xs font-bold text-[#D4A373] uppercase tracking-wider mb-1">{card.sub}</div>
                <h3 className="text-lg font-black text-slate-800 mb-2">{card.title}</h3>
                <p className="text-sm text-slate-500 leading-relaxed">{card.body}</p>
              </Card>
            ))}
          </div>
        </section>

        {/* LES 5 PILIERS IMNT (avec libellé « Économie numérique productive ») */}
        <section className="bg-[#0A192F] py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6">
            <SectionHeader eyebrow="Architecture" title="L'Index IMNT : cinq piliers, un score" description="Cliquez sur un pilier pour explorer ses indicateurs" center />
            <div className="grid grid-cols-1 sm:grid-cols-5 gap-4">
              {IMNT_PILIERS.map(({ num, label, icon, pilierKey }) => {
                const score = pilierScore(pilierKey)
                const color = score >= 65 ? 'text-emerald-400' : score >= 40 ? 'text-amber-400' : 'text-red-400'
                return (
                  <Link key={num} href={`/kpis?pilier=${encodeURIComponent(pilierKey)}`}
                    className="bg-white/5 hover:bg-white/10 border border-white/10 hover:border-[#D4A373]/40 rounded-xl p-5 text-center transition-all group focus:outline-none focus:ring-2 focus:ring-[#64FFDA]">
                    <div className="text-2xl mb-2">{icon}</div>
                    <div className="text-slate-400 text-xs font-bold mb-1">{num}</div>
                    <div className="text-white text-sm font-bold leading-tight mb-3">{label}</div>
                    <div className={`text-2xl font-black ${color}`}>{score}</div>
                    <div className="text-slate-500 text-xs">/100</div>
                  </Link>
                )
              })}
            </div>
          </div>
        </section>

        {/* NOTRE MISSION */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 py-16">
          <SectionHeader eyebrow="Raison d'être" title="Pourquoi ce rapport ?" center />
          <div className="grid md:grid-cols-3 gap-6">
            {[
              { icon: '📐', title: 'Mesurer', sub: 'Des données sourcées, jamais des impressions.', body: "Nous agrégeons des indicateurs officiels (BCT, UIT, UN DESA) avec une méthodologie transparente et une date de fraîcheur affichée." },
              { icon: '🔬', title: 'Analyser', sub: "L'IA au service de l'expertise.", body: "Nos algorithmes génèrent des analyses et recommandations. Mais aucun texte n'est publié sans validation humaine. Zéro invention, zéro hallucination." },
              { icon: '🎯', title: 'Décider', sub: 'Un référentiel pour agir.', body: "Investisseurs, décideurs publics, chercheurs : trouvez ici les arguments chiffrés pour orienter vos stratégies et vos politiques." },
            ].map(m => (
              <Card key={m.title} className="p-7">
                <div className="w-12 h-12 rounded-xl bg-[#0A192F]/5 flex items-center justify-center text-2xl mb-5">{m.icon}</div>
                <h3 className="text-xl font-black text-[#0A192F] mb-1">{m.title}</h3>
                <p className="text-xs font-semibold text-[#D4A373] mb-3">{m.sub}</p>
                <p className="text-sm text-slate-500 leading-relaxed">{m.body}</p>
              </Card>
            ))}
          </div>
        </section>

        {/* ÉCOSYSTÈME */}
        <section className="bg-slate-100 py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6">
            <SectionHeader eyebrow="Public cible" title="Qui se nourrit de ces données ?" center />
            <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-3">
              {[
                { icon: '🏛️', label: 'Institutions',  tag: 'Politiques publiques' },
                { icon: '🏢', label: 'Entreprises',    tag: 'Anticiper les marchés' },
                { icon: '🚀', label: 'Startups',       tag: 'Données fiables' },
                { icon: '💼', label: 'Investisseurs',  tag: 'Opportunités' },
                { icon: '🎓', label: 'Chercheurs',     tag: 'Alimenter la recherche' },
                { icon: '🌐', label: 'ONG & Int.',     tag: 'Benchmark régional' },
                { icon: '📰', label: 'Médias',         tag: 'Sources vérifiées' },
                { icon: '👥', label: 'Citoyens',       tag: 'Comprendre le digital' },
              ].map(({ icon, label, tag }) => (
                <Card key={label} className="p-4 text-center" hover={false}>
                  <div className="text-2xl mb-2">{icon}</div>
                  <div className="text-sm font-bold text-slate-700">{label}</div>
                  <div className="text-xs text-slate-400 mt-1 leading-tight">{tag}</div>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* KPIs EN LUMIÈRE */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 py-16">
          <div className="flex flex-wrap items-end justify-between gap-4 mb-8">
            <SectionHeader eyebrow="Indicateurs phares" title="KPIs en lumière" center={false} />
            <Link href="/kpis" className="text-[#0A192F] font-semibold text-sm hover:underline focus:outline-none focus:ring-2 focus:ring-[#64FFDA] rounded">
              Voir les 15 KPIs →
            </Link>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            {highlights.map(kpi => {
              const s = STATUS_MAP[kpi.statut]
              return (
                <Link key={kpi.id} href={`/kpis/${kpi.id.toLowerCase()}`} className="group focus:outline-none focus:ring-2 focus:ring-[#64FFDA] rounded-2xl">
                  <Card className="p-6 h-full">
                    <div className="flex items-start justify-between mb-4">
                      <span className="text-2xl">{PILIER_ICONS[kpi.pilier] ?? '📊'}</span>
                      <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold border ${s.bg} ${s.text} ${s.border}`}>
                        <span className={`w-1.5 h-1.5 rounded-full ${s.dot}`} />{s.label}
                      </span>
                    </div>
                    <div className="text-3xl font-black text-[#0A192F] mb-1 group-hover:text-[#D4A373] transition-colors">{kpi.valeur}</div>
                    <div className="text-xs text-slate-400 mb-3">{kpi.unite} · {kpi.annee}</div>
                    <div className="font-semibold text-slate-700 text-sm mb-1">{kpi.nom}</div>
                    <div className="text-xs text-slate-400 line-clamp-2">{kpi.definition}</div>
                    <div className="mt-4 pt-4 border-t border-slate-50 flex items-center justify-between">
                      <span className="text-xs text-slate-400">{kpi.source}</span>
                      <span className="text-xs font-medium text-[#0A192F] opacity-0 group-hover:opacity-100 transition-opacity">Détail →</span>
                    </div>
                  </Card>
                </Link>
              )
            })}
          </div>
        </section>

        {/* RAPPORT EN VEDETTE */}
        <section className="bg-gradient-to-r from-[#0A192F] to-[#0d2b4a] py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6">
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              <div className="hidden lg:flex justify-center">
                <div className="w-56 h-72 bg-white/5 border border-white/10 rounded-2xl flex flex-col items-center justify-center gap-4 shadow-2xl">
                  <div className="text-6xl">📊</div>
                  <div className="text-center">
                    <div className="text-white font-black text-lg">RENT 2025</div>
                    <div className="text-[#D4A373] text-xs font-semibold mt-1">Rapport Annuel</div>
                  </div>
                  <div className="w-16 h-0.5 bg-[#D4A373]/40" />
                  <div className="text-slate-400 text-xs">Think Digital, Think Tunisia</div>
                </div>
              </div>
              <div>
                <p className="text-[#D4A373] text-xs font-bold uppercase tracking-widest mb-3">Rapport en vedette</p>
                <h2 className="text-2xl md:text-3xl font-black text-white mb-4">Rapport Annuel 2025</h2>
                <p className="text-slate-300 leading-relaxed mb-6">
                  15 indicateurs clés. Un score IMNT. Des analyses par pilier. Des recommandations court, moyen et long terme. Tout ce que vous devez savoir sur l'économie numérique tunisienne, dans un document unique et téléchargeable.
                </p>
                <div className="flex flex-wrap gap-4">
                  <Link href="/rapport" className="bg-[#D4A373] hover:bg-[#c49a6c] text-[#0A192F] font-bold px-7 py-3 rounded-xl transition-all hover:scale-105 focus:outline-none focus:ring-2 focus:ring-[#64FFDA]">
                    📄 Télécharger le PDF
                  </Link>
                  <Link href="/rapport" className="bg-white/10 hover:bg-white/20 border border-white/20 text-white font-semibold px-7 py-3 rounded-xl transition-colors focus:outline-none focus:ring-2 focus:ring-white">
                    Consulter en ligne
                  </Link>
                </div>
                <p className="mt-4 text-xs text-slate-500">
                  <Link href="/rapport" className="hover:text-slate-300 underline underline-offset-2 transition-colors focus:outline-none focus:text-slate-300">
                    Archives des rapports précédents →
                  </Link>
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* ACTUALITÉS + BLOG */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 py-16">
          <div className="grid lg:grid-cols-2 gap-12">
            <div>
              <SectionHeader eyebrow="Dernières nouvelles" title="Actualités" center={false} />
              <div className="space-y-4">
                {NEWS.map(item => (
                  <Card key={item.id} className="p-5">
                    <div className="flex items-start gap-4">
                      <div className="w-10 h-10 rounded-lg bg-[#0A192F]/5 flex items-center justify-center flex-shrink-0 mt-0.5">📰</div>
                      <div>
                        <div className="text-xs text-slate-400 mb-1">{item.date}</div>
                        <div className="font-semibold text-slate-800 text-sm mb-1 leading-snug">{item.titre}</div>
                        <div className="text-xs text-slate-500 line-clamp-2">{item.extrait}</div>
                      </div>
                    </div>
                  </Card>
                ))}
                <Link href="/actualites" className="block text-center text-sm font-semibold text-[#0A192F] hover:text-[#D4A373] transition-colors pt-2 focus:outline-none focus:underline">
                  Toutes les actualités →
                </Link>
              </div>
            </div>
            <div>
              <SectionHeader eyebrow="Analyses & insights" title="Blog" center={false} />
              <div className="space-y-4">
                {ARTICLES.map(article => (
                  <Card key={article.id} className="p-5 group cursor-pointer">
                    <div className="flex items-start gap-4">
                      <div className="w-10 h-10 rounded-lg bg-[#D4A373]/10 flex items-center justify-center flex-shrink-0 mt-0.5">✍️</div>
                      <div>
                        <div className="text-xs text-slate-400 mb-1">{article.date}</div>
                        <div className="font-semibold text-slate-800 text-sm mb-1 leading-snug group-hover:text-[#0A192F] transition-colors">{article.titre}</div>
                        <div className="text-xs text-slate-500 line-clamp-2">{article.extrait}</div>
                      </div>
                    </div>
                  </Card>
                ))}
                <Link href="/blog" className="block text-center text-sm font-semibold text-[#0A192F] hover:text-[#D4A373] transition-colors pt-2 focus:outline-none focus:underline">
                  Tous les articles →
                </Link>
              </div>
            </div>
          </div>
        </section>

      </main>
      <Footer />
    </div>
  )
}