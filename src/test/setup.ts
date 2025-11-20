import '@testing-library/jest-dom';
import { expect, afterEach, vi } from 'vitest';
import { cleanup } from '@testing-library/react';

// Cleanup after each test
afterEach(() => {
  cleanup();
});

// Mock Tone.js to avoid Web Audio API issues in tests
vi.mock('tone', () => ({
  Sampler: vi.fn().mockImplementation(() => ({
    toDestination: vi.fn().mockReturnThis(),
    triggerAttackRelease: vi.fn(),
    loaded: vi.fn().mockResolvedValue(true),
    dispose: vi.fn(),
  })),
  start: vi.fn().mockResolvedValue(undefined),
  Transport: {
    start: vi.fn(),
    stop: vi.fn(),
    scheduleRepeat: vi.fn(),
    clear: vi.fn(),
  },
  Part: vi.fn().mockImplementation(() => ({
    start: vi.fn(),
    stop: vi.fn(),
    dispose: vi.fn(),
  })),
  Time: vi.fn().mockImplementation((value) => ({
    toSeconds: () => parseFloat(value),
  })),
}));
