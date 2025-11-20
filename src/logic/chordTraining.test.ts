import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import {
  generateChordQuestion,
  validateAnswer,
  calculateAccuracy,
  ChordQuestion,
} from './chordTraining';
import { CHORD_TYPES } from '../audio/theory';

describe('chordTraining.ts - Chord Training Logic', () => {
  describe('generateChordQuestion', () => {
    it('should generate a valid chord question with single chord type', () => {
      const question = generateChordQuestion(['Major']);

      expect(question).toHaveProperty('rootNote');
      expect(question).toHaveProperty('chordType');
      expect(question).toHaveProperty('chordNotes');
      expect(question.chordType).toBe('Major');
      expect(question.chordNotes).toHaveLength(3); // Major chord has 3 notes
    });

    it('should generate question from multiple selected chord types', () => {
      const selectedTypes = ['Major', 'Minor', 'Dominant 7th'];
      const question = generateChordQuestion(selectedTypes);

      expect(selectedTypes).toContain(question.chordType);
      expect(question.chordNotes.length).toBeGreaterThan(0);
    });

    it('should generate valid root note in octave 3-4 range', () => {
      for (let i = 0; i < 20; i++) {
        const question = generateChordQuestion(['Major']);
        const octave = parseInt(question.rootNote.slice(-1));
        expect(octave).toBeGreaterThanOrEqual(3);
        expect(octave).toBeLessThanOrEqual(4);
      }
    });

    it('should generate correct number of notes for chord types', () => {
      const majorQuestion = generateChordQuestion(['Major']);
      expect(majorQuestion.chordNotes).toHaveLength(3);

      const dom7Question = generateChordQuestion(['Dominant 7th']);
      expect(dom7Question.chordNotes).toHaveLength(4);

      const diminishedQuestion = generateChordQuestion(['Diminished']);
      expect(diminishedQuestion.chordNotes).toHaveLength(3);
    });

    it('should throw error if no chord types selected', () => {
      expect(() => generateChordQuestion([])).toThrow(
        'At least one chord type must be selected'
      );
    });

    it('should generate all selected chord types over multiple calls', () => {
      const selectedTypes = ['Major', 'Minor', 'Diminished'];
      const generatedTypes = new Set<string>();

      // Generate many questions to ensure we hit all types
      for (let i = 0; i < 100; i++) {
        const question = generateChordQuestion(selectedTypes);
        generatedTypes.add(question.chordType);
      }

      // Should have generated all selected types
      expect(generatedTypes.size).toBe(3);
      selectedTypes.forEach(type => {
        expect(generatedTypes.has(type)).toBe(true);
      });
    });

    it('should generate valid chord notes matching the chord type', () => {
      const question = generateChordQuestion(['Major']);

      // Verify the chord notes are valid
      expect(question.chordNotes).toHaveLength(3);
      question.chordNotes.forEach(note => {
        expect(note).toMatch(/^[A-G][#]?[0-9]$/);
      });
    });

    it('should work with all available chord types', () => {
      const allChordTypes = Object.keys(CHORD_TYPES);

      allChordTypes.forEach(chordType => {
        const question = generateChordQuestion([chordType]);
        expect(question.chordType).toBe(chordType);
        expect(question.chordNotes.length).toBeGreaterThan(0);
      });
    });
  });

  describe('validateAnswer', () => {
    it('should return true for correct answer', () => {
      const question: ChordQuestion = {
        rootNote: 'C4',
        chordType: 'Major',
        chordNotes: ['C4', 'E4', 'G4'],
      };

      expect(validateAnswer(question, 'Major')).toBe(true);
    });

    it('should return false for incorrect answer', () => {
      const question: ChordQuestion = {
        rootNote: 'C4',
        chordType: 'Major',
        chordNotes: ['C4', 'E4', 'G4'],
      };

      expect(validateAnswer(question, 'Minor')).toBe(false);
      expect(validateAnswer(question, 'Dominant 7th')).toBe(false);
    });

    it('should handle all chord types correctly', () => {
      const chordTypes = Object.keys(CHORD_TYPES) as (keyof typeof CHORD_TYPES)[];

      chordTypes.forEach(correctType => {
        const question: ChordQuestion = {
          rootNote: 'C4',
          chordType: correctType,
          chordNotes: ['C4', 'E4', 'G4'],
        };

        // Should be true for correct answer
        expect(validateAnswer(question, correctType)).toBe(true);

        // Should be false for all other answers
        chordTypes.forEach(testType => {
          if (testType !== correctType) {
            expect(validateAnswer(question, testType)).toBe(false);
          }
        });
      });
    });

    it('should be case-sensitive', () => {
      const question: ChordQuestion = {
        rootNote: 'C4',
        chordType: 'Major',
        chordNotes: ['C4', 'E4', 'G4'],
      };

      expect(validateAnswer(question, 'major' as any)).toBe(false);
      expect(validateAnswer(question, 'MAJOR' as any)).toBe(false);
    });
  });

  describe('calculateAccuracy', () => {
    it('should return 100 for perfect score', () => {
      expect(calculateAccuracy(10, 10)).toBe(100);
    });

    it('should return 0 for no correct answers', () => {
      expect(calculateAccuracy(0, 10)).toBe(0);
    });

    it('should return 0 for zero total questions', () => {
      expect(calculateAccuracy(0, 0)).toBe(0);
      expect(calculateAccuracy(5, 0)).toBe(0); // Edge case: more correct than total
    });

    it('should calculate 50% accuracy correctly', () => {
      expect(calculateAccuracy(5, 10)).toBe(50);
    });

    it('should round to nearest integer', () => {
      expect(calculateAccuracy(1, 3)).toBe(33); // 33.333...
      expect(calculateAccuracy(2, 3)).toBe(67); // 66.666...
    });

    it('should handle various accuracy values', () => {
      expect(calculateAccuracy(7, 10)).toBe(70);
      expect(calculateAccuracy(8, 10)).toBe(80);
      expect(calculateAccuracy(9, 10)).toBe(90);
    });

    it('should handle single question scenarios', () => {
      expect(calculateAccuracy(1, 1)).toBe(100);
      expect(calculateAccuracy(0, 1)).toBe(0);
    });

    it('should handle large numbers', () => {
      expect(calculateAccuracy(999, 1000)).toBe(100); // 99.9% rounds to 100
      expect(calculateAccuracy(500, 1000)).toBe(50);
      expect(calculateAccuracy(1, 1000)).toBe(0); // 0.1% rounds to 0
    });

    it('should never return negative values', () => {
      expect(calculateAccuracy(0, 10)).toBeGreaterThanOrEqual(0);
      expect(calculateAccuracy(0, 0)).toBeGreaterThanOrEqual(0);
    });

    it('should never return values over 100', () => {
      expect(calculateAccuracy(10, 10)).toBeLessThanOrEqual(100);
      expect(calculateAccuracy(100, 100)).toBeLessThanOrEqual(100);
    });
  });
});
