import { Mode } from './screens';

// ============================================================================
// DETAILED ANSWER RECORDS
// ============================================================================

/**
 * Detailed record of a single answer in chord training
 */
export interface ChordAnswerRecord {
  questionIndex: number;
  timestamp: number;
  isCorrect: boolean;
  correctAnswer: string;
  userAnswer: string;
  rootNote: string;
  chordType: string;
}

/**
 * Detailed record of a single answer in interval training
 */
export interface IntervalAnswerRecord {
  questionIndex: number;
  timestamp: number;
  isCorrect: boolean;
  correctAnswer: string;
  userAnswer: string;
  intervalName: string;
  direction: 'ascending' | 'descending' | 'harmonic';
  note1: string;
  note2: string;
}

/**
 * Detailed record of a single answer in progression training
 */
export interface ProgressionAnswerRecord {
  questionIndex: number;
  timestamp: number;
  isCorrect: boolean;
  correctAnswer: string[];
  userAnswer: string[];
  key: string;
  progressionLength: number;
  bpm: number;
  difficulty: 'easy' | 'hard';
}

export type AnswerRecord =
  | ChordAnswerRecord
  | IntervalAnswerRecord
  | ProgressionAnswerRecord;

// ============================================================================
// SESSION STATISTICS
// ============================================================================

/**
 * Basic session stats (backward compatible)
 */
export interface SessionStats {
  mode: Mode;
  correctAnswers: number;
  totalQuestions: number;
  accuracy: number;
  timestamp: number;
}

/**
 * Enhanced session stats with detailed answer records
 */
export interface DetailedSessionStats extends SessionStats {
  sessionId: string;
  answers: AnswerRecord[];
  config: {
    guestMode: boolean;
    numQuestions: number;
    [key: string]: any; // Mode-specific config
  };
  sessionStartTime: number; // Timestamp when session started
  sessionEndTime: number; // Timestamp when session ended
  duration: number; // Actual duration in milliseconds
}

// ============================================================================
// BREAKDOWN STATISTICS
// ============================================================================

/**
 * Generic breakdown for tracking accuracy by category
 */
export interface CategoryBreakdown {
  correct: number;
  total: number;
  accuracy: number;
}

/**
 * Chord type breakdown stats
 */
export interface ChordTypeBreakdown {
  [chordType: string]: CategoryBreakdown;
}

/**
 * Interval breakdown stats
 */
export interface IntervalBreakdown {
  [intervalName: string]: CategoryBreakdown;
}

/**
 * Key breakdown stats
 */
export interface KeyBreakdown {
  [key: string]: CategoryBreakdown;
}

/**
 * Direction breakdown stats (for intervals)
 */
export interface DirectionBreakdown {
  ascending: CategoryBreakdown;
  descending: CategoryBreakdown;
  harmonic: CategoryBreakdown;
}

/**
 * Difficulty breakdown stats (for progressions)
 */
export interface DifficultyBreakdown {
  easy: CategoryBreakdown;
  hard: CategoryBreakdown;
}

// ============================================================================
// MODE STATISTICS
// ============================================================================

/**
 * Basic mode stats (backward compatible)
 */
export interface ModeStats {
  totalSessions: number;
  totalQuestions: number;
  totalCorrect: number;
  overallAccuracy: number;
}

/**
 * Enhanced mode stats with detailed breakdowns
 */
export interface DetailedModeStats extends ModeStats {
  lastPlayed?: number; // timestamp
  bestSessionAccuracy?: number;
  worstSessionAccuracy?: number;
  averageSessionAccuracy?: number;
  recentSessions: string[]; // Array of session IDs (limited to last N)
}

/**
 * Enhanced chord mode stats
 */
export interface DetailedChordStats extends DetailedModeStats {
  chordTypeBreakdown: ChordTypeBreakdown;
}

/**
 * Enhanced interval mode stats
 */
export interface DetailedIntervalStats extends DetailedModeStats {
  intervalBreakdown: IntervalBreakdown;
  directionBreakdown: DirectionBreakdown;
}

/**
 * Enhanced progression mode stats
 */
export interface DetailedProgressionStats extends DetailedModeStats {
  keyBreakdown: KeyBreakdown;
  difficultyBreakdown: DifficultyBreakdown;
}

// ============================================================================
// LIFETIME STATISTICS
// ============================================================================

/**
 * Basic lifetime stats (backward compatible)
 */
export interface LifetimeStats {
  chord: ModeStats;
  interval: ModeStats;
  progression: ModeStats;
}

/**
 * Enhanced lifetime stats with detailed breakdowns and session history
 */
export interface DetailedLifetimeStats {
  version: number; // For future migrations
  chord: DetailedChordStats;
  interval: DetailedIntervalStats;
  progression: DetailedProgressionStats;
  sessionHistory: {
    [sessionId: string]: DetailedSessionStats;
  };
}

// ============================================================================
// DEFAULT VALUES
// ============================================================================

export const DEFAULT_CATEGORY_BREAKDOWN: CategoryBreakdown = {
  correct: 0,
  total: 0,
  accuracy: 0,
};

export const DEFAULT_MODE_STATS: ModeStats = {
  totalSessions: 0,
  totalQuestions: 0,
  totalCorrect: 0,
  overallAccuracy: 0,
};

export const DEFAULT_DETAILED_MODE_STATS: DetailedModeStats = {
  ...DEFAULT_MODE_STATS,
  recentSessions: [],
};

export const DEFAULT_DETAILED_CHORD_STATS: DetailedChordStats = {
  ...DEFAULT_DETAILED_MODE_STATS,
  chordTypeBreakdown: {},
};

export const DEFAULT_DETAILED_INTERVAL_STATS: DetailedIntervalStats = {
  ...DEFAULT_DETAILED_MODE_STATS,
  intervalBreakdown: {},
  directionBreakdown: {
    ascending: { ...DEFAULT_CATEGORY_BREAKDOWN },
    descending: { ...DEFAULT_CATEGORY_BREAKDOWN },
    harmonic: { ...DEFAULT_CATEGORY_BREAKDOWN },
  },
};

export const DEFAULT_DETAILED_PROGRESSION_STATS: DetailedProgressionStats = {
  ...DEFAULT_DETAILED_MODE_STATS,
  keyBreakdown: {},
  difficultyBreakdown: {
    easy: { ...DEFAULT_CATEGORY_BREAKDOWN },
    hard: { ...DEFAULT_CATEGORY_BREAKDOWN },
  },
};

export const DEFAULT_LIFETIME_STATS: LifetimeStats = {
  chord: { ...DEFAULT_MODE_STATS },
  interval: { ...DEFAULT_MODE_STATS },
  progression: { ...DEFAULT_MODE_STATS },
};

export const DEFAULT_DETAILED_LIFETIME_STATS: DetailedLifetimeStats = {
  version: 1,
  chord: { ...DEFAULT_DETAILED_CHORD_STATS },
  interval: { ...DEFAULT_DETAILED_INTERVAL_STATS },
  progression: { ...DEFAULT_DETAILED_PROGRESSION_STATS },
  sessionHistory: {},
};
