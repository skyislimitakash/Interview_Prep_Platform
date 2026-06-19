import { useState, useEffect, useRef, useCallback } from "react";

interface UseTimerResult {
  elapsedSeconds: number;
  isRunning: boolean;
  start: () => void;
  pause: () => void;
  reset: () => void;
}

export const useTimer = (autoStart = false): UseTimerResult => {
  const [elapsedSeconds, setElapsedSeconds] = useState(0);
  const [isRunning, setIsRunning] = useState(autoStart);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    if (isRunning) {
      intervalRef.current = setInterval(() => {
        setElapsedSeconds((prev) => prev + 1);
      }, 1000);
    }
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [isRunning]);

  const start = useCallback(() => setIsRunning(true), []);
  const pause = useCallback(() => setIsRunning(false), []);
  const reset = useCallback(() => {
    setElapsedSeconds(0);
    setIsRunning(false);
  }, []);

  return { elapsedSeconds, isRunning, start, pause, reset };
};
