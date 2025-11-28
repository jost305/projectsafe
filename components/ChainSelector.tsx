import React, { useState } from 'react';
import { ChevronDown, Check, Zap, Globe } from 'lucide-react';
import { useChainId, useSwitchChain } from 'wagmi';

interface Chain {
  id: number;
  name: string;
  icon: string;
  color: string;
  nativeToken: string;
}

const SUPPORTED_CHAINS: Chain[] = [
  { id: 1, name: 'Ethereum', icon: 'https://cryptologos.cc/logos/ethereum-eth-logo.png?v=029', color: '#627EEA', nativeToken: 'ETH' },
  { id: 137, name: 'Polygon', icon: 'https://cryptologos.cc/logos/polygon-matic-logo.png?v=029', color: '#8247E5', nativeToken: 'MATIC' },
  { id: 42161, name: 'Arbitrum', icon: 'https://cryptologos.cc/logos/arbitrum-arb-logo.png?v=029', color: '#28A0F0', nativeToken: 'ETH' },
  { id: 10, name: 'Optimism', icon: 'https://cryptologos.cc/logos/optimism-ethereum-op-logo.png?v=029', color: '#FF0420', nativeToken: 'ETH' },
  { id: 8453, name: 'Base', icon: 'https://avatars.githubusercontent.com/u/108554348?s=200&v=4', color: '#0052FF', nativeToken: 'ETH' },
];

interface ChainSelectorProps {
  compact?: boolean;
}

export const ChainSelector: React.FC<ChainSelectorProps> = ({ compact = false }) => {
  const [isOpen, setIsOpen] = useState(false);
  const chainId = useChainId();
  const { switchChain, isPending } = useSwitchChain();

  const currentChain = SUPPORTED_CHAINS.find(c => c.id === chainId) || SUPPORTED_CHAINS[0];

  const handleChainSwitch = (chain: Chain) => {
    if (chain.id !== chainId) {
      switchChain({ chainId: chain.id });
    }
    setIsOpen(false);
  };

  if (compact) {
    return (
      <div className="relative">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="flex items-center gap-2 px-3 py-2 bg-[#1C1C1E] rounded-xl hover:bg-[#252528] transition-colors"
        >
          <img src={currentChain.icon} alt={currentChain.name} className="w-5 h-5 rounded-full" />
          <ChevronDown size={14} className={`text-gray-400 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
        </button>

        {isOpen && (
          <div className="absolute top-full mt-2 right-0 bg-[#1C1C1E] rounded-xl border border-white/10 shadow-xl z-50 min-w-[160px] overflow-hidden">
            {SUPPORTED_CHAINS.map(chain => (
              <button
                key={chain.id}
                onClick={() => handleChainSwitch(chain)}
                disabled={isPending}
                className="w-full flex items-center justify-between px-4 py-3 hover:bg-white/5 transition-colors"
              >
                <div className="flex items-center gap-2">
                  <img src={chain.icon} alt={chain.name} className="w-5 h-5 rounded-full" />
                  <span className="text-sm font-medium">{chain.name}</span>
                </div>
                {chain.id === chainId && <Check size={14} className="text-[#AB9FF2]" />}
              </button>
            ))}
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="bg-[#1C1C1E] rounded-2xl p-4 border border-white/5">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Globe size={18} className="text-[#AB9FF2]" />
          <h3 className="font-bold">Network</h3>
        </div>
        {isPending && (
          <span className="text-xs text-[#AB9FF2] animate-pulse">Switching...</span>
        )}
      </div>

      <div className="grid grid-cols-2 gap-2">
        {SUPPORTED_CHAINS.map(chain => (
          <button
            key={chain.id}
            onClick={() => handleChainSwitch(chain)}
            disabled={isPending}
            className={`flex items-center gap-2 p-3 rounded-xl transition-all ${
              chain.id === chainId 
                ? 'bg-[#AB9FF2]/20 border-2 border-[#AB9FF2]' 
                : 'bg-black/30 border-2 border-transparent hover:border-white/10'
            }`}
          >
            <img src={chain.icon} alt={chain.name} className="w-6 h-6 rounded-full" />
            <div className="flex flex-col items-start">
              <span className="text-sm font-medium">{chain.name}</span>
              <span className="text-xs text-gray-500">{chain.nativeToken}</span>
            </div>
            {chain.id === chainId && (
              <Zap size={12} className="text-[#AB9FF2] ml-auto" />
            )}
          </button>
        ))}
      </div>
    </div>
  );
};
