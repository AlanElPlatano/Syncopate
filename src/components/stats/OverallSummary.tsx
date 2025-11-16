import { DetailedLifetimeStats } from '../../types/stats';
import {
  getOverallSummary,
  getTotalTrainingTime,
  getAverageTimePerQuestion,
  getTrainingTimeByMode,
} from '../../utils/analytics';
import './OverallSummary.css';

interface OverallSummaryProps {
  stats: DetailedLifetimeStats;
}

export const OverallSummary = ({ stats }: OverallSummaryProps) => {
  const summary = getOverallSummary(stats);
  const totalTime = getTotalTrainingTime(stats);
  const avgTime = getAverageTimePerQuestion(stats);
  const timeByMode = getTrainingTimeByMode(stats);

  return (
    <div className="overall-summary">
      <h3 className="section-title">📊 Overall Statistics</h3>

      <div className="summary-grid">
        {/* Total Stats */}
        <div className="summary-card">
          <div className="summary-icon">🎯</div>
          <div className="summary-content">
            <div className="summary-value">{summary.totalQuestions}</div>
            <div className="summary-label">Total Questions</div>
          </div>
        </div>

        <div className="summary-card">
          <div className="summary-icon">✅</div>
          <div className="summary-content">
            <div className="summary-value">{summary.overallAccuracy}%</div>
            <div className="summary-label">Overall Accuracy</div>
          </div>
        </div>

        <div className="summary-card">
          <div className="summary-icon">🎓</div>
          <div className="summary-content">
            <div className="summary-value">{summary.totalSessions}</div>
            <div className="summary-label">Total Sessions</div>
          </div>
        </div>

        <div className="summary-card">
          <div className="summary-icon">⏱️</div>
          <div className="summary-content">
            <div className="summary-value">{totalTime.formatted}</div>
            <div className="summary-label">Total Training Time</div>
          </div>
        </div>

        <div className="summary-card">
          <div className="summary-icon">⚡</div>
          <div className="summary-content">
            <div className="summary-value">{avgTime.formatted}</div>
            <div className="summary-label">Avg. Time/Question</div>
          </div>
        </div>

        <div className="summary-card">
          <div className="summary-icon">🎼</div>
          <div className="summary-content">
            <div className="summary-value">{summary.totalCorrect}</div>
            <div className="summary-label">Correct Answers</div>
          </div>
        </div>
      </div>

      {/* Mode Breakdown */}
      <div className="mode-breakdown">
        <h4 className="subsection-title">Performance by Mode</h4>
        <div className="mode-grid">
          <div className="mode-card chord-mode">
            <div className="mode-header">
              <span className="mode-name">🎹 Chord Training</span>
            </div>
            <div className="mode-stats">
              <div className="mode-stat">
                <span className="mode-stat-label">Sessions</span>
                <span className="mode-stat-value">{summary.byMode.chord.sessions}</span>
              </div>
              <div className="mode-stat">
                <span className="mode-stat-label">Accuracy</span>
                <span className="mode-stat-value">{summary.byMode.chord.accuracy}%</span>
              </div>
              <div className="mode-stat">
                <span className="mode-stat-label">Time Spent</span>
                <span className="mode-stat-value">{timeByMode.chord.formatted}</span>
              </div>
            </div>
          </div>

          <div className="mode-card interval-mode">
            <div className="mode-header">
              <span className="mode-name">🎵 Interval Training</span>
            </div>
            <div className="mode-stats">
              <div className="mode-stat">
                <span className="mode-stat-label">Sessions</span>
                <span className="mode-stat-value">{summary.byMode.interval.sessions}</span>
              </div>
              <div className="mode-stat">
                <span className="mode-stat-label">Accuracy</span>
                <span className="mode-stat-value">{summary.byMode.interval.accuracy}%</span>
              </div>
              <div className="mode-stat">
                <span className="mode-stat-label">Time Spent</span>
                <span className="mode-stat-value">{timeByMode.interval.formatted}</span>
              </div>
            </div>
          </div>

          <div className="mode-card progression-mode">
            <div className="mode-header">
              <span className="mode-name">🎶 Progression Training</span>
            </div>
            <div className="mode-stats">
              <div className="mode-stat">
                <span className="mode-stat-label">Sessions</span>
                <span className="mode-stat-value">{summary.byMode.progression.sessions}</span>
              </div>
              <div className="mode-stat">
                <span className="mode-stat-label">Accuracy</span>
                <span className="mode-stat-value">{summary.byMode.progression.accuracy}%</span>
              </div>
              <div className="mode-stat">
                <span className="mode-stat-label">Time Spent</span>
                <span className="mode-stat-value">{timeByMode.progression.formatted}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
