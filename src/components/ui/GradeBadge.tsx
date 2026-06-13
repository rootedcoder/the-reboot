import React from 'react';
import { StyleSheet, Text, ViewStyle } from 'react-native';
import Animated from 'react-native-reanimated';
import { colors, radius, fontSize, fontWeight, letterSpacing } from '../../theme/tokens';
import type { Grade } from '../../theme/tokens';

interface GradeBadgeProps {
  grade: Grade;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  style?: ViewStyle;
}

export function GradeBadge({ grade, size = 'md', style }: GradeBadgeProps) {
  const gradeColor = colors.grade[grade];
  const glowColor = colors.gradeGlow[grade];
  const bgColor = colors.gradeDim[grade];
  const s = sizeMap[size];

  return (
    <Animated.View
      style={[
        styles.base,
        {
          backgroundColor: bgColor,
          borderColor: gradeColor,
          paddingVertical: s.py,
          paddingHorizontal: s.px,
          shadowColor: glowColor,
          shadowOffset: { width: 0, height: 0 },
          shadowOpacity: 1,
          shadowRadius: s.glow,
          elevation: 6,
        },
        style,
      ]}
    >
      <Text
        style={[
          styles.text,
          {
            color: gradeColor,
            fontSize: s.fontSize,
            textShadowColor: glowColor,
            textShadowRadius: s.textGlow,
          },
        ]}
      >
        {grade}
      </Text>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  base: {
    borderRadius: radius.sm,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  text: {
    fontWeight: fontWeight.black,
    letterSpacing: letterSpacing.wide,
  },
});

const sizeMap = {
  sm:  { py: 1,  px: 6,  fontSize: fontSize.xs,   glow: 6,  textGlow: 4 },
  md:  { py: 3,  px: 10, fontSize: fontSize.base,  glow: 10, textGlow: 6 },
  lg:  { py: 5,  px: 14, fontSize: fontSize.xl,    glow: 14, textGlow: 8 },
  xl:  { py: 8,  px: 20, fontSize: fontSize['3xl'],glow: 20, textGlow: 14 },
};
