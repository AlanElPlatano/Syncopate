import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import {
  LifetimeStats,
  SessionStats,
  DetailedLifetimeStats,
  DetailedSessionStats,
} from '../types/stats';
import {
  loadLifetimeStats,
  saveLifetimeStats,
  updateStatsWithSession,
  clearLifetimeStats,
  loadDetailedLifetimeStats,
  saveDetailedLifetimeStats,
  updateDetailedStatsWithSession,
  clearDetailedLifetimeStats,
} from '../utils/storage';

interface StatsContextType {
  lifetimeStats: LifetimeStats;
  currentSessionStats: SessionStats | null;
  recordSession: (sessionStats: SessionStats, isGuestMode: boolean) => void;
  clearStats: () => void;
  // New detailed tracking
  detailedStats: DetailedLifetimeStats;
  recordDetailedSession: (sessionStats: DetailedSessionStats, isGuestMode: boolean) => void;
  clearDetailedStats: () => void;
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

  // New detailed stats state
  const [detailedStats, setDetailedStats] = useState<DetailedLifetimeStats>(() =>
    loadDetailedLifetimeStats()
  );

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

  const recordDetailedSession = (sessionStats: DetailedSessionStats, isGuestMode: boolean) => {
    // Always store current session stats for display
    setCurrentSessionStats(sessionStats);

    // Only save to localStorage if NOT in guest mode
    if (!isGuestMode) {
      const updatedStats = updateDetailedStatsWithSession(detailedStats, sessionStats);
      setDetailedStats(updatedStats);
      saveDetailedLifetimeStats(updatedStats);
    }
  };

  const clearStats = () => {
    const freshStats = loadLifetimeStats();
    setLifetimeStats(freshStats);
    clearLifetimeStats();
    setCurrentSessionStats(null);
  };

  const clearDetailedStats = () => {
    const freshStats = loadDetailedLifetimeStats();
    setDetailedStats(freshStats);
    clearDetailedLifetimeStats();
    setCurrentSessionStats(null);
  };

  // Load stats on mount
  useEffect(() => {
    const stats = loadLifetimeStats();
    setLifetimeStats(stats);

    const detailed = loadDetailedLifetimeStats();
    setDetailedStats(detailed);
  }, []);

  const value: StatsContextType = {
    lifetimeStats,
    currentSessionStats,
    recordSession,
    clearStats,
    detailedStats,
    recordDetailedSession,
    clearDetailedStats,
  };

  return <StatsContext.Provider value={value}>{children}</StatsContext.Provider>;
};
