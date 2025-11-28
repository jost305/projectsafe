import React, { useState } from 'react';
import { TransactionDetails } from '../types';
import { ShieldCheck, ArrowRight, X, Fingerprint, Globe, Wallet, ArrowUpRight, Link } from 'lucide-react';

interface TransactionSignerProps {
  transaction: TransactionDetails;
  onConfirm: () => void;
  onCancel: () => void;
}

export const TransactionSigner: React.FC<TransactionSignerProps> = ({ transaction, onConfirm, onCancel }) => {
  const [isSimulating, setIsSimulating] = useState(false);

  const handleApprove = () => {
    setIsSimulating(true);
    setTimeout(onConfirm, 1500);
  };

  return (
    <div class="fixed inset-0 z-50 flex items-end justify-center sm:items-center bg-black/80 backdrop-blur-sm animate-fade-in">
      <div class="bg-[#1C1C1E] w-full max-w-sm rounded-t-2xl sm:rounded-2xl overflow-hidden border border-white/10 shadow-2xl relative animate-slide-up">
        
        {/* Header */}
        <div class="p-5 border-b border-white/5 flex justify-between items-center bg-[#141416]">
          <h2 class="text-lg font-bold flex items-center gap-2">
            <div class="w-8 h-8 rounded-full bg-[#AB9FF2]/10 flex items-center justify-center">
               <ShieldCheck class="text-[#AB9FF2]" size={18} />
            </div>
            {transaction.type === 'DAPP' ? 'Approve Transaction' : 'Sign Transaction'}
          </h2>
          <button onClick={onCancel} class="bg-white/5 p-2 rounded-full hover:bg-white/10 transition-colors active:scale-95">
            <X size={16} />
          </button>
        </div>

        <div class="p-5 flex flex-col gap-5">
          
          {/* Simulation Status */}
          <div class="bg-green-500/5 border border-green-500/20 rounded-xl p-3 flex items-center gap-3">
            <div class="w-8 h-8 rounded-full bg-green-500/20 flex items-center justify-center shrink-0">
              <ShieldCheck size={16} class="text-green-400" />
            </div>
            <div>
              <p class="text-green-400 font-bold text-sm">No risk detected</p>
              <p class="text-green-400/60 text-xs">
                Simulation successful • {transaction.dAppName || (transaction.type === 'SWAP' ? 'Jupiter Aggregator' : 'Solana Network')}
              </p>
            </div>
          </div>

          {/* DApp Connection Header if applicable */}
          {transaction.type === 'DAPP' && transaction.dAppName && (
            <div class="flex flex-col items-center py-2">
               <div class="w-16 h-16 rounded-2xl bg-[#2C2C2E] flex items-center justify-center mb-2 overflow-hidden border border-white/10">
                  {transaction.dAppIcon ? (
                    <img src={transaction.dAppIcon} alt={transaction.dAppName} class="w-full h-full object-cover" />
                  ) : (
                    <Link size={32} class="text-gray-500" />
                  )}
               </div>
               <div class="text-sm text-gray-400">Request from</div>
               <div class="font-bold text-lg text-white">{transaction.dAppName}</div>
               <div class="text-xs text-[#AB9FF2] bg-[#AB9FF2]/10 px-2 py-0.5 rounded mt-1">Verified App</div>
            </div>
          )}

          {/* Action Visual */}
          <div class="flex flex-col gap-3">
            <h3 class="text-gray-500 text-[10px] font-bold uppercase tracking-wider pl-1">Transaction Details</h3>
            
            <div class="flex flex-col gap-2">
              {/* FROM / SELLING */}
              <div class="flex items-center justify-between p-3.5 rounded-xl bg-[#0C0C0C] border border-white/5">
                <div class="flex items-center gap-3">
                  <div class="relative">
                    <img src={transaction.fromToken.image} alt={transaction.fromToken.name} class="w-10 h-10 rounded-full opacity-80" />
                    <div class="absolute -bottom-1 -right-1 w-4 h-4 bg-red-500 rounded-full flex items-center justify-center border border-[#0C0C0C]">
                      <ArrowRight size={10} class="text-white -rotate-45" />
                    </div>
                  </div>
                  <div class="flex flex-col">
                    <span class="text-gray-300 font-bold text-sm">
                      {transaction.type === 'SWAP' ? 'Selling' : transaction.type === 'DAPP' ? 'Spending' : 'Sending'}
                    </span>
                    <span class="text-gray-500 text-xs flex items-center gap-1">
                      <Wallet size={10} /> Wallet 1
                    </span>
                  </div>
                </div>
                <div class="text-right">
                    <div class="text-red-400 font-bold tabular-nums">-{transaction.fromAmount} {transaction.fromToken.symbol}</div>
                    <div class="text-gray-600 text-xs">≈ ${(transaction.fromAmount * transaction.fromToken.price).toLocaleString()}</div>
                </div>
              </div>

              {/* TO / BUYING / RECIPIENT */}
              {(transaction.type === 'SWAP' || transaction.type === 'DAPP') && transaction.toToken ? (
                <div class="flex items-center justify-between p-3.5 rounded-xl bg-[#0C0C0C] border border-green-500/20 relative overflow-hidden">
                  <div class="absolute left-0 top-0 bottom-0 w-1 bg-green-500"></div>
                  <div class="flex items-center gap-3">
                    <div class="relative">
                       <img src={transaction.toToken.image} alt={transaction.toToken.name} class="w-10 h-10 rounded-full" />
                       <div class="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 rounded-full flex items-center justify-center border border-[#0C0C0C]">
                          <ArrowRight size={10} class="text-white rotate-135" />
                       </div>
                    </div>
                    <div class="flex flex-col">
                      <span class="text-white font-bold text-sm">Receiving</span>
                      <span class="text-gray-500 text-xs">{transaction.toToken.name}</span>
                    </div>
                  </div>
                  <div class="text-right">
                    <div class="text-green-400 font-bold tabular-nums">+{transaction.toAmount} {transaction.toToken.symbol}</div>
                    {transaction.toAmount && (
                      <div class="text-gray-600 text-xs">≈ ${(transaction.toAmount * transaction.toToken.price).toLocaleString()}</div>
                    )}
                  </div>
                </div>
              ) : transaction.recipient ? (
                <div class="flex items-center justify-between p-3.5 rounded-xl bg-[#0C0C0C] border border-white/5">
                  <div class="flex items-center gap-3">
                    <div class="w-10 h-10 rounded-full bg-[#1C1C1E] flex items-center justify-center border border-white/10">
                       <ArrowUpRight size={20} class="text-gray-400" />
                    </div>
                    <div class="flex flex-col">
                      <span class="text-gray-300 font-bold text-sm">To</span>
                      <span class="text-gray-500 text-xs font-mono">{transaction.recipient}</span>
                    </div>
                  </div>
                </div>
              ) : null}
            </div>
          </div>

          {/* Network Fee */}
          <div class="bg-[#141416] rounded-xl p-3 border border-white/5">
             <div class="flex justify-between items-center mb-1">
                <span class="text-gray-400 text-xs flex items-center gap-1">
                    <Globe size={12} /> Network Fee
                </span>
                <div class="flex items-center gap-1">
                <span class="text-white text-xs font-bold">~{transaction.fee} {transaction.network}</span>
                <span class="text-gray-500 text-[10px]">($0.002)</span>
                </div>
             </div>
             <div class="w-full bg-gray-800 h-1 rounded-full overflow-hidden mt-2">
                 <div class="bg-green-500 h-full w-[10%]"></div>
             </div>
          </div>

          {/* Buttons */}
          <div class="flex flex-col gap-3 mt-1">
            <button 
              onClick={handleApprove}
              disabled={isSimulating}
              class="w-full bg-[#AB9FF2] hover:bg-[#9b8ee0] active:scale-[0.98] text-black font-bold h-14 rounded-xl flex items-center justify-center gap-2 transition-all shadow-[0_0_20px_rgba(171,159,242,0.2)] disabled:opacity-70 disabled:cursor-not-allowed group"
            >
              {isSimulating ? (
                 <span class="flex items-center gap-2">
                     <span class="w-4 h-4 border-2 border-black/30 border-t-black rounded-full animate-spin"></span>
                     Processing...
                 </span>
              ) : (
                <>
                  <Fingerprint size={20} class="group-hover:scale-110 transition-transform" /> 
                  Confirm Transaction
                </>
              )}
            </button>
            <button onClick={onCancel} class="w-full text-gray-500 font-medium py-2 hover:text-white transition-colors text-sm">
              Reject
            </button>
          </div>

        </div>
      </div>
    </div>
  );
};