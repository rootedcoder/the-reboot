import React from 'react';
import { ScrollView, View, StyleSheet, ViewStyle, ScrollViewProps } from 'react-native';
import { MotiView } from 'moti';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { colors, spacing } from '../../theme/tokens';
import { entrance } from '../../theme/animations';

interface ScreenWrapperProps {
  children: React.ReactNode;
  scroll?: boolean;
  style?: ViewStyle;
  contentStyle?: ViewStyle;
  scrollProps?: ScrollViewProps;
}

export function ScreenWrapper({
  children,
  scroll = true,
  style,
  contentStyle,
  scrollProps,
}: ScreenWrapperProps) {
  const insets = useSafeAreaInsets();

  const inner = (
    <MotiView
      {...entrance.fade}
      style={[styles.inner, { paddingBottom: insets.bottom + spacing[6] }, contentStyle]}
    >
      {children}
    </MotiView>
  );

  if (!scroll) {
    return (
      <View style={[styles.root, { paddingTop: insets.top }, style]}>
        {inner}
      </View>
    );
  }

  return (
    <ScrollView
      style={[styles.root, style]}
      contentContainerStyle={{ paddingTop: insets.top + spacing[2] }}
      showsVerticalScrollIndicator={false}
      {...scrollProps}
    >
      {inner}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: colors.bg.base,
  },
  inner: {
    paddingHorizontal: spacing[4],
    gap: spacing[4],
  },
});
