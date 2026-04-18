# THE REBOOT

A React Native (Expo + TypeScript) offline-first RPG fitness system inspired by Solo Leveling's System concept.

## Features

- Mock auth (login/register + guest mode)
- Two-step setup flow with optional capability scan
- Stat system (level/xp/progress)
- User level + stat points + manual stat upgrades
- Skill system with default and custom skills
- Target stat system
- Static workout quest library from local JSON-like data
- Workout player with timer / pause / skip / auto-next
- Zustand + AsyncStorage persistence

## Stack

- Expo + React Native + TypeScript
- Zustand
- React Navigation
- AsyncStorage

## Project structure

- `components/`
- `screens/`
- `store/`
- `features/`
- `hooks/`
- `utils/`
- `data/`
- `types/`

## Run

```bash
npm install
npx expo start
```

## Dependency troubleshooting

If you hit peer dependency conflicts after upgrading packages, clear old lockfiles and node modules, then reinstall:

```bash
rm -rf node_modules package-lock.json
npm install
```
