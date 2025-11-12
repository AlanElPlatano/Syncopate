import { INTERVALS, getRandomNote, getInterval, noteNameToMidi, midiToNoteName } from '../audio/theory';

export interface IntervalQuestion {
  note1: string;
  note2: string;
  intervalName: keyof typeof INTERVALS;
  direction: 'ascending' | 'descending' | 'harmonic';
}

/**
 * Generate a random interval question from the selected intervals
 */
export function generateIntervalQuestion(
  selectedIntervals: string[],
  direction: 'random' | 'ascending' | 'descending',
  harmonicMode: boolean,
  compoundIntervals: boolean,
  octaveRange: { min: number; max: number }
): IntervalQuestion {
  if (selectedIntervals.length === 0) {
    throw new Error('At least one interval must be selected');
  }

  // Pick a random interval from the selected ones
  const randomIndex = Math.floor(Math.random() * selectedIntervals.length);
  const intervalName = selectedIntervals[randomIndex] as keyof typeof INTERVALS;

  // Generate a random root note within the octave range
  // We need to ensure the second note doesn't go out of range
  const intervalSemitones = INTERVALS[intervalName];

  // Calculate safe octave range for the root note
  // If ascending, we need room above; if descending, we need room below
  let safeMinOctave = octaveRange.min;
  let safeMaxOctave = octaveRange.max;

  if (!compoundIntervals && intervalSemitones > 12) {
    // If compound intervals are not allowed but interval is > octave, skip this
    throw new Error('Compound interval selected but compound intervals are disabled');
  }

  // Determine actual direction to play
  let actualDirection: 'ascending' | 'descending' | 'harmonic';

  if (harmonicMode) {
    actualDirection = 'harmonic';
  } else if (direction === 'random') {
    actualDirection = Math.random() < 0.5 ? 'ascending' : 'descending';
  } else {
    actualDirection = direction;
  }

  // Generate root note - we'll ensure it stays in range
  const rootNote = getRandomNote(safeMinOctave, safeMaxOctave);
  const rootMidi = noteNameToMidi(rootNote);

  // Calculate the second note based on direction
  let note1: string;
  let note2: string;

  if (actualDirection === 'ascending' || actualDirection === 'harmonic') {
    note1 = rootNote;
    const targetMidi = rootMidi + intervalSemitones;

    // Check if target note is within reasonable MIDI range (C0 to C8)
    if (targetMidi > 108) {
      // If too high, transpose down an octave
      note2 = midiToNoteName(targetMidi - 12);
    } else {
      note2 = getInterval(rootNote, intervalName);
    }
  } else {
    // Descending
    note2 = rootNote;
    const targetMidi = rootMidi - intervalSemitones;

    // Check if target note is within reasonable MIDI range
    if (targetMidi < 12) {
      // If too low, transpose up an octave
      note1 = midiToNoteName(targetMidi + 12);
    } else {
      note1 = midiToNoteName(targetMidi);
    }
  }

  return {
    note1,
    note2,
    intervalName,
    direction: actualDirection,
  };
}

/**
 * Check if the user's answer is correct
 */
export function validateAnswer(
  question: IntervalQuestion,
  userAnswer: string
): boolean {
  return question.intervalName === userAnswer;
}

/**
 * Calculate accuracy percentage
 */
export function calculateAccuracy(
  correctAnswers: number,
  totalQuestions: number
): number {
  if (totalQuestions === 0) return 0;
  return Math.round((correctAnswers / totalQuestions) * 100);
}
