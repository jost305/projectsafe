import React, { useState, useEffect } from 'react';
import { Wallet, Plus, Check, ChevronRight, Copy, ExternalLink, Trash2, Edit2, X, QrCode } from 'lucide-react';
import { ManagedWallet } from '../types';
import { useAccount, useDisconnect } from 'wagmi';

const STORAGE_KEY = 'phantom_wallets';

const DEFAULT_WALLETS: ManagedWallet[] = [
  { id: '1', address: '0x742d35Cc6634C0532925a3b844Bc9e7595f0Ab37', name: 'Main Wallet', isActive: true, balance: 24500.50, chain: 'ETH', avatar: 'https://picsum.photos/seed/wallet1/200' },
  { id: '2', address: '0x1234567890abcdef1234567890abcdef12345678', name: 'Trading', isActive: false, balance: 8750.25, chain: 'ETH', avatar: 'https://picsum.photos/seed/wallet2/200' },
  { id: '3', address: '8x7hK9...2v3dQp', name: 'Solana DeFi', isActive: false, balance: 5200.00, chain: 'SOL', avatar: 'https://picsum.photos/seed/wallet3/200' },
  { id: '4', address: '0xabcd...efgh', name: 'NFT Vault', isActive: false, balance: 12400.80, chain: 'POLY', avatar: 'https://picsum.photos/seed/wallet4/200' },
];

const loadWallets = (): ManagedWallet[] => {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored ? JSON.parse(stored) : DEFAULT_WALLETS;
  } catch {
    return DEFAULT_WALLETS;
  }
};

const saveWallets = (wallets: ManagedWallet[]) => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(wallets));
  } catch (e) {
    console.error('Failed to save wallets:', e);
  }
};

interface WalletManagerProps {
  onClose?: () => void;
}

export const WalletManager: React.FC<WalletManagerProps> = ({ onClose }) => {
  const [wallets, setWallets] = useState<ManagedWallet[]>(() => loadWallets());

  useEffect(() => {
    saveWallets(wallets);
  }, [wallets]);
  const [showAddWallet, setShowAddWallet] = useState(false);
  const [editingWallet, setEditingWallet] = useState<string | null>(null);
  const [editName, setEditName] = useState('');
  const [copiedAddress, setCopiedAddress] = useState<string | null>(null);
  const { address: connectedAddress } = useAccount();
  const { disconnect } = useDisconnect();

  const totalBalance = wallets.reduce((acc, w) => acc + w.balance, 0);

  const handleSwitchWallet = (walletId: string) => {
    setWallets(prev => prev.map(w => ({
      ...w,
      isActive: w.id === walletId
    })));
  };

  const handleCopyAddress = (address: string) => {
    navigator.clipboard.writeText(address);
    setCopiedAddress(address);
    setTimeout(() => setCopiedAddress(null), 2000);
  };

  const handleDeleteWallet = (walletId: string) => {
    setWallets(prev => prev.filter(w => w.id !== walletId));
  };

  const handleEditWallet = (walletId: string, name: string) => {
    setEditingWallet(walletId);
    setEditName(name);
  };

  const handleSaveEdit = (walletId: string) => {
    setWallets(prev => prev.map(w => 
      w.id === walletId ? { ...w, name: editName } : w
    ));
    setEditingWallet(null);
  };

  const getChainColor = (chain: string) => {
    switch (chain) {
      case 'ETH': return 'bg-blue-500';
      case 'SOL': return 'bg-purple-500';
      case 'POLY': return 'bg-violet-500';
      default: return 'bg-gray-500';
    }
  };

  return (
    <div className="flex flex-col gap-4 animate-fade-in">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Wallet size={20} className="text-[#AB9FF2]" />
          <h3 className="font-bold text-lg">My Wallets</h3>
        </div>
        <button
          onClick={() => setShowAddWallet(true)}
          className="flex items-center gap-1 px-3 py-1.5 bg-[#AB9FF2] text-black rounded-lg text-sm font-bold hover:bg-[#9180e0] transition-colors"
        >
          <Plus size={16} />
          Add
        </button>
      </div>

      <div className="bg-gradient-to-br from-[#AB9FF2]/10 to-[#1C1C1E] rounded-2xl p-4 border border-white/10">
        <p className="text-sm text-gray-400 mb-1">Total Portfolio Value</p>
        <p className="text-3xl font-bold">${totalBalance.toLocaleString(undefined, { minimumFractionDigits: 2 })}</p>
        <p className="text-sm text-gray-500 mt-1">{wallets.length} wallets connected</p>
      </div>

      {showAddWallet && (
        <div className="bg-[#1C1C1E] rounded-2xl p-4 border border-[#AB9FF2]/30">
          <div className="flex items-center justify-between mb-4">
            <h4 className="font-bold">Add New Wallet</h4>
            <button onClick={() => setShowAddWallet(false)} className="text-gray-400 hover:text-white">
              <X size={18} />
            </button>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <button className="flex flex-col items-center gap-2 p-4 bg-black/30 rounded-xl hover:bg-black/50 transition-colors">
              <Wallet size={24} className="text-[#AB9FF2]" />
              <span className="text-sm font-medium">Import Wallet</span>
              <span className="text-xs text-gray-500">Via seed phrase</span>
            </button>
            <button className="flex flex-col items-center gap-2 p-4 bg-black/30 rounded-xl hover:bg-black/50 transition-colors">
              <QrCode size={24} className="text-[#AB9FF2]" />
              <span className="text-sm font-medium">WalletConnect</span>
              <span className="text-xs text-gray-500">Scan QR code</span>
            </button>
          </div>
          <button className="w-full mt-3 py-3 bg-[#AB9FF2]/20 text-[#AB9FF2] rounded-xl font-bold hover:bg-[#AB9FF2]/30 transition-colors">
            Create New Wallet
          </button>
        </div>
      )}

      <div className="flex flex-col gap-2">
        {wallets.map(wallet => (
          <div
            key={wallet.id}
            className={`bg-[#1C1C1E] rounded-xl p-4 transition-all ${
              wallet.isActive ? 'border-2 border-[#AB9FF2]' : 'border-2 border-transparent hover:border-white/10'
            }`}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="relative">
                  <img 
                    src={wallet.avatar} 
                    alt={wallet.name} 
                    className="w-12 h-12 rounded-full object-cover"
                  />
                  {wallet.isActive && (
                    <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-green-500 rounded-full flex items-center justify-center border-2 border-[#1C1C1E]">
                      <Check size={10} className="text-white" />
                    </div>
                  )}
                  <div className={`absolute -top-1 -left-1 w-4 h-4 ${getChainColor(wallet.chain)} rounded-full flex items-center justify-center border-2 border-[#1C1C1E]`}>
                    <span className="text-[8px] font-bold text-white">{wallet.chain[0]}</span>
                  </div>
                </div>
                <div>
                  {editingWallet === wallet.id ? (
                    <div className="flex items-center gap-2">
                      <input
                        type="text"
                        value={editName}
                        onChange={(e) => setEditName(e.target.value)}
                        className="bg-black/50 rounded px-2 py-1 text-sm focus:outline-none focus:ring-1 focus:ring-[#AB9FF2]"
                        autoFocus
                      />
                      <button 
                        onClick={() => handleSaveEdit(wallet.id)}
                        className="text-green-500 hover:text-green-400"
                      >
                        <Check size={16} />
                      </button>
                      <button 
                        onClick={() => setEditingWallet(null)}
                        className="text-gray-400 hover:text-white"
                      >
                        <X size={16} />
                      </button>
                    </div>
                  ) : (
                    <div className="flex items-center gap-2">
                      <span className="font-bold">{wallet.name}</span>
                      <button 
                        onClick={() => handleEditWallet(wallet.id, wallet.name)}
                        className="text-gray-500 hover:text-white transition-colors"
                      >
                        <Edit2 size={12} />
                      </button>
                    </div>
                  )}
                  <div className="flex items-center gap-2 text-xs text-gray-500">
                    <span className="font-mono">
                      {wallet.address.length > 15 
                        ? `${wallet.address.slice(0, 6)}...${wallet.address.slice(-4)}` 
                        : wallet.address}
                    </span>
                    <button
                      onClick={() => handleCopyAddress(wallet.address)}
                      className="hover:text-white transition-colors"
                    >
                      {copiedAddress === wallet.address ? (
                        <Check size={12} className="text-green-500" />
                      ) : (
                        <Copy size={12} />
                      )}
                    </button>
                  </div>
                </div>
              </div>
              <div className="text-right">
                <div className="font-bold">${wallet.balance.toLocaleString(undefined, { minimumFractionDigits: 2 })}</div>
                <div className="text-xs text-gray-500">{wallet.chain}</div>
              </div>
            </div>

            <div className="flex items-center gap-2 mt-3 pt-3 border-t border-white/5">
              {!wallet.isActive && (
                <button
                  onClick={() => handleSwitchWallet(wallet.id)}
                  className="flex-1 py-2 bg-[#AB9FF2]/20 text-[#AB9FF2] rounded-lg text-sm font-bold hover:bg-[#AB9FF2]/30 transition-colors"
                >
                  Switch to Wallet
                </button>
              )}
              {wallet.isActive && (
                <span className="flex-1 py-2 text-center text-green-500 text-sm font-bold">
                  Active Wallet
                </span>
              )}
              <button className="p-2 hover:bg-white/5 rounded-lg transition-colors">
                <ExternalLink size={16} className="text-gray-400" />
              </button>
              {!wallet.isActive && (
                <button 
                  onClick={() => handleDeleteWallet(wallet.id)}
                  className="p-2 hover:bg-red-500/20 rounded-lg transition-colors"
                >
                  <Trash2 size={16} className="text-red-400" />
                </button>
              )}
            </div>
          </div>
        ))}
      </div>

      {connectedAddress && (
        <button
          onClick={() => disconnect()}
          className="w-full py-3 bg-red-500/10 text-red-500 rounded-xl font-bold hover:bg-red-500/20 transition-colors"
        >
          Disconnect All Wallets
        </button>
      )}
    </div>
  );
};
