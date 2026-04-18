import AsyncStorage from '@react-native-async-storage/async-storage';
import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { workoutLibrary } from '../data/workouts';
import {
  AssessmentPayload,
  CapabilityInput,
  LevelUpEvent,
  Skill,
  StatKey,
  StatsMap,
  Target,
  UserProfile,
  Workout,
} from '../types';
import { getUserLevel, xpToNextLevel } from '../utils/progression';

type AssessmentResult = { passed: boolean; message: string };

type AppState = {
  isAuthenticated: boolean;
  hasCompletedSetup: boolean;
  isGuest: boolean;
  displayName: string;
  user?: UserProfile;
  stats: StatsMap;
  userLevel: number;
  statPoints: number;
  skills: Skill[];
  target?: Target;
  workouts: Workout[];
  lastLevelUpEvent?: LevelUpEvent;
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
  assessStat: (stat: StatKey, payload: AssessmentPayload) => AssessmentResult;
  assessSkill: (skillId: string, payload: AssessmentPayload) => AssessmentResult;
  clearLevelUpEvent: () => void;
};

const makeDefaultStats = (): StatsMap => ({
  strength: { key: 'strength', level: 0, xp: 0, readyForAssessment: false },
  endurance: { key: 'endurance', level: 0, xp: 0, readyForAssessment: false },
  agility: { key: 'agility', level: 0, xp: 0, readyForAssessment: false },
  explosiveness: { key: 'explosiveness', level: 0, xp: 0, readyForAssessment: false },
  mobility: { key: 'mobility', level: 0, xp: 0, readyForAssessment: false },
  recovery: { key: 'recovery', level: 0, xp: 0, readyForAssessment: false },
  skill: { key: 'skill', level: 0, xp: 0, readyForAssessment: false },
});

const starterSkills: Skill[] = [
  { id: 'taekwondo', name: 'Taekwondo', level: 1, xp: 0, readyForAssessment: false },
  { id: 'boxing', name: 'Boxing', level: 1, xp: 0, readyForAssessment: false },
  { id: 'mma', name: 'MMA', level: 1, xp: 0, readyForAssessment: false },
  { id: 'calisthenics', name: 'Calisthenics', level: 1, xp: 0, readyForAssessment: false },
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

const isStatAssessmentPassed = (stat: StatKey, payload: AssessmentPayload, level: number) => {
  switch (stat) {
    case 'strength':
      return (payload.reps ?? 0) >= 5 + level;
    case 'endurance':
      return (payload.distanceKm ?? 0) >= 1 + level * 0.05 || (payload.timeMin ?? 999) <= 20 - Math.min(level, 10);
    case 'agility':
      return (payload.tapScore ?? 0) >= 15 + level;
    case 'skill':
      return !!payload.confirmed;
    default:
      return (payload.confirmed ?? false) || (payload.reps ?? 0) >= 3 + level;
  }
};

const isSkillAssessmentPassed = (payload: AssessmentPayload, level: number) => {
  return !!payload.confirmed || (payload.reps ?? 0) >= 8 + level;
};

export const useAppStore = create<AppState>()(
  persist(
    (set, get) => ({
      isAuthenticated: false,
      hasCompletedSetup: false,
      isGuest: false,
      displayName: 'Guest',
      user: undefined,
      stats: makeDefaultStats(),
      userLevel: 0,
      statPoints: 0,
      skills: starterSkills,
      target: undefined,
      workouts: workoutLibrary,
      lastLevelUpEvent: undefined,

      login: (username) =>
        set({ isAuthenticated: true, isGuest: false, user: { username }, displayName: username || 'Guest' }),
      register: (username) =>
        set({ isAuthenticated: true, isGuest: false, user: { username }, displayName: username || 'Guest' }),
      continueAsGuest: () => set({ isAuthenticated: true, isGuest: true, user: { username: 'Guest' }, displayName: 'Guest' }),
      logout: () =>
        set({
          isAuthenticated: false,
          hasCompletedSetup: false,
          isGuest: false,
          displayName: 'Guest',
          user: undefined,
          stats: makeDefaultStats(),
          userLevel: 0,
          statPoints: 0,
          target: undefined,
          skills: starterSkills,
          lastLevelUpEvent: undefined,
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
          displayName: get().isGuest ? 'Guest' : (get().user?.username || 'Guest'),
          stats: seededStats,
          userLevel: getUserLevel(seededStats),
        });
      },
      gainStatXp: (stat, amount) => {
        const stats = { ...get().stats };
        const targetStat = { ...stats[stat] };
        const xpCap = xpToNextLevel(targetStat.level);
        targetStat.xp = Math.min(targetStat.xp + amount, xpCap);
        targetStat.readyForAssessment = targetStat.xp >= xpCap;
        stats[stat] = targetStat;
        set({ stats });
      },
      upgradeStat: (stat) => {
        if (get().statPoints < 1) return;
        const stats = { ...get().stats };
        const upgraded = { ...stats[stat], level: Math.min(stats[stat].level + 1, 100), readyForAssessment: false, xp: 0 };
        stats[stat] = upgraded;
        set({
          stats,
          statPoints: get().statPoints - 1,
          userLevel: getUserLevel(stats),
          lastLevelUpEvent: { type: 'stat', name: stat, level: upgraded.level, id: `${Date.now()}-${stat}` },
        });
      },
      setTarget: (stat, level) => set({ target: { stat, level } }),
      addSkill: (name) => {
        const skill: Skill = {
          id: `${name.toLowerCase().replace(/\s+/g, '-')}-${Date.now()}`,
          name,
          level: 1,
          xp: 0,
          readyForAssessment: false,
        };
        set({ skills: [...get().skills, skill] });
      },
      gainSkillXp: (skillId, amount) => {
        const skills = get().skills.map((skill) => {
          if (skill.id !== skillId) return skill;
          const xpCap = skill.level * 80;
          const nextXp = Math.min(skill.xp + amount, xpCap);
          return { ...skill, xp: nextXp, readyForAssessment: nextXp >= xpCap };
        });
        set({ skills });
      },
      assessStat: (stat, payload) => {
        const stats = { ...get().stats };
        const targetStat = { ...stats[stat] };

        if (!targetStat.readyForAssessment) {
          return { passed: false, message: 'Assessment not unlocked yet.' };
        }

        const passed = isStatAssessmentPassed(stat, payload, targetStat.level);
        if (!passed) {
          set({ stats });
          return { passed: false, message: 'Assessment failed. XP retained. Try again.' };
        }

        targetStat.level = Math.min(100, targetStat.level + 1);
        targetStat.xp = 0;
        targetStat.readyForAssessment = false;
        stats[stat] = targetStat;

        const prevLevel = get().userLevel;
        const nextUserLevel = getUserLevel(stats);

        set({
          stats,
          userLevel: nextUserLevel,
          statPoints: get().statPoints + Math.max(0, nextUserLevel - prevLevel) * 3,
          lastLevelUpEvent: { type: 'stat', name: stat, level: targetStat.level, id: `${Date.now()}-${stat}` },
        });

        return { passed: true, message: 'Assessment passed. Stat leveled up.' };
      },
      assessSkill: (skillId, payload) => {
        let result: AssessmentResult = { passed: false, message: 'Skill not found.' };
        let levelUpEvent: LevelUpEvent | undefined;

        const skills = get().skills.map((skill) => {
          if (skill.id !== skillId) return skill;
          if (!skill.readyForAssessment) {
            result = { passed: false, message: 'Assessment not unlocked yet.' };
            return skill;
          }

          const passed = isSkillAssessmentPassed(payload, skill.level);
          if (!passed) {
            result = { passed: false, message: 'Assessment failed. XP retained. Try again.' };
            return skill;
          }

          const next = { ...skill, level: skill.level + 1, xp: 0, readyForAssessment: false };
          result = { passed: true, message: 'Assessment passed. Skill leveled up.' };
          levelUpEvent = { type: 'skill', name: skill.name, level: next.level, id: `${Date.now()}-${skill.id}` };
          return next;
        });
        set({ skills, lastLevelUpEvent: levelUpEvent });
        return result;
      },
      clearLevelUpEvent: () => set({ lastLevelUpEvent: undefined }),
    }),
    {
      name: 'the-reboot-store',
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);
