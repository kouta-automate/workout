import type { Session } from '../types';

interface HistoryListProps {
  sessions: Session[];
  onSelect: (sessionId: string) => void;
  onBack: () => void;
}

export function HistoryList({ sessions, onSelect, onBack }: HistoryListProps) {
  const todayId = new Date().toLocaleDateString('sv-SE');

  return (
    <div className="history-list">
      <div className="detail-header">
        <button className="back-btn" onClick={onBack}>
          ← 戻る
        </button>
        <h2 className="detail-title">📅 過去の記録</h2>
      </div>

      {sessions.length === 0 ? (
        <p className="empty-msg">まだ記録がありません</p>
      ) : (
        <div className="history-items">
          {sessions.map((s) => {
            const isToday = s.sessionId === todayId;
            const completedCount = s.exercises.filter((e) => e.sets.length >= 3).length;
            const date = new Date(s.sessionId + 'T00:00:00');
            const label = date.toLocaleDateString('ja-JP', {
              year: 'numeric',
              month: 'long',
              day: 'numeric',
              weekday: 'short',
            });

            return (
              <button
                key={s.sessionId}
                className="history-item"
                onClick={() => onSelect(s.sessionId)}
              >
                <div className="history-item__left">
                  <span className="history-item__date">
                    {label}
                    {isToday && <span className="history-today-badge"> 今日</span>}
                  </span>
                  <span className="history-item__summary">
                    {completedCount} / 4 種目完了
                  </span>
                </div>
                <span className="history-item__arrow">›</span>
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
