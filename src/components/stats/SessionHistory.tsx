import { DetailedLifetimeStats } from '../../types/stats';
import { getRecentSessions } from '../../utils/analytics';
import './SessionHistory.css';

interface SessionHistoryProps {
  stats: DetailedLifetimeStats;
  limit?: number;
}

export const SessionHistory = ({ stats, limit = 10 }: SessionHistoryProps) => {
  const recentSessions = getRecentSessions(stats, limit);

  if (recentSessions.length === 0) {
    return (
      <div className="session-history">
        <h3 className="section-title">📅 Recent Sessions</h3>
        <p className="no-sessions-message">
          No training sessions yet. Start training to build your history!
        </p>
      </div>
    );
  }

  const formatDate = (timestamp: number) => {
    const date = new Date(timestamp);
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    if (date.toDateString() === today.toDateString()) {
      return `Today ${date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}`;
    } else if (date.toDateString() === yesterday.toDateString()) {
      return `Yesterday ${date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}`;
    } else {
      return date.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      });
    }
  };

  const formatDuration = (ms: number) => {
    const seconds = Math.floor(ms / 1000);
    const minutes = Math.floor(seconds / 60);
    const secs = seconds % 60;

    if (minutes > 0) {
      return `${minutes}m ${secs}s`;
    }
    return `${secs}s`;
  };

  const getModeIcon = (mode: string) => {
    switch (mode) {
      case 'chord':
        return '🎹';
      case 'interval':
        return '🎵';
      case 'progression':
        return '🎶';
      default:
        return '🎼';
    }
  };

  const getModeName = (mode: string) => {
    switch (mode) {
      case 'chord':
        return 'Chord';
      case 'interval':
        return 'Interval';
      case 'progression':
        return 'Progression';
      default:
        return mode;
    }
  };

  const getAccuracyClass = (accuracy: number) => {
    if (accuracy >= 90) return 'excellent';
    if (accuracy >= 75) return 'good';
    if (accuracy >= 60) return 'okay';
    return 'needs-work';
  };

  return (
    <div className="session-history">
      <h3 className="section-title">📅 Recent Sessions</h3>

      <div className="sessions-container">
        <div className="sessions-header">
          <span className="header-mode">Mode</span>
          <span className="header-date">Date</span>
          <span className="header-accuracy">Accuracy</span>
          <span className="header-questions">Questions</span>
          <span className="header-duration">Duration</span>
        </div>

        <div className="sessions-list">
          {recentSessions.map((session) => (
            <div key={session.sessionId} className="session-row">
              <div className="session-mode">
                <span className="mode-icon">{getModeIcon(session.mode)}</span>
                <span className="mode-name">{getModeName(session.mode)}</span>
              </div>

              <div className="session-date">{formatDate(session.timestamp)}</div>

              <div className={`session-accuracy ${getAccuracyClass(session.accuracy)}`}>
                {session.accuracy}%
              </div>

              <div className="session-questions">
                {session.correctAnswers}/{session.totalQuestions}
              </div>

              <div className="session-duration">{formatDuration(session.duration)}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
