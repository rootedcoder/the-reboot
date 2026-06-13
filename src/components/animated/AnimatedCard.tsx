import React from 'react';
import { ViewStyle } from 'react-native';
import { MotiView } from 'moti';
import { Card } from '../ui/Card';
import { entrance, stagger } from '../../theme/animations';

interface AnimatedCardProps {
  children: React.ReactNode;
  index?: number;
  onPress?: () => void;
  style?: ViewStyle;
  glow?: boolean;
  glowColor?: string;
  noPadding?: boolean;
}

export function AnimatedCard({
  children,
  index = 0,
  onPress,
  style,
  glow,
  glowColor,
  noPadding,
}: AnimatedCardProps) {
  return (
    <MotiView
      {...entrance.fadeSlideUp}
      {...stagger.cards(index)}
    >
      <Card onPress={onPress} style={style} glow={glow} glowColor={glowColor} noPadding={noPadding}>
        {children}
      </Card>
    </MotiView>
  );
}
