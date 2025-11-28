import React from 'react';
import { NFT } from '../types';
import { ArrowLeft, MoreHorizontal, ExternalLink, Flame, Send } from 'lucide-react';

interface NFTDetailProps {
  nft: NFT;
  onBack: () => void;
  onBurn?: (id: string) => void;
}

export const NFTDetail: React.FC<NFTDetailProps> = ({ nft, onBack, onBurn }) => {
  return (
    <div class="fixed inset-0 z-50 bg-[#0C0C0C] flex flex-col animate-slide-up overflow-y-auto">
       {/* Navbar */}
       <div class="px-4 py-4 flex justify-between items-center sticky top-0 bg-[#0C0C0C]/90 backdrop-blur-md z-10">
          <button onClick={onBack} class="p-2 -ml-2 hover:bg-white/5 rounded-full transition-colors">
             <ArrowLeft size={24} />
          </button>
          <div class="font-bold text-lg">Collectible</div>
          <button class="p-2 -mr-2 hover:bg-white/5 rounded-full transition-colors">
             <MoreHorizontal size={24} />
          </button>
       </div>

       <div class="p-5 flex flex-col items-center pb-24">
          {/* Image */}
          <div class="w-full aspect-square rounded-2xl overflow-hidden shadow-2xl mb-6 border border-white/5 relative group">
             <img src={nft.image} alt={nft.name} class="w-full h-full object-cover" />
             <div class="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
          </div>

          {/* Info */}
          <div class="w-full mb-6">
             <div class="flex justify-between items-start mb-1">
                <h1 class="text-2xl font-bold text-white">{nft.name}</h1>
                <div class="bg-[#1C1C1E] px-3 py-1 rounded-full border border-white/5 flex items-center gap-2">
                   <img src="https://cryptologos.cc/logos/solana-sol-logo.png?v=029" class="w-4 h-4 rounded-full" />
                   <span class="font-bold text-sm text-white">{nft.estValueSol}</span>
                </div>
             </div>
             <p class="text-[#AB9FF2] font-medium flex items-center gap-1">
                {nft.collection} <ExternalLink size={14} />
             </p>
          </div>

          {/* Attributes (Mock) */}
          <div class="w-full grid grid-cols-2 gap-3 mb-8">
             <div class="bg-[#1C1C1E] p-3 rounded-xl border border-white/5">
                <span class="text-gray-500 text-xs uppercase font-bold">Background</span>
                <p class="font-medium text-sm text-gray-200">Purple Haze</p>
                <span class="text-gray-500 text-[10px]">12% have this</span>
             </div>
             <div class="bg-[#1C1C1E] p-3 rounded-xl border border-white/5">
                <span class="text-gray-500 text-xs uppercase font-bold">Eyes</span>
                <p class="font-medium text-sm text-gray-200">Laser Red</p>
                <span class="text-gray-500 text-[10px]">3% have this</span>
             </div>
             <div class="bg-[#1C1C1E] p-3 rounded-xl border border-white/5">
                <span class="text-gray-500 text-xs uppercase font-bold">Mouth</span>
                <p class="font-medium text-sm text-gray-200">Grin</p>
                <span class="text-gray-500 text-[10px]">22% have this</span>
             </div>
              <div class="bg-[#1C1C1E] p-3 rounded-xl border border-white/5">
                <span class="text-gray-500 text-xs uppercase font-bold">Type</span>
                <p class="font-medium text-sm text-gray-200">Legendary</p>
                <span class="text-gray-500 text-[10px]">1% have this</span>
             </div>
          </div>
          
          {/* Actions */}
          <div class="w-full flex flex-col gap-3">
             <button class="w-full bg-[#AB9FF2] text-black h-14 rounded-2xl font-bold text-lg active:scale-[0.98] transition-transform flex items-center justify-center gap-2 shadow-[0_0_20px_rgba(171,159,242,0.2)]">
                <Send size={20} /> Send
             </button>
             
             {nft.isSpam && onBurn && (
                 <button 
                   onClick={() => onBurn(nft.id)}
                   class="w-full bg-red-500/10 text-red-500 h-14 rounded-2xl font-bold text-lg active:scale-[0.98] transition-transform flex items-center justify-center gap-2 border border-red-500/20 hover:bg-red-500/20"
                 >
                    <Flame size={20} /> Burn for SOL
                 </button>
             )}
          </div>
       </div>
    </div>
  );
};