import React, { useState, useEffect } from 'react';
import { Calendar, Clock, Play, Pause, Trash2, Plus, X, RefreshCw, ChevronDown, TrendingUp, AlertCircle } from 'lucide-react';
import { ScheduledTransaction } from '../types';

const STORAGE_KEY = 'phantom_scheduled_transactions';

const DEFAULT_SCHEDULED: ScheduledTransaction[] = [
  {
    id: '1',
    type: 'DCA',
    fromToken: 'USDC',
    toToken: 'ETH',
    amount: 100,
    frequency: 'weekly',
    nextExecution: '2024-01-20 09:00',
    isActive: true,
    totalExecuted: 12,
    createdAt: '2023-10-15'
  },
  {
    id: '2',
    type: 'DCA',
    fromToken: 'USDC',
    toToken: 'BTC',
    amount: 50,
    frequency: 'daily',
    nextExecution: '2024-01-16 12:00',
    isActive: true,
    totalExecuted: 45,
    createdAt: '2023-12-01'
  },
  {
    id: '3',
    type: 'ONE_TIME',
    fromToken: 'ETH',
    toToken: 'SOL',
    amount: 0.5,
    nextExecution: '2024-01-25 15:00',
    isActive: false,
    totalExecuted: 0,
    createdAt: '2024-01-10'
  },
];

const loadSchedules = (): ScheduledTransaction[] => {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored ? JSON.parse(stored) : DEFAULT_SCHEDULED;
  } catch {
    return DEFAULT_SCHEDULED;
  }
};

const saveSchedules = (schedules: ScheduledTransaction[]) => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(schedules));
  } catch (e) {
    console.error('Failed to save schedules:', e);
  }
};

const TOKEN_OPTIONS = [
  { symbol: 'ETH', name: 'Ethereum', image: 'https://cryptologos.cc/logos/ethereum-eth-logo.png?v=029' },
  { symbol: 'BTC', name: 'Bitcoin', image: 'https://cryptologos.cc/logos/bitcoin-btc-logo.png?v=029' },
  { symbol: 'SOL', name: 'Solana', image: 'https://cryptologos.cc/logos/solana-sol-logo.png?v=029' },
  { symbol: 'USDC', name: 'USD Coin', image: 'https://cryptologos.cc/logos/usd-coin-usdc-logo.png?v=029' },
];

export const TransactionScheduler: React.FC = () => {
  const [schedules, setSchedules] = useState<ScheduledTransaction[]>(() => loadSchedules());

  useEffect(() => {
    saveSchedules(schedules);
  }, [schedules]);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newSchedule, setNewSchedule] = useState({
    type: 'DCA' as 'DCA' | 'ONE_TIME',
    fromToken: 'USDC',
    toToken: 'ETH',
    amount: 100,
    frequency: 'weekly' as 'daily' | 'weekly' | 'monthly',
    scheduledDate: '',
    scheduledTime: '09:00'
  });

  const handleToggleActive = (id: string) => {
    setSchedules(prev => prev.map(s => 
      s.id === id ? { ...s, isActive: !s.isActive } : s
    ));
  };

  const handleDelete = (id: string) => {
    setSchedules(prev => prev.filter(s => s.id !== id));
  };

  const handleCreate = () => {
    const schedule: ScheduledTransaction = {
      id: Date.now().toString(),
      type: newSchedule.type,
      fromToken: newSchedule.fromToken,
      toToken: newSchedule.toToken,
      amount: newSchedule.amount,
      frequency: newSchedule.type === 'DCA' ? newSchedule.frequency : undefined,
      nextExecution: newSchedule.type === 'DCA' 
        ? new Date(Date.now() + 86400000).toISOString().slice(0, 16).replace('T', ' ')
        : `${newSchedule.scheduledDate} ${newSchedule.scheduledTime}`,
      isActive: true,
      totalExecuted: 0,
      createdAt: new Date().toISOString().slice(0, 10)
    };
    setSchedules(prev => [...prev, schedule]);
    setShowCreateModal(false);
  };

  const getFrequencyLabel = (freq?: string) => {
    switch (freq) {
      case 'daily': return 'Every Day';
      case 'weekly': return 'Every Week';
      case 'monthly': return 'Every Month';
      default: return 'One Time';
    }
  };

  const totalInvested = schedules
    .filter(s => s.isActive && s.type === 'DCA')
    .reduce((acc, s) => acc + (s.totalExecuted * s.amount), 0);

  return (
    <div className="flex flex-col gap-4 animate-fade-in">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Calendar size={20} className="text-[#AB9FF2]" />
          <h3 className="font-bold text-lg">Scheduled Transactions</h3>
        </div>
        <button
          onClick={() => setShowCreateModal(true)}
          className="flex items-center gap-1 px-3 py-1.5 bg-[#AB9FF2] text-black rounded-lg text-sm font-bold hover:bg-[#9180e0] transition-colors"
        >
          <Plus size={16} />
          New
        </button>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div className="bg-[#1C1C1E] rounded-xl p-3">
          <p className="text-xs text-gray-500 mb-1">Active Schedules</p>
          <p className="font-bold text-lg">{schedules.filter(s => s.isActive).length}</p>
        </div>
        <div className="bg-[#1C1C1E] rounded-xl p-3">
          <p className="text-xs text-gray-500 mb-1">Total DCA'd</p>
          <p className="font-bold text-lg">${totalInvested.toLocaleString()}</p>
        </div>
      </div>

      {showCreateModal && (
        <div className="bg-[#1C1C1E] rounded-2xl p-4 border border-[#AB9FF2]/30">
          <div className="flex items-center justify-between mb-4">
            <h4 className="font-bold">Create Schedule</h4>
            <button onClick={() => setShowCreateModal(false)} className="text-gray-400 hover:text-white">
              <X size={18} />
            </button>
          </div>

          <div className="flex gap-2 mb-4">
            <button
              onClick={() => setNewSchedule(prev => ({ ...prev, type: 'DCA' }))}
              className={`flex-1 py-2 rounded-lg font-bold transition-colors ${
                newSchedule.type === 'DCA' 
                  ? 'bg-[#AB9FF2] text-black' 
                  : 'bg-black/30 text-gray-400'
              }`}
            >
              <RefreshCw size={14} className="inline mr-1" />
              DCA
            </button>
            <button
              onClick={() => setNewSchedule(prev => ({ ...prev, type: 'ONE_TIME' }))}
              className={`flex-1 py-2 rounded-lg font-bold transition-colors ${
                newSchedule.type === 'ONE_TIME' 
                  ? 'bg-[#AB9FF2] text-black' 
                  : 'bg-black/30 text-gray-400'
              }`}
            >
              <Clock size={14} className="inline mr-1" />
              One-Time
            </button>
          </div>

          <div className="flex flex-col gap-3">
            <div className="flex gap-2">
              <div className="flex-1">
                <label className="text-xs text-gray-500 block mb-1">From</label>
                <select
                  value={newSchedule.fromToken}
                  onChange={(e) => setNewSchedule(prev => ({ ...prev, fromToken: e.target.value }))}
                  className="w-full bg-black/50 rounded-lg px-3 py-2 text-sm focus:outline-none"
                >
                  {TOKEN_OPTIONS.map(t => (
                    <option key={t.symbol} value={t.symbol}>{t.symbol}</option>
                  ))}
                </select>
              </div>
              <div className="flex-1">
                <label className="text-xs text-gray-500 block mb-1">To</label>
                <select
                  value={newSchedule.toToken}
                  onChange={(e) => setNewSchedule(prev => ({ ...prev, toToken: e.target.value }))}
                  className="w-full bg-black/50 rounded-lg px-3 py-2 text-sm focus:outline-none"
                >
                  {TOKEN_OPTIONS.map(t => (
                    <option key={t.symbol} value={t.symbol}>{t.symbol}</option>
                  ))}
                </select>
              </div>
            </div>

            <div>
              <label className="text-xs text-gray-500 block mb-1">Amount ({newSchedule.fromToken})</label>
              <input
                type="number"
                value={newSchedule.amount}
                onChange={(e) => setNewSchedule(prev => ({ ...prev, amount: parseFloat(e.target.value) || 0 }))}
                className="w-full bg-black/50 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-[#AB9FF2]"
              />
            </div>

            {newSchedule.type === 'DCA' ? (
              <div>
                <label className="text-xs text-gray-500 block mb-1">Frequency</label>
                <select
                  value={newSchedule.frequency}
                  onChange={(e) => setNewSchedule(prev => ({ ...prev, frequency: e.target.value as any }))}
                  className="w-full bg-black/50 rounded-lg px-3 py-2 text-sm focus:outline-none"
                >
                  <option value="daily">Daily</option>
                  <option value="weekly">Weekly</option>
                  <option value="monthly">Monthly</option>
                </select>
              </div>
            ) : (
              <div className="flex gap-2">
                <div className="flex-1">
                  <label className="text-xs text-gray-500 block mb-1">Date</label>
                  <input
                    type="date"
                    value={newSchedule.scheduledDate}
                    onChange={(e) => setNewSchedule(prev => ({ ...prev, scheduledDate: e.target.value }))}
                    className="w-full bg-black/50 rounded-lg px-3 py-2 text-sm focus:outline-none"
                  />
                </div>
                <div className="flex-1">
                  <label className="text-xs text-gray-500 block mb-1">Time</label>
                  <input
                    type="time"
                    value={newSchedule.scheduledTime}
                    onChange={(e) => setNewSchedule(prev => ({ ...prev, scheduledTime: e.target.value }))}
                    className="w-full bg-black/50 rounded-lg px-3 py-2 text-sm focus:outline-none"
                  />
                </div>
              </div>
            )}

            <button
              onClick={handleCreate}
              className="w-full py-3 bg-[#AB9FF2] text-black rounded-xl font-bold hover:bg-[#9180e0] transition-colors"
            >
              Create Schedule
            </button>
          </div>
        </div>
      )}

      <div className="flex flex-col gap-2">
        {schedules.map(schedule => (
          <div
            key={schedule.id}
            className={`bg-[#1C1C1E] rounded-xl p-4 border-2 transition-all ${
              schedule.isActive ? 'border-transparent' : 'border-transparent opacity-60'
            }`}
          >
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-3">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                  schedule.type === 'DCA' ? 'bg-[#AB9FF2]/20' : 'bg-blue-500/20'
                }`}>
                  {schedule.type === 'DCA' ? (
                    <RefreshCw size={18} className="text-[#AB9FF2]" />
                  ) : (
                    <Clock size={18} className="text-blue-500" />
                  )}
                </div>
                <div>
                  <div className="font-bold flex items-center gap-2">
                    {schedule.fromToken} <span className="text-gray-500">→</span> {schedule.toToken}
                    <span className={`text-xs px-2 py-0.5 rounded-full ${
                      schedule.type === 'DCA' ? 'bg-[#AB9FF2]/20 text-[#AB9FF2]' : 'bg-blue-500/20 text-blue-500'
                    }`}>
                      {schedule.type}
                    </span>
                  </div>
                  <div className="text-sm text-gray-500">
                    {schedule.amount} {schedule.fromToken} • {getFrequencyLabel(schedule.frequency)}
                  </div>
                </div>
              </div>
              <button
                onClick={() => handleToggleActive(schedule.id)}
                className={`p-2 rounded-lg transition-colors ${
                  schedule.isActive 
                    ? 'bg-green-500/20 text-green-500' 
                    : 'bg-gray-500/20 text-gray-500'
                }`}
              >
                {schedule.isActive ? <Pause size={18} /> : <Play size={18} />}
              </button>
            </div>

            <div className="flex items-center justify-between text-sm border-t border-white/5 pt-3">
              <div className="flex items-center gap-4">
                <div>
                  <span className="text-gray-500">Next: </span>
                  <span className="font-medium">{schedule.nextExecution}</span>
                </div>
                {schedule.type === 'DCA' && (
                  <div>
                    <span className="text-gray-500">Executed: </span>
                    <span className="font-medium text-green-500">{schedule.totalExecuted}x</span>
                  </div>
                )}
              </div>
              <button
                onClick={() => handleDelete(schedule.id)}
                className="p-2 hover:bg-red-500/20 rounded-lg transition-colors"
              >
                <Trash2 size={16} className="text-red-400" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {schedules.length === 0 && (
        <div className="text-center py-8 text-gray-500">
          <Calendar size={40} className="mx-auto mb-2 opacity-50" />
          <p>No scheduled transactions</p>
          <p className="text-sm mt-1">Create a DCA or one-time scheduled transaction</p>
        </div>
      )}

      <div className="bg-gradient-to-r from-[#AB9FF2]/10 to-transparent rounded-xl p-4 border border-[#AB9FF2]/20">
        <div className="flex items-start gap-3">
          <TrendingUp size={20} className="text-[#AB9FF2] mt-0.5" />
          <div>
            <h4 className="font-bold text-[#AB9FF2]">DCA Strategy Tip</h4>
            <p className="text-sm text-gray-400 mt-1">
              Dollar-cost averaging helps reduce the impact of volatility by spreading your purchases over time. 
              Consider setting up weekly or monthly recurring buys for long-term holdings.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
