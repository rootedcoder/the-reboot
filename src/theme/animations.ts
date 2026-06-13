import { Easing } from 'react-native-reanimated';

// Spring presets — import and spread into Moti transition props
export const springs = {
  // Snappy: press feedback, small tags, toggles
  snappy: {
    type: 'spring' as const,
    damping: 20,
    stiffness: 400,
  },
  // Default: card entrances, state changes
  default: {
    type: 'spring' as const,
    damping: 18,
    stiffness: 180,
  },
  // Gentle: large elements, page-level transitions
  gentle: {
    type: 'spring' as const,
    damping: 22,
    stiffness: 120,
  },
  // Bouncy: grade reveals, level up, celebrations
  bouncy: {
    type: 'spring' as const,
    damping: 10,
    stiffness: 100,
  },
  // Tight: number count-up, progress bars
  tight: {
    type: 'timing' as const,
    duration: 600,
    easing: Easing.out(Easing.cubic),
  },
};

// Entrance presets — spread as Moti from/animate/transition
export const entrance = {
  fadeSlideUp: {
    from: { opacity: 0, translateY: 24 },
    animate: { opacity: 1, translateY: 0 },
    transition: springs.default,
  },
  fadeSlideDown: {
    from: { opacity: 0, translateY: -24 },
    animate: { opacity: 1, translateY: 0 },
    transition: springs.default,
  },
  fadeSlideRight: {
    from: { opacity: 0, translateX: -20 },
    animate: { opacity: 1, translateX: 0 },
    transition: springs.gentle,
  },
  fadeScale: {
    from: { opacity: 0, scale: 0.75 },
    animate: { opacity: 1, scale: 1 },
    transition: springs.bouncy,
  },
  fade: {
    from: { opacity: 0 },
    animate: { opacity: 1 },
    transition: springs.gentle,
  },
};

// Stagger delays — pass stagger(index) into Moti delay prop
export const stagger = {
  list: (index: number) => ({ delay: index * 60 }),
  cards: (index: number) => ({ delay: index * 80 }),
  assessment: (index: number) => ({ delay: index * 120 }),
  fast: (index: number) => ({ delay: index * 40 }),
};

// Timing constants (ms)
export const duration = {
  micro: 150,
  fast: 220,
  normal: 320,
  slow: 500,
  cinematic: 800,
} as const;

// Reanimated spring configs (for useSharedValue / withSpring)
export const springConfig = {
  press: { damping: 20, stiffness: 400 },
  release: { damping: 15, stiffness: 300 },
  xpBar: { damping: 14, stiffness: 100 },
  gradeReveal: { damping: 10, stiffness: 100 },
  numberCountUp: { duration: 800 },
} as const;
