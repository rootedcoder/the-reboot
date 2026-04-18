import React, { useEffect, useRef } from 'react';
import { View, Text, StyleSheet, Animated, Easing } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Stat } from '../types';
import { getProgress } from '../utils/progression';

type Props = {
  label: string;
  stat: Stat;
};

export function StatBar({ label, stat }: Props) {
  const progress = getProgress(stat);
  const animated = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(animated, {
      toValue: progress,
      duration: 650,
      easing: Easing.out(Easing.cubic),
      useNativeDriver: false,
    }).start();
  }, [animated, progress]);

  const width = animated.interpolate({
    inputRange: [0, 1],
    outputRange: ['0%', '100%'],
  });

  return (
    <View style={styles.container}>
      <View style={styles.row}>
        <Text style={styles.label}>{label.toUpperCase()}</Text>
        <Text style={styles.value}>Lv.{stat.level} · XP {stat.xp}</Text>
      </View>
      <View style={styles.track}>
        <Animated.View style={[styles.fillWrap, { width }]}> 
          <LinearGradient
            colors={['#22d3ee', '#7c3aed']}
            start={{ x: 0, y: 0.5 }}
            end={{ x: 1, y: 0.5 }}
            style={styles.fill}
          />
        </Animated.View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { marginBottom: 12 },
  row: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 6 },
  label: { color: '#e5e7eb', fontWeight: '700', letterSpacing: 0.8 },
  value: { color: '#94a3b8', fontSize: 12 },
  track: {
    height: 12,
    borderRadius: 999,
    backgroundColor: '#111827',
    borderWidth: 1,
    borderColor: '#1f2937',
    overflow: 'hidden',
  },
  fillWrap: { height: '100%' },
  fill: {
    height: '100%',
    shadowColor: '#22d3ee',
    shadowOpacity: 0.8,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 0 },
  },
});
