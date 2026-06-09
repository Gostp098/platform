import {
  Document, Page, Text, View, StyleSheet, Image, Font,
  Svg, Circle, Path, G, Line, Rect, Polygon,
} from '@react-pdf/renderer';
import { KPIS, KPI, AlertStatus } from '../lib/kpis/kpis';
import { IMNT_SCORE, PILIER_SCORES, PILIER_ORDER, NAVY, GOLD, SLATE, WHITE, LIGHT, C_VERT, C_ORANGE, C_ROUGE, C_GRIS } from '../lib/reportMeta';

// Register a font (optional – Helvetica is default)
Font.register({ family: 'Helvetica', fonts: [{ src: 'https://fonts.gstatic.com/...' }] });

// Styles
const styles = StyleSheet.create({
  page: { padding: 40, fontFamily: 'Helvetica', backgroundColor: WHITE },
  coverPage: { backgroundColor: NAVY, padding: 40 },
  coverTitle: { fontSize: 30, color: GOLD, textAlign: 'center', marginTop: 200 },
  coverSub: { fontSize: 16, color: WHITE, textAlign: 'center', marginTop: 20 },
  coverScore: { fontSize: 48, color: GOLD, textAlign: 'center', marginTop: 40 },
  coverScoreLabel: { fontSize: 12, color: WHITE, textAlign: 'center' },
  sectionTitle: { fontSize: 18, color: NAVY, marginTop: 20, marginBottom: 10, fontWeight: 'bold' },
  subsectionTitle: { fontSize: 14, color: NAVY, marginTop: 15, marginBottom: 6, fontWeight: 'bold' },
  bodyText: { fontSize: 10, color: SLATE, marginBottom: 8, lineHeight: 1.4, textAlign: 'justify' },
  smallText: { fontSize: 8, color: SLATE, marginBottom: 4 },

  // KPI Card
  kpiCard: { marginBottom: 15, borderWidth: 1, borderColor: '#e2e8f0', borderRadius: 6, overflow: 'hidden' },
  kpiHeader: { backgroundColor: NAVY, padding: 8, flexDirection: 'row', justifyContent: 'space-between' },
  kpiId: { color: WHITE, fontSize: 10, fontWeight: 'bold' },
  kpiName: { color: WHITE, fontSize: 12, fontWeight: 'bold' },
  kpiPilier: { color: GOLD, fontSize: 10 },
  kpiBody: { padding: 12, flexDirection: 'row' },
  kpiValueCol: { width: '30%', alignItems: 'center' },
  kpiValue: { fontSize: 22, fontWeight: 'bold', color: NAVY, textAlign: 'center' },
  kpiUnit: { fontSize: 10, color: SLATE, textAlign: 'center', marginTop: 4 },
  kpiStatut: { fontSize: 9, fontWeight: 'bold', marginTop: 6, textAlign: 'center' },
  kpiDetailsCol: { width: '70%' },
  kpiDef: { fontSize: 9, color: SLATE, marginBottom: 6 },
  recommendationBox: { backgroundColor: '#fffbeb', padding: 8, borderRadius: 4, marginTop: 8, borderLeftWidth: 4, borderLeftColor: GOLD },

  // Table
  table: { width: '100%', marginTop: 10, marginBottom: 10 },
  tableRow: { flexDirection: 'row', borderBottomWidth: 0.5, borderBottomColor: '#e2e8f0', paddingVertical: 5 },
  tableHeaderRow: { flexDirection: 'row', backgroundColor: NAVY, paddingVertical: 8, paddingHorizontal: 6 },
  tableHeaderCell: { flex: 1, color: WHITE, fontSize: 9, fontWeight: 'bold' },
  tableCell: { flex: 1, fontSize: 8, color: SLATE },

  // Page elements
  footer: { position: 'absolute', bottom: 30, left: 40, right: 40, textAlign: 'center', fontSize: 8, color: SLATE, borderTopWidth: 0.5, borderTopColor: '#e2e8f0', paddingTop: 8 },
  pageBreak: { marginTop: 20, borderTopWidth: 1, borderTopColor: '#e2e8f0' },
});

// Helper: get statut color
const getStatutColor = (statut: AlertStatus): string => {
  switch (statut) {
    case 'vert': return C_VERT;
    case 'orange': return C_ORANGE;
    case 'rouge': return C_ROUGE;
    default: return C_GRIS;
  }
};
const getStatutLabel = (statut: AlertStatus): string => {
  switch (statut) {
    case 'vert': return 'Favorable';
    case 'orange': return 'À surveiller';
    case 'rouge': return 'Critique';
    default: return 'Contexte';
  }
};

// ─── SVG CHARTS ─────────────────────────────────────────
const GaugeChart = ({ score, color }: { score: number; color: string }) => {
  const angle = (score / 100) * Math.PI;
  const radius = 80;
  const startX = 100;
  const startY = 100;
  const endX = 100 + radius * Math.cos(Math.PI - angle);
  const endY = 100 - radius * Math.sin(Math.PI - angle);
  const largeArcFlag = score > 50 ? 1 : 0;
  const pathData = `M 100,20 A 80,80 0 ${largeArcFlag},1 ${endX},${endY}`;
  return (
    <Svg width={200} height={120} viewBox="0 0 200 130">
      <Circle cx={100} cy={100} r={80} stroke="#e2e8f0" strokeWidth={12} fill="none" />
      <Path d={pathData} stroke={color} strokeWidth={12} fill="none" strokeLinecap="round" />
      <Text x={100} y={90} textAnchor="middle" style={{ fontSize: 24, fontWeight: 'bold', fill: NAVY }}>{score}</Text>
      <Text x={100} y={110} textAnchor="middle" style={{ fontSize: 10, fill: SLATE }}>/100</Text>
    </Svg>
  );
};

const RadarChart = () => {
  const scores = PILIER_ORDER.map(p => PILIER_SCORES[p] / 100);
  const angles = PILIER_ORDER.map((_, i) => (i * 2 * Math.PI) / PILIER_ORDER.length - Math.PI / 2);
  const points = scores.map((s, i) => {
    const r = s * 100;
    const x = 100 + r * Math.cos(angles[i]);
    const y = 100 + r * Math.sin(angles[i]);
    return `${x},${y}`;
  }).join(' ');
  return (
    <Svg width={220} height={220} viewBox="0 0 200 200">
      {[0.25, 0.5, 0.75, 1].map(level => {
        const pts = angles.map(angle => {
          const r = level * 100;
          const x = 100 + r * Math.cos(angle);
          const y = 100 + r * Math.sin(angle);
          return `${x},${y}`;
        }).join(' ');
        return <Polygon key={level} points={pts} stroke="#e2e8f0" fill="none" strokeWidth={0.5} />;
      })}
      <Polygon points={points} fill={GOLD} fillOpacity={0.3} stroke={GOLD} strokeWidth={2} />
      {PILIER_ORDER.map((label, i) => {
        const angle = angles[i];
        const x = 100 + 115 * Math.cos(angle);
        const y = 100 + 115 * Math.sin(angle);
        let textAnchor: 'start' | 'middle' | 'end' = 'middle';
        if (Math.abs(angle) < 0.2) textAnchor = 'middle';
        else if (angle > 0) textAnchor = 'start';
        else textAnchor = 'end';
        return (
          <Text key={label} x={x} y={y} style={{ fontSize: 7, fill: SLATE }} textAnchor={textAnchor}>
            {label}
          </Text>
        );
      })}
    </Svg>
  );
};

const BarChart = () => {
  const barWidth = 30;
  const startX = 40;
  const maxHeight = 120;
  return (
    <Svg width={250} height={150} viewBox="0 0 250 150">
      {PILIER_ORDER.map((p, i) => {
        const score = PILIER_SCORES[p];
        const height = (score / 100) * maxHeight;
        const x = startX + i * (barWidth + 10);
        const y = 130 - height;
        return (
          <G key={p}>
            <Rect x={x} y={y} width={barWidth} height={height} fill={GOLD} />
            <Text x={x + barWidth/2} y={y - 5} style={{ fontSize: 8 }} textAnchor="middle">{score}</Text>
            <Text x={x + barWidth/2} y={140} style={{ fontSize: 7 }} textAnchor="middle">{p.substring(0, 6)}</Text>
          </G>
        );
      })}
    </Svg>
  );
};

// ─── KPI CARD COMPONENT ────────────────────────────────
const KPICard = ({ kpi }: { kpi: KPI }) => {
  const statutColor = getStatutColor(kpi.statut);
  const statutLabel = getStatutLabel(kpi.statut);
  return (
    <View style={styles.kpiCard} wrap={false}>
      <View style={styles.kpiHeader}>
        <Text style={styles.kpiId}>{kpi.id}</Text>
        <Text style={styles.kpiName}>{kpi.nom}</Text>
        <Text style={styles.kpiPilier}>{kpi.pilier}</Text>
      </View>
      <View style={styles.kpiBody}>
        <View style={styles.kpiValueCol}>
          <Text style={styles.kpiValue}>{kpi.valeur}</Text>
          <Text style={styles.kpiUnit}>{kpi.unite}</Text>
          <Text style={[styles.kpiStatut, { color: statutColor }]}>{statutLabel}</Text>
        </View>
        <View style={styles.kpiDetailsCol}>
          <Text style={styles.kpiDef}><Text style={{ fontWeight: 'bold' }}>Définition :</Text> {kpi.definition}</Text>
          <Text style={styles.kpiDef}><Text style={{ fontWeight: 'bold' }}>Objectif :</Text> {kpi.seuil_vert || 'À définir'}</Text>

          <Text style={styles.kpiDef}><Text style={{ fontWeight: 'bold' }}>Source :</Text> {kpi.source} ({kpi.annee})</Text>
        </View>
      </View>
      <View style={styles.recommendationBox}>
        <Text style={{ fontSize: 9, fontWeight: 'bold', color: '#92400e' }}>💡 Recommandation :</Text>
        <Text style={{ fontSize: 9, color: '#78350f' }}>{kpi.recommandation}</Text>
      </View>
    </View>
  );
};

// ─── MAIN REPORT DOCUMENT ──────────────────────────────
export const ReportPDF = () => (
  <Document>
    {/* COVER PAGE */}
    <Page size="A4" style={styles.coverPage}>
      <Text style={styles.coverTitle}>Think Digital, Think Tunisia.</Text>
      <Text style={styles.coverSub}>Rapport Annuel de l'Économie Numérique Tunisienne 2025</Text>
      <Text style={styles.coverScore}>{IMNT_SCORE}</Text>
      <Text style={styles.coverScoreLabel}>Score IMNT /100</Text>
      <View style={{ marginTop: 40, alignItems: 'center' }}>
        <GaugeChart score={IMNT_SCORE} color={GOLD} />
      </View>
      <Text style={styles.footer}>Date de génération : {new Date().toLocaleDateString()}</Text>
    </Page>

    {/* INFORMATIONS INSTITUTIONNELLES */}
    <Page size="A4" style={styles.page}>
      <Text style={styles.sectionTitle}>Informations institutionnelles</Text>
      <View style={styles.table}>
        <View style={styles.tableRow}>
          <Text style={[styles.tableCell, { flex: 2, fontWeight: 'bold' }]}>Titre</Text>
          <Text style={[styles.tableCell, { flex: 6 }]}>Rapport Annuel de l'Économie Numérique en Tunisie — Édition 2025</Text>
        </View>
        <View style={styles.tableRow}>
          <Text style={[styles.tableCell, { flex: 2, fontWeight: 'bold' }]}>Statut</Text>
          <Text style={[styles.tableCell, { flex: 6 }]}>Données validées · Version 1.0</Text>
        </View>
        <View style={styles.tableRow}>
          <Text style={[styles.tableCell, { flex: 2, fontWeight: 'bold' }]}>Périmètre</Text>
          <Text style={[styles.tableCell, { flex: 6 }]}>15 KPIs · 5 piliers IMNT · Sources officielles</Text>
        </View>
        <View style={styles.tableRow}>
          <Text style={[styles.tableCell, { flex: 2, fontWeight: 'bold' }]}>Copyright</Text>
          <Text style={[styles.tableCell, { flex: 6 }]}>© Idée & Concept : Madame Rim Jalouli — Tous droits réservés</Text>
        </View>
        <View style={styles.tableRow}>
          <Text style={[styles.tableCell, { flex: 2, fontWeight: 'bold' }]}>Conception</Text>
          <Text style={[styles.tableCell, { flex: 6 }]}>Mr Wahib Zaier — Démarche éditoriale & consultation approfondie</Text>
        </View>
      </View>
    </Page>

    {/* TABLE DES MATIÈRES (simplifiée) */}
    <Page size="A4" style={styles.page}>
      <Text style={styles.sectionTitle}>Table des matières</Text>
      {[
        'Partie I — Identité & contexte',
        '  1. Informations institutionnelles',
        '  2. Table des matières',
        '  3. Liste des figures',
        'Partie II — Synthèse & stratégie',
        '  4. Résumé exécutif',
        '  5. Score IMNT global',
        '  6. Analyse par pilier',
        'Partie III — Analyse détaillée des KPI',
        '  7. Fiches détaillées (15 KPI)',
        '  8. Tableau récapitulatif',
        'Partie IV — Alertes & recommandations',
        '  9. Alertes prioritaires',
        '  10. Recommandations',
        'Partie V — Annexes',
        '  11. Sources et références',
      ].map((item, idx) => (
        <Text key={idx} style={styles.smallText}>{item}</Text>
      ))}
    </Page>

    {/* RÉSUMÉ EXÉCUTIF */}
    <Page size="A4" style={styles.page}>
      <Text style={styles.sectionTitle}>Résumé exécutif</Text>
      <Text style={styles.bodyText}>
        La Tunisie affiche un score IMNT de <Text style={{ fontWeight: 'bold' }}>{IMNT_SCORE}/100</Text> en 2025, reflétant une performance numérique intermédiaire.
        Les infrastructures et le capital humain constituent les piliers les plus solides, tandis que l'e-gouvernement et la gouvernance numérique restent des leviers à activer.
      </Text>
      <Text style={styles.subsectionTitle}>⚠ Trois alertes majeures</Text>
      {KPIS.filter(k => k.statut === 'rouge').slice(0, 3).map(k => (
        <View key={k.id} style={{ marginBottom: 6, backgroundColor: '#fff7ed', padding: 6 }}>
          <Text style={{ fontSize: 9, fontWeight: 'bold', color: C_ROUGE }}>{k.id} – {k.nom}</Text>
          <Text style={{ fontSize: 9 }}>{k.recommandation}</Text>
        </View>
      ))}
    </Page>

    {/* SCORE IMNT GLOBAL + ANALYSE PAR PILIER */}
    <Page size="A4" style={styles.page}>
      <Text style={styles.sectionTitle}>Score IMNT global & analyse par pilier</Text>
      <View style={{ alignItems: 'center', marginVertical: 10 }}>
        <GaugeChart score={IMNT_SCORE} color={GOLD} />
      </View>
      {PILIER_ORDER.map(p => (
        <View key={p} style={{ marginBottom: 12 }}>
          <Text style={styles.subsectionTitle}>{p} – {PILIER_SCORES[p]}/100</Text>
          <Text style={styles.smallText}>
            {p === 'Infrastructures' && 'Taux de pénétration Internet solide (78,5%), mais débits insuffisants.'}
            {p === 'Capital humain' && '32 000 diplômés ICT/an, mais fuite des cerveaux.'}
            {p === 'Économie productive' && '1 432 startups, mais adoption des wallets encore faible.'}
            {p === 'E-gouvernement' && 'EGDI 0,6935, mais E-Houwiya sous-utilisé.'}
            {p === 'Gouvernance' && 'GCI Tier 3, mais loi données personnelles obsolète.'}
          </Text>
        </View>
      ))}
    </Page>

    {/* GRAPHIQUES RADAR + BARRES */}
    <Page size="A4" style={styles.page}>
      <Text style={styles.sectionTitle}>Graphiques comparatifs des piliers</Text>
      <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginTop: 20 }}>
        <RadarChart />
        <BarChart />
      </View>
      <Text style={[styles.smallText, { marginTop: 20, textAlign: 'center' }]}>
        Figure 1 – Radar IMNT 2025 · Figure 2 – Scores par pilier
      </Text>
    </Page>

    {/* FICHES DÉTAILLÉES DES 15 KPI */}
    <Page size="A4" style={styles.page}>
      <Text style={styles.sectionTitle}>Fiches détaillées des 15 KPI</Text>
      {KPIS.map(kpi => <KPICard key={kpi.id} kpi={kpi} />)}
    </Page>

    {/* TABLEAU RÉCAPITULATIF DES KPI */}
    <Page size="A4" style={styles.page}>
      <Text style={styles.sectionTitle}>Tableau récapitulatif des 15 KPI</Text>
      <View style={styles.table}>
        <View style={styles.tableHeaderRow}>
          <Text style={[styles.tableHeaderCell, { flex: 1 }]}>ID</Text>
          <Text style={[styles.tableHeaderCell, { flex: 3 }]}>Indicateur</Text>
          <Text style={[styles.tableHeaderCell, { flex: 1 }]}>Valeur</Text>
          <Text style={[styles.tableHeaderCell, { flex: 1 }]}>Année</Text>
          <Text style={[styles.tableHeaderCell, { flex: 2 }]}>Statut</Text>
        </View>
        {KPIS.map(kpi => (
          <View key={kpi.id} style={styles.tableRow}>
            <Text style={[styles.tableCell, { flex: 1 }]}>{kpi.id}</Text>
            <Text style={[styles.tableCell, { flex: 3 }]}>{kpi.nom}</Text>
            <Text style={[styles.tableCell, { flex: 1 }]}>{kpi.valeur}</Text>
            <Text style={[styles.tableCell, { flex: 1 }]}>{kpi.annee}</Text>
            <Text style={[styles.tableCell, { flex: 2, color: getStatutColor(kpi.statut), fontWeight: 'bold' }]}>
              {getStatutLabel(kpi.statut)}
            </Text>
          </View>
        ))}
      </View>
    </Page>

    {/* ALERTES PRIORITAIRES & RECOMMANDATIONS */}
    <Page size="A4" style={styles.page}>
      <Text style={styles.sectionTitle}>Alertes prioritaires</Text>
      {KPIS.filter(k => k.statut === 'rouge').map(k => (
        <View key={k.id} style={{ marginBottom: 10 }}>
          <Text style={{ fontSize: 10, fontWeight: 'bold', color: C_ROUGE }}>{k.id} – {k.nom}</Text>
          <Text style={{ fontSize: 9 }}>{k.recommandation}</Text>
        </View>
      ))}
      <Text style={styles.sectionTitle}>Recommandations stratégiques</Text>
      <Text style={styles.subsectionTitle}>Court terme (0-12 mois)</Text>
      <Text style={styles.bodyText}>• Lancer un plan marketing national pour E-Houwiya.</Text>
      <Text style={styles.bodyText}>• Accélérer le déploiement fibre et 5G.</Text>
      <Text style={styles.subsectionTitle}>Moyen terme (1-3 ans)</Text>
      <Text style={styles.bodyText}>• Adopter une loi moderne sur la protection des données.</Text>
      <Text style={styles.bodyText}>• Atteindre 50 Mbps de débit fixe médian.</Text>
    </Page>

    {/* SOURCES ET RÉFÉRENCES */}
    <Page size="A4" style={styles.page}>
      <Text style={styles.sectionTitle}>Sources et références</Text>
      {Array.from(new Set(KPIS.map(k => k.source))).map(src => (
        <Text key={src} style={styles.smallText}>• {src}</Text>
      ))}
      <Text style={styles.sectionTitle}>Limites méthodologiques</Text>
      <Text style={styles.smallText}>
        • Certaines données ont un décalage d'un an par rapport à l'édition du rapport.
        • Les scores par pilier sont calculés sur un nombre limité de KPIs.
        • La comparaison avec les années précédentes n'est pas disponible pour toutes les séries.
      </Text>
      <Text style={[styles.footer, { position: 'relative', marginTop: 40 }]}>
        Rapport généré le {new Date().toLocaleDateString()} – Think Digital, Think Tunisia
      </Text>
    </Page>
  </Document>
);