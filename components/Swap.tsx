import React, { useState } from 'react';
import { ArrowDownUp, Settings, Zap, TrendingUp, DollarSign } from 'lucide-react';
import { Token } from '../types';
import { INITIAL_TOKENS } from '../constants';

interface SwapProps {
  tokens?: Token[];
  onSwap?: (fromToken: Token, toToken: Token, amount: number) => void;
}

export const Swap: React.FC<SwapProps> = ({ 
  tokens = INITIAL_TOKENS,
  onSwap 
}) => {
  const [fromToken, setFromToken] = useState<Token>(tokens[0]);
  const [toToken, setToToken] = useState<Token>(tokens[1]);
  const [fromAmount, setFromAmount] = useState<string>('1.0');
  const [toAmount, setToAmount] = useState<string>('0.0');
  const [showFromTokenSelect, setShowFromTokenSelect] = useState(false);
  const [showToTokenSelect, setShowToTokenSelect] = useState(false);
  const [slippage, setSlippage] = useState<number>(0.5);
  const [isLoading, setIsLoading] = useState(false);

  const handleFromAmountChange = (value: string) => {
    setFromAmount(value);
    if (value && !isNaN(parseFloat(value))) {
      // Simple price conversion (in reality, would fetch from price oracle)
      const exchangeRate = fromToken.price / toToken.price;
      const converted = (parseFloat(value) * exchangeRate).toFixed(6);
      setToAmount(converted);
    } else {
      setToAmount('0.0');
    }
  };

  const handleSwapDirection = () => {
    const temp = fromToken;
    setFromToken(toToken);
    setToToken(temp);
    setFromAmount(toAmount);
    setToAmount(fromAmount);
  };

  const handleSelectFromToken = (token: Token) => {
    setFromToken(token);
    setShowFromTokenSelect(false);
    handleFromAmountChange(fromAmount);
  };

  const handleSelectToToken = (token: Token) => {
    setToToken(token);
    setShowToTokenSelect(false);
    handleFromAmountChange(fromAmount);
  };

  const handleSwap = () => {
    if (parseFloat(fromAmount) <= 0) return;
    setIsLoading(true);
    setTimeout(() => {
      onSwap?.(fromToken, toToken, parseFloat(fromAmount));
      setFromAmount('');
      setToAmount('0.0');
      setIsLoading(false);
    }, 1500);
  };

  const estimatedFee = (parseFloat(fromAmount) * fromToken.price * 0.003).toFixed(2);
  const priceImpact = ((parseFloat(toAmount) * toToken.price) / (parseFloat(fromAmount) * fromToken.price) - 1) * 100;

  return (
    <div className="flex-1 overflow-y-auto pb-24 md:pb-6 scrollbar-hide max-w-4xl mx-auto w-full pt-4 md:pt-6">
      <div className="flex flex-col gap-4 px-4 md:px-6 py-2 animate-fade-in">
        
        {/* Swap Header */}
        <div className="flex items-center justify-between mb-3">
          <h1 className="text-2xl font-bold">Swap</h1>
          <button className="p-1.5 hover:bg-white/5 rounded-lg transition-colors">
            <Settings size={20} className="text-gray-400" />
          </button>
        </div>

        {/* Swap Container */}
        <div className="bg-[#1C1C1E] rounded-2xl p-4 space-y-3">
          
          {/* From Token */}
          <div className="space-y-2">
            <label className="text-sm text-gray-400">You send</label>
            <div className="flex gap-3">
              <input
                type="number"
                value={fromAmount}
                onChange={(e) => handleFromAmountChange(e.target.value)}
                placeholder="0.0"
                className="flex-1 bg-[#0C0C0C] rounded-xl px-4 py-3 text-2xl font-semibold text-white placeholder-gray-600 outline-none focus:ring-2 focus:ring-[#AB9FF2]/50"
              />
              <button
                onClick={() => setShowFromTokenSelect(true)}
                className="flex items-center gap-2 bg-[#0C0C0C] hover:bg-white/5 rounded-xl px-4 py-3 transition-colors"
              >
                <img src={fromToken.image} alt={fromToken.symbol} className="w-6 h-6 rounded-full" />
                <span className="font-semibold">{fromToken.symbol}</span>
              </button>
            </div>
            <div className="text-xs text-gray-500 px-1">
              Balance: {fromToken.balance.toFixed(4)} {fromToken.symbol}
            </div>
          </div>

          {/* Swap Direction Toggle */}
          <div className="flex justify-center">
            <button
              onClick={handleSwapDirection}
              className="p-2 bg-[#0C0C0C] hover:bg-[#AB9FF2]/10 rounded-full transition-colors border border-white/10 hover:border-[#AB9FF2]/30"
            >
              <ArrowDownUp size={20} className="text-[#AB9FF2]" />
            </button>
          </div>

          {/* To Token */}
          <div className="space-y-2">
            <label className="text-sm text-gray-400">You receive</label>
            <div className="flex gap-3">
              <input
                type="text"
                value={toAmount}
                disabled
                placeholder="0.0"
                className="flex-1 bg-[#0C0C0C] rounded-xl px-4 py-3 text-2xl font-semibold text-white placeholder-gray-600 outline-none opacity-75"
              />
              <button
                onClick={() => setShowToTokenSelect(true)}
                className="flex items-center gap-2 bg-[#0C0C0C] hover:bg-white/5 rounded-xl px-4 py-3 transition-colors"
              >
                <img src={toToken.image} alt={toToken.symbol} className="w-6 h-6 rounded-full" />
                <span className="font-semibold">{toToken.symbol}</span>
              </button>
            </div>
            <div className="text-xs text-gray-500 px-1">
              1 {fromToken.symbol} = {(fromToken.price / toToken.price).toFixed(6)} {toToken.symbol}
            </div>
          </div>

          {/* Price Impact & Fee */}
          {fromAmount && parseFloat(fromAmount) > 0 && (
            <div className="bg-black/30 rounded-xl p-3 space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-400">Price Impact</span>
                <span className={priceImpact < -5 ? 'text-red-500 font-semibold' : priceImpact < -2 ? 'text-yellow-500' : 'text-gray-300'}>
                  {priceImpact.toFixed(2)}%
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Estimated Fee</span>
                <span className="text-gray-300">${estimatedFee}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Max Slippage</span>
                <span className="text-gray-300">{slippage}%</span>
              </div>
            </div>
          )}

          {/* Swap Button */}
          <button
            onClick={handleSwap}
            disabled={!fromAmount || parseFloat(fromAmount) <= 0 || isLoading || parseFloat(fromAmount) > fromToken.balance}
            className="w-full bg-[#AB9FF2] hover:bg-[#9B8FE2] disabled:opacity-50 disabled:cursor-not-allowed text-black font-semibold py-4 rounded-xl transition-colors active:scale-95 flex items-center justify-center gap-2"
          >
            {isLoading ? (
              <>
                <div className="w-5 h-5 border-2 border-black/20 border-t-black rounded-full animate-spin" />
                Swapping...
              </>
            ) : parseFloat(fromAmount) > fromToken.balance ? (
              'Insufficient Balance'
            ) : (
              <>
                <Zap size={20} />
                Swap
              </>
            )}
          </button>
        </div>

        {/* Token Select Modals */}
        {showFromTokenSelect && (
          <TokenSelectModal
            tokens={tokens}
            selectedToken={fromToken}
            onSelect={handleSelectFromToken}
            onClose={() => setShowFromTokenSelect(false)}
            title="Select Token to Send"
          />
        )}

        {showToTokenSelect && (
          <TokenSelectModal
            tokens={tokens}
            selectedToken={toToken}
            onSelect={handleSelectToToken}
            onClose={() => setShowToTokenSelect(false)}
            title="Select Token to Receive"
          />
        )}
      </div>
    </div>
  );
};

interface TokenSelectModalProps {
  tokens: Token[];
  selectedToken: Token;
  onSelect: (token: Token) => void;
  onClose: () => void;
  title: string;
}

const TokenSelectModal: React.FC<TokenSelectModalProps> = ({
  tokens,
  selectedToken,
  onSelect,
  onClose,
  title,
}) => {
  const [search, setSearch] = useState('');
  const filtered = tokens.filter(t =>
    t.symbol.toLowerCase().includes(search.toLowerCase()) ||
    t.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="fixed inset-0 bg-black/80 z-50 flex items-end md:items-center md:justify-center p-0 md:p-3">
      <div className="w-full md:w-full md:max-w-sm bg-[#0C0C0C] rounded-t-2xl md:rounded-2xl p-4 space-y-3 max-h-96 md:max-h-screen md:overflow-y-auto">
        <div className="flex items-center justify-between sticky top-0 bg-[#0C0C0C] pb-4">
          <h2 className="text-xl font-bold">{title}</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-white">✕</button>
        </div>

        {/* Search */}
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search tokens..."
          className="w-full bg-[#1C1C1E] rounded-xl px-4 py-3 text-white placeholder-gray-600 outline-none focus:ring-2 focus:ring-[#AB9FF2]/50"
        />

        {/* Token List */}
        <div className="space-y-2">
          {filtered.map((token) => (
            <button
              key={token.id}
              onClick={() => onSelect(token)}
              className={`w-full flex items-center gap-3 p-3 rounded-xl transition-colors ${
                selectedToken.id === token.id
                  ? 'bg-[#AB9FF2]/10 border border-[#AB9FF2]'
                  : 'hover:bg-white/5'
              }`}
            >
              <img src={token.image} alt={token.symbol} className="w-8 h-8 rounded-full" />
              <div className="flex-1 text-left">
                <div className="font-semibold">{token.symbol}</div>
                <div className="text-xs text-gray-500">{token.name}</div>
              </div>
              <div className="text-right">
                <div className="font-semibold">${token.price.toFixed(2)}</div>
                <div className={`text-xs ${token.change24h >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                  {token.change24h >= 0 ? '+' : ''}{token.change24h}%
                </div>
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Swap;
