export const EXERCISES = ['胸トレ１', '肩トレ', '力こぶトレ', '胸トレ２'] as const;
export type ExerciseName = (typeof EXERCISES)[number];

export interface SetRecord {
  setNumber: 1 | 2 | 3;
  weight: number;
  reps: number;
  savedAt: string; // ISO string
}

export interface ExerciseRecord {
  name: ExerciseName;
  sets: SetRecord[];
}

export interface Session {
  sessionId: string; // YYYY-MM-DD
  exercises: ExerciseRecord[];
}
