// lib/reportMeta.ts
import { PILIERS } from './kpis/kpis'; // we already have PILIERS

export const IMNT_SCORE = 48.7; // overall score from Python

// Pillar scores (as in original Python)
export const PILIER_SCORES: Record<string, number> = {
  'Infrastructures': 58,
  'Capital humain': 42,
  'Économie productive': 55,
  'E-gouvernement': 48,
  'Gouvernance': 44,
};

// For radar chart order, keep the same list as Python
export const PILIER_ORDER = [
  'Infrastructures',
  'Capital humain',
  'Économie productive',
  'E-gouvernement',
  'Gouvernance',
];

// Colors (same as Python)
export const NAVY = '#0A2B4E';
export const GOLD = '#D4AF37';
export const SLATE = '#64748b';
export const WHITE = '#ffffff';
export const LIGHT = '#f1f5f9';
export const C_VERT = '#4ECDC4';
export const C_ORANGE = '#F39C12';
export const C_ROUGE = '#FF6B6B';
export const C_GRIS = '#95A5A6';