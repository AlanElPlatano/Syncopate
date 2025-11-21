import { describe, it, expect } from 'vitest';
import {
  generateIntervalQuestion,
  validateAnswer,
  calculateAccuracy,
  IntervalQuestion,
} from './intervalTraining';
import { INTERVALS, noteNameToMidi } from '../audio/theory';

describe('intervalTraining.ts - Interval Training Logic', () => {
  describe('generateIntervalQuestion', () => {
    const defaultOctaveRange = { min: 3, max: 5 };

    it('should generate a valid interval question', () => {
      const question = generateIntervalQuestion(
        ['Major 3rd'],
        'ascending',
        false,
        false,
        defaultOctaveRange
      );

      expect(question).toHaveProperty('note1');
      expect(question).toHaveProperty('note2');
      expect(question).toHaveProperty('intervalName');
      expect(question).toHaveProperty('direction');
      expect(question.intervalName).toBe('Major 3rd');
    });

    it('should generate ascending interval when specified', () => {
      const question = generateIntervalQuestion(
        ['Perfect 5th'],
        'ascending',
        false,
        false,
        defaultOctaveRange
      );

      expect(question.direction).toBe('ascending');
      const midi1 = noteNameToMidi(question.note1);
      const midi2 = noteNameToMidi(question.note2);
      expect(midi2).toBeGreaterThan(midi1);
    });

    it('should generate descending interval when specified', () => {
      const question = generateIntervalQuestion(
        ['Perfect 5th'],
        'descending',
        false,
        false,
        defaultOctaveRange
      );

      expect(question.direction).toBe('descending');
      const midi1 = noteNameToMidi(question.note1);
      const midi2 = noteNameToMidi(question.note2);
      // For descending, note1 is lower than note2
      expect(midi2).toBeGreaterThan(midi1);
    });

    it('should generate random direction when specified', () => {
      const directions = new Set<string>();

      for (let i = 0; i < 50; i++) {
        const question = generateIntervalQuestion(
          ['Major 3rd'],
          'random',
          false,
          false,
          defaultOctaveRange
        );
        directions.add(question.direction);
      }

      // Should have both ascending and descending over 50 tries
      expect(directions.size).toBeGreaterThan(1);
      expect(directions.has('ascending') || directions.has('descending')).toBe(true);
    });

    it('should generate harmonic interval when harmonicMode is true', () => {
      const question = generateIntervalQuestion(
        ['Major 3rd'],
        'ascending',
        true,
        false,
        defaultOctaveRange
      );

      expect(question.direction).toBe('harmonic');
    });

    it('should override direction with harmonic when harmonicMode is true', () => {
      const ascendingQuestion = generateIntervalQuestion(
        ['Major 3rd'],
        'ascending',
        true,
        false,
        defaultOctaveRange
      );

      const descendingQuestion = generateIntervalQuestion(
        ['Major 3rd'],
        'descending',
        true,
        false,
        defaultOctaveRange
      );

      expect(ascendingQuestion.direction).toBe('harmonic');
      expect(descendingQuestion.direction).toBe('harmonic');
    });

    it('should throw error if no intervals selected', () => {
      expect(() =>
        generateIntervalQuestion([], 'ascending', false, false, defaultOctaveRange)
      ).toThrow('At least one interval must be selected');
    });

    it('should throw error if compound interval selected but disabled', () => {
      expect(() =>
        generateIntervalQuestion(
          ['Major 9th'], // Compound interval (13 semitones)
          'ascending',
          false,
          false, // Compound intervals disabled
          defaultOctaveRange
        )
      ).toThrow('Compound interval selected but compound intervals are disabled');
    });

    it('should allow compound intervals when enabled', () => {
      const question = generateIntervalQuestion(
        ['Major 9th'],
        'ascending',
        false,
        true, // Compound intervals enabled
        defaultOctaveRange
      );

      expect(question.intervalName).toBe('Major 9th');
      expect(question).toHaveProperty('note1');
      expect(question).toHaveProperty('note2');
    });

    it('should handle multiple selected intervals', () => {
      const selectedIntervals = ['Minor 3rd', 'Major 3rd', 'Perfect 5th'];
      const generatedIntervals = new Set<string>();

      for (let i = 0; i < 100; i++) {
        const question = generateIntervalQuestion(
          selectedIntervals,
          'ascending',
          false,
          false,
          defaultOctaveRange
        );
        generatedIntervals.add(question.intervalName);
      }

      // Should have generated all selected intervals
      expect(generatedIntervals.size).toBe(3);
      selectedIntervals.forEach(interval => {
        expect(generatedIntervals.has(interval)).toBe(true);
      });
    });

    it('should generate correct interval distance for ascending', () => {
      const question = generateIntervalQuestion(
        ['Perfect 5th'],
        'ascending',
        false,
        false,
        defaultOctaveRange
      );

      const midi1 = noteNameToMidi(question.note1);
      const midi2 = noteNameToMidi(question.note2);
      const distance = midi2 - midi1;

      expect(distance).toBe(INTERVALS['Perfect 5th']);
    });

    it('should generate correct interval distance for descending', () => {
      const question = generateIntervalQuestion(
        ['Major 3rd'],
        'descending',
        false,
        false,
        defaultOctaveRange
      );

      const midi1 = noteNameToMidi(question.note1);
      const midi2 = noteNameToMidi(question.note2);
      // For descending, note2 is higher, so distance is note2 - note1
      const distance = midi2 - midi1;

      expect(distance).toBe(INTERVALS['Major 3rd']);
    });

    it('should stay within octave range when possible', () => {
      const narrowRange = { min: 4, max: 4 };

      for (let i = 0; i < 20; i++) {
        const question = generateIntervalQuestion(
          ['Major 3rd'],
          'ascending',
          false,
          false,
          narrowRange
        );

        // At least one note should be in octave 4
        const octave1 = parseInt(question.note1.slice(-1));
        const octave2 = parseInt(question.note2.slice(-1));

        expect(octave1 === 4 || octave2 === 4).toBe(true);
      }
    });

    it('should handle boundary notes without crashing', () => {
      // Test with all intervals to ensure no MIDI range issues
      const allIntervals = Object.keys(INTERVALS);

      allIntervals.forEach(interval => {
        expect(() =>
          generateIntervalQuestion(
            [interval],
            'ascending',
            false,
            true, // Allow compound
            defaultOctaveRange
          )
        ).not.toThrow();
      });
    });

    it('should generate valid note names', () => {
      for (let i = 0; i < 20; i++) {
        const question = generateIntervalQuestion(
          ['Major 3rd'],
          'random',
          false,
          false,
          defaultOctaveRange
        );

        expect(question.note1).toMatch(/^[A-G][#]?-?\d+$/);
        expect(question.note2).toMatch(/^[A-G][#]?-?\d+$/);
      }
    });

    it('should handle octave interval correctly', () => {
      const question = generateIntervalQuestion(
        ['Octave'],
        'ascending',
        false,
        false,
        { min: 3, max: 4 }
      );

      const midi1 = noteNameToMidi(question.note1);
      const midi2 = noteNameToMidi(question.note2);

      expect(midi2 - midi1).toBe(12);
    });

    it('should handle minor 2nd correctly', () => {
      const question = generateIntervalQuestion(
        ['Minor 2nd'],
        'ascending',
        false,
        false,
        defaultOctaveRange
      );

      const midi1 = noteNameToMidi(question.note1);
      const midi2 = noteNameToMidi(question.note2);

      expect(midi2 - midi1).toBe(1);
    });
  });

  describe('validateAnswer', () => {
    it('should return true for correct answer', () => {
      const question: IntervalQuestion = {
        note1: 'C4',
        note2: 'E4',
        intervalName: 'Major 3rd',
        direction: 'ascending',
      };

      expect(validateAnswer(question, 'Major 3rd')).toBe(true);
    });

    it('should return false for incorrect answer', () => {
      const question: IntervalQuestion = {
        note1: 'C4',
        note2: 'E4',
        intervalName: 'Major 3rd',
        direction: 'ascending',
      };

      expect(validateAnswer(question, 'Minor 3rd')).toBe(false);
      expect(validateAnswer(question, 'Perfect 5th')).toBe(false);
    });

    it('should handle all interval types correctly', () => {
      const intervalTypes = Object.keys(INTERVALS) as (keyof typeof INTERVALS)[];

      intervalTypes.forEach(correctInterval => {
        const question: IntervalQuestion = {
          note1: 'C4',
          note2: 'E4',
          intervalName: correctInterval,
          direction: 'ascending',
        };

        // Should be true for correct answer
        expect(validateAnswer(question, correctInterval)).toBe(true);

        // Should be false for at least some other answers
        const otherInterval = intervalTypes.find(i => i !== correctInterval);
        if (otherInterval) {
          expect(validateAnswer(question, otherInterval)).toBe(false);
        }
      });
    });

    it('should validate regardless of direction', () => {
      const ascendingQuestion: IntervalQuestion = {
        note1: 'C4',
        note2: 'E4',
        intervalName: 'Major 3rd',
        direction: 'ascending',
      };

      const descendingQuestion: IntervalQuestion = {
        note1: 'E4',
        note2: 'C4',
        intervalName: 'Major 3rd',
        direction: 'descending',
      };

      const harmonicQuestion: IntervalQuestion = {
        note1: 'C4',
        note2: 'E4',
        intervalName: 'Major 3rd',
        direction: 'harmonic',
      };

      expect(validateAnswer(ascendingQuestion, 'Major 3rd')).toBe(true);
      expect(validateAnswer(descendingQuestion, 'Major 3rd')).toBe(true);
      expect(validateAnswer(harmonicQuestion, 'Major 3rd')).toBe(true);
    });

    it('should be case-sensitive', () => {
      const question: IntervalQuestion = {
        note1: 'C4',
        note2: 'E4',
        intervalName: 'Major 3rd',
        direction: 'ascending',
      };

      expect(validateAnswer(question, 'major 3rd' as any)).toBe(false);
      expect(validateAnswer(question, 'MAJOR 3RD' as any)).toBe(false);
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
    });

    it('should calculate 50% accuracy correctly', () => {
      expect(calculateAccuracy(5, 10)).toBe(50);
    });

    it('should round to nearest integer', () => {
      expect(calculateAccuracy(1, 3)).toBe(33);
      expect(calculateAccuracy(2, 3)).toBe(67);
    });

    it('should handle various accuracy values', () => {
      expect(calculateAccuracy(7, 10)).toBe(70);
      expect(calculateAccuracy(8, 10)).toBe(80);
      expect(calculateAccuracy(9, 10)).toBe(90);
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
