import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Screen, Mode, ModeConfig } from '../types/screens';

export type FontSize = 'small' | 'medium' | 'large' | 'extra-large';

interface AppContextType {
  currentScreen: Screen;
  currentMode: Mode | null;
  sessionConfig: ModeConfig | null;
  devInsightsEnabled: boolean;

  // Accessibility features
  highContrastMode: boolean;
  fontSize: FontSize;
  toggleHighContrast: () => void;
  setFontSize: (size: FontSize) => void;

  goToMenu: () => void;
  goToConfig: (mode: Mode) => void;
  goToTraining: (config: ModeConfig) => void;
  goToStats: () => void;
  goToDashboard: () => void;
  goToAccessibility: () => void;
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

  // Accessibility settings (persisted to localStorage)
  const [highContrastMode, setHighContrastMode] = useState<boolean>(() => {
    const saved = localStorage.getItem('accessibility_highContrast');
    return saved === 'true';
  });

  const [fontSize, setFontSizeState] = useState<FontSize>(() => {
    const saved = localStorage.getItem('accessibility_fontSize');
    return (saved as FontSize) || 'medium';
  });

  // Persist accessibility settings
  useEffect(() => {
    localStorage.setItem('accessibility_highContrast', String(highContrastMode));
  }, [highContrastMode]);

  useEffect(() => {
    localStorage.setItem('accessibility_fontSize', fontSize);
  }, [fontSize]);

  const toggleHighContrast = () => {
    setHighContrastMode((prev) => !prev);
  };

  const setFontSize = (size: FontSize) => {
    setFontSizeState(size);
  };

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

  const goToAccessibility = () => {
    setCurrentScreen('accessibility');
    // Reset dev insights when viewing accessibility settings
    setDevInsightsEnabled(false);
  };

  const value: AppContextType = {
    currentScreen,
    currentMode,
    sessionConfig,
    devInsightsEnabled,
    highContrastMode,
    fontSize,
    toggleHighContrast,
    setFontSize,
    goToMenu,
    goToConfig,
    goToTraining,
    goToStats,
    goToDashboard,
    goToAccessibility,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};