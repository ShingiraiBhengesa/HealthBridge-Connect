
import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { StorageKeys, getData, setData } from '@/utils/storageUtils';
import { useNetworkSync } from '@/hooks/use-network-sync';
import { useAuth } from '@/hooks/use-auth';
import { useLocation } from 'react-router-dom';

// Define the NetworkInformation interface
interface NetworkInformation {
  downlink?: number;
  effectiveType?: string;
  rtt?: number;
  saveData?: boolean;
  type?: string;
}

// Extend Navigator interface
interface NavigatorWithConnection extends Navigator {
  connection?: NetworkInformation;
  mozConnection?: NetworkInformation;
  webkitConnection?: NetworkInformation;
}

interface AppState {
  language: string;
  setLanguage: (lang: string) => void;
  isLowBandwidth: boolean;
  isFirstVisit: boolean;
  setFirstVisitComplete: () => void;
  networkSync: ReturnType<typeof useNetworkSync>;
}

const AppStateContext = createContext<AppState | undefined>(undefined);

interface AppStateProviderProps {
  children: ReactNode;
}

export const AppStateProvider = ({ children }: AppStateProviderProps) => {
  const [language, setLanguageState] = useState<string>('en');
  const [isLowBandwidth, setIsLowBandwidth] = useState<boolean>(false);
  const [isFirstVisit, setIsFirstVisit] = useState<boolean>(true);
  const networkSync = useNetworkSync();
  const { isAuthenticated } = useAuth();
  const location = useLocation();

  // Initialize app state
  useEffect(() => {
    // Load language preference
    const savedLanguage = getData<string>(StorageKeys.APP_LANGUAGE);
    if (savedLanguage) {
      setLanguageState(savedLanguage);
    }

    // Check if first visit
    const hasVisitedBefore = localStorage.getItem('hasVisitedBefore');
    if (hasVisitedBefore) {
      setIsFirstVisit(false);
    }

    // Check if on low-bandwidth using the extended navigator
    const nav = navigator as NavigatorWithConnection;
    const connection = nav.connection || nav.mozConnection || nav.webkitConnection;
    
    if (connection) {
      if (connection.downlink && connection.downlink < 0.5) {
        setIsLowBandwidth(true);
      } else if (connection.effectiveType && ['slow-2g', '2g'].includes(connection.effectiveType)) {
        setIsLowBandwidth(true);
      }
    }
  }, []);

  // Mark first visit complete if user authenticates or visits certain pages
  useEffect(() => {
    if (isAuthenticated || ['/login', '/register', '/patient-profile', '/health-worker'].includes(location.pathname)) {
      setFirstVisitComplete();
    }
  }, [isAuthenticated, location.pathname]);

  const setLanguage = (lang: string) => {
    setLanguageState(lang);
    setData(StorageKeys.APP_LANGUAGE, lang);
  };

  const setFirstVisitComplete = () => {
    setIsFirstVisit(false);
    localStorage.setItem('hasVisitedBefore', 'true');
  };

  return (
    <AppStateContext.Provider
      value={{
        language,
        setLanguage,
        isLowBandwidth,
        isFirstVisit,
        setFirstVisitComplete,
        networkSync
      }}
    >
      {children}
    </AppStateContext.Provider>
  );
};

export const useAppState = () => {
  const context = useContext(AppStateContext);
  if (context === undefined) {
    throw new Error('useAppState must be used within an AppStateProvider');
  }
  return context;
};
