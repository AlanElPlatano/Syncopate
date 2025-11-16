import {
  DetailedLifetimeStats,
  DetailedSessionStats,
  DetailedChordStats,
  DetailedIntervalStats,
  DetailedProgressionStats,
  ChordAnswerRecord,
  IntervalAnswerRecord,
  ProgressionAnswerRecord,
  CategoryBreakdown,
  ChordTypeBreakdown,
  IntervalBreakdown,
  KeyBreakdown,
  DEFAULT_CATEGORY_BREAKDOWN,
} from '../types/stats';

// ============================================================================
// HELPER FUNCTIONS
// ============================================================================

/**
 * Update a category breakdown with a new answer
 */
function updateCategoryBreakdown(
  breakdown: CategoryBreakdown,
  isCorrect: boolean
): CategoryBreakdown {
  const updated = {
    correct: breakdown.correct + (isCorrect ? 1 : 0),
    total: breakdown.total + 1,
    accuracy: 0,
  };
  updated.accuracy = updated.total > 0
    ? Math.round((updated.correct / updated.total) * 100)
    : 0;
  return updated;
}

/**
 * Get or create a category breakdown
 */
function getOrCreateBreakdown(
  breakdownMap: Record<string, CategoryBreakdown>,
  key: string
): CategoryBreakdown {
  if (!breakdownMap[key]) {
    breakdownMap[key] = { ...DEFAULT_CATEGORY_BREAKDOWN };
  }
  return breakdownMap[key];
}

/**
 * Calculate session accuracy statistics
 */
function calculateSessionAccuracyStats(sessions: DetailedSessionStats[]): {
  best?: number;
  worst?: number;
  average?: number;
} {
  if (sessions.length === 0) {
    return {};
  }

  const accuracies = sessions.map(s => s.accuracy);
  return {
    best: Math.max(...accuracies),
    worst: Math.min(...accuracies),
    average: Math.round(accuracies.reduce((sum, acc) => sum + acc, 0) / accuracies.length),
  };
}

// ============================================================================
// STATS UPDATE FUNCTIONS
// ============================================================================

/**
 * Update chord stats with a new session
 */
export function updateChordStats(
  currentStats: DetailedChordStats,
  session: DetailedSessionStats
): DetailedChordStats {
  const updated: DetailedChordStats = {
    ...currentStats,
    totalSessions: currentStats.totalSessions + 1,
    totalQuestions: currentStats.totalQuestions + session.totalQuestions,
    totalCorrect: currentStats.totalCorrect + session.correctAnswers,
    overallAccuracy: 0,
    lastPlayed: session.timestamp,
    chordTypeBreakdown: { ...currentStats.chordTypeBreakdown },
    recentSessions: [...currentStats.recentSessions, session.sessionId],
  };

  // Calculate overall accuracy
  updated.overallAccuracy = updated.totalQuestions > 0
    ? Math.round((updated.totalCorrect / updated.totalQuestions) * 100)
    : 0;

  // Update chord type breakdowns
  session.answers.forEach(answer => {
    const chordAnswer = answer as ChordAnswerRecord;
    const breakdown = getOrCreateBreakdown(updated.chordTypeBreakdown, chordAnswer.chordType);
    updated.chordTypeBreakdown[chordAnswer.chordType] = updateCategoryBreakdown(
      breakdown,
      chordAnswer.isCorrect
    );
  });

  // Keep only last 100 sessions to manage size
  if (updated.recentSessions.length > 100) {
    updated.recentSessions = updated.recentSessions.slice(-100);
  }

  return updated;
}

/**
 * Update interval stats with a new session
 */
export function updateIntervalStats(
  currentStats: DetailedIntervalStats,
  session: DetailedSessionStats
): DetailedIntervalStats {
  const updated: DetailedIntervalStats = {
    ...currentStats,
    totalSessions: currentStats.totalSessions + 1,
    totalQuestions: currentStats.totalQuestions + session.totalQuestions,
    totalCorrect: currentStats.totalCorrect + session.correctAnswers,
    overallAccuracy: 0,
    lastPlayed: session.timestamp,
    intervalBreakdown: { ...currentStats.intervalBreakdown },
    directionBreakdown: { ...currentStats.directionBreakdown },
    recentSessions: [...currentStats.recentSessions, session.sessionId],
  };

  // Calculate overall accuracy
  updated.overallAccuracy = updated.totalQuestions > 0
    ? Math.round((updated.totalCorrect / updated.totalQuestions) * 100)
    : 0;

  // Update interval and direction breakdowns
  session.answers.forEach(answer => {
    const intervalAnswer = answer as IntervalAnswerRecord;

    // Update interval breakdown
    const intervalBreakdown = getOrCreateBreakdown(
      updated.intervalBreakdown,
      intervalAnswer.intervalName
    );
    updated.intervalBreakdown[intervalAnswer.intervalName] = updateCategoryBreakdown(
      intervalBreakdown,
      intervalAnswer.isCorrect
    );

    // Update direction breakdown
    const directionBreakdown = updated.directionBreakdown[intervalAnswer.direction];
    updated.directionBreakdown[intervalAnswer.direction] = updateCategoryBreakdown(
      directionBreakdown,
      intervalAnswer.isCorrect
    );
  });

  // Keep only last 100 sessions
  if (updated.recentSessions.length > 100) {
    updated.recentSessions = updated.recentSessions.slice(-100);
  }

  return updated;
}

/**
 * Update progression stats with a new session
 */
export function updateProgressionStats(
  currentStats: DetailedProgressionStats,
  session: DetailedSessionStats
): DetailedProgressionStats {
  const updated: DetailedProgressionStats = {
    ...currentStats,
    totalSessions: currentStats.totalSessions + 1,
    totalQuestions: currentStats.totalQuestions + session.totalQuestions,
    totalCorrect: currentStats.totalCorrect + session.correctAnswers,
    overallAccuracy: 0,
    lastPlayed: session.timestamp,
    keyBreakdown: { ...currentStats.keyBreakdown },
    difficultyBreakdown: { ...currentStats.difficultyBreakdown },
    recentSessions: [...currentStats.recentSessions, session.sessionId],
  };

  // Calculate overall accuracy
  updated.overallAccuracy = updated.totalQuestions > 0
    ? Math.round((updated.totalCorrect / updated.totalQuestions) * 100)
    : 0;

  // Update key and difficulty breakdowns
  session.answers.forEach(answer => {
    const progressionAnswer = answer as ProgressionAnswerRecord;

    // Update key breakdown
    const keyBreakdown = getOrCreateBreakdown(updated.keyBreakdown, progressionAnswer.key);
    updated.keyBreakdown[progressionAnswer.key] = updateCategoryBreakdown(
      keyBreakdown,
      progressionAnswer.isCorrect
    );

    // Update difficulty breakdown
    const difficultyBreakdown = updated.difficultyBreakdown[progressionAnswer.difficulty];
    updated.difficultyBreakdown[progressionAnswer.difficulty] = updateCategoryBreakdown(
      difficultyBreakdown,
      progressionAnswer.isCorrect
    );
  });

  // Keep only last 100 sessions
  if (updated.recentSessions.length > 100) {
    updated.recentSessions = updated.recentSessions.slice(-100);
  }

  return updated;
}

/**
 * Update detailed lifetime stats with a new session
 */
export function updateDetailedLifetimeStats(
  currentStats: DetailedLifetimeStats,
  session: DetailedSessionStats
): DetailedLifetimeStats {
  const updated: DetailedLifetimeStats = {
    ...currentStats,
    sessionHistory: {
      ...currentStats.sessionHistory,
      [session.sessionId]: session,
    },
  };

  // Update mode-specific stats
  if (session.mode === 'chord') {
    updated.chord = updateChordStats(currentStats.chord, session);
  } else if (session.mode === 'interval') {
    updated.interval = updateIntervalStats(currentStats.interval, session);
  } else if (session.mode === 'progression') {
    updated.progression = updateProgressionStats(currentStats.progression, session);
  }

  // Update session accuracy statistics for the mode
  const modeSessions = getSessionsByMode(updated, session.mode);
  const accuracyStats = calculateSessionAccuracyStats(modeSessions);

  if (session.mode === 'chord') {
    updated.chord = { ...updated.chord, ...accuracyStats };
  } else if (session.mode === 'interval') {
    updated.interval = { ...updated.interval, ...accuracyStats };
  } else if (session.mode === 'progression') {
    updated.progression = { ...updated.progression, ...accuracyStats };
  }

  return updated;
}

// ============================================================================
// QUERY FUNCTIONS
// ============================================================================

/**
 * Get all sessions for a specific mode
 */
export function getSessionsByMode(
  stats: DetailedLifetimeStats,
  mode: 'chord' | 'interval' | 'progression'
): DetailedSessionStats[] {
  return Object.values(stats.sessionHistory)
    .filter(session => session.mode === mode)
    .sort((a, b) => b.timestamp - a.timestamp);
}

/**
 * Get recent sessions across all modes
 */
export function getRecentSessions(
  stats: DetailedLifetimeStats,
  limit: number = 10
): DetailedSessionStats[] {
  return Object.values(stats.sessionHistory)
    .sort((a, b) => b.timestamp - a.timestamp)
    .slice(0, limit);
}

/**
 * Get sessions within a date range
 */
export function getSessionsByDateRange(
  stats: DetailedLifetimeStats,
  startDate: number,
  endDate: number
): DetailedSessionStats[] {
  return Object.values(stats.sessionHistory)
    .filter(session => session.timestamp >= startDate && session.timestamp <= endDate)
    .sort((a, b) => b.timestamp - a.timestamp);
}

/**
 * Get best chord types (highest accuracy)
 */
export function getBestChordTypes(
  chordTypeBreakdown: ChordTypeBreakdown,
  limit: number = 5
): Array<{ chordType: string; breakdown: CategoryBreakdown }> {
  return Object.entries(chordTypeBreakdown)
    .map(([chordType, breakdown]) => ({ chordType, breakdown }))
    .filter(item => item.breakdown.total >= 3) // Minimum sample size
    .sort((a, b) => b.breakdown.accuracy - a.breakdown.accuracy)
    .slice(0, limit);
}

/**
 * Get worst chord types (lowest accuracy)
 */
export function getWorstChordTypes(
  chordTypeBreakdown: ChordTypeBreakdown,
  limit: number = 5
): Array<{ chordType: string; breakdown: CategoryBreakdown }> {
  return Object.entries(chordTypeBreakdown)
    .map(([chordType, breakdown]) => ({ chordType, breakdown }))
    .filter(item => item.breakdown.total >= 3) // Minimum sample size
    .sort((a, b) => a.breakdown.accuracy - b.breakdown.accuracy)
    .slice(0, limit);
}

/**
 * Get best intervals (highest accuracy)
 */
export function getBestIntervals(
  intervalBreakdown: IntervalBreakdown,
  limit: number = 5
): Array<{ intervalName: string; breakdown: CategoryBreakdown }> {
  return Object.entries(intervalBreakdown)
    .map(([intervalName, breakdown]) => ({ intervalName, breakdown }))
    .filter(item => item.breakdown.total >= 3)
    .sort((a, b) => b.breakdown.accuracy - a.breakdown.accuracy)
    .slice(0, limit);
}

/**
 * Get worst intervals (lowest accuracy)
 */
export function getWorstIntervals(
  intervalBreakdown: IntervalBreakdown,
  limit: number = 5
): Array<{ intervalName: string; breakdown: CategoryBreakdown }> {
  return Object.entries(intervalBreakdown)
    .map(([intervalName, breakdown]) => ({ intervalName, breakdown }))
    .filter(item => item.breakdown.total >= 3)
    .sort((a, b) => a.breakdown.accuracy - b.breakdown.accuracy)
    .slice(0, limit);
}

/**
 * Get best keys (highest accuracy)
 */
export function getBestKeys(
  keyBreakdown: KeyBreakdown,
  limit: number = 5
): Array<{ key: string; breakdown: CategoryBreakdown }> {
  return Object.entries(keyBreakdown)
    .map(([key, breakdown]) => ({ key, breakdown }))
    .filter(item => item.breakdown.total >= 3)
    .sort((a, b) => b.breakdown.accuracy - a.breakdown.accuracy)
    .slice(0, limit);
}

/**
 * Get worst keys (lowest accuracy)
 */
export function getWorstKeys(
  keyBreakdown: KeyBreakdown,
  limit: number = 5
): Array<{ key: string; breakdown: CategoryBreakdown }> {
  return Object.entries(keyBreakdown)
    .map(([key, breakdown]) => ({ key, breakdown }))
    .filter(item => item.breakdown.total >= 3)
    .sort((a, b) => a.breakdown.accuracy - b.breakdown.accuracy)
    .slice(0, limit);
}

/**
 * Get accuracy trend over time for a specific mode
 */
export function getAccuracyTrend(
  stats: DetailedLifetimeStats,
  mode: 'chord' | 'interval' | 'progression',
  numberOfSessions: number = 10
): Array<{ sessionId: string; timestamp: number; accuracy: number }> {
  return getSessionsByMode(stats, mode)
    .slice(0, numberOfSessions)
    .reverse()
    .map(session => ({
      sessionId: session.sessionId,
      timestamp: session.timestamp,
      accuracy: session.accuracy,
    }));
}

/**
 * Calculate statistics for a specific chord type
 */
export function getChordTypeStats(
  stats: DetailedLifetimeStats,
  chordType: string
): CategoryBreakdown {
  return stats.chord.chordTypeBreakdown[chordType] || { ...DEFAULT_CATEGORY_BREAKDOWN };
}

/**
 * Calculate statistics for a specific interval
 */
export function getIntervalStats(
  stats: DetailedLifetimeStats,
  intervalName: string
): CategoryBreakdown {
  return stats.interval.intervalBreakdown[intervalName] || { ...DEFAULT_CATEGORY_BREAKDOWN };
}

/**
 * Calculate statistics for a specific key
 */
export function getKeyStats(
  stats: DetailedLifetimeStats,
  key: string
): CategoryBreakdown {
  return stats.progression.keyBreakdown[key] || { ...DEFAULT_CATEGORY_BREAKDOWN };
}

/**
 * Get overall statistics summary
 */
export function getOverallSummary(stats: DetailedLifetimeStats) {
  const totalSessions = stats.chord.totalSessions +
                        stats.interval.totalSessions +
                        stats.progression.totalSessions;

  const totalQuestions = stats.chord.totalQuestions +
                         stats.interval.totalQuestions +
                         stats.progression.totalQuestions;

  const totalCorrect = stats.chord.totalCorrect +
                       stats.interval.totalCorrect +
                       stats.progression.totalCorrect;

  const overallAccuracy = totalQuestions > 0
    ? Math.round((totalCorrect / totalQuestions) * 100)
    : 0;

  return {
    totalSessions,
    totalQuestions,
    totalCorrect,
    overallAccuracy,
    byMode: {
      chord: {
        sessions: stats.chord.totalSessions,
        accuracy: stats.chord.overallAccuracy,
      },
      interval: {
        sessions: stats.interval.totalSessions,
        accuracy: stats.interval.overallAccuracy,
      },
      progression: {
        sessions: stats.progression.totalSessions,
        accuracy: stats.progression.overallAccuracy,
      },
    },
  };
}

/**
 * Get total time spent training (actual time from session durations)
 */
export function getTotalTrainingTime(stats: DetailedLifetimeStats): {
  totalMilliseconds: number;
  totalSeconds: number;
  totalMinutes: number;
  totalHours: number;
  formatted: string;
  formattedDetailed: string;
} {
  // Sum up all session durations
  const totalMilliseconds = Object.values(stats.sessionHistory).reduce(
    (sum, session) => sum + (session.duration || 0),
    0
  );

  const totalSeconds = Math.floor(totalMilliseconds / 1000);
  const totalMinutes = Math.floor(totalSeconds / 60);
  const totalHours = Math.floor(totalMinutes / 60);

  const hours = totalHours;
  const minutes = totalMinutes % 60;
  const seconds = totalSeconds % 60;

  return {
    totalMilliseconds,
    totalSeconds,
    totalMinutes,
    totalHours,
    formatted: hours > 0 ? `${hours}h ${minutes}m` : `${minutes}m`,
    formattedDetailed: hours > 0
      ? `${hours}h ${minutes}m ${seconds}s`
      : minutes > 0
      ? `${minutes}m ${seconds}s`
      : `${seconds}s`,
  };
}

/**
 * Get average time per question across all sessions
 */
export function getAverageTimePerQuestion(stats: DetailedLifetimeStats): {
  milliseconds: number;
  seconds: number;
  formatted: string;
} {
  const totalQuestions = stats.chord.totalQuestions +
                         stats.interval.totalQuestions +
                         stats.progression.totalQuestions;

  if (totalQuestions === 0) {
    return { milliseconds: 0, seconds: 0, formatted: '0s' };
  }

  const totalTime = getTotalTrainingTime(stats);
  const avgMilliseconds = Math.floor(totalTime.totalMilliseconds / totalQuestions);
  const avgSeconds = Math.floor(avgMilliseconds / 1000);

  return {
    milliseconds: avgMilliseconds,
    seconds: avgSeconds,
    formatted: `${avgSeconds}s`,
  };
}

/**
 * Get training time breakdown by mode
 */
export function getTrainingTimeByMode(stats: DetailedLifetimeStats): {
  chord: { duration: number; formatted: string };
  interval: { duration: number; formatted: string };
  progression: { duration: number; formatted: string };
} {
  const modeTimes = {
    chord: 0,
    interval: 0,
    progression: 0,
  };

  Object.values(stats.sessionHistory).forEach(session => {
    modeTimes[session.mode] += session.duration || 0;
  });

  const formatTime = (ms: number) => {
    const seconds = Math.floor(ms / 1000);
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;

    return hours > 0 ? `${hours}h ${mins}m` : `${mins}m`;
  };

  return {
    chord: { duration: modeTimes.chord, formatted: formatTime(modeTimes.chord) },
    interval: { duration: modeTimes.interval, formatted: formatTime(modeTimes.interval) },
    progression: { duration: modeTimes.progression, formatted: formatTime(modeTimes.progression) },
  };
}
