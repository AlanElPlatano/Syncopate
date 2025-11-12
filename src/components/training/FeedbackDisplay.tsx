import './FeedbackDisplay.css';

export type FeedbackType = 'correct' | 'incorrect' | 'gave-up' | null;

interface FeedbackDisplayProps {
  feedback: FeedbackType;
  correctAnswer?: string;
  showAnswer?: boolean;
}

export const FeedbackDisplay = ({
  feedback,
  correctAnswer,
  showAnswer = false,
}: FeedbackDisplayProps) => {
  if (!feedback) return null;

  const getFeedbackConfig = () => {
    switch (feedback) {
      case 'correct':
        return {
          icon: '✓',
          text: 'Correct!',
          className: 'feedback-correct',
        };
      case 'incorrect':
        return {
          icon: '✗',
          text: 'Incorrect',
          className: 'feedback-incorrect',
        };
      case 'gave-up':
        return {
          icon: '🏳️',
          text: 'Answer Revealed',
          className: 'feedback-gave-up',
        };
      default:
        return null;
    }
  };

  const config = getFeedbackConfig();
  if (!config) return null;

  return (
    <div className={`feedback-display ${config.className}`}>
      <div className="feedback-main">
        <span className="feedback-icon">{config.icon}</span>
        <span className="feedback-text">{config.text}</span>
      </div>
      {showAnswer && correctAnswer && (
        <div className="feedback-answer">
          <span className="feedback-answer-label">Correct answer:</span>
          <span className="feedback-answer-value">{correctAnswer}</span>
        </div>
      )}
    </div>
  );
};
