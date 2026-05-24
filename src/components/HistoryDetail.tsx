import { EXERCISES } from '../types';
import type { Session } from '../types';

interface HistoryDetailProps {
  session: Session;
  onBack: () => void;
}

export function HistoryDetail({ session, onBack }: HistoryDetailProps) {
  const date = new Date(session.sessionId + 'T00:00:00');
  const label = date.toLocaleDateString('ja-JP', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    weekday: 'short',
  });

  return (
    <div className="history-detail">
      <div className="detail-header">
        <button className="back-btn" onClick={onBack}>
          ← 戻る
        </button>
        <h2 className="detail-title">{label}</h2>
      </div>

      <div className="history-exercise-list">
        {EXERCISES.map((name) => {
          const ex = session.exercises.find((e) => e.name === name);
          const hasSets = ex && ex.sets.length > 0;

          return (
            <div key={name} className="history-exercise-card">
              <div className="history-exercise-header">
                <span className="history-exercise-name">{name}</span>
                <span
                  className={`history-exercise-badge ${
                    hasSets && ex.sets.length >= 3 ? 'badge--done' : 'badge--partial'
                  }`}
                >
                  {hasSets ? `${ex.sets.length} / 3 Set` : '未実施'}
                </span>
              </div>
              {hasSets && (
                <div className="history-sets">
                  {ex.sets.map((s) => (
                    <div key={s.setNumber} className="history-set-row">
                      <span className="history-set-label">Set {s.setNumber}</span>
                      <span className="history-set-values">
                        {s.weight} kg × {s.reps} rep
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
