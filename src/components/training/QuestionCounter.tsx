import './QuestionCounter.css';

interface QuestionCounterProps {
  current: number;
  total: number;
  mode?: string;
}

export const QuestionCounter = ({ current, total, mode }: QuestionCounterProps) => {
  const percentage = (current / total) * 100;

  return (
    <div className="question-counter">
      <div className="counter-text">
        <span className="counter-current">Question {current}</span>
        <span className="counter-divider">of</span>
        <span className="counter-total">{total}</span>
      </div>
      {mode && <div className="counter-mode">{mode}</div>}
      <div className="counter-progress-bar">
        <div
          className="counter-progress-fill"
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
};
