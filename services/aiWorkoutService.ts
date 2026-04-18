import Constants from 'expo-constants';
import { StatKey, StatsMap, Workout } from '../types';

type GenerateWorkoutParams = {
  userStats: StatsMap;
  targetStat: StatKey;
  skill?: string;
};

type OpenAIWorkoutResponse = {
  title: string;
  steps: Array<{
    name: string;
    instruction: string;
    duration: number;
    rest: number;
  }>;
};

const OPENAI_URL = 'https://api.openai.com/v1/chat/completions';

const extractJson = (raw: string): OpenAIWorkoutResponse => {
  const fenced = raw.match(/```json\s*([\s\S]*?)```/i)?.[1] ?? raw;
  const start = fenced.indexOf('{');
  const end = fenced.lastIndexOf('}');
  if (start < 0 || end < 0) {
    throw new Error('No JSON object found in AI response');
  }
  return JSON.parse(fenced.slice(start, end + 1)) as OpenAIWorkoutResponse;
};

const validateWorkout = (payload: OpenAIWorkoutResponse): Workout => {
  if (!payload?.title || !Array.isArray(payload.steps)) {
    throw new Error('Invalid workout payload structure');
  }

  return {
    id: `ai-${Date.now()}`,
    title: payload.title,
    steps: payload.steps.map((step, idx) => {
      if (!step?.name || typeof step.duration !== 'number' || typeof step.rest !== 'number') {
        throw new Error(`Invalid workout step at index ${idx}`);
      }
      return {
        title: step.name,
        instruction: step.instruction,
        duration: Math.max(10, Math.floor(step.duration)),
        rest: Math.max(0, Math.floor(step.rest)),
      };
    }),
  };
};

export async function generateWorkout({ userStats, targetStat, skill }: GenerateWorkoutParams): Promise<Workout> {
  const apiKey = Constants.expoConfig?.extra?.openaiApiKey as string | undefined;
  if (!apiKey) {
    throw new Error('Missing OPENAI_API_KEY in environment config');
  }

  const prompt = `Generate a structured fitness workout.

User stats:

* Strength: ${userStats.strength.level}
* Endurance: ${userStats.endurance.level}
* Agility: ${userStats.agility.level}

Target: ${targetStat}
Skill: ${skill ?? 'None'}

Return JSON ONLY in this format:

{
"title": "Workout Name",
"steps": [
{
"name": "Exercise name",
"instruction": "What to do",
"duration": number_in_seconds,
"rest": number_in_seconds
}
]
}

Make it realistic, beginner-friendly if stats are low, harder if stats are high.`;

  const response = await fetch(OPENAI_URL, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model: 'gpt-4o-mini',
      temperature: 0.7,
      messages: [
        { role: 'system', content: 'You are an expert fitness coach. Respond with valid JSON only.' },
        { role: 'user', content: prompt },
      ],
    }),
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`OpenAI request failed (${response.status}): ${errorText.slice(0, 120)}`);
  }

  const data = await response.json();
  const content = data?.choices?.[0]?.message?.content;
  if (!content) throw new Error('OpenAI response missing content');

  const parsed = extractJson(content);
  return validateWorkout(parsed);
}
