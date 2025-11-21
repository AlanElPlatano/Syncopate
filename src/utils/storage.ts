import {
  LifetimeStats,
  DEFAULT_LIFETIME_STATS,
  SessionStats,
  ModeStats,
  DetailedLifetimeStats,
  DetailedSessionStats,
  DEFAULT_DETAILED_LIFETIME_STATS,
  DEFAULT_DETAILED_CHORD_STATS,
  DEFAULT_DETAILED_INTERVAL_STATS,
  DEFAULT_DETAILED_PROGRESSION_STATS,
} from '../types/stats';
import { Mode } from '../types/screens';
import { updateDetailedLifetimeStats } from './analytics';

const STORAGE_KEY = 'syncopate_lifetime_stats';
const DETAILED_STORAGE_KEY = 'syncopate_detailed_stats';
const MAX_SESSIONS_IN_HISTORY = 200; // Limit to prevent localStorage overflow

export function loadLifetimeStats(): LifetimeStats {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (!stored) {
      return { ...DEFAULT_LIFETIME_STATS };
    }

    const parsed = JSON.parse(stored);
    return parsed;
  } catch (error) {
    console.error('Failed to load lifetime stats:', error);
    return { ...DEFAULT_LIFETIME_STATS };
  }
}

export function saveLifetimeStats(stats: LifetimeStats): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(stats));
  } catch (error) {
    console.error('Failed to save lifetime stats:', error);
  }
}

export function updateStatsWithSession(
  currentStats: LifetimeStats,
  sessionStats: SessionStats
): LifetimeStats {
  const mode = sessionStats.mode;
  const modeStats = currentStats[mode];

  const newModeStats: ModeStats = {
    totalSessions: modeStats.totalSessions + 1,
    totalQuestions: modeStats.totalQuestions + sessionStats.totalQuestions,
    totalCorrect: modeStats.totalCorrect + sessionStats.correctAnswers,
    overallAccuracy: 0, // Will calculate below
  };

  // Calculate overall accuracy
  if (newModeStats.totalQuestions > 0) {
    newModeStats.overallAccuracy =
      (newModeStats.totalCorrect / newModeStats.totalQuestions) * 100;
  }

  return {
    ...currentStats,
    [mode]: newModeStats,
  };
}

export function clearLifetimeStats(): void {
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch (error) {
    console.error('Failed to clear lifetime stats:', error);
  }
}

export function resetModeStats(mode: Mode): LifetimeStats {
  const currentStats = loadLifetimeStats();
  return {
    ...currentStats,
    [mode]: { ...DEFAULT_LIFETIME_STATS[mode] },
  };
}

// ============================================================================
// DETAILED STATS STORAGE (NEW ENHANCED TRACKING)
// ============================================================================

/**
 * Migrate old stats to detailed stats format
 */
export function migrateToDetailedStats(oldStats: LifetimeStats): DetailedLifetimeStats {
  return {
    version: 1,
    chord: {
      ...DEFAULT_DETAILED_CHORD_STATS,
      totalSessions: oldStats.chord.totalSessions,
      totalQuestions: oldStats.chord.totalQuestions,
      totalCorrect: oldStats.chord.totalCorrect,
      overallAccuracy: oldStats.chord.overallAccuracy,
    },
    interval: {
      ...DEFAULT_DETAILED_INTERVAL_STATS,
      totalSessions: oldStats.interval.totalSessions,
      totalQuestions: oldStats.interval.totalQuestions,
      totalCorrect: oldStats.interval.totalCorrect,
      overallAccuracy: oldStats.interval.overallAccuracy,
    },
    progression: {
      ...DEFAULT_DETAILED_PROGRESSION_STATS,
      totalSessions: oldStats.progression.totalSessions,
      totalQuestions: oldStats.progression.totalQuestions,
      totalCorrect: oldStats.progression.totalCorrect,
      overallAccuracy: oldStats.progression.overallAccuracy,
    },
    sessionHistory: {},
  };
}

/**
 * Load detailed lifetime stats from localStorage
 * If detailed stats don't exist but old stats do, migrate them
 */
export function loadDetailedLifetimeStats(): DetailedLifetimeStats {
  try {
    const stored = localStorage.getItem(DETAILED_STORAGE_KEY);

    if (stored) {
      const parsed = JSON.parse(stored);
      return parsed;
    }

    // Check if we have old stats to migrate
    const oldStats = localStorage.getItem(STORAGE_KEY);
    if (oldStats) {
      const parsedOldStats = JSON.parse(oldStats);
      const migrated = migrateToDetailedStats(parsedOldStats);

      // Save migrated stats
      saveDetailedLifetimeStats(migrated);

      return migrated;
    }

    return { ...DEFAULT_DETAILED_LIFETIME_STATS };
  } catch (error) {
    console.error('Failed to load detailed lifetime stats:', error);
    return { ...DEFAULT_DETAILED_LIFETIME_STATS };
  }
}

/**
 * Save detailed lifetime stats to localStorage with size management
 */
export function saveDetailedLifetimeStats(stats: DetailedLifetimeStats): void {
  try {
    // Manage session history size
    const sessionIds = Object.keys(stats.sessionHistory);
    if (sessionIds.length > MAX_SESSIONS_IN_HISTORY) {
      // Sort by timestamp and keep only the most recent sessions
      const sortedSessions = sessionIds
        .map(id => stats.sessionHistory[id])
        .sort((a, b) => b.timestamp - a.timestamp)
        .slice(0, MAX_SESSIONS_IN_HISTORY);

      // Rebuild session history with only recent sessions
      const newHistory: { [sessionId: string]: DetailedSessionStats } = {};
      sortedSessions.forEach(session => {
        newHistory[session.sessionId] = session;
      });

      stats = {
        ...stats,
        sessionHistory: newHistory,
      };
    }

    localStorage.setItem(DETAILED_STORAGE_KEY, JSON.stringify(stats));
  } catch (error) {
    // If we hit quota exceeded error, try to free up space
    if (error instanceof Error && error.name === 'QuotaExceededError') {
      console.warn('localStorage quota exceeded, attempting to reduce session history');

      // Keep only last 50 sessions
      const sessionIds = Object.keys(stats.sessionHistory);
      const sortedSessions = sessionIds
        .map(id => stats.sessionHistory[id])
        .sort((a, b) => b.timestamp - a.timestamp)
        .slice(0, 50);

      const newHistory: { [sessionId: string]: DetailedSessionStats } = {};
      sortedSessions.forEach(session => {
        newHistory[session.sessionId] = session;
      });

      const reducedStats = {
        ...stats,
        sessionHistory: newHistory,
      };

      try {
        localStorage.setItem(DETAILED_STORAGE_KEY, JSON.stringify(reducedStats));
      } catch (retryError) {
        console.error('Failed to save detailed stats even after reduction:', retryError);
      }
    } else {
      console.error('Failed to save detailed lifetime stats:', error);
    }
  }
}

/**
 * Update detailed stats with a new session
 */
export function updateDetailedStatsWithSession(
  currentStats: DetailedLifetimeStats,
  sessionStats: DetailedSessionStats
): DetailedLifetimeStats {
  return updateDetailedLifetimeStats(currentStats, sessionStats);
}

/**
 * Clear all detailed stats
 */
export function clearDetailedLifetimeStats(): void {
  try {
    localStorage.removeItem(DETAILED_STORAGE_KEY);
  } catch (error) {
    console.error('Failed to clear detailed lifetime stats:', error);
  }
}

/**
 * Reset detailed stats for a specific mode
 */
export function resetDetailedModeStats(mode: Mode): DetailedLifetimeStats {
  const currentStats = loadDetailedLifetimeStats();

  // Remove all sessions for this mode from history
  const filteredHistory: { [sessionId: string]: DetailedSessionStats } = {};
  Object.entries(currentStats.sessionHistory).forEach(([id, session]) => {
    if (session.mode !== mode) {
      filteredHistory[id] = session;
    }
  });

  // Reset mode stats
  const resetStats = {
    ...currentStats,
    sessionHistory: filteredHistory,
  };

  if (mode === 'chord') {
    resetStats.chord = { ...DEFAULT_DETAILED_CHORD_STATS };
  } else if (mode === 'interval') {
    resetStats.interval = { ...DEFAULT_DETAILED_INTERVAL_STATS };
  } else if (mode === 'progression') {
    resetStats.progression = { ...DEFAULT_DETAILED_PROGRESSION_STATS };
  }

  return resetStats;
}

/**
 * Get localStorage usage information
 */
export function getStorageInfo(): {
  used: number;
  available: number;
  percentage: number;
  sessionCount: number;
} {
  try {
    const stats = loadDetailedLifetimeStats();
    const statsString = JSON.stringify(stats);
    const used = new Blob([statsString]).size;

    // Most browsers have ~5-10MB limit, we'll assume 5MB to be safe
    const available = 5 * 1024 * 1024;
    const percentage = Math.round((used / available) * 100);
    const sessionCount = Object.keys(stats.sessionHistory).length;

    return {
      used,
      available,
      percentage,
      sessionCount,
    };
  } catch (error) {
    console.error('Failed to get storage info:', error);
    return {
      used: 0,
      available: 5 * 1024 * 1024,
      percentage: 0,
      sessionCount: 0,
    };
  }
}

/**
 * Delete old sessions to free up space
 */
export function pruneOldSessions(keepCount: number = 100): void {
  try {
    const stats = loadDetailedLifetimeStats();
    const sessionIds = Object.keys(stats.sessionHistory);

    if (sessionIds.length <= keepCount) {
      return; // Nothing to prune
    }

    const sortedSessions = sessionIds
      .map(id => stats.sessionHistory[id])
      .sort((a, b) => b.timestamp - a.timestamp)
      .slice(0, keepCount);

    const newHistory: { [sessionId: string]: DetailedSessionStats } = {};
    sortedSessions.forEach(session => {
      newHistory[session.sessionId] = session;
    });

    const prunedStats = {
      ...stats,
      sessionHistory: newHistory,
    };

    saveDetailedLifetimeStats(prunedStats);
  } catch (error) {
    console.error('Failed to prune old sessions:', error);
  }
}

/**
 * Generate a unique session ID
 */
export function generateSessionId(): string {
  return `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
}
