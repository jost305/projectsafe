import React, { useEffect } from 'react';
import { ToastMessage } from '../types';
import { CheckCircle, XCircle, Flame, X } from 'lucide-react';

interface ToastSystemProps {
  toasts: ToastMessage[];
  removeToast: (id: string) => void;
}

export const ToastSystem: React.FC<ToastSystemProps> = ({ toasts, removeToast }) => {
  return (
    <div class="fixed top-4 left-0 right-0 z-50 flex flex-col items-center gap-2 pointer-events-none px-4">
      {toasts.map((toast) => (
        <div
          key={toast.id}
          class="pointer-events-auto w-full max-w-sm bg-[#1C1C1E] border border-gray-800 rounded-2xl p-3 shadow-2xl flex items-center gap-3 animate-[slideIn_0.3s_ease-out]"
          style={{ animation: 'slideIn 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275)' }}
        >
          {toast.image ? (
            <img src={toast.image} alt="Icon" class="w-10 h-10 rounded-lg object-cover" />
          ) : (
            <div class="w-10 h-10 rounded-full flex items-center justify-center bg-gray-900">
              {toast.type === 'success' && <CheckCircle size={20} class="text-green-500" />}
              {toast.type === 'error' && <XCircle size={20} class="text-red-500" />}
              {toast.type === 'burn' && <Flame size={20} class="text-orange-500 fill-orange-500" />}
            </div>
          )}
          
          <div class="flex-1">
            <h4 class="font-bold text-sm text-white">{toast.title}</h4>
            {toast.subtitle && <p class="text-xs text-gray-400">{toast.subtitle}</p>}
          </div>

          <button 
            onClick={() => removeToast(toast.id)}
            class="p-1 hover:bg-white/10 rounded-full transition-colors"
          >
            <X size={16} class="text-gray-500" />
          </button>
        </div>
      ))}
      <style>{`
        @keyframes slideIn {
          from { transform: translateY(-20px) scale(0.9); opacity: 0; }
          to { transform: translateY(0) scale(1); opacity: 1; }
        }
      `}</style>
    </div>
  );
};