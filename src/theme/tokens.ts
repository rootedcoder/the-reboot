// Design tokens — single source of truth. Never use raw hex strings outside this file.

export const colors = {
  // Backgrounds
  bg: {
    base: '#09090b',
    surface: '#111827',
    elevated: '#1f2937',
    input: '#0b1220',
    overlay: 'rgba(0,0,0,0.6)',
  },

  // Brand
  brand: {
    purple: '#7c3aed',
    purpleDim: '#2e1065',
    purpleBorder: '#4c1d95',
    cyan: '#22d3ee',
    cyanDim: '#083344',
    cyanBorder: '#0e7490',
  },

  // Grade colors
  grade: {
    S: '#FFD700',
    A: '#7c3aed',
    B: '#22d3ee',
    C: '#22c55e',
    D: '#eab308',
    E: '#f97316',
    F: '#ef4444',
  },

  // Grade glow (for shadows/glows)
  gradeGlow: {
    S: 'rgba(255,215,0,0.45)',
    A: 'rgba(124,58,237,0.45)',
    B: 'rgba(34,211,238,0.45)',
    C: 'rgba(34,197,94,0.45)',
    D: 'rgba(234,179,8,0.45)',
    E: 'rgba(249,115,22,0.45)',
    F: 'rgba(239,68,68,0.45)',
  },

  // Grade dim backgrounds
  gradeDim: {
    S: 'rgba(255,215,0,0.12)',
    A: 'rgba(124,58,237,0.12)',
    B: 'rgba(34,211,238,0.12)',
    C: 'rgba(34,197,94,0.12)',
    D: 'rgba(234,179,8,0.12)',
    E: 'rgba(249,115,22,0.12)',
    F: 'rgba(239,68,68,0.12)',
  },

  // Text
  text: {
    primary: '#f8fafc',
    secondary: '#cbd5e1',
    muted: '#64748b',
    disabled: '#374151',
  },

  // Borders
  border: {
    default: '#1f2937',
    subtle: '#111827',
    accent: '#312e81',
    purple: '#4c1d95',
  },

  // Semantic
  success: '#22c55e',
  warning: '#eab308',
  error: '#ef4444',
  info: '#22d3ee',
} as const;

export const spacing = {
  1: 4,
  2: 8,
  3: 12,
  4: 16,
  5: 20,
  6: 24,
  8: 32,
  10: 40,
  12: 48,
  16: 64,
} as const;

export const radius = {
  sm: 8,
  md: 12,
  lg: 16,
  xl: 24,
  full: 9999,
} as const;

export const fontSize = {
  xs: 10,
  sm: 12,
  base: 14,
  md: 16,
  lg: 18,
  xl: 22,
  '2xl': 28,
  '3xl': 36,
  '4xl': 48,
} as const;

export const fontWeight = {
  regular: '400' as const,
  medium: '500' as const,
  semibold: '600' as const,
  bold: '700' as const,
  extrabold: '800' as const,
  black: '900' as const,
};

export const letterSpacing = {
  tight: -0.5,
  normal: 0,
  wide: 1,
  wider: 1.5,
  widest: 2,
} as const;

// Grade ordered array for iteration
export const GRADE_ORDER = ['S', 'A', 'B', 'C', 'D', 'E', 'F'] as const;
export type Grade = typeof GRADE_ORDER[number];

export const gradeFromScore = (score: number): Grade => {
  if (score >= 95) return 'S';
  if (score >= 80) return 'A';
  if (score >= 65) return 'B';
  if (score >= 50) return 'C';
  if (score >= 35) return 'D';
  if (score >= 20) return 'E';
  return 'F';
};
