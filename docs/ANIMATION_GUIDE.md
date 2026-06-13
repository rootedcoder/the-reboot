# THE REBOOT — Animation Guide

## Philosophy
Every animation communicates something. Fast. Layered. Celebratory at the right moments. Never blocking.

Think of apps like Linear, Vercel, Raycast, or Framer's own site — everything has spring physics, staggered entrances, micro-interactions that make the interface feel physical. That's the target. Bring that to mobile.

---

## Stack

| Library | Purpose | When to use |
|---|---|---|
| **Reanimated 3** | UI-thread animations | gestures, scroll-driven, performance-critical |
| **Moti** | Declarative spring/timing | entrance animations, state transitions, layout changes |
| **Lottie** | JSON vector animations | grade reveals, celebrations, milestone moments |
| **React Navigation** | Screen transitions | custom slide/fade transitions per navigator |

**Never use:**
- `Animated` from React Native core (JS thread, causes jank)
- CSS transitions or Framer Motion (web only)
- `setTimeout` to fake animations

---

## Preset Configs

Define all of these in `src/theme/animations.ts` and import everywhere.

### Spring Presets
```typescript
export const springs = {
  // Snappy — for press feedback, small UI elements
  snappy: { type: 'spring' as const, damping: 20, stiffness: 400 },
  
  // Default — general card entrances, state changes
  default: { type: 'spring' as const, damping: 18, stiffness: 180 },
  
  // Gentle — large elements, page transitions
  gentle: { type: 'spring' as const, damping: 22, stiffness: 120 },
  
  // Bouncy — grade reveal, level up, celebrations
  bouncy: { type: 'spring' as const, damping: 10, stiffness: 100 },
  
  // Tight — number count-up, progress bars
  tight: { type: 'timing' as const, duration: 600, easing: Easing.out(Easing.cubic) },
}
```

### Entrance Presets
```typescript
export const entrance = {
  // Standard — every card, every screen
  fadeSlideUp: {
    from: { opacity: 0, translateY: 24 },
    animate: { opacity: 1, translateY: 0 },
    transition: springs.default,
  },
  
  // For grade badges, stat numbers
  fadeScale: {
    from: { opacity: 0, scale: 0.7 },
    animate: { opacity: 1, scale: 1 },
    transition: springs.bouncy,
  },
  
  // For side panels, drawers
  fadeSlideRight: {
    from: { opacity: 0, translateX: -20 },
    animate: { opacity: 1, translateX: 0 },
    transition: springs.gentle,
  },
}

export const stagger = {
  list: (index: number) => ({ delay: index * 60 }),       // standard lists
  cards: (index: number) => ({ delay: index * 80 }),      // larger cards
  assessment: (index: number) => ({ delay: index * 120 }), // grade reveals
}
```

---

## Patterns

### 1. Screen Entrance — every screen uses this
```tsx
import { MotiView } from 'moti'
import { entrance, stagger } from '@/theme/animations'

// Wrap each major section in a staggered MotiView
<MotiView {...entrance.fadeSlideUp} {...stagger.cards(0)}>
  <HeroCard />
</MotiView>
<MotiView {...entrance.fadeSlideUp} {...stagger.cards(1)}>
  <StatsSection />
</MotiView>
<MotiView {...entrance.fadeSlideUp} {...stagger.cards(2)}>
  <SkillsSection />
</MotiView>
```

### 2. Spring Press — every tappable element
```tsx
// src/components/animated/SpringPressable.tsx
import { useAnimatedStyle, useSharedValue, withSpring } from 'react-native-reanimated'
import Animated from 'react-native-reanimated'
import { Pressable } from 'react-native'

export function SpringPressable({ children, onPress, style }) {
  const scale = useSharedValue(1)
  
  const animStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }]
  }))
  
  return (
    <Pressable
      onPressIn={() => { scale.value = withSpring(0.96, { damping: 20, stiffness: 400 }) }}
      onPressOut={() => { scale.value = withSpring(1, { damping: 15, stiffness: 300 }) }}
      onPress={onPress}
    >
      <Animated.View style={[animStyle, style]}>
        {children}
      </Animated.View>
    </Pressable>
  )
}
```

### 3. Stagger List
```tsx
import { MotiView } from 'moti'

// Any list of items — cards, stats, exercises
{items.map((item, index) => (
  <MotiView
    key={item.id}
    from={{ opacity: 0, translateY: 16 }}
    animate={{ opacity: 1, translateY: 0 }}
    transition={{ type: 'spring', damping: 18, stiffness: 180, delay: index * 60 }}
  >
    <ItemCard item={item} />
  </MotiView>
))}
```

### 4. Grade Badge Reveal
```tsx
// Used in assessment flow, stat cards
<MotiView
  from={{ opacity: 0, scale: 0.4 }}
  animate={{ opacity: 1, scale: 1 }}
  transition={{ type: 'spring', damping: 10, stiffness: 100, delay }}
>
  <MotiView
    animate={{
      shadowRadius: [6, 18, 6],  // glow pulse after reveal
    }}
    transition={{ type: 'timing', duration: 1200, loop: false, repeatReverse: true }}
  >
    <GradeBadge grade={grade} size="large" />
  </MotiView>
</MotiView>
```

### 5. XP Bar Animated Fill
```tsx
// Reanimated 3 — smooth fill from prev to new value
import { useSharedValue, withSpring, useAnimatedStyle } from 'react-native-reanimated'

const progress = useSharedValue(prevXP / maxXP)

useEffect(() => {
  progress.value = withSpring(newXP / maxXP, { damping: 14, stiffness: 100 })
}, [newXP])

const barStyle = useAnimatedStyle(() => ({
  width: `${progress.value * 100}%`,
}))
```

### 6. Number Count-Up
```tsx
// For stat scores, XP numbers — Reanimated 3 derived value
import { useSharedValue, withTiming, useDerivedValue, Easing } from 'react-native-reanimated'
import Animated, { useAnimatedProps } from 'react-native-reanimated'

const animatedValue = useSharedValue(0)

useEffect(() => {
  animatedValue.value = withTiming(targetValue, {
    duration: 800,
    easing: Easing.out(Easing.cubic),
  })
}, [targetValue])

// Use with ReanimatedText or AnimatedText component
```

### 7. Skeleton Loading State
```tsx
// src/components/ui/SkeletonBox.tsx
// Shimmer effect using Reanimated — no spinners anywhere
import { useSharedValue, withRepeat, withTiming, interpolate } from 'react-native-reanimated'

const shimmer = useSharedValue(0)

useEffect(() => {
  shimmer.value = withRepeat(withTiming(1, { duration: 1200 }), -1, false)
}, [])

const shimmerStyle = useAnimatedStyle(() => ({
  opacity: interpolate(shimmer.value, [0, 0.5, 1], [0.3, 0.7, 0.3]),
}))

// Match exact shape/size of the content it replaces
```

---

## Key Moments (these must be outstanding)

### Assessment Grade Reveal (per stat)
```
1. Black screen with stat name fades in
2. Benchmark results count up (number animation)
3. Score number counts up to final value
4. Grade letter drops in from above with spring bounce
5. Grade color floods the background (fast, 300ms)
6. Glow pulse radiates from grade badge (2 pulses)
7. "Next stat →" appears with fade
```

### Final Grade Cinematic
```
1. "SYSTEM ASSESSMENT COMPLETE" text types in
2. All 10 stat grades fly in from left, staggered 120ms each
3. Brief pause (600ms)
4. Overall grade flies in large, center screen
5. Grade color fills background
6. "YOUR REBOOT BEGINS" types in below
7. Lottie confetti or particle burst
8. Continue button fades in
```

### Grade Improvement (stat moves up)
```
1. Old grade fades out (scale down + opacity 0)
2. New grade scales in with bouncy spring
3. Background pulses with new grade color
4. XP bar refills with spring animation
5. Quick haptic feedback
```

### Workout Session Complete
```
1. XP numbers burst upward (particle style using Moti)
2. Stat bars fill to new values (spring, staggered)
3. "QUEST COMPLETE" text slams in
4. Session stats fade in below (duration, exercises, XP)
5. Continue button appears
```

---

## Screen Transitions (React Navigation)

```typescript
// Drill-down (list → detail): horizontal slide
// Modal / player: vertical slide up
// Tab switch: cross-fade (no slide — tabs feel immediate)
// Assessment per-stat: swipe left (one stat at a time)

// Custom transition in navigationOptions:
cardStyleInterpolator: CardStyleInterpolators.forHorizontalIOS
// or custom:
cardStyleInterpolator: ({ current, layouts }) => ({
  cardStyle: {
    transform: [{
      translateX: current.progress.interpolate({
        inputRange: [0, 1],
        outputRange: [layouts.screen.width, 0],
      }),
    }],
  },
})
```

---

## Timing Reference
```
micro (press feedback)        100–150ms
fast (badge/tag entrance)     180–250ms
normal (card entrance)        280–380ms
slow (grade reveal)           450–700ms
cinematic (full assessment)   1500–3000ms (with stagger)
```

## Anti-Patterns (never do these)
- `setTimeout` to sequence animations — use Moti's `delay` prop or Reanimated sequences
- Linear easing for anything visible — always spring or ease-out-cubic
- `Animated.timing` from RN core — use Reanimated 3
- Blocking animations — user should always be able to tap through
- Identical entrance animations for every element — vary translation direction based on element position
- Animations longer than 400ms for routine interactions — save long animations for milestone moments
