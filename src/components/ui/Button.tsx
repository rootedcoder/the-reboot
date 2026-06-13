import React from 'react';
import { Pressable, Text, StyleSheet, ViewStyle, TextStyle } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
} from 'react-native-reanimated';
import * as Haptics from 'expo-haptics';
import { colors, spacing, radius, fontSize, fontWeight } from '../../theme/tokens';
import { springConfig } from '../../theme/animations';
import { gradients } from '../../theme/gradients';
import { LinearGradient } from 'expo-linear-gradient';

type Variant = 'primary' | 'secondary' | 'ghost' | 'danger';
type Size = 'sm' | 'md' | 'lg';

interface ButtonProps {
  label: string;
  onPress: () => void;
  variant?: Variant;
  size?: Size;
  disabled?: boolean;
  fullWidth?: boolean;
  style?: ViewStyle;
  textStyle?: TextStyle;
}

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

export function Button({
  label,
  onPress,
  variant = 'primary',
  size = 'md',
  disabled = false,
  fullWidth = false,
  style,
  textStyle,
}: ButtonProps) {
  const scale = useSharedValue(1);

  const animStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
    opacity: disabled ? 0.45 : 1,
  }));

  const handlePressIn = () => {
    scale.value = withSpring(0.96, springConfig.press);
    if (!disabled) Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
  };

  const handlePressOut = () => {
    scale.value = withSpring(1, springConfig.release);
  };

  const sizeStyle = sizes[size];

  if (variant === 'primary') {
    return (
      <AnimatedPressable
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        onPress={disabled ? undefined : onPress}
        style={[animStyle, fullWidth && styles.fullWidth, style]}
      >
        <LinearGradient
          colors={gradients.brand}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          style={[styles.base, sizeStyle.container]}
        >
          <Text style={[styles.text, sizeStyle.text, textStyle]}>{label}</Text>
        </LinearGradient>
      </AnimatedPressable>
    );
  }

  return (
    <AnimatedPressable
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      onPress={disabled ? undefined : onPress}
      style={[
        animStyle,
        styles.base,
        sizeStyle.container,
        variantStyles[variant],
        fullWidth && styles.fullWidth,
        style,
      ]}
    >
      <Text style={[styles.text, sizeStyle.text, variantTextStyles[variant], textStyle]}>
        {label}
      </Text>
    </AnimatedPressable>
  );
}

const styles = StyleSheet.create({
  base: {
    borderRadius: radius.md,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
  },
  fullWidth: { width: '100%' },
  text: {
    fontWeight: fontWeight.bold,
    color: colors.text.primary,
  },
});

const sizes = {
  sm: {
    container: { paddingVertical: spacing[2], paddingHorizontal: spacing[3], minHeight: 36 },
    text: { fontSize: fontSize.sm },
  },
  md: {
    container: { paddingVertical: spacing[3], paddingHorizontal: spacing[5], minHeight: 48 },
    text: { fontSize: fontSize.base },
  },
  lg: {
    container: { paddingVertical: spacing[4], paddingHorizontal: spacing[6], minHeight: 56 },
    text: { fontSize: fontSize.md },
  },
};

const variantStyles: Record<Exclude<Variant, 'primary'>, ViewStyle> = {
  secondary: {
    backgroundColor: colors.bg.elevated,
    borderWidth: 1,
    borderColor: colors.border.default,
  },
  ghost: {
    backgroundColor: 'transparent',
  },
  danger: {
    backgroundColor: 'rgba(239,68,68,0.15)',
    borderWidth: 1,
    borderColor: colors.error,
  },
};

const variantTextStyles: Record<Exclude<Variant, 'primary'>, TextStyle> = {
  secondary: { color: colors.text.primary },
  ghost: { color: colors.text.secondary },
  danger: { color: colors.error },
};
