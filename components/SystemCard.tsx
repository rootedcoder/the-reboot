import React, { PropsWithChildren } from 'react';
import { StyleSheet, View, Text } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

type Props = PropsWithChildren<{ title: string; glow?: boolean }>;

export function SystemCard({ title, children, glow = false }: Props) {
  return (
    <LinearGradient
      colors={glow ? ['rgba(34,211,238,0.18)', 'rgba(124,58,237,0.22)'] : ['#111827', '#111827']}
      style={[styles.card, glow && styles.glow]}
    >
      <Text style={styles.title}>{title}</Text>
      <View>{children}</View>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: 14,
    padding: 16,
    borderWidth: 1,
    borderColor: '#1f2937',
    marginBottom: 14,
    overflow: 'hidden',
  },
  glow: {
    shadowColor: '#7c3aed',
    shadowOpacity: 0.45,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 0 },
  },
  title: { color: '#f3f4f6', fontSize: 17, fontWeight: '700', marginBottom: 10, letterSpacing: 0.4 },
});
