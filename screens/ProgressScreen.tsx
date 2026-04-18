import React, { useState } from 'react';
import { ScrollView, StyleSheet, Text } from 'react-native';
import { StatBar } from '../components/StatBar';
import { SystemCard } from '../components/SystemCard';
import { PrimaryButton } from '../components/PrimaryButton';
import { useAppStore } from '../store/useAppStore';
import { AssessmentModal } from '../components/AssessmentModal';
import { StatKey } from '../types';

export function ProgressScreen() {
  const { stats, gainStatXp, assessStat } = useAppStore((s) => s);
  const [activeAssessment, setActiveAssessment] = useState<StatKey | undefined>(undefined);
  const [result, setResult] = useState<string>('');

  return (
    <>
      <ScrollView style={styles.container} contentContainerStyle={styles.content}>
        <SystemCard title="Progress Matrix">
          {Object.values(stats).map((stat) => (
            <React.Fragment key={stat.key}>
              <StatBar label={stat.key} stat={stat} />
              <PrimaryButton label={`Train ${stat.key} (+30 XP)`} onPress={() => gainStatXp(stat.key, 30)} style={styles.button} />
              {stat.readyForAssessment ? (
                <PrimaryButton label="Start Assessment" onPress={() => setActiveAssessment(stat.key)} style={styles.assess} />
              ) : (
                <Text style={styles.waiting}>Train more to unlock assessment</Text>
              )}
            </React.Fragment>
          ))}
          {!!result && <Text style={styles.result}>{result}</Text>}
        </SystemCard>
      </ScrollView>

      <AssessmentModal
        visible={!!activeAssessment}
        stat={activeAssessment}
        title={`${activeAssessment?.toUpperCase()} Assessment`}
        onClose={() => setActiveAssessment(undefined)}
        onSubmit={(payload) => {
          if (!activeAssessment) return;
          const response = assessStat(activeAssessment, payload);
          setResult(response.message);
          setActiveAssessment(undefined);
        }}
      />
    </>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#09090b' },
  content: { padding: 16, paddingBottom: 40 },
  button: { marginBottom: 6, backgroundColor: '#334155' },
  assess: { marginBottom: 10, backgroundColor: '#0f766e' },
  waiting: { color: '#64748b', fontSize: 12, marginBottom: 12 },
  result: { marginTop: 8, color: '#f8fafc', fontWeight: '700' },
});
