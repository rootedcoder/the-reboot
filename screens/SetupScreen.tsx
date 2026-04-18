import React, { useMemo, useState } from 'react';
import { ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';
import { PrimaryButton } from '../components/PrimaryButton';
import { SystemCard } from '../components/SystemCard';
import { useAppStore } from '../store/useAppStore';

const parseNum = (value: string) => (value ? Number(value) : undefined);

export function SetupScreen() {
  const completeSetup = useAppStore((s) => s.completeSetup);
  const [step, setStep] = useState(1);

  const [age, setAge] = useState('');
  const [weight, setWeight] = useState('');
  const [height, setHeight] = useState('');
  const [goal, setGoal] = useState('');

  const [maxPushups, setMaxPushups] = useState('');
  const [maxWeightLifted, setMaxWeightLifted] = useState('');
  const [runningDistanceKm, setRunningDistanceKm] = useState('');
  const [runningTimeMin, setRunningTimeMin] = useState('');
  const [jumpHeightCm, setJumpHeightCm] = useState('');
  const [gripStrengthKg, setGripStrengthKg] = useState('');

  const canProceed = useMemo(() => step === 2 || (age && weight && height && goal), [age, weight, height, goal, step]);

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Text style={styles.heading}>System Initialization</Text>
      <Text style={styles.sub}>Step {step}/2</Text>

      {step === 1 ? (
        <SystemCard title="Basic Profile">
          <TextInput placeholder="Age" placeholderTextColor="#6b7280" keyboardType="numeric" value={age} onChangeText={setAge} style={styles.input} />
          <TextInput placeholder="Weight (kg)" placeholderTextColor="#6b7280" keyboardType="numeric" value={weight} onChangeText={setWeight} style={styles.input} />
          <TextInput placeholder="Height (cm)" placeholderTextColor="#6b7280" keyboardType="numeric" value={height} onChangeText={setHeight} style={styles.input} />
          <TextInput placeholder="Fitness Goal" placeholderTextColor="#6b7280" value={goal} onChangeText={setGoal} style={styles.input} />
        </SystemCard>
      ) : (
        <SystemCard title="Capability Scan (Optional)">
          <TextInput placeholder="Max Pushups" placeholderTextColor="#6b7280" keyboardType="numeric" value={maxPushups} onChangeText={setMaxPushups} style={styles.input} />
          <TextInput placeholder="Max Weight Lifted (kg)" placeholderTextColor="#6b7280" keyboardType="numeric" value={maxWeightLifted} onChangeText={setMaxWeightLifted} style={styles.input} />
          <TextInput placeholder="Running Distance (km)" placeholderTextColor="#6b7280" keyboardType="numeric" value={runningDistanceKm} onChangeText={setRunningDistanceKm} style={styles.input} />
          <TextInput placeholder="Running Time (min)" placeholderTextColor="#6b7280" keyboardType="numeric" value={runningTimeMin} onChangeText={setRunningTimeMin} style={styles.input} />
          <TextInput placeholder="Jump Height (cm)" placeholderTextColor="#6b7280" keyboardType="numeric" value={jumpHeightCm} onChangeText={setJumpHeightCm} style={styles.input} />
          <TextInput placeholder="Grip Strength (kg)" placeholderTextColor="#6b7280" keyboardType="numeric" value={gripStrengthKg} onChangeText={setGripStrengthKg} style={styles.input} />
        </SystemCard>
      )}

      {step === 1 ? (
        <PrimaryButton label="Next: Capability Scan" onPress={() => canProceed && setStep(2)} />
      ) : (
        <View>
          <PrimaryButton
            label="Complete Setup"
            onPress={() =>
              completeSetup(
                { age: Number(age), weight: Number(weight), height: Number(height), goal },
                {
                  maxPushups: parseNum(maxPushups),
                  maxWeightLifted: parseNum(maxWeightLifted),
                  runningDistanceKm: parseNum(runningDistanceKm),
                  runningTimeMin: parseNum(runningTimeMin),
                  jumpHeightCm: parseNum(jumpHeightCm),
                  gripStrengthKg: parseNum(gripStrengthKg),
                }
              )
            }
          />
          <PrimaryButton label="Back" onPress={() => setStep(1)} style={styles.backButton} />
        </View>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#09090b' },
  content: { padding: 16, paddingBottom: 40 },
  heading: { color: '#fff', fontSize: 28, fontWeight: '800', marginBottom: 4 },
  sub: { color: '#9ca3af', marginBottom: 16 },
  input: {
    borderWidth: 1,
    borderColor: '#374151',
    borderRadius: 10,
    color: '#fff',
    padding: 12,
    marginBottom: 10,
    backgroundColor: '#0b1220',
  },
  backButton: { marginTop: 8, backgroundColor: '#1f2937' },
});
