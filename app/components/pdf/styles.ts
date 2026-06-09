// app/components/pdf/styles.ts
// ─── Stylesheet unique pour tout le rapport PDF ─────────────────────────────
// Importer ce fichier dans chaque composant PDF — NE PAS dupliquer les styles.

import { StyleSheet } from '@react-pdf/renderer'
import {
  NAVY, GOLD, SLATE, WHITE, LIGHT, LIGHT2, BORDER, DARK, MID,
  C_VERT, C_ORANGE, C_ROUGE,
} from '../../lib/reportMeta'

export const S = StyleSheet.create({

  // ── Pages ────────────────────────────────────────────────────────────────
  page: {
    paddingTop: 70,        // espace pour header fixe
    paddingBottom: 55,     // espace pour footer fixe
    paddingLeft: 71,       // 2,5 cm
    paddingRight: 71,
    fontFamily: 'Helvetica',
    backgroundColor: WHITE,
    fontSize: 10,
    color: MID,
  },
  coverPage: {
    paddingTop: 0,
    paddingBottom: 0,
    paddingLeft: 0,
    paddingRight: 0,
    backgroundColor: NAVY,
  },

  // ── Header / Footer fixes ────────────────────────────────────────────────
  pageHeader: {
    position: 'absolute',
    top: 20,
    left: 71,
    right: 71,
    height: 36,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderBottomWidth: 1,
    borderBottomColor: GOLD,
    paddingBottom: 6,
  },
  headerLogo: {
    width: 18,
    height: 18,
    backgroundColor: GOLD,
    borderRadius: 3,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerLogoText: {
    color: NAVY,
    fontSize: 10,
    fontFamily: 'Helvetica-Bold',
  },
  headerTitle: {
    fontSize: 7.5,
    color: NAVY,
    fontFamily: 'Helvetica-Bold',
    marginLeft: 6,
    flex: 1,
  },
  headerPageNum: {
    fontSize: 8,
    color: SLATE,
  },
  pageFooter: {
    position: 'absolute',
    bottom: 18,
    left: 71,
    right: 71,
    flexDirection: 'row',
    justifyContent: 'space-between',
    borderTopWidth: 0.5,
    borderTopColor: BORDER,
    paddingTop: 5,
  },
  footerLeft: {
    fontSize: 7,
    color: SLATE,
  },
  footerRight: {
    fontSize: 7,
    color: SLATE,
  },

  // ── Typographie ───────────────────────────────────────────────────────────
  partLabel: {
    fontSize: 8,
    fontFamily: 'Helvetica-Bold',
    color: GOLD,
    textTransform: 'uppercase',
    letterSpacing: 1.5,
    marginBottom: 4,
    marginTop: 6,
  },
  h1: {
    fontSize: 20,
    fontFamily: 'Helvetica-Bold',
    color: NAVY,
    marginBottom: 10,
    marginTop: 4,
    lineHeight: 1.2,
  },
  h2: {
    fontSize: 14,
    fontFamily: 'Helvetica-Bold',
    color: NAVY,
    marginBottom: 6,
    marginTop: 14,
    lineHeight: 1.25,
  },
  h3: {
    fontSize: 11,
    fontFamily: 'Helvetica-Bold',
    color: NAVY,
    marginBottom: 4,
    marginTop: 10,
  },
  body: {
    fontSize: 10,
    color: MID,
    lineHeight: 1.5,
    marginBottom: 6,
    textAlign: 'justify',
  },
  small: {
    fontSize: 8.5,
    color: SLATE,
    lineHeight: 1.4,
    marginBottom: 3,
  },
  mono: {
    // JetBrains Mono → fallback Courier (embed custom font si disponible)
    fontFamily: 'Courier',
    fontSize: 9,
    color: DARK,
  },

  // ── Dividers ─────────────────────────────────────────────────────────────
  divider: {
    borderBottomWidth: 0.5,
    borderBottomColor: BORDER,
    marginVertical: 8,
  },
  dividerGold: {
    borderBottomWidth: 1,
    borderBottomColor: GOLD,
    marginVertical: 10,
  },

  // ── Spacers ───────────────────────────────────────────────────────────────
  spacer4:  { marginBottom: 4 },
  spacer8:  { marginBottom: 8 },
  spacer12: { marginBottom: 12 },
  spacer16: { marginBottom: 16 },
  spacer24: { marginBottom: 24 },

  // ── TOC ──────────────────────────────────────────────────────────────────
  tocPartRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 10,
    marginBottom: 3,
    paddingBottom: 4,
    borderBottomWidth: 1,
    borderBottomColor: NAVY,
  },
  tocPartLabel: {
    fontSize: 9,
    fontFamily: 'Helvetica-Bold',
    color: NAVY,
    flex: 1,
  },
  tocRow: {
    flexDirection: 'row',
    alignItems: 'baseline',
    paddingVertical: 3,
    borderBottomWidth: 0.3,
    borderBottomColor: LIGHT,
  },
  tocLabel: {
    fontSize: 9,
    color: MID,
    paddingLeft: 14,
    flex: 1,
  },
  tocDots: {
    fontSize: 9,
    color: BORDER,
    flex: 1,
    textAlign: 'center',
  },
  tocPage: {
    fontSize: 9,
    color: SLATE,
    width: 20,
    textAlign: 'right',
  },

  // ── Scores & Jauges ───────────────────────────────────────────────────────
  scoreBlock: {
    backgroundColor: LIGHT2,
    borderRadius: 8,
    padding: 12,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: BORDER,
  },
  scoreValue: {
    fontSize: 32,
    fontFamily: 'Helvetica-Bold',
    color: NAVY,
    textAlign: 'center',
  },
  scoreUnit: {
    fontSize: 10,
    color: SLATE,
    textAlign: 'center',
    marginTop: 2,
  },
  scoreLabel: {
    fontSize: 8,
    fontFamily: 'Helvetica-Bold',
    color: GOLD,
    textAlign: 'center',
    marginTop: 4,
    textTransform: 'uppercase',
    letterSpacing: 0.8,
  },

  // ── NRI Grid ─────────────────────────────────────────────────────────────
  nriGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginTop: 8,
  },
  nriCell: {
    width: '22%',
    backgroundColor: LIGHT2,
    borderRadius: 6,
    padding: 8,
    borderWidth: 0.5,
    borderColor: BORDER,
    alignItems: 'center',
  },
  nriValue: {
    fontSize: 18,
    fontFamily: 'Helvetica-Bold',
    color: NAVY,
    textAlign: 'center',
  },
  nriSub: {
    fontSize: 7.5,
    color: SLATE,
    textAlign: 'center',
    marginTop: 1,
  },
  nriLabel: {
    fontSize: 7,
    color: MID,
    textAlign: 'center',
    marginTop: 3,
  },

  // ── KPI Card ─────────────────────────────────────────────────────────────
  kpiCard: {
    marginBottom: 12,
    borderWidth: 1,
    borderColor: BORDER,
    borderRadius: 6,
    overflow: 'hidden',
  },
  kpiHeader: {
    backgroundColor: NAVY,
    paddingHorizontal: 10,
    paddingVertical: 7,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  kpiHeaderId: {
    color: GOLD,
    fontSize: 8,
    fontFamily: 'Helvetica-Bold',
    width: 48,
  },
  kpiHeaderName: {
    color: WHITE,
    fontSize: 11,
    fontFamily: 'Helvetica-Bold',
    flex: 1,
  },
  kpiHeaderPilier: {
    color: GOLD,
    fontSize: 8,
    textAlign: 'right',
    width: 80,
  },
  kpiBody: {
    flexDirection: 'row',
    backgroundColor: LIGHT2,
  },
  kpiValueCol: {
    width: 100,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 10,
    borderRightWidth: 0.5,
    borderRightColor: BORDER,
  },
  kpiValue: {
    fontSize: 20,
    fontFamily: 'Helvetica-Bold',
    color: NAVY,
    textAlign: 'center',
    lineHeight: 1.1,
  },
  kpiUnit: {
    fontSize: 8,
    color: SLATE,
    textAlign: 'center',
    marginTop: 3,
  },
  kpiStatutBadge: {
    marginTop: 6,
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 10,
    alignItems: 'center',
  },
  kpiStatutText: {
    fontSize: 7.5,
    fontFamily: 'Helvetica-Bold',
    color: WHITE,
  },
  kpiDetailsCol: {
    flex: 1,
    padding: 10,
  },
  kpiFieldLabel: {
    fontSize: 7.5,
    fontFamily: 'Helvetica-Bold',
    color: GOLD,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: 1,
    marginTop: 5,
  },
  kpiFieldValue: {
    fontSize: 8.5,
    color: MID,
    lineHeight: 1.35,
  },
  kpiSeuilRow: {
    flexDirection: 'row',
    gap: 6,
    marginTop: 5,
  },
  kpiSeuilPill: {
    paddingHorizontal: 5,
    paddingVertical: 2,
    borderRadius: 4,
    fontSize: 7,
  },
  kpiRecoBox: {
    backgroundColor: '#fffbeb',
    paddingHorizontal: 10,
    paddingVertical: 7,
    borderTopWidth: 1,
    borderTopColor: '#fde68a',
  },
  kpiRecoLabel: {
    fontSize: 8,
    fontFamily: 'Helvetica-Bold',
    color: '#92400e',
    marginBottom: 2,
  },
  kpiRecoText: {
    fontSize: 8.5,
    color: '#78350f',
    lineHeight: 1.35,
  },

  // ── Tables ────────────────────────────────────────────────────────────────
  tableContainer: {
    marginTop: 8,
    marginBottom: 12,
    borderWidth: 0.5,
    borderColor: BORDER,
    borderRadius: 4,
    overflow: 'hidden',
  },
  tableHeaderRow: {
    flexDirection: 'row',
    backgroundColor: NAVY,
    paddingVertical: 7,
    paddingHorizontal: 8,
  },
  tableHeaderCell: {
    fontSize: 8.5,
    fontFamily: 'Helvetica-Bold',
    color: WHITE,
  },
  tableRow: {
    flexDirection: 'row',
    paddingVertical: 5,
    paddingHorizontal: 8,
    borderBottomWidth: 0.3,
    borderBottomColor: BORDER,
  },
  tableRowAlt: {
    backgroundColor: LIGHT2,
  },
  tableCell: {
    fontSize: 8.5,
    color: MID,
    lineHeight: 1.3,
  },

  // ── Alertes ───────────────────────────────────────────────────────────────
  alertBox: {
    padding: 8,
    borderRadius: 4,
    marginBottom: 8,
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 8,
  },
  alertBoxRouge:  { backgroundColor: '#fff5f5', borderLeftWidth: 3, borderLeftColor: C_ROUGE },
  alertBoxOrange: { backgroundColor: '#fff7ed', borderLeftWidth: 3, borderLeftColor: C_ORANGE },
  alertTitle: {
    fontSize: 9,
    fontFamily: 'Helvetica-Bold',
    marginBottom: 2,
  },
  alertBody: {
    fontSize: 8.5,
    color: MID,
    lineHeight: 1.35,
  },

  // ── Recommandations ───────────────────────────────────────────────────────
  recoItem: {
    flexDirection: 'row',
    marginBottom: 7,
    paddingLeft: 10,
    paddingRight: 6,
    paddingVertical: 7,
    backgroundColor: LIGHT2,
    borderRadius: 4,
    borderLeftWidth: 2,
    borderLeftColor: NAVY,
    gap: 8,
  },
  recoPilierTag: {
    fontSize: 7.5,
    fontFamily: 'Helvetica-Bold',
    color: WHITE,
    backgroundColor: NAVY,
    paddingHorizontal: 5,
    paddingVertical: 2,
    borderRadius: 3,
    width: 68,
    textAlign: 'center',
  },
  recoText: {
    fontSize: 9,
    color: MID,
    flex: 1,
    lineHeight: 1.4,
  },

  // ── Pilier analysis card ──────────────────────────────────────────────────
  pilierCard: {
    marginBottom: 10,
    borderRadius: 6,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: BORDER,
  },
  pilierCardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: 7,
    justifyContent: 'space-between',
  },
  pilierCardNum: {
    fontSize: 8,
    fontFamily: 'Helvetica-Bold',
    color: WHITE,
    opacity: 0.7,
    marginRight: 6,
  },
  pilierCardLabel: {
    fontSize: 11,
    fontFamily: 'Helvetica-Bold',
    color: WHITE,
    flex: 1,
  },
  pilierCardScore: {
    fontSize: 20,
    fontFamily: 'Helvetica-Bold',
    color: WHITE,
  },
  pilierCardScoreUnit: {
    fontSize: 8,
    color: WHITE,
    opacity: 0.7,
    marginTop: 2,
    marginLeft: 1,
  },
  pilierCardBody: {
    padding: 10,
    backgroundColor: LIGHT2,
  },
  pilierCardConstat: {
    fontSize: 9,
    color: MID,
    lineHeight: 1.45,
    marginBottom: 6,
  },
  pilierCardForces: {
    fontSize: 8.5,
    color: '#065f46',
    lineHeight: 1.35,
  },
  pilierCardFaiblesses: {
    fontSize: 8.5,
    color: '#7c2d12',
    lineHeight: 1.35,
  },
  pilierCardAlerte: {
    fontSize: 8.5,
    color: '#92400e',
    backgroundColor: '#fffbeb',
    padding: 5,
    borderRadius: 3,
    marginTop: 4,
    lineHeight: 1.35,
  },

  // ── Sources table ─────────────────────────────────────────────────────────
  sourcesTableContainer: {
    marginTop: 8,
    borderWidth: 0.5,
    borderColor: BORDER,
    borderRadius: 4,
    overflow: 'hidden',
  },

  // ── Cover ─────────────────────────────────────────────────────────────────
  coverContainer: {
    flex: 1,
    paddingHorizontal: 50,
    paddingTop: 50,
    paddingBottom: 40,
    position: 'relative',
  },
  coverAccentBar: {
    position: 'absolute',
    left: 0,
    top: 0,
    bottom: 0,
    width: 14,
    backgroundColor: GOLD,
  },
  coverTag: {
    fontSize: 8,
    fontFamily: 'Helvetica-Bold',
    color: GOLD,
    textTransform: 'uppercase',
    letterSpacing: 2,
    marginTop: 60,
    marginBottom: 12,
  },
  coverTitle1: {
    fontSize: 34,
    fontFamily: 'Helvetica-Bold',
    color: WHITE,
    lineHeight: 1.15,
  },
  coverTitle2: {
    fontSize: 34,
    fontFamily: 'Helvetica-Bold',
    color: GOLD,
    lineHeight: 1.15,
  },
  coverSubtitle: {
    fontSize: 13,
    color: '#94a3b8',
    marginTop: 16,
    lineHeight: 1.4,
  },
  coverDivider: {
    borderBottomWidth: 1,
    borderBottomColor: '#ffffff20',
    marginVertical: 28,
  },
  coverScoreBox: {
    flexDirection: 'row',
    gap: 12,
    backgroundColor: '#ffffff0f',
    borderWidth: 1,
    borderColor: '#ffffff18',
    borderRadius: 10,
    padding: 16,
  },
  coverScoreItem: {
    flex: 1,
    alignItems: 'center',
  },
  coverScoreValue: {
    fontSize: 28,
    fontFamily: 'Helvetica-Bold',
    color: GOLD,
    textAlign: 'center',
  },
  coverScoreValueWhite: {
    fontSize: 28,
    fontFamily: 'Helvetica-Bold',
    color: WHITE,
    textAlign: 'center',
  },
  coverScoreUnit: {
    fontSize: 8.5,
    color: '#94a3b8',
    textAlign: 'center',
    marginTop: 2,
  },
  coverScoreLabel: {
    fontSize: 7.5,
    fontFamily: 'Helvetica-Bold',
    color: WHITE,
    textAlign: 'center',
    marginTop: 5,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  coverSepLine: {
    width: 0.5,
    backgroundColor: '#ffffff20',
    marginHorizontal: 4,
  },
  coverMeta: {
    marginTop: 28,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
  },
  coverMetaText: {
    fontSize: 8,
    color: '#64748b',
    lineHeight: 1.5,
  },
  coverGoldBar: {
    borderTopWidth: 2,
    borderTopColor: GOLD,
    marginTop: 16,
    paddingTop: 10,
  },
  coverFooterText: {
    fontSize: 7.5,
    color: '#475569',
    textAlign: 'center',
  },
})