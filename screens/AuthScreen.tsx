import React, { useState } from 'react';
import { View, Text, TextInput, StyleSheet } from 'react-native';
import { useAppStore } from '../store/useAppStore';
import { PrimaryButton } from '../components/PrimaryButton';

export function AuthScreen() {
  const [username, setUsername] = useState('');
  const login = useAppStore((s) => s.login);
  const register = useAppStore((s) => s.register);
  const continueAsGuest = useAppStore((s) => s.continueAsGuest);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>THE REBOOT</Text>
      <Text style={styles.subtitle}>Awaken your system and begin your ascent.</Text>
      <TextInput
        placeholder="User Name"
        placeholderTextColor="#6b7280"
        value={username}
        onChangeText={setUsername}
        style={styles.input}
      />
      <PrimaryButton label="Login" onPress={() => login(username || 'Guest')} style={styles.btn} />
      <PrimaryButton label="Register" onPress={() => register(username || 'User')} style={styles.btn} />
      <PrimaryButton label="Continue as Guest" onPress={continueAsGuest} style={styles.btnAlt} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#09090b', padding: 20, justifyContent: 'center' },
  title: { color: '#f9fafb', fontSize: 36, fontWeight: '800', marginBottom: 8, textAlign: 'center' },
  subtitle: { color: '#9ca3af', fontSize: 15, marginBottom: 28, textAlign: 'center' },
  input: {
    borderWidth: 1,
    borderColor: '#374151',
    borderRadius: 12,
    color: '#fff',
    padding: 14,
    marginBottom: 14,
    backgroundColor: '#111827',
  },
  btn: { marginBottom: 10 },
  btnAlt: { backgroundColor: '#1f2937', marginTop: 6 },
});
