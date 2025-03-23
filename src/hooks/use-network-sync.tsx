
import { useState, useEffect } from 'react';
import { processSyncQueue, StorageKeys, getData, setData } from '@/utils/storageUtils';
import { isOnline, addNetworkListeners } from '@/utils/networkUtils';
import { useToast } from '@/hooks/use-toast';

interface NetworkSyncState {
  isOnline: boolean;
  lastSyncTime: number | null;
  isSyncing: boolean;
  syncError: string | null;
  pendingSyncCount: number;
  triggerSync: () => Promise<void>;
}

export function useNetworkSync(): NetworkSyncState {
  const [networkState, setNetworkState] = useState<boolean>(isOnline());
  const [lastSyncTime, setLastSyncTime] = useState<number | null>(null);
  const [isSyncing, setIsSyncing] = useState<boolean>(false);
  const [syncError, setSyncError] = useState<string | null>(null);
  const [pendingSyncCount, setPendingSyncCount] = useState<number>(0);
  const { toast } = useToast();

  // Load last sync time
  useEffect(() => {
    const lastSync = getData<number>(StorageKeys.LAST_SYNC);
    if (lastSync) {
      setLastSyncTime(lastSync);
    }
    
    // Count pending sync items
    const syncQueue = getData<any[]>(StorageKeys.SYNC_QUEUE) || [];
    const pendingItems = syncQueue.filter(item => 
      item.syncStatus === 'pending' || 
      (item.syncStatus === 'failed' && item.retryCount < 3)
    );
    setPendingSyncCount(pendingItems.length);
  }, []);

  // Set up network listeners
  useEffect(() => {
    const handleOnline = () => {
      setNetworkState(true);
      toast({
        title: 'Online',
        description: pendingSyncCount > 0 
          ? `Syncing ${pendingSyncCount} pending items...` 
          : 'Connected to the network',
        duration: 3000,
      });
      
      // Auto-sync when coming online
      triggerSync();
    };

    const handleOffline = () => {
      setNetworkState(false);
      toast({
        title: 'Offline',
        description: 'The app will continue to work. Your changes will be saved locally.',
        duration: 5000,
      });
    };

    return addNetworkListeners(handleOnline, handleOffline);
  }, [pendingSyncCount, toast]);

  // Function to trigger sync
  const triggerSync = async () => {
    if (!networkState || isSyncing) return;
    
    try {
      setIsSyncing(true);
      setSyncError(null);
      
      await processSyncQueue();
      
      // Update last sync time
      const now = Date.now();
      setData(StorageKeys.LAST_SYNC, now);
      setLastSyncTime(now);
      
      // Recount pending items
      const syncQueue = getData<any[]>(StorageKeys.SYNC_QUEUE) || [];
      const pendingItems = syncQueue.filter(item => 
        item.syncStatus === 'pending' || 
        (item.syncStatus === 'failed' && item.retryCount < 3)
      );
      setPendingSyncCount(pendingItems.length);
      
      if (pendingItems.length === 0) {
        toast({
          title: 'Sync Complete',
          description: 'All data has been successfully synchronized',
          duration: 3000,
        });
      } else {
        toast({
          title: 'Sync Incomplete',
          description: `${pendingItems.length} items still pending synchronization`,
          duration: 3000,
        });
      }
    } catch (error) {
      console.error('Sync error:', error);
      setSyncError('Failed to synchronize data. Please try again later.');
      toast({
        title: 'Sync Failed',
        description: 'There was an error synchronizing your data',
        variant: 'destructive',
        duration: 5000,
      });
    } finally {
      setIsSyncing(false);
    }
  };

  return {
    isOnline: networkState,
    lastSyncTime,
    isSyncing,
    syncError,
    pendingSyncCount,
    triggerSync
  };
}
