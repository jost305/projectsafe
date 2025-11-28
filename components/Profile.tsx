import React from 'react';
import { usePrivy } from '@privy-io/react-auth';
import { Wallet, X } from 'lucide-react';

export default function Profile() {
  const { ready, authenticated, user, login, logout } = usePrivy();

  return (
    <div className="flex items-center gap-2">
      {!authenticated ? (
        <button
          onClick={login}
          disabled={!ready}
          className="bg-[#AB9FF2] text-black px-3 py-1.5 rounded-lg font-semibold text-xs md:text-sm hover:bg-[#9B8FE2] transition-colors disabled:opacity-50"
        >
          Connect
        </button>
      ) : (
        <div className="flex items-center gap-2 bg-[#1C1C1E] rounded-lg px-2 py-1.5">
          {user?.wallet?.address && (
            <div className="flex items-center gap-1.5">
              <div className="w-6 h-6 rounded-full bg-gradient-to-tr from-purple-500 to-blue-500 flex items-center justify-center shrink-0">
                <Wallet size={14} />
              </div>
              <div className="hidden md:flex flex-col">
                <span className="text-xs font-semibold leading-tight">
                  {user?.wallet?.address.slice(0, 5)}...{user?.wallet?.address.slice(-3)}
                </span>
              </div>
              <button
                onClick={logout}
                className="text-gray-400 hover:text-white transition-colors shrink-0"
              >
                <X size={14} />
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
