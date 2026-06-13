import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { useAuthStore } from '../store/auth.store';

// Placeholder screens — replaced in Phase 2+
import { View, Text, StyleSheet } from 'react-native';
import { colors } from '../theme/tokens';

function PlaceholderScreen({ name }: { name: string }) {
  return (
    <View style={styles.placeholder}>
      <Text style={styles.text}>{name}</Text>
      <Text style={styles.sub}>Phase 1 — Foundation</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  placeholder: { flex: 1, backgroundColor: colors.bg.base, alignItems: 'center', justifyContent: 'center' },
  text: { color: colors.brand.cyan, fontSize: 24, fontWeight: '800' },
  sub: { color: colors.text.muted, marginTop: 8, fontSize: 13 },
});

export type RootStackParamList = {
  Auth: undefined;
  App: undefined;
};

const Stack = createNativeStackNavigator<RootStackParamList>();

export function RootNavigator() {
  const session = useAuthStore((s) => s.session);
  const isLoading = useAuthStore((s) => s.isLoading);

  if (isLoading) return <PlaceholderScreen name="THE REBOOT" />;

  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      {!session ? (
        <Stack.Screen name="Auth">
          {() => <PlaceholderScreen name="Auth — Phase 2" />}
        </Stack.Screen>
      ) : (
        <Stack.Screen name="App">
          {() => <PlaceholderScreen name="App — Phase 3+" />}
        </Stack.Screen>
      )}
    </Stack.Navigator>
  );
}
