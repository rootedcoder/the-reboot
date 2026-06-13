# THE REBOOT — Design System

## Visual Direction
Dark, cinematic. Deep blacks, glowing accents. Stats and grades feel like a game HUD, not a fitness tracker. The 3D character model is the hero element of the main screen.

---

## Color Tokens

### Backgrounds
```
background.base     #09090b   — main app background
background.surface  #111827   — cards, modals
background.elevated #1f2937   — elevated cards, overlays
background.input    #0b1220   — text inputs
```

### Brand
```
brand.purple        #7c3aed   — primary accent, Grade A
brand.cyan          #22d3ee   — secondary accent, Grade B
brand.purple.dim    #4c1d95   — subtle purple bg
brand.cyan.dim      #083344   — subtle cyan bg
```

### Grade Colors
```
grade.S   #FFD700   Gold
grade.A   #7c3aed   Purple
grade.B   #22d3ee   Cyan
grade.C   #22c55e   Green
grade.D   #eab308   Yellow
grade.E   #f97316   Orange
grade.F   #ef4444   Red
```

### Grade Glow (shadow colors, 40% opacity)
```
grade.S.glow   rgba(255,215,0,0.4)
grade.A.glow   rgba(124,58,237,0.4)
grade.B.glow   rgba(34,211,238,0.4)
grade.C.glow   rgba(34,197,94,0.4)
grade.D.glow   rgba(234,179,8,0.4)
grade.E.glow   rgba(249,115,22,0.4)
grade.F.glow   rgba(239,68,68,0.4)
```

### Text
```
text.primary    #f8fafc
text.secondary  #cbd5e1
text.muted      #64748b
text.disabled   #374151
```

### Border
```
border.default  #1f2937
border.subtle   #111827
border.accent   #312e81
```

---

## Typography

```
font.display     — size: 36, weight: 900, tracking: tight   (grade reveals, hero numbers)
font.heading1    — size: 28, weight: 800
font.heading2    — size: 22, weight: 700
font.heading3    — size: 18, weight: 700
font.body        — size: 14, weight: 400
font.bodyBold    — size: 14, weight: 600
font.caption     — size: 11, weight: 500, tracking: wide, uppercase
font.mono        — size: 13, weight: 600   (stats, numbers, timers)
```

---

## Spacing Scale
```
space.1   4px
space.2   8px
space.3   12px
space.4   16px
space.5   20px
space.6   24px
space.8   32px
space.10  40px
space.12  48px
space.16  64px
```

---

## Border Radius
```
radius.sm   8px    — inputs, tags
radius.md   12px   — cards
radius.lg   16px   — large cards, modals
radius.xl   24px   — hero cards
radius.full 9999px — pills, badges
```

---

## Animation System

### Philosophy
Think Framer Motion on the web. Spring physics. Staggered entrances. Layout animations that feel physical. Every element should feel like it has weight.

**Never:** instant state swaps, linear easing, animations that block interaction.
**Always:** spring physics for anything interactive, stagger on lists, entrance animations on every screen.

### Stack
- **Reanimated 3** — all performant UI-thread animations (never `Animated` from RN core)
- **Moti** — declarative spring/timing API (Framer Motion feel in RN)
- **Lottie** — celebration moments only (grade reveal cinematic, level up, milestones)

### Animation Presets

#### Entrance — fade + slide up (every screen, every card)
```typescript
// Moti
from={{ opacity: 0, translateY: 20 }}
animate={{ opacity: 1, translateY: 0 }}
transition={{ type: 'spring', damping: 18, stiffness: 180 }}
```

#### Stagger List (delay per item index)
```typescript
delay={index * 60}  // 60ms per item
```

#### Spring Press (all tappable elements)
```typescript
// Reanimated 3 worklet
scale.value = withSpring(0.95, { damping: 15, stiffness: 300 })
// on release
scale.value = withSpring(1, { damping: 12, stiffness: 200 })
```

#### Grade Reveal (assessment, stat cards)
```typescript
// Scale up from 0.4 + fade in + glow pulse
from={{ opacity: 0, scale: 0.4 }}
animate={{ opacity: 1, scale: 1 }}
transition={{ type: 'spring', damping: 12, stiffness: 120, delay: index * 120 }}
// Follow with glow pulse — 2 cycles then settle
```

#### XP Bar Fill
```typescript
// Animated width from previous value to new value
// Spring with overshoot — feels satisfying
transition={{ type: 'spring', damping: 14, stiffness: 100 }}
```

#### Number Count-Up (stat scores, XP numbers)
```typescript
// Reanimated 3 derived value
// Count from previous value to new over 800ms
// Use withTiming + custom easing (ease-out)
```

#### Screen Transition
```typescript
// React Navigation custom transition
// Horizontal slide for drill-down
// Vertical slide up for modals / player
// Fade for tab switches
```

#### Skeleton Loading
```typescript
// Shimmer left-to-right using Reanimated interpolation
// Never use spinners
// Match exact shape of the content it's loading
```

### Timing Guide
```
micro (press feedback)     150ms
fast (card entrance)       200–280ms
normal (screen transition) 300–380ms
slow (grade reveal)        500–800ms
cinematic (full reveal)    1500–3000ms (with stagger)
```

### Key Animated Moments (these matter most)
1. **Per-stat grade reveal** — assessment, each grade flies in with spring + glow burst
2. **Final overall grade cinematic** — all 10 stats reveal with stagger, then overall grade drops in last
3. **Grade improvement** — stat moves up a letter, color transitions, glow expands
4. **Skill level up** — pulsing ring expansion, level number count-up
5. **Workout session complete** — XP numbers burst up, stat bars fill
6. **Streak milestone** — Lottie confetti burst

---

## Component Patterns

### Cards
- Dark surface (`background.surface`)
- 1px border (`border.default`)
- Subtle inner glow on press (`brand.purple` at 10% opacity)
- Spring press animation on every card

### Buttons — Primary
- Background: `brand.purple` → gradient to `brand.cyan` on press
- Text: white, `font.bodyBold`
- Spring press: scale 0.97
- Haptic feedback on press

### Buttons — Secondary
- Background: transparent, border `border.default`
- On press: background fills to `background.elevated`

### Grade Badge
- Pill shape, grade color background at 15% opacity
- Grade color border
- Grade color text
- Glow shadow with grade.glow color

### Stat Bar
- Track: `background.elevated`
- Fill: gradient from `brand.purple` to `brand.cyan`
- Animated fill (spring) on value change
- Grade letter badge at right edge

### XP Bar (global)
- Fixed at bottom of character screen
- Ultra-thin (4px height)
- Cyan fill with glow
- Count-up number animation on XP gain

---

## Glow Effects
Used on: grade badges, active stat bars, character model stats, CTA buttons, level-up moments.

```
textShadow / boxShadow:
  0 0 12px [gradeColor at 60%]
  0 0 24px [gradeColor at 30%]
```

For React Native: `shadowColor`, `shadowRadius`, `elevation` + supplementary Skia glow layer for key elements.
