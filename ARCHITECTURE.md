# Syncopate - Complete Architecture Documentation

## Table of Contents

1. [Overview](#overview)
2. [Technology Stack](#technology-stack)
3. [Project Structure](#project-structure)
4. [Music Theory Implementation](#music-theory-implementation)
5. [Audio Engine & Sound Synthesis](#audio-engine--sound-synthesis)
6. [Training Modes Logic](#training-modes-logic)
7. [State Management & Data Flow](#state-management--data-flow)
8. [Statistics & Analytics System](#statistics--analytics-system)
9. [Component Architecture](#component-architecture)
10. [Clever Tricks & Optimizations](#clever-tricks--optimizations)
11. [User Experience Flow](#user-experience-flow)

---

## Overview

Syncopate is a web-based musical ear training application that helps users develop their ability to identify chords, intervals, and chord progressions by ear. The application is built entirely in the browser using React, TypeScript, and Tone.js for audio synthesis.

**Core Features:**
- Three distinct training modes (Chord Types, Intervals, Chord Progressions)
- Real-time audio synthesis with piano and guitar instruments
- Comprehensive statistics tracking with detailed breakdowns
- Guest mode for non-tracked practice
- localStorage-based persistence

---

## Technology Stack

### Core Technologies

```json
{
  "react": "^18.3.1",           // UI framework
  "react-dom": "^18.3.1",       // DOM rendering
  "tone": "^15.1.3",            // Web Audio API wrapper for sound synthesis
  "typescript": "~5.6.2",       // Type safety
  "vite": "^6.0.7"              // Build tool and dev server
}
```

### Development & Testing

```json
{
  "@testing-library/react": "^16.3.0",     // Component testing
  "@testing-library/user-event": "^14.6.1", // User interaction testing
  "vitest": "^4.0.12",                      // Test runner
  "happy-dom": "^20.0.10",                  // DOM emulation for tests
  "eslint": "^9.17.0"                       // Code quality
}
```

### Key Design Decisions

1. **No Backend**: Everything runs client-side, making deployment simple (GitHub Pages)
2. **localStorage for Persistence**: Statistics are stored in browser's localStorage
3. **Tone.js for Audio**: Leverages Web Audio API for high-quality synthesis without audio files
4. **React Context for State**: Global state management without external libraries
5. **TypeScript Throughout**: Full type safety across the codebase

---

## Project Structure

```
src/
├── audio/                  # Audio engine and music theory
│   ├── AudioEngine.ts     # Main audio playback engine
│   ├── instruments.ts     # Instrument implementations (Piano, Guitar)
│   ├── progressions.ts    # Roman numeral chord progression logic
│   └── theory.ts          # Music theory utilities (notes, intervals, chords)
│
├── components/
│   ├── common/            # Reusable UI components (Button, Card)
│   ├── config/            # Configuration screen components
│   ├── modes/             # Mode-specific components
│   │   ├── chord/         # Chord training components
│   │   ├── interval/      # Interval training components
│   │   └── progression/   # Progression training components
│   ├── screens/           # Top-level screen components
│   ├── stats/             # Statistics display components
│   └── training/          # Training session UI components
│
├── context/               # React Context providers
│   ├── AppContext.tsx     # Navigation and app state
│   ├── AudioContext.tsx   # Audio engine state
│   └── StatsContext.tsx   # Statistics state
│
├── logic/                 # Business logic (pure functions)
│   ├── chordTraining.ts   # Chord question generation & validation
│   ├── intervalTraining.ts # Interval question generation & validation
│   └── progressionTraining.ts # Progression generation & validation
│
├── types/                 # TypeScript type definitions
│   ├── screens.ts         # Screen and config types
│   └── stats.ts           # Statistics types
│
└── utils/                 # Utility functions
    ├── analytics.ts       # Statistics calculation
    └── storage.ts         # localStorage operations
```

### Architecture Principles

1. **Separation of Concerns**:
   - `audio/` handles all sound generation
   - `logic/` contains pure business logic (testable, no side effects)
   - `components/` handles only UI rendering
   - `context/` manages global state

2. **Testability**: Logic is separated into pure functions that can be easily tested

3. **Type Safety**: Every module has comprehensive TypeScript types

---

## Music Theory Implementation

### Core Concepts (`src/audio/theory.ts`)

#### Note Representation

Notes are represented in scientific pitch notation (e.g., "C4", "A#5"):

```typescript
export interface Note {
  name: string;    // e.g., "C", "D#"
  octave: number;  // e.g., 4
  midi: number;    // MIDI note number (0-127)
}

// Note names (chromatic scale)
export const NOTE_NAMES = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'];
```

**Key Functions:**

1. **`midiToNoteName(midi: number): string`**
   - Converts MIDI number to note name
   - Formula: `octave = floor(midi / 12) - 1`
   - Example: MIDI 60 → "C4"

2. **`noteNameToMidi(noteName: string): number`**
   - Parses note name to MIDI number
   - Handles flats by converting to sharps (enharmonic equivalents)
   - Example: "Eb4" → "D#4" → MIDI 63

3. **`transposeNote(noteName: string, semitones: number): string`**
   - Transposes a note by a given number of semitones
   - Core function used for building intervals and chords

#### Intervals

Intervals are defined as semitone distances:

```typescript
export const INTERVALS = {
  'Minor 2nd': 1,
  'Major 2nd': 2,
  'Minor 3rd': 3,
  'Major 3rd': 4,
  'Perfect 4th': 5,
  'Tritone': 6,
  'Perfect 5th': 7,
  // ... up to 'Double Octave': 24
} as const;
```

**Compound Intervals**: The app supports intervals beyond an octave (Minor 9th, Major 9th, etc.) for advanced training.

**`getInterval(rootNote: string, intervalName: string): string`**
- Calculates the second note of an interval
- Example: `getInterval("C4", "Perfect 5th")` → "G4"

#### Chords

Chords are defined by interval patterns from the root:

```typescript
export const CHORD_TYPES = {
  'Major': [0, 4, 7],           // Root, Major 3rd, Perfect 5th
  'Minor': [0, 3, 7],           // Root, Minor 3rd, Perfect 5th
  'Dominant 7th': [0, 4, 7, 10], // Root, M3, P5, Minor 7th
  'Major 7th': [0, 4, 7, 11],   // Root, M3, P5, Major 7th
  'Minor 7th': [0, 3, 7, 10],   // Root, m3, P5, m7
  'Diminished': [0, 3, 6],      // Root, m3, Diminished 5th
  'Augmented': [0, 4, 8],       // Root, M3, Augmented 5th
} as const;
```

**`getChordNotes(rootNote: string, chordType: string): string[]`**
- Builds a chord by transposing the root by each interval
- Example: `getChordNotes("C4", "Major")` → ["C4", "E4", "G4"]

### Chord Progressions (`src/audio/progressions.ts`)

This module implements Roman numeral analysis for chord progressions.

#### Roman Numeral System

```typescript
export type RomanNumeral =
  | 'I' | 'ii' | 'iii' | 'IV' | 'V' | 'vi' | 'vii°'  // Major key diatonic
  | 'i' | 'ii°' | 'III' | 'iv' | 'v' | 'VI' | 'VII'  // Minor key diatonic
  | 'V7' | 'V7/V' | 'bVII' | 'II7' | 'IV7';          // Non-diatonic

export interface RomanNumeralChord {
  numeral: RomanNumeral;
  intervals: number[];  // Semitone pattern
  label: string;        // Display label
}
```

**Diatonic vs Non-Diatonic:**
- **Diatonic**: Chords built from the scale of the key (I, ii, iii, IV, V, vi, vii° in major)
- **Non-Diatonic**: Borrowed chords, secondary dominants (V7/V, bVII, etc.)

#### Key Implementation

**Scale Degrees:**
```typescript
const MAJOR_SCALE_DEGREES = [0, 2, 4, 5, 7, 9, 11];  // Semitones from tonic
const MINOR_SCALE_DEGREES = [0, 2, 3, 5, 7, 8, 10];  // Natural minor
```

**Key Parsing:**
```typescript
export function parseKey(key: string): { root: string; mode: 'major' | 'minor' } {
  const isMinor = key.endsWith('m');
  const root = isMinor ? key.slice(0, -1) : key;
  return { root, mode: isMinor ? 'minor' : 'major' };
}
```

**Roman Numeral to Chord Conversion:**
```typescript
export function romanNumeralToChord(
  romanNumeral: RomanNumeralChord,
  key: string
): string[] {
  // 1. Parse key to get root and mode
  // 2. Determine scale degree from numeral
  // 3. Calculate root note of the chord
  // 4. Apply interval pattern to build chord
}
```

This allows the app to generate progressions like "I - IV - V - I" in any key.

---

## Audio Engine & Sound Synthesis

### Architecture Overview (`src/audio/AudioEngine.ts`)

The audio engine is a facade that manages instrument instances and provides high-level playback methods.

```typescript
export class AudioEngine {
  private currentInstrument: Instrument;
  private instrumentType: InstrumentType;
  private initialized: boolean = false;

  async initialize(): Promise<void> {
    await Tone.start();  // Required user interaction for Web Audio API
  }

  playNote(note: string, duration = '1n', startTime?: number): void
  playChord(notes: string[], duration = '1n', startTime?: number): void
  async playInterval(...): Promise<void>
  async playProgression(...): Promise<void>
}
```

**Key Design Decisions:**

1. **Lazy Initialization**: `Tone.start()` requires user interaction (browser autoplay policy)
2. **Timing Control**: Uses Tone.js's clock system for precise scheduling
3. **Async Playback**: Long sequences return Promises that resolve when complete

### Instruments (`src/audio/instruments.ts`)

#### Instrument Interface

```typescript
export interface Instrument {
  playNote(note: string, duration?: string, startTime?: number): void;
  playChord(notes: string[], duration?: string, startTime?: number): void;
  dispose(): Promise<void>;
}
```

#### Piano Implementation

Uses a **PolySynth** with sine wave oscillators:

```typescript
export class PianoInstrument implements Instrument {
  private synth: Tone.PolySynth;

  constructor() {
    this.synth = new Tone.PolySynth(Tone.Synth, {
      oscillator: {
        type: 'sine',  // Pure, clean tone
      },
      envelope: {
        attack: 0.005,   // Very fast attack (5ms)
        decay: 0.3,      // Moderate decay
        sustain: 0.4,    // Medium sustain level
        release: 1.2,    // Long release (piano-like)
      },
      volume: -8,        // Reduce volume to prevent clipping
    }).toDestination();
  }
}
```

**Envelope Shaping**: The ADSR (Attack, Decay, Sustain, Release) envelope shapes the amplitude over time:
- **Attack (5ms)**: Piano hammers strike quickly
- **Decay (300ms)**: Initial sound dies down
- **Sustain (0.4)**: Held at 40% of peak
- **Release (1.2s)**: Natural piano decay when released

#### Guitar Implementation

Uses **FMSynth** (Frequency Modulation) for plucked sound:

```typescript
export class GuitarInstrument implements Instrument {
  constructor() {
    this.synth = new Tone.PolySynth(Tone.FMSynth, {
      harmonicity: 2,         // Frequency ratio of carrier to modulator
      modulationIndex: 20,    // Depth of modulation (brightness)
      oscillator: {
        type: 'triangle',     // Carrier waveform
      },
      envelope: {
        attack: 0.005,
        decay: 0.3,
        sustain: 0.1,         // Lower sustain (plucked instruments decay)
        release: 0.8,         // Shorter release than piano
      },
      modulation: {
        type: 'square',       // Modulator waveform
      },
      modulationEnvelope: {
        attack: 0.01,
        decay: 0.2,
        sustain: 0,           // No sustain for modulation
        release: 0.2,
      },
      volume: -5,
    }).toDestination();
  }
}
```

**FM Synthesis**: Creates rich, metallic timbres perfect for guitar simulation by modulating one oscillator with another.

#### Guitar Strumming Trick

Chords on guitar are played with a **staggered attack** to simulate strumming:

```typescript
playChord(notes: string[], duration = '1n', startTime?: number): void {
  const strumDelay = 0.02; // 20ms between notes
  notes.forEach((note, index) => {
    const time = startTime !== undefined
      ? startTime + (index * strumDelay)
      : `+${index * strumDelay}`;
    this.synth.triggerAttackRelease(note, duration, time);
  });
}
```

This creates a realistic strumming effect by playing each note 20ms apart.

#### Graceful Disposal

Instruments implement careful cleanup to avoid audio clicks:

```typescript
async dispose(): Promise<void> {
  this.synth.releaseAll();           // Release all active notes
  this.synth.volume.rampTo(-60, 0.1); // Fade out over 100ms
  await new Promise(resolve => setTimeout(resolve, 1300)); // Wait for envelope
  this.synth.dispose();              // Clean up
}
```

### Advanced Playback Methods

#### Interval Playback

```typescript
async playInterval(
  note1: string,
  note2: string,
  direction: 'ascending' | 'descending' | 'harmonic' = 'ascending',
  duration = '1n'
): Promise<void> {
  if (direction === 'harmonic') {
    // Play both notes simultaneously
    this.currentInstrument.playChord([note1, note2], duration);
  } else {
    // Play sequentially
    const [first, second] = direction === 'ascending'
      ? [note1, note2]
      : [note2, note1];

    const now = Tone.now();
    const durationSeconds = Tone.Time(duration).toSeconds();

    this.currentInstrument.playNote(first, duration, now);
    this.currentInstrument.playNote(second, duration, now + durationSeconds);

    await new Promise(resolve => setTimeout(resolve, durationSeconds * 2 * 1000));
  }
}
```

#### Progression Playback

```typescript
async playProgression(
  chords: string[][],
  bpm = 100,
  noteDuration = '2n'
): Promise<void> {
  const oldBpm = Tone.Transport.bpm.value;
  Tone.Transport.bpm.value = bpm;  // Set tempo

  const now = Tone.now();
  const durationSeconds = Tone.Time(noteDuration).toSeconds();

  // Schedule all chords in advance
  chords.forEach((chord, index) => {
    this.currentInstrument.playChord(
      chord,
      noteDuration,
      now + (index * durationSeconds)
    );
  });

  // Wait for completion
  await new Promise(resolve =>
    setTimeout(resolve, chords.length * durationSeconds * 1000)
  );

  Tone.Transport.bpm.value = oldBpm;  // Restore original tempo
}
```

**Scheduling**: All chords are scheduled at once using Tone.js's precise timing system, ensuring perfect rhythm.

---

## Training Modes Logic

All training logic lives in `src/logic/` and consists of pure functions (no side effects, easily testable).

### Chord Training (`src/logic/chordTraining.ts`)

#### Question Generation

```typescript
export interface ChordQuestion {
  rootNote: string;
  chordType: keyof typeof CHORD_TYPES;
  chordNotes: string[];
}

export function generateChordQuestion(
  selectedChordTypes: string[]
): ChordQuestion {
  // 1. Pick random chord type from selected types
  const chordType = selectedChordTypes[randomIndex];

  // 2. Generate random root note in octave 3-4
  const rootNote = getRandomNote(3, 4);

  // 3. Build chord notes
  const chordNotes = getChordNotes(rootNote, chordType);

  return { rootNote, chordType, chordNotes };
}
```

**Octave Range**: Octaves 3-4 are chosen for optimal playback range (not too low, not too high).

#### Answer Validation

```typescript
export function validateAnswer(
  question: ChordQuestion,
  userAnswer: string
): boolean {
  return question.chordType === userAnswer;
}
```

Simple string comparison suffices since chord types are predefined.

### Interval Training (`src/logic/intervalTraining.ts`)

#### Question Generation with Constraints

```typescript
export function generateIntervalQuestion(
  selectedIntervals: string[],
  direction: 'random' | 'ascending' | 'descending',
  harmonicMode: boolean,
  compoundIntervals: boolean,
  octaveRange: { min: number; max: number }
): IntervalQuestion {
  // 1. Pick random interval
  const intervalName = selectedIntervals[randomIndex];
  const intervalSemitones = INTERVALS[intervalName];

  // 2. Determine actual direction
  let actualDirection: 'ascending' | 'descending' | 'harmonic';
  if (harmonicMode) {
    actualDirection = 'harmonic';
  } else if (direction === 'random') {
    actualDirection = Math.random() < 0.5 ? 'ascending' : 'descending';
  }

  // 3. Generate root note
  const rootNote = getRandomNote(octaveRange.min, octaveRange.max);
  const rootMidi = noteNameToMidi(rootNote);

  // 4. Calculate second note with bounds checking
  let note1: string, note2: string;
  if (actualDirection === 'ascending' || actualDirection === 'harmonic') {
    note1 = rootNote;
    const targetMidi = rootMidi + intervalSemitones;

    // Prevent notes beyond MIDI range (C0 to C8)
    if (targetMidi > 108) {
      note2 = midiToNoteName(targetMidi - 12);  // Transpose down
    } else {
      note2 = getInterval(rootNote, intervalName);
    }
  } else {
    // Similar logic for descending...
  }

  return { note1, note2, intervalName, direction: actualDirection };
}
```

**Smart Bounds Checking**: The algorithm ensures generated notes stay within the playable MIDI range (12-108) by transposing when necessary.

### Progression Training (`src/logic/progressionTraining.ts`)

#### Progression Generation

```typescript
export function generateProgressionQuestion(
  difficulty: 'easy' | 'hard',
  chordPool: { diatonic: boolean; nonDiatonic: boolean },
  key: string
): ProgressionQuestion {
  // 1. Determine length based on difficulty
  const minLength = difficulty === 'easy' ? 2 : 5;
  const maxLength = difficulty === 'easy' ? 4 : 8;
  const progressionLength = Math.floor(Math.random() * (maxLength - minLength + 1)) + minLength;

  // 2. Get key (or random if specified)
  const selectedKey = key === 'random' ? getRandomKey() : key;

  // 3. Build chord pool
  let availableChords: RomanNumeralChord[] = [];
  if (chordPool.diatonic && chordPool.nonDiatonic) {
    availableChords = getAllChords(selectedKey);
  } else if (chordPool.diatonic) {
    availableChords = getDiatonicChords(selectedKey);
  } else if (chordPool.nonDiatonic) {
    availableChords = getNonDiatonicChords(selectedKey);
  }

  // 4. Generate progression (try to end on tonic for resolution)
  const progression: RomanNumeralChord[] = [];
  for (let i = 0; i < progressionLength; i++) {
    const isLastChord = i === progressionLength - 1;

    if (isLastChord) {
      const tonic = availableChords.find(chord =>
        chord.numeral === 'I' || chord.numeral === 'i'
      );
      if (tonic) {
        progression.push(tonic);
        continue;
      }
    }

    // Pick random chord
    progression.push(availableChords[randomIndex]);
  }

  // 5. Convert to actual notes
  const chordNotes = progression.map(chord =>
    romanNumeralToChord(chord, selectedKey)
  );

  return {
    key: selectedKey,
    progression,
    chordNotes,
    bpm: getRandomBpm(),  // 80-120 BPM
  };
}
```

**Musical Trick**: Progressions try to end on the tonic (I or i) for a satisfying musical resolution.

#### Answer Validation

```typescript
export function validateProgressionAnswer(
  question: ProgressionQuestion,
  userAnswer: string[]
): boolean {
  if (userAnswer.length !== question.progression.length) {
    return false;
  }

  return userAnswer.every((answer, index) => {
    const correctNumeral = question.progression[index].numeral;
    return answer === correctNumeral;
  });
}
```

All chords must match in order for the answer to be correct.

---

## State Management & Data Flow

The app uses React Context API for global state management, organized into three contexts:

### App Context (`src/context/AppContext.tsx`)

Manages navigation and app-level state:

```typescript
interface AppContextType {
  currentScreen: Screen;           // 'menu' | 'config' | 'training' | 'stats' | 'dashboard'
  currentMode: Mode | null;        // 'chord' | 'interval' | 'progression'
  sessionConfig: ModeConfig | null; // Current session configuration
  devInsightsEnabled: boolean;     // Debug mode (toggled with 'z' key)

  goToMenu: () => void;
  goToConfig: (mode: Mode) => void;
  goToTraining: (config: ModeConfig) => void;
  goToStats: () => void;
  goToDashboard: () => void;
}
```

**Developer Insights**: Pressing 'z' toggles a debug mode that shows correct answers during training (for testing).

### Audio Context (`src/context/AudioContext.tsx`)

Manages the audio engine instance:

```typescript
interface AudioContextType {
  audioEngine: AudioEngine | null;
  currentInstrument: InstrumentType;  // 'piano' | 'guitar'
  isInitialized: boolean;

  initializeAudio: () => Promise<void>;
  setInstrument: (instrument: InstrumentType) => Promise<void>;
  toggleInstrument: () => Promise<void>;
}
```

**Lifecycle Management:**
```typescript
export const AudioProvider = ({ children }: AudioProviderProps) => {
  const audioEngineRef = useRef<AudioEngine | null>(null);

  useEffect(() => {
    // Create engine on mount
    audioEngineRef.current = new AudioEngine('piano');

    // Cleanup on unmount
    return () => {
      if (audioEngineRef.current) {
        audioEngineRef.current.dispose();
      }
    };
  }, []);

  // ... rest of implementation
};
```

**useRef for Audio Engine**: We use `useRef` instead of `useState` because the audio engine is a stateful object that we don't want to trigger re-renders when it changes internally.

### Stats Context (`src/context/StatsContext.tsx`)

Manages statistics and session tracking:

```typescript
interface StatsContextType {
  lifetimeStats: LifetimeStats;              // Legacy stats
  currentSessionStats: SessionStats | null;   // Current session
  detailedStats: DetailedLifetimeStats;      // Enhanced stats with breakdowns

  recordSession: (sessionStats: SessionStats, isGuestMode: boolean) => void;
  recordDetailedSession: (sessionStats: DetailedSessionStats, isGuestMode: boolean) => void;
  clearStats: () => void;
  clearDetailedStats: () => void;
}
```

**Guest Mode**: When enabled, sessions are displayed but not saved to localStorage.

```typescript
const recordSession = (sessionStats: SessionStats, isGuestMode: boolean) => {
  // Always show current session stats
  setCurrentSessionStats(sessionStats);

  // Only save to localStorage if NOT in guest mode
  if (!isGuestMode) {
    const updatedStats = updateStatsWithSession(lifetimeStats, sessionStats);
    setLifetimeStats(updatedStats);
    saveLifetimeStats(updatedStats);
  }
};
```

---

## Statistics & Analytics System

The app has a sophisticated dual-layer statistics system:

### Basic Stats (Legacy/Backward Compatible)

```typescript
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
```

### Enhanced Stats (Detailed Tracking)

```typescript
export interface DetailedLifetimeStats {
  version: number;  // For future migrations
  chord: DetailedChordStats;
  interval: DetailedIntervalStats;
  progression: DetailedProgressionStats;
  sessionHistory: {
    [sessionId: string]: DetailedSessionStats;
  };
}
```

#### Per-Answer Recording

Every answer is tracked with full context:

```typescript
export interface ChordAnswerRecord {
  questionIndex: number;
  timestamp: number;
  isCorrect: boolean;
  correctAnswer: string;
  userAnswer: string;
  rootNote: string;
  chordType: string;
}
```

#### Category Breakdowns

**Chord Type Breakdown:**
```typescript
export interface ChordTypeBreakdown {
  [chordType: string]: CategoryBreakdown;
}

export interface CategoryBreakdown {
  correct: number;   // Number of correct answers
  total: number;     // Total attempts
  accuracy: number;  // Percentage (calculated)
}
```

This allows tracking like:
- "Major chords: 45/50 (90%)"
- "Minor 7th chords: 12/20 (60%)"

**Interval Direction Breakdown:**
```typescript
export interface DirectionBreakdown {
  ascending: CategoryBreakdown;
  descending: CategoryBreakdown;
  harmonic: CategoryBreakdown;
}
```

Tracks accuracy separately for each interval direction.

### Analytics Functions (`src/utils/analytics.ts`)

#### Breakdown Updates

```typescript
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
```

**Immutability**: All updates return new objects (functional programming style).

#### Mode-Specific Stats Updates

```typescript
export function updateChordStats(
  currentStats: DetailedChordStats,
  session: DetailedSessionStats
): DetailedChordStats {
  // 1. Update overall totals
  const updated: DetailedChordStats = {
    ...currentStats,
    totalSessions: currentStats.totalSessions + 1,
    totalQuestions: currentStats.totalQuestions + session.totalQuestions,
    totalCorrect: currentStats.totalCorrect + session.correctAnswers,
    lastPlayed: session.timestamp,
    chordTypeBreakdown: { ...currentStats.chordTypeBreakdown },
  };

  // 2. Calculate overall accuracy
  updated.overallAccuracy = updated.totalQuestions > 0
    ? Math.round((updated.totalCorrect / updated.totalQuestions) * 100)
    : 0;

  // 3. Update per-chord-type breakdowns
  session.answers.forEach(answer => {
    const chordAnswer = answer as ChordAnswerRecord;
    const breakdown = getOrCreateBreakdown(
      updated.chordTypeBreakdown,
      chordAnswer.chordType
    );
    updated.chordTypeBreakdown[chordAnswer.chordType] = updateCategoryBreakdown(
      breakdown,
      chordAnswer.isCorrect
    );
  });

  return updated;
}
```

#### Advanced Queries

**Get Best/Worst Performers:**
```typescript
export function getBestChordTypes(
  chordTypeBreakdown: ChordTypeBreakdown,
  limit: number = 5
): Array<{ chordType: string; breakdown: CategoryBreakdown }> {
  return Object.entries(chordTypeBreakdown)
    .map(([chordType, breakdown]) => ({ chordType, breakdown }))
    .filter(item => item.breakdown.total >= 3)  // Minimum sample size
    .sort((a, b) => b.breakdown.accuracy - a.breakdown.accuracy)
    .slice(0, limit);
}
```

**Minimum Sample Size**: Requires at least 3 attempts to show in best/worst to avoid statistical noise.

**Time Tracking:**
```typescript
export function getTotalTrainingTime(stats: DetailedLifetimeStats): {
  totalMilliseconds: number;
  totalSeconds: number;
  totalMinutes: number;
  totalHours: number;
  formatted: string;
} {
  const totalMilliseconds = Object.values(stats.sessionHistory).reduce(
    (sum, session) => sum + (session.duration || 0),
    0
  );

  // Convert to various units
  const totalSeconds = Math.floor(totalMilliseconds / 1000);
  const totalMinutes = Math.floor(totalSeconds / 60);
  const totalHours = Math.floor(totalMinutes / 60);

  const hours = totalHours;
  const minutes = totalMinutes % 60;

  return {
    totalMilliseconds,
    totalSeconds,
    totalMinutes,
    totalHours,
    formatted: hours > 0 ? `${hours}h ${minutes}m` : `${minutes}m`,
  };
}
```

Sessions track start and end timestamps, allowing accurate duration calculation.

### Storage Management (`src/utils/storage.ts`)

#### localStorage Operations

```typescript
const STORAGE_KEY = 'eargym_lifetime_stats';
const DETAILED_STORAGE_KEY = 'eargym_detailed_stats';
const MAX_SESSIONS_IN_HISTORY = 200;

export function saveDetailedLifetimeStats(stats: DetailedLifetimeStats): void {
  try {
    // 1. Prune old sessions if too many
    const sessionIds = Object.keys(stats.sessionHistory);
    if (sessionIds.length > MAX_SESSIONS_IN_HISTORY) {
      const sortedSessions = sessionIds
        .map(id => stats.sessionHistory[id])
        .sort((a, b) => b.timestamp - a.timestamp)
        .slice(0, MAX_SESSIONS_IN_HISTORY);

      // Rebuild history with only recent sessions
      const newHistory: { [sessionId: string]: DetailedSessionStats } = {};
      sortedSessions.forEach(session => {
        newHistory[session.sessionId] = session;
      });

      stats = { ...stats, sessionHistory: newHistory };
    }

    localStorage.setItem(DETAILED_STORAGE_KEY, JSON.stringify(stats));
  } catch (error) {
    // Handle quota exceeded
    if (error instanceof Error && error.name === 'QuotaExceededError') {
      // Reduce to 50 sessions and try again
      // ... (see source for full implementation)
    }
  }
}
```

**Automatic Pruning**: Keeps only the 200 most recent sessions to prevent localStorage quota issues.

**Quota Exceeded Handling**: If storage is full, automatically reduces to 50 sessions and retries.

#### Migration System

```typescript
export function loadDetailedLifetimeStats(): DetailedLifetimeStats {
  // 1. Try to load detailed stats
  const stored = localStorage.getItem(DETAILED_STORAGE_KEY);
  if (stored) {
    return JSON.parse(stored);
  }

  // 2. If not found, check for legacy stats to migrate
  const oldStats = localStorage.getItem(STORAGE_KEY);
  if (oldStats) {
    const parsedOldStats = JSON.parse(oldStats);
    const migrated = migrateToDetailedStats(parsedOldStats);
    saveDetailedLifetimeStats(migrated);
    return migrated;
  }

  // 3. Return fresh stats
  return { ...DEFAULT_DETAILED_LIFETIME_STATS };
}
```

**Backward Compatibility**: Old stats are automatically migrated to the new format on first load.

---

## Component Architecture

### Screen Components (`src/components/screens/`)

#### MenuScreen
- Entry point showing all training modes
- Displays mode cards with descriptions
- Button to access lifetime statistics dashboard

#### ConfigScreen
- Mode-specific configuration UI
- Uses type guards to render correct config component:
```typescript
{currentMode === 'chord' && <ChordConfig />}
{currentMode === 'interval' && <IntervalConfig />}
{currentMode === 'progression' && <ProgressionConfig />}
```

#### TrainingScreen
- Main training interface
- Similarly uses type guards for mode-specific question components
- Manages question state, timer, and answer submission

#### StatsScreen
- Post-session results display
- Shows both session and lifetime statistics
- Option to replay or return to menu

#### DashboardScreen
- Comprehensive lifetime statistics view
- Mode-specific breakdowns
- Performance insights (best/worst chord types, intervals, etc.)

### Mode Components (`src/components/modes/`)

Each mode has three components:

1. **Config Component** (e.g., `ChordConfig.tsx`)
   - Mode-specific settings
   - Validation before starting session

2. **Question Component** (e.g., `ChordQuestion.tsx`)
   - Answer input UI
   - Feedback display

3. **Training Component** (e.g., `ChordTraining.tsx`)
   - Session orchestration
   - Question generation
   - Progress tracking
   - Statistics collection

#### Example: ChordTraining Component

```typescript
export function ChordTraining({ config }: ChordTrainingProps) {
  const [currentQuestion, setCurrentQuestion] = useState<ChordQuestion | null>(null);
  const [questionNumber, setQuestionNumber] = useState(1);
  const [correctAnswers, setCorrectAnswers] = useState(0);
  const [sessionStartTime] = useState(Date.now());
  const [answerRecords, setAnswerRecords] = useState<ChordAnswerRecord[]>([]);

  // Generate new question
  useEffect(() => {
    const question = generateChordQuestion(config.selectedChordTypes);
    setCurrentQuestion(question);
  }, [questionNumber]);

  // Play audio when question changes
  useEffect(() => {
    if (currentQuestion && audioEngine) {
      audioEngine.playChord(currentQuestion.chordNotes);
    }
  }, [currentQuestion]);

  const handleAnswer = (userAnswer: string) => {
    const isCorrect = validateAnswer(currentQuestion, userAnswer);

    // Record answer
    const record: ChordAnswerRecord = {
      questionIndex: questionNumber - 1,
      timestamp: Date.now(),
      isCorrect,
      correctAnswer: currentQuestion.chordType,
      userAnswer,
      rootNote: currentQuestion.rootNote,
      chordType: currentQuestion.chordType,
    };
    setAnswerRecords([...answerRecords, record]);

    if (isCorrect) {
      setCorrectAnswers(correctAnswers + 1);
    }

    // Next question or end session
    if (questionNumber < config.numQuestions) {
      setQuestionNumber(questionNumber + 1);
    } else {
      endSession();
    }
  };

  const endSession = () => {
    const sessionStats: DetailedSessionStats = {
      sessionId: generateSessionId(),
      mode: 'chord',
      correctAnswers,
      totalQuestions: config.numQuestions,
      accuracy: calculateAccuracy(correctAnswers, config.numQuestions),
      timestamp: Date.now(),
      answers: answerRecords,
      config,
      sessionStartTime,
      sessionEndTime: Date.now(),
      duration: Date.now() - sessionStartTime,
    };

    recordDetailedSession(sessionStats, config.guestMode);
    goToStats();
  };

  return (
    <div>
      <QuestionCounter current={questionNumber} total={config.numQuestions} />
      <ChordQuestion
        question={currentQuestion}
        onAnswer={handleAnswer}
        availableChordTypes={config.selectedChordTypes}
      />
    </div>
  );
}
```

**Key Patterns:**
1. **useEffect for Question Generation**: New question on question number change
2. **useEffect for Audio**: Auto-play when question changes
3. **Detailed Recording**: Every answer is tracked with full context
4. **Session Stats**: Comprehensive stats object created at end

### Common Components (`src/components/common/`)

#### Button Component
```typescript
interface ButtonProps {
  onClick: () => void;
  children: React.ReactNode;
  variant?: 'primary' | 'secondary' | 'danger';
  disabled?: boolean;
  fullWidth?: boolean;
}
```

Reusable button with variant styling.

#### Card Component
```typescript
interface CardProps {
  title?: string;
  children: React.ReactNode;
  onClick?: () => void;
  className?: string;
}
```

Container with consistent styling for content sections.

---

## Clever Tricks & Optimizations

### 1. Guitar Strumming Effect

Instead of playing all notes simultaneously (like piano), guitar uses staggered timing:

```typescript
playChord(notes: string[], duration = '1n', startTime?: number): void {
  const strumDelay = 0.02; // 20ms between notes
  notes.forEach((note, index) => {
    const time = startTime !== undefined
      ? startTime + (index * strumDelay)
      : `+${index * strumDelay}`;
    this.synth.triggerAttackRelease(note, duration, time);
  });
}
```

This creates a realistic strumming sound without any additional complexity.

### 2. Enharmonic Note Conversion

The app handles flats by converting them to sharps:

```typescript
const enharmonicMap: Record<string, string> = {
  'Db': 'C#',
  'Eb': 'D#',
  'Gb': 'F#',
  'Ab': 'G#',
  'Bb': 'A#',
};
```

This simplifies all logic by using a single representation (sharps only).

### 3. Musical Resolution Hint

Progressions try to end on the tonic (I or i) for a satisfying conclusion:

```typescript
if (isLastChord) {
  const tonic = availableChords.find(chord =>
    chord.numeral === 'I' || chord.numeral === 'i'
  );
  if (tonic) {
    progression.push(tonic);
    continue;
  }
}
```

This makes progressions sound more "complete" musically.

### 4. MIDI Bounds Checking

When generating intervals, the app ensures notes stay within playable range:

```typescript
const targetMidi = rootMidi + intervalSemitones;

if (targetMidi > 108) {  // C8
  note2 = midiToNoteName(targetMidi - 12);  // Transpose down an octave
} else if (targetMidi < 12) {  // C0
  note1 = midiToNoteName(targetMidi + 12);  // Transpose up an octave
}
```

This prevents unplayable or inaudible notes.

### 5. Graceful Audio Cleanup

To avoid audio clicks when switching instruments:

```typescript
async dispose(): Promise<void> {
  this.synth.releaseAll();           // Release notes
  this.synth.volume.rampTo(-60, 0.1); // Fade out
  await new Promise(resolve => setTimeout(resolve, 1300)); // Wait
  this.synth.dispose();              // Clean up
}
```

The volume ramp and delay prevent abrupt cutoffs.

### 6. Advanced Scheduling

Progressions schedule all chords in advance for perfect timing:

```typescript
chords.forEach((chord, index) => {
  this.currentInstrument.playChord(
    chord,
    noteDuration,
    now + (index * durationSeconds)  // Schedule in advance
  );
});
```

Tone.js's internal clock ensures sample-accurate timing.

### 7. localStorage Quota Management

Automatic pruning when approaching storage limits:

```typescript
if (sessionIds.length > MAX_SESSIONS_IN_HISTORY) {
  const sortedSessions = sessionIds
    .map(id => stats.sessionHistory[id])
    .sort((a, b) => b.timestamp - a.timestamp)  // Sort by recency
    .slice(0, MAX_SESSIONS_IN_HISTORY);         // Keep newest
}
```

Prevents storage errors while maintaining most relevant data.

### 8. Developer Insights Mode

Press 'z' to toggle debug mode during training:

```typescript
useEffect(() => {
  const handleKeyPress = (event: KeyboardEvent) => {
    if (event.key === 'z' || event.key === 'Z') {
      // Don't toggle if typing in input field
      const target = event.target as HTMLElement;
      if (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA') {
        return;
      }
      setDevInsightsEnabled((prev) => !prev);
    }
  };
  window.addEventListener('keydown', handleKeyPress);
  return () => window.removeEventListener('keydown', handleKeyPress);
}, []);
```

Shows correct answers for testing without affecting normal gameplay.

### 9. TypeScript const Assertions

Used throughout for type safety:

```typescript
export const CHORD_TYPES = {
  'Major': [0, 4, 7],
  'Minor': [0, 3, 7],
  // ...
} as const;

// This creates a readonly type with literal string keys
type ChordType = keyof typeof CHORD_TYPES;  // 'Major' | 'Minor' | ...
```

Ensures type safety while maintaining flexibility.

### 10. Pure Function Architecture

All business logic is pure functions (no side effects):

```typescript
// ✅ Pure function - easy to test
export function generateChordQuestion(
  selectedChordTypes: string[]
): ChordQuestion {
  // Deterministic output based on input (with controlled randomness)
}

// ✅ Pure function - easy to test
export function validateAnswer(
  question: ChordQuestion,
  userAnswer: string
): boolean {
  return question.chordType === userAnswer;
}
```

This makes the codebase highly testable and maintainable.

---

## User Experience Flow

### Complete User Journey

1. **Landing (MenuScreen)**
   - User sees three training modes
   - Can access lifetime stats via "Stats" button
   - Clicks a mode to configure

2. **Configuration (ConfigScreen)**
   - Mode-specific options displayed
   - User selects difficulty, question count, etc.
   - "Start Training" button (disabled until valid config)

3. **First Interaction (Audio Initialization)**
   - First audio playback requires user interaction (browser policy)
   - `await Tone.start()` called on first play button
   - Audio context initialized for the session

4. **Training Session (TrainingScreen)**
   - Question counter shows progress (e.g., "5/20")
   - Audio plays automatically on each question
   - User can:
     - Replay audio
     - Toggle instrument (piano/guitar)
     - Submit answer
     - Give up (shows answer, doesn't count against stats)

5. **Answer Feedback**
   - Immediate visual feedback (green/red)
   - Correct answer shown if wrong
   - Auto-advance to next question (or end if last)

6. **Results (StatsScreen)**
   - Session summary (score, accuracy)
   - Lifetime stats for that mode
   - Options:
     - Play Again (returns to config)
     - Back to Menu
     - View Dashboard (comprehensive stats)

7. **Dashboard (DashboardScreen)**
   - Overall summary across all modes
   - Mode-specific breakdowns
   - Best/worst performers
   - Total training time
   - Session history

### State Transitions

```
MenuScreen
  ↓ (select mode)
ConfigScreen
  ↓ (start training)
TrainingScreen
  ↓ (complete session)
StatsScreen
  ↓ (view dashboard)
DashboardScreen
  ↓ (back to menu)
MenuScreen
```

### Data Flow During Session

1. **Question Generation**
   ```
   Config → generateChordQuestion() → ChordQuestion
   ```

2. **Audio Playback**
   ```
   ChordQuestion.chordNotes → AudioEngine.playChord() → Tone.js → Web Audio API
   ```

3. **Answer Submission**
   ```
   UserInput → validateAnswer() → Update Score → Record Answer
   ```

4. **Session End**
   ```
   All Answers → Create DetailedSessionStats → Update LifetimeStats → Save to localStorage
   ```

---

## Summary

Syncopate is a well-architected ear training application that demonstrates:

1. **Clean Separation of Concerns**: Audio, logic, UI, and state are clearly separated
2. **Type Safety**: Full TypeScript coverage with comprehensive type definitions
3. **Pure Functions**: Testable business logic with no side effects
4. **Advanced Audio**: Sophisticated use of Tone.js for realistic instrument sounds
5. **Detailed Analytics**: Comprehensive statistics with breakdowns and trends
6. **Graceful Degradation**: Quota management, migration support, and error handling
7. **Musical Authenticity**: Thoughtful implementations like guitar strumming and progression resolution
8. **Developer Experience**: Debug mode, extensive comments, and logical file organization

The project successfully combines music theory, web audio, and React to create an effective learning tool that runs entirely in the browser with no backend dependencies.
