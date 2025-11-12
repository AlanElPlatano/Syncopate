import { createContext, useContext, useState, ReactNode } from 'react';
import { Screen, Mode, ModeConfig } from '../types/screens';

interface AppContextType {
  currentScreen: Screen;
  currentMode: Mode | null;
  sessionConfig: ModeConfig | null;

  goToMenu: () => void;
  goToConfig: (mode: Mode) => void;
  goToTraining: (config: ModeConfig) => void;
  goToStats: () => void;
}

export interface SessionResults {
  mode: Mode;
  correctAnswers: number;
  totalQuestions: number;
  accuracy: number;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within AppProvider');
  }
  return context;
};

interface AppProviderProps {
  children: ReactNode;
}

export const AppProvider = ({ children }: AppProviderProps) => {
  const [currentScreen, setCurrentScreen] = useState<Screen>('menu');
  const [currentMode, setCurrentMode] = useState<Mode | null>(null);
  const [sessionConfig, setSessionConfig] = useState<ModeConfig | null>(null);

  const goToMenu = () => {
    setCurrentScreen('menu');
    setCurrentMode(null);
    setSessionConfig(null);
  };

  const goToConfig = (mode: Mode) => {
    setCurrentMode(mode);
    setCurrentScreen('config');
  };

  const goToTraining = (config: ModeConfig) => {
    setSessionConfig(config);
    setCurrentScreen('training');
  };

  const goToStats = () => {
    setCurrentScreen('stats');
  };

  const value: AppContextType = {
    currentScreen,
    currentMode,
    sessionConfig,
    goToMenu,
    goToConfig,
    goToTraining,
    goToStats,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};
