import { useApp } from '../../context/AppContext';
import './TrainingScreen.css';

export const TrainingScreen = () => {
  const { sessionConfig, goToStats } = useApp();

  const handleFinishSession = () => {
    // Mock session results - will be replaced with actual training logic
    const mockResults = {
      mode: sessionConfig!.mode,
      correctAnswers: 8,
      totalQuestions: 10,
      accuracy: 80,
    };

    goToStats(mockResults);
  };

  const getModeTitle = () => {
    switch (sessionConfig?.mode) {
      case 'chord':
        return 'Chord Type Training';
      case 'interval':
        return 'Interval Training';
      case 'progression':
        return 'Chord Progression Training';
      default:
        return 'Training';
    }
  };

  return (
    <div className="training-screen">
      <h2>{getModeTitle()}</h2>
      <p className="training-subtitle">Question 1 of {sessionConfig?.numQuestions}</p>

      <div className="training-content">
        <p className="placeholder-text">
          Training interface will be implemented in Phase 3
        </p>
        <p className="placeholder-details">
          This screen will include audio playback, answer options, and feedback
        </p>

        <div className="training-placeholder-controls">
          <button className="control-button">🔊 Replay</button>
          <button className="control-button">🎹 Piano / 🎸 Guitar</button>
        </div>
      </div>

      <div className="training-actions">
        <button className="finish-button" onClick={handleFinishSession}>
          Finish Session (Demo)
        </button>
      </div>
    </div>
  );
};
