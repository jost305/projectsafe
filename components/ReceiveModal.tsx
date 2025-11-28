import React, { useState } from 'react';
import { X, Copy, CheckCircle, Share2, QrCode } from 'lucide-react';

interface ReceiveModalProps {
  onClose: () => void;
}

export const ReceiveModal: React.FC<ReceiveModalProps> = ({ onClose }) => {
  const [copied, setCopied] = useState(false);
  const address = "8x7...2v3d9kL1mN";

  const handleCopy = () => {
    navigator.clipboard.writeText(address);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div class="fixed inset-0 z-50 flex items-end justify-center sm:items-center bg-black/80 backdrop-blur-sm animate-fade-in">
      <div class="bg-[#1C1C1E] w-full max-w-sm rounded-t-2xl sm:rounded-2xl overflow-hidden border border-white/10 shadow-2xl relative animate-slide-up">
        
        <div class="p-4 flex justify-between items-center border-b border-white/5">
           <h2 class="font-bold text-lg">Receive SOL</h2>
           <button onClick={onClose} class="p-2 bg-white/5 rounded-full hover:bg-white/10 transition-colors">
              <X size={16} />
           </button>
        </div>

        <div class="p-8 flex flex-col items-center gap-6">
           <div class="bg-white p-4 rounded-3xl shadow-[0_0_40px_rgba(171,159,242,0.15)]">
              {/* Simulated QR Code for visual fidelity */}
              <div class="w-48 h-48 bg-white relative overflow-hidden flex flex-wrap content-center justify-center gap-1">
                 {/* This is a visual simulation of a QR code using flexbox and divs */}
                 {[...Array(64)].map((_, i) => (
                    <div key={i} class={`w-5 h-5 ${Math.random() > 0.4 ? 'bg-black' : 'bg-transparent'} rounded-[1px]`} />
                 ))}
                 <div class="absolute inset-0 flex items-center justify-center">
                    <div class="w-12 h-12 bg-black rounded-lg flex items-center justify-center">
                       <div class="w-10 h-10 bg-[#AB9FF2] rounded flex items-center justify-center">
                          <QrCode class="text-black" size={24} />
                       </div>
                    </div>
                 </div>
              </div>
           </div>

           <div class="flex flex-col items-center gap-2">
              <p class="text-gray-400 text-sm">Wallet 1 (Solana)</p>
              <p class="font-mono font-bold text-xl tracking-wider text-white">
                 {address.substring(0, 4)}...{address.substring(address.length - 4)}
              </p>
           </div>

           <div class="flex gap-3 w-full">
              <button 
                onClick={handleCopy}
                class="flex-1 bg-[#2C2C2E] hover:bg-[#3C3C3E] text-white h-12 rounded-xl flex items-center justify-center gap-2 font-bold transition-colors active:scale-95"
              >
                 {copied ? <CheckCircle size={18} class="text-green-500" /> : <Copy size={18} />}
                 {copied ? 'Copied' : 'Copy'}
              </button>
              <button class="flex-1 bg-[#2C2C2E] hover:bg-[#3C3C3E] text-white h-12 rounded-xl flex items-center justify-center gap-2 font-bold transition-colors active:scale-95">
                 <Share2 size={18} /> Share
              </button>
           </div>
        </div>
        
        <div class="px-6 pb-6 text-center">
           <p class="text-xs text-gray-500 bg-[#0C0C0C] p-3 rounded-lg">
             Only send SOL or SPL tokens to this address. Sending other assets may result in permanent loss.
           </p>
        </div>
      </div>
    </div>
  );
};