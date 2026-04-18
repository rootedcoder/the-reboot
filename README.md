# THE REBOOT

A React Native (Expo + TypeScript) offline-first RPG fitness system inspired by Solo Leveling's System concept.

## Features

- Mock auth (login/register + guest mode)
- Two-step setup flow with optional capability scan
- Stat system (level/xp/progress)
- Assessment-gated level progression
- Skill system with default and custom skills
- Target stat system
- AI workout generation using OpenAI API
- Workout player with timer / pause / skip / auto-next
- Zustand + AsyncStorage persistence

## Stack

- Expo + React Native + TypeScript
- Zustand
- React Navigation
- AsyncStorage
- OpenAI Chat Completions API

## Project structure

- `components/`
- `screens/`
- `store/`
- `features/`
- `hooks/`
- `services/`
- `utils/`
- `data/`
- `types/`

## Environment setup

Create `.env`:

```bash
OPENAI_API_KEY=your_openai_api_key_here
```

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

## Babel preset error fix

If Metro throws `Cannot find module 'babel-preset-expo'`, install dependencies again after cleaning:

```bash
rm -rf node_modules package-lock.json
npm install
npx expo start -c
```
