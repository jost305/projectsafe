import React, { useState, useEffect } from 'react';
import { TrendingUp, TrendingDown, Flame, Sparkles, Rocket, ArrowUpRight, ArrowDownRight, Star, Plus } from 'lucide-react';
import { TrendingToken } from '../types';

const MOCK_TRENDING: TrendingToken[] = [
  { id: '1', symbol: 'WIF', name: 'dogwifhat', price: 2.45, change1h: 2.3, change24h: 15.2, change7d: 45.8, volume24h: 450000000, marketCap: 2400000000, image: 'https://dd.dexscreener.com/ds-data/tokens/solana/EKpQGSJtjMFqKZ9KQanSqYXRcF8fBopzLHYxdM65zcjm.png?size=lg', rank: 1 },
  { id: '2', symbol: 'POPCAT', name: 'Popcat', price: 0.45, change1h: -1.2, change24h: 12.5, change7d: 89.2, volume24h: 180000000, marketCap: 450000000, image: 'https://dd.dexscreener.com/ds-data/tokens/solana/7GCihgDB8fe6KNjn2MYtkzZcRjQy3t9GHdC8uHYmW2hr.png?size=lg', rank: 2 },
  { id: '3', symbol: 'PEPE', name: 'Pepe', price: 0.000008, change1h: 0.5, change24h: -4.5, change7d: 12.3, volume24h: 890000000, marketCap: 3000000000, image: 'https://cryptologos.cc/logos/pepe-pepe-logo.png?v=029', rank: 3 },
  { id: '4', symbol: 'BONK', name: 'Bonk', price: 0.000024, change1h: 1.8, change24h: 8.7, change7d: -5.2, volume24h: 320000000, marketCap: 1500000000, image: 'https://cryptologos.cc/logos/bonk1-bonk-logo.png?v=029', rank: 4 },
  { id: '5', symbol: 'JUP', name: 'Jupiter', price: 1.12, change1h: -0.3, change24h: 5.1, change7d: 22.4, volume24h: 210000000, marketCap: 1200000000, image: 'https://static.jup.ag/jup/icon.png', rank: 5 },
];

const MOCK_GAINERS: TrendingToken[] = [
  { id: '6', symbol: 'RNDR', name: 'Render', price: 7.80, change1h: 3.2, change24h: 25.6, change7d: 45.2, volume24h: 150000000, marketCap: 4000000000, image: 'https://cryptologos.cc/logos/render-token-rndr-logo.png?v=029', rank: 1 },
  { id: '7', symbol: 'FET', name: 'Fetch.AI', price: 2.35, change1h: 2.1, change24h: 18.9, change7d: 32.1, volume24h: 95000000, marketCap: 1800000000, image: 'https://cryptologos.cc/logos/fetch-fet-logo.png?v=029', rank: 2 },
  { id: '8', symbol: 'NEAR', name: 'NEAR Protocol', price: 6.45, change1h: 1.5, change24h: 15.2, change7d: 28.4, volume24h: 280000000, marketCap: 6500000000, image: 'https://cryptologos.cc/logos/near-protocol-near-logo.png?v=029', rank: 3 },
];

const MOCK_LOSERS: TrendingToken[] = [
  { id: '9', symbol: 'DOGE', name: 'Dogecoin', price: 0.082, change1h: -1.2, change24h: -12.5, change7d: -18.3, volume24h: 520000000, marketCap: 12000000000, image: 'https://cryptologos.cc/logos/dogecoin-doge-logo.png?v=029', rank: 1 },
  { id: '10', symbol: 'SHIB', name: 'Shiba Inu', price: 0.0000082, change1h: -0.8, change24h: -8.9, change7d: -15.2, volume24h: 180000000, marketCap: 4800000000, image: 'https://cryptologos.cc/logos/shiba-inu-shib-logo.png?v=029', rank: 2 },
];

const MOCK_NEW_LAUNCHES: TrendingToken[] = [
  { id: '11', symbol: 'MOCA', name: 'Moca Network', price: 0.125, change1h: 45.2, change24h: 120.5, change7d: 0, volume24h: 85000000, marketCap: 250000000, image: 'https://ui-avatars.com/api/?name=MOCA&background=random', rank: 1, isNew: true },
  { id: '12', symbol: 'GRASS', name: 'Grass', price: 2.85, change1h: 12.3, change24h: 85.2, change7d: 0, volume24h: 120000000, marketCap: 420000000, image: 'https://ui-avatars.com/api/?name=GRASS&background=random', rank: 2, isNew: true },
];

type TabType = 'trending' | 'gainers' | 'losers' | 'new';

export const TokenDiscovery: React.FC = () => {
  const [activeTab, setActiveTab] = useState<TabType>('trending');
  const [watchlist, setWatchlist] = useState<string[]>([]);

  const toggleWatchlist = (id: string) => {
    setWatchlist(prev => prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]);
  };

  const tabs = [
    { id: 'trending' as const, label: 'Trending', icon: Flame },
    { id: 'gainers' as const, label: 'Gainers', icon: TrendingUp },
    { id: 'losers' as const, label: 'Losers', icon: TrendingDown },
    { id: 'new' as const, label: 'New', icon: Rocket },
  ];

  const getTokens = () => {
    switch (activeTab) {
      case 'trending': return MOCK_TRENDING;
      case 'gainers': return MOCK_GAINERS;
      case 'losers': return MOCK_LOSERS;
      case 'new': return MOCK_NEW_LAUNCHES;
      default: return [];
    }
  };

  const formatPrice = (price: number) => {
    if (price < 0.0001) return price.toExponential(2);
    if (price < 1) return price.toFixed(6);
    return price.toFixed(2);
  };

  const formatVolume = (volume: number) => {
    if (volume >= 1e9) return `$${(volume / 1e9).toFixed(1)}B`;
    if (volume >= 1e6) return `$${(volume / 1e6).toFixed(1)}M`;
    return `$${(volume / 1e3).toFixed(1)}K`;
  };

  return (
    <div className="flex flex-col gap-4 animate-fade-in">
      <div className="flex items-center gap-2 mb-2">
        <Sparkles size={20} className="text-[#AB9FF2]" />
        <h3 className="font-bold text-lg">Discover</h3>
      </div>

      <div className="flex gap-2 overflow-x-auto scrollbar-hide pb-2">
        {tabs.map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl whitespace-nowrap transition-all ${
              activeTab === tab.id 
                ? 'bg-[#AB9FF2] text-black font-bold' 
                : 'bg-[#1C1C1E] text-gray-400 hover:text-white'
            }`}
          >
            <tab.icon size={16} />
            {tab.label}
          </button>
        ))}
      </div>

      <div className="flex flex-col gap-2">
        {getTokens().map((token, index) => (
          <div
            key={token.id}
            className="bg-[#1C1C1E] rounded-xl p-4 hover:bg-[#252528] transition-colors cursor-pointer"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="relative">
                  <span className="absolute -top-1 -left-1 text-xs font-bold text-[#AB9FF2] bg-black/50 rounded-full w-5 h-5 flex items-center justify-center">
                    {token.rank}
                  </span>
                  <img src={token.image} alt={token.symbol} className="w-10 h-10 rounded-full" />
                  {token.isNew && (
                    <span className="absolute -bottom-1 -right-1 bg-green-500 text-[8px] px-1 rounded text-white font-bold">
                      NEW
                    </span>
                  )}
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-bold">{token.symbol}</span>
                    <button 
                      onClick={(e) => { e.stopPropagation(); toggleWatchlist(token.id); }}
                      className="hover:scale-110 transition-transform"
                    >
                      <Star 
                        size={14} 
                        className={watchlist.includes(token.id) ? 'text-yellow-500 fill-yellow-500' : 'text-gray-600'} 
                      />
                    </button>
                  </div>
                  <span className="text-xs text-gray-500">{token.name}</span>
                </div>
              </div>
              <div className="text-right">
                <div className="font-bold">${formatPrice(token.price)}</div>
                <div className={`flex items-center justify-end gap-1 text-xs ${
                  token.change24h >= 0 ? 'text-green-500' : 'text-red-500'
                }`}>
                  {token.change24h >= 0 ? <ArrowUpRight size={12} /> : <ArrowDownRight size={12} />}
                  {Math.abs(token.change24h).toFixed(1)}%
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between mt-3 pt-3 border-t border-white/5">
              <div className="grid grid-cols-3 gap-4 flex-1">
                <div>
                  <span className="text-[10px] text-gray-500 block">1H</span>
                  <span className={`text-xs font-medium ${token.change1h >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                    {token.change1h >= 0 ? '+' : ''}{token.change1h.toFixed(1)}%
                  </span>
                </div>
                <div>
                  <span className="text-[10px] text-gray-500 block">7D</span>
                  <span className={`text-xs font-medium ${token.change7d >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                    {token.change7d >= 0 ? '+' : ''}{token.change7d.toFixed(1)}%
                  </span>
                </div>
                <div>
                  <span className="text-[10px] text-gray-500 block">Vol 24H</span>
                  <span className="text-xs font-medium">{formatVolume(token.volume24h)}</span>
                </div>
              </div>
              <button className="ml-4 px-3 py-1.5 bg-[#AB9FF2]/20 text-[#AB9FF2] rounded-lg text-xs font-bold hover:bg-[#AB9FF2]/30 transition-colors">
                Trade
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
