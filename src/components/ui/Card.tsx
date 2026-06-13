import React from 'react';
import { StyleSheet, ViewStyle } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
} from 'react-native-reanimated';
import { Pressable } from 'react-native';
import { colors, spacing, radius } from '../../theme/tokens';
import { springConfig } from '../../theme/animations';

interface CardProps {
  children: React.ReactNode;
  onPress?: () => void;
  style?: ViewStyle;
  glow?: boolean;
  glowColor?: string;
  noPadding?: boolean;
}

export function Card({ children, onPress, style, glow, glowColor, noPadding }: CardProps) {
  const scale = useSharedValue(1);

  const animStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  const glowStyle: ViewStyle = glow
    ? {
        shadowColor: glowColor ?? colors.brand.purple,
        shadowOffset: { width: 0, height: 0 },
        shadowOpacity: 0.4,
        shadowRadius: 12,
        elevation: 8,
      }
    : {};

  const inner = (
    <Animated.View
      style={[
        styles.card,
        !noPadding && styles.padding,
        glowStyle,
        animStyle,
        style,
      ]}
    >
      {children}
    </Animated.View>
  );

  if (!onPress) return inner;

  return (
    <Pressable
      onPressIn={() => { scale.value = withSpring(0.98, springConfig.press); }}
      onPressOut={() => { scale.value = withSpring(1, springConfig.release); }}
      onPress={onPress}
    >
      {inner}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.bg.surface,
    borderRadius: radius.lg,
    borderWidth: 1,
    borderColor: colors.border.default,
  },
  padding: {
    padding: spacing[4],
  },
});
