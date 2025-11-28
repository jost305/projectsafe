
import React, { useState } from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, LineChart, Line, XAxis, YAxis, Tooltip } from 'recharts';
import { TrendingUp, TrendingDown, DollarSign, Percent, Calendar } from 'lucide-react';
import { Token } from '../types';

interface PortfolioProps {
  tokens: Token[];
}

export const Portfolio: React.FC<PortfolioProps> = ({ tokens }) => {
  const [timeframe, setTimeframe] = useState<'1D' | '1W' | '1M' | '1Y'>('1W');

  const totalValue = tokens.reduce((acc, t) => acc + (t.balance * t.price), 0);
  
  const portfolioData = tokens.map(t => ({
    name: t.symbol,
    value: (t.balance * t.price / totalValue) * 100,
    color: t.symbol === 'SOL' ? '#9945FF' : t.symbol === 'ETH' ? '#627EEA' : '#' + Math.floor(Math.random()*16777215).toString(16)
  }));

  const performanceData = [
    { time: 'Mon', value: totalValue * 0.95 },
    { time: 'Tue', value: totalValue * 0.97 },
    { time: 'Wed', value: totalValue * 0.93 },
    { time: 'Thu', value: totalValue * 0.98 },
    { time: 'Fri', value: totalValue * 1.02 },
    { time: 'Sat', value: totalValue * 1.01 },
    { time: 'Sun', value: totalValue },
  ];

  const totalPnL = totalValue - (totalValue * 0.95);
  const pnlPercent = (totalPnL / (totalValue * 0.95)) * 100;

  return (
    <div class="flex flex-col gap-6 p-5 animate-fade-in pb-24">
      {/* Header Stats */}
      <div class="bg-gradient-to-br from-[#AB9FF2]/10 to-[#1C1C1E] p-6 rounded-3xl border border-white/10">
        <div class="flex justify-between items-start mb-6">
          <div>
            <p class="text-sm text-gray-400 mb-1">Total Portfolio Value</p>
            <h2 class="text-4xl font-bold">${totalValue.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</h2>
          </div>
          <div class={`flex items-center gap-2 px-3 py-1.5 rounded-full ${pnlPercent >= 0 ? 'bg-green-500/10' : 'bg-red-500/10'}`}>
            {pnlPercent >= 0 ? <TrendingUp size={16} class="text-green-500" /> : <TrendingDown size={16} class="text-red-500" />}
            <span class={`font-bold text-sm ${pnlPercent >= 0 ? 'text-green-500' : 'text-red-500'}`}>
              {pnlPercent >= 0 ? '+' : ''}{pnlPercent.toFixed(2)}%
            </span>
          </div>
        </div>
        
        <div class="grid grid-cols-2 gap-4">
          <div class="bg-black/30 p-3 rounded-xl">
            <p class="text-xs text-gray-400 mb-1">Total P&L</p>
            <p class={`font-bold ${totalPnL >= 0 ? 'text-green-500' : 'text-red-500'}`}>
              {totalPnL >= 0 ? '+' : ''}${Math.abs(totalPnL).toFixed(2)}
            </p>
          </div>
          <div class="bg-black/30 p-3 rounded-xl">
            <p class="text-xs text-gray-400 mb-1">24h Change</p>
            <p class="font-bold text-white">+${(totalValue * 0.034).toFixed(2)}</p>
          </div>
        </div>
      </div>

      {/* Performance Chart */}
      <div class="bg-[#1C1C1E] rounded-2xl p-4 border border-white/5">
        <div class="flex justify-between items-center mb-4">
          <h3 class="font-bold text-lg">Performance</h3>
          <div class="flex gap-2">
            {(['1D', '1W', '1M', '1Y'] as const).map(tf => (
              <button
                key={tf}
                onClick={() => setTimeframe(tf)}
                class={`px-3 py-1 rounded-lg text-xs font-bold transition-colors ${
                  timeframe === tf ? 'bg-[#AB9FF2] text-black' : 'bg-[#0C0C0C] text-gray-400'
                }`}
              >
                {tf}
              </button>
            ))}
          </div>
        </div>
        <ResponsiveContainer width="100%" height={200}>
          <LineChart data={performanceData}>
            <XAxis dataKey="time" stroke="#666" style={{ fontSize: 10 }} />
            <YAxis hide />
            <Tooltip
              contentStyle={{ backgroundColor: '#1C1C1E', border: 'none', borderRadius: '8px', fontSize: '12px' }}
              itemStyle={{ color: '#fff' }}
            />
            <Line type="monotone" dataKey="value" stroke="#AB9FF2" strokeWidth={3} dot={false} />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* Asset Allocation */}
      <div class="bg-[#1C1C1E] rounded-2xl p-4 border border-white/5">
        <h3 class="font-bold text-lg mb-4">Asset Allocation</h3>
        <div class="flex items-center gap-6">
          <ResponsiveContainer width={140} height={140}>
            <PieChart>
              <Pie
                data={portfolioData}
                cx="50%"
                cy="50%"
                innerRadius={40}
                outerRadius={60}
                paddingAngle={2}
                dataKey="value"
              >
                {portfolioData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
            </PieChart>
          </ResponsiveContainer>
          <div class="flex-1 flex flex-col gap-2">
            {portfolioData.map((item, i) => (
              <div key={i} class="flex items-center justify-between">
                <div class="flex items-center gap-2">
                  <div class="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }} />
                  <span class="text-sm font-medium">{item.name}</span>
                </div>
                <span class="text-sm font-bold">{item.value.toFixed(1)}%</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Top Gainers/Losers */}
      <div class="bg-[#1C1C1E] rounded-2xl p-4 border border-white/5">
        <h3 class="font-bold text-lg mb-3">Today's Movers</h3>
        <div class="flex flex-col gap-2">
          {tokens.sort((a, b) => Math.abs(b.change24h) - Math.abs(a.change24h)).slice(0, 3).map(token => (
            <div key={token.id} class="flex items-center justify-between p-2 rounded-xl hover:bg-white/5 transition-colors">
              <div class="flex items-center gap-3">
                <img src={token.image} class="w-8 h-8 rounded-full" />
                <span class="font-medium">{token.symbol}</span>
              </div>
              <div class="text-right">
                <div class={`font-bold ${token.change24h >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                  {token.change24h >= 0 ? '+' : ''}{token.change24h.toFixed(2)}%
                </div>
                <div class="text-xs text-gray-400">${token.price.toFixed(2)}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
