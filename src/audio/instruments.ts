import * as Tone from 'tone';

export type InstrumentType = 'piano' | 'guitar';

export interface Instrument {
  playNote(note: string, duration?: string, startTime?: number): void;
  playChord(notes: string[], duration?: string, startTime?: number): void;
  dispose(): Promise<void>;
}

export class PianoInstrument implements Instrument {
  private synth: Tone.PolySynth;

  constructor() {
    this.synth = new Tone.PolySynth(Tone.Synth, {
      oscillator: {
        type: 'sine',
      },
      envelope: {
        attack: 0.005,
        decay: 0.3,
        sustain: 0.4,
        release: 1.2,
      },
      volume: -8,
    }).toDestination();
  }

  playNote(note: string, duration = '1n', startTime?: number): void {
    this.synth.triggerAttackRelease(note, duration, startTime);
  }

  playChord(notes: string[], duration = '1n', startTime?: number): void {
    this.synth.triggerAttackRelease(notes, duration, startTime);
  }

  async dispose(): Promise<void> {
    // Gracefully release all active notes
    this.synth.releaseAll();

    // Ramp down volume to prevent clicks
    this.synth.volume.rampTo(-60, 0.1);

    // Wait for release envelope to complete (release time is 1.2s)
    // Adding extra 100ms for volume ramp
    await new Promise(resolve => setTimeout(resolve, 1300));

    // Now safely dispose
    this.synth.dispose();
  }
}

export class GuitarInstrument implements Instrument {
  private synth: Tone.PolySynth;

  constructor() {
    // Using FMSynth for guitar-like plucked sound (PluckSynth can't be used with PolySynth)
    this.synth = new Tone.PolySynth(Tone.FMSynth, {
      harmonicity: 2,
      modulationIndex: 20,
      oscillator: {
        type: 'triangle',
      },
      envelope: {
        attack: 0.005,
        decay: 0.3,
        sustain: 0.1,
        release: 0.8,
      },
      modulation: {
        type: 'square',
      },
      modulationEnvelope: {
        attack: 0.01,
        decay: 0.2,
        sustain: 0,
        release: 0.2,
      },
      volume: -5,
    }).toDestination();
  }

  playNote(note: string, duration = '1n', startTime?: number): void {
    this.synth.triggerAttackRelease(note, duration, startTime);
  }

  playChord(notes: string[], duration = '1n', startTime?: number): void {
    // For guitar, play notes slightly staggered for more realistic strum
    const strumDelay = 0.02; // 20ms between notes
    notes.forEach((note, index) => {
      const time = startTime !== undefined ? startTime + (index * strumDelay) : `+${index * strumDelay}`;
      this.synth.triggerAttackRelease(note, duration, time);
    });
  }

  async dispose(): Promise<void> {
    // Gracefully release all active notes
    this.synth.releaseAll();

    // Ramp down volume to prevent clicks
    this.synth.volume.rampTo(-60, 0.1);

    // Wait for release envelope to complete (release time is 0.8s)
    // Adding extra 100ms for volume ramp
    await new Promise(resolve => setTimeout(resolve, 900));

    // Now safely dispose
    this.synth.dispose();
  }
}

export function createInstrument(type: InstrumentType): Instrument {
  switch (type) {
    case 'piano':
      return new PianoInstrument();
    case 'guitar':
      return new GuitarInstrument();
    default:
      throw new Error(`Unknown instrument type: ${type}`);
  }
}