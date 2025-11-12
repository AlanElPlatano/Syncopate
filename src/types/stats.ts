import { Mode } from './screens';

export interface SessionStats {
  mode: Mode;
  correctAnswers: number;
  totalQuestions: number;
  accuracy: number;
  timestamp: number;
}

export interface ModeStats {
  totalSessions: number;
  totalQuestions: number;
  totalCorrect: number;
  overallAccuracy: number;
}

export interface LifetimeStats {
  chord: ModeStats;
  interval: ModeStats;
  progression: ModeStats;
}

export const DEFAULT_MODE_STATS: ModeStats = {
  totalSessions: 0,
  totalQuestions: 0,
  totalCorrect: 0,
  overallAccuracy: 0,
};

export const DEFAULT_LIFETIME_STATS: LifetimeStats = {
  chord: { ...DEFAULT_MODE_STATS },
  interval: { ...DEFAULT_MODE_STATS },
  progression: { ...DEFAULT_MODE_STATS },
};
