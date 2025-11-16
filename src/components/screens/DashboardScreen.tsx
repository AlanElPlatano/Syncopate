import { useApp } from '../../context/AppContext';
import { useStats } from '../../context/StatsContext';
import { OverallSummary } from '../stats/OverallSummary';
import { PerformanceBreakdown } from '../stats/PerformanceBreakdown';
import { SessionHistory } from '../stats/SessionHistory';
import './DashboardScreen.css';

export const DashboardScreen = () => {
  const { goToMenu } = useApp();
  const { detailedStats } = useStats();

  const hasData = Object.keys(detailedStats.sessionHistory).length > 0;

  return (
    <div className="dashboard-screen">
      <div className="dashboard-header">
        <h2>📊 Training Dashboard</h2>
        <p className="dashboard-subtitle">Track your progress and insights</p>
      </div>

      {!hasData ? (
        <div className="no-data-container">
          <div className="no-data-card">
            <div className="no-data-icon">🎯</div>
            <h3>No Training Data Yet</h3>
            <p>Complete some training sessions to see your detailed statistics and insights!</p>
            <button className="start-training-button" onClick={goToMenu}>
              Start Training
            </button>
          </div>
        </div>
      ) : (
        <div className="dashboard-content">
          <OverallSummary stats={detailedStats} />
          <PerformanceBreakdown stats={detailedStats} />
          <SessionHistory stats={detailedStats} limit={20} />
        </div>
      )}

      <div className="dashboard-actions">
        <button className="menu-button" onClick={goToMenu}>
          Return to Menu
        </button>
      </div>
    </div>
  );
};
