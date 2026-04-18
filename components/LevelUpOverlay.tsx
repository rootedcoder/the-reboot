import React, { useEffect, useRef } from 'react';
import { Animated, StyleSheet, Text } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

type Props = {
  level: number;
  visible: boolean;
  label?: string;
};

export function LevelUpOverlay({ level, visible, label }: Props) {
  const opacity = useRef(new Animated.Value(0)).current;
  const scale = useRef(new Animated.Value(0.8)).current;

  useEffect(() => {
    if (!visible) return;

    opacity.setValue(0);
    scale.setValue(0.8);

    Animated.sequence([
      Animated.parallel([
        Animated.timing(opacity, { toValue: 1, duration: 250, useNativeDriver: true }),
        Animated.spring(scale, { toValue: 1.05, friction: 6, useNativeDriver: true }),
      ]),
      Animated.delay(900),
      Animated.timing(opacity, { toValue: 0, duration: 500, useNativeDriver: true }),
    ]).start();
  }, [visible, opacity, scale]);

  if (!visible) return null;

  return (
    <Animated.View style={[styles.overlay, { opacity }]}> 
      <Animated.View style={{ transform: [{ scale }] }}>
        <LinearGradient colors={['rgba(34,211,238,0.9)', 'rgba(124,58,237,0.95)']} style={styles.banner}>
          <Text style={styles.title}>LEVEL UP</Text>
          {!!label && <Text style={styles.label}>{label}</Text>}
          <Text style={styles.level}>Level {level}</Text>
        </LinearGradient>
      </Animated.View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  overlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 100,
    backgroundColor: 'rgba(0,0,0,0.45)',
  },
  banner: {
    width: 280,
    borderRadius: 18,
    paddingVertical: 20,
    paddingHorizontal: 22,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.45)',
  },
  title: {
    color: '#fff',
    fontWeight: '900',
    fontSize: 30,
    letterSpacing: 2,
  },
  label: { color: '#e2e8f0', marginTop: 4, textTransform: 'uppercase', fontWeight: '700' },
  level: {
    color: '#f8fafc',
    marginTop: 6,
    fontSize: 18,
    fontWeight: '700',
  },
});
