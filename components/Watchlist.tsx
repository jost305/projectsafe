import React, { useState } from 'react';
import { Token } from '../types';
import { Search, Heart, ArrowUpRight, ArrowDownRight, Plus } from 'lucide-react';
import { MARKET_TOKENS } from '../constants';

interface WatchlistProps {
  watchlistIds: string[];
  toggleWatchlist: (id: string) => void;
}

export const Watchlist: React.FC<WatchlistProps> = ({ watchlistIds, toggleWatchlist }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [sortConfig, setSortConfig] = useState<'price' | 'change' | 'rank'>('rank');

  // Determine source: If searching, search global market. If not, show only watchlist.
  const sourceTokens = searchTerm ? MARKET_TOKENS : MARKET_TOKENS.filter(t => watchlistIds.includes(t.id));

  const filteredTokens = sourceTokens.filter(token => 
    token.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    token.symbol.toLowerCase().includes(searchTerm.toLowerCase())
  ).sort((a, b) => {
    if (sortConfig === 'price') return b.price - a.price;
    if (sortConfig === 'change') return Math.abs(b.change24h) - Math.abs(a.change24h);
    return (b.marketCap || 0) - (a.marketCap || 0);
  });

  return (
    <div class="animate-fade-in flex flex-col h-full">
       <div class="flex gap-2 mb-4">
          <div class="relative flex-1">
             <Search class="absolute left-3 top-2.5 text-gray-500" size={16} />
             <input 
               type="text" 
               placeholder="Search to add tokens" 
               value={searchTerm}
               onChange={(e) => setSearchTerm((e.target as HTMLInputElement).value)}
               class="w-full bg-[#1C1C1E] rounded-xl py-2 pl-10 pr-4 text-sm focus:outline-none focus:ring-1 focus:ring-[#AB9FF2] text-white placeholder-gray-500 transition-shadow" 
             />
          </div>
          <button 
             onClick={() => setSortConfig(prev => prev === 'rank' ? 'change' : prev === 'change' ? 'price' : 'rank')}
             class="px-3 bg-[#1C1C1E] rounded-xl text-xs font-bold text-gray-400 hover:text-white transition-colors"
          >
             {sortConfig === 'rank' ? 'Rank' : sortConfig === 'change' ? 'Vol' : 'Price'}
          </button>
       </div>

       <div class="flex flex-col gap-2 pb-20 overflow-y-auto scrollbar-hide">
          {filteredTokens.length === 0 && !searchTerm && (
            <div class="flex flex-col items-center justify-center py-10 text-center px-4">
              <div class="w-12 h-12 bg-[#1C1C1E] rounded-full flex items-center justify-center mb-3">
                <Heart class="text-gray-600" size={24} />
              </div>
              <p class="text-gray-300 font-bold mb-1">Your watchlist is empty</p>
              <p class="text-sm text-gray-500">Search for tokens above to add them to your watchlist.</p>
            </div>
          )}

          {filteredTokens.map((token) => {
             const isWatched = watchlistIds.includes(token.id);
             return (
               <div key={token.id} class="flex items-center justify-between p-3 rounded-2xl bg-[#0C0C0C] hover:bg-[#1C1C1E] border border-transparent hover:border-white/5 transition-all cursor-pointer active:scale-[0.99] group">
                  <div class="flex items-center gap-3">
                     <img src={token.image} alt={token.name} class="w-10 h-10 rounded-full" />
                     <div class="flex flex-col">
                        <span class="font-bold text-sm text-white">{token.name}</span>
                        <span class="text-xs text-gray-500 flex items-center gap-1">
                          {token.symbol} 
                          <span class={`w-1.5 h-1.5 rounded-full ${token.network === 'SOL' ? 'bg-[#AB9FF2]' : token.network === 'ETH' ? 'bg-blue-400' : 'bg-orange-400'}`}></span>
                        </span>
                     </div>
                  </div>
                  
                  <div class="flex items-center gap-4">
                     <div class="flex flex-col items-end">
                        <span class="font-bold text-sm">${token.price.toLocaleString(undefined, { maximumFractionDigits: token.price < 1 ? 6 : 2 })}</span>
                        <span class={`text-xs font-medium flex items-center ${token.change24h >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                           {token.change24h >= 0 ? <ArrowUpRight size={12} /> : <ArrowDownRight size={12} />}
                           {Math.abs(token.change24h)}%
                        </span>
                     </div>
                     <button 
                       onClick={(e) => { e.stopPropagation(); toggleWatchlist(token.id); }}
                       class={`w-8 h-8 rounded-full flex items-center justify-center transition-all ${isWatched ? 'bg-[#AB9FF2]/20 text-[#AB9FF2]' : 'bg-[#1C1C1E] text-gray-500 hover:text-white'}`}
                     >
                        {isWatched ? <Heart size={16} fill="currentColor" /> : <Plus size={16} />}
                     </button>
                  </div>
               </div>
             );
          })}
       </div>
    </div>
  );
};