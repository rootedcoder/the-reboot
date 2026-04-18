import React, { useRef } from 'react';
import { Pressable, Text, StyleSheet, ViewStyle, Animated } from 'react-native';

type Props = {
  label: string;
  onPress: () => void;
  style?: ViewStyle;
  disabled?: boolean;
};

export function PrimaryButton({ label, onPress, style, disabled = false }: Props) {
  const scale = useRef(new Animated.Value(1)).current;

  const animateTo = (toValue: number) => {
    Animated.spring(scale, { toValue, useNativeDriver: true, friction: 5 }).start();
  };

  return (
    <Pressable
      onPressIn={() => !disabled && animateTo(0.97)}
      onPressOut={() => !disabled && animateTo(1)}
      onPress={onPress}
      disabled={disabled}
    >
      <Animated.View style={[styles.button, disabled && styles.disabled, style, { transform: [{ scale }] }]}>
        <Text style={styles.text}>{label}</Text>
      </Animated.View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    backgroundColor: '#7c3aed',
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 52,
  },
  text: { color: '#fff', fontWeight: '700', fontSize: 16 },
  disabled: { opacity: 0.55 },
});
