import React, { useState, useEffect } from 'react';
import { ScanFace, ChevronRight, Ghost } from 'lucide-react';

interface OnboardingProps {
  onComplete: () => void;
}

export const Onboarding: React.FC<OnboardingProps> = ({ onComplete }) => {
  const [step, setStep] = useState<'welcome' | 'biometric'>('welcome');
  const [bioState, setBioState] = useState<'idle' | 'scanning' | 'success'>('idle');

  const startBiometric = () => {
    setStep('biometric');
    setTimeout(() => setBioState('scanning'), 500);
    setTimeout(() => setBioState('success'), 2500);
    setTimeout(onComplete, 3200);
  };

  if (step === 'welcome') {
    return (
      <div class="min-h-screen flex flex-col justify-between p-6 bg-[#0C0C0C] relative overflow-hidden max-w-md mx-auto">
        {/* Abstract shapes */}
        <div class="absolute top-[-20%] left-[-20%] w-[300px] h-[300px] bg-[#AB9FF2] blur-[120px] opacity-20 rounded-full" />
        
        <div class="flex-1 flex flex-col justify-center items-center gap-6 mt-20">
          <div class="w-24 h-24 bg-[#AB9FF2] rounded-3xl flex items-center justify-center rotate-3 shadow-[0_0_30px_rgba(171,159,242,0.3)]">
             <Ghost size={48} class="text-white" />
          </div>
          <h1 class="text-4xl font-bold text-center tracking-tight text-white">
            Phantom
          </h1>
          <p class="text-gray-400 text-center max-w-xs">
            The friendly crypto wallet built for DeFi & NFTs.
          </p>
        </div>

        <div class="flex flex-col gap-4 mb-8">
          <button 
            onClick={startBiometric}
            class="w-full bg-[#AB9FF2] text-black font-bold h-14 rounded-xl flex items-center justify-center gap-2 hover:bg-[#9b8ee0] transition-transform active:scale-95"
          >
            Create a new wallet
          </button>
          <button 
             class="w-full bg-[#1C1C1E] text-white font-semibold h-14 rounded-xl flex items-center justify-center hover:bg-[#2C2C2E] transition-transform active:scale-95"
          >
            I already have a wallet
          </button>
        </div>
      </div>
    );
  }

  return (
    <div class="min-h-screen flex flex-col justify-center items-center p-6 bg-[#0C0C0C] max-w-md mx-auto">
      <div class="relative">
        <ScanFace 
          size={80} 
          class={`transition-colors duration-500 ${
            bioState === 'success' ? 'text-green-500' : 
            bioState === 'scanning' ? 'text-[#AB9FF2]' : 'text-gray-600'
          }`} 
        />
        {bioState === 'scanning' && (
          <div class="absolute inset-0 animate-pulse border-2 border-[#AB9FF2] rounded-lg opacity-50 blur-sm" />
        )}
      </div>
      
      <h2 class="mt-8 text-xl font-semibold text-white">
        {bioState === 'idle' && 'Verifying Identity...'}
        {bioState === 'scanning' && 'Scanning Face ID...'}
        {bioState === 'success' && 'Authenticated'}
      </h2>
    </div>
  );
};