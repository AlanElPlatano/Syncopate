// Roman numeral and chord progression utilities

import { transposeNote } from './theory';

export type RomanNumeral =
  | 'I' | 'ii' | 'iii' | 'IV' | 'V' | 'vi' | 'vii°'  // Major key diatonic
  | 'i' | 'ii°' | 'III' | 'iv' | 'v' | 'VI' | 'VII'  // Minor key diatonic
  | 'V7' | 'V7/V' | 'bVII' | 'II7' | 'IV7';           // Non-diatonic/extended

export interface RomanNumeralChord {
  numeral: RomanNumeral;
  intervals: number[];  // Semitones from root
  label: string;         // Display label
}

// Diatonic chords for major keys
export const MAJOR_DIATONIC_CHORDS: RomanNumeralChord[] = [
  { numeral: 'I', intervals: [0, 4, 7], label: 'I' },
  { numeral: 'ii', intervals: [0, 3, 7], label: 'ii' },
  { numeral: 'iii', intervals: [0, 3, 7], label: 'iii' },
  { numeral: 'IV', intervals: [0, 4, 7], label: 'IV' },
  { numeral: 'V', intervals: [0, 4, 7], label: 'V' },
  { numeral: 'vi', intervals: [0, 3, 7], label: 'vi' },
  { numeral: 'vii°', intervals: [0, 3, 6], label: 'vii°' },
];

// Diatonic chords for minor keys
export const MINOR_DIATONIC_CHORDS: RomanNumeralChord[] = [
  { numeral: 'i', intervals: [0, 3, 7], label: 'i' },
  { numeral: 'ii°', intervals: [0, 3, 6], label: 'ii°' },
  { numeral: 'III', intervals: [0, 4, 7], label: 'III' },
  { numeral: 'iv', intervals: [0, 3, 7], label: 'iv' },
  { numeral: 'v', intervals: [0, 3, 7], label: 'v' },
  { numeral: 'VI', intervals: [0, 4, 7], label: 'VI' },
  { numeral: 'VII', intervals: [0, 4, 7], label: 'VII' },
];

// Non-diatonic chords (common borrowed chords and secondary dominants)
export const MAJOR_NON_DIATONIC_CHORDS: RomanNumeralChord[] = [
  { numeral: 'V7', intervals: [0, 4, 7, 10], label: 'V7' },
  { numeral: 'V7/V', intervals: [0, 4, 7, 10], label: 'V7/V' },  // Secondary dominant
  { numeral: 'bVII', intervals: [0, 4, 7], label: 'bVII' },      // Borrowed from minor
  { numeral: 'iv', intervals: [0, 3, 7], label: 'iv' },           // Borrowed from minor
];

export const MINOR_NON_DIATONIC_CHORDS: RomanNumeralChord[] = [
  { numeral: 'V', intervals: [0, 4, 7], label: 'V' },            // Raised leading tone
  { numeral: 'V7', intervals: [0, 4, 7, 10], label: 'V7' },
  { numeral: 'IV', intervals: [0, 4, 7], label: 'IV' },          // Borrowed from major
  { numeral: 'II7', intervals: [0, 4, 7, 10], label: 'II7' },    // Secondary dominant
];

// Major scale intervals (semitones from tonic)
const MAJOR_SCALE_DEGREES = [0, 2, 4, 5, 7, 9, 11];

// Minor scale intervals (natural minor)
const MINOR_SCALE_DEGREES = [0, 2, 3, 5, 7, 8, 10];

/**
 * Parse a key string into root note and mode
 * Examples: "C", "Cm", "F#", "Bbm"
 */
export function parseKey(key: string): { root: string; mode: 'major' | 'minor' } {
  const isMinor = key.endsWith('m');
  const root = isMinor ? key.slice(0, -1) : key;
  return { root, mode: isMinor ? 'minor' : 'major' };
}

/**
 * Get the root note for a scale degree in a given key
 */
function getScaleDegreeRoot(keyRoot: string, degree: number, mode: 'major' | 'minor'): string {
  const scaleDegrees = mode === 'major' ? MAJOR_SCALE_DEGREES : MINOR_SCALE_DEGREES;
  const semitones = scaleDegrees[degree - 1];
  return transposeNote(`${keyRoot}4`, semitones);
}

/**
 * Get special root notes for non-diatonic chords
 */
function getNonDiatonicRoot(keyRoot: string, numeral: RomanNumeral, mode: 'major' | 'minor'): string {
  const baseOctave = 4;

  switch (numeral) {
    case 'V7/V':
      // V7 of V means we go to the 5th degree, then build a V7 there
      // In C major: V is G, so V7/V is D7
      return transposeNote(`${keyRoot}${baseOctave}`, mode === 'major' ? 2 : 2);

    case 'bVII':
      // Flat VII - one whole step below the tonic
      return transposeNote(`${keyRoot}${baseOctave}`, 10);

    case 'II7':
      // Major II7 chord (secondary dominant)
      return transposeNote(`${keyRoot}${baseOctave}`, 2);

    case 'V7':
      // Dominant 7th on the 5th degree
      return getScaleDegreeRoot(keyRoot, 5, mode);

    case 'iv':
      // Minor iv in major (borrowed)
      return getScaleDegreeRoot(keyRoot, 4, mode);

    case 'V':
      // Major V in minor (raised leading tone)
      return getScaleDegreeRoot(keyRoot, 5, mode);

    case 'IV':
      // Major IV in minor (borrowed)
      return getScaleDegreeRoot(keyRoot, 4, mode);

    default:
      return `${keyRoot}${baseOctave}`;
  }
}

/**
 * Convert a Roman numeral to actual chord notes in a specific key
 */
export function romanNumeralToChord(
  romanNumeral: RomanNumeralChord,
  key: string
): string[] {
  const { root: keyRoot, mode } = parseKey(key);

  // Determine the scale degree from the Roman numeral
  const numeralMap: Record<string, number> = {
    'I': 1, 'i': 1,
    'II': 2, 'ii': 2, 'ii°': 2,
    'III': 3, 'iii': 3,
    'IV': 4, 'iv': 4,
    'V': 5, 'v': 5,
    'VI': 6, 'vi': 6,
    'VII': 7, 'vii': 7, 'vii°': 7,
  };

  // Get base numeral without accidentals or quality markers
  const baseNumeral = romanNumeral.numeral.replace(/[°7b]/g, '');

  let rootNote: string;

  // Handle special non-diatonic chords
  if (['V7/V', 'bVII', 'II7'].includes(romanNumeral.numeral)) {
    rootNote = getNonDiatonicRoot(keyRoot, romanNumeral.numeral, mode);
  } else {
    const degree = numeralMap[baseNumeral];
    rootNote = getScaleDegreeRoot(keyRoot, degree, mode);
  }

  // Build chord from intervals
  return romanNumeral.intervals.map(interval => transposeNote(rootNote, interval));
}

/**
 * Get all available diatonic chords for a key
 */
export function getDiatonicChords(key: string): RomanNumeralChord[] {
  const { mode } = parseKey(key);
  return mode === 'major' ? MAJOR_DIATONIC_CHORDS : MINOR_DIATONIC_CHORDS;
}

/**
 * Get all available non-diatonic chords for a key
 */
export function getNonDiatonicChords(key: string): RomanNumeralChord[] {
  const { mode } = parseKey(key);
  return mode === 'major' ? MAJOR_NON_DIATONIC_CHORDS : MINOR_NON_DIATONIC_CHORDS;
}

/**
 * Get all available chords (both diatonic and non-diatonic) for a key
 */
export function getAllChords(key: string): RomanNumeralChord[] {
  return [...getDiatonicChords(key), ...getNonDiatonicChords(key)];
}

/**
 * Get random key (with optional major/minor preference)
 */
export function getRandomKey(includeMinor = true): string {
  const majorKeys = ['C', 'D', 'E', 'F', 'G', 'A', 'B'];
  const minorKeys = ['Cm', 'Dm', 'Em', 'Fm', 'Gm', 'Am', 'Bm'];

  const allKeys = includeMinor ? [...majorKeys, ...minorKeys] : majorKeys;
  return allKeys[Math.floor(Math.random() * allKeys.length)];
}

/**
 * Get available keys list for UI
 */
export function getAvailableKeys(): string[] {
  return [
    'C', 'D', 'E', 'F', 'G', 'A', 'B',
    'Cm', 'Dm', 'Em', 'Fm', 'Gm', 'Am', 'Bm',
  ];
}
