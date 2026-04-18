import React, { useState } from 'react';
import { ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { PrimaryButton } from '../components/PrimaryButton';
import { StatBar } from '../components/StatBar';
import { SystemCard } from '../components/SystemCard';
import { useAppStore } from '../store/useAppStore';
import { RootStackParamList } from '../features/navigation/RootNavigator';
import { StatKey } from '../types';

type NavProp = NativeStackNavigationProp<RootStackParamList>;

export function DashboardScreen() {
  const navigation = useNavigation<NavProp>();
  const { user, userLevel, statPoints, stats, target, setTarget, workouts } = useAppStore((s) => s);
  const [targetStat, setTargetStat] = useState<StatKey>('endurance');
  const [targetLevel, setTargetLevel] = useState('50');

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Text style={styles.heading}>Welcome, {user?.username ?? 'Hunter'}</Text>
      <SystemCard title="Hunter Rank">
        <Text style={styles.level}>Level {userLevel}</Text>
        <Text style={styles.meta}>Available Stat Points: {statPoints}</Text>
      </SystemCard>

      <SystemCard title="Stat Interface">
        {Object.values(stats).map((stat) => (
          <StatBar key={stat.key} label={stat.key} stat={stat} />
        ))}
      </SystemCard>

      <SystemCard title="Target Protocol">
        <Text style={styles.meta}>Active Target: {target ? `${target.stat} → Lv.${target.level}` : 'None'}</Text>
        <TextInput
          value={targetStat}
          onChangeText={(v) => setTargetStat(v as StatKey)}
          style={styles.input}
          placeholder="stat (e.g. endurance)"
          placeholderTextColor="#6b7280"
        />
        <TextInput
          value={targetLevel}
          onChangeText={setTargetLevel}
          style={styles.input}
          placeholder="target level"
          keyboardType="numeric"
          placeholderTextColor="#6b7280"
        />
        <PrimaryButton label="Set Target" onPress={() => setTarget(targetStat, Number(targetLevel) || 0)} />
      </SystemCard>

      <View style={styles.quickSection}>
        <PrimaryButton
          label={`Quick Start: ${workouts[0]?.title ?? 'Workout'}`}
          onPress={() => navigation.navigate('WorkoutPlayer')}
        />
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#09090b' },
  content: { padding: 16, paddingBottom: 42 },
  heading: { color: '#fff', fontSize: 24, fontWeight: '800', marginBottom: 12 },
  level: { color: '#22d3ee', fontSize: 28, fontWeight: '800' },
  meta: { color: '#cbd5e1', marginBottom: 10 },
  input: {
    borderWidth: 1,
    borderColor: '#374151',
    borderRadius: 10,
    color: '#fff',
    padding: 12,
    marginBottom: 10,
    backgroundColor: '#0b1220',
  },
  quickSection: { marginBottom: 24 },
});
