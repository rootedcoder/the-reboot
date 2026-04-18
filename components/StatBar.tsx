import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Stat } from '../types';
import { getProgress } from '../utils/progression';

type Props = {
  label: string;
  stat: Stat;
};

export function StatBar({ label, stat }: Props) {
  const progress = getProgress(stat);
  return (
    <View style={styles.container}>
      <View style={styles.row}>
        <Text style={styles.label}>{label.toUpperCase()}</Text>
        <Text style={styles.value}>Lv.{stat.level} · XP {stat.xp}</Text>
      </View>
      <View style={styles.track}>
        <View style={[styles.fill, { width: `${progress * 100}%` }]} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { marginBottom: 12 },
  row: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 6 },
  label: { color: '#e5e7eb', fontWeight: '700' },
  value: { color: '#94a3b8', fontSize: 12 },
  track: { height: 10, borderRadius: 6, backgroundColor: '#1f2937', overflow: 'hidden' },
  fill: { height: '100%', backgroundColor: '#22d3ee' },
});
