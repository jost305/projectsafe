
import React, { useState } from 'react';
import { Bell, Plus, Trash2, TrendingUp, TrendingDown, X } from 'lucide-react';
import { Token } from '../types';

interface PriceAlert {
  id: string;
  tokenSymbol: string;
  targetPrice: number;
  condition: 'above' | 'below';
  active: boolean;
}

interface PriceAlertsProps {
  tokens: Token[];
}

export const PriceAlerts: React.FC<PriceAlertsProps> = ({ tokens }) => {
  const [alerts, setAlerts] = useState<PriceAlert[]>([
    { id: '1', tokenSymbol: 'SOL', targetPrice: 150, condition: 'above', active: true },
    { id: '2', tokenSymbol: 'ETH', targetPrice: 2500, condition: 'below', active: true },
  ]);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [selectedToken, setSelectedToken] = useState(tokens[0]);
  const [targetPrice, setTargetPrice] = useState('');
  const [condition, setCondition] = useState<'above' | 'below'>('above');

  const handleCreate = () => {
    const newAlert: PriceAlert = {
      id: Math.random().toString(36).substring(7),
      tokenSymbol: selectedToken.symbol,
      targetPrice: parseFloat(targetPrice),
      condition,
      active: true
    };
    setAlerts(prev => [...prev, newAlert]);
    setShowCreateModal(false);
    setTargetPrice('');
  };

  const deleteAlert = (id: string) => {
    setAlerts(prev => prev.filter(a => a.id !== id));
  };

  const toggleAlert = (id: string) => {
    setAlerts(prev => prev.map(a => a.id === id ? { ...a, active: !a.active } : a));
  };

  return (
    <div class="flex flex-col gap-4 p-5 pb-24">
      <div class="flex justify-between items-center">
        <h2 class="text-2xl font-bold">Price Alerts</h2>
        <button
          onClick={() => setShowCreateModal(true)}
          class="w-10 h-10 bg-[#AB9FF2] rounded-full flex items-center justify-center text-black active:scale-90 transition-transform"
        >
          <Plus size={20} strokeWidth={3} />
        </button>
      </div>

      <div class="flex flex-col gap-3">
        {alerts.length === 0 ? (
          <div class="bg-[#1C1C1E] rounded-2xl p-8 text-center border border-white/5">
            <Bell size={48} class="text-gray-600 mx-auto mb-3" />
            <p class="text-gray-400">No alerts set</p>
            <p class="text-xs text-gray-600 mt-1">Create alerts to get notified of price changes</p>
          </div>
        ) : (
          alerts.map(alert => {
            const token = tokens.find(t => t.symbol === alert.tokenSymbol);
            const isTriggered = token && (
              (alert.condition === 'above' && token.price >= alert.targetPrice) ||
              (alert.condition === 'below' && token.price <= alert.targetPrice)
            );

            return (
              <div
                key={alert.id}
                class={`bg-[#1C1C1E] rounded-2xl p-4 border transition-all ${
                  isTriggered ? 'border-[#AB9FF2] shadow-lg shadow-[#AB9FF2]/20' : 'border-white/5'
                }`}
              >
                <div class="flex items-center justify-between mb-3">
                  <div class="flex items-center gap-3">
                    {token && <img src={token.image} class="w-10 h-10 rounded-full" />}
                    <div>
                      <div class="font-bold">{alert.tokenSymbol}</div>
                      <div class="text-xs text-gray-400">
                        Current: ${token?.price.toFixed(2)}
                      </div>
                    </div>
                  </div>
                  <button onClick={() => deleteAlert(alert.id)} class="p-2 hover:bg-white/5 rounded-lg transition-colors">
                    <Trash2 size={18} class="text-gray-400 hover:text-red-500" />
                  </button>
                </div>

                <div class="flex items-center justify-between bg-black/30 p-3 rounded-xl">
                  <div class="flex items-center gap-2">
                    {alert.condition === 'above' ? (
                      <TrendingUp size={16} class="text-green-500" />
                    ) : (
                      <TrendingDown size={16} class="text-red-500" />
                    )}
                    <span class="text-sm text-gray-300">
                      Alert when {alert.condition} <span class="font-bold text-white">${alert.targetPrice}</span>
                    </span>
                  </div>
                  <button
                    onClick={() => toggleAlert(alert.id)}
                    class={`w-12 h-6 rounded-full transition-colors relative ${
                      alert.active ? 'bg-[#AB9FF2]' : 'bg-gray-700'
                    }`}
                  >
                    <div class={`absolute top-1 w-4 h-4 rounded-full bg-white transition-all ${
                      alert.active ? 'left-7' : 'left-1'
                    }`} />
                  </button>
                </div>

                {isTriggered && (
                  <div class="mt-3 bg-[#AB9FF2]/10 border border-[#AB9FF2]/30 rounded-lg p-2 text-center">
                    <span class="text-xs font-bold text-[#AB9FF2]">🔔 Alert Triggered!</span>
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>

      {/* Create Modal */}
      {showCreateModal && (
        <div class="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-end animate-fade-in">
          <div class="bg-[#0C0C0C] w-full max-w-md mx-auto rounded-t-3xl p-6 animate-slide-up border-t border-white/10">
            <div class="flex justify-between items-center mb-6">
              <h3 class="text-xl font-bold">Create Alert</h3>
              <button onClick={() => setShowCreateModal(false)} class="p-2 hover:bg-white/5 rounded-full">
                <X size={20} />
              </button>
            </div>

            <div class="flex flex-col gap-4">
              <div>
                <label class="text-sm text-gray-400 mb-2 block">Token</label>
                <select
                  value={selectedToken.symbol}
                  onChange={(e) => setSelectedToken(tokens.find(t => t.symbol === (e.target as HTMLSelectElement).value)!)}
                  class="w-full bg-[#1C1C1E] border border-white/10 rounded-xl p-3 text-white focus:outline-none focus:border-[#AB9FF2]"
                >
                  {tokens.map(token => (
                    <option key={token.id} value={token.symbol}>{token.name} ({token.symbol})</option>
                  ))}
                </select>
              </div>

              <div>
                <label class="text-sm text-gray-400 mb-2 block">Condition</label>
                <div class="grid grid-cols-2 gap-3">
                  <button
                    onClick={() => setCondition('above')}
                    class={`p-3 rounded-xl border transition-colors ${
                      condition === 'above' ? 'bg-green-500/10 border-green-500 text-green-500' : 'bg-[#1C1C1E] border-white/5'
                    }`}
                  >
                    <TrendingUp size={20} class="mx-auto mb-1" />
                    <span class="text-xs font-bold">Above</span>
                  </button>
                  <button
                    onClick={() => setCondition('below')}
                    class={`p-3 rounded-xl border transition-colors ${
                      condition === 'below' ? 'bg-red-500/10 border-red-500 text-red-500' : 'bg-[#1C1C1E] border-white/5'
                    }`}
                  >
                    <TrendingDown size={20} class="mx-auto mb-1" />
                    <span class="text-xs font-bold">Below</span>
                  </button>
                </div>
              </div>

              <div>
                <label class="text-sm text-gray-400 mb-2 block">Target Price</label>
                <input
                  type="number"
                  value={targetPrice}
                  onChange={(e) => setTargetPrice((e.target as HTMLInputElement).value)}
                  placeholder="0.00"
                  class="w-full bg-[#1C1C1E] border border-white/10 rounded-xl p-3 text-white focus:outline-none focus:border-[#AB9FF2]"
                />
              </div>

              <button
                onClick={handleCreate}
                disabled={!targetPrice}
                class="w-full bg-[#AB9FF2] text-black font-bold py-3 rounded-xl active:scale-95 transition-transform disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Create Alert
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
