
/**
 * Network utility functions for handling offline-first capabilities
 */

// Check if currently online
export const isOnline = (): boolean => {
  return navigator.onLine;
};

// Event listeners for online/offline status
export const addNetworkListeners = (
  onlineCallback: () => void,
  offlineCallback: () => void
): () => void => {
  window.addEventListener('online', onlineCallback);
  window.addEventListener('offline', offlineCallback);

  // Return a cleanup function
  return () => {
    window.removeEventListener('online', onlineCallback);
    window.removeEventListener('offline', offlineCallback);
  };
};

// Define an interface for the NetworkInformation API
interface NetworkInformation {
  downlink?: number;
  effectiveType?: string;
  rtt?: number;
  saveData?: boolean;
  type?: string;
}

// Extend Navigator interface to include connection property
interface NavigatorWithConnection extends Navigator {
  connection?: NetworkInformation;
  mozConnection?: NetworkInformation;
  webkitConnection?: NetworkInformation;
}

// Detect low bandwidth
export const detectLowBandwidth = async (): Promise<boolean> => {
  const nav = navigator as NavigatorWithConnection;
  const connection = nav.connection || nav.mozConnection || nav.webkitConnection;

  if (!connection) {
    // Connection API not available
    return false;
  }
  
  // If downlink information is available
  if (connection.downlink) {
    // Less than 0.5 Mbps is considered low bandwidth
    return connection.downlink < 0.5;
  }
  
  // If effectiveType information is available
  if (connection.effectiveType) {
    // 2G or worse is considered low bandwidth
    return ['slow-2g', '2g'].includes(connection.effectiveType);
  }
  
  return false;
};

// Simulate a network request with timeout control
export const fetchWithTimeout = async (
  url: string,
  options: RequestInit = {},
  timeoutMs: number = 10000
): Promise<Response> => {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), timeoutMs);
  
  try {
    const response = await fetch(url, {
      ...options,
      signal: controller.signal
    });
    clearTimeout(timeout);
    return response;
  } catch (error) {
    clearTimeout(timeout);
    throw error;
  }
};
