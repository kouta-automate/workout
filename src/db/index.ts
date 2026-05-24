import { openDB } from 'idb';
import type { DBSchema } from 'idb';
import type { Session } from '../types';

interface WorkoutDB extends DBSchema {
  sessions: {
    key: string;
    value: Session;
  };
}

const DB_NAME = 'workout-db';
const DB_VERSION = 1;

async function getDB() {
  return openDB<WorkoutDB>(DB_NAME, DB_VERSION, {
    upgrade(db) {
      db.createObjectStore('sessions', { keyPath: 'sessionId' });
    },
  });
}

export async function getSession(sessionId: string): Promise<Session | undefined> {
  const db = await getDB();
  return db.get('sessions', sessionId);
}

export async function saveSession(session: Session): Promise<void> {
  const db = await getDB();
  await db.put('sessions', session);
}

export async function getAllSessions(): Promise<Session[]> {
  const db = await getDB();
  const sessions = await db.getAll('sessions');
  return sessions.sort((a, b) => b.sessionId.localeCompare(a.sessionId));
}

export function todayId(): string {
  return new Date().toLocaleDateString('sv-SE'); // YYYY-MM-DD
}
