import 'react-native-gesture-handler';
import React from 'react';
import { NavigationContainer, DarkTheme } from '@react-navigation/native';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { RootNavigator } from './features/navigation/RootNavigator';

const AppTheme = {
  ...DarkTheme,
  colors: {
    ...DarkTheme.colors,
    primary: '#7c3aed',
    background: '#09090b',
    card: '#111827',
    text: '#f9fafb',
    border: '#1f2937',
    notification: '#22d3ee',
  },
};

export default function App() {
  return (
    <SafeAreaProvider>
      <NavigationContainer theme={AppTheme}>
        <StatusBar style="light" />
        <RootNavigator />
      </NavigationContainer>
    </SafeAreaProvider>
  );
}
