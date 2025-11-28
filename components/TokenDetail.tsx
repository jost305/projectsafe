import React from 'react';
import { Token } from '../types';
import { ArrowLeft, ArrowUpRight, ArrowDownRight, Share, Sparkles, Activity } from 'lucide-react';
import { AreaChart, Area, ResponsiveContainer, Tooltip } from 'recharts';
import { CHART_DATA } from '../constants';

interface TokenDetailProps {
  token: Token;
  onBack: () => void;
  onStake: () => void;
  onBuy: () => void;
  onSwap: () => void;
}

export const TokenDetail: React.FC<TokenDetailProps> = ({ token, onBack, onStake, onBuy, onSwap }) => {
  return (
    <div class="fixed inset-0 z-40 bg-[#0C0C0C] flex flex-col animate-slide-up overflow-y-auto">
       {/* Navbar */}
       <div class="px-4 py-4 flex justify-between items-center sticky top-0 bg-[#0C0C0C]/90 backdrop-blur-md z-10">
          <button onClick={onBack} class="p-2 -ml-2 hover:bg-white/5 rounded-full transition-colors">
             <ArrowLeft size={24} />
          </button>
          <div class="font-bold text-lg">{token.name}</div>
          <button class="p-2 -mr-2 hover:bg-white/5 rounded-full transition-colors">
             <Share size={20} />
          </button>
       </div>

       {/* Price Header */}
       <div class="px-6 pt-2 pb-6 text-center">
          <div class="text-sm text-gray-500 mb-1">Current Price</div>
          <div class="text-4xl font-extrabold mb-2">${token.price.toLocaleString()}</div>
          <div class={`inline-flex items-center gap-1 px-2 py-1 rounded-lg font-bold text-sm ${token.change24h >= 0 ? 'bg-green-500/10 text-green-500' : 'bg-red-500/10 text-red-500'}`}>
             {token.change24h >= 0 ? <ArrowUpRight size={16} /> : <ArrowDownRight size={16} />}
             {Math.abs(token.change24h)}% (24h)
          </div>
       </div>

       {/* Mini Chart */}
       <div class="h-48 w-full mb-6">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={CHART_DATA}>
              <defs>
                <linearGradient id="gradientColor" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stop-color={token.change24h >= 0 ? '#22c55e' : '#ef4444'} stop-opacity={0.2}/>
                  <stop offset="95%" stop-color={token.change24h >= 0 ? '#22c55e' : '#ef4444'} stop-opacity={0}/>
                </linearGradient>
              </defs>
              <Tooltip content={() => null} cursor={{ stroke: 'white', strokeWidth: 1, strokeDasharray: '3 3' }} />
              <Area 
                type="monotone" 
                dataKey="price" 
                stroke={token.change24h >= 0 ? '#22c55e' : '#ef4444'} 
                fill="url(#gradientColor)" 
                strokeWidth={2}
              />
            </AreaChart>
          </ResponsiveContainer>
       </div>

       {/* User Balance */}
       <div class="px-5 mb-6">
          <div class="bg-[#1C1C1E] rounded-2xl p-4 flex justify-between items-center border border-white/5">
             <div class="flex flex-col">
                <span class="text-gray-400 text-xs font-bold mb-1">Your Balance</span>
                <span class="text-xl font-bold text-white">{token.balance} {token.symbol}</span>
                <span class="text-xs text-gray-500">≈ ${(token.balance * token.price).toLocaleString()}</span>
             </div>
             {token.balance > 0 && (
                <div class="h-10 w-10 bg-[#AB9FF2]/10 rounded-full flex items-center justify-center">
                   <img src={token.image} class="w-6 h-6 rounded-full" />
                </div>
             )}
          </div>
       </div>

       {/* Staking Callout (Only for SOL) */}
       {token.symbol === 'SOL' && (
          <div class="px-5 mb-6">
             <div class="bg-gradient-to-r from-purple-900/50 to-indigo-900/50 rounded-2xl p-4 border border-[#AB9FF2]/30 flex justify-between items-center">
                <div>
                   <div class="flex items-center gap-2 mb-1">
                      <Sparkles size={16} class="text-[#AB9FF2]" />
                      <span class="font-bold text-[#AB9FF2]">Earn 7.5% APY</span>
                   </div>
                   <p class="text-xs text-gray-300 max-w-[200px]">Stake your SOL to help secure the network and earn rewards.</p>
                </div>
                <button 
                  onClick={onStake}
                  class="bg-[#AB9FF2] text-black px-4 py-2 rounded-xl font-bold text-sm hover:scale-105 transition-transform"
                >
                   Stake
                </button>
             </div>
          </div>
       )}

       {/* About Section */}
       <div class="px-5 mb-24">
          <h3 class="font-bold text-lg mb-3">About {token.name}</h3>
          <p class="text-gray-400 text-sm leading-relaxed">
             {token.description || `${token.name} is a cryptocurrency operating on the ${token.network} network.`}
          </p>
          
          <div class="grid grid-cols-2 gap-4 mt-6">
             <div class="bg-[#1C1C1E] p-3 rounded-xl">
                <div class="text-gray-500 text-xs mb-1">Market Cap</div>
                <div class="font-bold">${(token.marketCap || 0).toLocaleString()}</div>
             </div>
             <div class="bg-[#1C1C1E] p-3 rounded-xl">
                <div class="text-gray-500 text-xs mb-1">Volume (24h)</div>
                <div class="font-bold">$1.2B</div>
             </div>
          </div>
       </div>

       {/* Floating Action Buttons */}
       <div class="fixed bottom-0 left-0 right-0 p-5 bg-[#0C0C0C]/90 backdrop-blur-xl border-t border-white/5 flex gap-3 max-w-md mx-auto">
          <button onClick={onBuy} class="flex-1 bg-[#22c55e] text-black font-bold h-12 rounded-xl active:scale-95 transition-transform">Buy</button>
          <button onClick={onSwap} class="flex-1 bg-[#1C1C1E] text-white font-bold h-12 rounded-xl active:scale-95 transition-transform">Swap</button>
       </div>
    </div>
  );
};