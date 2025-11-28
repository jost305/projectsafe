import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';
import { WalletTracker, WalletEvent, WalletFlow, AlertNotification, Chain } from '../types';
import WalletEventEmitter from './eventEmitter';
import * as trackerService from './walletTracker';

interface WalletTrackerContextType {
  // State
  trackers: WalletTracker[];
  events: WalletEvent[];
  flows: WalletFlow[];
  alerts: AlertNotification[];
  selectedTrackerId: string | null;
  isLoading: boolean;

  // Tracker management
  addTracker: (tracker: WalletTracker) => void;
  removeTracker: (trackerId: string) => void;
  updateTracker: (trackerId: string, updates: Partial<WalletTracker>) => void;

  // Event management
  addEvent: (event: WalletEvent) => void;
  clearEvents: () => void;
  getTrackerEvents: (trackerId: string) => WalletEvent[];

  // Flow management
  addFlow: (flow: WalletFlow) => void;
  getTrackerFlows: (trackerId: string) => WalletFlow[];

  // Alert management
  addAlert: (alert: AlertNotification) => void;
  markAlertAsRead: (alertId: string) => void;
  clearAlerts: () => void;

  // Fetch operations
  fetchTrackerData: (trackerId: string, chain: Chain) => Promise<void>;
  fetchAllTrackerData: () => Promise<void>;

  // Real-time monitoring
  startMonitoring: (trackerId: string) => void;
  stopMonitoring: (trackerId: string) => void;
}

const WalletTrackerContext = createContext<WalletTrackerContextType | undefined>(undefined);

export const WalletTrackerProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [trackers, setTrackers] = useState<WalletTracker[]>([]);
  const [events, setEvents] = useState<WalletEvent[]>([]);
  const [flows, setFlows] = useState<WalletFlow[]>([]);
  const [alerts, setAlerts] = useState<AlertNotification[]>([]);
  const [selectedTrackerId, setSelectedTrackerId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [activeMonitoring, setActiveMonitoring] = useState<Set<string>>(new Set());

  const emitter = WalletEventEmitter.getInstance();

  // Tracker management
  const addTracker = useCallback((tracker: WalletTracker) => {
    setTrackers(prev => [...prev, tracker]);
  }, []);

  const removeTracker = useCallback((trackerId: string) => {
    setTrackers(prev => prev.filter(t => t.id !== trackerId));
    setEvents(prev => prev.filter(e => e.trackerWalletId !== trackerId));
    stopMonitoring(trackerId);
  }, []);

  const updateTracker = useCallback((trackerId: string, updates: Partial<WalletTracker>) => {
    setTrackers(prev =>
      prev.map(t => (t.id === trackerId ? { ...t, ...updates, lastUpdated: new Date() } : t))
    );
  }, []);

  // Event management
  const addEvent = useCallback((event: WalletEvent) => {
    setEvents(prev => [event, ...prev]);

    // Emit event for real-time UI updates
    emitter.emitWalletEvent(event.trackerWalletId, event);

    // Check for alerts
    if (event.usdValue > 10000) {
      const alert: AlertNotification = {
        id: `alert-${Date.now()}`,
        alertId: event.trackerWalletId,
        eventId: event.id,
        title: `Large ${event.type} Detected: ${event.tokenSymbol}`,
        message: `${event.amount} ${event.tokenSymbol} (${event.usdValue.toLocaleString('en-US', { style: 'currency', currency: 'USD' })})`,
        read: false,
        createdAt: new Date(),
      };
      addAlert(alert);
    }
  }, []);

  const clearEvents = useCallback(() => {
    setEvents([]);
  }, []);

  const getTrackerEvents = useCallback(
    (trackerId: string) => events.filter(e => e.trackerWalletId === trackerId),
    [events]
  );

  // Flow management
  const addFlow = useCallback((flow: WalletFlow) => {
    setFlows(prev => {
      const existing = prev.findIndex(
        f => f.tokenAddress === flow.tokenAddress
      );
      if (existing >= 0) {
        const updated = [...prev];
        updated[existing] = { ...updated[existing], ...flow };
        return updated;
      }
      return [...prev, flow];
    });
  }, []);

  const getTrackerFlows = useCallback(
    (trackerId: string) => {
      // For demo: return all flows (in production, associate flows with specific trackers)
      return flows;
    },
    [flows]
  );

  // Alert management
  const addAlert = useCallback((alert: AlertNotification) => {
    setAlerts(prev => [alert, ...prev]);
    emitter.emitAlert(alert);
  }, []);

  const markAlertAsRead = useCallback((alertId: string) => {
    setAlerts(prev =>
      prev.map(a => (a.id === alertId ? { ...a, read: true } : a))
    );
  }, []);

  const clearAlerts = useCallback(() => {
    setAlerts([]);
  }, []);

  // Fetch operations
  const fetchTrackerData = useCallback(
    async (trackerId: string, chain: Chain) => {
      setIsLoading(true);
      try {
        const tracker = trackers.find(t => t.id === trackerId);
        if (!tracker) return;

        // Fetch transactions
        const txs = await trackerService.getWalletTransactions(tracker.walletAddress, chain);
        txs.forEach(tx => {
          tx.trackerWalletId = trackerId;
          addEvent(tx);
        });

        // Fetch portfolio/flows
        const { flows: portfolioFlows } = await trackerService.getWalletPortfolio(
          tracker.walletAddress,
          chain
        );
        portfolioFlows.forEach(flow => addFlow(flow));

        // Detect buys
        const buys = await trackerService.detectBuys(tracker.walletAddress, chain);
        buys.forEach(buy => {
          buy.trackerWalletId = trackerId;
          addEvent(buy);
        });

        // Detect sells
        const sells = await trackerService.detectSells(tracker.walletAddress, chain);
        sells.forEach(sell => {
          sell.trackerWalletId = trackerId;
          addEvent(sell);
        });

        updateTracker(trackerId, { lastUpdated: new Date() });
      } catch (error) {
        console.error(`Error fetching data for tracker ${trackerId}:`, error);
      } finally {
        setIsLoading(false);
      }
    },
    [trackers, addEvent, addFlow, updateTracker]
  );

  const fetchAllTrackerData = useCallback(async () => {
    setIsLoading(true);
    try {
      for (const tracker of trackers) {
        for (const chain of tracker.chains) {
          await fetchTrackerData(tracker.id, chain);
        }
      }
    } catch (error) {
      console.error('Error fetching all tracker data:', error);
    } finally {
      setIsLoading(false);
    }
  }, [trackers, fetchTrackerData]);

  // Real-time monitoring
  const startMonitoring = useCallback((trackerId: string) => {
    setActiveMonitoring(prev => new Set([...prev, trackerId]));

    // Start mock event stream for demo
    emitter.startMockEventStream(trackerId);

    // In production: connect to real WebSocket
    const tracker = trackers.find(t => t.id === trackerId);
    if (tracker) {
      tracker.chains.forEach(chain => {
        emitter.connectWebSocket(tracker.id, tracker.walletAddress, chain);
      });
    }
  }, [trackers]);

  const stopMonitoring = useCallback((trackerId: string) => {
    setActiveMonitoring(prev => {
      const updated = new Set(prev);
      updated.delete(trackerId);
      return updated;
    });
  }, []);

  // Listen for emitted events
  useEffect(() => {
    const unsubscribers: (() => void)[] = [];

    trackers.forEach(tracker => {
      const unsub = emitter.onWalletEvent(tracker.id, event => {
        addEvent(event);
      });
      unsubscribers.push(unsub);
    });

    const alertUnsub = emitter.onAlert(alert => {
      addAlert(alert);
    });
    unsubscribers.push(alertUnsub);

    return () => {
      unsubscribers.forEach(unsub => unsub());
    };
  }, [trackers]);

  const value: WalletTrackerContextType = {
    trackers,
    events,
    flows,
    alerts,
    selectedTrackerId,
    isLoading,
    addTracker,
    removeTracker,
    updateTracker,
    addEvent,
    clearEvents,
    getTrackerEvents,
    addFlow,
    getTrackerFlows,
    addAlert,
    markAlertAsRead,
    clearAlerts,
    fetchTrackerData,
    fetchAllTrackerData,
    startMonitoring,
    stopMonitoring,
  };

  return (
    <WalletTrackerContext.Provider value={value}>
      {children}
    </WalletTrackerContext.Provider>
  );
};

export const useWalletTracker = (): WalletTrackerContextType => {
  const context = useContext(WalletTrackerContext);
  if (!context) {
    throw new Error('useWalletTracker must be used within WalletTrackerProvider');
  }
  return context;
};

export default WalletTrackerProvider;
