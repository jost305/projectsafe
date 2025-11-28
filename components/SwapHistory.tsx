import React, { useState } from 'react';
import { History, ArrowRight, Filter, Download, Check, X, Clock, ExternalLink, Search } from 'lucide-react';
import { SwapHistoryItem } from '../types';

const MOCK_SWAP_HISTORY: SwapHistoryItem[] = [
  {
    id: '1',
    date: '2024-01-15 14:32',
    fromToken: 'ETH',
    toToken: 'USDC',
    fromAmount: 1.5,
    toAmount: 3975.50,
    fromTokenImage: 'https://cryptologos.cc/logos/ethereum-eth-logo.png?v=029',
    toTokenImage: 'https://cryptologos.cc/logos/usd-coin-usdc-logo.png?v=029',
    status: 'completed',
    txHash: '0x1234...5678',
    chain: 'Ethereum',
    gasFee: 12.50
  },
  {
    id: '2',
    date: '2024-01-14 09:15',
    fromToken: 'SOL',
    toToken: 'BONK',
    fromAmount: 10,
    toAmount: 45000000,
    fromTokenImage: 'https://cryptologos.cc/logos/solana-sol-logo.png?v=029',
    toTokenImage: 'https://cryptologos.cc/logos/bonk1-bonk-logo.png?v=029',
    status: 'completed',
    txHash: '8x7a...2v3d',
    chain: 'Solana',
    gasFee: 0.005
  },
  {
    id: '3',
    date: '2024-01-13 18:45',
    fromToken: 'MATIC',
    toToken: 'ETH',
    fromAmount: 500,
    toAmount: 0.15,
    fromTokenImage: 'https://cryptologos.cc/logos/polygon-matic-logo.png?v=029',
    toTokenImage: 'https://cryptologos.cc/logos/ethereum-eth-logo.png?v=029',
    status: 'completed',
    txHash: '0xabcd...efgh',
    chain: 'Polygon',
    gasFee: 0.02
  },
  {
    id: '4',
    date: '2024-01-12 22:00',
    fromToken: 'ETH',
    toToken: 'ARB',
    fromAmount: 0.5,
    toAmount: 1250,
    fromTokenImage: 'https://cryptologos.cc/logos/ethereum-eth-logo.png?v=029',
    toTokenImage: 'https://cryptologos.cc/logos/arbitrum-arb-logo.png?v=029',
    status: 'failed',
    txHash: '0xfail...1234',
    chain: 'Arbitrum',
    gasFee: 0
  },
  {
    id: '5',
    date: '2024-01-11 11:30',
    fromToken: 'USDC',
    toToken: 'SOL',
    fromAmount: 1000,
    toAmount: 7.14,
    fromTokenImage: 'https://cryptologos.cc/logos/usd-coin-usdc-logo.png?v=029',
    toTokenImage: 'https://cryptologos.cc/logos/solana-sol-logo.png?v=029',
    status: 'completed',
    txHash: '9z8y...7x6w',
    chain: 'Solana',
    gasFee: 0.003
  },
];

interface SwapHistoryProps {
  onClose?: () => void;
}

export const SwapHistory: React.FC<SwapHistoryProps> = ({ onClose }) => {
  const [history] = useState<SwapHistoryItem[]>(MOCK_SWAP_HISTORY);
  const [filterStatus, setFilterStatus] = useState<'all' | 'completed' | 'failed'>('all');
  const [filterChain, setFilterChain] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [showFilters, setShowFilters] = useState(false);

  const chains = [...new Set(history.map(h => h.chain))];

  const filteredHistory = history.filter(item => {
    if (filterStatus !== 'all' && item.status !== filterStatus) return false;
    if (filterChain !== 'all' && item.chain !== filterChain) return false;
    if (searchQuery && !item.fromToken.toLowerCase().includes(searchQuery.toLowerCase()) && 
        !item.toToken.toLowerCase().includes(searchQuery.toLowerCase())) return false;
    return true;
  });

  const exportToCSV = () => {
    const headers = ['Date', 'From Token', 'From Amount', 'To Token', 'To Amount', 'Chain', 'Status', 'Gas Fee', 'TX Hash'];
    const rows = filteredHistory.map(item => [
      item.date,
      item.fromToken,
      item.fromAmount,
      item.toToken,
      item.toAmount,
      item.chain,
      item.status,
      item.gasFee,
      item.txHash
    ]);
    
    const csv = [headers, ...rows].map(row => row.join(',')).join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'swap_history.csv';
    a.click();
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed': return <Check size={14} className="text-green-500" />;
      case 'failed': return <X size={14} className="text-red-500" />;
      default: return <Clock size={14} className="text-yellow-500" />;
    }
  };

  const totalVolume = filteredHistory
    .filter(h => h.status === 'completed')
    .reduce((acc, h) => acc + h.toAmount, 0);

  const totalFees = filteredHistory
    .filter(h => h.status === 'completed')
    .reduce((acc, h) => acc + h.gasFee, 0);

  return (
    <div className="flex flex-col gap-4 animate-fade-in">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <History size={20} className="text-[#AB9FF2]" />
          <h3 className="font-bold text-lg">Swap History</h3>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowFilters(!showFilters)}
            className={`p-2 rounded-lg transition-colors ${showFilters ? 'bg-[#AB9FF2] text-black' : 'bg-[#1C1C1E] text-gray-400 hover:text-white'}`}
          >
            <Filter size={18} />
          </button>
          <button
            onClick={exportToCSV}
            className="p-2 bg-[#1C1C1E] rounded-lg text-gray-400 hover:text-white transition-colors"
          >
            <Download size={18} />
          </button>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div className="bg-[#1C1C1E] rounded-xl p-3">
          <p className="text-xs text-gray-500 mb-1">Total Swaps</p>
          <p className="font-bold text-lg">{filteredHistory.length}</p>
        </div>
        <div className="bg-[#1C1C1E] rounded-xl p-3">
          <p className="text-xs text-gray-500 mb-1">Total Fees Paid</p>
          <p className="font-bold text-lg">${totalFees.toFixed(2)}</p>
        </div>
      </div>

      {showFilters && (
        <div className="bg-[#1C1C1E] rounded-xl p-4 flex flex-col gap-3">
          <div className="relative">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
            <input
              type="text"
              placeholder="Search tokens..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-black/50 rounded-lg pl-10 pr-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#AB9FF2]/50"
            />
          </div>
          <div className="flex gap-2">
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value as any)}
              className="flex-1 bg-black/50 rounded-lg px-3 py-2 text-sm focus:outline-none"
            >
              <option value="all">All Status</option>
              <option value="completed">Completed</option>
              <option value="failed">Failed</option>
            </select>
            <select
              value={filterChain}
              onChange={(e) => setFilterChain(e.target.value)}
              className="flex-1 bg-black/50 rounded-lg px-3 py-2 text-sm focus:outline-none"
            >
              <option value="all">All Chains</option>
              {chains.map(chain => (
                <option key={chain} value={chain}>{chain}</option>
              ))}
            </select>
          </div>
        </div>
      )}

      <div className="flex flex-col gap-2">
        {filteredHistory.map(item => (
          <div
            key={item.id}
            className="bg-[#1C1C1E] rounded-xl p-4 hover:bg-[#252528] transition-colors"
          >
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-3">
                <div className="relative">
                  <img src={item.fromTokenImage} alt={item.fromToken} className="w-8 h-8 rounded-full" />
                  <img 
                    src={item.toTokenImage} 
                    alt={item.toToken} 
                    className="w-5 h-5 rounded-full absolute -bottom-1 -right-1 border-2 border-[#1C1C1E]" 
                  />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-medium">{item.fromToken}</span>
                    <ArrowRight size={14} className="text-gray-500" />
                    <span className="font-medium">{item.toToken}</span>
                  </div>
                  <div className="text-xs text-gray-500">{item.date}</div>
                </div>
              </div>
              <div className="flex items-center gap-2">
                {getStatusIcon(item.status)}
                <span className={`text-xs font-medium ${
                  item.status === 'completed' ? 'text-green-500' : 
                  item.status === 'failed' ? 'text-red-500' : 'text-yellow-500'
                }`}>
                  {item.status.charAt(0).toUpperCase() + item.status.slice(1)}
                </span>
              </div>
            </div>
            <div className="flex items-center justify-between text-sm">
              <div>
                <span className="text-gray-400">-{item.fromAmount} {item.fromToken}</span>
                <span className="text-gray-600 mx-2">/</span>
                <span className="text-green-500">+{item.toAmount.toLocaleString()} {item.toToken}</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-xs text-gray-500 bg-black/30 px-2 py-1 rounded">{item.chain}</span>
                <button className="text-gray-500 hover:text-[#AB9FF2] transition-colors">
                  <ExternalLink size={14} />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {filteredHistory.length === 0 && (
        <div className="text-center py-8 text-gray-500">
          <History size={40} className="mx-auto mb-2 opacity-50" />
          <p>No swap history found</p>
        </div>
      )}
    </div>
  );
};
