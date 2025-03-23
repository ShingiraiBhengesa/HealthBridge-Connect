
import { useState, useEffect } from 'react';
import { Wifi, WifiOff, AlertTriangle } from 'lucide-react';
import { addNetworkListeners, detectLowBandwidth } from '@/utils/networkUtils';
import { toast } from '@/components/ui/use-toast';

export function NetworkStatus() {
  const [isOnline, setIsOnline] = useState<boolean>(navigator.onLine);
  const [isLowBandwidth, setIsLowBandwidth] = useState<boolean>(false);

  useEffect(() => {
    const handleOnline = () => {
      setIsOnline(true);
      toast({
        title: 'You are online',
        description: 'Your data will now sync with the server',
        duration: 3000,
      });
    };

    const handleOffline = () => {
      setIsOnline(false);
      toast({
        title: 'You are offline',
        description: 'The app will continue to work, your data will sync when you reconnect',
        duration: 5000,
      });
    };

    // Check bandwidth on mount and when network status changes
    const checkBandwidth = async () => {
      const lowBandwidth = await detectLowBandwidth();
      setIsLowBandwidth(lowBandwidth);
      
      if (lowBandwidth && isOnline) {
        toast({
          title: 'Low bandwidth detected',
          description: 'The app will minimize data usage',
          duration: 5000,
        });
      }
    };

    // Initial bandwidth check
    checkBandwidth();

    // Add network listeners
    const cleanup = addNetworkListeners(() => {
      handleOnline();
      checkBandwidth();
    }, handleOffline);

    return cleanup;
  }, []);

  if (!isOnline) {
    return (
      <div className="fixed bottom-4 right-4 z-50 flex items-center gap-2 bg-amber-100 dark:bg-amber-950 text-amber-800 dark:text-amber-200 px-3 py-2 rounded-full shadow-lg animate-pulse">
        <WifiOff size={16} />
        <span className="text-xs font-medium">Offline Mode</span>
      </div>
    );
  }

  if (isLowBandwidth) {
    return (
      <div className="fixed bottom-4 right-4 z-50 flex items-center gap-2 bg-blue-100 dark:bg-blue-950 text-blue-800 dark:text-blue-200 px-3 py-2 rounded-full shadow-lg">
        <AlertTriangle size={16} />
        <span className="text-xs font-medium">Low Bandwidth</span>
      </div>
    );
  }

  return (
    <div className="fixed bottom-4 right-4 z-50 flex items-center gap-2 bg-green-100 dark:bg-green-950 text-green-800 dark:text-green-200 px-3 py-2 rounded-full shadow-lg opacity-80 hover:opacity-100 transition-opacity">
      <Wifi size={16} />
      <span className="text-xs font-medium">Online</span>
    </div>
  );
}
