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

  setInstrument(type: InstrumentType): void {
    if (type === this.instrumentType) return;

    this.currentInstrument.dispose();
    this.instrumentType = type;
    this.currentInstrument = createInstrument(type);
  }

  getInstrumentType(): InstrumentType {
    return this.instrumentType;
  }

  playNote(note: string, duration = '1n'): void {
    if (!this.initialized) {
      console.warn('Audio engine not initialized. Call initialize() first.');
      return;
    }
    this.currentInstrument.playNote(note, duration);
  }

  playChord(notes: string[], duration = '1n'): void {
    if (!this.initialized) {
      console.warn('Audio engine not initialized. Call initialize() first.');
      return;
    }
    this.currentInstrument.playChord(notes, duration);
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
      this.currentInstrument.playNote(first, duration);

      // Wait for first note before playing second
      await new Promise(resolve => setTimeout(resolve, Tone.Time(duration).toMilliseconds()));
      this.currentInstrument.playNote(second, duration);
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

    for (const chord of chords) {
      this.currentInstrument.playChord(chord, noteDuration);
      await new Promise(resolve =>
        setTimeout(resolve, Tone.Time(noteDuration).toMilliseconds())
      );
    }

    Tone.Transport.bpm.value = oldBpm;
  }

  dispose(): void {
    this.currentInstrument.dispose();
  }
}
