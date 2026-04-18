import React, { useEffect, useRef, useState } from 'react';
import { Animated, StyleSheet, Text, View, Vibration } from 'react-native';
import { PrimaryButton } from '../components/PrimaryButton';
import { SystemCard } from '../components/SystemCard';
import { useWorkoutPlayer } from '../hooks/useWorkoutPlayer';
import { useAppStore } from '../store/useAppStore';
import { LevelUpOverlay } from '../components/LevelUpOverlay';

export function WorkoutPlayerScreen() {
  const workout = useAppStore((s) => s.workouts[0]);
  const gainStatXp = useAppStore((s) => s.gainStatXp);
  const { currentStep, isRest, timeLeft, isRunning, start, pause, skip, progressText, stepIndex } = useWorkoutPlayer(workout);
  const [questComplete, setQuestComplete] = useState(false);

  const pulse = useRef(new Animated.Value(1)).current;
  const timerScale = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    Animated.sequence([
      Animated.timing(pulse, { toValue: 1.03, duration: 220, useNativeDriver: true }),
      Animated.timing(pulse, { toValue: 1, duration: 220, useNativeDriver: true }),
    ]).start();
  }, [stepIndex, pulse]);

  useEffect(() => {
    Animated.sequence([
      Animated.timing(timerScale, { toValue: 0.96, duration: 350, useNativeDriver: true }),
      Animated.timing(timerScale, { toValue: 1, duration: 350, useNativeDriver: true }),
    ]).start();
  }, [timeLeft, timerScale]);

  const completeAndReward = () => {
    if (!workout) return;
    gainStatXp('endurance', 80);
    gainStatXp('strength', 40);
    setQuestComplete(true);
    Vibration.vibrate(80);
    setTimeout(() => setQuestComplete(false), 1200);
  };

  return (
    <View style={styles.container}>
      <LevelUpOverlay visible={questComplete} level={stepIndex + 1} label="Quest Complete" />
      <Animated.View style={{ transform: [{ scale: pulse }] }}>
        <SystemCard title={workout?.title ?? 'No workout'} glow>
          <Text style={styles.progress}>{progressText}</Text>
          <Text style={[styles.exercise, !isRest && styles.activeExercise]}>{currentStep?.title ?? 'No active step'}</Text>
          <Text style={styles.mode}>{isRest ? 'REST' : 'WORK'}</Text>
          <Animated.Text style={[styles.timer, { transform: [{ scale: timerScale }] }]}>{timeLeft}s</Animated.Text>
        </SystemCard>
      </Animated.View>

      <PrimaryButton label={isRunning ? 'Pause' : 'Start'} onPress={isRunning ? pause : start} style={styles.btn} />
      <PrimaryButton label="Skip Step" onPress={skip} style={styles.altBtn} />
      <PrimaryButton label="Complete Quest (+XP)" onPress={completeAndReward} style={styles.completeBtn} />

      <Text style={styles.footer}>Current step index: {stepIndex + 1}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#09090b', padding: 16 },
  progress: { color: '#cbd5e1', marginBottom: 8 },
  exercise: { color: '#fff', fontSize: 24, fontWeight: '800', marginBottom: 10 },
  activeExercise: { textShadowColor: '#22d3ee', textShadowRadius: 12 },
  mode: { color: '#22d3ee', fontWeight: '700', fontSize: 16 },
  timer: { color: '#fff', fontSize: 56, fontWeight: '800', marginVertical: 12 },
  btn: { marginBottom: 8 },
  altBtn: { marginBottom: 8, backgroundColor: '#334155' },
  completeBtn: { backgroundColor: '#059669' },
  footer: { color: '#64748b', marginTop: 14, textAlign: 'center' },
});
