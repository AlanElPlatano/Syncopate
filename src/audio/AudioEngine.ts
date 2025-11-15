import * as Tone from 'tone';
import { Instrument, InstrumentType, createInstrument } from './instruments';

export class AudioEngine {
  private currentInstrument: Instrument;
  private instrumentType: InstrumentType;
  private initialized: boolean = false;

  constructor(instrumentType: InstrumentType = 'piano') {
    this.instrumentType = instrumentType;
    this.currentInstrument = createInstrument(instrumentType);
  }

  async initialize(): Promise<void> {
    if (this.initialized) return;

    try {
      await Tone.start();
      console.log('Audio engine initialized');
      this.initialized = true;
    } catch (error) {
      console.error('Failed to initialize audio engine:', error);
      throw error;
    }
  }

  isInitialized(): boolean {
    return this.initialized;
  }

  async setInstrument(type: InstrumentType): Promise<void> {
    if (type === this.instrumentType) return;

    await this.currentInstrument.dispose();
    this.instrumentType = type;
    this.currentInstrument = createInstrument(type);
  }

  getInstrumentType(): InstrumentType {
    return this.instrumentType;
  }

  playNote(note: string, duration = '1n', startTime?: number): void {
    if (!this.initialized) {
      console.warn('Audio engine not initialized. Call initialize() first.');
      return;
    }
    this.currentInstrument.playNote(note, duration, startTime);
  }

  playChord(notes: string[], duration = '1n', startTime?: number): void {
    if (!this.initialized) {
      console.warn('Audio engine not initialized. Call initialize() first.');
      return;
    }
    this.currentInstrument.playChord(notes, duration, startTime);
  }

  async playInterval(
    note1: string,
    note2: string,
    direction: 'ascending' | 'descending' | 'harmonic' = 'ascending',
    duration = '1n'
  ): Promise<void> {
    if (!this.initialized) {
      console.warn('Audio engine not initialized. Call initialize() first.');
      return;
    }

    if (direction === 'harmonic') {
      this.currentInstrument.playChord([note1, note2], duration);
    } else {
      const [first, second] = direction === 'ascending' ? [note1, note2] : [note2, note1];
      const now = Tone.now();
      const durationSeconds = Tone.Time(duration).toSeconds();

      this.currentInstrument.playNote(first, duration, now);
      this.currentInstrument.playNote(second, duration, now + durationSeconds);

      // Wait for both notes to finish before resolving
      await new Promise(resolve => setTimeout(resolve, durationSeconds * 2 * 1000));
    }
  }

  async playProgression(
    chords: string[][],
    bpm = 100,
    noteDuration = '2n'
  ): Promise<void> {
    if (!this.initialized) {
      console.warn('Audio engine not initialized. Call initialize() first.');
      return;
    }

    const oldBpm = Tone.Transport.bpm.value;
    Tone.Transport.bpm.value = bpm;

    const now = Tone.now();
    const durationSeconds = Tone.Time(noteDuration).toSeconds();

    chords.forEach((chord, index) => {
      this.currentInstrument.playChord(chord, noteDuration, now + (index * durationSeconds));
    });

    // Wait for all chords to finish
    await new Promise(resolve =>
      setTimeout(resolve, chords.length * durationSeconds * 1000)
    );

    Tone.Transport.bpm.value = oldBpm;
  }

  async dispose(): Promise<void> {
    await this.currentInstrument.dispose();
  }
}