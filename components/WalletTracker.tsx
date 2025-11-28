import React, { useState, useEffect } from 'react';
import { Plus, Search, Download, Upload, Filter, X, ArrowUpRight, ArrowDownLeft, Zap, TrendingUp, TrendingDown, Eye, Copy, ExternalLink, AlertCircle } from 'lucide-react';
import { WalletTracker, WalletEvent, WalletFlow, Chain, AlertNotification } from '../types';
import { useWalletTracker } from '../services/WalletTrackerContext';

interface WalletTrackerUIProps {
  onClose?: () => void;
}

export const WalletTrackerUI: React.FC<WalletTrackerUIProps> = ({ onClose }) => {
  const {
    trackers: contextTrackers,
    events: contextEvents,
    flows: contextFlows,
    alerts: contextAlerts,
    addTracker,
    removeTracker: removeTrackerFromContext,
    fetchAllTrackerData,
    startMonitoring,
  } = useWalletTracker();

  const [trackers, setTrackers] = useState<WalletTracker[]>(contextTrackers);
  const [events, setEvents] = useState<WalletEvent[]>(contextEvents);
  const [flows, setFlows] = useState<WalletFlow[]>(contextFlows);
  const [alerts, setAlerts] = useState<AlertNotification[]>(contextAlerts);
  const [activeTab, setActiveTab] = useState<'following' | 'inflow' | 'alerts'>('following');
  const [selectedTracker, setSelectedTracker] = useState<WalletTracker | null>(null);
  const [showAddWallet, setShowAddWallet] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  const [newWalletAddress, setNewWalletAddress] = useState('');
  const [newWalletAlias, setNewWalletAlias] = useState('');
  const [newWalletEmoji, setNewWalletEmoji] = useState('👤');
  const [chainFilter, setChainFilter] = useState<Chain | 'ALL'>('ALL');

  useEffect(() => {
    setTrackers(contextTrackers);
    setEvents(contextEvents);
    setFlows(contextFlows);
    setAlerts(contextAlerts);
  }, [contextTrackers, contextEvents, contextFlows, contextAlerts]);

  const handleAddWallet = (e: React.FormEvent) => {
    e.preventDefault();
    if (newWalletAddress && newWalletAlias) {
      const newTracker: WalletTracker = {
        id: `tracker-${Date.now()}`,
        userId: 'user1',
        walletAddress: newWalletAddress,
        alias: newWalletAlias,
        emoji: newWalletEmoji,
        chains: ['ETH', 'BASE', 'ARBITRUM', 'BSC', 'SOL'],
        tags: [],
        createdAt: new Date(),
        lastUpdated: new Date(),
      };
      addTracker(newTracker);
      fetchAllTrackerData();
      startMonitoring(newTracker.id);
      setShowAddWallet(false);
      setNewWalletAddress('');
      setNewWalletAlias('');
      setNewWalletEmoji('👤');
    }
  };

  const handleRemoveTracker = (id: string) => {
    removeTrackerFromContext(id);
    if (selectedTracker?.id === id) {
      setSelectedTracker(null);
    }
  };

  const getTrackerEvents = (trackerId: string) => {
    return events.filter(e => e.trackerWalletId === trackerId);
  };

  const formatAddress = (address: string) => {
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  };

  const formatNumber = (num: number) => {
    if (num >= 1000000) return `$${(num / 1000000).toFixed(2)}M`;
    if (num >= 1000) return `$${(num / 1000).toFixed(2)}K`;
    return `$${num.toFixed(2)}`;
  };

  const calculateWalletStats = (trackerId: string) => {
    const trackerFlows = flows;
    const totalValue = trackerFlows.reduce((sum, f) => sum + f.usdValue, 0);
    const totalInflow = trackerFlows.reduce((sum, f) => sum + f.inflow, 0);
    return { totalValue, totalInflow };
  };

  const filteredTrackers = chainFilter === 'ALL' 
    ? trackers 
    : trackers.filter(t => t.chains.includes(chainFilter as Chain));

  return (
    <div className="h-full flex flex-col bg-gradient-to-b from-[#0f0f0f] to-[#0a0a0a] relative">
      {/* Header */}
      <div className="px-4 md:px-6 py-4 flex justify-between items-center border-b border-white/5 sticky top-0 bg-[#0f0f0f]/95 backdrop-blur-md z-10">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-[#AB9FF2] to-purple-600 flex items-center justify-center text-white font-bold text-sm">
            📊
          </div>
          <h2 className="text-xl font-bold text-white">Wallet Tracker</h2>
          <span className="text-xs bg-[#AB9FF2]/20 text-[#AB9FF2] px-2 py-1 rounded-full ml-2">
            {trackers.length} / 300
          </span>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="p-2 hover:bg-white/5 rounded-lg transition-colors"
            title="Filter wallets"
          >
            <Filter size={20} className="text-white/70" />
          </button>
          <button
            onClick={() => setShowAddWallet(true)}
            className="p-2 hover:bg-white/5 rounded-lg transition-colors text-[#AB9FF2]"
            title="Add wallet"
          >
            <Plus size={20} />
          </button>
        </div>
      </div>

      {/* Filter Bar */}
      {showFilters && (
        <div className="px-4 md:px-6 py-3 border-b border-white/5 flex gap-2 overflow-x-auto pb-3">
          {(['ALL', 'ETH', 'BASE', 'ARBITRUM', 'BSC', 'SOL'] as const).map(chain => (
            <button
              key={chain}
              onClick={() => setChainFilter(chain)}
              className={`px-3 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition-all ${
                chainFilter === chain
                  ? 'bg-[#AB9FF2] text-black'
                  : 'bg-white/5 text-white/60 hover:bg-white/10 border border-white/10'
              }`}
            >
              {chain}
            </button>
          ))}
        </div>
      )}

      {/* Tabs */}
      <div className="px-4 md:px-6 pt-4 flex gap-4 border-b border-white/5">
        {(['following', 'inflow', 'alerts'] as const).map(tab => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`pb-3 px-2 font-medium text-sm transition-all border-b-2 ${
              activeTab === tab
                ? 'text-[#AB9FF2] border-[#AB9FF2]'
                : 'text-white/50 border-transparent hover:text-white/70'
            }`}
          >
            {tab === 'following' && 'Following'}
            {tab === 'inflow' && 'Inflow'}
            {tab === 'alerts' && 'Alerts'}
          </button>
        ))}
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-y-auto p-4 md:p-6 space-y-4">
        {/* Following Tab */}
        {activeTab === 'following' && (
          <>
            {filteredTrackers.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-12 text-center">
                <div className="w-16 h-16 bg-white/5 rounded-full flex items-center justify-center mb-4">
                  <Search size={32} className="text-white/30" />
                </div>
                <h3 className="text-lg font-bold text-white mb-2">No Wallets Tracked</h3>
                <p className="text-sm text-white/50 max-w-xs">
                  Add wallets to track their buys, sells, and portfolio movements in real-time.
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 max-w-7xl">
                {filteredTrackers.map(tracker => {
                  const trackerEvents = getTrackerEvents(tracker.id);
                  const stats = calculateWalletStats(tracker.id);
                  return (
                    <div
                      key={tracker.id}
                      className="bg-white/[0.02] border border-white/10 rounded-2xl p-4 hover:bg-white/[0.04] hover:border-white/20 transition-all cursor-pointer group"
                      onClick={() => setSelectedTracker(tracker)}
                    >
                      {/* Header */}
                      <div className="flex justify-between items-start mb-4">
                        <div className="flex items-center gap-3">
                          <div className="text-2xl">{tracker.emoji}</div>
                          <div>
                            <h4 className="font-bold text-white text-sm">{tracker.alias}</h4>
                            <p className="text-xs text-white/40 font-mono">{formatAddress(tracker.walletAddress)}</p>
                          </div>
                        </div>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleRemoveTracker(tracker.id);
                          }}
                          className="p-1 hover:bg-red-500/20 rounded transition-colors opacity-0 group-hover:opacity-100"
                        >
                          <X size={16} className="text-red-400" />
                        </button>
                      </div>

                      {/* Stats */}
                      <div className="mb-4 space-y-2">
                        <div>
                          <p className="text-[10px] text-white/40 uppercase font-bold">Portfolio Value</p>
                          <p className="text-lg font-bold text-white">{formatNumber(stats.totalValue)}</p>
                        </div>
                        <div className="flex gap-2 flex-wrap">
                          {tracker.chains.map(chain => (
                            <span key={chain} className="text-[10px] bg-white/10 text-white/60 px-2 py-1 rounded">
                              {chain}
                            </span>
                          ))}
                        </div>
                      </div>

                      {/* Recent Activity */}
                      <div className="space-y-2 border-t border-white/5 pt-3">
                        <p className="text-[10px] text-white/40 uppercase font-bold">Recent</p>
                        {trackerEvents.slice(0, 2).map(event => (
                          <div key={event.id} className="flex items-center justify-between text-xs">
                            <div className="flex items-center gap-2">
                              {event.type === 'BUY' || event.type === 'TRANSFER_IN' ? (
                                <ArrowDownLeft size={14} className="text-green-400" />
                              ) : (
                                <ArrowUpRight size={14} className="text-red-400" />
                              )}
                              <span className="text-white/60">{event.tokenSymbol}</span>
                            </div>
                            <span className="text-white/80 font-mono">{formatNumber(event.usdValue)}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </>
        )}

        {/* Inflow Tab */}
        {activeTab === 'inflow' && (
          <div className="space-y-2 max-w-7xl">
            <p className="text-xs text-white/40 uppercase font-bold mb-4">Wallet Inflows & Outflows</p>
            {flows.length === 0 ? (
              <div className="text-center py-8 text-white/40">
                <p className="text-sm">No flow data yet. Add wallets and refresh.</p>
              </div>
            ) : (
              flows.map((flow, idx) => (
                <div key={idx} className="bg-white/[0.02] border border-white/10 rounded-xl p-3 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-gradient-to-br from-[#AB9FF2]/20 to-purple-600/20 rounded-lg flex items-center justify-center">
                      <span className="font-bold text-sm text-[#AB9FF2]">{flow.tokenSymbol[0]}</span>
                    </div>
                    <div>
                      <p className="font-bold text-white text-sm">{flow.tokenSymbol}</p>
                      <p className="text-xs text-white/40">
                        Inflow: {flow.inflow.toFixed(2)} | Outflow: {flow.outflow.toFixed(2)}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-white">{formatNumber(flow.netFlow > 0 ? flow.netFlow : -flow.netFlow)}</p>
                    <p className={`text-xs ${flow.netFlow > 0 ? 'text-green-400' : 'text-red-400'}`}>
                      {flow.netFlow > 0 ? '↑' : '↓'} {flow.netFlow > 0 ? '+' : ''}{flow.netFlow.toFixed(2)}
                    </p>
                  </div>
                </div>
              ))
            )}
          </div>
        )}

        {/* Alerts Tab */}
        {activeTab === 'alerts' && (
          <div className="space-y-2 max-w-7xl">
            {alerts.length === 0 ? (
              <div className="text-center py-8 text-white/40">
                <Zap size={32} className="mx-auto mb-2 opacity-30" />
                <p className="text-sm">No alerts yet. Alerts will appear here.</p>
              </div>
            ) : (
              alerts.map(alert => (
                <div key={alert.id} className="bg-white/[0.02] border border-white/10 rounded-xl p-3 flex gap-3">
                  <AlertCircle size={16} className="text-[#AB9FF2] flex-shrink-0 mt-1" />
                  <div>
                    <p className="font-bold text-white text-sm">{alert.title}</p>
                    <p className="text-xs text-white/60">{alert.message}</p>
                  </div>
                </div>
              ))
            )}
          </div>
        )}
      </div>

      {/* Add Wallet Modal */}
      {showAddWallet && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 animate-fade-in">
          <div className="bg-[#1a1a1a] border border-white/10 rounded-2xl p-6 w-full max-w-sm shadow-2xl animate-slide-up">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-bold text-white">Add Wallet</h3>
              <button
                onClick={() => setShowAddWallet(false)}
                className="p-1 hover:bg-white/10 rounded-lg transition-colors"
              >
                <X size={20} className="text-white/60" />
              </button>
            </div>

            <form onSubmit={handleAddWallet} className="space-y-4">
              {/* Emoji Picker */}
              <div>
                <label className="text-xs text-white/60 uppercase font-bold block mb-2">Emoji Tag</label>
                <div className="flex gap-2 flex-wrap">
                  {['👤', '🐋', '🤖', '🔥', '💎', '🚀'].map(emoji => (
                    <button
                      key={emoji}
                      type="button"
                      onClick={() => setNewWalletEmoji(emoji)}
                      className={`w-10 h-10 rounded-lg text-xl transition-all ${
                        newWalletEmoji === emoji
                          ? 'bg-[#AB9FF2] scale-110'
                          : 'bg-white/10 hover:bg-white/20'
                      }`}
                    >
                      {emoji}
                    </button>
                  ))}
                </div>
              </div>

              {/* Alias */}
              <div>
                <label className="text-xs text-white/60 uppercase font-bold block mb-2">Wallet Name</label>
                <input
                  type="text"
                  value={newWalletAlias}
                  onChange={(e) => setNewWalletAlias(e.target.value)}
                  placeholder="e.g., Whale Alpha"
                  className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-white text-sm focus:outline-none focus:border-[#AB9FF2] transition-colors"
                />
              </div>

              {/* Address */}
              <div>
                <label className="text-xs text-white/60 uppercase font-bold block mb-2">Wallet Address</label>
                <input
                  type="text"
                  value={newWalletAddress}
                  onChange={(e) => setNewWalletAddress(e.target.value)}
                  placeholder="0x... or wallet address"
                  className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-white text-sm font-mono focus:outline-none focus:border-[#AB9FF2] transition-colors"
                />
              </div>

              {/* Chain Tags */}
              <div>
                <label className="text-xs text-white/60 uppercase font-bold block mb-2">Track on Chains</label>
                <div className="flex gap-2 flex-wrap">
                  {['ETH', 'BASE', 'ARBITRUM', 'BSC', 'SOL'].map(chain => (
                    <span key={chain} className="text-xs bg-white/10 text-white/60 px-3 py-1 rounded">
                      {chain}
                    </span>
                  ))}
                </div>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={!newWalletAddress || !newWalletAlias}
                className="w-full bg-gradient-to-r from-[#AB9FF2] to-purple-600 disabled:opacity-50 disabled:cursor-not-allowed text-black font-bold py-3 rounded-lg transition-all hover:shadow-lg hover:shadow-[#AB9FF2]/20"
              >
                Start Tracking
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default WalletTrackerUI;
