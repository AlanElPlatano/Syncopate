import {
  LifetimeStats,
  DEFAULT_LIFETIME_STATS,
  SessionStats,
  ModeStats,
} from '../types/stats';
import { Mode } from '../types/screens';

const STORAGE_KEY = 'eargym_lifetime_stats';

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
