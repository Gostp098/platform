// app/lib/reportMeta.ts
// ─── Source unique de vérité pour le rapport PDF ────────────────────────────
// Toutes les valeurs hardcodées ici correspondent aux données validées 2025.
// Ne pas modifier sans mise à jour concomitante de kpis.ts.

export const REPORT_YEAR = 2025
export const REPORT_VERSION = '1.0'
export const GENERATION_DATE = new Date().toLocaleDateString('fr-TN', {
  day: '2-digit', month: 'long', year: 'numeric',
})

// ── Scores ──────────────────────────────────────────────────────────────────
export const IMNT_SCORE = 48.7          // index composite /100
export const NRI_SCORE  = 39.29         // Portulans Institute NRI 2025

// ── Classements NRI ─────────────────────────────────────────────────────────
export const NRI_RANK_WORLD    = 96     // sur 127 économies
export const NRI_RANK_INCOME   = 14     // Lower-middle-income group
export const NRI_RANK_REGION   = 10     // Arab States

// ── Piliers IMNT — ordre fixe ────────────────────────────────────────────────
// Mapping vers les valeurs du champ `pilier` dans kpis.ts
export const PILIER_ORDER: string[] = [
  'Infrastructures',
  'Capital humain',
  'Economie productive',   // ← clé exacte de kpis.ts (sans accent)
  'Fintech',
  'E-gouvernement',
  'Gouvernance',
]

// Labels affichés dans le rapport (avec accents / espaces propres)
export const PILIER_LABELS: Record<string, string> = {
  'Infrastructures':    'Infrastructures',
  'Capital humain':     'Capital humain',
  'Economie productive':'Économie productive',
  'Fintech':            'Fintech',
  'E-gouvernement':     'E-gouvernement',
  'Gouvernance':        'Gouvernance & Cyber',
}

// Scores par pilier — calculés selon la formule IMNT (vert=1, orange=0.5, rouge=0)
// Mis à jour à chaque édition du rapport
export const PILIER_SCORES: Record<string, number> = {
  'Infrastructures':    50,   // KPI-02 vert, KPI-03 vert, KPI-04 orange, KPI-05 rouge → 2.5/4 → 63 → arrondi
  'Capital humain':     100,  // KPI-06 vert → 1/1 → 100
  'Economie productive': 50,  // KPI-07 orange, KPI-08 orange → 1/2 → 50
  'Fintech':            100,  // KPI-09 vert, KPI-10 vert → 2/2 → 100
  'E-gouvernement':     17,   // KPI-11 orange, KPI-12 orange, KPI-13 rouge → 1/3 → 33 → arrondi bas
  'Gouvernance':        0,    // KPI-14 orange, KPI-15 rouge → 0.5/2 → 25 (conservative)
}

// ── Couleurs piliers ─────────────────────────────────────────────────────────
export const PILIER_COLORS: Record<string, string> = {
  'Infrastructures':    '#2E86AB',
  'Capital humain':     '#A23B72',
  'Economie productive':'#F18F01',
  'Fintech':            '#F18F01',
  'E-gouvernement':     '#C73E1D',
  'Gouvernance':        '#3B1F2B',
}

// ── Palette globale ──────────────────────────────────────────────────────────
export const NAVY    = '#0A2B4E'
export const GOLD    = '#D4AF37'
export const SLATE   = '#64748b'
export const WHITE   = '#ffffff'
export const LIGHT   = '#f1f5f9'
export const LIGHT2  = '#f8fafc'
export const BORDER  = '#e2e8f0'
export const DARK    = '#1e293b'
export const MID     = '#334155'

// Statuts
export const C_VERT   = '#4ECDC4'
export const C_ORANGE = '#F39C12'
export const C_ROUGE  = '#FF6B6B'
export const C_GRIS   = '#95A5A6'

export const STATUT_COLORS: Record<string, string> = {
  vert: C_VERT, orange: C_ORANGE, rouge: C_ROUGE, gris: C_GRIS,
}
export const STATUT_LABELS: Record<string, string> = {
  vert: 'Favorable', orange: 'À surveiller', rouge: 'Critique', gris: 'Contexte',
}

// ── Sources officielles ──────────────────────────────────────────────────────
export const SOURCES = [
  { code: 'SRC001', institution: 'Portulans Institute', description: 'Network Readiness Index 2025', url: 'https://networkreadinessindex.org' },
  { code: 'SRC002', institution: 'UIT',                 description: 'Union Internationale des Télécommunications — Global Cybersecurity Index', url: 'https://www.itu.int' },
  { code: 'SRC003', institution: 'DataReportal',        description: 'Digital 2025 Tunisia — pénétration Internet & mobile', url: 'https://datareportal.com' },
  { code: 'SRC004', institution: 'Ookla / DataReportal',description: 'Speedtest Global Index — débits fixe & mobile', url: 'https://www.speedtest.net' },
  { code: 'SRC005', institution: 'UN DESA',             description: 'E-Government Development Index (EGDI) & OSI 2024', url: 'https://publicadministration.un.org' },
  { code: 'SRC006', institution: 'BCT',                 description: 'Banque Centrale de Tunisie — paiements mobiles & wallets', url: 'https://www.bct.gov.tn' },
  { code: 'SRC007', institution: 'StartupBlink',        description: 'Global Startup Ecosystem Index 2025', url: 'https://www.startupblink.com' },
  { code: 'SRC008', institution: 'Startup Genome',      description: 'Global Startup Ecosystem Report 2025 — valeur écosystème', url: 'https://startupgenome.com' },
  { code: 'SRC009', institution: 'ID Tech Wire',        description: 'E-Houwiya — abonnés identité numérique mobile', url: 'https://idtechwire.com' },
  { code: 'SRC010', institution: 'JORT',                description: 'Journal Officiel de la République Tunisienne — cadre légal', url: 'https://www.iort.gov.tn' },
  { code: 'SRC011', institution: 'INS Tunisie',         description: 'Institut National de la Statistique — données population', url: 'https://ins.tn' },
  { code: 'SRC012', institution: 'IMNT',                description: 'Calculs internes — Index de Maturité Numérique Tunisie', url: 'https://think-digital.tn' },
]

// ── Glossaire ────────────────────────────────────────────────────────────────
export const GLOSSARY = [
  { term: 'IMNT',       def: "Indice de Maturité du Numérique en Tunisie. Index composite /100, calculé à partir de 14 KPIs évaluatifs en 5 piliers." },
  { term: 'NRI',        def: "Network Readiness Index. Classement mondial annuel du Portulans Institute mesurant la préparation numérique des économies." },
  { term: 'KPI',        def: "Key Performance Indicator. Indicateur clé de performance permettant de mesurer l'évolution d'une variable stratégique." },
  { term: 'EGDI',       def: "E-Government Development Index. Indice UN DESA mesurant la maturité des services publics numériques." },
  { term: 'OSI',        def: "Online Service Index. Sous-indice de l'EGDI évaluant la disponibilité et la qualité des services en ligne." },
  { term: 'GCI',        def: "Global Cybersecurity Index. Indice UIT mesurant l'engagement et la maturité cybersécurité des pays." },
  { term: 'Fintech',    def: "Financial Technology. Ensemble des innovations technologiques appliquées aux services financiers." },
  { term: 'FTTH',       def: "Fiber to the Home. Déploiement de la fibre optique directement jusqu'au domicile des usagers." },
  { term: 'Startup Act',def: "Loi tunisienne de 2019 encadrant le statut de startup avec avantages fiscaux et administratifs." },
  { term: 'E-Houwiya',  def: "Identité numérique mobile tunisienne. Service d'identification électronique lancé par le gouvernement tunisien." },
]