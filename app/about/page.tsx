'use client'

import Link from 'next/link'
import { useState, useRef } from 'react'
import emailjs from '@emailjs/browser'

const NAV_LINKS = [
  { label: 'Accueil',      href: '/' },
  { label: 'KPIs',         href: '/kpis' },
  { label: 'Actualités',   href: '/actualites' },
  { label: 'Rapport',      href: '/rapport' },
  { label: 'Méthodologie', href: '/methodologie' },
  { label: 'À propos',     href: '/about' },
]

export default function AboutPage() {
  const formRef = useRef<HTMLFormElement>(null)
  const [form, setForm]       = useState({ nom: '', email: '', message: '' })
  const [status, setStatus]   = useState<'idle' | 'sending' | 'success' | 'error'>('idle')
  const [errorMsg, setErrorMsg] = useState('')

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }))
  }

  const handleSubmit = async () => {
    if (!form.nom.trim() || !form.email.trim() || !form.message.trim()) {
      setStatus('error')
      setErrorMsg('Veuillez remplir tous les champs.')
      return
    }
    setStatus('sending')
    setErrorMsg('')
    try {
      await emailjs.send(
        process.env.NEXT_PUBLIC_EMAILJS_SERVICE_ID!,
        process.env.NEXT_PUBLIC_EMAILJS_TEMPLATE_ID!,
        {
          from_name:    form.nom,
          from_email:   form.email,
          organisation: form.nom,   // le champ nom contient "Nom & Organisation"
          message:      form.message,
        },
        process.env.NEXT_PUBLIC_EMAILJS_PUBLIC_KEY!,
      )
      setStatus('success')
      setForm({ nom: '', email: '', message: '' })
    } catch (err) {
      console.error(err)
      setStatus('error')
      setErrorMsg('Erreur lors de l\'envoi. Réessayez dans quelques instants.')
    }
  }

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
            {NAV_LINKS.map(item => (
              <Link key={item.href} href={item.href}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  item.href === '/about'
                    ? 'bg-white/15 text-white'
                    : 'text-slate-300 hover:text-white hover:bg-white/10'
                }`}>
                {item.label}
              </Link>
            ))}
          </div>
          <Link href="/rapport"
            className="bg-[#D4AF37] hover:bg-[#c4a030] text-[#0A2B4E] font-semibold text-sm px-4 py-2 rounded-lg transition-colors">
            Télécharger le rapport
          </Link>
        </nav>
      </header>

      {/* ── HERO ── */}
      <section className="bg-[#0A2B4E] text-white py-14 relative overflow-hidden">
        {/* subtle grid bg */}
        <div className="absolute inset-0 opacity-5" style={{
          backgroundImage: 'linear-gradient(#ffffff 1px,transparent 1px),linear-gradient(90deg,#ffffff 1px,transparent 1px)',
          backgroundSize: '48px 48px',
        }} />
        <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[#D4AF37] to-transparent opacity-40" />

        <div className="relative max-w-7xl mx-auto px-6">
          {/* breadcrumb */}
          <div className="flex items-center gap-2 text-sm text-slate-400 mb-6">
            <Link href="/" className="hover:text-white transition-colors">Accueil</Link>
            <span>/</span>
            <span className="text-white">À propos</span>
          </div>

          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 bg-[#D4AF37]/20 border border-[#D4AF37]/30 rounded-full px-4 py-1.5 mb-5">
              <span className="w-2 h-2 rounded-full bg-[#D4AF37]" />
              <span className="text-[#D4AF37] text-xs font-semibold tracking-wider uppercase">
                Initiative — Think Digital, Think Tunisia
              </span>
            </div>
            <h1 className="text-3xl md:text-4xl font-black leading-tight mb-4">
              À propos de cette <span className="text-[#D4AF37]">initiative</span>
            </h1>
            <p className="text-slate-300 text-lg leading-relaxed">
              Une plateforme dédiée au suivi annuel de l'économie numérique en Tunisie.
            </p>
          </div>
        </div>
      </section>

      <main className="max-w-7xl mx-auto px-6 py-14 space-y-16">

        {/* ── 1. PRÉSENTATION ── */}
        <section>
          <div className="grid lg:grid-cols-2 gap-10 items-start">

            {/* bloc texte FR */}
            <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-8">
              <p className="text-xs font-bold uppercase tracking-widest text-[#D4AF37] mb-2">
                À propos
              </p>
              <h2 className="text-2xl font-black text-slate-800 mb-2">
                À propos de cette initiative
              </h2>
              <p className="text-sm font-semibold text-slate-500 mb-5 leading-snug">
                Une plateforme dédiée au suivi annuel de l'économie numérique en Tunisie
              </p>
              <div className="h-px bg-gradient-to-r from-[#D4AF37] to-transparent mb-6" />
              <p className="text-slate-600 leading-relaxed text-sm mb-6">
                Cette plateforme a été conçue pour structurer, centraliser et automatiser
                la production du Rapport Annuel de l'Économie Numérique en Tunisie. Elle
                s'appuie sur des sources officielles et spécialisées, enrichies par des
                analyses générées sous contrôle humain, afin d'offrir un référentiel fiable
                aux décideurs, investisseurs et acteurs de l'écosystème digital.
              </p>

              {/* encadré crédits */}
              <div className="bg-amber-50 border border-amber-200 rounded-xl p-5 space-y-3 text-sm">
                <p className="font-bold text-slate-800 text-xs uppercase tracking-widest mb-3">
                  Crédits & Droits
                </p>
                <div className="flex items-start gap-3">
                  <span className="w-8 h-8 rounded-lg bg-[#D4AF37]/20 flex items-center justify-center flex-shrink-0 mt-0.5 text-base">💡</span>
                  <div>
                    <p className="font-semibold text-slate-800">Idée & Copyright</p>
                    <p className="text-slate-600 leading-relaxed mt-0.5">
                      © Madame Rim Jalouli. Tous droits réservés. Toute utilisation,
                      reproduction ou exploitation du concept, de la démarche et des contenus
                      de cette plateforme est soumise à autorisation préalable de l'autrice.
                    </p>
                  </div>
                </div>
                <div className="border-t border-amber-200 pt-3 flex items-start gap-3">
                  <span className="w-8 h-8 rounded-lg bg-[#0A2B4E]/10 flex items-center justify-center flex-shrink-0 mt-0.5 text-base">🏗️</span>
                  <div>
                    <p className="font-semibold text-slate-800">
                      Conception, démarche éditoriale et consultation approfondie
                    </p>
                    <p className="text-slate-600 mt-0.5">Mr Wahib Zaier</p>
                  </div>
                </div>
              </div>
            </div>

            {/* manifeste + mission */}
            <div className="space-y-6">
              {/* manifeste */}
              <div className="bg-[#0A2B4E] rounded-2xl p-8 text-white relative overflow-hidden">
                <div className="absolute top-0 right-0 w-40 h-40 bg-[#D4AF37]/8 rounded-full -translate-y-1/2 translate-x-1/2" />
                <p className="text-[#D4AF37] text-xs font-bold uppercase tracking-widest mb-4 relative">
                  La vision
                </p>
                <blockquote className="text-xl font-black leading-relaxed mb-5 relative">
                  "La transformation digitale ne s'improvise pas. Elle se mesure."
                </blockquote>
                <p className="text-slate-300 text-sm leading-relaxed relative">
                  Nous avons construit cet observatoire pour offrir à la Tunisie un miroir précis
                  de son économie numérique. Pas de slogans creux, pas de chiffres inventés :
                  uniquement des indicateurs sourcés, des analyses validées par des experts et
                  un index composite unique — l'IMNT — pour évaluer, comparer et décider.
                </p>
                <p className="text-slate-500 text-xs border-t border-white/10 pt-4 mt-5 relative">
                  Une initiative pensée par Rim Jalouli · Conception & consultation : Wahib Zaier
                </p>
              </div>

              {/* 3 piliers mission */}
              <div className="grid grid-cols-3 gap-3">
                {[
                  { icon: '📐', label: 'Mesurer',  desc: 'Données sourcées' },
                  { icon: '🔬', label: 'Analyser', desc: 'IA + validation humaine' },
                  { icon: '🎯', label: 'Décider',  desc: 'Référentiel pour agir' },
                ].map(({ icon, label, desc }) => (
                  <div key={label} className="bg-white rounded-xl border border-slate-100 p-4 text-center shadow-sm">
                    <div className="text-2xl mb-2">{icon}</div>
                    <div className="font-black text-[#0A2B4E] text-sm">{label}</div>
                    <div className="text-xs text-slate-400 mt-1 leading-tight">{desc}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* ── 2. ÉQUIPE ── */}
        <section>
          <p className="text-xs font-bold uppercase tracking-widest text-[#D4AF37] mb-1">L'équipe</p>
          <h2 className="text-2xl font-black text-slate-800 mb-8">
            Les personnes derrière la plateforme
          </h2>

          <div className="grid md:grid-cols-2 gap-6">

            {/* Rim Jalouli */}
            <div className="bg-white rounded-2xl border border-[#D4AF37]/30 shadow-sm overflow-hidden">
              <div className="h-2 bg-[#D4AF37]" />
              <div className="p-8">
                <div className="w-14 h-14 rounded-2xl bg-[#D4AF37]/15 flex items-center justify-center text-3xl mb-5">💡</div>
                <p className="text-xs font-bold uppercase tracking-widest text-[#D4AF37] mb-1">Idée & Copyright</p>
                <h3 className="text-xl font-black text-slate-800 mb-4">Madame Rim Jalouli</h3>
                <p className="text-sm text-slate-600 leading-relaxed mb-5">
                  Conceptrice originale de la plateforme Think Digital, Think Tunisia et de
                  l'approche IMNT. Détentrice des droits de propriété intellectuelle sur le
                  concept, l'architecture et les contenus de la plateforme.
                </p>
                <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 text-xs text-amber-800 leading-relaxed">
                  © Tous droits réservés. Toute utilisation, reproduction ou exploitation du
                  concept, de la démarche et des contenus de cette plateforme est soumise à
                  autorisation préalable de l'autrice.
                </div>
              </div>
            </div>

            {/* Wahib Zaier */}
            <div className="bg-white rounded-2xl border border-[#0A2B4E]/20 shadow-sm overflow-hidden">
              <div className="h-2 bg-[#0A2B4E]" />
              <div className="p-8">
                <div className="w-14 h-14 rounded-2xl bg-[#0A2B4E]/10 flex items-center justify-center text-3xl mb-5">🏗️</div>
                <p className="text-xs font-bold uppercase tracking-widest text-[#0A2B4E] mb-1">Conception éditoriale</p>
                <h3 className="text-xl font-black text-slate-800 mb-4">Mr Wahib Zaier</h3>
                <p className="text-sm text-slate-600 leading-relaxed mb-5">
                  Responsable de la conception éditoriale, de la démarche méthodologique et de
                  la consultation approfondie sur l'architecture de la plateforme, du rapport
                  annuel et de l'index IMNT.
                </p>
                <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 text-xs text-slate-600 leading-relaxed">
                  Conception, démarche éditoriale et consultation approfondie — garantissant la
                  rigueur et la pertinence de chaque publication.
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ── 3. PUBLIC CIBLE ── */}
        <section>
          <p className="text-xs font-bold uppercase tracking-widest text-[#D4AF37] mb-1">Public cible</p>
          <h2 className="text-2xl font-black text-slate-800 mb-6">Qui utilise cette plateforme ?</h2>
          <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-3">
            {[
              { icon: '🏛️', label: 'Institutions',  desc: 'Politiques publiques' },
              { icon: '🏢', label: 'Entreprises',    desc: 'Veille marché' },
              { icon: '🚀', label: 'Startups',       desc: 'Données fiables' },
              { icon: '💼', label: 'Investisseurs',  desc: 'Opportunités' },
              { icon: '🎓', label: 'Chercheurs',     desc: 'Recherche académique' },
              { icon: '🌐', label: 'ONG & Int.',     desc: 'Benchmark régional' },
              { icon: '📰', label: 'Médias',         desc: 'Sources vérifiées' },
              { icon: '👥', label: 'Citoyens',       desc: 'Comprendre le digital' },
            ].map(({ icon, label, desc }) => (
              <div key={label}
                className="bg-white rounded-xl border border-slate-100 p-4 text-center shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all">
                <div className="text-2xl mb-2">{icon}</div>
                <div className="font-bold text-slate-700 text-sm">{label}</div>
                <div className="text-xs text-slate-400 mt-1 leading-tight">{desc}</div>
              </div>
            ))}
          </div>
        </section>

        {/* ── 4. CONTACT ── */}
        <section>
          <p className="text-xs font-bold uppercase tracking-widest text-[#D4AF37] mb-1">Contact</p>
          <h2 className="text-2xl font-black text-slate-800 mb-4">Partenariats & médias</h2>
          <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-8">
            <p className="text-slate-600 text-sm leading-relaxed mb-7 max-w-2xl">
              Pour toute demande de partenariat, utilisation des données, interview ou
              collaboration institutionnelle, contactez l'équipe éditoriale via le formulaire
              ci-dessous.
            </p>

            {/* ── SUCCESS ── */}
            {status === 'success' ? (
              <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-8 text-center">
                <div className="text-4xl mb-3">✅</div>
                <h3 className="font-black text-emerald-800 text-lg mb-2">Message envoyé !</h3>
                <p className="text-emerald-700 text-sm">
                  Nous avons bien reçu votre message et vous répondrons dans les plus brefs délais.
                </p>
                <button
                  onClick={() => setStatus('idle')}
                  className="mt-5 text-sm font-semibold text-emerald-700 underline underline-offset-2 hover:text-emerald-900 transition-colors">
                  Envoyer un autre message
                </button>
              </div>
            ) : (
              <>
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div>
                      <label className="block text-xs font-bold text-slate-600 mb-1.5 uppercase tracking-wide">
                        Nom & Organisation
                      </label>
                      <input
                        type="text"
                        name="nom"
                        value={form.nom}
                        onChange={handleChange}
                        placeholder="Ex : Ahmed Ben Ali — Ministère des TIC"
                        className="w-full border border-slate-200 rounded-xl px-4 py-3 text-sm text-slate-700 placeholder-slate-300 focus:outline-none focus:border-[#0A2B4E] focus:ring-2 focus:ring-[#0A2B4E]/10 transition-all"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-slate-600 mb-1.5 uppercase tracking-wide">
                        Adresse email
                      </label>
                      <input
                        type="email"
                        name="email"
                        value={form.email}
                        onChange={handleChange}
                        placeholder="contact@organisation.tn"
                        className="w-full border border-slate-200 rounded-xl px-4 py-3 text-sm text-slate-700 placeholder-slate-300 focus:outline-none focus:border-[#0A2B4E] focus:ring-2 focus:ring-[#0A2B4E]/10 transition-all"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-600 mb-1.5 uppercase tracking-wide">
                      Votre message
                    </label>
                    <textarea
                      rows={4}
                      name="message"
                      value={form.message}
                      onChange={handleChange}
                      placeholder="Décrivez votre demande ou projet de collaboration..."
                      className="w-full border border-slate-200 rounded-xl px-4 py-3 text-sm text-slate-700 placeholder-slate-300 focus:outline-none focus:border-[#0A2B4E] focus:ring-2 focus:ring-[#0A2B4E]/10 transition-all resize-none"
                    />
                  </div>
                </div>

                {/* error */}
                {status === 'error' && errorMsg && (
                  <div className="mt-4 bg-red-50 border border-red-200 rounded-xl px-4 py-3 text-sm text-red-700 flex items-center gap-2">
                    <span>⚠</span> {errorMsg}
                  </div>
                )}

                <div className="mt-5 flex items-center gap-4">
                  <button
                    onClick={handleSubmit}
                    disabled={status === 'sending'}
                    className="bg-[#0A2B4E] hover:bg-[#0d3a6b] disabled:opacity-60 disabled:cursor-not-allowed text-white font-bold px-8 py-3 rounded-xl transition-colors flex items-center gap-2">
                    {status === 'sending' ? (
                      <>
                        <svg className="animate-spin w-4 h-4" viewBox="0 0 24 24" fill="none">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"/>
                        </svg>
                        Envoi en cours…
                      </>
                    ) : (
                      'Envoyer le message →'
                    )}
                  </button>
                  <span className="text-xs text-slate-400">
                    Réponse sous 48h ouvrées
                  </span>
                </div>
              </>
            )}
          </div>
        </section>

        {/* ── 5. CRÉDITS LÉGAUX ── */}
        <section className="bg-slate-100 rounded-2xl border border-slate-200 p-6 text-sm text-slate-600 space-y-2">
          <p>
            <span className="font-semibold text-slate-800">© Idée & Concept</span>{' '}
            — Madame Rim Jalouli. Tous droits réservés. Toute utilisation, reproduction ou
            exploitation du concept, de la démarche et des contenus est soumise à autorisation
            préalable.
          </p>
          <p>
            <span className="font-semibold text-slate-800">
              © Conception, démarche éditoriale & consultation approfondie
            </span>{' '}
            — Mr Wahib Zaier.
          </p>
          <p className="text-xs text-slate-400 pt-1">
            Sources : Portulans Institute (NRI 2025), UIT, APII / Startup Tunisia, BCT, UN DESA,
            calculs internes IMNT.
          </p>
        </section>

      </main>

      {/* ── FOOTER ── */}
      <footer className="bg-slate-900 text-slate-400 py-10">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid md:grid-cols-3 gap-10 pb-8 border-b border-slate-800">
            <div>
              <div className="flex items-center gap-3 mb-3">
                <div className="w-8 h-8 rounded bg-[#D4AF37] flex items-center justify-center">
                  <span className="text-[#0A2B4E] font-black text-sm">T</span>
                </div>
                <div>
                  <div className="text-white font-black text-sm">Think Digital</div>
                  <div className="text-[#D4AF37] text-[10px] font-semibold tracking-widest uppercase">Think Tunisia</div>
                </div>
              </div>
              <p className="text-sm leading-relaxed text-slate-500">
                Là où les données dessinent l'avenir numérique de la Tunisie.
              </p>
            </div>
            <div>
              <p className="text-xs font-bold uppercase tracking-widest text-slate-600 mb-4">Navigation</p>
              <div className="flex flex-col gap-2 text-sm">
                {NAV_LINKS.map(l => (
                  <Link key={l.href} href={l.href} className="hover:text-white transition-colors">{l.label}</Link>
                ))}
              </div>
            </div>
            <div>
              <p className="text-xs font-bold uppercase tracking-widest text-slate-600 mb-4">Légal</p>
              <div className="flex flex-col gap-2 text-sm">
                {['Mentions légales', 'Confidentialité', 'Cookies'].map(l => (
                  <Link key={l} href="#" className="hover:text-white transition-colors">{l}</Link>
                ))}
              </div>
            </div>
          </div>
          <div className="pt-6 flex flex-col md:flex-row items-center justify-between gap-3 text-xs text-slate-600">
            <span>© 2025 Think Digital, Think Tunisia. Conçu avec rigueur en Tunisie.</span>
            <span>Sources : Portulans Institute (NRI 2025), UIT, APII, BCT, UN DESA.</span>
          </div>
        </div>
      </footer>
    </div>
  )
}