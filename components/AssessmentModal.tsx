import React, { useState } from 'react';
import { Modal, StyleSheet, Text, TextInput, View } from 'react-native';
import { PrimaryButton } from './PrimaryButton';
import { AssessmentPayload, StatKey } from '../types';

type Props = {
  visible: boolean;
  title: string;
  stat?: StatKey;
  onClose: () => void;
  onSubmit: (payload: AssessmentPayload) => void;
};

export function AssessmentModal({ visible, title, stat, onClose, onSubmit }: Props) {
  const [reps, setReps] = useState('');
  const [distance, setDistance] = useState('');
  const [time, setTime] = useState('');
  const [tapScore, setTapScore] = useState('');

  const submit = () => {
    onSubmit({
      reps: reps ? Number(reps) : undefined,
      distanceKm: distance ? Number(distance) : undefined,
      timeMin: time ? Number(time) : undefined,
      tapScore: tapScore ? Number(tapScore) : undefined,
      confirmed: true,
    });
    setReps('');
    setDistance('');
    setTime('');
    setTapScore('');
  };

  return (
    <Modal transparent visible={visible} animationType="fade">
      <View style={styles.overlay}>
        <View style={styles.card}>
          <Text style={styles.title}>{title}</Text>
          {stat === 'strength' && <TextInput style={styles.input} value={reps} onChangeText={setReps} keyboardType="numeric" placeholder="Reps completed" placeholderTextColor="#6b7280" />}
          {stat === 'endurance' && (
            <>
              <TextInput style={styles.input} value={distance} onChangeText={setDistance} keyboardType="numeric" placeholder="Distance km" placeholderTextColor="#6b7280" />
              <TextInput style={styles.input} value={time} onChangeText={setTime} keyboardType="numeric" placeholder="Time min" placeholderTextColor="#6b7280" />
            </>
          )}
          {stat === 'agility' && <TextInput style={styles.input} value={tapScore} onChangeText={setTapScore} keyboardType="numeric" placeholder="Tap test score" placeholderTextColor="#6b7280" />}
          {!stat || (stat !== 'strength' && stat !== 'endurance' && stat !== 'agility') ? (
            <Text style={styles.sub}>Confirm you completed the assessment protocol.</Text>
          ) : null}

          <PrimaryButton label="Submit Assessment" onPress={submit} style={styles.btn} />
          <PrimaryButton label="Cancel" onPress={onClose} style={styles.cancel} />
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: 'rgba(0,0,0,0.5)' },
  card: {
    width: '90%',
    backgroundColor: '#111827',
    borderWidth: 1,
    borderColor: '#334155',
    borderRadius: 14,
    padding: 16,
  },
  title: { color: '#fff', fontWeight: '800', fontSize: 20, marginBottom: 12 },
  sub: { color: '#cbd5e1', marginBottom: 12 },
  input: {
    borderWidth: 1,
    borderColor: '#475569',
    borderRadius: 10,
    padding: 12,
    color: '#fff',
    marginBottom: 10,
    backgroundColor: '#0b1220',
  },
  btn: { marginTop: 4 },
  cancel: { marginTop: 8, backgroundColor: '#1f2937' },
});
