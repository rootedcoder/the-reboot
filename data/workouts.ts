import { Workout } from '../types';

export const workoutLibrary: Workout[] = [
  {
    id: 'pushup-foundation',
    title: 'Pushup Initiation Quest',
    steps: [
      { title: 'Pushups x12', duration: 45, rest: 30 },
      { title: 'Pushups x10', duration: 40, rest: 30 },
      { title: 'Pushups x8', duration: 35, rest: 45 },
    ],
  },
  {
    id: 'runner-core',
    title: 'Endurance Protocol',
    steps: [
      { title: 'Jog in place', duration: 120, rest: 30 },
      { title: 'Bodyweight squats x20', duration: 60, rest: 30 },
      { title: 'Mountain climbers x30', duration: 60, rest: 45 },
    ],
  },
  {
    id: 'agile-assault',
    title: 'Agility Burst Dungeon',
    steps: [
      { title: 'Jump rope simulation', duration: 90, rest: 20 },
      { title: 'Lateral hops x20', duration: 45, rest: 20 },
      { title: 'High knees', duration: 60, rest: 30 },
    ],
  },
];
