import { CHORD_TYPES, getRandomNote, getChordNotes } from '../audio/theory';

export interface ChordQuestion {
  rootNote: string;
  chordType: keyof typeof CHORD_TYPES;
  chordNotes: string[];
}

/**
 * Generate a random chord question from the selected chord types
 */
export function generateChordQuestion(
  selectedChordTypes: string[]
): ChordQuestion {
  if (selectedChordTypes.length === 0) {
    throw new Error('At least one chord type must be selected');
  }

  // Pick a random chord type from the selected ones
  const randomIndex = Math.floor(Math.random() * selectedChordTypes.length);
  const chordType = selectedChordTypes[randomIndex] as keyof typeof CHORD_TYPES;

  // Generate a random root note (octave 3-5 for good playback range)
  const rootNote = getRandomNote(3, 5);

  // Get the chord notes
  const chordNotes = getChordNotes(rootNote, chordType);

  return {
    rootNote,
    chordType,
    chordNotes,
  };
}

/**
 * Check if the user's answer is correct
 */
export function validateAnswer(
  question: ChordQuestion,
  userAnswer: string
): boolean {
  return question.chordType === userAnswer;
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
