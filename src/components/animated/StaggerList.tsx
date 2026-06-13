import React from 'react';
import { MotiView } from 'moti';
import { entrance, stagger } from '../../theme/animations';

interface StaggerListProps<T> {
  data: T[];
  renderItem: (item: T, index: number) => React.ReactNode;
  keyExtractor: (item: T, index: number) => string;
  staggerType?: keyof typeof stagger;
}

export function StaggerList<T>({
  data,
  renderItem,
  keyExtractor,
  staggerType = 'list',
}: StaggerListProps<T>) {
  return (
    <>
      {data.map((item, index) => (
        <MotiView
          key={keyExtractor(item, index)}
          {...entrance.fadeSlideUp}
          {...stagger[staggerType](index)}
        >
          {renderItem(item, index)}
        </MotiView>
      ))}
    </>
  );
}
