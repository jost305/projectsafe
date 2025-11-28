
import React, { useState } from 'react';
import { Plus, Search, Wallet, ArrowUpRight, Copy, MoreHorizontal, ExternalLink, X, ArrowLeft, TrendingUp, TrendingDown, ArrowDownLeft, ArrowRightLeft, Filter } from 'lucide-react';
import { TrackedWallet, TransactionHistoryItem } from '../types';

const MOCK_TRACKED_WALLETS: TrackedWallet[] = [
  {
    address: '8x7...2v3d',
    name: 'Whale Alert',
    label: 'Whale',
    netWorth: 2450000,
    topTokens: ['SOL', 'JUP', 'WIF'],
    chain: 'SOL',
    recentActivity: [
      {
        id: 'tx-w-1',
        type: 'SWAP',
        title: 'Swapped SOL to USDC',
        subtitle: 'Jupiter Aggregator',
        amount: '-5,000 SOL',
        date: '20m ago',
        status: 'CONFIRMED',
        direction: 'OUT'
      },
      {
        id: 'tx-w-2',
        type: 'RECEIVE',
        title: 'Received JUP',
        subtitle: 'From Coinbase',
        amount: '+250,000 JUP',
        date: '2h ago',
        status: 'CONFIRMED',
        direction: 'IN'
      }
    ]
  },
  {
    address: '0x3...a9Bc',
    name: 'Smart Money 1',
    label: 'Smart Money',
    netWorth: 180000,
    topTokens: ['ETH', 'PEPE'],
    chain: 'ETH',
    recentActivity: [
      {
        id: 'tx-s-1',
        type: 'SWAP',
        title: 'Bought PEPE',
        subtitle: 'Uniswap V3',
        amount: '+4.2B PEPE',
        date: '5m ago',
        status: 'CONFIRMED',
        direction: 'IN'
      },
       {
        id: 'tx-s-2',
        type: 'SEND',
        title: 'Sent ETH',
        subtitle: 'To Binance',
        amount: '-15 ETH',
        date: '1d ago',
        status: 'CONFIRMED',
        direction: 'OUT'
      }
    ]
  }
];

export const Track: React.FC = () => {
  const [wallets, setWallets] = useState<TrackedWallet[]>(MOCK_TRACKED_WALLETS);
  const [showAddModal, setShowAddModal] = useState(false);
  const [newAddress, setNewAddress] = useState('');
  const [selectedWallet, setSelectedWallet] = useState<TrackedWallet | null>(null);
  const [filter, setFilter] = useState<'ALL' | 'SOL' | 'ETH'>('ALL');

  const handleAddWallet = (e: React.FormEvent) => {
    e.preventDefault();
    if (newAddress) {
      setWallets(prev => [...prev, {
        address: `${newAddress.substring(0, 4)}...${newAddress.substring(newAddress.length - 4)}`,
        name: 'New Wallet',
        label: 'Friend',
        netWorth: 0,
        topTokens: [],
        chain: newAddress.startsWith('0x') ? 'ETH' : 'SOL',
        recentActivity: []
      }]);
      setShowAddModal(false);
      setNewAddress('');
    }
  };

  const calculateTokenValue = (netWorth: number, index: number, total: number) => {
    // Mock distribution logic
    const share = [0.6, 0.3, 0.1, 0.05, 0.05][index] || 0;
    return (netWorth * share).toLocaleString(undefined, { maximumFractionDigits: 0 });
  };

  const filteredWallets = wallets.filter(w => filter === 'ALL' || w.chain === filter);

  if (selectedWallet) {
    return (
      <div class="fixed inset-0 z-50 bg-[#0C0C0C] flex flex-col animate-slide-up overflow-y-auto">
        {/* Detail Header */}
        <div class="px-4 py-4 flex justify-between items-center sticky top-0 bg-[#0C0C0C]/90 backdrop-blur-md z-10 border-b border-white/5">
           <button onClick={() => setSelectedWallet(null)} class="p-2 -ml-2 hover:bg-white/5 rounded-full transition-colors">
              <ArrowLeft size={24} />
           </button>
           <div class="flex flex-col items-center">
              <div class="font-bold text-lg">{selectedWallet.name}</div>
              <div class="flex items-center gap-1 text-xs text-gray-500 font-mono">
                  {selectedWallet.address} <Copy size={10} />
              </div>
           </div>
           <button class="p-2 -mr-2 hover:bg-white/5 rounded-full transition-colors">
              <MoreHorizontal size={24} />
           </button>
        </div>

        {/* Hero Stats */}
        <div class="px-5 py-6 text-center">
           <div class="text-sm text-gray-500 mb-1">Net Worth</div>
           <div class="text-4xl font-extrabold mb-2">${selectedWallet.netWorth.toLocaleString()}</div>
           <div class={`inline-flex items-center gap-1 px-2 py-1 rounded-lg font-bold text-sm bg-green-500/10 text-green-500`}>
             <TrendingUp size={16} /> +12.5% (24h)
           </div>
        </div>

        <div class="px-5 pb-24 space-y-6">
           {/* Top Assets */}
           <div>
              <h3 class="font-bold text-gray-400 text-xs uppercase mb-3">Top Assets</h3>
              <div class="bg-[#1C1C1E] rounded-2xl overflow-hidden border border-white/5">
                 {selectedWallet.topTokens.length > 0 ? selectedWallet.topTokens.map((token, i) => (
                    <div key={token} class={`flex items-center justify-between p-4 ${i !== selectedWallet.topTokens.length - 1 ? 'border-b border-white/5' : ''}`}>
                       <div class="flex items-center gap-3">
                          <div class="w-10 h-10 rounded-full bg-[#2C2C2E] flex items-center justify-center font-bold text-gray-400">
                             {token[0]}
                          </div>
                          <div>
                             <div class="font-bold">{token}</div>
                             <div class="text-xs text-gray-500">
                                {token === 'SOL' ? 'Solana' : token === 'ETH' ? 'Ethereum' : 'Token'}
                             </div>
                          </div>
                       </div>
                       <div class="text-right">
                          <div class="font-bold">${calculateTokenValue(selectedWallet.netWorth, i, selectedWallet.topTokens.length)}</div>
                          <div class="text-xs text-green-500">+2.4%</div>
                       </div>
                    </div>
                 )) : (
                    <div class="p-4 text-center text-gray-500 text-sm">No assets found</div>
                 )}
              </div>
           </div>

           {/* Recent Activity */}
           <div>
              <h3 class="font-bold text-gray-400 text-xs uppercase mb-3">Recent Activity</h3>
              <div class="flex flex-col gap-2">
                 {selectedWallet.recentActivity && selectedWallet.recentActivity.length > 0 ? (
                    selectedWallet.recentActivity.map((tx) => (
                       <div key={tx.id} class="bg-[#1C1C1E] p-4 rounded-2xl border border-white/5 flex items-center justify-between">
                          <div class="flex items-center gap-3">
                             <div class={`w-10 h-10 rounded-full flex items-center justify-center ${
                                tx.type === 'RECEIVE' ? 'bg-green-500/10 text-green-500' :
                                tx.type === 'SEND' ? 'bg-gray-800 text-gray-400' :
                                'bg-[#AB9FF2]/10 text-[#AB9FF2]'
                             }`}>
                                {tx.type === 'RECEIVE' ? <ArrowDownLeft size={18} /> :
                                 tx.type === 'SEND' ? <ArrowUpRight size={18} /> :
                                 <ArrowRightLeft size={18} />}
                             </div>
                             <div>
                                <div class="font-bold text-sm">{tx.title}</div>
                                <div class="text-xs text-gray-500">{tx.subtitle} • {tx.date}</div>
                             </div>
                          </div>
                          <div class={`font-bold text-sm ${
                             tx.direction === 'IN' ? 'text-green-500' : 'text-white'
                          }`}>
                             {tx.amount}
                          </div>
                       </div>
                    ))
                 ) : (
                    <div class="text-center p-8 bg-[#1C1C1E] rounded-2xl border border-white/5">
                       <p class="text-gray-500 text-sm">No recent activity</p>
                    </div>
                 )}
              </div>
           </div>
        </div>
      </div>
    );
  }

  return (
    <div class="flex flex-col h-full bg-[#0C0C0C] animate-fade-in relative">
      <div class="px-5 md:px-8 py-4 flex justify-between items-center border-b border-white/5 bg-[#0C0C0C] max-w-7xl mx-auto w-full">
        <h1 class="text-2xl font-bold">Monitor</h1>
        <button 
          onClick={() => setShowAddModal(true)}
          class="w-8 h-8 rounded-full bg-[#AB9FF2]/10 flex items-center justify-center text-[#AB9FF2] hover:bg-[#AB9FF2]/20 transition-colors"
        >
          <Plus size={20} />
        </button>
      </div>

      {/* Network Filter */}
      <div class="px-5 pt-3 pb-1 flex items-center gap-2">
         <button 
           onClick={() => setFilter('ALL')}
           class={`px-3 py-1.5 rounded-full text-xs font-bold transition-all border ${filter === 'ALL' ? 'bg-white text-black border-white' : 'bg-[#1C1C1E] text-gray-400 border-transparent hover:text-white'}`}
         >
           All
         </button>
         <button 
           onClick={() => setFilter('SOL')}
           class={`px-3 py-1.5 rounded-full text-xs font-bold transition-all border flex items-center gap-1.5 ${filter === 'SOL' ? 'bg-[#9945FF]/20 text-[#9945FF] border-[#9945FF]/50' : 'bg-[#1C1C1E] text-gray-400 border-transparent hover:text-white'}`}
         >
           <div class={`w-2 h-2 rounded-full ${filter === 'SOL' ? 'bg-[#9945FF]' : 'bg-gray-500'}`} />
           Solana
         </button>
         <button 
           onClick={() => setFilter('ETH')}
           class={`px-3 py-1.5 rounded-full text-xs font-bold transition-all border flex items-center gap-1.5 ${filter === 'ETH' ? 'bg-[#627EEA]/20 text-[#627EEA] border-[#627EEA]/50' : 'bg-[#1C1C1E] text-gray-400 border-transparent hover:text-white'}`}
         >
           <div class={`w-2 h-2 rounded-full ${filter === 'ETH' ? 'bg-[#627EEA]' : 'bg-gray-500'}`} />
           Ethereum
         </button>
      </div>

      <div class="flex-1 overflow-y-auto p-5 md:p-8 pb-24 md:pb-8 scrollbar-hide max-w-7xl mx-auto w-full">
         {wallets.length === 0 ? (
           <div class="flex flex-col items-center justify-center h-64 text-center">
              <div class="w-16 h-16 bg-[#1C1C1E] rounded-full flex items-center justify-center mb-4">
                 <Wallet size={32} class="text-gray-600" />
              </div>
              <h3 class="text-lg font-bold text-gray-300">No tracked wallets</h3>
              <p class="text-sm text-gray-500 max-w-xs mt-2">
                 Add a wallet address to track their portfolio performance and activity in real-time.
              </p>
           </div>
         ) : filteredWallets.length === 0 ? (
            <div class="flex flex-col items-center justify-center h-48 text-center opacity-60">
               <div class="w-12 h-12 bg-[#1C1C1E] rounded-full flex items-center justify-center mb-3">
                  <Filter size={20} class="text-gray-500" />
               </div>
               <p class="text-sm font-medium text-gray-400">No {filter === 'SOL' ? 'Solana' : 'Ethereum'} wallets found</p>
            </div>
         ) : (
           <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredWallets.map((wallet, idx) => (
                 <div 
                   key={idx} 
                   onClick={() => setSelectedWallet(wallet)}
                   class="bg-[#1C1C1E] rounded-2xl p-4 border border-white/5 hover:border-white/10 transition-all cursor-pointer active:scale-[0.98] group"
                 >
                    <div class="flex justify-between items-start mb-4">
                       <div class="flex items-center gap-3">
                          <div class={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-black ${
                            wallet.chain === 'SOL' ? 'bg-gradient-to-tr from-purple-400 to-blue-400' : 'bg-gradient-to-tr from-gray-200 to-gray-400'
                          }`}>
                             {wallet.chain === 'SOL' ? 'S' : 'E'}
                          </div>
                          <div>
                             <div class="font-bold flex items-center gap-2 text-white">
                                {wallet.name}
                                {wallet.label && (
                                   <span class={`text-[10px] px-1.5 py-0.5 rounded font-bold uppercase ${
                                      wallet.label === 'Whale' ? 'bg-purple-500/20 text-purple-400' : 
                                      wallet.label === 'Smart Money' ? 'bg-green-500/20 text-green-400' : 'bg-gray-700 text-gray-400'
                                   }`}>
                                      {wallet.label}
                                   </span>
                                )}
                             </div>
                             <div class="flex items-center gap-1 text-xs text-gray-500 font-mono mt-0.5">
                                {wallet.address}
                             </div>
                          </div>
                       </div>
                       <ArrowUpRight size={20} class="text-gray-600 group-hover:text-white transition-colors" />
                    </div>

                    <div class="flex items-end justify-between">
                       <div>
                          <div class="text-xs text-gray-500 mb-1">Net Worth</div>
                          <div class="text-xl font-bold font-mono text-white">${wallet.netWorth.toLocaleString()}</div>
                       </div>
                       <div class="flex gap-1">
                          {wallet.topTokens.map(t => (
                             <div key={t} class="bg-[#2C2C2E] px-2 py-1 rounded text-xs font-bold text-gray-300 border border-white/5">
                                {t}
                             </div>
                          ))}
                       </div>
                    </div>
                 </div>
              ))}
           </div>
         )}
      </div>

      {/* Add Wallet Modal */}
      {showAddModal && (
        <div class="absolute inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 animate-fade-in">
           <div class="bg-[#1C1C1E] w-full max-w-sm rounded-3xl p-6 border border-white/10 shadow-2xl animate-slide-up">
              <div class="flex justify-between items-center mb-6">
                 <h3 class="text-xl font-bold">Track Wallet</h3>
                 <button onClick={() => setShowAddModal(false)} class="p-1 bg-white/5 rounded-full hover:bg-white/10">
                    <X size={20} />
                 </button>
              </div>
              
              <form onSubmit={handleAddWallet}>
                 <div class="mb-4">
                    <label class="text-xs font-bold text-gray-500 uppercase ml-1 mb-2 block">Wallet Address or ENS</label>
                    <div class="bg-[#0C0C0C] rounded-xl px-4 py-3 flex items-center gap-3 border border-transparent focus-within:border-[#AB9FF2] transition-colors">
                       <Search size={18} class="text-gray-500" />
                       <input 
                         type="text" 
                         value={newAddress}
                         onChange={(e) => setNewAddress((e.target as HTMLInputElement).value)}
                         placeholder="e.g. toly.sol" 
                         class="bg-transparent w-full focus:outline-none text-white font-mono text-sm"
                         autofocus
                       />
                    </div>
                 </div>
                 
                 <div class="flex gap-2 mb-6">
                    <span class="text-[10px] bg-white/5 px-2 py-1 rounded text-gray-400">Solana</span>
                    <span class="text-[10px] bg-white/5 px-2 py-1 rounded text-gray-400">Ethereum</span>
                    <span class="text-[10px] bg-white/5 px-2 py-1 rounded text-gray-400">Polygon</span>
                    <span class="text-[10px] bg-white/5 px-2 py-1 rounded text-gray-400">Bitcoin</span>
                 </div>

                 <button 
                   type="submit"
                   disabled={!newAddress}
                   class="w-full bg-[#AB9FF2] disabled:opacity-50 disabled:cursor-not-allowed text-black font-bold h-12 rounded-xl active:scale-[0.98] transition-transform shadow-lg"
                 >
                    Start Tracking
                 </button>
              </form>
           </div>
        </div>
      )}
    </div>
  );
};
