import React from 'react';
import { Pressable, Text, StyleSheet, ViewStyle } from 'react-native';

type Props = {
  label: string;
  onPress: () => void;
  style?: ViewStyle;
};

export function PrimaryButton({ label, onPress, style }: Props) {
  return (
    <Pressable style={[styles.button, style]} onPress={onPress}>
      <Text style={styles.text}>{label}</Text>
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
});
