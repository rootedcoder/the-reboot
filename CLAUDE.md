# THE REBOOT — Claude Code Guide

## What this project is
A React Native fitness RPG where real physical benchmarks define your character stats and grade. Inspired by Solo Leveling. Two products: the mobile app and an internal content pipeline.

## Spec document
Full product specification is in `docs/PRODUCT_SPEC.md`. Read it before making any architectural decision.

## Current phase
**Phase 2 — Auth.** Phase 1 foundation is complete. All prototype code deleted. Build the Splash screen, onboarding slides, and Supabase Auth (Google / Apple / Facebook / Email).

### Phase 1 — DONE ✅
- `src/theme/` — tokens, animations, gradients (all colors, spacing, presets)
- `src/components/ui/` — Button, Card, GradeBadge, StatBar, SkeletonBox
- `src/components/animated/` — SpringPressable, AnimatedCard, StaggerList, ScreenWrapper
- `src/services/supabase.ts` — Supabase client (reads from env)
- `src/store/auth.store.ts` — Zustand auth session store
- `src/store/ui.store.ts` — Zustand UI state store
- `src/navigation/RootNavigator.tsx` — stub navigator (placeholder screens)
- `App.tsx` — QueryClient + GestureHandler + SafeArea + NavigationContainer + AuthListener
- All prototype code deleted (`screens/`, `store/`, `components/`, `features/`, `services/`, `hooks/`, `data/`, `utils/`, `types/`)
- Reanimated 3, Moti, React Query, Supabase JS, Lottie, expo-haptics installed

### What to build next (Phase 2)
- `src/screens/auth/SplashScreen.tsx` — animated logo, brand intro
- `src/screens/auth/OnboardingScreen.tsx` — 3–4 swipeable slides with Moti
- `src/screens/auth/LoginScreen.tsx` — Google, Apple, Facebook, Email via Supabase Auth
- `src/screens/auth/RegisterScreen.tsx`
- Wire navigation: Splash → Onboarding (first time) → Login/Register → App

### Key file locations
- Theme tokens: `src/theme/tokens.ts`
- Animation presets: `src/theme/animations.ts`
- Supabase client: `src/services/supabase.ts`
- Auth state: `src/store/auth.store.ts`
- Navigation root: `src/navigation/RootNavigator.tsx`

## Critical rules

### Never do these
- No hardcoded hex colors anywhere — use tokens from `src/theme/tokens.ts`
- No hardcoded stat names, grade letters, or thresholds — all come from DB via React Query
- No OpenAI API key in the app bundle — all AI calls go through Supabase Edge Functions
- No guest mode — spec explicitly removed it
- No `Animated` from React Native — use Reanimated 3 and Moti everywhere
- No spinners — use skeleton loading states

### Always do these
- Every interactive element has a micro-interaction (spring press, hover glow)
- Every screen entrance uses a staggered fade+slide-up (Moti `AnimatePresence`)
- Grade reveals are cinematic — never instant text swap
- Animations run on the UI thread (Reanimated worklets, `useNativeDriver: true` is legacy — avoid)
- All lists stagger their items on mount (50ms delay per item)

## Animation philosophy
Think Framer Motion on the web — spring physics, staggered entrances, layout animations. For React Native this means:
- **Reanimated 3** for performant UI-thread animations
- **Moti** for declarative spring/timing animations (Framer Motion API feel)
- **Lottie** for celebration moments (grade reveal, level up, milestones)
- 200–400ms range for transitions. Never slow. Never blocking.

## Tech stack
- Expo 54 + React Native 0.81 + TypeScript
- Supabase (Auth + Postgres + Edge Functions + Storage)
- Zustand (local UI state only) + React Query (all server data)
- React Three Fiber + expo-gl (3D character model)
- Reanimated 3 + Moti (all animations)
- Lottie (celebrations)
- RevenueCat (subscriptions)
- React Navigation (already installed)

## Folder structure (target)
```
src/
  theme/          — tokens, colors, spacing, typography, animation presets
  components/     — shared UI primitives (all animated by default)
  screens/        — one folder per screen
  features/       — domain logic (assessment, stats, skills, workout, auth)
  store/          — Zustand slices (UI state only)
  queries/        — React Query hooks (all server data)
  services/       — Supabase client, RevenueCat, edge function calls
  navigation/     — React Navigation setup
  types/          — TypeScript types matching DB schema exactly
  utils/          — pure functions
  3d/             — React Three Fiber scene, model loader, animation mixer
docs/
  PRODUCT_SPEC.md
  ARCHITECTURE.md
  DESIGN_SYSTEM.md
  DATABASE_SCHEMA.md
  BUILD_ORDER.md
  ANIMATION_GUIDE.md
  PIPELINE.md
```

## Stat system (10 stats, DB-driven)
Strength · Stamina · Agility · Speed · Flexibility · Jump Force · Grip Strength · Balance · Endurance · Explosive Power

## Grade system
S (95–100) · A (80–94) · B (65–79) · C (50–64) · D (35–49) · E (20–34) · F (0–19)
Grade colors: S=`#FFD700` A=`#7c3aed` B=`#22d3ee` C=`#22c55e` D=`#eab308` E=`#f97316` F=`#ef4444`

## Pricing
Free / Trial(14d) / Monthly / Yearly — via RevenueCat. No lifetime plan. Full assessment always free.
