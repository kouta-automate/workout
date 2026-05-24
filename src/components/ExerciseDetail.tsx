import { useState } from 'react';
import type { ExerciseName, ExerciseRecord, SetRecord } from '../types';

interface ExerciseDetailProps {
  name: ExerciseName;
  todayRecord: ExerciseRecord | undefined;
  prevRecord: ExerciseRecord | undefined;
  onSave: (setNumber: 1 | 2 | 3, weight: number, reps: number) => void;
  onBack: () => void;
}

interface SetInputRowProps {
  setNumber: 1 | 2 | 3;
  savedSet: SetRecord | undefined;
  prevSet: SetRecord | undefined;
  onSave: (weight: number, reps: number) => void;
}

function SetInputRow({ setNumber, savedSet, prevSet, onSave }: SetInputRowProps) {
  const [weight, setWeight] = useState('');
  const [reps, setReps] = useState('');

  // 保存済みのセットは記録を表示するだけ
  if (savedSet) {
    return (
      <div className="set-row set-row--saved">
        <span className="set-label">Set {setNumber}</span>
        <div className="set-saved-values">
          <span className="set-value">{savedSet.weight} kg</span>
          <span className="set-sep">×</span>
          <span className="set-value">{savedSet.reps} rep</span>
          <span className="set-check">✅</span>
        </div>
      </div>
    );
  }

  const isValid =
    weight !== '' && reps !== '' && parseFloat(weight) > 0 && parseInt(reps) > 0;

  const handleSave = () => {
    if (!isValid) return;
    onSave(parseFloat(weight), parseInt(reps));
    setWeight('');
    setReps('');
  };

  return (
    <div className="set-row set-row--active">
      <span className="set-label">Set {setNumber}</span>
      <div className="set-inputs">
        <input
          type="number"
          inputMode="decimal"
          placeholder={prevSet ? `${prevSet.weight}` : '---'}
          value={weight}
          onChange={(e) => setWeight(e.target.value)}
          className="set-input"
          min="0"
          step="0.5"
        />
        <span className="set-unit">kg</span>
        <input
          type="number"
          inputMode="numeric"
          placeholder={prevSet ? `${prevSet.reps}` : '---'}
          value={reps}
          onChange={(e) => setReps(e.target.value)}
          className="set-input"
          min="1"
          step="1"
        />
        <span className="set-unit">rep</span>
        <button
          className={`save-set-btn ${isValid ? 'save-set-btn--ready' : ''}`}
          onClick={handleSave}
          disabled={!isValid}
        >
          保存
        </button>
      </div>
    </div>
  );
}

export function ExerciseDetail({
  name,
  todayRecord,
  prevRecord,
  onSave,
  onBack,
}: ExerciseDetailProps) {
  const savedSets = todayRecord?.sets ?? [];
  const allDone = savedSets.length >= 3;

  return (
    <div className="exercise-detail">
      {/* ヘッダー */}
      <div className="detail-header">
        <button className="back-btn" onClick={onBack}>
          ← 戻る
        </button>
        <h2 className="detail-title">{name}</h2>
      </div>

      {/* 前回の記録カード */}
      {prevRecord && prevRecord.sets.length > 0 ? (
        <div className="prev-record-card">
          <h3 className="prev-record-title">📅 前回の記録</h3>
          <div className="prev-sets">
            {([1, 2, 3] as const).map((n) => {
              const s = prevRecord.sets.find((s) => s.setNumber === n);
              return s ? (
                <div key={n} className="prev-set-row">
                  <span className="prev-set-label">Set {n}</span>
                  <span className="prev-set-values">
                    {s.weight} kg × {s.reps} rep
                  </span>
                </div>
              ) : null;
            })}
          </div>
        </div>
      ) : (
        <div className="prev-record-card prev-record-card--empty">
          <p className="prev-record-empty">📝 前回の記録がありません</p>
        </div>
      )}

      {/* 今回の記録入力 */}
      <div className="today-record">
        <h3 className="today-record-title">✏️ 今回</h3>
        {([1, 2, 3] as const).map((n) => (
          <SetInputRow
            key={n}
            setNumber={n}
            savedSet={savedSets.find((s) => s.setNumber === n)}
            prevSet={prevRecord?.sets.find((s) => s.setNumber === n)}
            onSave={(w, r) => onSave(n, w, r)}
          />
        ))}
      </div>

      {/* 全セット完了メッセージ */}
      {allDone && (
        <div className="exercise-done-msg">
          🎉 {name} 完了！お疲れ様！
        </div>
      )}
    </div>
  );
}
