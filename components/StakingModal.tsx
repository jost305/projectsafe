import React, { useState } from 'react';
import { X, Search, ShieldCheck, ChevronRight, Info } from 'lucide-react';
import { VALIDATORS } from '../constants';

interface StakingModalProps {
  onClose: () => void;
  tokenSymbol: string;
}

export const StakingModal: React.FC<StakingModalProps> = ({ onClose, tokenSymbol }) => {
  const [step, setStep] = useState<'list' | 'amount' | 'confirm'>('list');
  const [selectedValidator, setSelectedValidator] = useState(VALIDATORS[0]);
  const [amount, setAmount] = useState('');

  if (step === 'list') {
    return (
      <div class="fixed inset-0 z-50 flex items-end justify-center sm:items-center bg-black/80 backdrop-blur-sm animate-fade-in">
        <div class="bg-[#1C1C1E] w-full max-w-md rounded-t-3xl sm:rounded-3xl overflow-hidden border border-white/10 shadow-2xl relative animate-slide-up h-[85vh] flex flex-col">
           <div class="p-4 flex justify-between items-center border-b border-white/5 bg-[#1C1C1E]">
             <h2 class="font-bold text-lg">Stake {tokenSymbol}</h2>
             <button onClick={onClose} class="p-2 bg-white/5 rounded-full hover:bg-white/10 transition-colors">
                <X size={16} />
             </button>
           </div>
           
           <div class="p-4 bg-[#1C1C1E]">
              <div class="relative">
                 <Search class="absolute left-3 top-3 text-gray-500" size={16} />
                 <input type="text" placeholder="Search validators" class="w-full bg-[#0C0C0C] h-10 rounded-xl pl-10 pr-4 focus:outline-none focus:ring-1 focus:ring-[#AB9FF2] text-sm" />
              </div>
           </div>

           <div class="flex-1 overflow-y-auto p-4 flex flex-col gap-2">
              <div class="flex justify-between px-2 mb-1">
                 <span class="text-xs font-bold text-gray-500">Validator</span>
                 <span class="text-xs font-bold text-gray-500">APY</span>
              </div>
              {VALIDATORS.map((validator) => (
                 <div 
                   key={validator.id} 
                   onClick={() => {
                     setSelectedValidator(validator);
                     setStep('amount');
                   }}
                   class="flex items-center justify-between p-3 rounded-xl hover:bg-white/5 transition-colors cursor-pointer group"
                 >
                    <div class="flex items-center gap-3">
                       <div class="w-10 h-10 rounded-full bg-gray-800 flex items-center justify-center overflow-hidden">
                          {validator.image ? (
                             <img src={validator.image} alt={validator.name} class="w-full h-full object-cover" />
                          ) : (
                             <span class="font-bold text-gray-400">{validator.name[0]}</span>
                          )}
                       </div>
                       <div>
                          <div class="flex items-center gap-1">
                             <span class="font-bold text-sm">{validator.name}</span>
                             {validator.verified && <ShieldCheck size={12} class="text-green-500" />}
                          </div>
                          <span class="text-xs text-gray-500">{validator.totalStaked} Staked</span>
                       </div>
                    </div>
                    <div class="flex items-center gap-2">
                       <span class="text-green-400 font-bold">{validator.apy}%</span>
                       <ChevronRight size={16} class="text-gray-600 group-hover:text-white" />
                    </div>
                 </div>
              ))}
           </div>
        </div>
      </div>
    );
  }

  return (
    <div class="fixed inset-0 z-50 flex items-end justify-center sm:items-center bg-black/80 backdrop-blur-sm animate-fade-in">
      <div class="bg-[#1C1C1E] w-full max-w-md rounded-t-3xl sm:rounded-3xl overflow-hidden border border-white/10 shadow-2xl relative animate-slide-up">
        <div class="p-4 flex justify-between items-center border-b border-white/5">
           <h2 class="font-bold text-lg">Stake {tokenSymbol}</h2>
           <button onClick={() => setStep('list')} class="text-sm text-gray-400 hover:text-white">Back</button>
        </div>

        <div class="p-6">
           <div class="flex items-center gap-3 mb-6 bg-[#0C0C0C] p-3 rounded-xl">
               <div class="w-8 h-8 rounded-full bg-gray-800 overflow-hidden">
                  {selectedValidator.image && <img src={selectedValidator.image} class="w-full h-full object-cover" />}
               </div>
               <div class="flex-1">
                  <div class="font-bold text-sm">{selectedValidator.name}</div>
                  <div class="text-xs text-green-500">{selectedValidator.apy}% APY</div>
               </div>
           </div>

           <div class="mb-6">
              <div class="flex justify-between mb-2">
                 <span class="text-xs font-bold text-gray-500">Amount</span>
                 <span class="text-xs font-bold text-gray-500">Max: 145.2 SOL</span>
              </div>
              <div class="bg-[#0C0C0C] rounded-xl p-4 flex items-center justify-between border border-transparent focus-within:border-[#AB9FF2] transition-colors">
                 <input 
                   type="number" 
                   value={amount}
                   onChange={(e) => setAmount((e.target as HTMLInputElement).value)}
                   placeholder="0.00"
                   class="bg-transparent text-xl font-bold focus:outline-none w-full"
                   autofocus
                 />
                 <span class="font-bold text-gray-400">SOL</span>
              </div>
           </div>

           <div class="bg-[#AB9FF2]/10 border border-[#AB9FF2]/20 p-3 rounded-xl flex gap-3 mb-6">
              <Info class="text-[#AB9FF2] shrink-0" size={18} />
              <p class="text-xs text-[#AB9FF2]">
                 Staking locks your funds. You can unstake at any time, but it takes ~2 days (1 epoch) to withdraw.
              </p>
           </div>

           <button 
             onClick={onClose}
             class="w-full bg-[#AB9FF2] text-black h-12 rounded-xl font-bold active:scale-[0.98] transition-transform"
           >
             Stake {amount || '0'} SOL
           </button>
        </div>
      </div>
    </div>
  );
};