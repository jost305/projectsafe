import React, { useState, useEffect } from 'react';
import { Fuel, Clock, TrendingUp, TrendingDown, AlertTriangle, CheckCircle, Zap, Timer } from 'lucide-react';
import { GasPrice } from '../types';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, Area, AreaChart } from 'recharts';

const MOCK_GAS_PRICES: Record<string, GasPrice> = {
  Ethereum: {
    chain: 'Ethereum',
    slow: 15,
    standard: 22,
    fast: 35,
    instant: 50,
    baseFee: 18,
    congestionLevel: 'medium',
    estimatedTime: { slow: '~10 min', standard: '~3 min', fast: '~30 sec', instant: '~15 sec' }
  },
  Polygon: {
    chain: 'Polygon',
    slow: 30,
    standard: 45,
    fast: 80,
    instant: 120,
    baseFee: 35,
    congestionLevel: 'low',
    estimatedTime: { slow: '~30 sec', standard: '~15 sec', fast: '~5 sec', instant: '~2 sec' }
  },
  Arbitrum: {
    chain: 'Arbitrum',
    slow: 0.1,
    standard: 0.15,
    fast: 0.25,
    instant: 0.4,
    baseFee: 0.12,
    congestionLevel: 'low',
    estimatedTime: { slow: '~30 sec', standard: '~10 sec', fast: '~5 sec', instant: '~2 sec' }
  },
  Base: {
    chain: 'Base',
    slow: 0.005,
    standard: 0.008,
    fast: 0.012,
    instant: 0.02,
    baseFee: 0.006,
    congestionLevel: 'low',
    estimatedTime: { slow: '~20 sec', standard: '~10 sec', fast: '~5 sec', instant: '~2 sec' }
  }
};

const HISTORICAL_GAS = [
  { time: '00:00', price: 25 },
  { time: '04:00', price: 18 },
  { time: '08:00', price: 35 },
  { time: '12:00', price: 45 },
  { time: '16:00', price: 38 },
  { time: '20:00', price: 28 },
  { time: 'Now', price: 22 },
];

const BEST_TIMES = [
  { day: 'Saturday', time: '2-6 AM UTC', avgGwei: 12 },
  { day: 'Sunday', time: '4-8 AM UTC', avgGwei: 14 },
  { day: 'Weekdays', time: '1-5 AM UTC', avgGwei: 18 },
];

export const GasOptimizer: React.FC = () => {
  const [selectedChain, setSelectedChain] = useState('Ethereum');
  const [selectedSpeed, setSelectedSpeed] = useState<'slow' | 'standard' | 'fast' | 'instant'>('standard');
  const gasData = MOCK_GAS_PRICES[selectedChain];

  const getCongestionColor = (level: string) => {
    switch (level) {
      case 'low': return 'text-green-500 bg-green-500/10';
      case 'medium': return 'text-yellow-500 bg-yellow-500/10';
      case 'high': return 'text-red-500 bg-red-500/10';
      default: return 'text-gray-500 bg-gray-500/10';
    }
  };

  const getCongestionIcon = (level: string) => {
    switch (level) {
      case 'low': return <CheckCircle size={14} />;
      case 'medium': return <AlertTriangle size={14} />;
      case 'high': return <Zap size={14} />;
      default: return null;
    }
  };

  const speedOptions = [
    { id: 'slow' as const, label: 'Slow', icon: Timer },
    { id: 'standard' as const, label: 'Standard', icon: Clock },
    { id: 'fast' as const, label: 'Fast', icon: Zap },
    { id: 'instant' as const, label: 'Instant', icon: Fuel },
  ];

  return (
    <div className="flex flex-col gap-4 animate-fade-in">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Fuel size={20} className="text-[#AB9FF2]" />
          <h3 className="font-bold text-lg">Gas Optimizer</h3>
        </div>
        <div className={`flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${getCongestionColor(gasData.congestionLevel)}`}>
          {getCongestionIcon(gasData.congestionLevel)}
          {gasData.congestionLevel.charAt(0).toUpperCase() + gasData.congestionLevel.slice(1)} Traffic
        </div>
      </div>

      <div className="flex gap-2 overflow-x-auto scrollbar-hide pb-2">
        {Object.keys(MOCK_GAS_PRICES).map(chain => (
          <button
            key={chain}
            onClick={() => setSelectedChain(chain)}
            className={`px-4 py-2 rounded-xl whitespace-nowrap transition-all ${
              selectedChain === chain 
                ? 'bg-[#AB9FF2] text-black font-bold' 
                : 'bg-[#1C1C1E] text-gray-400 hover:text-white'
            }`}
          >
            {chain}
          </button>
        ))}
      </div>

      <div className="bg-gradient-to-br from-[#AB9FF2]/10 to-[#1C1C1E] rounded-2xl p-4 border border-white/10">
        <div className="flex justify-between items-start mb-4">
          <div>
            <p className="text-sm text-gray-400">Current Base Fee</p>
            <p className="text-3xl font-bold">{gasData.baseFee} <span className="text-sm text-gray-500">Gwei</span></p>
          </div>
          <div className="text-right">
            <p className="text-sm text-gray-400">Est. Cost (21k gas)</p>
            <p className="text-lg font-bold">${((gasData[selectedSpeed] * 21000) / 1e9 * 2650).toFixed(2)}</p>
          </div>
        </div>

        <div className="grid grid-cols-4 gap-2">
          {speedOptions.map(option => (
            <button
              key={option.id}
              onClick={() => setSelectedSpeed(option.id)}
              className={`flex flex-col items-center p-3 rounded-xl transition-all ${
                selectedSpeed === option.id 
                  ? 'bg-[#AB9FF2]/20 border-2 border-[#AB9FF2]' 
                  : 'bg-black/30 border-2 border-transparent hover:border-white/10'
              }`}
            >
              <option.icon size={18} className={selectedSpeed === option.id ? 'text-[#AB9FF2]' : 'text-gray-400'} />
              <span className="text-xs mt-1 font-medium">{option.label}</span>
              <span className="text-sm font-bold mt-1">{gasData[option.id]}</span>
              <span className="text-[10px] text-gray-500">{gasData.estimatedTime[option.id]}</span>
            </button>
          ))}
        </div>
      </div>

      <div className="bg-[#1C1C1E] rounded-2xl p-4 border border-white/5">
        <h4 className="font-bold mb-3 flex items-center gap-2">
          <TrendingUp size={16} className="text-[#AB9FF2]" />
          24H Gas Price Trend
        </h4>
        <ResponsiveContainer width="100%" height={120}>
          <AreaChart data={HISTORICAL_GAS}>
            <defs>
              <linearGradient id="gasGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#AB9FF2" stopOpacity={0.3}/>
                <stop offset="95%" stopColor="#AB9FF2" stopOpacity={0}/>
              </linearGradient>
            </defs>
            <XAxis dataKey="time" stroke="#666" style={{ fontSize: 10 }} />
            <YAxis hide />
            <Tooltip
              contentStyle={{ backgroundColor: '#1C1C1E', border: 'none', borderRadius: '8px', fontSize: '12px' }}
              formatter={(value: number) => [`${value} Gwei`, 'Gas Price']}
            />
            <Area type="monotone" dataKey="price" stroke="#AB9FF2" fill="url(#gasGradient)" strokeWidth={2} />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      <div className="bg-[#1C1C1E] rounded-2xl p-4 border border-white/5">
        <h4 className="font-bold mb-3 flex items-center gap-2">
          <Clock size={16} className="text-green-500" />
          Best Times to Transact
        </h4>
        <div className="flex flex-col gap-2">
          {BEST_TIMES.map((item, index) => (
            <div key={index} className="flex items-center justify-between p-3 bg-black/30 rounded-xl">
              <div>
                <span className="font-medium">{item.day}</span>
                <span className="text-sm text-gray-500 ml-2">{item.time}</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-green-500 font-bold">~{item.avgGwei} Gwei</span>
                <span className="text-xs text-gray-500 bg-green-500/10 px-2 py-0.5 rounded">
                  {Math.round((1 - item.avgGwei / gasData.standard) * 100)}% savings
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="bg-gradient-to-r from-green-500/10 to-transparent rounded-xl p-4 border border-green-500/20">
        <div className="flex items-start gap-3">
          <CheckCircle size={20} className="text-green-500 mt-0.5" />
          <div>
            <h4 className="font-bold text-green-500">Recommendation</h4>
            <p className="text-sm text-gray-400 mt-1">
              {gasData.congestionLevel === 'low' 
                ? 'Network is calm. Great time to make transactions!'
                : gasData.congestionLevel === 'medium'
                ? 'Moderate traffic. Consider waiting 1-2 hours for lower fees.'
                : 'High congestion. Best to wait or use a faster tier for urgent transactions.'}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
