// app/components/pdf/ReportPDF.tsx
// ─── Rapport Annuel Économie Numérique Tunisie 2025 ─────────────────────────
// Architecture : 22 sections · @react-pdf/renderer
// Chaque section est un composant autonome → fichier facile à maintenir.
// Données : kpis.ts (source) + reportMeta.ts (scores, couleurs, meta)

import React from 'react'
import {
  Document, Page, Text, View, Link,
  StyleSheet,
} from '@react-pdf/renderer'
import { KPIS, KPI, AlertStatus } from '../../lib/kpis/kpis'
import {
  REPORT_YEAR, REPORT_VERSION, GENERATION_DATE,
  IMNT_SCORE, NRI_SCORE,
  NRI_RANK_WORLD, NRI_RANK_INCOME, NRI_RANK_REGION,
  PILIER_ORDER, PILIER_SCORES, PILIER_LABELS, PILIER_COLORS,
  NAVY, GOLD, SLATE, WHITE, LIGHT2, BORDER, MID,
  C_VERT, C_ORANGE, C_ROUGE,
  STATUT_COLORS, STATUT_LABELS,
  SOURCES, GLOSSARY,
} from '../../lib/reportMeta'
import { S } from './styles'
import { GaugeChart, RadarChart, BarChart } from './Charts'

// ─── HELPERS ─────────────────────────────────────────────────────────────────

const getStatutColor = (s: AlertStatus) => STATUT_COLORS[s] ?? STATUT_COLORS['gris']
const getStatutLabel = (s: AlertStatus) => STATUT_LABELS[s] ?? 'N/A'

// Piliers dans le bon ordre de rendu (mapping kpis.ts keys)
const RENDERED_PILIERS = [
  { key: 'Infrastructures',    num: '01' },
  { key: 'Capital humain',     num: '02' },
  { key: 'Economie productive',num: '03' },
  { key: 'Fintech',            num: '04' },
  { key: 'E-gouvernement',     num: '05' },
  { key: 'Gouvernance',        num: '06' },
]

// Analyses par pilier (texte validé — à remplacer par ai_outputs en production)
const PILIER_ANALYSES: Record<string, {
  constat: string
  forces: string[]
  faiblesses: string[]
  alerte: string
  recos: string[]
}> = {
  'Infrastructures': {
    constat: 'Le pilier Infrastructure présente une performance contrastée : la connectivité de base est solide (pénétration Internet 85%, 128 connexions mobiles/100 hab.), mais les débits restent insuffisants par rapport aux benchmarks régionaux.',
    forces: ['Pénétration Internet élevée (85% de la population)', 'Couverture mobile mature (128/100 hab.)'],
    faiblesses: ['Débit fixe médian critique (11,55 Mbps — sous le seuil vert de 30 Mbps)', 'Débit mobile en zone orange (26,56 Mbps)'],
    alerte: 'Le débit fixe est en zone ROUGE — risque de décrochage compétitif vis-à-vis des pays MENA.',
    recos: ['Accélérer le déploiement FTTH (fibre jusqu\'au domicile)', 'Lancer un appel d\'offres 5G pour densifier le réseau mobile', 'Subventionner les abonnements haut débit pour les ménages à faibles revenus'],
  },
  'Capital humain': {
    constat: 'L\'indice Human Capital Index de 0,8032 (UN DESA) place la Tunisie dans la catégorie des économies bien dotées en capital humain numérique.',
    forces: ['HCI de 0,8032 — au-dessus du seuil vert (0,75)', 'Jeunesse bilingue et filières ICT développées'],
    faiblesses: ['Fuite des cerveaux vers l\'Europe (non mesurée précisément)', 'Inadéquation partielle formation-marché'],
    alerte: 'La rétention des talents numériques est un enjeu stratégique non encore adressé par des politiques publiques ciblées.',
    recos: ['Créer des mécanismes de rétention des talents ICT (salaires compétitifs, avantages fiscaux)', 'Renforcer les partenariats universités-entreprises tech', 'Développer des filières IA et data science en licence et master'],
  },
  'Economie productive': {
    constat: 'L\'écosystème startup tunisien est dynamique avec un rang StartupBlink de 82e mondial, mais la valeur de l\'écosystème (241,5M USD) reste modeste.',
    forces: ['Rang StartupBlink dans la zone orange (82e — entre 60 et 100)', 'Startup Act offrant un cadre favorable'],
    faiblesses: ['Valeur écosystème tech 241,5M USD — croissance insuffisante', 'Accès limité au capital-risque international'],
    alerte: 'Sans accélération du financement, l\'écosystème risque de plafonner hors du Top 60 mondial.',
    recos: ['Créer un fonds de capital-risque public de 100M TND pour les deep tech', 'Faciliter l\'internationalisation des startups tunisiennes', 'Simplifier l\'accès aux marchés publics pour les startups'],
  },
  'Fintech': {
    constat: 'Le pilier Fintech affiche la meilleure performance avec 8,4M d\'opérations de paiement mobile et 815 000 wallets actifs en 2025.',
    forces: ['8,4M d\'opérations paiement mobile — croissance > 30%', '815 000 wallets actifs — indicateur favorable'],
    faiblesses: ['Taux de bancarisation encore insuffisant pour une adoption massive', 'Interopérabilité limitée entre les différents wallets'],
    alerte: 'Malgré les bons indicateurs, le potentiel d\'inclusion financière numérique est encore largement sous-exploité.',
    recos: ['Imposer l\'interopérabilité obligatoire entre wallets', 'Lancer des campagnes d\'éducation financière numérique', 'Développer les paiements gouvernementaux par mobile'],
  },
  'E-gouvernement': {
    constat: 'L\'EGDI de 0,6935 place la Tunisie dans la zone intermédiaire, avec un OSI de 0,5951 en zone orange et E-Houwiya en situation critique (200 000 abonnés).',
    forces: ['EGDI 0,6935 — zone orange haute', 'Présence de services en ligne pour les principales procédures'],
    faiblesses: ['E-Houwiya : 200 000 abonnés (ROUGE) vs objectif 1M', 'OSI 0,5951 — qualité des services en ligne insuffisante'],
    alerte: 'E-Houwiya est en échec opérationnel — adoption inférieure de 80% à l\'objectif gouvernemental.',
    recos: ['Plan marketing national E-Houwiya avec objectif 500k abonnés fin 2025', 'Intégrer E-Houwiya dans tous les services publics numériques', 'Améliorer l\'OSI via la refonte des 10 services les plus utilisés'],
  },
  'Gouvernance': {
    constat: 'Le GCI Tier 3 indique un engagement cybersécurité reconnu, mais la loi sur les données personnelles de 2004 constitue un blocage réglementaire majeur.',
    forces: ['GCI Tier 3 — niveau reconnu par l\'UIT', 'Cadre de signature électronique opérationnel'],
    faiblesses: ['Loi données personnelles de 2004 (ROUGE) — antérieure au RGPD', 'Absence de loi moderne sur la cybercriminalité'],
    alerte: 'La loi de 2004 bloque l\'alignement réglementaire avec l\'UE et freine les partenariats data avec les entreprises européennes.',
    recos: ['Adopter en urgence une loi sur la protection des données alignée RGPD', 'Monter au Tier 2 GCI d\'ici 2027', 'Créer une autorité indépendante de protection des données'],
  },
}

// ─── PAGE WRAPPER ─────────────────────────────────────────────────────────────
// Chaque page normale utilise ce wrapper qui inclut header + footer fixes.

function ReportPage({ children, style }: { children: React.ReactNode; style?: any }) {
  return (
    <Page size="A4" style={[S.page, style ?? {}]}>
      {/* ── Header ── */}
      <View style={S.pageHeader} fixed>
        <View style={S.headerLogo}>
          <Text style={S.headerLogoText}>T</Text>
        </View>
        <Text style={S.headerTitle}>
          Rapport Annuel — Économie Numérique en Tunisie {REPORT_YEAR}
        </Text>
        <Text
          style={S.headerPageNum}
          render={({ pageNumber }) => `${pageNumber}`}
        />
      </View>

      {/* ── Content ── */}
      {children}

      {/* ── Footer ── */}
      <View style={S.pageFooter} fixed>
        <Text style={S.footerLeft}>
          Source : Plateforme Think Digital, Think Tunisia
        </Text>
        <Text style={S.footerRight}>
          © Rim Jalouli · Conception : Wahib Zaier
        </Text>
      </View>
    </Page>
  )
}

// ─── S1. COVER PAGE ───────────────────────────────────────────────────────────

function CoverPage() {
  return (
    <Page size="A4" style={S.coverPage}>
      <View style={S.coverAccentBar} />
      <View style={S.coverContainer}>

        <Text style={S.coverTag}>
          Rapport Annuel de l'Économie Numérique en Tunisie
        </Text>

        <Text style={S.coverTitle1}>Think Digital,</Text>
        <Text style={S.coverTitle2}>Think Tunisia.</Text>

        <Text style={S.coverSubtitle}>
          Données validées · Édition {REPORT_YEAR} · Version {REPORT_VERSION}
        </Text>

        <View style={S.coverDivider} />

        {/* Score block */}
        <View style={S.coverScoreBox}>
          <View style={S.coverScoreItem}>
            <GaugeChart score={IMNT_SCORE} color={GOLD} size="sm" />
            <Text style={S.coverScoreLabel}>Score IMNT</Text>
          </View>

          <View style={S.coverSepLine} />

          <View style={S.coverScoreItem}>
            <Text style={S.coverScoreValue}>{NRI_SCORE}</Text>
            <Text style={S.coverScoreUnit}>/100</Text>
            <Text style={S.coverScoreLabel}>Score NRI 2025</Text>
          </View>

          <View style={S.coverSepLine} />

          <View style={S.coverScoreItem}>
            <Text style={S.coverScoreValueWhite}>{NRI_RANK_WORLD}e</Text>
            <Text style={S.coverScoreUnit}>sur 127 économies</Text>
            <Text style={S.coverScoreLabel}>Rang mondial</Text>
          </View>

          <View style={S.coverSepLine} />

          <View style={S.coverScoreItem}>
            <Text style={S.coverScoreValueWhite}>{NRI_RANK_REGION}e</Text>
            <Text style={S.coverScoreUnit}>Arab States</Text>
            <Text style={S.coverScoreLabel}>Rang région</Text>
          </View>
        </View>

        {/* Meta */}
        <View style={S.coverMeta}>
          <Text style={S.coverMetaText}>
            15 indicateurs clés · 5 piliers IMNT{'\n'}
            Sources : Portulans Institute, UIT, BCT, UN DESA, APII
          </Text>
          <Text style={S.coverMetaText}>
            Date de génération :{'\n'}{GENERATION_DATE}
          </Text>
        </View>

        <View style={S.coverGoldBar}>
          <Text style={S.coverFooterText}>
            © Idée & Concept : Madame Rim Jalouli — Tous droits réservés{'\n'}
            Conception éditoriale & consultation : Mr Wahib Zaier
          </Text>
        </View>
      </View>
    </Page>
  )
}

// ─── S2. INFORMATIONS INSTITUTIONNELLES ──────────────────────────────────────

function InstitutionalPage() {
  const rows = [
    ['Titre', `Rapport Annuel de l'Économie Numérique en Tunisie — Édition ${REPORT_YEAR}`],
    ['Statut', `Données validées · Version ${REPORT_VERSION}`],
    ['Date', GENERATION_DATE],
    ['Périmètre', '15 KPIs · 5 piliers IMNT · Sources officielles'],
    ['Copyright', '© Idée & Concept : Madame Rim Jalouli — Tous droits réservés'],
    ['Conception', 'Mr Wahib Zaier — Démarche éditoriale & consultation approfondie'],
    ['Public', 'Décideurs publics, investisseurs, chercheurs, médias, organisations internationales'],
    ['Diffusion', 'Think Digital, Think Tunisia · think-digital.tn'],
  ]

  return (
    <ReportPage>
      <Text style={S.partLabel}>Partie I — Identité & Contexte</Text>
      <Text style={S.h1}>Informations institutionnelles</Text>
      <View style={S.dividerGold} />

      <View style={S.tableContainer}>
        {rows.map(([label, value], i) => (
          <View key={label} style={[S.tableRow, i % 2 === 1 ? S.tableRowAlt : {}]}>
            <Text style={[S.tableCell, { width: 110, fontFamily: 'Helvetica-Bold', color: NAVY }]}>
              {label}
            </Text>
            <Text style={[S.tableCell, { flex: 1 }]}>{value}</Text>
          </View>
        ))}
      </View>

      <View style={S.spacer16} />
      <Text style={[S.small, { fontStyle: 'italic' }]}>
        Toute utilisation, reproduction ou exploitation du concept, de la démarche et des contenus
        de cette plateforme est soumise à autorisation préalable de Madame Rim Jalouli.
      </Text>
    </ReportPage>
  )
}

// ─── S3. TABLE DES MATIÈRES ───────────────────────────────────────────────────
// Pages numérotées manuellement (approximation correcte pour 10 pages A4)

function TOCPage() {
  const sections = [
    { part: 'Partie I — Identité & Contexte', items: [] },
    { label: '1. Page de couverture', page: '1' },
    { label: '2. Informations institutionnelles', page: '2' },
    { label: '3. Table des matières', page: '3' },
    { label: '4. Liste des figures', page: '4' },
    { label: '5. Liste des tableaux', page: '4' },
    { part: 'Partie II — Synthèse & Stratégie', items: [] },
    { label: '6. Résumé exécutif', page: '5' },
    { label: '7. Introduction', page: '6' },
    { label: '8. Objectifs du rapport', page: '6' },
    { label: '9. Méthodologie', page: '7' },
    { part: "Partie III — L'Index IMNT", items: [] },
    { label: '10. Score IMNT global', page: '8' },
    { label: '11. Analyse par pilier (6 piliers)', page: '8' },
    { label: '12. Graphique radar & barres comparatifs', page: '9' },
    { part: 'Partie IV — Analyse détaillée des KPI', items: [] },
    { label: '13. Fiches détaillées des 15 KPI', page: '10' },
    { label: '14. Tableau récapitulatif des KPI', page: '16' },
    { part: 'Partie V — Alertes & Recommandations', items: [] },
    { label: '15. Alertes prioritaires', page: '17' },
    { label: '16. Recommandations à court terme (0–12 mois)', page: '18' },
    { label: '17. Recommandations à moyen terme (1–3 ans)', page: '18' },
    { label: '18. Recommandations à long terme (3–5 ans)', page: '19' },
    { part: 'Partie VI — Annexes techniques', items: [] },
    { label: '19. Catalogue des KPI', page: '20' },
    { label: '20. Sources et références', page: '21' },
    { label: '21. Glossaire', page: '22' },
    { label: '22. Limites méthodologiques', page: '22' },
  ]

  return (
    <ReportPage>
      <Text style={S.partLabel}>Partie I — Identité & Contexte</Text>
      <Text style={S.h1}>Table des matières</Text>
      <View style={S.dividerGold} />

      {sections.map((item, i) => {
        if ('part' in item && item.part) {
          return (
            <View key={i} style={S.tocPartRow}>
              <Text style={S.tocPartLabel}>{item.part}</Text>
            </View>
          )
        }
        if ('label' in item && item.label) {
          return (
            <View key={i} style={S.tocRow}>
              <Text style={S.tocLabel}>{item.label}</Text>
              <Text style={S.tocPage}>{(item as any).page}</Text>
            </View>
          )
        }
        return null
      })}
    </ReportPage>
  )
}

// ─── S4-5. LISTE FIGURES & TABLEAUX ──────────────────────────────────────────

function ListsFiguresTablesPage() {
  const figures = [
    'Figure 1 — Jauge IMNT global (score 48,7/100) · p.8',
    'Figure 2 — Jauges par pilier IMNT (6 piliers) · p.8',
    'Figure 3 — Graphique radar des 5 axes IMNT · p.9',
    'Figure 4 — Graphique en barres des scores par pilier · p.9',
  ]
  const tables = [
    'Tableau 1 — Informations institutionnelles · p.2',
    'Tableau 2 — Scores IMNT par pilier · p.8',
    'Tableau 3 — Récapitulatif des 15 KPI · p.16',
    'Tableau 4 — Alertes prioritaires (KPI rouge/orange) · p.17',
    'Tableau 5 — Catalogue complet des KPI · p.20',
    'Tableau 6 — Sources et références (SRC001–SRC012) · p.21',
  ]

  return (
    <ReportPage>
      <Text style={S.h2}>Liste des figures</Text>
      {figures.map((f, i) => (
        <Text key={i} style={S.small}>• {f}</Text>
      ))}
      <View style={S.spacer16} />
      <Text style={S.h2}>Liste des tableaux</Text>
      {tables.map((t, i) => (
        <Text key={i} style={S.small}>• {t}</Text>
      ))}
    </ReportPage>
  )
}

// ─── S6. RÉSUMÉ EXÉCUTIF ──────────────────────────────────────────────────────

function ExecutiveSummaryPage() {
  const critiques = KPIS.filter(k => k.statut === 'rouge')
  const topOrange = KPIS.filter(k => k.statut === 'orange').slice(0, 2)

  return (
    <ReportPage>
      <Text style={S.partLabel}>Partie II — Synthèse & Stratégie</Text>
      <Text style={S.h1}>Résumé exécutif</Text>
      <View style={S.dividerGold} />

      {/* Score résumé */}
      <View style={{ flexDirection: 'row', gap: 10, marginBottom: 12 }}>
        {[
          { val: `${IMNT_SCORE}`, unit: '/100', label: 'Score IMNT' },
          { val: `${NRI_SCORE}`, unit: '/100', label: 'Score NRI 2025' },
          { val: `${NRI_RANK_WORLD}e`, unit: 'sur 127', label: 'Rang mondial NRI' },
          { val: `${NRI_RANK_REGION}e`, unit: 'Arab States', label: 'Rang région' },
        ].map(({ val, unit, label }) => (
          <View key={label} style={[S.scoreBlock, { flex: 1 }]}>
            <Text style={S.scoreValue}>{val}</Text>
            <Text style={S.scoreUnit}>{unit}</Text>
            <Text style={S.scoreLabel}>{label}</Text>
          </View>
        ))}
      </View>

      <Text style={S.body}>
        La Tunisie affiche un score IMNT de <Text style={{ fontFamily: 'Helvetica-Bold' }}>{IMNT_SCORE}/100</Text> en {REPORT_YEAR},
        reflétant une performance numérique intermédiaire dans un contexte régional compétitif.
        Le capital humain et la Fintech constituent les piliers les plus solides,
        tandis que la gouvernance numérique et l'e-gouvernement restent des leviers à activer en priorité.
      </Text>

      {/* Alertes */}
      <Text style={S.h3}>⚠ Trois alertes majeures</Text>
      {[...critiques, ...topOrange].slice(0, 3).map(k => (
        <View key={k.id} style={k.statut === 'rouge' ? S.alertBoxRouge : S.alertBoxOrange}>
          <View style={S.alertBox}>
            <View style={{ flex: 1 }}>
              <Text style={[S.alertTitle, { color: getStatutColor(k.statut as AlertStatus) }]}>
                {k.id} — {k.nom}
              </Text>
              <Text style={S.alertBody}>{k.recommandation}</Text>
            </View>
          </View>
        </View>
      ))}

      {/* Recommandations */}
      <Text style={S.h3}>✅ Trois recommandations prioritaires</Text>
      {[
        'Lancer un plan marketing national pour E-Houwiya avec objectif 500k abonnés d\'ici fin 2025.',
        'Accélérer le déploiement FTTH et adopter la loi sur la protection des données personnelles.',
        'Consolider la Fintech en imposant l\'interopérabilité des wallets et en élargissant l\'inclusion financière.',
      ].map((r, i) => (
        <View key={i} style={S.recoItem}>
          <Text style={S.recoText}>→ {r}</Text>
        </View>
      ))}
    </ReportPage>
  )
}

// ─── S7-9. INTRO + OBJECTIFS + MÉTHODOLOGIE ───────────────────────────────────

function IntroMethodoPage() {
  return (
    <ReportPage>
      {/* S7 — Introduction */}
      <Text style={S.h1}>Introduction</Text>
      <View style={S.divider} />
      <Text style={S.body}>
        La transformation numérique de la Tunisie s'accélère, portée par un écosystème de plus de 1 400 startups,
        un Human Capital Index de 0,8032 et une pénétration Internet dépassant 85% de la population.
        Ce rapport constitue un miroir précis de l'état de l'économie numérique nationale, à travers
        15 indicateurs clés organisés en 5 piliers stratégiques composant l'IMNT 2025.
      </Text>
      <Text style={S.body}>
        La méthodologie repose sur une triple approche innovante : extraction automatisée de données
        officielles, calcul de l'index composite IMNT, et validation humaine systématique des analyses
        générées par IA. Aucun contenu n'est publié sans contrôle éditorial rigoureux.
      </Text>

      {/* S8 — Objectifs */}
      <Text style={S.h2}>Objectifs du rapport</Text>
      {[
        { icon: '📐', title: 'Mesurer', body: 'Des données sourcées, jamais des impressions. Agréger des indicateurs officiels (BCT, UIT, UN DESA) avec une méthodologie transparente et une date de fraîcheur affichée.' },
        { icon: '🔬', title: 'Analyser', body: 'L\'IA au service de l\'expertise. Générer des analyses et recommandations — zéro invention, zéro hallucination. Validation humaine systématique.' },
        { icon: '🎯', title: 'Décider', body: 'Un référentiel pour agir. Fournir aux investisseurs, décideurs et chercheurs les arguments chiffrés pour orienter leurs stratégies et politiques.' },
      ].map(({ icon, title, body }) => (
        <View key={title} style={{ flexDirection: 'row', marginBottom: 8, gap: 8, backgroundColor: LIGHT2, borderRadius: 4, padding: 8, borderLeftWidth: 2, borderLeftColor: NAVY }}>
          <Text style={{ fontSize: 14 }}>{icon}</Text>
          <View style={{ flex: 1 }}>
            <Text style={[S.h3, { marginTop: 0 }]}>{title}</Text>
            <Text style={S.small}>{body}</Text>
          </View>
        </View>
      ))}

      {/* S9 — Méthodologie */}
      <Text style={S.h2}>Méthodologie</Text>
      <Text style={S.body}>
        Le cycle de production suit 5 étapes : <Text style={{ fontFamily: 'Helvetica-Bold' }}>(1)</Text> extraction
        des données depuis les sources officielles ; <Text style={{ fontFamily: 'Helvetica-Bold' }}>(2)</Text> validation
        et normalisation des valeurs ; <Text style={{ fontFamily: 'Helvetica-Bold' }}>(3)</Text> calcul de l'IMNT
        (formule : vert=1 pt, orange=0,5 pt, rouge=0 pt, score=somme/nb KPIs×100) ;{' '}
        <Text style={{ fontFamily: 'Helvetica-Bold' }}>(4)</Text> génération des analyses par IA ;{' '}
        <Text style={{ fontFamily: 'Helvetica-Bold' }}>(5)</Text> validation humaine et publication.
      </Text>
      <Text style={[S.small, { fontStyle: 'italic' }]}>
        Gestion des millésimes : l'année du rapport est {REPORT_YEAR}, mais certaines données (EGDI 2024, GCI 2024)
        correspondent à l'année de publication des sources. Chaque KPI précise l'année de la donnée utilisée.
      </Text>
    </ReportPage>
  )
}

// ─── S10-12. SCORE IMNT + PILIERS + GRAPHIQUES ────────────────────────────────

function IMNTScorePage() {
  return (
    <ReportPage>
      <Text style={S.partLabel}>Partie III — L'Index IMNT</Text>
      <Text style={S.h1}>Score IMNT global</Text>
      <View style={S.dividerGold} />

      {/* Score central + NRI grid */}
      <View style={{ flexDirection: 'row', gap: 14, marginBottom: 14 }}>
        {/* Gauge */}
        <View style={[S.scoreBlock, { width: 160, alignItems: 'center' }]}>
          <GaugeChart score={IMNT_SCORE} color={GOLD} size="lg" />
          <Text style={S.scoreLabel}>Indice IMNT {REPORT_YEAR}</Text>
          <Text style={[S.small, { textAlign: 'center', marginTop: 4 }]}>
            Performance intermédiaire
          </Text>
        </View>
        {/* NRI stats */}
        <View style={{ flex: 1 }}>
          <Text style={S.h3}>Classement NRI 2025 (Portulans Institute)</Text>
          <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 6, marginTop: 4 }}>
            {[
              { val: `${NRI_SCORE}`, sub: '/100', label: 'Score NRI global' },
              { val: `${NRI_RANK_WORLD}e`, sub: 'sur 127', label: 'Rang mondial' },
              { val: `${NRI_RANK_INCOME}e`, sub: 'Lower-middle', label: 'Rang groupe' },
              { val: `${NRI_RANK_REGION}e`, sub: 'Arab States', label: 'Rang région' },
            ].map(({ val, sub, label }) => (
              <View key={label} style={[S.nriCell, { width: '45%' }]}>
                <Text style={S.nriValue}>{val}</Text>
                <Text style={S.nriSub}>{sub}</Text>
                <Text style={S.nriLabel}>{label}</Text>
              </View>
            ))}
          </View>
        </View>
      </View>

      {/* Pilier scores */}
      <Text style={S.h2}>Analyse par pilier</Text>
      {RENDERED_PILIERS.map(({ key, num }, idx) => {
        const score = PILIER_SCORES[key] ?? 0
        const color = PILIER_COLORS[key] ?? NAVY
        const label = PILIER_LABELS[key] ?? key
        const analysis = PILIER_ANALYSES[key]
        if (!analysis) return null
        return (
          <View key={key} style={S.pilierCard} wrap={false}>
            <View style={[S.pilierCardHeader, { backgroundColor: color }]}>
              <Text style={S.pilierCardNum}>{num}</Text>
              <Text style={S.pilierCardLabel}>{label}</Text>
              <Text style={S.pilierCardScore}>{score}</Text>
              <Text style={S.pilierCardScoreUnit}>/100</Text>
            </View>
            <View style={S.pilierCardBody}>
              <Text style={S.pilierCardConstat}>{analysis.constat}</Text>
              <Text style={S.pilierCardForces}>
                ✓ {analysis.forces.join(' · ')}
              </Text>
              <Text style={S.pilierCardFaiblesses}>
                ✗ {analysis.faiblesses.join(' · ')}
              </Text>
              <Text style={S.pilierCardAlerte}>⚠ {analysis.alerte}</Text>
            </View>
          </View>
        )
      })}
    </ReportPage>
  )
}

function ChartsPage() {
  return (
    <ReportPage>
      <Text style={S.h1}>Graphiques comparatifs des piliers</Text>
      <View style={S.dividerGold} />
      <Text style={S.body}>
        Le radar et le graphique en barres ci-dessous comparent les 6 piliers de l'IMNT sur une échelle de 0 à 100.
        La ligne pointillée à 50 représente le seuil de performance intermédiaire.
      </Text>
      <View style={{ flexDirection: 'row', gap: 20, marginTop: 12, justifyContent: 'center', alignItems: 'flex-start' }}>
        <View style={{ alignItems: 'center' }}>
          <RadarChart />
          <Text style={[S.small, { textAlign: 'center', marginTop: 4 }]}>
            Figure 3 — Radar IMNT 2025
          </Text>
        </View>
        <View style={{ alignItems: 'center', justifyContent: 'center', marginTop: 20 }}>
          <BarChart />
          <Text style={[S.small, { textAlign: 'center', marginTop: 4 }]}>
            Figure 4 — Scores par pilier
          </Text>
        </View>
      </View>
    </ReportPage>
  )
}

// ─── S13. FICHES KPI ──────────────────────────────────────────────────────────

function KPICard({ kpi }: { kpi: KPI }) {
  const statColor = getStatutColor(kpi.statut)
  const statLabel = getStatutLabel(kpi.statut)

  return (
    <View style={S.kpiCard} wrap={false}>
      {/* Header */}
      <View style={S.kpiHeader}>
        <Text style={S.kpiHeaderId}>{kpi.id}</Text>
        <Text style={S.kpiHeaderName}>{kpi.nom}</Text>
        <Text style={S.kpiHeaderPilier}>{kpi.pilier}</Text>
      </View>

      {/* Body */}
      <View style={S.kpiBody}>
        {/* Left: value + statut */}
        <View style={S.kpiValueCol}>
          <Text style={S.kpiValue}>{kpi.valeur}</Text>
          <Text style={S.kpiUnit}>{kpi.unite}</Text>
          <Text style={[S.small, { textAlign: 'center', marginTop: 2 }]}>{kpi.annee}</Text>
          <View style={[S.kpiStatutBadge, { backgroundColor: statColor, marginTop: 6 }]}>
            <Text style={S.kpiStatutText}>{statLabel}</Text>
          </View>
        </View>

        {/* Right: details */}
        <View style={S.kpiDetailsCol}>
          <Text style={S.kpiFieldLabel}>Définition</Text>
          <Text style={S.kpiFieldValue}>{kpi.definition}</Text>

          {kpi.seuil_vert && (
            <>
              <Text style={S.kpiFieldLabel}>Seuils</Text>
              <View style={S.kpiSeuilRow}>
                {kpi.seuil_vert  && <Text style={[S.kpiSeuilPill, { backgroundColor: '#d1fae5', color: '#065f46', fontSize: 7 }]}>✓ {kpi.seuil_vert}</Text>}
                {kpi.seuil_orange && <Text style={[S.kpiSeuilPill, { backgroundColor: '#fff7ed', color: '#92400e', fontSize: 7 }]}>⚡ {kpi.seuil_orange}</Text>}
                {kpi.seuil_rouge  && <Text style={[S.kpiSeuilPill, { backgroundColor: '#fef2f2', color: '#7f1d1d', fontSize: 7 }]}>✗ {kpi.seuil_rouge}</Text>}
              </View>
            </>
          )}

          <Text style={S.kpiFieldLabel}>Source</Text>
          <Text style={S.kpiFieldValue}>{kpi.source} · {kpi.annee}</Text>
          {kpi.url ? (
            <Link src={kpi.url} style={[S.small, { color: '#2563eb' }]}>{kpi.url}</Link>
          ) : null}
        </View>
      </View>

      {/* Recommendation */}
      <View style={S.kpiRecoBox}>
        <Text style={S.kpiRecoLabel}>💡 Recommandation :</Text>
        <Text style={S.kpiRecoText}>{kpi.recommandation}</Text>
      </View>
    </View>
  )
}

function KPIDetailsPage() {
  return (
    <ReportPage>
      <Text style={S.partLabel}>Partie IV — Analyse détaillée des KPI</Text>
      <Text style={S.h1}>Fiches détaillées des 15 KPI</Text>
      <View style={S.dividerGold} />
      {KPIS.map(kpi => <KPICard key={kpi.id} kpi={kpi} />)}
    </ReportPage>
  )
}

// ─── S14. TABLEAU RÉCAPITULATIF ───────────────────────────────────────────────

function KPISummaryTablePage() {
  const cols = [
    { label: 'ID',         flex: 0.7 },
    { label: 'Indicateur', flex: 2.5 },
    { label: 'Valeur',     flex: 1.2 },
    { label: 'Unité',      flex: 1.2 },
    { label: 'Source',     flex: 1.5 },
    { label: 'Année',      flex: 0.7 },
    { label: 'Statut',     flex: 1.2 },
  ]

  return (
    <ReportPage>
      <Text style={S.h1}>Tableau récapitulatif des 15 KPI</Text>
      <View style={S.dividerGold} />
      <View style={S.tableContainer}>
        {/* header */}
        <View style={S.tableHeaderRow}>
          {cols.map(c => (
            <Text key={c.label} style={[S.tableHeaderCell, { flex: c.flex }]}>{c.label}</Text>
          ))}
        </View>
        {/* rows */}
        {KPIS.map((k, i) => (
          <View key={k.id} style={[S.tableRow, i % 2 === 1 ? S.tableRowAlt : {}]}>
            <Text style={[S.tableCell, { flex: 0.7, fontFamily: 'Helvetica-Bold', color: NAVY }]}>{k.id}</Text>
            <Text style={[S.tableCell, { flex: 2.5 }]}>{k.nom}</Text>
            <Text style={[S.tableCell, { flex: 1.2, fontFamily: 'Helvetica-Bold' }]}>{k.valeur}</Text>
            <Text style={[S.tableCell, { flex: 1.2 }]}>{k.unite}</Text>
            <Text style={[S.tableCell, { flex: 1.5 }]}>{k.source}</Text>
            <Text style={[S.tableCell, { flex: 0.7 }]}>{k.annee}</Text>
            <Text style={[S.tableCell, { flex: 1.2, fontFamily: 'Helvetica-Bold', color: getStatutColor(k.statut) }]}>
              {getStatutLabel(k.statut)}
            </Text>
          </View>
        ))}
      </View>
    </ReportPage>
  )
}

// ─── S15-18. ALERTES & RECOMMANDATIONS ───────────────────────────────────────

function AlertsRecoPage() {
  const rouge  = KPIS.filter(k => k.statut === 'rouge')
  const orange = KPIS.filter(k => k.statut === 'orange')

  const recos = {
    court: [
      { pilier: 'E-gouv.', text: 'Lancer un plan marketing national E-Houwiya — objectif 500k abonnés fin 2025.' },
      { pilier: 'Infra.', text: 'Lancer un appel d\'offres 5G et un programme FTTH subventionné.' },
      { pilier: 'Gouv.', text: 'Soumettre en urgence le projet de loi sur la protection des données personnelles.' },
      { pilier: 'Fintech', text: 'Imposer l\'interopérabilité entre wallets numériques.' },
    ],
    moyen: [
      { pilier: 'Infra.', text: 'Atteindre 30 Mbps médian fixe et 50 Mbps médian mobile d\'ici 2027.' },
      { pilier: 'Écon.', text: 'Créer un fonds de capital-risque public de 100M TND dédié aux deep tech.' },
      { pilier: 'E-gouv.', text: 'Refondre les 10 services administratifs les plus utilisés sur plateforme unique.' },
      { pilier: 'Cap. hum.', text: 'Mettre en place des mécanismes de rétention des talents ICT.' },
    ],
    long: [
      { pilier: 'Stratégie', text: 'Adopter une stratégie numérique nationale 2030 avec objectifs IMNT chiffrés.' },
      { pilier: 'Écon.', text: 'Positionner la Tunisie dans le Top 50 StartupBlink mondial d\'ici 2030.' },
      { pilier: 'Gouv.', text: 'Atteindre le niveau 5/5 de maturité juridique, aligné avec les standards UE.' },
      { pilier: 'Fintech', text: 'Atteindre 2M de wallets actifs et 50% de la population bancarisée numériquement.' },
    ],
  }

  return (
    <ReportPage>
      <Text style={S.partLabel}>Partie V — Alertes & Recommandations</Text>
      <Text style={S.h1}>Alertes prioritaires</Text>
      <View style={S.dividerGold} />

      {/* Critiques */}
      {rouge.length > 0 && (
        <>
          <Text style={[S.h3, { color: C_ROUGE }]}>🔴 KPI Critiques</Text>
          {rouge.map(k => (
            <View key={k.id} style={[S.alertBox, S.alertBoxRouge]}>
              <View style={{ flex: 1 }}>
                <Text style={[S.alertTitle, { color: C_ROUGE }]}>{k.id} — {k.nom} : {k.valeur} {k.unite}</Text>
                <Text style={S.alertBody}>{k.recommandation}</Text>
              </View>
            </View>
          ))}
        </>
      )}

      {/* À surveiller */}
      {orange.length > 0 && (
        <>
          <Text style={[S.h3, { color: C_ORANGE, marginTop: 10 }]}>🟠 KPI à surveiller</Text>
          {orange.map(k => (
            <View key={k.id} style={[S.alertBox, S.alertBoxOrange]}>
              <View style={{ flex: 1 }}>
                <Text style={[S.alertTitle, { color: C_ORANGE }]}>{k.id} — {k.nom} : {k.valeur} {k.unite}</Text>
                <Text style={S.alertBody}>{k.recommandation}</Text>
              </View>
            </View>
          ))}
        </>
      )}

      {/* Court terme */}
      <Text style={[S.h2, { marginTop: 14 }]}>Recommandations à court terme (0–12 mois)</Text>
      {recos.court.map((r, i) => (
        <View key={i} style={S.recoItem}>
          <Text style={S.recoPilierTag}>{r.pilier}</Text>
          <Text style={S.recoText}>{r.text}</Text>
        </View>
      ))}

      {/* Moyen terme */}
      <Text style={S.h2}>Recommandations à moyen terme (1–3 ans)</Text>
      {recos.moyen.map((r, i) => (
        <View key={i} style={S.recoItem}>
          <Text style={S.recoPilierTag}>{r.pilier}</Text>
          <Text style={S.recoText}>{r.text}</Text>
        </View>
      ))}

      {/* Long terme */}
      <Text style={S.h2}>Recommandations à long terme (3–5 ans)</Text>
      {recos.long.map((r, i) => (
        <View key={i} style={S.recoItem}>
          <Text style={S.recoPilierTag}>{r.pilier}</Text>
          <Text style={S.recoText}>{r.text}</Text>
        </View>
      ))}
    </ReportPage>
  )
}

// ─── S19. CATALOGUE KPI ───────────────────────────────────────────────────────

function KPICataloguePage() {
  return (
    <ReportPage>
      <Text style={S.partLabel}>Partie VI — Annexes techniques</Text>
      <Text style={S.h1}>Catalogue des KPI</Text>
      <View style={S.dividerGold} />
      <View style={S.tableContainer}>
        <View style={S.tableHeaderRow}>
          {['ID', 'Nom', 'Pilier', 'Unité', 'Seuil vert', 'Source'].map((h, i) => (
            <Text key={h} style={[S.tableHeaderCell, { flex: [0.6,2,1.2,1,2,1.2][i] }]}>{h}</Text>
          ))}
        </View>
        {KPIS.map((k, i) => (
          <View key={k.id} style={[S.tableRow, i % 2 === 1 ? S.tableRowAlt : {}]}>
            <Text style={[S.tableCell, { flex: 0.6, fontFamily: 'Helvetica-Bold', color: NAVY, fontSize: 7.5 }]}>{k.id}</Text>
            <Text style={[S.tableCell, { flex: 2, fontSize: 7.5 }]}>{k.nom}</Text>
            <Text style={[S.tableCell, { flex: 1.2, fontSize: 7.5 }]}>{k.pilier}</Text>
            <Text style={[S.tableCell, { flex: 1, fontSize: 7.5 }]}>{k.unite}</Text>
            <Text style={[S.tableCell, { flex: 2, fontSize: 7.5, color: '#065f46' }]}>{k.seuil_vert ?? '—'}</Text>
            <Text style={[S.tableCell, { flex: 1.2, fontSize: 7.5 }]}>{k.source}</Text>
          </View>
        ))}
      </View>
    </ReportPage>
  )
}

// ─── S20. SOURCES ─────────────────────────────────────────────────────────────

function SourcesPage() {
  return (
    <ReportPage>
      <Text style={S.h1}>Sources et références</Text>
      <View style={S.dividerGold} />
      <View style={S.tableContainer}>
        <View style={S.tableHeaderRow}>
          {['Code', 'Institution', 'Description', 'URL'].map((h, i) => (
            <Text key={h} style={[S.tableHeaderCell, { flex: [0.7,1.3,2.5,2][i] }]}>{h}</Text>
          ))}
        </View>
        {SOURCES.map((s, i) => (
          <View key={s.code} style={[S.tableRow, i % 2 === 1 ? S.tableRowAlt : {}]}>
            <Text style={[S.tableCell, { flex: 0.7, fontFamily: 'Helvetica-Bold', color: NAVY, fontSize: 7.5 }]}>{s.code}</Text>
            <Text style={[S.tableCell, { flex: 1.3, fontFamily: 'Helvetica-Bold', fontSize: 7.5 }]}>{s.institution}</Text>
            <Text style={[S.tableCell, { flex: 2.5, fontSize: 7.5 }]}>{s.description}</Text>
            <Link src={s.url} style={[S.tableCell, { flex: 2, fontSize: 7, color: '#2563eb' }]}>{s.url}</Link>
          </View>
        ))}
      </View>
    </ReportPage>
  )
}

// ─── S21-22. GLOSSAIRE + LIMITES ─────────────────────────────────────────────

function GlossaryLimitsPage() {
  const limits = [
    'Certaines données (EGDI 2024, GCI 2024) ont un décalage d\'un an par rapport à l\'édition du rapport.',
    'Les scores par pilier IMNT sont calculés sur 1 à 4 KPIs selon les piliers — une base élargie améliorerait la précision.',
    'Le score IMNT utilise une pondération uniforme ; une pondération différenciée par importance stratégique est en cours d\'étude.',
    'Certaines données (levées de fonds, valorisation startups) ne sont pas publiées de manière systématique.',
    'La comparaison inter-annuelle est limitée — l\'édition 2025 est la première avec cette méthodologie.',
  ]

  return (
    <ReportPage>
      {/* Glossaire */}
      <Text style={S.h1}>Glossaire</Text>
      <View style={S.dividerGold} />
      {GLOSSARY.map(({ term, def }) => (
        <View key={term} style={{ marginBottom: 5 }}>
          <Text style={S.body}>
            <Text style={{ fontFamily: 'Helvetica-Bold', color: NAVY }}>{term} : </Text>
            {def}
          </Text>
        </View>
      ))}

      {/* Limites */}
      <Text style={[S.h1, { marginTop: 20 }]}>Limites méthodologiques</Text>
      <View style={S.divider} />
      {limits.map((l, i) => (
        <Text key={i} style={[S.body, { paddingLeft: 10 }]}>• {l}</Text>
      ))}

      {/* Signature finale */}
      <View style={[S.dividerGold, { marginTop: 20 }]} />
      <Text style={[S.small, { textAlign: 'center', fontStyle: 'italic' }]}>
        Rapport généré le {GENERATION_DATE} · Think Digital, Think Tunisia{'\n'}
        © Idée & Concept : Rim Jalouli · Conception éditoriale : Wahib Zaier
      </Text>
    </ReportPage>
  )
}

// ─── DOCUMENT PRINCIPAL ───────────────────────────────────────────────────────
// Toutes les 22 sections dans l'ordre. Chaque "Page" = composant autonome.

export function ReportPDF() {
  return (
    <Document
      title={`Rapport Annuel Économie Numérique Tunisie ${REPORT_YEAR}`}
      author="Think Digital, Think Tunisia"
      subject={`IMNT ${REPORT_YEAR} — 15 KPIs · 5 Piliers`}
      creator="Plateforme Think Digital, Think Tunisia"
      producer="@react-pdf/renderer"
    >
      {/* S1 */}
      <CoverPage />
      {/* S2 */}
      <InstitutionalPage />
      {/* S3 */}
      <TOCPage />
      {/* S4-5 */}
      <ListsFiguresTablesPage />
      {/* S6 */}
      <ExecutiveSummaryPage />
      {/* S7-9 */}
      <IntroMethodoPage />
      {/* S10-11 */}
      <IMNTScorePage />
      {/* S12 */}
      <ChartsPage />
      {/* S13 */}
      <KPIDetailsPage />
      {/* S14 */}
      <KPISummaryTablePage />
      {/* S15-18 */}
      <AlertsRecoPage />
      {/* S19 */}
      <KPICataloguePage />
      {/* S20 */}
      <SourcesPage />
      {/* S21-22 */}
      <GlossaryLimitsPage />
    </Document>
  )
}
