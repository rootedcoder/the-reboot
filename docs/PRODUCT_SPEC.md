# THE REBOOT — Product Specification v1.0
*May 2026*

## 1. Product Vision

The Reboot is a React Native fitness RPG where your real physical capacity determines your character. Inspired by the Solo Leveling "System" concept.

**One line:** A fitness system where you level up yourself — not a generic avatar.

Your body is your character. Your real benchmarks define your stats. Your stats define your grade. Your grade defines your training. Everything is personalized, procedural, and data-driven.

---

## 2. The Two Products

### Product 1 — The App
The fitness RPG experience. Assessment → Grading → Stats → Skills → Workouts → Progression. React Native mobile app (iOS and Android). Offline-first, premium animated experience.

### Product 2 — The Content Pipeline
Internal tooling to feed the app's DB with dynamic content.
```
Video / Motion Capture Input
        ↓
Pose Estimation Engine (MediaPipe / WHAM)
        ↓
Keyframe Extraction + Cleanup
        ↓
3D Preview + Dev Approval
        ↓
Exercise / Skill Database (Supabase)
        ↓
The App consumes it
```
Instead of manually animating every exercise, the pipeline processes any demonstration video and converts it into structured, reusable animation data.

---

## 3. Stat System (10 Core Stats — DB-driven)

| Stat | What It Measures | Key Benchmark Tests |
|---|---|---|
| Strength | Raw muscular force | Pull-ups, push-ups, max lift |
| Stamina | Cardiovascular endurance | Distance run, time before exhaustion |
| Agility | Speed of direction change | Ladder drills, direction change tests |
| Speed | Raw movement velocity | Sprint time (40m / 100m) |
| Flexibility | Range of motion | Sit & reach, splits depth, shoulder mobility |
| Jump Force | Lower body explosive output | Vertical jump height, broad jump |
| Grip Strength | Hand and forearm strength | Dead hang time, grip test |
| Balance | Stability and proprioception | Single leg hold, balance tests |
| Endurance | Static muscular endurance | Plank hold, wall sit, isometric holds |
| Explosive Power | Full body power output | Burpee count, clap push-ups, jump squats |

**Key principles:**
- Stats are database-driven — list is expandable without code changes
- Every stat has multiple benchmark tests — average becomes the stat score
- Stats are interconnected — training one skill improves multiple stats
- No age adjustments — grades reflect real capability

### Gender Awareness
Benchmarks differ by gender. The grade (S to F) means the same thing for everyone — what changes is the benchmark number that maps to each grade.

- **Male** — male benchmark ranges
- **Female** — female benchmark ranges
- **Neutral** — averaged benchmark ranges

A woman hitting 10 pull-ups earns the same S grade as a man hitting 21.

**Benchmark sources:** ACE, NSCA, US Military fitness standards, WHO/CDC, sports science research.

---

## 4. Grading System

| Grade | Score Range | Meaning | Color |
|---|---|---|---|
| S | 95–100 | Elite / near superhuman | `#FFD700` Gold |
| A | 80–94 | Advanced athlete | `#7c3aed` Purple |
| B | 65–79 | Above average | `#22d3ee` Cyan |
| C | 50–64 | Average / functional | `#22c55e` Green |
| D | 35–49 | Below average | `#eab308` Yellow |
| E | 20–34 | Beginner | `#f97316` Orange |
| F | 0–19 | Needs foundation work | `#ef4444` Red |

### How Scoring Works
1. Each stat has multiple benchmark tests
2. Each test result maps to a score (0–100) based on gender-specific ranges
3. Test scores average into a final stat score
4. Stat score maps to a letter grade
5. All 10 stat scores average into overall character score and grade

### Reassessment Triggers
- **Scheduled:** Full reassessment every 4 weeks (all 10 stats)
- **Event-triggered:** When a skill levels up, only stats linked to that skill are reassessed

---

## 5. Skill System

### Architecture — Dynamic + Curated Hybrid
- Curated seed database ships with app (well-structured, common skills)
- New skills added through AI-assisted pipeline — user searches → AI generates → dev reviews → published
- No community contributions — quality controlled, commercially protected
- AI runs once per skill — output is fixed data, not live generation

### Skill Addition Flow
```
User searches for a skill
        ↓
Found in DB? → YES → Show full skill detail
        ↓ NO
AI generates skill structure (one-time)
        ↓
Dev reviews for quality and accuracy
        ↓
Animation pipeline runs for technique demos
        ↓
Published to DB permanently
        ↓
Available to all users
```

### Skill Categories (DB-driven, expandable)
Calisthenics · Gymnastics · Martial Arts (Modern) · Traditional / Cultural Arts · Combat Sports · Acrobatics / Tricking · Weapon Arts · Movement Arts (Parkour, Breakdancing)

### Traditional Arts Examples
Kalari Payattu · Adimurai · Silambam · Capoeira · Wushu · Pencak Silat · Kalaripayattu variants

### Skill Schema (TypeScript)
```typescript
Skill {
  id: string
  name: string
  origin: string
  category: SkillCategory
  description: string
  difficulty: 'beginner' | 'intermediate' | 'advanced' | 'elite'
  relatedStats: string[]
  levels: SkillLevel[]
  source: 'curated' | 'ai_generated'
  isPublished: boolean
}

SkillLevel {
  level: number
  name: string
  techniques: Technique[]
  masteryRequirements: {
    minStatGrades: { statId: string, minGrade: string }[]
    techniquesCompleted: string[]
    minimumTrainingSessions: number
  }
  trainingRoutine: TrainingRoutine
}
```

---

## 6. Workout System

### Three Entry Points
1. **Body Part Selection (Paid)** — 3D interactive body model, tap muscle group → grade-scaled exercises
2. **Grade Improvement Targeting** — select stat + target grade → structured routine with clear path ("You're at C in Strength. To reach B you need X pull-ups...")
3. **Manual Routine Builder** — handpick exercises, sets, reps, rest times. Grade awareness warns if too advanced.

All three feed into a unified weekly calendar view.

### Grade Scaling
Every exercise has grade-specific parameters. Example — Pull-up:
- Grade F: 1–3 reps, 4 sets, 90s rest, assisted if needed
- Grade C: 7–10 reps, 4 sets, 60s rest
- Grade A: 16–20 reps, 5 sets, 45s rest
- Grade S: 21+ reps, 5 sets, 30s rest

### Workout Player
- Current exercise display with 3D demo (paid) or text instructions (free)
- Sets / reps / rest timer
- Pause / skip / auto-next
- Session summary on completion
- XP gained and stat progress updated

---

## 7. Free vs Paid Tiers

| Feature | Free | Trial (14d) | Monthly | Yearly |
|---|---|---|---|---|
| Full stat assessment (all 10) | ✅ | ✅ | ✅ | ✅ |
| View full grade profile | ✅ | ✅ | ✅ | ✅ |
| Stat improvement routines | 3 stats only | All | All | All |
| Skill additions | 1 skill | Unlimited | Unlimited | Unlimited |
| Skill level progression | Level 1 only | All | All | All |
| Skill training guidance | Text only | 3D guided | 3D guided | 3D guided |
| Body part selection + 3D model | ❌ | ✅ | ✅ | ✅ |
| Grade targeting (all stats) | ❌ | ✅ | ✅ | ✅ |
| Manual routine builder | Basic | Full | Full | Full |
| AI skill discovery | ❌ | ✅ | ✅ | ✅ |
| 3D exercise demo model | ❌ | ✅ | ✅ | ✅ |

**No lifetime plan.** AI token costs are ongoing. Full assessment is always free — it's the emotional hook.

---

## 8. Screen Map (~28–32 screens)

### Auth Flow
Splash → Onboarding (3–4 slides) → Login/Register (Google / Apple / Facebook / Email)
No guest mode.

### Assessment Flow
Gender Selection → Assessment Intro → Per-Stat Test Screens (animated) → Per-stat grade reveal → Full Grade Profile Cinematic Reveal

### Main App — Tab Structure
Home · Stats · Skills · Train · Profile

### Home Screen
- **Layer 1:** Fullscreen 3D character — floating stats, highlighted trained muscles, overall grade, idle animation, XP bar
- **Layer 2 (swipe up):** Dashboard — today's actionables, active routines, skill training due, streak

### Stats Screen
All 10 stat cards with grade + animated progress bar → Stat Detail (benchmark breakdown, history graph, grade targeting)

### Skills Screen
My Skills tab · Discover tab (search, categories, AI pipeline trigger) · Skill Detail (progression tree, techniques, mastery requirements)

### Train Screen
Body Part Selection · Grade Targeting · Manual Routine Builder · Skill Training → Workout Player

### Profile Screen
User info · Full grade card · Subscription status · Achievements · Settings · Reassessment trigger

---

## 9. No Guest Mode
Users must register. Full assessment is the emotional hook — seeing your complete grade profile creates enough value to justify registration.

---

## 10. Revision History
- v1.0 May 2026 — Initial specification. Product owner + Claude (Anthropic).
