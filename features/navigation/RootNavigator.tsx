import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { AuthScreen } from '../../screens/AuthScreen';
import { SetupScreen } from '../../screens/SetupScreen';
import { DashboardScreen } from '../../screens/DashboardScreen';
import { ProgressScreen } from '../../screens/ProgressScreen';
import { SkillsScreen } from '../../screens/SkillsScreen';
import { WorkoutPlayerScreen } from '../../screens/WorkoutPlayerScreen';
import { useAppStore } from '../../store/useAppStore';

export type RootStackParamList = {
  Auth: undefined;
  Setup: undefined;
  Main: undefined;
  WorkoutPlayer: undefined;
};

const Stack = createNativeStackNavigator<RootStackParamList>();
const Tab = createBottomTabNavigator();

function MainTabs() {
  return (
    <Tab.Navigator screenOptions={{ headerStyle: { backgroundColor: '#111827' }, headerTintColor: '#fff' }}>
      <Tab.Screen name="Dashboard" component={DashboardScreen} />
      <Tab.Screen name="Progress" component={ProgressScreen} />
      <Tab.Screen name="Skills" component={SkillsScreen} />
    </Tab.Navigator>
  );
}

export function RootNavigator() {
  const isAuthenticated = useAppStore((s) => s.isAuthenticated);
  const hasCompletedSetup = useAppStore((s) => s.hasCompletedSetup);

  return (
    <Stack.Navigator screenOptions={{ headerStyle: { backgroundColor: '#111827' }, headerTintColor: '#fff' }}>
      {!isAuthenticated ? (
        <Stack.Screen name="Auth" component={AuthScreen} options={{ headerShown: false }} />
      ) : !hasCompletedSetup ? (
        <Stack.Screen name="Setup" component={SetupScreen} options={{ title: 'System Calibration' }} />
      ) : (
        <>
          <Stack.Screen name="Main" component={MainTabs} options={{ headerShown: false }} />
          <Stack.Screen name="WorkoutPlayer" component={WorkoutPlayerScreen} options={{ title: 'Quest Instance' }} />
        </>
      )}
    </Stack.Navigator>
  );
}
