import React from 'react';
import { Pressable, ViewStyle } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
} from 'react-native-reanimated';
import { springConfig } from '../../theme/animations';

interface SpringPressableProps {
  children: React.ReactNode;
  onPress?: () => void;
  onLongPress?: () => void;
  style?: ViewStyle;
  scaleTo?: number;
  disabled?: boolean;
}

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

export function SpringPressable({
  children,
  onPress,
  onLongPress,
  style,
  scaleTo = 0.96,
  disabled = false,
}: SpringPressableProps) {
  const scale = useSharedValue(1);

  const animStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  return (
    <AnimatedPressable
      onPressIn={() => { scale.value = withSpring(scaleTo, springConfig.press); }}
      onPressOut={() => { scale.value = withSpring(1, springConfig.release); }}
      onPress={disabled ? undefined : onPress}
      onLongPress={disabled ? undefined : onLongPress}
      style={[animStyle, style]}
    >
      {children}
    </AnimatedPressable>
  );
}
