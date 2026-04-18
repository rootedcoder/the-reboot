import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { PrimaryButton } from '../components/PrimaryButton';
import { SystemCard } from '../components/SystemCard';
import { useWorkoutPlayer } from '../hooks/useWorkoutPlayer';
import { useAppStore } from '../store/useAppStore';

export function WorkoutPlayerScreen() {
  const workout = useAppStore((s) => s.workouts[0]);
  const gainStatXp = useAppStore((s) => s.gainStatXp);
  const { currentStep, isRest, timeLeft, isRunning, start, pause, skip, progressText, stepIndex } = useWorkoutPlayer(workout);

  const completeAndReward = () => {
    if (!workout) return;
    gainStatXp('endurance', 80);
    gainStatXp('strength', 40);
  };

  return (
    <View style={styles.container}>
      <SystemCard title={workout?.title ?? 'No workout'}>
        <Text style={styles.progress}>{progressText}</Text>
        <Text style={styles.exercise}>{currentStep?.title ?? 'No active step'}</Text>
        <Text style={styles.mode}>{isRest ? 'REST' : 'WORK'}</Text>
        <Text style={styles.timer}>{timeLeft}s</Text>
      </SystemCard>

      <PrimaryButton label={isRunning ? 'Pause' : 'Start'} onPress={isRunning ? pause : start} style={styles.btn} />
      <PrimaryButton label="Skip Step" onPress={skip} style={styles.altBtn} />
      <PrimaryButton
        label="Complete Quest (+XP)"
        onPress={completeAndReward}
        style={styles.completeBtn}
      />

      <Text style={styles.footer}>Current step index: {stepIndex + 1}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#09090b', padding: 16 },
  progress: { color: '#cbd5e1', marginBottom: 8 },
  exercise: { color: '#fff', fontSize: 24, fontWeight: '800', marginBottom: 10 },
  mode: { color: '#22d3ee', fontWeight: '700', fontSize: 16 },
  timer: { color: '#fff', fontSize: 56, fontWeight: '800', marginVertical: 12 },
  btn: { marginBottom: 8 },
  altBtn: { marginBottom: 8, backgroundColor: '#334155' },
  completeBtn: { backgroundColor: '#059669' },
  footer: { color: '#64748b', marginTop: 14, textAlign: 'center' },
});
