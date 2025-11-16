import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Screen, Mode, ModeConfig } from '../types/screens';

interface AppContextType {
  currentScreen: Screen;
  currentMode: Mode | null;
  sessionConfig: ModeConfig | null;
  devInsightsEnabled: boolean;

  goToMenu: () => void;
  goToConfig: (mode: Mode) => void;
  goToTraining: (config: ModeConfig) => void;
  goToStats: () => void;
  goToDashboard: () => void;
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
  // Developer insights mode for UI debugging and visual assistance
  const [devInsightsEnabled, setDevInsightsEnabled] = useState(false);

  // Keyboard shortcut for toggling dev insights
  useEffect(() => {
    const handleKeyPress = (event: KeyboardEvent) => {
      // Toggle on 'z' key press
      if (event.key === 'z' || event.key === 'Z') {
        // Prevent toggle if user is typing in an input field
        const target = event.target as HTMLElement;
        if (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA') {
          return;
        }

        setDevInsightsEnabled((prev) => !prev);
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, []);

  const goToMenu = () => {
    setCurrentScreen('menu');
    setCurrentMode(null);
    setSessionConfig(null);
    // Reset dev insights when returning to menu
    setDevInsightsEnabled(false);
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
    // Reset dev insights when viewing stats
    setDevInsightsEnabled(false);
  };

  const goToDashboard = () => {
    setCurrentScreen('dashboard');
    // Reset dev insights when viewing dashboard
    setDevInsightsEnabled(false);
  };

  const value: AppContextType = {
    currentScreen,
    currentMode,
    sessionConfig,
    devInsightsEnabled,
    goToMenu,
    goToConfig,
    goToTraining,
    goToStats,
    goToDashboard,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};