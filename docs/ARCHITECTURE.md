# THE REBOOT — System Architecture

## Overview

```
╔══════════════════════════════════════════════════════════════╗
║                    CONTENT PIPELINE                          ║
║                                                              ║
║  Video / MoCap → Pose Estimation (MediaPipe / WHAM)         ║
║       → Python: joints → bone names                         ║
║       → Keyframe JSON cleaned + smoothed                    ║
║       → Admin Tool (Next.js) — preview + approve            ║
║       → Supabase: animation_data table                      ║
╚══════════════════════════════╦═══════════════════════════════╝
                               ║
                               ▼
╔══════════════════════════════════════════════════════════════╗
║                      SUPABASE                                ║
║                                                              ║
║  Auth (Google / Apple / Facebook / Email)                    ║
║  Postgres DB (all tables — see DATABASE_SCHEMA.md)           ║
║  Row-Level Security on all user tables                       ║
║  Storage (male.glb, female.glb, lottie JSON)                 ║
║  Edge Functions:                                             ║
║    - generate-skill  (OpenAI → skill JSON)                   ║
║    - generate-workout (OpenAI → exercise IDs from DB)        ║
║    - process-pipeline (pose estimation trigger)              ║
╚══════════════════════════════╦═══════════════════════════════╝
                               ║
                               ▼
╔══════════════════════════════════════════════════════════════╗
║                      THE APP                                 ║
║                                                              ║
║  State Management                                            ║
║    Zustand — local UI state (modals, selections, timers)     ║
║    React Query — all server data (fetch, cache, sync)        ║
║                                                              ║
║  Auth (Supabase Auth → Zustand session)                      ║
║       ↓                                                      ║
║  Assessment → Full Grade Profile (UserStatProfile in DB)     ║
║       ↓                                                      ║
║  Home                                                        ║
║    Layer 1: React Three Fiber 3D scene                       ║
║      - male.glb or female.glb (from Supabase Storage)        ║
║      - BoneKeyframe JSON from DB → AnimationMixer            ║
║      - Muscle mesh highlighting per exercise                 ║
║    Layer 2: Dashboard (swipe up)                             ║
║       ↓                                                      ║
║  Stats / Skills / Train / Profile                            ║
║       ↓                                                      ║
║  RevenueCat — Free / Trial / Monthly / Yearly                ║
║  Reanimated 3 + Moti — all UI animations                     ║
║  Lottie — celebration moments                                ║
║  Expo Notifications — reminders + streak                     ║
╚══════════════════════════════════════════════════════════════╝
```

---

## State Architecture

### Zustand (local UI state only)
```typescript
// What belongs in Zustand:
- Auth session (token, userId)
- Current workout player state (timer, stepIndex, isRunning)
- Active modal/overlay states
- Navigation state supplements
- Optimistic UI updates

// What does NOT belong in Zustand:
- Stats, grades, skills — use React Query
- Exercises, routines — use React Query
- User profile — use React Query
```

### React Query (all server data)
```typescript
// Query keys convention:
['stats']                           — all stats definitions
['user', userId, 'stat-profiles']   — user's grades per stat
['user', userId, 'overall-grade']   — user's overall grade
['skills', { categoryId }]          — skills by category
['user', userId, 'skills']          — user's active skills
['exercises', { statId, grade }]    — exercises for grade targeting
['user', userId, 'sessions']        — workout history
['app-config']                      — AppConfig table (24h cache)
```

### Offline Strategy
- React Query: `staleTime: 5 * 60 * 1000` (5 min) for content tables
- React Query: `staleTime: 0` for user data (always fresh on focus)
- Zustand + AsyncStorage persist: auth session + last-known grades
- Workout player runs fully offline once data is loaded

---

## 3D Architecture

### Models
- `male.glb` — athletic male rig, Mixamo bone naming
- `female.glb` — athletic female rig, same bone naming
- Loaded once on app launch, cached in memory
- Gender selection in user profile determines which model renders

### Animation System
Animations are **NOT** pre-recorded glTF clips. They are BoneKeyframe JSON stored in `animation_data` table in Supabase and applied programmatically at runtime via React Three Fiber's `AnimationMixer`.

```
DB row: animation_data.keyframes (BoneKeyframe JSON)
        ↓
React Query fetches when exercise/technique screen loads
        ↓
Three.js AnimationClip built from keyframes at runtime
        ↓
AnimationMixer plays clip on the loaded GLB model
        ↓
Muscle meshes colored per animation_data.highlight_meshes
```

This means: **add an exercise to the DB with animation data → it plays in the app instantly. Zero code changes.**

### Step-by-step Technique Mode
For skill techniques, `animation_data.pause_at_frames` and `step_labels` fields enable guided walkthroughs. AnimationMixer pauses at specified frames; UI overlay shows label + description.

### Free vs Paid 3D
- Free: 3D character on Home screen (idle only) + muscle highlighting
- Paid: Full exercise demo animations + skill technique walkthroughs

---

## Feature Flag Architecture

AppConfig table in Supabase controls all limits. App reads at launch, caches 24h.

```typescript
// useEntitlement hook
const canAccessFeature = (feature: Feature, tier: SubscriptionTier) => {
  const config = useAppConfig() // React Query, cached
  const limits = FEATURE_LIMITS[feature]
  return limits.includes(tier)
}

// Feature gates — wrap any paid UI element:
<EntitlementGate feature="grade_targeting">
  <GradeTargetingScreen />
</EntitlementGate>
// → Shows paywall if not entitled, content if entitled
```

---

## AI Integration (Server-Side Only)

OpenAI is called exclusively from Supabase Edge Functions. The API key never leaves the server.

### `generate-skill` Edge Function
```
Triggered by: user requests unknown skill
Input: skill name
Process: OpenAI generates full Skill JSON structure
Output: SkillGenerationJob row created with status 'review'
Note: One-time per skill, result saved permanently
```

### `generate-workout` Edge Function
```
Triggered by: user requests AI workout
Input: userId, targetStatId, targetGrade
Process: OpenAI receives user's current stat grades, returns exercise IDs
         (from the exercises table, not free-text)
Output: Routine object with DB exercise IDs
Note: AI must only return IDs that exist in the exercises table
```

---

## Security

### Critical rules
1. OpenAI key: Supabase Edge Function env var only
2. RLS: All user tables have `user_id = auth.uid()` policies
3. Content tables: SELECT only for authenticated users, no INSERT/UPDATE
4. Admin tables (pipeline_jobs, skill_generation_jobs): JWT role = 'admin' only
5. RevenueCat receipt validation: server-side via RevenueCat webhook → Supabase
6. Health data: Body measurements stored in user_profiles with explicit consent flag

### Auth Flow
```
App launch
  → Check Supabase session (AsyncStorage persisted)
  → Valid? → App
  → Expired? → Supabase refresh token → App
  → No session? → Auth screen
```

---

## Navigation Structure

```
RootNavigator (Stack)
├── Splash
├── Onboarding (3-4 slides) — first time only
├── Auth Stack
│   ├── Login
│   └── Register
└── App Stack (after auth)
    ├── Assessment Stack
    │   ├── GenderSelection
    │   ├── AssessmentIntro
    │   ├── StatTest (×10, one at a time)
    │   ├── GradeReveal (×10)
    │   └── FinalGradeReveal (cinematic)
    └── Main Tabs
        ├── Home
        │   ├── Character (Layer 1 — default)
        │   └── Dashboard (Layer 2 — swipe up)
        ├── Stats
        │   ├── StatsOverview
        │   └── StatDetail
        ├── Skills
        │   ├── MySkills
        │   ├── Discover
        │   └── SkillDetail
        ├── Train
        │   ├── TrainHome
        │   ├── BodyPartSelection
        │   ├── GradeTargeting
        │   ├── ManualBuilder
        │   └── WorkoutPlayer (modal stack)
        └── Profile
            ├── ProfileHome
            ├── Achievements
            ├── Settings
            └── Upgrade (paywall)
```

---

## Folder Structure

```
src/
  theme/
    tokens.ts          — all colors, spacing, typography, radius constants
    animations.ts      — Reanimated/Moti preset configs
    gradients.ts       — LinearGradient presets
  components/
    ui/                — Button, Card, Badge, StatBar, GradeBadge, SkeletonBox
    animated/          — AnimatedCard, StaggerList, SpringPressable, GradeReveal
    3d/                — CharacterScene, ModelLoader, AnimationMixer, MuscleHighlighter
  screens/
    auth/
    assessment/
    home/
    stats/
    skills/
    train/
    profile/
  features/
    assessment/        — scoring logic, grade calculation
    progression/       — XP, level, grade improvement logic
    workout/           — session tracking, XP rewards
    skills/            — skill progress, mastery checks
    entitlement/       — feature gating, paywall logic
  store/
    auth.store.ts
    workout.store.ts   — workout player state
    ui.store.ts        — modals, selections
  queries/
    stats.queries.ts
    skills.queries.ts
    exercises.queries.ts
    user.queries.ts
    config.queries.ts
  services/
    supabase.ts        — Supabase client
    revenuecat.ts      — RevenueCat initialization
    notifications.ts   — Expo Notifications
  navigation/
    RootNavigator.tsx
    types.ts
  types/
    db.types.ts        — generated from Supabase schema
    app.types.ts       — app-level types
  utils/
    grading.ts         — score → grade letter
    formatting.ts      — numbers, dates, units
docs/
  PRODUCT_SPEC.md
  ARCHITECTURE.md
  DESIGN_SYSTEM.md
  DATABASE_SCHEMA.md
  BUILD_ORDER.md
  ANIMATION_GUIDE.md
  PIPELINE.md
```
