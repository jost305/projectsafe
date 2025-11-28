import React, { useState, useMemo } from 'react';
import { Eye, Lock, Copy, CheckCircle, AlertTriangle, ChevronLeft, ShieldCheck, ArrowRight } from 'lucide-react';

interface RecoveryPhraseProps {
  onClose: () => void;
}

const SEED_PHRASE = [
  'witch', 'collapse', 'practice', 'feed', 'shame', 'open',
  'despair', 'creek', 'road', 'again', 'ice', 'least'
];

export const RecoveryPhrase: React.FC<RecoveryPhraseProps> = ({ onClose }) => {
  const [step, setStep] = useState<'view' | 'verify' | 'success'>('view');
  const [isRevealed, setIsRevealed] = useState(false);
  const [copied, setCopied] = useState(false);
  const [error, setError] = useState(false);

  // Generate a verification challenge
  const challenge = useMemo(() => {
    const indices = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11];
    const targetIndex = indices[Math.floor(Math.random() * indices.length)];
    const correctWord = SEED_PHRASE[targetIndex];
    
    // Create distractors
    const otherWords = SEED_PHRASE.filter((_, i) => i !== targetIndex);
    const shuffledOthers = otherWords.sort(() => 0.5 - Math.random());
    const distractors = shuffledOthers.slice(0, 2);
    
    const options = [correctWord, ...distractors].sort(() => 0.5 - Math.random());
    
    return {
      index: targetIndex,
      correctWord,
      options
    };
  }, []);

  const [selectedOption, setSelectedOption] = useState<string | null>(null);

  const handleCopy = () => {
    navigator.clipboard.writeText(SEED_PHRASE.join(' '));
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleVerify = () => {
    if (selectedOption === challenge.correctWord) {
      setStep('success');
      setError(false);
    } else {
      setError(true);
      setTimeout(() => setError(false), 500); // Reset for shake animation
    }
  };

  const renderViewStep = () => (
    <div class="flex-1 flex flex-col p-6 animate-fade-in">
      <div class="flex-1 flex flex-col items-center">
        <div class="w-16 h-16 bg-red-500/10 rounded-full flex items-center justify-center mb-4">
          <Lock size={32} class="text-red-500" />
        </div>
        
        <h3 class="text-xl font-bold text-center mb-2">Secret Recovery Phrase</h3>
        <p class="text-gray-400 text-center text-sm mb-6 max-w-xs">
          This phrase is the only way to recover your wallet. Write it down and keep it safe.
        </p>

        {/* Phrase Grid */}
        <div 
          class="w-full grid grid-cols-3 gap-3 relative select-none mb-6"
          onMousedown={() => setIsRevealed(true)}
          onMouseup={() => setIsRevealed(false)}
          onTouchstart={() => setIsRevealed(true)}
          onTouchend={() => setIsRevealed(false)}
        >
          {SEED_PHRASE.map((word, i) => (
            <div key={i} class="bg-[#1C1C1E] border border-white/5 rounded-lg p-3 flex items-center gap-2">
              <span class="text-gray-600 text-xs font-mono w-4">{i + 1}</span>
              <span class={`font-mono font-medium text-sm transition-all duration-300 ${isRevealed ? 'text-white blur-0' : 'text-transparent blur-md bg-white/10 rounded select-none'}`}>
                {word}
              </span>
            </div>
          ))}

          {/* Blur Overlay Hint */}
          {!isRevealed && (
            <div class="absolute inset-0 flex items-center justify-center pointer-events-none">
              <div class="bg-black/60 backdrop-blur-sm px-4 py-2 rounded-full border border-white/10 flex items-center gap-2 text-sm font-medium shadow-xl">
                <Eye size={16} /> Hold to reveal
              </div>
            </div>
          )}
        </div>

        <div class="w-full bg-red-500/10 border border-red-500/20 rounded-xl p-3 flex gap-3 mb-6">
           <AlertTriangle class="text-red-500 shrink-0" size={20} />
           <p class="text-red-400 text-xs font-medium leading-relaxed">
             Do not share this phrase with anyone. If someone asks for it, they are trying to scam you.
           </p>
        </div>
      </div>

      <div class="flex flex-col gap-3 mt-auto">
        <button 
          onClick={handleCopy}
          class="w-full bg-[#1C1C1E] hover:bg-[#2C2C2E] h-12 rounded-xl flex items-center justify-center gap-2 font-medium transition-colors text-sm"
        >
          {copied ? <CheckCircle size={16} class="text-green-500" /> : <Copy size={16} />}
          {copied ? 'Copied to clipboard' : 'Copy to clipboard'}
        </button>
        <button 
          onClick={() => setStep('verify')}
          class="w-full bg-[#AB9FF2] hover:bg-[#9b8ee0] text-black h-12 rounded-xl font-bold transition-transform active:scale-95"
        >
          Ok, I saved it
        </button>
      </div>
    </div>
  );

  const renderVerifyStep = () => (
    <div class="flex-1 flex flex-col p-6 animate-fade-in">
      <div class="flex-1">
        <h3 class="text-xl font-bold mb-2">Let's verify</h3>
        <p class="text-gray-400 text-sm mb-8">
          Select the correct word to ensure you've saved your recovery phrase.
        </p>

        <div class="bg-[#1C1C1E] border border-white/5 rounded-2xl p-6 text-center mb-8">
           <span class="text-gray-500 text-sm uppercase font-bold tracking-wider">Word #{challenge.index + 1}</span>
           <div class="h-4" />
           <div class="flex flex-col gap-3">
              {challenge.options.map((option) => (
                <button
                  key={option}
                  onClick={() => setSelectedOption(option)}
                  class={`h-12 rounded-xl font-mono font-medium transition-all ${
                    selectedOption === option 
                      ? 'bg-[#AB9FF2] text-black shadow-[0_0_15px_rgba(171,159,242,0.3)] scale-[1.02]' 
                      : 'bg-[#0C0C0C] text-white border border-white/10 hover:border-white/30'
                  }`}
                >
                  {option}
                </button>
              ))}
           </div>
        </div>

        {error && (
           <p class="text-red-500 text-center text-sm font-medium animate-pulse">
             Incorrect word. Please check your backup.
           </p>
        )}
      </div>

      <button 
        onClick={handleVerify}
        disabled={!selectedOption}
        class="w-full bg-[#AB9FF2] disabled:opacity-50 disabled:cursor-not-allowed hover:bg-[#9b8ee0] text-black h-14 rounded-xl font-bold transition-transform active:scale-95 shadow-lg"
      >
        Verify
      </button>
    </div>
  );

  const renderSuccessStep = () => (
    <div class="flex-1 flex flex-col p-6 items-center justify-center animate-fade-in">
       <div class="w-20 h-20 bg-green-500/10 rounded-full flex items-center justify-center mb-6">
          <ShieldCheck size={40} class="text-green-500" />
       </div>
       <h3 class="text-2xl font-bold text-center mb-2">Backup Complete</h3>
       <p class="text-gray-400 text-center text-sm mb-8 max-w-xs">
         Your secret recovery phrase is verified. Keep it safe and never share it.
       </p>
       <button 
          onClick={onClose}
          class="w-full max-w-xs bg-[#1C1C1E] border border-white/10 hover:bg-[#2C2C2E] text-white h-12 rounded-xl font-bold transition-transform active:scale-95"
       >
          Done
       </button>
    </div>
  );

  return (
    <div class="fixed inset-0 z-50 bg-[#0C0C0C] flex flex-col animate-fade-in">
      {step !== 'success' && (
        <div class="px-4 py-4 border-b border-white/5 flex items-center justify-between">
          <button 
            onClick={step === 'view' ? onClose : () => setStep('view')} 
            class="p-2 -ml-2 text-gray-400 hover:text-white transition-colors"
          >
            <ChevronLeft size={24} />
          </button>
          <div class="flex gap-1.5">
             <div class={`w-2 h-2 rounded-full transition-colors ${step === 'view' ? 'bg-[#AB9FF2]' : 'bg-gray-700'}`} />
             <div class={`w-2 h-2 rounded-full transition-colors ${step === 'verify' ? 'bg-[#AB9FF2]' : 'bg-gray-700'}`} />
             <div class="w-2 h-2 rounded-full bg-gray-700" />
          </div>
          <div class="w-8" /> {/* Spacer for centering */}
        </div>
      )}

      {step === 'view' && renderViewStep()}
      {step === 'verify' && renderVerifyStep()}
      {step === 'success' && renderSuccessStep()}
    </div>
  );
};