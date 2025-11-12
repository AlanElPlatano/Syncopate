import * as Tone from 'tone';

export type InstrumentType = 'piano' | 'guitar';

export interface Instrument {
  playNote(note: string, duration?: string): void;
  playChord(notes: string[], duration?: string): void;
  dispose(): void;
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

  playNote(note: string, duration = '1n'): void {
    this.synth.triggerAttackRelease(note, duration);
  }

  playChord(notes: string[], duration = '1n'): void {
    this.synth.triggerAttackRelease(notes, duration);
  }

  dispose(): void {
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

  playNote(note: string, duration = '1n'): void {
    this.synth.triggerAttackRelease(note, duration);
  }

  playChord(notes: string[], duration = '1n'): void {
    // For guitar, play notes slightly staggered for more realistic strum
    const strumDelay = 0.02; // 20ms between notes
    notes.forEach((note, index) => {
      this.synth.triggerAttackRelease(note, duration, `+${index * strumDelay}`);
    });
  }

  dispose(): void {
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
