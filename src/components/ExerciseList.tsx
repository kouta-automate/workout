import type { ExerciseName, ExerciseRecord } from '../types';

interface ExerciseListProps {
  exercises: ExerciseRecord[];
  onSelect: (name: ExerciseName) => void;
  onHistoryClick: () => void;
  isAllDone: boolean;
}

function getStatus(sets: ExerciseRecord['sets']): 'done' | 'in-progress' | 'not-started' {
  if (sets.length >= 3) return 'done';
  if (sets.length > 0) return 'in-progress';
  return 'not-started';
}

export function ExerciseList({ exercises, onSelect, onHistoryClick, isAllDone }: ExerciseListProps) {
  return (
    <div className="exercise-list">
      <div className="list-header">
        <h2 className="screen-title">💪 今日のトレーニング</h2>
        <p className="list-date">
          {new Date().toLocaleDateString('ja-JP', {
            month: 'long',
            day: 'numeric',
            weekday: 'short',
          })}
        </p>
      </div>

      {isAllDone && (
        <div className="all-done-banner">
          🎉 本日のトレーニング完了！お疲れ様でした！
        </div>
      )}

      <div className="exercise-cards">
        {exercises.map((ex) => {
          const status = getStatus(ex.sets);
          return (
            <button
              key={ex.name}
              className={`exercise-card exercise-card--${status}`}
              onClick={() => onSelect(ex.name)}
            >
              <span className="exercise-card__name">{ex.name}</span>
              <span className="exercise-card__status">
                {status === 'done' && '✅ 完了'}
                {status === 'in-progress' && `Set ${ex.sets.length} / 3`}
                {status === 'not-started' && '未実施'}
              </span>
              <span className="exercise-card__arrow">›</span>
            </button>
          );
        })}
      </div>

      <button className="history-btn" onClick={onHistoryClick}>
        📅 過去の記録を見る
      </button>
    </div>
  );
}
