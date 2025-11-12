import { createContext, useContext, useState, useEffect, ReactNode, useRef } from 'react';
import { AudioEngine } from '../audio/AudioEngine';
import { InstrumentType } from '../audio/instruments';

interface AudioContextType {
  audioEngine: AudioEngine | null;
  currentInstrument: InstrumentType;
  isInitialized: boolean;
  initializeAudio: () => Promise<void>;
  setInstrument: (instrument: InstrumentType) => void;
  toggleInstrument: () => void;
}

const AudioContext = createContext<AudioContextType | undefined>(undefined);

export const useAudio = () => {
  const context = useContext(AudioContext);
  if (!context) {
    throw new Error('useAudio must be used within AudioProvider');
  }
  return context;
};

interface AudioProviderProps {
  children: ReactNode;
}

export const AudioProvider = ({ children }: AudioProviderProps) => {
  const [currentInstrument, setCurrentInstrument] = useState<InstrumentType>('piano');
  const [isInitialized, setIsInitialized] = useState(false);
  const audioEngineRef = useRef<AudioEngine | null>(null);

  useEffect(() => {
    // Create audio engine instance
    audioEngineRef.current = new AudioEngine('piano');

    // Cleanup on unmount
    return () => {
      if (audioEngineRef.current) {
        audioEngineRef.current.dispose();
      }
    };
  }, []);

  const initializeAudio = async () => {
    if (!audioEngineRef.current) return;

    try {
      await audioEngineRef.current.initialize();
      setIsInitialized(true);
    } catch (error) {
      console.error('Failed to initialize audio:', error);
    }
  };

  const setInstrument = (instrument: InstrumentType) => {
    if (!audioEngineRef.current) return;

    audioEngineRef.current.setInstrument(instrument);
    setCurrentInstrument(instrument);
  };

  const toggleInstrument = () => {
    const newInstrument: InstrumentType = currentInstrument === 'piano' ? 'guitar' : 'piano';
    setInstrument(newInstrument);
  };

  const value: AudioContextType = {
    audioEngine: audioEngineRef.current,
    currentInstrument,
    isInitialized,
    initializeAudio,
    setInstrument,
    toggleInstrument,
  };

  return <AudioContext.Provider value={value}>{children}</AudioContext.Provider>;
};
