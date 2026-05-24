import { useState, useEffect, useRef, useCallback } from 'react';

const DURATION = 120; // 2分 = 120秒

export type TimerStatus = 'idle' | 'running' | 'finished';

export function useTimer() {
  const [remaining, setRemaining] = useState(DURATION);
  const [status, setStatus] = useState<TimerStatus>('idle');
  const startTimeRef = useRef<number | null>(null);
  const rafRef = useRef<number | null>(null);

  const tick = useCallback(() => {
    if (startTimeRef.current === null) return;
    const elapsed = Math.floor((Date.now() - startTimeRef.current) / 1000);
    const newRemaining = Math.max(0, DURATION - elapsed);
    setRemaining(newRemaining);
    if (newRemaining === 0) {
      setStatus('finished');
      startTimeRef.current = null;
    } else {
      rafRef.current = requestAnimationFrame(tick);
    }
  }, []);

  const start = useCallback(() => {
    if (rafRef.current) cancelAnimationFrame(rafRef.current);
    startTimeRef.current = Date.now();
    setRemaining(DURATION);
    setStatus('running');
    rafRef.current = requestAnimationFrame(tick);
  }, [tick]);

  const reset = useCallback(() => {
    if (rafRef.current) cancelAnimationFrame(rafRef.current);
    startTimeRef.current = null;
    setRemaining(DURATION);
    setStatus('idle');
  }, []);

  // バックグラウンド復帰時に経過時間を再計算
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (
        document.visibilityState === 'visible' &&
        status === 'running' &&
        startTimeRef.current !== null
      ) {
        const elapsed = Math.floor((Date.now() - startTimeRef.current) / 1000);
        const newRemaining = Math.max(0, DURATION - elapsed);
        setRemaining(newRemaining);
        if (newRemaining === 0) {
          setStatus('finished');
          startTimeRef.current = null;
        } else {
          if (rafRef.current) cancelAnimationFrame(rafRef.current);
          rafRef.current = requestAnimationFrame(tick);
        }
      }
    };
    document.addEventListener('visibilitychange', handleVisibilityChange);
    return () => document.removeEventListener('visibilitychange', handleVisibilityChange);
  }, [status, tick]);

  useEffect(() => {
    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, []);

  const minutes = Math.floor(remaining / 60).toString().padStart(2, '0');
  const seconds = (remaining % 60).toString().padStart(2, '0');

  return { remaining, status, start, reset, display: `${minutes}:${seconds}` };
}
