
import React, { useState } from 'react';
import { TrendingUp, TrendingDown, Star, MoreHorizontal, RefreshCw, Filter, Search, X, Copy } from 'lucide-react';
import { INITIAL_TOKENS, MARKET_TOKENS } from '../constants';

interface TokenCard {
  id: string;
  symbol: string;
  name: string;
  price: number;
  change1h: number;
  change24h: number;
  marketCap: number;
  volume: number;
  image: string;
  category: 'new' | 'migrating' | 'migrated';
  txCount: number;
  holders: number;
}

const MOCK_TERMINAL_TOKENS: TokenCard[] = [
  {
    id: '1',
    symbol: 'ANNA',
    name: 'ANNA AI COIN',
    price: 0.0000041,
    change1h: 1,
    change24h: 1,
    marketCap: 4100,
    volume: 728690,
    image: 'https://picsum.photos/seed/anna/100',
    category: 'new',
    txCount: 5,
    holders: 2
  },
  {
    id: '2',
    symbol: 'Runner',
    name: 'Donald Gump',
    price: 0.0000042,
    change1h: 2,
    change24h: 2,
    marketCap: 4200,
    volume: 451000,
    image: 'https://picsum.photos/seed/runner/100',
    category: 'new',
    txCount: 3,
    holders: 2
  },
  {
    id: '3',
    symbol: 'little',
    name: 'bots',
    price: 0.0000039,
    change1h: 0,
    change24h: 0,
    marketCap: 3900,
    volume: 1100,
    image: 'https://picsum.photos/seed/little/100',
    category: 'new',
    txCount: 10,
    holders: 1
  },
  {
    id: '4',
    symbol: 'NVIDIA',
    name: 'Nvidia',
    price: 0.0000078,
    change1h: -50,
    change24h: 0,
    marketCap: 7800,
    volume: 12830,
    image: 'https://picsum.photos/seed/nvidia/100',
    category: 'new',
    txCount: 4,
    holders: 3
  },
  {
    id: '5',
    symbol: 'zkLabs',
    name: 'zkLabs',
    price: 0.000052,
    change1h: -1,
    change24h: 17,
    marketCap: 32568,
    volume: 9823,
    image: 'https://picsum.photos/seed/zklabs/100',
    category: 'migrating',
    txCount: 4,
    holders: 2
  },
  {
    id: '6',
    symbol: 'SIR',
    name: 'Real Sim AI',
    price: 0.00128,
    change1h: 0,
    change24h: 1,
    marketCap: 32560,
    volume: 18280,
    image: 'https://picsum.photos/seed/sir/100',
    category: 'migrating',
    txCount: 3,
    holders: 2
  },
  {
    id: '7',
    symbol: 'SunBob',
    name: '刚宝宝',
    price: 0.000224,
    change1h: 75,
    change24h: 0,
    marketCap: 50700,
    volume: 12100,
    image: 'https://picsum.photos/seed/sunbob/100',
    category: 'migrating',
    txCount: 1640,
    holders: 224
  },
  {
    id: '8',
    symbol: 'OK',
    name: 'OK',
    price: 0.0035,
    change1h: 76,
    change24h: 0,
    marketCap: 238400,
    volume: 156200,
    image: 'https://picsum.photos/seed/ok/100',
    category: 'migrated',
    txCount: 567,
    holders: 159
  },
  {
    id: '9',
    symbol: 'ALIENS-3',
    name: 'aliens-test-tokens',
    price: 0.0000086,
    change1h: 46,
    change24h: 0,
    marketCap: 7490,
    volume: 5680,
    image: 'https://picsum.photos/seed/aliens/100',
    category: 'migrated',
    txCount: 4,
    holders: 3
  },
  {
    id: '10',
    symbol: 'JOTCHUA',
    name: 'Jotchua',
    price: 0.012,
    change1h: 25,
    change24h: 0,
    marketCap: 682968,
    volume: 107908,
    image: 'https://picsum.photos/seed/jotchua/100',
    category: 'migrated',
    txCount: 120,
    holders: 89
  }
];

export const Terminal: React.FC = () => {
  const [activeCategory, setActiveCategory] = useState<'new' | 'migrating' | 'migrated'>('new');
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState<'launches' | 'tokens' | 'perps' | 'portfolio'>('launches');

  const newTokens = MOCK_TERMINAL_TOKENS.filter(t => t.category === 'new');
  const migratingTokens = MOCK_TERMINAL_TOKENS.filter(t => t.category === 'migrating');
  const migratedTokens = MOCK_TERMINAL_TOKENS.filter(t => t.category === 'migrated');

  const TokenCardComponent = ({ token }: { token: TokenCard }) => {
    const formatNumber = (num: number) => {
      if (num >= 1000000) return `$${(num / 1000000).toFixed(1)}M`;
      if (num >= 1000) return `$${(num / 1000).toFixed(1)}K`;
      return `$${num.toFixed(0)}`;
    };

    // Calculate progress percentage (mock for now)
    const progressPercent = 29; // This would be calculated based on bonding curve progress
    const circumference = 201.06; // 2 * PI * r where r = 32
    const strokeDashoffset = circumference - (progressPercent / 100) * circumference;

    return (
      <div className="bg-transparent hover:bg-[#1A1A1A]/30 transition-colors cursor-pointer border-b border-white/5 py-3 px-0">
        <div className="flex items-start gap-3">
          {/* Token Image with Progress Ring */}
          <div className="relative flex-shrink-0">
            <div className="w-[58px] h-[58px] rounded-xl overflow-hidden">
              {token.image.startsWith('http') ? (
                <img src={token.image} className="w-full h-full object-cover" alt={token.symbol} />
              ) : (
                <div className="w-full h-full bg-[#2C2C2E] flex items-center justify-center">
                  <span className="text-white font-bold text-lg">{token.symbol.substring(0, 2)}</span>
                </div>
              )}
            </div>
            {/* Progress Circle SVG */}
            <svg className="absolute top-0 left-0 w-[66px] h-[66px] -translate-x-1 -translate-y-1" style={{ transform: 'translate(-4px, -4px) rotate(-90deg)' }}>
              <rect x="1" y="1" width="64" height="64" rx="12" ry="12" fill="none" stroke="#2C2C2E" strokeWidth="2"/>
              <rect 
                x="1" 
                y="1" 
                width="64" 
                height="64" 
                rx="12" 
                ry="12" 
                fill="none" 
                stroke="#AB9FF2" 
                strokeWidth="2"
                strokeDasharray={circumference}
                strokeDashoffset={strokeDashoffset}
                style={{ transition: 'stroke-dashoffset 0.3s ease' }}
              />
            </svg>
            {/* Platform Badge */}
            <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-[#1A1A1A] rounded-full flex items-center justify-center">
              <div className="w-3.5 h-3.5 bg-purple-500 rounded-full" />
            </div>
          </div>

          {/* Token Info */}
          <div className="flex-1 min-w-0 flex flex-col gap-2">
            {/* Row 1: Name and Quick Buy */}
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-2 min-w-0">
                <span className="font-semibold text-white text-base leading-none">{token.symbol}</span>
                <span className="text-[13px] text-[#999999] truncate leading-none">{token.name}</span>
                <button className="text-[#999999] hover:text-white transition-colors flex-shrink-0">
                  <Copy size={12} />
                </button>
              </div>
              <button 
                disabled 
                className="flex items-center gap-1.5 px-2 py-1 bg-[#2C2C2E] rounded-md opacity-50 cursor-not-allowed flex-shrink-0 ml-2"
              >
                <svg width="14" height="14" viewBox="0 0 14 15" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M7.56029 0.0398532C7.82421 0.135404 8.00001 0.386021 8.00001 0.666701V4.74485L12.7494 5.33852C12.9912 5.36875 13.1973 5.52858 13.2868 5.75532C13.3763 5.98207 13.3349 6.23956 13.1788 6.42682L6.51216 14.4268C6.33247 14.6424 6.03697 14.7224 5.77306 14.6269C5.50914 14.5313 5.33334 14.2807 5.33334 14V9.92189L0.583986 9.32822C0.342111 9.29798 0.13602 9.13815 0.0465456 8.91141C-0.0429291 8.68467 -0.00152131 8.42717 0.154528 8.23991L6.8212 0.239911C7.00088 0.0242868 7.29638 -0.0556975 7.56029 0.0398532Z" fill="white"/>
                </svg>
                <div className="flex items-center gap-1">
                  <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                    <path d="M2.67744 8.031C2.73684 7.9716 2.81851 7.93695 2.90513 7.93695H10.7607C10.9041 7.93695 10.976 8.1102 10.8745 8.21166L9.32271 9.76346C9.26331 9.82286 9.18163 9.85749 9.09497 9.85749H1.2395C1.09595 9.85749 1.02417 9.68426 1.12565 9.58278L2.67744 8.031Z" fill="#777777"/>
                    <path d="M2.67744 2.23693C2.73932 2.17753 2.82098 2.14288 2.90513 2.14288H10.7607C10.9041 2.14288 10.976 2.31613 10.8745 2.41761L9.32271 3.96939C9.26331 4.02879 9.18163 4.06344 9.09497 4.06344H1.2395C1.09595 4.06344 1.02417 3.89019 1.12565 3.78873L2.67744 2.23693Z" fill="#777777"/>
                    <path d="M9.32271 5.11468C9.26331 5.05528 9.18163 5.02063 9.09497 5.02063H1.2395C1.09595 5.02063 1.02417 5.19388 1.12565 5.29535L2.67744 6.84714C2.73684 6.90654 2.81851 6.94119 2.90513 6.94119H10.7607C10.9041 6.94119 10.976 6.76794 10.8745 6.66647L9.32271 5.11468Z" fill="#777777"/>
                  </svg>
                  <span className="text-[13px] font-normal text-white">0.1</span>
                </div>
              </button>
            </div>

            {/* Row 2: Timestamp and Social Links + Stats */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="text-[12px] text-[#999999]">{token.txCount}s</span>
                <div className="flex items-center gap-1.5">
                  <button className="text-[#999999] hover:text-white transition-colors">
                    <Search size={12} />
                  </button>
                </div>
                <div className="flex items-center gap-1.5 text-[13px]">
                  <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                    <path fillRule="evenodd" clipRule="evenodd" d="M4.50013 2C3.6717 2 3.00013 2.67157 3.00013 3.5C3.00013 4.32843 3.6717 5 4.50013 5C5.32856 5 6.00013 4.32843 6.00013 3.5C6.00013 2.67157 5.32856 2 4.50013 2ZM2.00013 3.5C2.00013 2.11929 3.11942 1 4.50013 1C5.88084 1 7.00013 2.11929 7.00013 3.5C7.00013 4.88071 5.88084 6 4.50013 6C3.11942 6 2.00013 4.88071 2.00013 3.5Z" fill="#999999"/>
                    <path fillRule="evenodd" clipRule="evenodd" d="M4.26331 6.99998C4.30009 6.99999 4.33735 7 4.37512 7H4.62514C4.6629 7 4.70017 6.99999 4.73694 6.99998C5.70461 6.99966 6.33541 6.99946 6.88005 7.22088C7.35963 7.41584 7.7806 7.73159 8.10201 8.13743C8.46703 8.59832 8.64341 9.20396 8.91397 10.133C8.92426 10.1683 8.93468 10.2041 8.94525 10.2404L8.98014 10.36C9.05744 10.6251 8.90519 10.9027 8.64009 10.98C8.37499 11.0573 8.09741 10.9051 8.02012 10.64L7.98522 10.5203C7.67161 9.44468 7.54608 9.04616 7.31809 8.75829C7.10381 8.48773 6.82317 8.27723 6.50345 8.14725C6.16326 8.00895 5.74554 8 4.62514 8H4.37512C3.25472 8 2.837 8.00895 2.49681 8.14725C2.17709 8.27723 1.89645 8.48773 1.68217 8.75829C1.45418 9.04616 1.32865 9.44468 1.01504 10.5203L0.980142 10.64C0.902845 10.9051 0.625274 11.0573 0.360171 10.98C0.0950677 10.9027 -0.0571792 10.6251 0.0201181 10.36L0.0550116 10.2404C0.0655824 10.2041 0.0760017 10.1683 0.0862849 10.133C0.356852 9.20396 0.533229 8.59832 0.898247 8.13743C1.21966 7.7316 1.64063 7.41584 2.12021 7.22088C2.66485 6.99946 3.29565 6.99966 4.26331 6.99998Z" fill="#999999"/>
                  </svg>
                  <span className="text-[#999999]">{token.holders}</span>
                </div>
                <div className="flex items-center gap-1.5 text-[13px]">
                  <span className="text-[#999999]">TX</span>
                  <span className="text-[#999999]">{token.txCount}</span>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <div className="flex items-center gap-1 text-[12px]">
                  <span className="text-[#999999]">MC</span>
                  <span className="text-white">{formatNumber(token.marketCap)}</span>
                </div>
              </div>
            </div>

            {/* Row 3: Risk Indicators and Volume */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                {/* Top 10 Holdings */}
                <div className="flex items-center gap-1">
                  <svg width="12" height="12" viewBox="0 0 512 512" fill={token.change1h > 20 ? "#FF7243" : "#2EC08B"}>
                    <path d="m340.9 201.48q-9-7.54-22.17-7.55a33.6 33.6 0 0 0 -22 7.55q-9.2 7.56-14.12 21.35t-4.92 32.84q0 18.72 4.92 32.84t14.12 21.84a33.11 33.11 0 0 0 22 7.72q13.13 0 22.17-7.72t14-21.84q4.93-14.11 4.93-32.84t-4.98-32.67q-4.92-14-13.95-21.52z"/>
                    <path d="m256 0c-141.38 0-256 114.62-256 256s114.62 256 256 256 256-114.62 256-256-114.62-256-256-256zm-64.7 254v113.66h-57.47v-161.58q-9.54 2-19.21 4.11t-19.22 4.1v-53.2q23.66-5.25 47.95-10.35t48-10.34zm218.24 48a112.83 112.83 0 0 1 -20.2 37.11 93 93 0 0 1 -31 24.47 89.29 89.29 0 0 1 -39.57 8.7 89.47 89.47 0 0 1 -70.77-33.19 114.17 114.17 0 0 1 -20-37.11 146.57 146.57 0 0 1 -7.06-46.31 145.06 145.06 0 0 1 7.06-46.14 112.51 112.51 0 0 1 20-36.78 91.81 91.81 0 0 1 31-24.31 90.37 90.37 0 0 1 39.74-8.7 89.29 89.29 0 0 1 39.57 8.7 94.1 94.1 0 0 1 31 24.31 111.2 111.2 0 0 1 20.2 36.78 145.34 145.34 0 0 1 7.06 46.14 146.85 146.85 0 0 1 -7.03 46.33z"/>
                  </svg>
                  <span className={`text-[12px] ${token.change1h > 20 ? 'text-[#FF7243]' : 'text-[#2EC08B]'}`}>
                    {Math.abs(token.change1h)}%
                  </span>
                </div>
                {/* Dev Holdings */}
                <div className="flex items-center gap-1">
                  <svg width="12" height="12" viewBox="0 0 25 24" fill="#2EC08B">
                    <path d="M20.1032 16.2857C23.103 19.2857 17.9603 21.8571 12.3889 21.8571C6.81751 21.8571 1.67465 19.2857 4.67465 16.2857C4.69264 16.2977 7.26488 18 12.6032 18C17.337 18 20.1032 16.2857 20.1032 16.2857Z"/>
                    <path d="M20.0752 10.2857C23.0752 13.2857 17.9323 15.8571 12.3609 15.8571C6.78957 15.8571 1.6468 13.2856 4.64661 10.2857C4.64661 10.2857 7.21816 12 12.5752 12C17.2897 12 20.0526 10.2996 20.0752 10.2857Z"/>
                    <path d="M12.3333 2.14286C17.0671 2.14286 20.9047 3.86976 20.9047 6C20.9047 8.13024 17.0671 9.85715 12.3333 9.85715C7.59943 9.85713 3.76185 8.13024 3.76185 6C3.76185 3.86977 7.59943 2.14287 12.3333 2.14286Z"/>
                  </svg>
                  <span className="text-[12px] text-[#2EC08B]">0%</span>
                </div>
                {/* Sniper Holdings */}
                <div className="flex items-center gap-1">
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="#2EC08B">
                    <path d="M10.729 2.0277C10.729 1.23928 11.3682 0.600132 12.1566 0.600132C12.945 0.600132 13.5842 1.23928 13.5842 2.0277V5.29072C13.5842 6.07914 12.945 6.71829 12.1566 6.71829C11.3682 6.71829 10.729 6.07914 10.729 5.29072V2.0277Z"/>
                    <path d="M21.9506 10.4231C22.739 10.4259 23.3759 11.0672 23.3732 11.8556C23.3704 12.6441 22.7291 13.281 21.9406 13.2782L18.6776 13.2669C17.8892 13.2642 17.2523 12.6228 17.255 11.8344C17.2578 11.046 17.8991 10.4091 18.6876 10.4118L21.9506 10.4231Z"/>
                    <circle cx="12.1566" cy="11.8166" r="8" fill="none" stroke="currentColor" strokeWidth="1.5"/>
                  </svg>
                  <span className="text-[12px] text-[#2EC08B]">0%</span>
                </div>
              </div>
              <div className="flex items-center gap-1 text-[12px]">
                <span className="text-[#999999]">VOL</span>
                <span className="text-white">{formatNumber(token.volume)}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="flex flex-col h-full bg-[#0C0C0C] animate-fade-in">
      {/* Top Navigation Bar - Desktop */}
      <div className="hidden md:flex items-center justify-between px-6 lg:px-8 py-3 border-b border-white/10 max-w-5xl mx-auto w-full">
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center">
              <span className="text-black font-bold text-sm">👻</span>
            </div>
            <button 
              onClick={() => setActiveTab('launches')}
              className={`text-sm font-semibold transition-colors ${
                activeTab === 'launches' ? 'text-white' : 'text-gray-400 hover:text-white'
              }`}
            >
              Launches ▾
            </button>
          </div>
          <button 
            onClick={() => setActiveTab('tokens')}
            className={`text-sm font-semibold transition-colors ${
              activeTab === 'tokens' ? 'text-white' : 'text-gray-400 hover:text-white'
            }`}
          >
            Tokens
          </button>
          <button 
            onClick={() => setActiveTab('perps')}
            className={`text-sm font-semibold transition-colors ${
              activeTab === 'perps' ? 'text-white' : 'text-gray-400 hover:text-white'
            }`}
          >
            Perps
          </button>
          <button 
            onClick={() => setActiveTab('portfolio')}
            className={`text-sm font-semibold transition-colors ${
              activeTab === 'portfolio' ? 'text-white' : 'text-gray-400 hover:text-white'
            }`}
          >
            Portfolio
          </button>
        </div>

        <div className="flex items-center gap-3">
          <div className="relative">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
            <input
              type="text"
              placeholder="Search"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="bg-[#1A1A1A] rounded-lg pl-9 pr-4 py-2 text-sm text-white placeholder:text-gray-500 focus:outline-none focus:ring-1 focus:ring-[#AB9FF2]/50 w-64"
            />
            <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 text-xs">/</span>
          </div>
          <button className="bg-[#AB9FF2] text-black px-4 py-2 rounded-lg font-semibold text-sm hover:bg-[#9B8FE2] transition-colors">
            Connect
          </button>
        </div>
      </div>

      {/* Mobile Header */}
      <div className="md:hidden px-4 py-3 border-b border-white/10">
        <div className="flex items-center justify-between mb-3">
          <h1 className="text-xl font-bold">Launches</h1>
          <button className="bg-[#AB9FF2] text-black px-4 py-2 rounded-lg font-semibold text-sm">
            Connect
          </button>
        </div>
        <div className="relative">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
          <input
            type="text"
            placeholder="Search"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-[#1A1A1A] rounded-lg pl-9 pr-4 py-2 text-sm text-white placeholder:text-gray-500 focus:outline-none focus:ring-1 focus:ring-[#AB9FF2]/50"
          />
        </div>
      </div>

      {/* Category Tabs - Mobile */}
      <div className="md:hidden flex border-b border-white/10">
        <button
          onClick={() => setActiveCategory('new')}
          className={`flex-1 py-3 text-sm font-semibold transition-colors relative ${
            activeCategory === 'new' ? 'text-white' : 'text-gray-400'
          }`}
        >
          New
          {activeCategory === 'new' && (
            <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-white" />
          )}
        </button>
        <button
          onClick={() => setActiveCategory('migrating')}
          className={`flex-1 py-3 text-sm font-semibold transition-colors relative ${
            activeCategory === 'migrating' ? 'text-white' : 'text-gray-400'
          }`}
        >
          Migrating
          {activeCategory === 'migrating' && (
            <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-white" />
          )}
        </button>
        <button
          onClick={() => setActiveCategory('migrated')}
          className={`flex-1 py-3 text-sm font-semibold transition-colors relative ${
            activeCategory === 'migrated' ? 'text-white' : 'text-gray-400'
          }`}
        >
          Migrated
          {activeCategory === 'migrated' && (
            <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-white" />
          )}
        </button>
      </div>

      {/* Desktop: Three Column Layout */}
      <div className="hidden md:grid md:grid-cols-2 lg:grid-cols-3 gap-4 p-4 lg:p-6 flex-1 overflow-y-auto max-w-7xl mx-auto w-full">
        {/* New Column */}
        <div>
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-bold text-sm">New</h3>
            <button className="text-gray-500 hover:text-white">
              <MoreHorizontal size={18} />
            </button>
          </div>
          <div className="space-y-3">
            {newTokens.map(token => (
              <TokenCardComponent key={token.id} token={token} />
            ))}
          </div>
        </div>

        {/* Migrating Column */}
        <div>
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-bold text-sm">Migrating</h3>
            <button className="text-gray-500 hover:text-white">
              <MoreHorizontal size={18} />
            </button>
          </div>
          <div className="space-y-3">
            {migratingTokens.map(token => (
              <TokenCardComponent key={token.id} token={token} />
            ))}
          </div>
        </div>

        {/* Migrated Column */}
        <div>
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-bold text-sm">Migrated</h3>
            <button className="text-gray-500 hover:text-white">
              <MoreHorizontal size={18} />
            </button>
          </div>
          <div className="space-y-3">
            {migratedTokens.map(token => (
              <TokenCardComponent key={token.id} token={token} />
            ))}
          </div>
        </div>
      </div>

      {/* Mobile: Single Column */}
      <div className="md:hidden flex-1 overflow-y-auto p-4 pb-24">
        <div className="space-y-3">
          {activeCategory === 'new' && newTokens.map(token => (
            <TokenCardComponent key={token.id} token={token} />
          ))}
          {activeCategory === 'migrating' && migratingTokens.map(token => (
            <TokenCardComponent key={token.id} token={token} />
          ))}
          {activeCategory === 'migrated' && migratedTokens.map(token => (
            <TokenCardComponent key={token.id} token={token} />
          ))}
        </div>
      </div>
    </div>
  );
};
