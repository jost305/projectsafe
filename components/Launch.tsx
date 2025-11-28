
import React, { useState } from 'react';
import { Crown, Gift, Clock, TrendingUp, Plus, X, Upload } from 'lucide-react';

interface LaunchToken {
  id: string;
  symbol: string;
  name: string;
  image: string;
  price: number;
  change: number;
  volume: string;
  marketCap: string;
  rank?: string;
  isFeatured?: boolean;
  timeLeft?: string;
}

const MOCK_LAUNCH_TOKENS: LaunchToken[] = [
  {
    id: '1',
    symbol: 'MACHINES',
    name: 'machines cash',
    image: 'https://picsum.photos/seed/machines/200',
    price: 0.00430,
    change: -20.51,
    volume: '$31.1k',
    marketCap: '$3m',
    isFeatured: true,
    timeLeft: '15h 18m'
  },
  {
    id: '2',
    symbol: 'godagent',
    name: 'godagent',
    image: 'https://picsum.photos/seed/godagent/200',
    price: 0.00015,
    change: -2.95,
    volume: '$17.9k',
    marketCap: '$152.7k',
    rank: '2ND'
  },
  {
    id: '3',
    symbol: 'minidev',
    name: 'minidev',
    image: 'https://picsum.photos/seed/minidev/200',
    price: 0.00033,
    change: -18.32,
    volume: '$13.6k',
    marketCap: '$336.9k',
    rank: '3RD'
  },
  {
    id: '4',
    symbol: 'Bapp',
    name: 'Bapp',
    image: 'https://picsum.photos/seed/bapp/200',
    price: 0.00015,
    change: 8.02,
    volume: '$12.6k',
    marketCap: '$15.9k',
    rank: '4TH'
  },
  {
    id: '5',
    symbol: 'The Hat',
    name: 'The Hat',
    image: 'https://picsum.photos/seed/thehat/200',
    price: 0.00061,
    change: 0,
    volume: '$11.2k',
    marketCap: '$18.5k',
    rank: '5TH'
  }
];

export const Launch: React.FC = () => {
  const [showNewCoin, setShowNewCoin] = useState(false);
  const [ticker, setTicker] = useState('');
  const [coinName, setCoinName] = useState('');
  const [description, setDescription] = useState('');
  const [showDescription, setShowDescription] = useState(false);
  const [showLinks, setShowLinks] = useState(false);

  return (
    <div className="flex flex-col h-full bg-[#0C0C0C] animate-fade-in">
      {/* Header */}
      <div className="px-5 md:px-8 pt-4 pb-3 flex items-center justify-between max-w-7xl mx-auto w-full">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gradient-to-br from-cyan-400 to-blue-500 rounded-full flex items-center justify-center">
            <div className="w-8 h-8 bg-[#0C0C0C] rounded-full flex items-center justify-center">
              <div className="w-3 h-3 bg-gradient-to-br from-cyan-400 to-blue-500 rounded-full" />
            </div>
          </div>
          <h1 className="text-2xl font-bold">Launchpad</h1>
        </div>
        <button className="flex items-center gap-2 bg-[#1C1C1E] px-3 py-2 rounded-xl">
          <Gift size={20} />
          <span className="font-semibold">0</span>
        </button>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-y-auto px-5 md:px-8 pb-24 md:pb-8 max-w-7xl mx-auto w-full">
        {/* Featured Token */}
        {MOCK_LAUNCH_TOKENS.filter(t => t.isFeatured).map(token => (
          <div key={token.id} className="mb-6">
            <div className="relative bg-gradient-to-br from-purple-900/20 via-orange-900/20 to-yellow-900/20 rounded-3xl p-6 overflow-hidden">
              {/* Glow Effect */}
              <div className="absolute inset-0 bg-gradient-radial from-orange-500/30 via-transparent to-transparent blur-3xl" />
              
              <div className="relative z-10 flex flex-col items-center">
                {/* Token Image with Crown */}
                <div className="relative mb-4">
                  <div className="w-32 h-32 rounded-full bg-gradient-to-br from-orange-400 to-orange-600 flex items-center justify-center shadow-2xl">
                    <span className="text-white font-bold text-lg">{token.name}</span>
                  </div>
                  <Crown size={32} className="absolute -top-2 left-1/2 -translate-x-1/2 text-yellow-400 fill-yellow-400" />
                  <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-10 h-10 bg-blue-500 rounded-full border-4 border-[#0C0C0C] flex items-center justify-center">
                    <div className="w-4 h-4 bg-white rounded-full" />
                  </div>
                </div>

                {/* Timer */}
                <div className="bg-black/50 backdrop-blur-sm px-4 py-2 rounded-full mb-4">
                  <p className="text-sm text-gray-300 flex items-center gap-2">
                    <Clock size={16} />
                    Round ends in {token.timeLeft}
                  </p>
                </div>

                {/* Token Info */}
                <div className="text-center mb-6">
                  <h2 className="text-2xl font-bold flex items-center justify-center gap-2 mb-2">
                    {token.symbol}
                    <span className={`text-lg ${token.change >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                      {token.change >= 0 ? '+' : ''}{token.change}%
                    </span>
                    <TrendingUp size={20} className="text-gray-400" />
                  </h2>
                  <p className="text-4xl font-bold mb-2">${token.price.toFixed(4)}</p>
                  <div className="flex items-center justify-center gap-4 text-sm text-gray-400">
                    <span>VOL {token.volume}</span>
                    <span>MCAP {token.marketCap}</span>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex gap-3 w-full">
                  <button className="flex-1 bg-[#1C1C1E] hover:bg-[#2C2C2E] py-3 rounded-xl font-semibold transition-colors flex items-center justify-center gap-2">
                    <img src={token.image} alt={token.symbol} className="w-5 h-5 rounded-full" />
                    {token.symbol}
                    <span className="text-gray-400">Last winner</span>
                    <TrendingUp size={16} className="text-gray-400" />
                  </button>
                  <button className="flex-1 bg-[#1C1C1E] hover:bg-[#2C2C2E] py-3 rounded-xl font-semibold transition-colors">
                    How it works
                    <TrendingUp size={16} className="inline ml-2 text-gray-400" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}

        {/* Token List */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 mb-20">
          {MOCK_LAUNCH_TOKENS.filter(t => !t.isFeatured).map(token => (
            <div key={token.id} className="bg-[#1C1C1E] rounded-2xl p-4 hover:bg-[#2C2C2E] transition-colors">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3 flex-1">
                  <div className="relative">
                    <img src={token.image} alt={token.symbol} className="w-12 h-12 rounded-full" />
                    <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-blue-500 rounded-full border-2 border-[#1C1C1E] flex items-center justify-center">
                      <div className="w-2 h-2 bg-white rounded-full" />
                    </div>
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="font-bold">{token.symbol}</h3>
                      <span className={`text-sm ${token.change >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                        {token.change >= 0 ? '↑' : '↓'} {Math.abs(token.change)}%
                      </span>
                    </div>
                    <div className="flex items-center gap-3 text-xs text-gray-400">
                      {token.rank && (
                        <span className={`px-2 py-0.5 rounded ${
                          token.rank === '2ND' ? 'bg-gray-700' : 
                          token.rank === '3RD' ? 'bg-orange-900/30' : 
                          'bg-gray-800'
                        } font-semibold`}>
                          {token.rank}
                        </span>
                      )}
                      <span>VOL {token.volume}</span>
                      <span>MCAP {token.marketCap}</span>
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-xl font-bold">${token.price.toFixed(4)}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Launch Button */}
      <button 
        onClick={() => setShowNewCoin(true)}
        className="fixed bottom-24 left-1/2 -translate-x-1/2 max-w-md mx-auto bg-gradient-to-r from-yellow-500 to-orange-500 text-black px-8 py-4 rounded-full font-bold text-lg shadow-2xl hover:shadow-yellow-500/50 transition-all active:scale-95 flex items-center gap-2"
      >
        <Plus size={24} />
        Launch
      </button>

      {/* New Coin Modal */}
      {showNewCoin && (
        <div className="fixed inset-0 bg-black/90 z-50 flex flex-col animate-fade-in">
          <div className="flex-1 overflow-y-auto">
            <div className="px-5 py-4">
              {/* Header */}
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-gradient-to-br from-cyan-400 to-blue-500 rounded-full flex items-center justify-center">
                    <div className="w-8 h-8 bg-[#0C0C0C] rounded-full flex items-center justify-center">
                      <div className="w-3 h-3 bg-gradient-to-br from-cyan-400 to-blue-500 rounded-full" />
                    </div>
                  </div>
                  <h2 className="text-xl font-bold">New Coin</h2>
                </div>
                <button onClick={() => setShowNewCoin(false)} className="text-gray-400 hover:text-white">
                  <X size={24} />
                </button>
              </div>

              {/* Upload Image */}
              <div className="flex justify-center mb-6">
                <button className="w-32 h-32 rounded-full border-4 border-dashed border-blue-500/30 flex items-center justify-center hover:border-blue-500/60 transition-colors">
                  <Plus size={32} className="text-blue-500" />
                </button>
              </div>

              {/* Required Info */}
              <div className="mb-6">
                <p className="text-xs text-gray-500 uppercase tracking-wider mb-4 flex items-center gap-1">
                  <span className="text-red-500">*</span> REQUIRED INFO
                </p>

                <div className="space-y-3">
                  <div className="bg-[#1C1C1E] rounded-xl p-4 flex items-center justify-between">
                    <span className="font-semibold">Ticker</span>
                    <input 
                      type="text"
                      value={ticker}
                      onChange={(e) => setTicker(e.target.value)}
                      placeholder="$NAME"
                      className="bg-transparent text-right text-gray-400 outline-none"
                    />
                  </div>

                  <div className="bg-[#1C1C1E] rounded-xl p-4 flex items-center justify-between">
                    <span className="font-semibold">Name</span>
                    <input 
                      type="text"
                      value={coinName}
                      onChange={(e) => setCoinName(e.target.value)}
                      placeholder="Enter coin name"
                      className="bg-transparent text-right text-gray-400 outline-none"
                    />
                  </div>

                  <div className="bg-[#1C1C1E] rounded-xl p-4 border-2 border-red-500/50">
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-semibold">Network</span>
                      <div className="flex items-center gap-2 bg-[#0C0C0C] px-3 py-2 rounded-lg">
                        <div className="w-5 h-5 bg-blue-500 rounded-full" />
                        <span className="font-semibold">Base</span>
                      </div>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-400">Balance: 0.00</span>
                    </div>
                    <p className="text-red-500 text-xs mt-2">Not enough funds to launch a token</p>
                  </div>
                </div>
              </div>

              {/* About Section */}
              <div className="mb-6">
                <p className="text-xs text-gray-500 uppercase tracking-wider mb-4">ABOUT</p>
                
                <div className="space-y-3">
                  <button 
                    onClick={() => setShowDescription(!showDescription)}
                    className="w-full bg-[#1C1C1E] rounded-xl p-4 flex items-center justify-between hover:bg-[#2C2C2E] transition-colors"
                  >
                    <span className="font-semibold">Description</span>
                    <Plus size={20} className={`transition-transform ${showDescription ? 'rotate-45' : ''}`} />
                  </button>

                  {showDescription && (
                    <textarea 
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                      placeholder="Enter description..."
                      className="w-full bg-[#1C1C1E] rounded-xl p-4 text-sm text-gray-300 outline-none min-h-[100px] resize-none"
                    />
                  )}

                  <button 
                    onClick={() => setShowLinks(!showLinks)}
                    className="w-full bg-[#1C1C1E] rounded-xl p-4 flex items-center justify-between hover:bg-[#2C2C2E] transition-colors"
                  >
                    <span className="font-semibold">Links</span>
                    <Plus size={20} className={`transition-transform ${showLinks ? 'rotate-45' : ''}`} />
                  </button>
                </div>
              </div>

              {/* Bottom Info */}
              <div className="flex items-center justify-between mb-24">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-[#1C1C1E] rounded-lg flex items-center justify-center">
                    <Upload size={20} className="text-gray-400" />
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 uppercase">$NAME</p>
                    <p className="font-bold">$0.0₄30</p>
                    <p className="text-xs text-gray-500">MCAP $30.4k</p>
                  </div>
                </div>
                <button 
                  disabled
                  className="bg-[#1C1C1E] text-gray-600 px-8 py-3 rounded-xl font-bold opacity-50 cursor-not-allowed"
                >
                  Continue
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
