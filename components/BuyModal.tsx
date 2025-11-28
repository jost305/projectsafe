import React, { useState } from 'react';
import { X, CreditCard, ChevronRight, DollarSign } from 'lucide-react';

interface BuyModalProps {
  onClose: () => void;
}

export const BuyModal: React.FC<BuyModalProps> = ({ onClose }) => {
  const [amount, setAmount] = useState('100');
  const [step, setStep] = useState<'amount' | 'provider'>('amount');

  return (
    <div class="fixed inset-0 z-50 flex items-end justify-center sm:items-center bg-black/80 backdrop-blur-sm animate-fade-in">
      <div class="bg-[#1C1C1E] w-full max-w-sm rounded-t-2xl sm:rounded-2xl overflow-hidden border border-white/10 shadow-2xl relative animate-slide-up h-[75vh]">
        
        {/* Header */}
        <div class="p-4 flex justify-between items-center border-b border-white/5">
           <h2 class="font-bold text-lg">{step === 'amount' ? 'Buy Crypto' : 'Select Provider'}</h2>
           <button onClick={onClose} class="p-2 bg-white/5 rounded-full hover:bg-white/10 transition-colors">
              <X size={16} />
           </button>
        </div>

        {step === 'amount' ? (
          <div class="p-6 flex flex-col h-full">
             <div class="flex-1 flex flex-col items-center justify-center gap-2">
                <div class="flex items-center text-5xl font-bold">
                   <span class="text-gray-500">$</span>
                   <input 
                     type="number" 
                     value={amount}
                     onChange={(e) => setAmount((e.target as HTMLInputElement).value)}
                     class="bg-transparent text-white w-40 text-center focus:outline-none"
                     autofocus
                   />
                </div>
                <div class="text-gray-400">≈ {(Number(amount) / 142.5).toFixed(4)} SOL</div>
             </div>

             <div class="bg-[#0C0C0C] p-4 rounded-2xl mb-6 border border-white/5">
                <div class="flex justify-between items-center mb-2">
                   <span class="text-gray-400 text-xs">Buying</span>
                   <div class="flex items-center gap-1 bg-[#1C1C1E] px-2 py-1 rounded-lg">
                      <img src="https://cryptologos.cc/logos/solana-sol-logo.png?v=029" class="w-4 h-4 rounded-full" />
                      <span class="text-xs font-bold">SOL</span>
                   </div>
                </div>
                <div class="h-[1px] bg-white/5 my-2" />
                <div class="flex justify-between items-center">
                   <span class="text-gray-400 text-xs">Payment Method</span>
                   <div class="flex items-center gap-1 text-xs font-bold">
                      <CreditCard size={12} /> Apple Pay
                   </div>
                </div>
             </div>

             <button 
               onClick={() => setStep('provider')}
               class="w-full bg-[#AB9FF2] text-black h-14 rounded-2xl font-bold text-lg mb-8 active:scale-[0.98] transition-transform"
             >
               Next
             </button>
          </div>
        ) : (
          <div class="p-4 flex flex-col gap-3">
             <div class="text-xs font-bold text-gray-500 uppercase ml-2 mb-1">Best Rate</div>
             <div class="bg-[#0C0C0C] p-4 rounded-2xl border border-[#AB9FF2]/50 flex items-center justify-between cursor-pointer hover:bg-white/5 transition-colors">
                 <div class="flex items-center gap-3">
                    <div class="w-10 h-10 rounded-full bg-purple-900/20 flex items-center justify-center font-bold text-purple-400">
                       M
                    </div>
                    <div>
                       <div class="font-bold">MoonPay</div>
                       <div class="text-xs text-green-500">Fastest</div>
                    </div>
                 </div>
                 <div class="text-right">
                    <div class="font-bold">{(Number(amount) / 142.5).toFixed(4)} SOL</div>
                    <div class="text-xs text-gray-500">1 SOL ≈ $142.50</div>
                 </div>
             </div>

             <div class="bg-[#0C0C0C] p-4 rounded-2xl border border-white/5 flex items-center justify-between cursor-pointer hover:bg-white/5 transition-colors">
                 <div class="flex items-center gap-3">
                    <div class="w-10 h-10 rounded-full bg-blue-900/20 flex items-center justify-center font-bold text-blue-400">
                       C
                    </div>
                    <div>
                       <div class="font-bold">Coinbase Pay</div>
                    </div>
                 </div>
                 <div class="text-right">
                    <div class="font-bold">{(Number(amount) / 143.2).toFixed(4)} SOL</div>
                    <div class="text-xs text-gray-500">1 SOL ≈ $143.20</div>
                 </div>
             </div>
             
             <div class="mt-4 px-4 text-center">
               <p class="text-xs text-gray-500">
                 You will be redirected to a third-party provider to complete your purchase.
               </p>
             </div>
          </div>
        )}
      </div>
    </div>
  );
};