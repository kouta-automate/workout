import type { TimerStatus } from '../hooks/useTimer';

interface TimerBarProps {
  display: string;
  status: TimerStatus;
  onReset: () => void;
}

export function TimerBar({ display, status, onReset }: TimerBarProps) {
  return (
    <div className={`timer-bar timer-bar--${status}`}>
      <div className="timer-left">
        <span className="timer-icon">⏱</span>
        <span className="timer-display">{display}</span>
      </div>
      <div className="timer-right">
        {status === 'finished' && (
          <span className="timer-done-msg">✅ 休憩終了！</span>
        )}
        {status !== 'idle' && (
          <button className="timer-reset-btn" onClick={onReset}>
            リセット
          </button>
        )}
      </div>
    </div>
  );
}
