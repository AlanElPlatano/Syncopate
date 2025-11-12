import './SessionOptions.css';

interface SessionOptionsProps {
  numQuestions: number;
  onNumQuestionsChange: (num: number) => void;
  guestMode: boolean;
  onGuestModeChange: (enabled: boolean) => void;
  questionOptions?: number[];
}

const DEFAULT_QUESTION_OPTIONS = [5, 10, 15, 20, 30, 50];

export const SessionOptions = ({
  numQuestions,
  onNumQuestionsChange,
  guestMode,
  onGuestModeChange,
  questionOptions = DEFAULT_QUESTION_OPTIONS,
}: SessionOptionsProps) => {
  return (
    <div className="session-options">
      <div className="session-option-group">
        <label className="session-option-label">Number of Questions</label>
        <div className="question-number-selector">
          {questionOptions.map((num) => (
            <button
              key={num}
              type="button"
              className={`question-number-btn ${
                numQuestions === num ? 'active' : ''
              }`}
              onClick={() => onNumQuestionsChange(num)}
            >
              {num}
            </button>
          ))}
        </div>
      </div>

      <div className="session-option-group">
        <label className="session-option-label">
          <input
            type="checkbox"
            checked={guestMode}
            onChange={(e) => onGuestModeChange(e.target.checked)}
            className="guest-mode-checkbox"
          />
          <span className="guest-mode-text">
            <span className="guest-mode-title">🎭 Guest Mode</span>
            <span className="guest-mode-description">
              Don't save statistics for this session
            </span>
          </span>
        </label>
      </div>
    </div>
  );
};
