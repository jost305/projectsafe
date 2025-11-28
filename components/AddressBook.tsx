import React, { useState, useEffect } from 'react';
import { BookUser, Star, Copy, Trash2, Plus, Search, Check, X } from 'lucide-react';
import { AddressBookEntry } from '../types';

interface AddressBookProps {
  onSelectAddress?: (address: string) => void;
  onClose?: () => void;
}

const STORAGE_KEY = 'phantom_address_book';

const DEFAULT_ADDRESSES: AddressBookEntry[] = [
  { id: '1', address: '0x742d35Cc6634C0532925a3b844Bc9e7595f0Ab37', label: 'My Ledger', chain: 'ETH', isFavorite: true, lastUsed: '2024-01-15' },
  { id: '2', address: '8x7...2v3d', label: 'Trading Wallet', chain: 'SOL', isFavorite: true, lastUsed: '2024-01-14' },
  { id: '3', address: '0x1234...5678', label: 'Friend - Alex', chain: 'POLY', isFavorite: false, lastUsed: '2024-01-10' },
];

const loadAddresses = (): AddressBookEntry[] => {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored ? JSON.parse(stored) : DEFAULT_ADDRESSES;
  } catch {
    return DEFAULT_ADDRESSES;
  }
};

const saveAddresses = (addresses: AddressBookEntry[]) => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(addresses));
  } catch (e) {
    console.error('Failed to save addresses:', e);
  }
};

const CHAIN_COLORS: Record<string, string> = {
  ETH: 'bg-blue-500',
  SOL: 'bg-purple-500',
  POLY: 'bg-violet-500',
  ARB: 'bg-blue-400',
  BASE: 'bg-blue-600',
  OP: 'bg-red-500',
};

export const AddressBook: React.FC<AddressBookProps> = ({ onSelectAddress, onClose }) => {
  const [addresses, setAddresses] = useState<AddressBookEntry[]>(() => loadAddresses());
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    saveAddresses(addresses);
  }, [addresses]);
  const [showAddForm, setShowAddForm] = useState(false);
  const [newAddress, setNewAddress] = useState({ address: '', label: '', chain: 'ETH' as const });
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const filteredAddresses = addresses.filter(
    addr => addr.label.toLowerCase().includes(searchQuery.toLowerCase()) ||
            addr.address.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleCopy = (address: string, id: string) => {
    navigator.clipboard.writeText(address);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleToggleFavorite = (id: string) => {
    setAddresses(prev => prev.map(addr => 
      addr.id === id ? { ...addr, isFavorite: !addr.isFavorite } : addr
    ));
  };

  const handleDelete = (id: string) => {
    setAddresses(prev => prev.filter(addr => addr.id !== id));
  };

  const handleAddAddress = () => {
    if (newAddress.address && newAddress.label) {
      const entry: AddressBookEntry = {
        id: Date.now().toString(),
        ...newAddress,
        isFavorite: false,
      };
      setAddresses(prev => [...prev, entry]);
      setNewAddress({ address: '', label: '', chain: 'ETH' });
      setShowAddForm(false);
    }
  };

  const favorites = filteredAddresses.filter(a => a.isFavorite);
  const others = filteredAddresses.filter(a => !a.isFavorite);

  return (
    <div className="flex flex-col gap-4 animate-fade-in">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <BookUser size={20} className="text-[#AB9FF2]" />
          <h3 className="font-bold text-lg">Address Book</h3>
        </div>
        <button
          onClick={() => setShowAddForm(true)}
          className="flex items-center gap-1 px-3 py-1.5 bg-[#AB9FF2] text-black rounded-lg text-sm font-bold hover:bg-[#9180e0] transition-colors"
        >
          <Plus size={16} />
          Add
        </button>
      </div>

      <div className="relative">
        <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
        <input
          type="text"
          placeholder="Search addresses..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full bg-[#1C1C1E] rounded-xl pl-10 pr-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#AB9FF2]/50"
        />
      </div>

      {showAddForm && (
        <div className="bg-[#1C1C1E] rounded-2xl p-4 border border-[#AB9FF2]/30">
          <div className="flex justify-between items-center mb-4">
            <h4 className="font-bold">Add New Address</h4>
            <button onClick={() => setShowAddForm(false)} className="text-gray-400 hover:text-white">
              <X size={18} />
            </button>
          </div>
          <div className="flex flex-col gap-3">
            <input
              type="text"
              placeholder="Label (e.g., My Savings)"
              value={newAddress.label}
              onChange={(e) => setNewAddress(prev => ({ ...prev, label: e.target.value }))}
              className="bg-black/50 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#AB9FF2]/50"
            />
            <input
              type="text"
              placeholder="Wallet Address"
              value={newAddress.address}
              onChange={(e) => setNewAddress(prev => ({ ...prev, address: e.target.value }))}
              className="bg-black/50 rounded-xl px-4 py-3 text-sm font-mono focus:outline-none focus:ring-2 focus:ring-[#AB9FF2]/50"
            />
            <select
              value={newAddress.chain}
              onChange={(e) => setNewAddress(prev => ({ ...prev, chain: e.target.value as any }))}
              className="bg-black/50 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#AB9FF2]/50"
            >
              <option value="ETH">Ethereum</option>
              <option value="SOL">Solana</option>
              <option value="POLY">Polygon</option>
              <option value="ARB">Arbitrum</option>
              <option value="BASE">Base</option>
              <option value="OP">Optimism</option>
            </select>
            <button
              onClick={handleAddAddress}
              className="w-full py-3 bg-[#AB9FF2] text-black rounded-xl font-bold hover:bg-[#9180e0] transition-colors"
            >
              Save Address
            </button>
          </div>
        </div>
      )}

      {favorites.length > 0 && (
        <div>
          <h4 className="text-xs text-gray-500 font-bold uppercase tracking-wider mb-2">Favorites</h4>
          <div className="flex flex-col gap-2">
            {favorites.map(addr => (
              <AddressRow
                key={addr.id}
                address={addr}
                copiedId={copiedId}
                onCopy={handleCopy}
                onToggleFavorite={handleToggleFavorite}
                onDelete={handleDelete}
                onSelect={onSelectAddress}
              />
            ))}
          </div>
        </div>
      )}

      {others.length > 0 && (
        <div>
          <h4 className="text-xs text-gray-500 font-bold uppercase tracking-wider mb-2">All Addresses</h4>
          <div className="flex flex-col gap-2">
            {others.map(addr => (
              <AddressRow
                key={addr.id}
                address={addr}
                copiedId={copiedId}
                onCopy={handleCopy}
                onToggleFavorite={handleToggleFavorite}
                onDelete={handleDelete}
                onSelect={onSelectAddress}
              />
            ))}
          </div>
        </div>
      )}

      {filteredAddresses.length === 0 && (
        <div className="text-center py-8 text-gray-500">
          <BookUser size={40} className="mx-auto mb-2 opacity-50" />
          <p>No addresses found</p>
        </div>
      )}
    </div>
  );
};

interface AddressRowProps {
  address: AddressBookEntry;
  copiedId: string | null;
  onCopy: (address: string, id: string) => void;
  onToggleFavorite: (id: string) => void;
  onDelete: (id: string) => void;
  onSelect?: (address: string) => void;
}

const AddressRow: React.FC<AddressRowProps> = ({ address, copiedId, onCopy, onToggleFavorite, onDelete, onSelect }) => {
  return (
    <div 
      className="bg-[#1C1C1E] rounded-xl p-3 flex items-center justify-between hover:bg-[#252528] transition-colors cursor-pointer group"
      onClick={() => onSelect?.(address.address)}
    >
      <div className="flex items-center gap-3">
        <div className={`w-10 h-10 rounded-full ${CHAIN_COLORS[address.chain]} flex items-center justify-center text-white font-bold text-sm`}>
          {address.chain}
        </div>
        <div>
          <div className="font-medium flex items-center gap-2">
            {address.label}
            <button 
              onClick={(e) => { e.stopPropagation(); onToggleFavorite(address.id); }}
              className="opacity-0 group-hover:opacity-100 transition-opacity"
            >
              <Star size={14} className={address.isFavorite ? 'text-yellow-500 fill-yellow-500' : 'text-gray-500'} />
            </button>
          </div>
          <div className="text-xs text-gray-500 font-mono">
            {address.address.length > 20 ? `${address.address.slice(0, 8)}...${address.address.slice(-6)}` : address.address}
          </div>
        </div>
      </div>
      <div className="flex items-center gap-2">
        <button
          onClick={(e) => { e.stopPropagation(); onCopy(address.address, address.id); }}
          className="p-2 hover:bg-white/10 rounded-lg transition-colors"
        >
          {copiedId === address.id ? <Check size={16} className="text-green-500" /> : <Copy size={16} className="text-gray-400" />}
        </button>
        <button
          onClick={(e) => { e.stopPropagation(); onDelete(address.id); }}
          className="p-2 hover:bg-red-500/20 rounded-lg transition-colors opacity-0 group-hover:opacity-100"
        >
          <Trash2 size={16} className="text-red-400" />
        </button>
      </div>
    </div>
  );
};
