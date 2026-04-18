import { Stat, StatsMap } from '../types';

export const xpToNextLevel = (level: number) => 100 + level * 20;

export const getProgress = (stat: Stat) => {
  const next = xpToNextLevel(stat.level);
  return Math.min(stat.xp / next, 1);
};

export const getUserLevel = (stats: StatsMap) => {
  const totalStatLevels = Object.values(stats).reduce((acc, stat) => acc + stat.level, 0);
  return Math.floor(totalStatLevels / 7);
};
