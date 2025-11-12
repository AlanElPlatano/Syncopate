import { useApp } from '../../context/AppContext';
import './StatsScreen.css';

export const StatsScreen = () => {
  const { goToMenu } = useApp();

  return (
    <div className="stats-screen">
      <h2>Session Complete!</h2>
      <p className="stats-subtitle">Here are your results</p>

      <div className="stats-content">
        <div className="stats-card">
          <h3>Session Statistics</h3>
          <div className="stat-item">
            <span className="stat-label">Accuracy:</span>
            <span className="stat-value">80%</span>
          </div>
          <div className="stat-item">
            <span className="stat-label">Correct:</span>
            <span className="stat-value">8 / 10</span>
          </div>
        </div>

        <div className="stats-card">
          <h3>Lifetime Statistics</h3>
          <p className="placeholder-text">
            Lifetime stats will be implemented in Phase 1.3
          </p>
          <p className="placeholder-details">
            Stats will be stored in localStorage and displayed here
          </p>
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
