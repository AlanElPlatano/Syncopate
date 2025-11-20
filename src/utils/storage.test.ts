import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import {
  loadDetailedLifetimeStats,
  saveDetailedLifetimeStats,
  generateSessionId,
  clearDetailedLifetimeStats,
} from './storage';
import {
  DetailedLifetimeStats,
  DEFAULT_DETAILED_CHORD_STATS,
  DEFAULT_DETAILED_INTERVAL_STATS,
  DEFAULT_DETAILED_PROGRESSION_STATS,
} from '../types/stats';

describe('storage.ts - LocalStorage Operations', () => {
  beforeEach(() => {
    // Clear localStorage before each test
    localStorage.clear();
  });

  afterEach(() => {
    // Clean up after each test
    localStorage.clear();
  });

  describe('loadDetailedLifetimeStats', () => {
    it('should return default stats when localStorage is empty', () => {
      const stats = loadDetailedLifetimeStats();

      expect(stats).toMatchObject({
        chord: expect.any(Object),
        interval: expect.any(Object),
        progression: expect.any(Object),
        sessionHistory: {},
      });
      expect(stats.chord.totalSessions).toBe(0);
      expect(stats.interval.totalSessions).toBe(0);
    });

    it('should load saved stats correctly', () => {
      const testStats: DetailedLifetimeStats = {
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
        },
        sessionHistory: {},
      };

      localStorage.setItem('eargym_detailed_stats', JSON.stringify(testStats));

      const loaded = loadDetailedLifetimeStats();

      expect(loaded.chord.totalSessions).toBe(5);
      expect(loaded.chord.totalQuestions).toBe(50);
      expect(loaded.chord.totalCorrect).toBe(40);
      expect(loaded.interval.totalSessions).toBe(3);
    });

    it('should handle corrupted data gracefully', () => {
      localStorage.setItem('eargym_detailed_stats', 'invalid-json{{{');

      const stats = loadDetailedLifetimeStats();

      // Should return default stats on error
      expect(stats.chord.totalSessions).toBe(0);
      expect(stats.interval.totalSessions).toBe(0);
      expect(stats.progression.totalSessions).toBe(0);
    });

    it('should handle null localStorage gracefully', () => {
      // Simulate localStorage error
      const getItemSpy = vi.spyOn(Storage.prototype, 'getItem');
      getItemSpy.mockImplementation(() => {
        throw new Error('localStorage error');
      });

      const stats = loadDetailedLifetimeStats();

      // Should return default stats on error
      expect(stats.chord.totalSessions).toBe(0);
      expect(stats.interval.totalSessions).toBe(0);
      expect(stats.progression.totalSessions).toBe(0);

      getItemSpy.mockRestore();
    });

    it('should migrate old stats format if present', () => {
      const oldStats = {
        chord: {
          totalCorrect: 10,
          totalQuestions: 15,
          accuracy: 67,
          lastPlayed: Date.now(),
        },
        interval: {
          totalCorrect: 5,
          totalQuestions: 10,
          accuracy: 50,
          lastPlayed: Date.now(),
        },
        progression: {
          totalCorrect: 0,
          totalQuestions: 0,
          accuracy: 0,
          lastPlayed: 0,
        },
      };

      localStorage.setItem('eargym_lifetime_stats', JSON.stringify(oldStats));

      const loaded = loadDetailedLifetimeStats();

      // Should have migrated data
      expect(loaded.chord.totalQuestions).toBeGreaterThan(0);
    });
  });

  describe('saveDetailedLifetimeStats', () => {
    it('should save stats to localStorage correctly', () => {
      const testStats: DetailedLifetimeStats = {
        chord: {
          ...DEFAULT_DETAILED_CHORD_STATS,
          totalSessions: 5,
          totalQuestions: 50,
          totalCorrect: 40,
          overallAccuracy: 80,
        },
        interval: {
          ...DEFAULT_DETAILED_INTERVAL_STATS,
        },
        progression: {
          ...DEFAULT_DETAILED_PROGRESSION_STATS,
        },
        sessionHistory: {},
      };

      saveDetailedLifetimeStats(testStats);

      const saved = localStorage.getItem('eargym_detailed_stats');
      expect(saved).toBeTruthy();

      const parsed = JSON.parse(saved!);
      expect(parsed.chord.totalSessions).toBe(5);
      expect(parsed.chord.totalQuestions).toBe(50);
      expect(parsed.chord.totalCorrect).toBe(40);
    });

    it('should handle save errors gracefully', () => {
      // Mock localStorage.setItem to throw error (e.g., quota exceeded)
      const setItemSpy = vi.spyOn(Storage.prototype, 'setItem');
      setItemSpy.mockImplementation(() => {
        throw new Error('QuotaExceededError');
      });

      const testStats: DetailedLifetimeStats = {
        chord: { ...DEFAULT_DETAILED_CHORD_STATS },
        interval: { ...DEFAULT_DETAILED_INTERVAL_STATS },
        progression: { ...DEFAULT_DETAILED_PROGRESSION_STATS },
        sessionHistory: {},
      };

      // Should not throw error
      expect(() => saveDetailedLifetimeStats(testStats)).not.toThrow();

      setItemSpy.mockRestore();
    });

    it('should limit session history to maximum size', () => {
      const testStats: DetailedLifetimeStats = {
        chord: { ...DEFAULT_DETAILED_CHORD_STATS },
        interval: { ...DEFAULT_DETAILED_INTERVAL_STATS },
        progression: { ...DEFAULT_DETAILED_PROGRESSION_STATS },
        sessionHistory: {},
      };

      // Create 250 sessions (more than MAX_SESSIONS_IN_HISTORY which is 200)
      for (let i = 0; i < 250; i++) {
        testStats.sessionHistory[`session-${i}`] = {
          sessionId: `session-${i}`,
          mode: 'chord',
          correctAnswers: 5,
          totalQuestions: 10,
          accuracy: 50,
          timestamp: Date.now() + i, // Different timestamps
          answers: [],
          config: { guestMode: false, numQuestions: 10 },
        };
      }

      saveDetailedLifetimeStats(testStats);

      const saved = localStorage.getItem('eargym_detailed_stats');
      const parsed = JSON.parse(saved!);

      // Should have pruned to 200 sessions
      expect(Object.keys(parsed.sessionHistory).length).toBeLessThanOrEqual(200);
    });
  });

  describe('clearDetailedLifetimeStats', () => {
    it('should clear stats from localStorage', () => {
      const testStats: DetailedLifetimeStats = {
        chord: {
          ...DEFAULT_DETAILED_CHORD_STATS,
          totalSessions: 5,
        },
        interval: { ...DEFAULT_DETAILED_INTERVAL_STATS },
        progression: { ...DEFAULT_DETAILED_PROGRESSION_STATS },
        sessionHistory: {},
      };

      localStorage.setItem('eargym_detailed_stats', JSON.stringify(testStats));
      expect(localStorage.getItem('eargym_detailed_stats')).toBeTruthy();

      clearDetailedLifetimeStats();

      expect(localStorage.getItem('eargym_detailed_stats')).toBeNull();
    });
  });

  describe('generateSessionId', () => {
    it('should generate a valid session ID', () => {
      const sessionId = generateSessionId();

      expect(sessionId).toMatch(/^session_\d+_[a-z0-9]+$/);
    });

    it('should generate unique session IDs', () => {
      const ids = new Set<string>();

      for (let i = 0; i < 100; i++) {
        const id = generateSessionId();
        ids.add(id);
      }

      // All IDs should be unique
      expect(ids.size).toBe(100);
    });

    it('should include timestamp in session ID', () => {
      const beforeTime = Date.now();
      const sessionId = generateSessionId();
      const afterTime = Date.now();

      // Extract timestamp from ID
      const timestampStr = sessionId.split('_')[1];
      const timestamp = parseInt(timestampStr);

      expect(timestamp).toBeGreaterThanOrEqual(beforeTime);
      expect(timestamp).toBeLessThanOrEqual(afterTime);
    });

    it('should generate different IDs when called multiple times quickly', () => {
      const id1 = generateSessionId();
      const id2 = generateSessionId();
      const id3 = generateSessionId();

      expect(id1).not.toBe(id2);
      expect(id2).not.toBe(id3);
      expect(id1).not.toBe(id3);
    });
  });
});
