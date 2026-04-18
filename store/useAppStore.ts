import AsyncStorage from '@react-native-async-storage/async-storage';
import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { workoutLibrary } from '../data/workouts';
import { CapabilityInput, Skill, StatKey, StatsMap, Target, UserProfile, Workout } from '../types';
import { getUserLevel, xpToNextLevel } from '../utils/progression';

type AppState = {
  isAuthenticated: boolean;
  hasCompletedSetup: boolean;
  isGuest: boolean;
  user?: UserProfile;
  stats: StatsMap;
  userLevel: number;
  statPoints: number;
  skills: Skill[];
  target?: Target;
  workouts: Workout[];
  login: (username: string) => void;
  register: (username: string) => void;
  continueAsGuest: () => void;
  logout: () => void;
  completeSetup: (profile: UserProfile, capabilityInput?: CapabilityInput) => void;
  gainStatXp: (stat: StatKey, amount: number) => void;
  upgradeStat: (stat: StatKey) => void;
  setTarget: (stat: StatKey, level: number) => void;
  addSkill: (name: string) => void;
  gainSkillXp: (skillId: string, amount: number) => void;
};

const makeDefaultStats = (): StatsMap => ({
  strength: { key: 'strength', level: 0, xp: 0 },
  endurance: { key: 'endurance', level: 0, xp: 0 },
  agility: { key: 'agility', level: 0, xp: 0 },
  explosiveness: { key: 'explosiveness', level: 0, xp: 0 },
  mobility: { key: 'mobility', level: 0, xp: 0 },
  recovery: { key: 'recovery', level: 0, xp: 0 },
  skill: { key: 'skill', level: 0, xp: 0 },
});

const starterSkills: Skill[] = [
  { id: 'taekwondo', name: 'Taekwondo', level: 1, xp: 0 },
  { id: 'boxing', name: 'Boxing', level: 1, xp: 0 },
  { id: 'mma', name: 'MMA', level: 1, xp: 0 },
  { id: 'calisthenics', name: 'Calisthenics', level: 1, xp: 0 },
];

const deriveStatSeed = (capabilityInput?: CapabilityInput): Partial<Record<StatKey, number>> => {
  if (!capabilityInput) return {};
  return {
    strength: Math.floor((capabilityInput.maxWeightLifted ?? 0) / 20),
    endurance: Math.floor(((capabilityInput.runningDistanceKm ?? 0) * 10 + (capabilityInput.maxPushups ?? 0)) / 20),
    agility: Math.floor((capabilityInput.jumpHeightCm ?? 0) / 20),
    explosiveness: Math.floor((capabilityInput.jumpHeightCm ?? 0) / 25),
    mobility: Math.floor((capabilityInput.runningTimeMin ?? 0) > 0 ? 2 : 0),
    recovery: Math.floor((capabilityInput.gripStrengthKg ?? 0) / 15),
    skill: Math.floor((capabilityInput.maxPushups ?? 0) / 25),
  };
};

export const useAppStore = create<AppState>()(
  persist(
    (set, get) => ({
      isAuthenticated: false,
      hasCompletedSetup: false,
      isGuest: false,
      user: undefined,
      stats: makeDefaultStats(),
      userLevel: 0,
      statPoints: 0,
      skills: starterSkills,
      target: undefined,
      workouts: workoutLibrary,

      login: (username) => set({ isAuthenticated: true, isGuest: false, user: { username } }),
      register: (username) => set({ isAuthenticated: true, isGuest: false, user: { username } }),
      continueAsGuest: () => set({ isAuthenticated: true, isGuest: true, user: { username: 'Hunter Guest' } }),
      logout: () =>
        set({
          isAuthenticated: false,
          hasCompletedSetup: false,
          isGuest: false,
          user: undefined,
          stats: makeDefaultStats(),
          userLevel: 0,
          statPoints: 0,
          target: undefined,
          skills: starterSkills,
        }),
      completeSetup: (profile, capabilityInput) => {
        const seededLevels = deriveStatSeed(capabilityInput);
        const seededStats = makeDefaultStats();
        (Object.keys(seededLevels) as StatKey[]).forEach((key) => {
          const value = Math.max(0, Math.min(100, seededLevels[key] ?? 0));
          seededStats[key].level = value;
        });
        set({
          hasCompletedSetup: true,
          user: { ...get().user, ...profile },
          stats: seededStats,
          userLevel: getUserLevel(seededStats),
        });
      },
      gainStatXp: (stat, amount) => {
        const stats = { ...get().stats };
        const targetStat = { ...stats[stat] };
        targetStat.xp += amount;

        while (targetStat.level < 100 && targetStat.xp >= xpToNextLevel(targetStat.level)) {
          targetStat.xp -= xpToNextLevel(targetStat.level);
          targetStat.level += 1;
        }

        stats[stat] = targetStat;
        const previousLevel = get().userLevel;
        const nextLevel = getUserLevel(stats);
        set({
          stats,
          userLevel: nextLevel,
          statPoints: get().statPoints + Math.max(0, nextLevel - previousLevel) * 3,
        });
      },
      upgradeStat: (stat) => {
        if (get().statPoints < 1) return;
        const stats = { ...get().stats };
        const upgraded = { ...stats[stat], level: Math.min(stats[stat].level + 1, 100) };
        stats[stat] = upgraded;
        set({ stats, statPoints: get().statPoints - 1, userLevel: getUserLevel(stats) });
      },
      setTarget: (stat, level) => set({ target: { stat, level } }),
      addSkill: (name) => {
        const skill: Skill = {
          id: `${name.toLowerCase().replace(/\s+/g, '-')}-${Date.now()}`,
          name,
          level: 1,
          xp: 0,
        };
        set({ skills: [...get().skills, skill] });
      },
      gainSkillXp: (skillId, amount) => {
        const skills = get().skills.map((skill) => {
          if (skill.id !== skillId) return skill;
          let xp = skill.xp + amount;
          let level = skill.level;
          while (xp >= level * 80) {
            xp -= level * 80;
            level += 1;
          }
          return { ...skill, xp, level };
        });
        set({ skills });
      },
    }),
    {
      name: 'the-reboot-store',
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);
