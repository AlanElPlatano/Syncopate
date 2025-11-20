import { describe, it, expect, vi } from 'vitest';
import {
  midiToNoteName,
  noteNameToMidi,
  getRandomNote,
  transposeNote,
  getInterval,
  getChordNotes,
  getRandomChordType,
  getRandomInterval,
  getDiatonicChord,
  NOTE_NAMES,
  INTERVALS,
  CHORD_TYPES,
  KEYS,
} from './theory';

describe('theory.ts - Music Theory Utilities', () => {
  describe('midiToNoteName', () => {
    it('should convert MIDI 60 to C4', () => {
      expect(midiToNoteName(60)).toBe('C4');
    });

    it('should convert MIDI 69 to A4', () => {
      expect(midiToNoteName(69)).toBe('A4');
    });

    it('should handle low octaves', () => {
      expect(midiToNoteName(12)).toBe('C0');
      expect(midiToNoteName(0)).toBe('C-1');
    });

    it('should handle high octaves', () => {
      expect(midiToNoteName(108)).toBe('C8');
    });

    it('should handle sharps correctly', () => {
      expect(midiToNoteName(61)).toBe('C#4');
      expect(midiToNoteName(66)).toBe('F#4');
    });

    it('should handle all notes in an octave', () => {
      const expectedNotes = ['C4', 'C#4', 'D4', 'D#4', 'E4', 'F4', 'F#4', 'G4', 'G#4', 'A4', 'A#4', 'B4'];
      const actualNotes = Array.from({ length: 12 }, (_, i) => midiToNoteName(60 + i));
      expect(actualNotes).toEqual(expectedNotes);
    });
  });

  describe('noteNameToMidi', () => {
    it('should convert C4 to MIDI 60', () => {
      expect(noteNameToMidi('C4')).toBe(60);
    });

    it('should convert A4 to MIDI 69', () => {
      expect(noteNameToMidi('A4')).toBe(69);
    });

    it('should handle sharps', () => {
      expect(noteNameToMidi('C#4')).toBe(61);
      expect(noteNameToMidi('F#4')).toBe(66);
    });

    it('should handle flats (enharmonic equivalents)', () => {
      expect(noteNameToMidi('Db4')).toBe(61); // Same as C#4
      expect(noteNameToMidi('Eb4')).toBe(63); // Same as D#4
      expect(noteNameToMidi('Gb4')).toBe(66); // Same as F#4
      expect(noteNameToMidi('Ab4')).toBe(68); // Same as G#4
      expect(noteNameToMidi('Bb4')).toBe(70); // Same as A#4
    });

    it('should handle low octaves', () => {
      expect(noteNameToMidi('C0')).toBe(12);
      expect(noteNameToMidi('C-1')).toBe(0);
    });

    it('should handle high octaves', () => {
      expect(noteNameToMidi('C8')).toBe(108);
    });

    it('should throw error for invalid note name', () => {
      expect(() => noteNameToMidi('H4')).toThrow('Invalid note name: H4');
      expect(() => noteNameToMidi('C')).toThrow('Invalid note name: C');
      expect(() => noteNameToMidi('invalid')).toThrow('Invalid note name: invalid');
    });

    it('should be inverse of midiToNoteName', () => {
      for (let midi = 12; midi <= 108; midi++) {
        const noteName = midiToNoteName(midi);
        expect(noteNameToMidi(noteName)).toBe(midi);
      }
    });
  });

  describe('getRandomNote', () => {
    it('should return a valid note name', () => {
      const note = getRandomNote();
      const regex = /^[A-G][#]?[0-9]$/;
      expect(note).toMatch(regex);
    });

    it('should return notes within default octave range (3-5)', () => {
      for (let i = 0; i < 20; i++) {
        const note = getRandomNote();
        const octave = parseInt(note.slice(-1));
        expect(octave).toBeGreaterThanOrEqual(3);
        expect(octave).toBeLessThanOrEqual(5);
      }
    });

    it('should return notes within custom octave range', () => {
      for (let i = 0; i < 20; i++) {
        const note = getRandomNote(1, 2);
        const octave = parseInt(note.slice(-1));
        expect(octave).toBeGreaterThanOrEqual(1);
        expect(octave).toBeLessThanOrEqual(2);
      }
    });

    it('should return valid note names from NOTE_NAMES', () => {
      for (let i = 0; i < 20; i++) {
        const note = getRandomNote();
        const noteName = note.slice(0, -1);
        expect(NOTE_NAMES).toContain(noteName);
      }
    });
  });

  describe('transposeNote', () => {
    it('should transpose up by a semitone', () => {
      expect(transposeNote('C4', 1)).toBe('C#4');
    });

    it('should transpose up by an octave', () => {
      expect(transposeNote('C4', 12)).toBe('C5');
    });

    it('should transpose down by a semitone', () => {
      expect(transposeNote('C4', -1)).toBe('B3');
    });

    it('should transpose down by an octave', () => {
      expect(transposeNote('C4', -12)).toBe('C3');
    });

    it('should handle transposing from sharp notes', () => {
      expect(transposeNote('C#4', 2)).toBe('D#4');
      expect(transposeNote('F#4', 1)).toBe('G4');
    });

    it('should handle crossing octave boundaries', () => {
      expect(transposeNote('B4', 1)).toBe('C5');
      expect(transposeNote('C4', -1)).toBe('B3');
    });

    it('should handle zero transposition', () => {
      expect(transposeNote('C4', 0)).toBe('C4');
    });

    it('should handle large transpositions', () => {
      expect(transposeNote('C4', 24)).toBe('C6');
      expect(transposeNote('C4', -24)).toBe('C2');
    });
  });

  describe('getInterval', () => {
    it('should get Major 3rd from C4', () => {
      expect(getInterval('C4', 'Major 3rd')).toBe('E4');
    });

    it('should get Perfect 5th from C4', () => {
      expect(getInterval('C4', 'Perfect 5th')).toBe('G4');
    });

    it('should get Octave from C4', () => {
      expect(getInterval('C4', 'Octave')).toBe('C5');
    });

    it('should get Minor 2nd from C4', () => {
      expect(getInterval('C4', 'Minor 2nd')).toBe('C#4');
    });

    it('should get Major 7th from C4', () => {
      expect(getInterval('C4', 'Major 7th')).toBe('B4');
    });

    it('should handle compound intervals (beyond octave)', () => {
      expect(getInterval('C4', 'Major 9th')).toBe('D5');
      expect(getInterval('C4', 'Perfect 11th')).toBe('F5');
      expect(getInterval('C4', 'Double Octave')).toBe('C6');
    });

    it('should work from different root notes', () => {
      expect(getInterval('D4', 'Major 3rd')).toBe('F#4');
      expect(getInterval('G4', 'Perfect 5th')).toBe('D5');
    });
  });

  describe('getChordNotes', () => {
    it('should get Major chord notes from C4', () => {
      expect(getChordNotes('C4', 'Major')).toEqual(['C4', 'E4', 'G4']);
    });

    it('should get Minor chord notes from C4', () => {
      expect(getChordNotes('C4', 'Minor')).toEqual(['C4', 'D#4', 'G4']);
    });

    it('should get Dominant 7th chord notes from C4', () => {
      expect(getChordNotes('C4', 'Dominant 7th')).toEqual(['C4', 'E4', 'G4', 'A#4']);
    });

    it('should get Major 7th chord notes from C4', () => {
      expect(getChordNotes('C4', 'Major 7th')).toEqual(['C4', 'E4', 'G4', 'B4']);
    });

    it('should get Minor 7th chord notes from C4', () => {
      expect(getChordNotes('C4', 'Minor 7th')).toEqual(['C4', 'D#4', 'G4', 'A#4']);
    });

    it('should get Diminished chord notes from C4', () => {
      expect(getChordNotes('C4', 'Diminished')).toEqual(['C4', 'D#4', 'F#4']);
    });

    it('should get Augmented chord notes from C4', () => {
      expect(getChordNotes('C4', 'Augmented')).toEqual(['C4', 'E4', 'G#4']);
    });

    it('should work from different root notes', () => {
      expect(getChordNotes('D4', 'Major')).toEqual(['D4', 'F#4', 'A4']);
      expect(getChordNotes('G4', 'Minor')).toEqual(['G4', 'A#4', 'D5']);
    });

    it('should return correct number of notes for each chord type', () => {
      expect(getChordNotes('C4', 'Major')).toHaveLength(3);
      expect(getChordNotes('C4', 'Minor')).toHaveLength(3);
      expect(getChordNotes('C4', 'Dominant 7th')).toHaveLength(4);
      expect(getChordNotes('C4', 'Major 7th')).toHaveLength(4);
      expect(getChordNotes('C4', 'Minor 7th')).toHaveLength(4);
      expect(getChordNotes('C4', 'Diminished')).toHaveLength(3);
      expect(getChordNotes('C4', 'Augmented')).toHaveLength(3);
    });
  });

  describe('getRandomChordType', () => {
    it('should return a valid chord type', () => {
      const chordType = getRandomChordType();
      expect(Object.keys(CHORD_TYPES)).toContain(chordType);
    });

    it('should return different chord types over multiple calls', () => {
      const chordTypes = new Set();
      for (let i = 0; i < 50; i++) {
        chordTypes.add(getRandomChordType());
      }
      // Should get at least a few different types in 50 calls
      expect(chordTypes.size).toBeGreaterThan(1);
    });
  });

  describe('getRandomInterval', () => {
    it('should return a valid interval', () => {
      const interval = getRandomInterval();
      expect(Object.keys(INTERVALS)).toContain(interval);
    });

    it('should return different intervals over multiple calls', () => {
      const intervals = new Set();
      for (let i = 0; i < 50; i++) {
        intervals.add(getRandomInterval());
      }
      // Should get at least a few different intervals in 50 calls
      expect(intervals.size).toBeGreaterThan(1);
    });
  });

  describe('getDiatonicChord', () => {
    it('should get I chord in C major', () => {
      expect(getDiatonicChord('C', 1, 4)).toEqual(['C4', 'E4', 'G4']);
    });

    it('should get IV chord in C major', () => {
      expect(getDiatonicChord('C', 4, 4)).toEqual(['F4', 'A4', 'C4']);
    });

    it('should get V chord in C major', () => {
      expect(getDiatonicChord('C', 5, 4)).toEqual(['G4', 'B4', 'D4']);
    });

    it('should get I chord in G major', () => {
      expect(getDiatonicChord('G', 1, 4)).toEqual(['G4', 'B4', 'D4']);
    });

    it('should get I chord in F major', () => {
      expect(getDiatonicChord('F', 1, 4)).toEqual(['F4', 'A4', 'C4']);
    });

    it('should always return 3 notes', () => {
      Object.keys(KEYS).forEach((key) => {
        for (let degree = 1; degree <= 7; degree++) {
          const chord = getDiatonicChord(key as keyof typeof KEYS, degree, 4);
          expect(chord).toHaveLength(3);
        }
      });
    });

    it('should work with different octaves', () => {
      expect(getDiatonicChord('C', 1, 3)).toEqual(['C3', 'E3', 'G3']);
      expect(getDiatonicChord('C', 1, 5)).toEqual(['C5', 'E5', 'G5']);
    });

    it('should handle all 7 scale degrees', () => {
      for (let degree = 1; degree <= 7; degree++) {
        const chord = getDiatonicChord('C', degree, 4);
        expect(chord).toHaveLength(3);
        expect(chord[0]).toMatch(/^[A-G][#]?4$/);
      }
    });
  });
});
