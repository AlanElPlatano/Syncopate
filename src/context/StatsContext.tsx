import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { LifetimeStats, SessionStats } from '../types/stats';
import {
  loadLifetimeStats,
  saveLifetimeStats,
  updateStatsWithSession,
  clearLifetimeStats,
} from '../utils/storage';

interface StatsContextType {
  lifetimeStats: LifetimeStats;
  currentSessionStats: SessionStats | null;
  recordSession: (sessionStats: SessionStats, isGuestMode: boolean) => void;
  clearStats: () => void;
}

const StatsContext = createContext<StatsContextType | undefined>(undefined);

export const useStats = () => {
  const context = useContext(StatsContext);
  if (!context) {
    throw new Error('useStats must be used within StatsProvider');
  }
  return context;
};

interface StatsProviderProps {
  children: ReactNode;
}

export const StatsProvider = ({ children }: StatsProviderProps) => {
  const [lifetimeStats, setLifetimeStats] = useState<LifetimeStats>(() =>
    loadLifetimeStats()
  );
  const [currentSessionStats, setCurrentSessionStats] = useState<SessionStats | null>(null);

  const recordSession = (sessionStats: SessionStats, isGuestMode: boolean) => {
    // Always store current session stats for display
    setCurrentSessionStats(sessionStats);

    // Only save to localStorage if NOT in guest mode
    if (!isGuestMode) {
      const updatedStats = updateStatsWithSession(lifetimeStats, sessionStats);
      setLifetimeStats(updatedStats);
      saveLifetimeStats(updatedStats);
    }
  };

  const clearStats = () => {
    const freshStats = loadLifetimeStats();
    setLifetimeStats(freshStats);
    clearLifetimeStats();
    setCurrentSessionStats(null);
  };

  // Load stats on mount
  useEffect(() => {
    const stats = loadLifetimeStats();
    setLifetimeStats(stats);
  }, []);

  const value: StatsContextType = {
    lifetimeStats,
    currentSessionStats,
    recordSession,
    clearStats,
  };

  return <StatsContext.Provider value={value}>{children}</StatsContext.Provider>;
};
