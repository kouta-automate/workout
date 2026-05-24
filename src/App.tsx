import { useState, useCallback } from 'react';
import { TimerBar } from './components/TimerBar';
import { ExerciseList } from './components/ExerciseList';
import { ExerciseDetail } from './components/ExerciseDetail';
import { HistoryList } from './components/HistoryList';
import { HistoryDetail } from './components/HistoryDetail';
import { useTimer } from './hooks/useTimer';
import { useWorkout } from './hooks/useWorkout';
import { getSession, getAllSessions } from './db';
import type { ExerciseName, Session } from './types';

type View = 'list' | 'exercise' | 'history-list' | 'history-detail';

function App() {
  const { display, status, start: startTimer, reset: resetTimer } = useTimer();
  const { session, loading, saveSet, getExerciseRecord, getPrevExerciseRecord, isAllDone } =
    useWorkout();

  const [view, setView] = useState<View>('list');
  const [selectedExercise, setSelectedExercise] = useState<ExerciseName | null>(null);
  const [historySessions, setHistorySessions] = useState<Session[]>([]);
  const [selectedHistorySession, setSelectedHistorySession] = useState<Session | null>(null);

  // 種目を選択して詳細画面へ
  const handleExerciseSelect = useCallback((name: ExerciseName) => {
    setSelectedExercise(name);
    setView('exercise');
  }, []);

  // セットを保存してタイマーをスタート
  const handleSaveSet = useCallback(
    async (setNumber: 1 | 2 | 3, weight: number, reps: number) => {
      if (!selectedExercise) return;
      await saveSet(selectedExercise, setNumber, weight, reps);
      startTimer();
    },
    [selectedExercise, saveSet, startTimer]
  );

  // 履歴一覧へ
  const handleHistoryClick = useCallback(async () => {
    const sessions = await getAllSessions();
    setHistorySessions(sessions);
    setView('history-list');
  }, []);

  // 履歴詳細へ
  const handleHistorySelect = useCallback(async (sessionId: string) => {
    const s = await getSession(sessionId);
    if (s) {
      setSelectedHistorySession(s);
      setView('history-detail');
    }
  }, []);

  if (loading) {
    return (
      <div className="loading-screen">
        <span className="loading-icon">💪</span>
        <p>読み込み中...</p>
      </div>
    );
  }

  return (
    <div className="app">
      {/* タイマー：常時固定 */}
      <TimerBar display={display} status={status} onReset={resetTimer} />

      {/* メインコンテンツ */}
      <main className="screen">
        {view === 'list' && session && (
          <ExerciseList
            exercises={session.exercises}
            onSelect={handleExerciseSelect}
            onHistoryClick={handleHistoryClick}
            isAllDone={isAllDone}
          />
        )}

        {view === 'exercise' && selectedExercise && (
          <ExerciseDetail
            name={selectedExercise}
            todayRecord={getExerciseRecord(selectedExercise)}
            prevRecord={getPrevExerciseRecord(selectedExercise)}
            onSave={handleSaveSet}
            onBack={() => setView('list')}
          />
        )}

        {view === 'history-list' && (
          <HistoryList
            sessions={historySessions}
            onSelect={handleHistorySelect}
            onBack={() => setView('list')}
          />
        )}

        {view === 'history-detail' && selectedHistorySession && (
          <HistoryDetail
            session={selectedHistorySession}
            onBack={() => setView('history-list')}
          />
        )}
      </main>
    </div>
  );
}

export default App;
