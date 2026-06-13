# THE REBOOT — Build Order

## Two Parallel Tracks
The app and content pipeline are built in parallel. By the time Phase 11 needs 3D animations, the pipeline has already produced the data.

---

## App Track

### Phase 1 — Foundation
**Goal:** Every subsequent phase builds on this. Nothing gets coded before this is solid.

- [ ] Supabase project created — region, auth config, email templates
- [ ] DB schema applied — all tables from DATABASE_SCHEMA.md
- [ ] RLS policies applied
- [ ] AppConfig seeded with initial values
- [ ] Stats table seeded — 10 stats
- [ ] `src/theme/tokens.ts` — all color tokens, spacing, typography, radius, grade colors
- [ ] `src/theme/animations.ts` — Reanimated/Moti preset configs (entrance, spring press, stagger)
- [ ] `src/theme/gradients.ts` — gradient presets
- [ ] `src/components/ui/` — Button, Card, Badge, StatBar, GradeBadge, SkeletonBox
- [ ] `src/components/animated/` — AnimatedCard, StaggerList, SpringPressable
- [ ] React Query installed + QueryClient configured
- [ ] Reanimated 3 installed + configured in babel.config.js
- [ ] Moti installed
- [ ] Supabase JS client configured
- [ ] DB types generated from Supabase schema
- [ ] Old prototype code removed (screens/, store/, components/ — keep structure + theme base)

**Exit criteria:** Design system renders correctly. Supabase connection works. React Query fetches from DB.

---

### Phase 2 — Auth
- [ ] Splash screen with animated logo (Moti + Lottie)
- [ ] Onboarding slides — 3–4 slides, swipe gesture, spring transitions, skip option
- [ ] Login screen — Google, Apple, Facebook, Email/Password via Supabase Auth
- [ ] Register screen — same providers + email form
- [ ] Auth state in Zustand (session persisted via AsyncStorage)
- [ ] Protected navigation — redirect to auth if no session
- [ ] RevenueCat initialized with user ID on login
- [ ] Error states — on-brand, not generic red boxes

**No guest mode.**

**Exit criteria:** User can register, log in, session persists across app restarts.

---

### Phase 3 — Assessment Engine
- [ ] Benchmark test data seeded — all 10 stats, male/female/neutral grade ranges
- [ ] Gender selection screen (animated 3-way selector)
- [ ] Assessment intro screen — what to expect, equipment needed, animated preview
- [ ] Per-stat test screens — one at a time, animated instructions, input method per stat
- [ ] Score calculation — test result → score (0–100) based on DB ranges
- [ ] Per-stat grade reveal — animated grade letter with glow in grade color
- [ ] `UserStatProfile` rows created in Supabase on assessment complete
- [ ] `UserOverallGrade` computed and saved
- [ ] Cinematic final grade reveal — all 10 stats stagger in, overall grade drops last (Lottie)
- [ ] Reassessment flow — full and partial — same screens, different trigger text

**Exit criteria:** A new user completes assessment, grades are stored in Supabase, visible on next load.

---

### Phase 4 — Core Data Seeding
- [ ] Exercise library (initial 50+ exercises) — muscles, grade scaling, animation placeholders
- [ ] Skill categories seeded (8 categories)
- [ ] Initial curated skills — 20–30 skills including Kalari, Silambam, Adimurai, Capoeira, Wushu, Calisthenics, Boxing, MMA, Gymnastics
- [ ] Skill levels, techniques, mastery requirements seeded per skill
- [ ] Benchmark data verified against ACE/NSCA/military sources
- [ ] Grade ranges reviewed and confirmed accurate

**Exit criteria:** App can query full exercise + skill library from Supabase.

---

### Phase 5 — Home Screen
- [ ] Layer 1 — React Three Fiber 3D scene
  - [ ] male.glb loaded (placeholder model initially)
  - [ ] female.glb loaded (placeholder model initially)
  - [ ] Idle animation playing
  - [ ] Stat grade badges floating beside body
  - [ ] Today's trained muscles highlighted
  - [ ] Overall grade displayed prominently with grade color glow
  - [ ] XP bar at bottom — animated fill
  - [ ] Gender-based model swap from user profile
- [ ] Layer 2 — Dashboard (swipe up gesture)
  - [ ] Today's actionables — scheduled workouts, skills due
  - [ ] Active routines
  - [ ] Streak counter with celebration animation on milestones
  - [ ] Quick stat snapshot (all 10, tap to go to stat detail)
- [ ] Smooth gesture transition between Layer 1 and Layer 2

**Exit criteria:** Home screen renders with 3D model, dashboard data loads from Supabase.

---

### Phase 6 — Stats Screen
- [ ] Stats overview — 10 cards with animated grade badge + XP bar, staggered entrance
- [ ] Grade color coding throughout (S=Gold, A=Purple, B=Cyan, etc.)
- [ ] Stat detail screen
  - [ ] Large animated grade display with glow
  - [ ] Score breakdown per benchmark test (tap to see what each test contributed)
  - [ ] Progress bar to next grade with percentage
  - [ ] Historical grade graph — smooth animated chart
  - [ ] Linked skills — tappable
  - [ ] Reassessment button for this stat
- [ ] Grade targeting screen (Paid) — projected timeline, routine generator
- [ ] Feature gate on grade targeting — paywall if free tier

**Exit criteria:** All stat data renders from Supabase. Grade colors consistent throughout.

---

### Phase 7 — Skills Screen
- [ ] My Skills tab — active skills, per-skill level + progress, last trained
- [ ] Discover tab — search, category browse with animated category tiles
- [ ] AI pipeline trigger for unknown skills — "Request this skill" → SkillGenerationJob
- [ ] Skill detail screen
  - [ ] Skill info — name, origin, category, description, difficulty
  - [ ] Related stats (tappable → stat detail)
  - [ ] Visual progression tree — all levels, current position highlighted
  - [ ] Mastery requirements per level — checklist with completion states
  - [ ] Techniques list per level
  - [ ] Training routine for current level
  - [ ] Text guidance (free) — technique instructions, tips, common mistakes
  - [ ] 3D demo (paid) — technique animation via 3D model (placeholder until Phase 11)
- [ ] Feature gates on 3D guidance + advanced levels

**Exit criteria:** Skill tree renders from Supabase. Add/remove skills works. Mastery tracking works.

---

### Phase 8 — Train Screen + Workout Player
- [ ] Train home — three entry points clearly presented
- [ ] Body Part Selection (Paid)
  - [ ] 3D body model — tappable muscle groups
  - [ ] Exercises for tapped muscle at user's current grade
  - [ ] → Workout Player
- [ ] Grade Targeting
  - [ ] Stat selector + target grade selector
  - [ ] Progression path display ("You're at C. To reach B in 8 weeks...")
  - [ ] Generated routine from DB exercises
  - [ ] → Workout Player
- [ ] Manual Routine Builder
  - [ ] Create routine with name, target days
  - [ ] Exercise library — search + filter by muscle/grade
  - [ ] Configure sets/reps/rest per exercise
  - [ ] Save routine
- [ ] Workout Player
  - [ ] Current exercise display (text instructions — 3D in Phase 11)
  - [ ] Sets / reps / rest timer — animated countdown
  - [ ] Pause / skip / auto-next
  - [ ] Session summary on completion — XP burst animation, stat bars fill
  - [ ] Progress written to Supabase (workout_sessions, stat_progress_updates)
- [ ] AI workout generation via Supabase Edge Function (returns DB exercise IDs)

**Exit criteria:** User can complete a workout session. Data writes to Supabase correctly.

---

### Phase 9 — Profile Screen
- [ ] User info — name, gender, avatar (Supabase Storage)
- [ ] Full grade card — all 10 stats in one view
- [ ] Subscription status — tier, renewal date
- [ ] Achievements — DB-seeded milestones, unlock logic, animated unlock moment
- [ ] Reassessment trigger — full (all 10 stats) or partial (select stats)
- [ ] Settings
  - [ ] Units toggle (kg/lbs, km/miles) — writes to Supabase user row
  - [ ] Notification preferences
  - [ ] Account management (change name, delete account, data export)
  - [ ] Logout

---

### Phase 10 — Payments
- [ ] RevenueCat products configured — iOS + Android
- [ ] Paywall screen — visual, shows what's unlocked, trial/monthly/yearly clearly presented
- [ ] `EntitlementGate` component — wraps any paid feature
- [ ] Feature gate checks throughout app using AppConfig from Supabase
- [ ] Trial countdown visible in profile
- [ ] Trial expiry → automatic drop to free limits
- [ ] Restore purchase
- [ ] RevenueCat webhook → Supabase Edge Function → update user_subscriptions

---

### Phase 11 — 3D Demo Integration
- [ ] Final male.glb and female.glb from Blender (requires Pipeline Phase 1–4 complete)
- [ ] BoneKeyframe JSON playback working in AnimationMixer
- [ ] Exercise demo in Workout Player — model plays exercise animation
- [ ] Muscle mesh highlighting synchronized with current exercise
- [ ] Skill technique walkthroughs — step-by-step with pause points
- [ ] Smooth transition in/out of 3D demo mode
- [ ] Text fallback confirmed working for free tier

---

### Phase 12 — Polish
- [ ] Lottie animations — grade reveal cinematic, level up, streak milestone
- [ ] All `Animated.*` (RN core) replaced with Reanimated 3 / Moti
- [ ] Every screen entrance has staggered fade+slide-up
- [ ] Every tappable element has spring press animation
- [ ] Skeleton loading states on all data-loading screens
- [ ] Error states — on-brand (not red boxes with "Something went wrong")
- [ ] Empty states — motivational, with action CTA
- [ ] Performance audit — memoization, lazy loading, image optimization
- [ ] Offline handling confirmed — clear messaging when offline

---

### Phase 13 — Pre-Launch
- [ ] Expo Notifications — reassessment reminders, workout streak, trial ending
- [ ] Analytics — key event tracking (assessment complete, first workout, subscription)
- [ ] App Store screenshots + description
- [ ] Play Store assets
- [ ] Beta testing build
- [ ] Bug fixes from beta
- [ ] App Store / Play Store submission

---

## Pipeline Track (Parallel)

### Pipeline Phase 1 (alongside App Phase 1)
- [ ] Blender: male athletic rig built, Mixamo bone naming convention set
- [ ] Blender: female athletic rig built, same bone naming
- [ ] Bone naming convention document finalized

### Pipeline Phase 2 (alongside App Phase 2)
- [ ] MediaPipe + WHAM environment set up
- [ ] Python script: joint positions → rig bone names
- [ ] Python script: keyframe smoother/cleaner

### Pipeline Phase 3 (alongside App Phase 3)
- [ ] Benchmark data verified from public sources (ACE, NSCA, military)
- [ ] Grade ranges finalized, ready to seed

### Pipeline Phase 4 (alongside App Phase 4)
- [ ] Initial 50+ exercises processed — Mixamo + CMU sources
- [ ] Animation JSON formatted per animation_data schema
- [ ] Admin tool (Next.js) basic version: job queue view, 3D preview, approve/reject
- [ ] First 20–30 skills animated through pipeline

### Pipeline Ongoing (alongside App Phases 5–10)
- [ ] More exercises added continuously
- [ ] More skills processed as needed
- [ ] Admin tool refined with better preview + editing tools

### Pipeline Ready (before App Phase 11)
- [ ] Full initial exercise library animated and approved
- [ ] All seeded skills fully animated
- [ ] Preview and approval workflow stable
- [ ] male.glb and female.glb exported and uploaded to Supabase Storage

---

## What to Delete from the Prototype

Before Phase 1 coding starts, remove:
```
screens/AuthScreen.tsx           → replace with proper Supabase auth
screens/SetupScreen.tsx          → replace with proper assessment flow
screens/DashboardScreen.tsx      → replace with Home (3D + dashboard)
screens/ProgressScreen.tsx       → replace with Stats screen
screens/SkillsScreen.tsx         → replace with proper Skills screen
screens/WorkoutPlayerScreen.tsx  → replace with proper player
store/useAppStore.ts             → replace with Zustand slices + React Query
components/AssessmentModal.tsx   → replace with full assessment screens
components/LevelUpOverlay.tsx    → replace with Lottie celebration
components/StatBar.tsx           → keep as base, restyle with tokens
components/SystemCard.tsx        → keep as base, restyle with tokens
components/PrimaryButton.tsx     → keep as base, add spring press animation
data/workouts.ts                 → replace with DB-driven exercises
utils/progression.ts             → replace with grading.ts
hooks/useWorkoutPlayer.ts        → keep, extend for new player
services/aiWorkoutService.ts     → replace with Supabase Edge Function call
```
