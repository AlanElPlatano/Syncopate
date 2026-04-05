export type Screen = 'menu' | 'config' | 'training' | 'stats' | 'dashboard';

export type Mode = 'chord' | 'interval' | 'progression' | 'keyIdentification';

export interface SessionConfig {
  mode: Mode;
  numQuestions: number;
  guestMode: boolean;
}

export interface ChordTypeConfig extends SessionConfig {
  mode: 'chord';
  selectedChordTypes: string[];
}

export interface IntervalConfig extends SessionConfig {
  mode: 'interval';
  selectedIntervals: string[];
  direction: 'random' | 'ascending' | 'descending';
  harmonicMode: boolean;
  compoundIntervals: boolean;
  octaveRange: {
    min: number;
    max: number;
  };
}

export interface ProgressionConfig extends SessionConfig {
  mode: 'progression';
  difficulty: 'easy' | 'hard';
  chordPool: {
    diatonic: boolean;
    nonDiatonic: boolean;
  };
  key: string; // 'random' | 'C' | 'Dm' | etc.
}

export type KeyMode = 'major' | 'minor' | 'both';

export interface KeyIdentificationConfig extends SessionConfig {
  mode: 'keyIdentification';
  difficulty: 'easy' | 'hard';
  chordPool: {
    diatonic: boolean;
    nonDiatonic: boolean;
  };
  keyMode: KeyMode;
}

export type ModeConfig = ChordTypeConfig | IntervalConfig | ProgressionConfig | KeyIdentificationConfig;
