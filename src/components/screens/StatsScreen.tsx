import { useApp } from '../../context/AppContext';
import { useStats } from '../../context/StatsContext';
import './StatsScreen.css';

export const StatsScreen = () => {
  const { sessionConfig, goToMenu } = useApp();
  const { lifetimeStats, currentSessionStats } = useStats();

  if (!currentSessionStats) {
    return (
      <div className="stats-screen">
        <h2>No Session Data</h2>
        <p className="stats-subtitle">Complete a training session to see stats</p>
        <div className="stats-actions">
          <button className="menu-button" onClick={goToMenu}>
            Return to Menu
          </button>
        </div>
      </div>
    );
  }

  const modeStats = lifetimeStats[currentSessionStats.mode];
  const isGuestMode = sessionConfig?.guestMode || false;

  const getModeTitle = () => {
    switch (currentSessionStats.mode) {
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
    <div className="stats-screen">
      <h2>Session Complete!</h2>
      <p className="stats-subtitle">{getModeTitle()}</p>

      <div className="stats-content">
        <div className="stats-card">
          <h3>Session Results</h3>
          <div className="stat-item">
            <span className="stat-label">Accuracy:</span>
            <span className="stat-value">{currentSessionStats.accuracy.toFixed(1)}%</span>
          </div>
          <div className="stat-item">
            <span className="stat-label">Correct:</span>
            <span className="stat-value">
              {currentSessionStats.correctAnswers} / {currentSessionStats.totalQuestions}
            </span>
          </div>
          {isGuestMode && (
            <p className="guest-mode-note">🎭 Guest Mode - Stats not saved</p>
          )}
        </div>

        <div className="stats-card">
          <h3>Lifetime Statistics</h3>
          {isGuestMode ? (
            <p className="placeholder-text">
              Lifetime stats not available in guest mode
            </p>
          ) : modeStats.totalSessions === 0 ? (
            <p className="placeholder-text">
              No lifetime stats yet. Complete more sessions!
            </p>
          ) : (
            <>
              <div className="stat-item">
                <span className="stat-label">Overall Accuracy:</span>
                <span className="stat-value">{modeStats.overallAccuracy.toFixed(1)}%</span>
              </div>
              <div className="stat-item">
                <span className="stat-label">Total Sessions:</span>
                <span className="stat-value">{modeStats.totalSessions}</span>
              </div>
              <div className="stat-item">
                <span className="stat-label">Total Correct:</span>
                <span className="stat-value">
                  {modeStats.totalCorrect} / {modeStats.totalQuestions}
                </span>
              </div>
            </>
          )}
        </div>
      </div>

      <div className="stats-actions">
        <button className="menu-button" onClick={goToMenu}>
          Return to Menu
        </button>
      </div>
    </div>
  );
};
