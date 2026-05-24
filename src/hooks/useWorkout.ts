import { useState, useEffect, useCallback } from 'react';
import { EXERCISES } from '../types';
import type { Session, ExerciseName, SetRecord } from '../types';
import { getSession, saveSession, getAllSessions, todayId } from '../db';

function createEmptySession(sessionId: string): Session {
  return {
    sessionId,
    exercises: EXERCISES.map((name) => ({ name, sets: [] })),
  };
}

export function useWorkout() {
  const [session, setSession] = useState<Session | null>(null);
  const [prevSession, setPrevSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      const id = todayId();
      const existing = await getSession(id);
      setSession(existing ?? createEmptySession(id));

      // 直近の過去セッションを取得（今日以外）
      const all = await getAllSessions();
      const prev = all.find((s) => s.sessionId !== id);
      setPrevSession(prev ?? null);

      setLoading(false);
    };
    load();
  }, []);

  const saveSet = useCallback(
    async (exerciseName: ExerciseName, setNumber: 1 | 2 | 3, weight: number, reps: number) => {
      if (!session) return;

      const newRecord: SetRecord = {
        setNumber,
        weight,
        reps,
        savedAt: new Date().toISOString(),
      };

      const newSession: Session = {
        ...session,
        exercises: session.exercises.map((ex) => {
          if (ex.name !== exerciseName) return ex;
          // 同じセット番号が既にあれば上書き、なければ追加
          const otherSets = ex.sets.filter((s) => s.setNumber !== setNumber);
          return {
            ...ex,
            sets: [...otherSets, newRecord].sort((a, b) => a.setNumber - b.setNumber),
          };
        }),
      };

      setSession(newSession);
      await saveSession(newSession);
    },
    [session]
  );

  const getExerciseRecord = useCallback(
    (name: ExerciseName) => session?.exercises.find((e) => e.name === name),
    [session]
  );

  const getPrevExerciseRecord = useCallback(
    (name: ExerciseName) => prevSession?.exercises.find((e) => e.name === name),
    [prevSession]
  );

  const isAllDone = session?.exercises.every((ex) => ex.sets.length >= 3) ?? false;

  return {
    session,
    prevSession,
    loading,
    saveSet,
    getExerciseRecord,
    getPrevExerciseRecord,
    isAllDone,
  };
}
