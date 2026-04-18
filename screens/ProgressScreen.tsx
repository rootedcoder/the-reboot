import React from 'react';
import { ScrollView, StyleSheet } from 'react-native';
import { StatBar } from '../components/StatBar';
import { SystemCard } from '../components/SystemCard';
import { PrimaryButton } from '../components/PrimaryButton';
import { useAppStore } from '../store/useAppStore';

export function ProgressScreen() {
  const { stats, upgradeStat, statPoints } = useAppStore((s) => s);

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <SystemCard title={`Progress Matrix · Points: ${statPoints}`}>
        {Object.values(stats).map((stat) => (
          <React.Fragment key={stat.key}>
            <StatBar label={stat.key} stat={stat} />
            <PrimaryButton label={`+1 ${stat.key}`} onPress={() => upgradeStat(stat.key)} style={styles.button} />
          </React.Fragment>
        ))}
      </SystemCard>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#09090b' },
  content: { padding: 16, paddingBottom: 40 },
  button: { marginBottom: 12, backgroundColor: '#334155' },
});
