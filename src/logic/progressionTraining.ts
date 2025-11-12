import {
  RomanNumeralChord,
  romanNumeralToChord,
  getDiatonicChords,
  getNonDiatonicChords,
  getAllChords,
  getRandomKey,
} from '../audio/progressions';

export interface ProgressionQuestion {
  key: string;
  progression: RomanNumeralChord[];
  chordNotes: string[][];
  bpm: number;
}

/**
 * Generate a random BPM within a reasonable range
 */
function getRandomBpm(): number {
  return Math.floor(Math.random() * (120 - 80 + 1)) + 80;
}

/**
 * Generate a random progression based on configuration
 */
export function generateProgressionQuestion(
  difficulty: 'easy' | 'hard',
  chordPool: { diatonic: boolean; nonDiatonic: boolean },
  key: string
): ProgressionQuestion {
  // Determine progression length based on difficulty
  const minLength = difficulty === 'easy' ? 2 : 5;
  const maxLength = difficulty === 'easy' ? 4 : 8;
  const progressionLength = Math.floor(Math.random() * (maxLength - minLength + 1)) + minLength;

  // Determine random key if needed
  const selectedKey = key === 'random' ? getRandomKey() : key;

  // Get available chords based on chord pool selection
  let availableChords: RomanNumeralChord[] = [];

  if (chordPool.diatonic && chordPool.nonDiatonic) {
    availableChords = getAllChords(selectedKey);
  } else if (chordPool.diatonic) {
    availableChords = getDiatonicChords(selectedKey);
  } else if (chordPool.nonDiatonic) {
    availableChords = getNonDiatonicChords(selectedKey);
  }

  if (availableChords.length === 0) {
    throw new Error('No chords available with current settings');
  }

  // Generate progression
  const progression: RomanNumeralChord[] = [];

  // Try to make progression end on tonic (I or i) for musical resolution
  for (let i = 0; i < progressionLength; i++) {
    const isLastChord = i === progressionLength - 1;

    if (isLastChord) {
      // Try to end on tonic if available
      const tonic = availableChords.find(chord =>
        chord.numeral === 'I' || chord.numeral === 'i'
      );
      if (tonic) {
        progression.push(tonic);
        continue;
      }
    }

    // Pick random chord
    const randomIndex = Math.floor(Math.random() * availableChords.length);
    progression.push(availableChords[randomIndex]);
  }

  // Convert progression to actual chord notes
  const chordNotes = progression.map(chord =>
    romanNumeralToChord(chord, selectedKey)
  );

  return {
    key: selectedKey,
    progression,
    chordNotes,
    bpm: getRandomBpm(),
  };
}

/**
 * Validate user's answer against the correct progression
 */
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

/**
 * Get the correct answer as an array of Roman numerals
 */
export function getCorrectAnswer(question: ProgressionQuestion): string[] {
  return question.progression.map(chord => chord.numeral);
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
