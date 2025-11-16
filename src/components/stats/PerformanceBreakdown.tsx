import { DetailedLifetimeStats } from '../../types/stats';
import {
  getBestChordTypes,
  getWorstChordTypes,
  getBestIntervals,
  getWorstIntervals,
  getBestKeys,
  getWorstKeys,
} from '../../utils/analytics';
import './PerformanceBreakdown.css';

interface PerformanceBreakdownProps {
  stats: DetailedLifetimeStats;
}

export const PerformanceBreakdown = ({ stats }: PerformanceBreakdownProps) => {
  const bestChords = getBestChordTypes(stats.chord.chordTypeBreakdown, 5);
  const worstChords = getWorstChordTypes(stats.chord.chordTypeBreakdown, 5);
  const bestIntervals = getBestIntervals(stats.interval.intervalBreakdown, 5);
  const worstIntervals = getWorstIntervals(stats.interval.intervalBreakdown, 5);
  const bestKeys = getBestKeys(stats.progression.keyBreakdown, 5);
  const worstKeys = getWorstKeys(stats.progression.keyBreakdown, 5);

  const hasChordData = bestChords.length > 0 || worstChords.length > 0;
  const hasIntervalData = bestIntervals.length > 0 || worstIntervals.length > 0;
  const hasKeyData = bestKeys.length > 0 || worstKeys.length > 0;

  if (!hasChordData && !hasIntervalData && !hasKeyData) {
    return (
      <div className="performance-breakdown">
        <h3 className="section-title">📈 Performance Insights</h3>
        <p className="no-data-message">
          Complete more training sessions to see detailed performance insights!
        </p>
      </div>
    );
  }

  return (
    <div className="performance-breakdown">
      <h3 className="section-title">📈 Performance Insights</h3>

      {/* Chord Type Performance */}
      {hasChordData && (
        <div className="breakdown-section">
          <h4 className="breakdown-title">🎹 Chord Type Performance</h4>
          <div className="breakdown-grid">
            {bestChords.length > 0 && (
              <div className="breakdown-card strengths">
                <div className="breakdown-header">
                  <span className="breakdown-icon">💪</span>
                  <span className="breakdown-label">Your Strengths</span>
                </div>
                <div className="breakdown-list">
                  {bestChords.map(({ chordType, breakdown }) => (
                    <div key={chordType} className="breakdown-item">
                      <span className="item-name">{chordType}</span>
                      <div className="item-stats">
                        <span className="item-accuracy">{breakdown.accuracy}%</span>
                        <span className="item-count">
                          {breakdown.correct}/{breakdown.total}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {worstChords.length > 0 && (
              <div className="breakdown-card weaknesses">
                <div className="breakdown-header">
                  <span className="breakdown-icon">📚</span>
                  <span className="breakdown-label">Practice These</span>
                </div>
                <div className="breakdown-list">
                  {worstChords.map(({ chordType, breakdown }) => (
                    <div key={chordType} className="breakdown-item">
                      <span className="item-name">{chordType}</span>
                      <div className="item-stats">
                        <span className="item-accuracy">{breakdown.accuracy}%</span>
                        <span className="item-count">
                          {breakdown.correct}/{breakdown.total}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Interval Performance */}
      {hasIntervalData && (
        <div className="breakdown-section">
          <h4 className="breakdown-title">🎵 Interval Performance</h4>
          <div className="breakdown-grid">
            {bestIntervals.length > 0 && (
              <div className="breakdown-card strengths">
                <div className="breakdown-header">
                  <span className="breakdown-icon">💪</span>
                  <span className="breakdown-label">Your Strengths</span>
                </div>
                <div className="breakdown-list">
                  {bestIntervals.map(({ intervalName, breakdown }) => (
                    <div key={intervalName} className="breakdown-item">
                      <span className="item-name">{intervalName}</span>
                      <div className="item-stats">
                        <span className="item-accuracy">{breakdown.accuracy}%</span>
                        <span className="item-count">
                          {breakdown.correct}/{breakdown.total}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {worstIntervals.length > 0 && (
              <div className="breakdown-card weaknesses">
                <div className="breakdown-header">
                  <span className="breakdown-icon">📚</span>
                  <span className="breakdown-label">Practice These</span>
                </div>
                <div className="breakdown-list">
                  {worstIntervals.map(({ intervalName, breakdown }) => (
                    <div key={intervalName} className="breakdown-item">
                      <span className="item-name">{intervalName}</span>
                      <div className="item-stats">
                        <span className="item-accuracy">{breakdown.accuracy}%</span>
                        <span className="item-count">
                          {breakdown.correct}/{breakdown.total}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Direction Breakdown */}
          <div className="direction-breakdown">
            <h5 className="direction-title">Performance by Direction</h5>
            <div className="direction-grid">
              <div className="direction-card">
                <span className="direction-label">↗️ Ascending</span>
                <span className="direction-accuracy">
                  {stats.interval.directionBreakdown.ascending.accuracy}%
                </span>
                <span className="direction-count">
                  {stats.interval.directionBreakdown.ascending.correct}/
                  {stats.interval.directionBreakdown.ascending.total}
                </span>
              </div>
              <div className="direction-card">
                <span className="direction-label">↘️ Descending</span>
                <span className="direction-accuracy">
                  {stats.interval.directionBreakdown.descending.accuracy}%
                </span>
                <span className="direction-count">
                  {stats.interval.directionBreakdown.descending.correct}/
                  {stats.interval.directionBreakdown.descending.total}
                </span>
              </div>
              <div className="direction-card">
                <span className="direction-label">🎶 Harmonic</span>
                <span className="direction-accuracy">
                  {stats.interval.directionBreakdown.harmonic.accuracy}%
                </span>
                <span className="direction-count">
                  {stats.interval.directionBreakdown.harmonic.correct}/
                  {stats.interval.directionBreakdown.harmonic.total}
                </span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Key Performance */}
      {hasKeyData && (
        <div className="breakdown-section">
          <h4 className="breakdown-title">🎶 Key Performance</h4>
          <div className="breakdown-grid">
            {bestKeys.length > 0 && (
              <div className="breakdown-card strengths">
                <div className="breakdown-header">
                  <span className="breakdown-icon">💪</span>
                  <span className="breakdown-label">Your Strengths</span>
                </div>
                <div className="breakdown-list">
                  {bestKeys.map(({ key, breakdown }) => (
                    <div key={key} className="breakdown-item">
                      <span className="item-name">{key}</span>
                      <div className="item-stats">
                        <span className="item-accuracy">{breakdown.accuracy}%</span>
                        <span className="item-count">
                          {breakdown.correct}/{breakdown.total}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {worstKeys.length > 0 && (
              <div className="breakdown-card weaknesses">
                <div className="breakdown-header">
                  <span className="breakdown-icon">📚</span>
                  <span className="breakdown-label">Practice These</span>
                </div>
                <div className="breakdown-list">
                  {worstKeys.map(({ key, breakdown }) => (
                    <div key={key} className="breakdown-item">
                      <span className="item-name">{key}</span>
                      <div className="item-stats">
                        <span className="item-accuracy">{breakdown.accuracy}%</span>
                        <span className="item-count">
                          {breakdown.correct}/{breakdown.total}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Difficulty Breakdown */}
          <div className="difficulty-breakdown">
            <h5 className="difficulty-title">Performance by Difficulty</h5>
            <div className="difficulty-grid">
              <div className="difficulty-card">
                <span className="difficulty-label">😊 Easy</span>
                <span className="difficulty-accuracy">
                  {stats.progression.difficultyBreakdown.easy.accuracy}%
                </span>
                <span className="difficulty-count">
                  {stats.progression.difficultyBreakdown.easy.correct}/
                  {stats.progression.difficultyBreakdown.easy.total}
                </span>
              </div>
              <div className="difficulty-card">
                <span className="difficulty-label">🔥 Hard</span>
                <span className="difficulty-accuracy">
                  {stats.progression.difficultyBreakdown.hard.accuracy}%
                </span>
                <span className="difficulty-count">
                  {stats.progression.difficultyBreakdown.hard.correct}/
                  {stats.progression.difficultyBreakdown.hard.total}
                </span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
