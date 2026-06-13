import React, { useEffect } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
} from 'react-native-reanimated';
import { LinearGradient } from 'expo-linear-gradient';
import { colors, spacing, radius, fontSize, fontWeight } from '../../theme/tokens';
import { gradients } from '../../theme/gradients';
import { GradeBadge } from './GradeBadge';
import { gradeFromScore } from '../../theme/tokens';
import type { Grade } from '../../theme/tokens';

interface StatBarProps {
  label: string;
  score: number;          // 0–100
  grade?: Grade;          // if not passed, derived from score
  showGrade?: boolean;
  animated?: boolean;
}

export function StatBar({ label, score, grade, showGrade = true, animated = true }: StatBarProps) {
  const resolvedGrade = grade ?? gradeFromScore(score);
  const gradeColor = colors.grade[resolvedGrade];
  const progress = useSharedValue(0);

  useEffect(() => {
    const target = Math.min(Math.max(score, 0), 100) / 100;
    if (animated) {
      progress.value = withSpring(target, { damping: 14, stiffness: 100 });
    } else {
      progress.value = target;
    }
  }, [score]);

  const fillStyle = useAnimatedStyle(() => ({
    width: `${progress.value * 100}%`,
  }));

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.label}>{label}</Text>
        <View style={styles.right}>
          <Text style={[styles.score, { color: gradeColor }]}>{Math.round(score)}</Text>
          {showGrade && <GradeBadge grade={resolvedGrade} size="sm" style={styles.badge} />}
        </View>
      </View>
      <View style={styles.track}>
        <Animated.View style={[styles.fillWrapper, fillStyle]}>
          <LinearGradient
            colors={gradients.xpBar}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={styles.fill}
          />
        </Animated.View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { marginBottom: spacing[3] },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing[1],
  },
  label: {
    color: colors.text.secondary,
    fontSize: fontSize.sm,
    fontWeight: fontWeight.semibold,
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  right: { flexDirection: 'row', alignItems: 'center', gap: spacing[2] },
  score: { fontSize: fontSize.sm, fontWeight: fontWeight.bold },
  badge: {},
  track: {
    height: 6,
    backgroundColor: colors.bg.elevated,
    borderRadius: radius.full,
    overflow: 'hidden',
  },
  fillWrapper: { height: '100%' },
  fill: { flex: 1, borderRadius: radius.full },
});
