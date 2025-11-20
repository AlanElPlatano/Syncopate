import { describe, it, expect } from 'vitest';
import {
  updateChordStats,
  updateIntervalStats,
  updateProgressionStats,
  getOverallSummary,
  getTotalTrainingTime,
  getAverageTimePerQuestion,
} from './analytics';
import {
  DetailedLifetimeStats,
  DetailedSessionStats,
  DetailedChordStats,
  DetailedIntervalStats,
  DetailedProgressionStats,
  ChordAnswerRecord,
  IntervalAnswerRecord,
  ProgressionAnswerRecord,
  DEFAULT_DETAILED_CHORD_STATS,
  DEFAULT_DETAILED_INTERVAL_STATS,
  DEFAULT_DETAILED_PROGRESSION_STATS,
} from '../types/stats';

describe('analytics.ts - Analytics Calculations', () => {
  describe('updateChordStats', () => {
    it('should update basic stats correctly', () => {
      const currentStats: DetailedChordStats = {
        ...DEFAULT_DETAILED_CHORD_STATS,
        totalSessions: 5,
        totalQuestions: 50,
        totalCorrect: 40,
        overallAccuracy: 80,
      };

      const session: DetailedSessionStats = {
        sessionId: 'session-1',
        mode: 'chord',
        correctAnswers: 8,
        totalQuestions: 10,
        accuracy: 80,
        timestamp: Date.now(),
        answers: [],
        config: { guestMode: false, numQuestions: 10 },
      };

      const updated = updateChordStats(currentStats, session);

      expect(updated.totalSessions).toBe(6);
      expect(updated.totalQuestions).toBe(60);
      expect(updated.totalCorrect).toBe(48);
      expect(updated.overallAccuracy).toBe(80); // 48/60 = 80%
    });

    it('should calculate accuracy correctly', () => {
      const currentStats: DetailedChordStats = {
        ...DEFAULT_DETAILED_CHORD_STATS,
      };

      const session: DetailedSessionStats = {
        sessionId: 'session-1',
        mode: 'chord',
        correctAnswers: 7,
        totalQuestions: 10,
        accuracy: 70,
        timestamp: Date.now(),
        answers: [],
        config: { guestMode: false, numQuestions: 10 },
      };

      const updated = updateChordStats(currentStats, session);

      expect(updated.overallAccuracy).toBe(70); // 7/10 = 70%
    });

    it('should update chord type breakdown', () => {
      const currentStats: DetailedChordStats = {
        ...DEFAULT_DETAILED_CHORD_STATS,
        chordTypeBreakdown: {},
      };

      const answers: ChordAnswerRecord[] = [
        {
          questionIndex: 0,
          timestamp: Date.now(),
          isCorrect: true,
          correctAnswer: 'Major',
          userAnswer: 'Major',
          rootNote: 'C4',
          chordType: 'Major',
        },
        {
          questionIndex: 1,
          timestamp: Date.now(),
          isCorrect: false,
          correctAnswer: 'Minor',
          userAnswer: 'Major',
          rootNote: 'D4',
          chordType: 'Minor',
        },
        {
          questionIndex: 2,
          timestamp: Date.now(),
          isCorrect: true,
          correctAnswer: 'Major',
          userAnswer: 'Major',
          rootNote: 'E4',
          chordType: 'Major',
        },
      ];

      const session: DetailedSessionStats = {
        sessionId: 'session-1',
        mode: 'chord',
        correctAnswers: 2,
        totalQuestions: 3,
        accuracy: 67,
        timestamp: Date.now(),
        answers,
        config: { guestMode: false, numQuestions: 3 },
      };

      const updated = updateChordStats(currentStats, session);

      expect(updated.chordTypeBreakdown['Major']).toEqual({
        correct: 2,
        total: 2,
        accuracy: 100,
      });

      expect(updated.chordTypeBreakdown['Minor']).toEqual({
        correct: 0,
        total: 1,
        accuracy: 0,
      });
    });

    it('should update lastPlayed timestamp', () => {
      const currentStats: DetailedChordStats = {
        ...DEFAULT_DETAILED_CHORD_STATS,
        lastPlayed: 1000,
      };

      const session: DetailedSessionStats = {
        sessionId: 'session-1',
        mode: 'chord',
        correctAnswers: 5,
        totalQuestions: 10,
        accuracy: 50,
        timestamp: 2000,
        answers: [],
        config: { guestMode: false, numQuestions: 10 },
      };

      const updated = updateChordStats(currentStats, session);

      expect(updated.lastPlayed).toBe(2000);
    });

    it('should track recent sessions', () => {
      const currentStats: DetailedChordStats = {
        ...DEFAULT_DETAILED_CHORD_STATS,
        recentSessions: ['session-1', 'session-2'],
      };

      const session: DetailedSessionStats = {
        sessionId: 'session-3',
        mode: 'chord',
        correctAnswers: 5,
        totalQuestions: 10,
        accuracy: 50,
        timestamp: Date.now(),
        answers: [],
        config: { guestMode: false, numQuestions: 10 },
      };

      const updated = updateChordStats(currentStats, session);

      expect(updated.recentSessions).toEqual(['session-1', 'session-2', 'session-3']);
    });

    it('should handle zero questions gracefully', () => {
      const currentStats: DetailedChordStats = {
        ...DEFAULT_DETAILED_CHORD_STATS,
      };

      const session: DetailedSessionStats = {
        sessionId: 'session-1',
        mode: 'chord',
        correctAnswers: 0,
        totalQuestions: 0,
        accuracy: 0,
        timestamp: Date.now(),
        answers: [],
        config: { guestMode: false, numQuestions: 0 },
      };

      const updated = updateChordStats(currentStats, session);

      expect(updated.overallAccuracy).toBe(0);
    });
  });

  describe('updateIntervalStats', () => {
    it('should update basic stats correctly', () => {
      const currentStats: DetailedIntervalStats = {
        ...DEFAULT_DETAILED_INTERVAL_STATS,
        totalSessions: 3,
        totalQuestions: 30,
        totalCorrect: 24,
        overallAccuracy: 80,
      };

      const session: DetailedSessionStats = {
        sessionId: 'session-1',
        mode: 'interval',
        correctAnswers: 6,
        totalQuestions: 10,
        accuracy: 60,
        timestamp: Date.now(),
        answers: [],
        config: { guestMode: false, numQuestions: 10 },
      };

      const updated = updateIntervalStats(currentStats, session);

      expect(updated.totalSessions).toBe(4);
      expect(updated.totalQuestions).toBe(40);
      expect(updated.totalCorrect).toBe(30);
      expect(updated.overallAccuracy).toBe(75); // 30/40 = 75%
    });

    it('should update interval breakdown', () => {
      const currentStats: DetailedIntervalStats = {
        ...DEFAULT_DETAILED_INTERVAL_STATS,
        intervalBreakdown: {},
      };

      const answers: IntervalAnswerRecord[] = [
        {
          questionIndex: 0,
          timestamp: Date.now(),
          isCorrect: true,
          correctAnswer: 'Major 3rd',
          userAnswer: 'Major 3rd',
          intervalName: 'Major 3rd',
          direction: 'ascending',
          note1: 'C4',
          note2: 'E4',
        },
        {
          questionIndex: 1,
          timestamp: Date.now(),
          isCorrect: false,
          correctAnswer: 'Perfect 5th',
          userAnswer: 'Major 3rd',
          intervalName: 'Perfect 5th',
          direction: 'ascending',
          note1: 'C4',
          note2: 'G4',
        },
      ];

      const session: DetailedSessionStats = {
        sessionId: 'session-1',
        mode: 'interval',
        correctAnswers: 1,
        totalQuestions: 2,
        accuracy: 50,
        timestamp: Date.now(),
        answers,
        config: { guestMode: false, numQuestions: 2 },
      };

      const updated = updateIntervalStats(currentStats, session);

      expect(updated.intervalBreakdown['Major 3rd']).toEqual({
        correct: 1,
        total: 1,
        accuracy: 100,
      });

      expect(updated.intervalBreakdown['Perfect 5th']).toEqual({
        correct: 0,
        total: 1,
        accuracy: 0,
      });
    });

    it('should update direction breakdown', () => {
      const currentStats: DetailedIntervalStats = {
        ...DEFAULT_DETAILED_INTERVAL_STATS,
      };

      const answers: IntervalAnswerRecord[] = [
        {
          questionIndex: 0,
          timestamp: Date.now(),
          isCorrect: true,
          correctAnswer: 'Major 3rd',
          userAnswer: 'Major 3rd',
          intervalName: 'Major 3rd',
          direction: 'ascending',
          note1: 'C4',
          note2: 'E4',
        },
        {
          questionIndex: 1,
          timestamp: Date.now(),
          isCorrect: false,
          correctAnswer: 'Perfect 5th',
          userAnswer: 'Major 3rd',
          intervalName: 'Perfect 5th',
          direction: 'descending',
          note1: 'G4',
          note2: 'C4',
        },
        {
          questionIndex: 2,
          timestamp: Date.now(),
          isCorrect: true,
          correctAnswer: 'Minor 3rd',
          userAnswer: 'Minor 3rd',
          intervalName: 'Minor 3rd',
          direction: 'ascending',
          note1: 'D4',
          note2: 'F4',
        },
      ];

      const session: DetailedSessionStats = {
        sessionId: 'session-1',
        mode: 'interval',
        correctAnswers: 2,
        totalQuestions: 3,
        accuracy: 67,
        timestamp: Date.now(),
        answers,
        config: { guestMode: false, numQuestions: 3 },
      };

      const updated = updateIntervalStats(currentStats, session);

      expect(updated.directionBreakdown.ascending).toEqual({
        correct: 2,
        total: 2,
        accuracy: 100,
      });

      expect(updated.directionBreakdown.descending).toEqual({
        correct: 0,
        total: 1,
        accuracy: 0,
      });
    });
  });

  describe('updateProgressionStats', () => {
    it('should update basic stats correctly', () => {
      const currentStats: DetailedProgressionStats = {
        ...DEFAULT_DETAILED_PROGRESSION_STATS,
        totalSessions: 2,
        totalQuestions: 20,
        totalCorrect: 15,
        overallAccuracy: 75,
      };

      const session: DetailedSessionStats = {
        sessionId: 'session-1',
        mode: 'progression',
        correctAnswers: 5,
        totalQuestions: 10,
        accuracy: 50,
        timestamp: Date.now(),
        answers: [],
        config: { guestMode: false, numQuestions: 10 },
      };

      const updated = updateProgressionStats(currentStats, session);

      expect(updated.totalSessions).toBe(3);
      expect(updated.totalQuestions).toBe(30);
      expect(updated.totalCorrect).toBe(20);
      expect(updated.overallAccuracy).toBe(67); // 20/30 = 66.67% rounds to 67
    });
  });

  describe('getOverallSummary', () => {
    it('should calculate overall summary correctly', () => {
      const stats: DetailedLifetimeStats = {
        chord: {
          ...DEFAULT_DETAILED_CHORD_STATS,
          totalSessions: 5,
          totalQuestions: 50,
          totalCorrect: 40,
          overallAccuracy: 80,
        },
        interval: {
          ...DEFAULT_DETAILED_INTERVAL_STATS,
          totalSessions: 3,
          totalQuestions: 30,
          totalCorrect: 24,
          overallAccuracy: 80,
        },
        progression: {
          ...DEFAULT_DETAILED_PROGRESSION_STATS,
          totalSessions: 2,
          totalQuestions: 20,
          totalCorrect: 10,
          overallAccuracy: 50,
        },
        sessionHistory: {},
      };

      const summary = getOverallSummary(stats);

      expect(summary.totalSessions).toBe(10); // 5 + 3 + 2
      expect(summary.totalQuestions).toBe(100); // 50 + 30 + 20
      expect(summary.totalCorrect).toBe(74); // 40 + 24 + 10
      expect(summary.overallAccuracy).toBe(74); // 74/100 = 74%

      expect(summary.byMode.chord).toEqual({
        sessions: 5,
        accuracy: 80,
      });

      expect(summary.byMode.interval).toEqual({
        sessions: 3,
        accuracy: 80,
      });

      expect(summary.byMode.progression).toEqual({
        sessions: 2,
        accuracy: 50,
      });
    });

    it('should handle zero questions gracefully', () => {
      const stats: DetailedLifetimeStats = {
        chord: { ...DEFAULT_DETAILED_CHORD_STATS },
        interval: { ...DEFAULT_DETAILED_INTERVAL_STATS },
        progression: { ...DEFAULT_DETAILED_PROGRESSION_STATS },
        sessionHistory: {},
      };

      const summary = getOverallSummary(stats);

      expect(summary.totalSessions).toBe(0);
      expect(summary.totalQuestions).toBe(0);
      expect(summary.totalCorrect).toBe(0);
      expect(summary.overallAccuracy).toBe(0);
    });

    it('should calculate accuracy with mixed results', () => {
      const stats: DetailedLifetimeStats = {
        chord: {
          ...DEFAULT_DETAILED_CHORD_STATS,
          totalQuestions: 10,
          totalCorrect: 5,
        },
        interval: {
          ...DEFAULT_DETAILED_INTERVAL_STATS,
          totalQuestions: 10,
          totalCorrect: 8,
        },
        progression: {
          ...DEFAULT_DETAILED_PROGRESSION_STATS,
          totalQuestions: 10,
          totalCorrect: 2,
        },
        sessionHistory: {},
      };

      const summary = getOverallSummary(stats);

      expect(summary.totalQuestions).toBe(30);
      expect(summary.totalCorrect).toBe(15);
      expect(summary.overallAccuracy).toBe(50); // 15/30 = 50%
    });
  });

  describe('getTotalTrainingTime', () => {
    it('should calculate total training time correctly', () => {
      const stats: DetailedLifetimeStats = {
        chord: { ...DEFAULT_DETAILED_CHORD_STATS },
        interval: { ...DEFAULT_DETAILED_INTERVAL_STATS },
        progression: { ...DEFAULT_DETAILED_PROGRESSION_STATS },
        sessionHistory: {
          'session-1': {
            sessionId: 'session-1',
            mode: 'chord',
            correctAnswers: 5,
            totalQuestions: 10,
            accuracy: 50,
            timestamp: Date.now(),
            answers: [],
            config: { guestMode: false, numQuestions: 10 },
            duration: 60000, // 1 minute
          },
          'session-2': {
            sessionId: 'session-2',
            mode: 'interval',
            correctAnswers: 8,
            totalQuestions: 10,
            accuracy: 80,
            timestamp: Date.now(),
            answers: [],
            config: { guestMode: false, numQuestions: 10 },
            duration: 120000, // 2 minutes
          },
        },
      };

      const time = getTotalTrainingTime(stats);

      expect(time.totalMilliseconds).toBe(180000); // 3 minutes
      expect(time.totalSeconds).toBe(180);
      expect(time.totalMinutes).toBe(3);
      expect(time.totalHours).toBe(0);
      expect(time.formatted).toBe('3m');
    });

    it('should format time with hours correctly', () => {
      const stats: DetailedLifetimeStats = {
        chord: { ...DEFAULT_DETAILED_CHORD_STATS },
        interval: { ...DEFAULT_DETAILED_INTERVAL_STATS },
        progression: { ...DEFAULT_DETAILED_PROGRESSION_STATS },
        sessionHistory: {
          'session-1': {
            sessionId: 'session-1',
            mode: 'chord',
            correctAnswers: 5,
            totalQuestions: 10,
            accuracy: 50,
            timestamp: Date.now(),
            answers: [],
            config: { guestMode: false, numQuestions: 10 },
            duration: 3600000, // 1 hour
          },
          'session-2': {
            sessionId: 'session-2',
            mode: 'interval',
            correctAnswers: 8,
            totalQuestions: 10,
            accuracy: 80,
            timestamp: Date.now(),
            answers: [],
            config: { guestMode: false, numQuestions: 10 },
            duration: 1800000, // 30 minutes
          },
        },
      };

      const time = getTotalTrainingTime(stats);

      expect(time.totalHours).toBe(1);
      expect(time.totalMinutes).toBe(90);
      expect(time.formatted).toBe('1h 30m');
      expect(time.formattedDetailed).toBe('1h 30m 0s');
    });

    it('should handle zero time', () => {
      const stats: DetailedLifetimeStats = {
        chord: { ...DEFAULT_DETAILED_CHORD_STATS },
        interval: { ...DEFAULT_DETAILED_INTERVAL_STATS },
        progression: { ...DEFAULT_DETAILED_PROGRESSION_STATS },
        sessionHistory: {},
      };

      const time = getTotalTrainingTime(stats);

      expect(time.totalMilliseconds).toBe(0);
      expect(time.totalSeconds).toBe(0);
      expect(time.totalMinutes).toBe(0);
      expect(time.totalHours).toBe(0);
      expect(time.formatted).toBe('0m');
    });

    it('should handle sessions without duration', () => {
      const stats: DetailedLifetimeStats = {
        chord: { ...DEFAULT_DETAILED_CHORD_STATS },
        interval: { ...DEFAULT_DETAILED_INTERVAL_STATS },
        progression: { ...DEFAULT_DETAILED_PROGRESSION_STATS },
        sessionHistory: {
          'session-1': {
            sessionId: 'session-1',
            mode: 'chord',
            correctAnswers: 5,
            totalQuestions: 10,
            accuracy: 50,
            timestamp: Date.now(),
            answers: [],
            config: { guestMode: false, numQuestions: 10 },
            // No duration property
          } as any,
        },
      };

      const time = getTotalTrainingTime(stats);

      expect(time.totalMilliseconds).toBe(0);
    });
  });

  describe('getAverageTimePerQuestion', () => {
    it('should calculate average time per question correctly', () => {
      const stats: DetailedLifetimeStats = {
        chord: {
          ...DEFAULT_DETAILED_CHORD_STATS,
          totalQuestions: 10,
        },
        interval: {
          ...DEFAULT_DETAILED_INTERVAL_STATS,
          totalQuestions: 10,
        },
        progression: {
          ...DEFAULT_DETAILED_PROGRESSION_STATS,
          totalQuestions: 0,
        },
        sessionHistory: {
          'session-1': {
            sessionId: 'session-1',
            mode: 'chord',
            correctAnswers: 5,
            totalQuestions: 10,
            accuracy: 50,
            timestamp: Date.now(),
            answers: [],
            config: { guestMode: false, numQuestions: 10 },
            duration: 100000, // 100 seconds
          },
          'session-2': {
            sessionId: 'session-2',
            mode: 'interval',
            correctAnswers: 8,
            totalQuestions: 10,
            accuracy: 80,
            timestamp: Date.now(),
            answers: [],
            config: { guestMode: false, numQuestions: 10 },
            duration: 100000, // 100 seconds
          },
        },
      };

      const avgTime = getAverageTimePerQuestion(stats);

      // Total time: 200 seconds, Total questions: 20
      // Average: 200/20 = 10 seconds per question
      expect(avgTime.milliseconds).toBe(10000);
      expect(avgTime.seconds).toBe(10);
    });

    it('should handle zero questions gracefully', () => {
      const stats: DetailedLifetimeStats = {
        chord: { ...DEFAULT_DETAILED_CHORD_STATS },
        interval: { ...DEFAULT_DETAILED_INTERVAL_STATS },
        progression: { ...DEFAULT_DETAILED_PROGRESSION_STATS },
        sessionHistory: {},
      };

      const avgTime = getAverageTimePerQuestion(stats);

      expect(avgTime.milliseconds).toBe(0);
      expect(avgTime.seconds).toBe(0);
      expect(avgTime.formatted).toBe('0s');
    });
  });
});
