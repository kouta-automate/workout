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

const WEIGHT_STEP = 2.5;
const REPS_STEP = 1;
const DEFAULT_WEIGHT = 20;
const DEFAULT_REPS = 10;

function SetInputRow({ setNumber, savedSet, prevSet, onSave }: SetInputRowProps) {
  const initWeight = prevSet?.weight ?? DEFAULT_WEIGHT;
  const initReps = prevSet?.reps ?? DEFAULT_REPS;

  const [weight, setWeight] = useState(initWeight);
  const [reps, setReps] = useState(initReps);

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

  const handleSave = () => {
    onSave(weight, reps);
  };

  return (
    <div className="set-row set-row--active">
      <span className="set-label">Set {setNumber}</span>

      <div className="stepper-group">
        {/* 重量 */}
        <div className="stepper">
          <button
            className="stepper-btn stepper-btn--minus"
            onClick={() => setWeight((w) => Math.max(0, Math.round((w - WEIGHT_STEP) * 10) / 10))}
          >
            −
          </button>
          <div className="stepper-value">
            <span className="stepper-number">{weight}</span>
            <span className="stepper-unit">kg</span>
          </div>
          <button
            className="stepper-btn stepper-btn--plus"
            onClick={() => setWeight((w) => Math.round((w + WEIGHT_STEP) * 10) / 10)}
          >
            ＋
          </button>
        </div>

        <span className="stepper-sep">×</span>

        {/* 回数 */}
        <div className="stepper">
          <button
            className="stepper-btn stepper-btn--minus"
            onClick={() => setReps((r) => Math.max(1, r - REPS_STEP))}
          >
            −
          </button>
          <div className="stepper-value">
            <span className="stepper-number">{reps}</span>
            <span className="stepper-unit">rep</span>
          </div>
          <button
            className="stepper-btn stepper-btn--plus"
            onClick={() => setReps((r) => r + REPS_STEP)}
          >
            ＋
          </button>
        </div>
      </div>

      <button className="save-set-btn save-set-btn--ready" onClick={handleSave}>
        保存
      </button>
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
