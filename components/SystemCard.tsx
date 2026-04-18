import React, { PropsWithChildren } from 'react';
import { StyleSheet, View, Text } from 'react-native';

type Props = PropsWithChildren<{ title: string }>;

export function SystemCard({ title, children }: Props) {
  return (
    <View style={styles.card}>
      <Text style={styles.title}>{title}</Text>
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#111827',
    borderRadius: 14,
    padding: 16,
    borderWidth: 1,
    borderColor: '#1f2937',
    marginBottom: 14,
  },
  title: { color: '#f3f4f6', fontSize: 17, fontWeight: '700', marginBottom: 10 },
});
