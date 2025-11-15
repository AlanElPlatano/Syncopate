import { Button } from '../common';
import './QuestionControls.css';

interface QuestionControlsProps {
  onReplay: () => void;
  onGiveUp: () => void;
  isPlaying?: boolean;
  disabled?: boolean;
  disableGiveUp?: boolean;
}

export const QuestionControls = ({
  onReplay,
  onGiveUp,
  isPlaying = false,
  disabled = false,
  disableGiveUp = false,
}: QuestionControlsProps) => {
  return (
    <div className="question-controls">
      <Button
        variant="primary"
        onClick={onReplay}
        disabled={disabled || isPlaying}
        className="replay-button"
      >
        🔊 {isPlaying ? 'Playing...' : 'Replay'}
      </Button>
      <Button
        variant="danger"
        onClick={onGiveUp}
        disabled={disabled || disableGiveUp}
        className="give-up-button"
      >
        🏳️ I Give Up
      </Button>
    </div>
  );
};
