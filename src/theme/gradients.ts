import { colors } from './tokens';

// LinearGradient color arrays — use with expo-linear-gradient
export const gradients = {
  // Primary brand gradient
  brand: [colors.brand.purple, colors.brand.cyan] as const,
  brandSubtle: ['rgba(124,58,237,0.35)', 'rgba(34,211,238,0.15)'] as const,

  // Grade gradients (for grade reveal banners)
  grade: {
    S: ['#b8860b', '#FFD700', '#fef3c7'] as const,
    A: ['#4c1d95', '#7c3aed', '#c4b5fd'] as const,
    B: ['#083344', '#22d3ee', '#a5f3fc'] as const,
    C: ['#14532d', '#22c55e', '#bbf7d0'] as const,
    D: ['#713f12', '#eab308', '#fef08a'] as const,
    E: ['#7c2d12', '#f97316', '#fed7aa'] as const,
    F: ['#7f1d1d', '#ef4444', '#fecaca'] as const,
  },

  // Surface gradients
  surfaceTop: ['rgba(255,255,255,0.04)', 'rgba(255,255,255,0)'] as const,
  dark: [colors.bg.surface, colors.bg.base] as const,

  // XP bar
  xpBar: [colors.brand.purple, colors.brand.cyan] as const,
} as const;
