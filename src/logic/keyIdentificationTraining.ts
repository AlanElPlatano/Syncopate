import {
  RomanNumeralChord,
  romanNumeralToChord,
  getDiatonicChords,
  getNonDiatonicChords,
  getAllChords,
  getRandomKeyByMode,
  parseKey,
} from '../audio/progressions';
import { KeyMode } from '../types/screens';

export interface KeyIdentificationQuestion {
  key: string;
  progression: RomanNumeralChord[];
  chordNotes: string[][];
  bpm: number;
}

function getRandomBpm(): number {
  return Math.floor(Math.random() * (120 - 80 + 1)) + 80;
}

export function generateKeyIdentificationQuestion(
  difficulty: 'easy' | 'hard',
  chordPool: { diatonic: boolean; nonDiatonic: boolean },
  keyMode: KeyMode
): KeyIdentificationQuestion {
  const minLength = difficulty === 'easy' ? 2 : 5;
  const maxLength = difficulty === 'easy' ? 4 : 8;
  const progressionLength = Math.floor(Math.random() * (maxLength - minLength + 1)) + minLength;

  const selectedKey = getRandomKeyByMode(keyMode);

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

    const previousChord = progression[progression.length - 1];
    const candidates = previousChord
      ? availableChords.filter(chord => chord.numeral !== previousChord.numeral)
      : availableChords;
    const pool = candidates.length > 0 ? candidates : availableChords;

    const randomIndex = Math.floor(Math.random() * pool.length);
    progression.push(pool[randomIndex]);
  }

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

export function validateKeyAnswer(
  question: KeyIdentificationQuestion,
  userAnswer: string
): boolean {
  const correct = parseKey(question.key);
  const user = parseKey(userAnswer);
  return correct.root === user.root && correct.mode === user.mode;
}

export function formatKeyDisplay(key: string): string {
  const { root, mode } = parseKey(key);
  return `${root} ${mode === 'major' ? 'Major' : 'Minor'}`;
}

export function calculateAccuracy(
  correctAnswers: number,
  totalQuestions: number
): number {
  if (totalQuestions === 0) return 0;
  return Math.round((correctAnswers / totalQuestions) * 100);
}
