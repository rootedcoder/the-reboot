export type StatKey =
  | 'strength'
  | 'endurance'
  | 'agility'
  | 'explosiveness'
  | 'mobility'
  | 'recovery'
  | 'skill';

export type Stat = {
  key: StatKey;
  level: number;
  xp: number;
};

export type StatsMap = Record<StatKey, Stat>;

export type UserProfile = {
  username: string;
  age?: number;
  weight?: number;
  height?: number;
  goal?: string;
};

export type CapabilityInput = {
  maxPushups?: number;
  maxWeightLifted?: number;
  runningDistanceKm?: number;
  runningTimeMin?: number;
  jumpHeightCm?: number;
  gripStrengthKg?: number;
};

export type Skill = {
  id: string;
  name: string;
  level: number;
  xp: number;
};

export type WorkoutStep = {
  title: string;
  duration: number;
  rest: number;
};

export type Workout = {
  id: string;
  title: string;
  steps: WorkoutStep[];
};

export type Target = {
  stat: StatKey;
  level: number;
};
