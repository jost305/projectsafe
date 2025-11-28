import React, { useState } from 'react';
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import { CHART_DATA } from '../constants';
import { ArrowUpRight, ArrowDownRight, Activity } from 'lucide-react';

export const ProTerminal: React.FC = () => {
  return (
    <div class="flex flex-col h-full bg-[#0C0C0C] animate-fade-in">
      {/* Header Stat */}
      <div class="px-4 py-4 border-b border-white/5">
        <div class="flex justify-between items-start">
          <div>
            <h2 class="text-2xl font-bold text-white flex items-center gap-2">
              SOL / USDC <span class="text-xs bg-white/10 px-2 py-0.5 rounded text-gray-300">1H</span>
            </h2>
            <div class="flex items-center gap-2 mt-1">
              <span class="text-3xl font-bold">$142.50</span>
              <span class="text-green-500 flex items-center text-sm font-medium">
                <ArrowUpRight size={14} /> 5.4%
              </span>
            </div>
          </div>
          <div class="text-right">
             <div class="text-xs text-gray-500">24h Vol</div>
             <div class="text-white font-medium">$1.2B</div>
          </div>
        </div>
      </div>

      {/* Chart */}
      <div class="h-64 w-full bg-[#0C0C0C] relative">
        <div class="absolute top-2 right-4 flex gap-2">
            <span class="text-[10px] text-gray-500 bg-[#1C1C1E] px-2 py-1 rounded">CANDLE</span>
            <span class="text-[10px] text-[#AB9FF2] bg-[#1C1C1E] px-2 py-1 rounded border border-[#AB9FF2]/30">LINE</span>
        </div>
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={CHART_DATA}>
            <defs>
              <linearGradient id="colorPrice" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stop-color="#22c55e" stop-opacity={0.2}/>
                <stop offset="95%" stop-color="#22c55e" stop-opacity={0}/>
              </linearGradient>
            </defs>
            <Tooltip 
              contentStyle={{ backgroundColor: '#1C1C1E', border: 'none', borderRadius: '8px' }}
              itemStyle={{ color: '#fff' }}
            />
            <Area 
              type="monotone" 
              dataKey="price" 
              stroke="#22c55e" 
              fillOpacity={1} 
              fill="url(#colorPrice)" 
              strokeWidth={2}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      {/* Order Book Visualization */}
      <div class="flex-1 px-4 py-4 gap-4 flex flex-col">
        <div class="flex justify-between text-xs text-gray-500 mb-2">
            <span>Order Book</span>
            <span>Spread: 0.02%</span>
        </div>
        
        <div class="flex gap-2 h-full min-h-[120px]">
            {/* Bids */}
            <div class="flex-1 flex flex-col gap-1">
                {[...Array(6)].map((_, i) => (
                    <div key={`bid-${i}`} class="relative h-6 flex items-center justify-between px-2 overflow-hidden rounded bg-[#1C1C1E]">
                        <div class="absolute left-0 top-0 bottom-0 bg-green-500/10 z-0" style={{ width: `${Math.random() * 80 + 10}%`}} />
                        <span class="relative z-10 text-green-500 text-xs font-mono">{(142.50 - (i * 0.05)).toFixed(2)}</span>
                        <span class="relative z-10 text-gray-400 text-[10px] font-mono">{(Math.random() * 100).toFixed(1)}K</span>
                    </div>
                ))}
            </div>
            {/* Asks */}
            <div class="flex-1 flex flex-col gap-1">
                {[...Array(6)].map((_, i) => (
                    <div key={`ask-${i}`} class="relative h-6 flex items-center justify-between px-2 overflow-hidden rounded bg-[#1C1C1E]">
                         <div class="absolute right-0 top-0 bottom-0 bg-red-500/10 z-0" style={{ width: `${Math.random() * 80 + 10}%`}} />
                        <span class="relative z-10 text-red-500 text-xs font-mono">{(142.50 + (i * 0.05)).toFixed(2)}</span>
                        <span class="relative z-10 text-gray-400 text-[10px] font-mono">{(Math.random() * 100).toFixed(1)}K</span>
                    </div>
                ))}
            </div>
        </div>
      </div>

       {/* Trending Ticker */}
       <div class="h-10 bg-[#1C1C1E] flex items-center overflow-hidden border-t border-white/5">
         <div class="flex gap-6 animate-marquee whitespace-nowrap px-4">
             <span class="text-xs font-bold text-white flex gap-1">🔥 TRENDING:</span>
             <span class="text-xs text-gray-300">WIF <span class="text-red-400">-2.1%</span></span>
             <span class="text-xs text-gray-300">POPCAT <span class="text-green-400">+12.5%</span></span>
             <span class="text-xs text-gray-300">JUP <span class="text-green-400">+5.1%</span></span>
             <span class="text-xs text-gray-300">BONK <span class="text-green-400">+15.2%</span></span>
         </div>
       </div>

       {/* Action Bar */}
       <div class="p-4 grid grid-cols-2 gap-3">
           <button class="bg-[#22c55e] text-black font-bold py-3 rounded-xl active:scale-95 transition-transform">Buy</button>
           <button class="bg-[#ef4444] text-white font-bold py-3 rounded-xl active:scale-95 transition-transform">Sell</button>
       </div>
    </div>
  );
};