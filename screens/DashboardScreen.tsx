import React, { useEffect, useRef, useState } from 'react';
import { ScrollView, StyleSheet, Text, TextInput, View, Animated, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { LinearGradient } from 'expo-linear-gradient';
import { PrimaryButton } from '../components/PrimaryButton';
import { StatBar } from '../components/StatBar';
import { SystemCard } from '../components/SystemCard';
import { useAppStore } from '../store/useAppStore';
import { RootStackParamList } from '../features/navigation/RootNavigator';
import { StatKey } from '../types';
import { LevelUpOverlay } from '../components/LevelUpOverlay';
import { generateWorkout } from '../services/aiWorkoutService';

type NavProp = NativeStackNavigationProp<RootStackParamList>;

export function DashboardScreen() {
  const navigation = useNavigation<NavProp>();
  const {
    displayName,
    userLevel,
    statPoints,
    stats,
    target,
    setTarget,
    workouts,
    skills,
    setCurrentWorkout,
    lastLevelUpEvent,
    clearLevelUpEvent,
  } = useAppStore((s) => s);
  const [targetStat, setTargetStat] = useState<StatKey>('endurance');
  const [targetLevel, setTargetLevel] = useState('50');
  const [isGeneratingWorkout, setIsGeneratingWorkout] = useState(false);
  const pulse = useRef(new Animated.Value(0.95)).current;

  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(pulse, { toValue: 1, duration: 1800, useNativeDriver: true }),
        Animated.timing(pulse, { toValue: 0.95, duration: 1800, useNativeDriver: true }),
      ])
    ).start();
  }, [pulse]);

  useEffect(() => {
    if (!lastLevelUpEvent) return;
    const t = setTimeout(clearLevelUpEvent, 1700);
    return () => clearTimeout(t);
  }, [lastLevelUpEvent, clearLevelUpEvent]);

  const onGenerateWorkout = async () => {
    try {
      setIsGeneratingWorkout(true);
      const generated = await generateWorkout({
        userStats: stats,
        targetStat: target?.stat ?? 'endurance',
        skill: skills[0]?.name,
      });
      setCurrentWorkout(generated);
      navigation.navigate('WorkoutPlayer');
    } catch (error) {
      setCurrentWorkout(workouts[0]);
      Alert.alert('AI Generation Failed', 'Using default quest workout for now.');
      navigation.navigate('WorkoutPlayer');
    } finally {
      setIsGeneratingWorkout(false);
    }
  };

  return (
    <View style={styles.root}>
      <LevelUpOverlay
        level={lastLevelUpEvent?.level ?? userLevel}
        visible={!!lastLevelUpEvent}
        label={lastLevelUpEvent ? `${lastLevelUpEvent.type}: ${lastLevelUpEvent.name}` : undefined}
      />
      <ScrollView style={styles.container} contentContainerStyle={styles.content}>
        <LinearGradient colors={['rgba(124,58,237,0.35)', 'rgba(34,211,238,0.15)']} style={styles.heroCard}>
          <Text style={styles.heading}>Welcome, {displayName}</Text>
          <Text style={styles.heroSub}>SYSTEM ONLINE · ASCENT ACTIVE</Text>
        </LinearGradient>

        <Animated.View style={{ transform: [{ scale: pulse }] }}>
          <SystemCard title="Rank" glow>
            <Text style={styles.level}>Level {userLevel}</Text>
            <Text style={styles.meta}>Available Stat Points: {statPoints}</Text>
          </SystemCard>
        </Animated.View>

        <SystemCard title="Stat Interface" glow>
          {Object.values(stats).map((stat) => (
            <View key={stat.key}>
              <StatBar label={stat.key} stat={stat} />
              {stat.readyForAssessment ? <Text style={styles.ready}>Assessment Available</Text> : null}
            </View>
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
          {isGeneratingWorkout ? <Text style={styles.generating}>Generating AI Workout...</Text> : null}
          <PrimaryButton
            label={isGeneratingWorkout ? 'Generating...' : 'Start AI Workout'}
            onPress={onGenerateWorkout}
            style={isGeneratingWorkout ? styles.disabledBtn : undefined}
            disabled={isGeneratingWorkout}
          />
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: '#09090b' },
  container: { flex: 1, backgroundColor: '#09090b' },
  content: { padding: 16, paddingBottom: 42 },
  heroCard: {
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#312e81',
    padding: 16,
    marginBottom: 14,
  },
  heading: { color: '#fff', fontSize: 24, fontWeight: '800', marginBottom: 4 },
  heroSub: { color: '#93c5fd', letterSpacing: 1, fontSize: 12, fontWeight: '700' },
  level: { color: '#22d3ee', fontSize: 30, fontWeight: '900', textShadowColor: '#22d3ee', textShadowRadius: 10 },
  ready: { color: '#facc15', marginTop: -8, marginBottom: 10, fontWeight: '700' },
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
  generating: { color: '#22d3ee', marginBottom: 8, fontWeight: '700' },
  disabledBtn: { opacity: 0.6 },
  quickSection: { marginBottom: 24 },
});
