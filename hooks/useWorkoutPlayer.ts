import { useEffect, useMemo, useState } from 'react';
import { Workout } from '../types';

export function useWorkoutPlayer(workout?: Workout) {
  const [stepIndex, setStepIndex] = useState(0);
  const [isRest, setIsRest] = useState(false);
  const [timeLeft, setTimeLeft] = useState(0);
  const [isRunning, setIsRunning] = useState(false);

  const currentStep = workout?.steps[stepIndex];

  useEffect(() => {
    if (!currentStep) return;
    setTimeLeft(currentStep.duration);
  }, [currentStep?.title]);

  useEffect(() => {
    if (!isRunning) return;
    if (!workout || !currentStep) return;

    const interval = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev > 1) return prev - 1;

        if (!isRest && currentStep.rest > 0) {
          setIsRest(true);
          return currentStep.rest;
        }

        setIsRest(false);
        if (stepIndex < workout.steps.length - 1) {
          setStepIndex((i) => i + 1);
          return workout.steps[stepIndex + 1].duration;
        }

        setIsRunning(false);
        return 0;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [isRunning, workout, currentStep, isRest, stepIndex]);

  const progressText = useMemo(() => {
    if (!workout) return 'No workout selected';
    return `Step ${Math.min(stepIndex + 1, workout.steps.length)} / ${workout.steps.length}`;
  }, [stepIndex, workout]);

  return {
    currentStep,
    stepIndex,
    isRest,
    timeLeft,
    isRunning,
    progressText,
    start: () => setIsRunning(true),
    pause: () => setIsRunning(false),
    skip: () => {
      if (!workout) return;
      setIsRest(false);
      if (stepIndex < workout.steps.length - 1) {
        setStepIndex(stepIndex + 1);
        setTimeLeft(workout.steps[stepIndex + 1].duration);
      } else {
        setIsRunning(false);
        setTimeLeft(0);
      }
    },
  };
}
