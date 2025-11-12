// Music theory utilities for note names, intervals, and chords

export const NOTE_NAMES = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'];

export interface Note {
  name: string;
  octave: number;
  midi: number;
}

export const INTERVALS = {
  'Minor 2nd': 1,
  'Major 2nd': 2,
  'Minor 3rd': 3,
  'Major 3rd': 4,
  'Perfect 4th': 5,
  'Tritone': 6,
  'Perfect 5th': 7,
  'Minor 6th': 8,
  'Major 6th': 9,
  'Minor 7th': 10,
  'Major 7th': 11,
  'Octave': 12,
} as const;

export const CHORD_TYPES = {
  'Major': [0, 4, 7],
  'Minor': [0, 3, 7],
  'Dominant 7th': [0, 4, 7, 10],
  'Major 7th': [0, 4, 7, 11],
  'Minor 7th': [0, 3, 7, 10],
  'Diminished': [0, 3, 6],
  'Augmented': [0, 4, 8],
} as const;

export function midiToNoteName(midi: number): string {
  const octave = Math.floor(midi / 12) - 1;
  const noteIndex = midi % 12;
  return `${NOTE_NAMES[noteIndex]}${octave}`;
}

export function noteNameToMidi(noteName: string): number {
  const match = noteName.match(/^([A-G]#?)(-?\d+)$/);
  if (!match) throw new Error(`Invalid note name: ${noteName}`);

  const [, note, octaveStr] = match;
  const octave = parseInt(octaveStr);
  const noteIndex = NOTE_NAMES.indexOf(note);

  if (noteIndex === -1) throw new Error(`Invalid note: ${note}`);

  return (octave + 1) * 12 + noteIndex;
}

export function getRandomNote(minOctave = 3, maxOctave = 5): string {
  const octave = Math.floor(Math.random() * (maxOctave - minOctave + 1)) + minOctave;
  const noteIndex = Math.floor(Math.random() * NOTE_NAMES.length);
  return `${NOTE_NAMES[noteIndex]}${octave}`;
}

export function transposeNote(noteName: string, semitones: number): string {
  const midi = noteNameToMidi(noteName);
  return midiToNoteName(midi + semitones);
}

export function getInterval(rootNote: string, intervalName: keyof typeof INTERVALS): string {
  const semitones = INTERVALS[intervalName];
  return transposeNote(rootNote, semitones);
}

export function getChordNotes(rootNote: string, chordType: keyof typeof CHORD_TYPES): string[] {
  const intervals = CHORD_TYPES[chordType];
  return intervals.map(interval => transposeNote(rootNote, interval));
}

export function getRandomChordType(): keyof typeof CHORD_TYPES {
  const types = Object.keys(CHORD_TYPES) as (keyof typeof CHORD_TYPES)[];
  return types[Math.floor(Math.random() * types.length)];
}

export function getRandomInterval(): keyof typeof INTERVALS {
  const intervals = Object.keys(INTERVALS) as (keyof typeof INTERVALS)[];
  return intervals[Math.floor(Math.random() * intervals.length)];
}

export const KEYS = {
  'C': ['C', 'D', 'E', 'F', 'G', 'A', 'B'],
  'G': ['G', 'A', 'B', 'C', 'D', 'E', 'F#'],
  'D': ['D', 'E', 'F#', 'G', 'A', 'B', 'C#'],
  'A': ['A', 'B', 'C#', 'D', 'E', 'F#', 'G#'],
  'E': ['E', 'F#', 'G#', 'A', 'B', 'C#', 'D#'],
  'F': ['F', 'G', 'A', 'A#', 'C', 'D', 'E'],
  'Bb': ['A#', 'C', 'D', 'D#', 'F', 'G', 'A'],
} as const;

export function getDiatonicChord(key: keyof typeof KEYS, degree: number, octave = 4): string[] {
  const scale = KEYS[key];
  const rootNote = `${scale[degree - 1]}${octave}`;

  // Build triad: root, third, fifth
  const thirdNote = `${scale[(degree + 1) % 7]}${octave}`;
  const fifthNote = `${scale[(degree + 3) % 7]}${octave}`;

  return [rootNote, thirdNote, fifthNote];
}
