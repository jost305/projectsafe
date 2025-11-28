import React, { useState } from 'react';
import { TRENDING_APPS, SOCIAL_FEED } from '../constants';
import { 
  Compass, ExternalLink, User, ShoppingCart, Repeat, Flame, ShieldCheck, 
  Search, X, Lock, RotateCcw, ChevronLeft, ChevronRight, Wallet, 
  Clock, ArrowUpRight, Globe, Sparkles, LayoutGrid, Coins, Image, Gamepad2,
  Trash2, TrendingUp
} from 'lucide-react';
import { TransactionDetails } from '../types';

interface ExploreProps {
  onRequestTransaction: (details: Partial<TransactionDetails>) => void;
}

export const Explore: React.FC<ExploreProps> = ({ onRequestTransaction }) => {
  const [activeSection, setActiveSection] = useState<'apps' | 'feed'>('apps');
  const [currentUrl, setCurrentUrl] = useState<string | null>(null);
  const [urlInput, setUrlInput] = useState('');
  const [isConnected, setIsConnected] = useState(false);
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const [recentSearches, setRecentSearches] = useState<string[]>(['jup.ag', 'Magic Eden']);
  const [showLeaveDialog, setShowLeaveDialog] = useState(false);

  const categories = [
    { id: 'DeFi', label: 'DeFi', icon: Coins, color: 'text-green-400', bg: 'bg-green-500/10' },
    { id: 'NFTs', label: 'NFTs', icon: Image, color: 'text-pink-400', bg: 'bg-pink-500/10' },
    { id: 'Gaming', label: 'Gaming', icon: Gamepad2, color: 'text-purple-400', bg: 'bg-purple-500/10' },
    { id: 'Utilities', label: 'Utilities', icon: LayoutGrid, color: 'text-blue-400', bg: 'bg-blue-500/10' },
  ];

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (urlInput.trim()) {
      let url = urlInput.trim();
      
      if (!recentSearches.includes(url)) {
        setRecentSearches(prev => [url, ...prev].slice(0, 5));
      }

      // Check if it's a DApp name first
      const dAppMatch = TRENDING_APPS.find(app => 
        app.name.toLowerCase() === url.toLowerCase() || 
        app.url.includes(url.toLowerCase())
      );

      if (dAppMatch) {
        openDApp(dAppMatch.url);
        return;
      }

      // Basic URL handling
      if (!url.startsWith('http') && !url.includes('.')) {
        // Search term logic
        console.log("Searching for:", url);
      } else {
        if (!url.startsWith('http')) {
            url = `https://${url}`;
        }
        openDApp(url);
      }
    }
  };

  const openDApp = (url: string) => {
    setCurrentUrl(url);
    setUrlInput(url);
    setIsConnected(false);
    setIsSearchFocused(false);
    setShowLeaveDialog(false);
  };

  const handleConnect = () => {
    setIsConnected(true);
  };

  const filteredApps = urlInput 
    ? TRENDING_APPS.filter(app => 
        app.name.toLowerCase().includes(urlInput.toLowerCase()) || 
        app.url.toLowerCase().includes(urlInput.toLowerCase()) ||
        app.category.toLowerCase().includes(urlInput.toLowerCase())
      )
    : [];

  if (currentUrl) {
    return (
      <div class="fixed inset-0 z-50 bg-white flex flex-col animate-slide-up">
        {/* Browser Header */}
        <div class="bg-[#1C1C1E] px-4 py-3 flex items-center gap-3 border-b border-white/5 mt-0 safe-top">
           <button 
              onClick={() => setShowLeaveDialog(true)} 
              class="text-gray-400 hover:text-white p-1"
           >
              <X size={20} />
           </button>
           <div class="flex-1 bg-[#0C0C0C] h-10 rounded-xl flex items-center px-3 gap-2 border border-transparent focus-within:border-[#AB9FF2]/50 transition-colors">
              <Lock size={12} class="text-green-500" />
              <input 
                type="text" 
                value={urlInput}
                onChange={(e) => setUrlInput((e.target as HTMLInputElement).value)}
                onKeydown={(e) => e.key === 'Enter' && handleSearch(e)}
                class="flex-1 bg-transparent text-sm text-white focus:outline-none"
              />
           </div>
           <button class="text-gray-400 hover:text-white p-1">
              <RotateCcw size={20} />
           </button>
        </div>

        {/* Browser Content Simulation */}
        <div class="flex-1 bg-white relative overflow-hidden flex flex-col">
            {currentUrl.includes('jup.ag') ? (
              <div class="h-full bg-[#1A1A1A] text-white flex flex-col items-center justify-center p-6 text-center">
                 <img src="https://static.jup.ag/jup/icon.png" class="w-20 h-20 mb-4 rounded-full shadow-2xl" />
                 <h1 class="text-3xl font-bold mb-2">Jupiter</h1>
                 <p class="text-gray-400 mb-8">The best swap aggregator on Solana</p>
                 
                 <div class="w-full max-w-sm bg-[#2C2C2E] p-5 rounded-3xl border border-white/5 shadow-xl mb-6">
                    <div class="flex justify-between items-center mb-4">
                       <span class="font-bold text-gray-400 text-sm">Selling</span>
                       <span class="font-bold">10 SOL</span>
                    </div>
                    <div class="h-[1px] bg-white/10 mb-4 w-full"></div>
                    <div class="flex justify-between items-center">
                       <span class="font-bold text-gray-400 text-sm">Buying</span>
                       <span class="font-bold text-[#AB9FF2]">1,425 USDC</span>
                    </div>
                 </div>

                 {!isConnected ? (
                    <button 
                      onClick={handleConnect}
                      class="bg-[#22c55e] hover:bg-[#1eb054] text-black px-8 py-4 rounded-2xl font-bold text-lg transition-transform active:scale-95 flex items-center gap-2"
                    >
                      <Wallet size={20} /> Connect Wallet
                    </button>
                 ) : (
                    <button 
                      onClick={() => onRequestTransaction({
                         dAppName: 'Jupiter',
                         dAppIcon: 'https://static.jup.ag/jup/icon.png',
                         fromAmount: 10,
                         toAmount: 1425,
                         network: 'SOL'
                      })}
                      class="bg-[#AB9FF2] hover:bg-[#9b8ee0] text-black px-8 py-4 rounded-2xl font-bold text-lg transition-transform active:scale-95 shadow-[0_0_20px_rgba(171,159,242,0.3)]"
                    >
                      Swap 10 SOL
                    </button>
                 )}
              </div>
            ) : currentUrl.includes('magiceden') ? (
               <div class="h-full bg-[#120C18] text-white flex flex-col items-center justify-center p-6 text-center">
                 <img src="https://play-lh.googleusercontent.com/lM_cKkHjA-k-XpS8Z9Fz4M4XzK4Z5Z5Z5Z5Z5Z5Z5Z5Z5Z5Z5Z5Z5Z5Z5Z5Z5Z5Z=w240-h480-rw" class="w-20 h-20 mb-4 rounded-2xl shadow-2xl" />
                 <h1 class="text-3xl font-bold mb-2 text-pink-500">Magic Eden</h1>
                 <p class="text-gray-400 mb-8">Discover, Buy & Sell NFTs</p>
                 
                 <div class="grid grid-cols-2 gap-4 w-full max-w-xs mb-8">
                    <div class="aspect-square bg-[#2C2C2E] rounded-xl border border-white/5 relative overflow-hidden group">
                       <img src="https://picsum.photos/seed/nft1/200" class="w-full h-full object-cover opacity-60 group-hover:opacity-100 transition-opacity" />
                       <div class="absolute bottom-2 left-2 bg-black/50 px-2 py-1 rounded text-xs font-bold">4.2 SOL</div>
                    </div>
                    <div class="aspect-square bg-[#2C2C2E] rounded-xl border border-white/5 relative overflow-hidden group">
                        <img src="https://picsum.photos/seed/nft2/200" class="w-full h-full object-cover opacity-60 group-hover:opacity-100 transition-opacity" />
                        <div class="absolute bottom-2 left-2 bg-black/50 px-2 py-1 rounded text-xs font-bold">12 SOL</div>
                    </div>
                 </div>

                 {!isConnected ? (
                    <button 
                      onClick={handleConnect}
                      class="bg-pink-500 hover:bg-pink-600 text-white px-8 py-4 rounded-2xl font-bold text-lg transition-transform active:scale-95 flex items-center gap-2"
                    >
                       <Wallet size={20} /> Connect Wallet
                    </button>
                 ) : (
                    <button 
                       onClick={() => onRequestTransaction({
                         dAppName: 'Magic Eden',
                         dAppIcon: 'https://play-lh.googleusercontent.com/lM_cKkHjA-k-XpS8Z9Fz4M4XzK4Z5Z5Z5Z5Z5Z5Z5Z5Z5Z5Z5Z5Z5Z5Z5Z5Z5Z5Z=w240-h480-rw',
                         fromAmount: 4.2,
                         network: 'SOL'
                      })}
                       class="bg-pink-500 hover:bg-pink-600 text-white px-8 py-4 rounded-2xl font-bold text-lg transition-transform active:scale-95 shadow-[0_0_20px_rgba(236,72,153,0.3)]"
                    >
                       Buy Floor (4.2 SOL)
                    </button>
                 )}
              </div>
            ) : (
              <div class="h-full bg-gray-100 flex flex-col items-center justify-center text-gray-800 p-6">
                 <div class="w-20 h-20 bg-gray-200 rounded-full flex items-center justify-center mb-6 shadow-inner">
                    <Compass size={40} class="text-gray-400" />
                 </div>
                 <h2 class="text-2xl font-bold mb-2 text-center">Browsing {new URL(currentUrl).hostname}</h2>
                 <p class="text-sm text-gray-500 mb-8 text-center max-w-xs">
                    This is a simulated browser view. Enter 'jup.ag' or 'magiceden.io' to test DApp interactions.
                 </p>
                 <button class="bg-black text-white px-8 py-3 rounded-xl font-bold shadow-xl active:scale-95 transition-transform">
                    Connect Wallet
                 </button>
              </div>
            )}

            {/* Leave Confirmation Dialog */}
            {showLeaveDialog && (
              <div class="absolute inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm animate-fade-in p-4">
                 <div class="bg-[#1C1C1E] w-full max-w-sm rounded-2xl p-6 border border-white/10 shadow-2xl animate-slide-up">
                    <h3 class="text-lg font-bold text-white mb-2">Leave DApp?</h3>
                    <p class="text-gray-400 text-sm mb-6 leading-relaxed">
                       Are you sure you want to leave this DApp? Your session may be interrupted.
                    </p>
                    <div class="flex gap-3">
                       <button 
                         onClick={() => setShowLeaveDialog(false)}
                         class="flex-1 bg-[#2C2C2E] hover:bg-[#3C3C3E] text-white py-3 rounded-xl font-bold transition-colors"
                       >
                         Stay
                       </button>
                       <button 
                         onClick={() => {
                            setCurrentUrl(null);
                            setShowLeaveDialog(false);
                         }}
                         class="flex-1 bg-red-500/10 hover:bg-red-500/20 text-red-500 py-3 rounded-xl font-bold transition-colors"
                       >
                         Leave
                       </button>
                    </div>
                 </div>
              </div>
            )}
        </div>

        {/* Browser Navigation Footer */}
        <div class="bg-[#1C1C1E] px-6 py-3 border-t border-white/5 flex justify-between items-center pb-8 safe-bottom">
           <button class="text-gray-400 hover:text-white p-2 active:scale-90 transition-transform">
              <ChevronLeft size={24} />
           </button>
           <button class="text-gray-400 hover:text-white p-2 active:scale-90 transition-transform">
              <ChevronRight size={24} />
           </button>
           <button class="text-gray-400 hover:text-white p-2 active:scale-90 transition-transform">
              <ExternalLink size={24} />
           </button>
        </div>
      </div>
    );
  }

  return (
    <div class="flex flex-col h-full bg-[#0C0C0C] animate-fade-in pb-24 relative">
       {/* Search Header */}
       <div class="px-5 pt-4 pb-2 z-20 bg-[#0C0C0C]">
          <form onSubmit={handleSearch} class="relative flex gap-2">
             <div class="relative flex-1">
                <Search class={`absolute left-3 top-3 transition-colors ${isSearchFocused ? 'text-[#AB9FF2]' : 'text-gray-500'}`} size={18} />
                <input 
                  type="text" 
                  placeholder="Search apps or type URL" 
                  value={urlInput}
                  onFocus={() => setIsSearchFocused(true)}
                  onChange={(e) => setUrlInput((e.target as HTMLInputElement).value)}
                  class="w-full bg-[#1C1C1E] h-12 rounded-xl pl-10 pr-4 focus:outline-none focus:ring-1 focus:ring-[#AB9FF2] text-sm text-white placeholder-gray-500 transition-all" 
                />
             </div>
             {isSearchFocused && (
                 <button 
                   type="button"
                   onClick={() => { setIsSearchFocused(false); setUrlInput(''); }}
                   class="text-sm font-bold text-gray-400 hover:text-white px-2 animate-fade-in"
                 >
                    Cancel
                 </button>
             )}
          </form>
       </div>

       {isSearchFocused ? (
          <div class="absolute top-[80px] left-0 right-0 bottom-0 bg-[#0C0C0C] z-10 overflow-y-auto px-5 pb-24 animate-fade-in">
              {/* Search Suggestions */}
              {urlInput.length > 0 ? (
                 <div class="flex flex-col gap-4">
                    <div>
                        <h3 class="text-xs font-bold text-gray-500 uppercase mb-2">Top Matches</h3>
                        {filteredApps.length > 0 ? (
                           <div class="flex flex-col gap-2">
                              {filteredApps.map(app => (
                                 <div 
                                    key={app.id} 
                                    onClick={() => openDApp(app.url)}
                                    class="flex items-center gap-3 p-3 rounded-xl hover:bg-[#1C1C1E] transition-colors cursor-pointer border border-transparent hover:border-white/5"
                                 >
                                    <img src={app.icon} class="w-10 h-10 rounded-xl" alt={app.name} />
                                    <div class="flex-1">
                                       <div class="font-bold text-sm">{app.name}</div>
                                       <div class="text-xs text-gray-500">{app.url}</div>
                                    </div>
                                    <ArrowUpRight size={16} class="text-gray-500" />
                                 </div>
                              ))}
                           </div>
                        ) : (
                           <div class="py-4 text-center text-gray-500 text-sm">
                              No apps found. Press enter to browse.
                           </div>
                        )}
                    </div>

                    <div>
                       <h3 class="text-xs font-bold text-gray-500 uppercase mb-2">Web Search</h3>
                       <button 
                         onClick={(e) => handleSearch(e)}
                         class="w-full flex items-center gap-3 p-3 rounded-xl hover:bg-[#1C1C1E] transition-colors cursor-pointer text-left group"
                       >
                          <div class="w-10 h-10 rounded-xl bg-[#1C1C1E] group-hover:bg-[#AB9FF2]/10 flex items-center justify-center transition-colors">
                             <Globe size={20} class="text-blue-400" />
                          </div>
                          <div class="flex-1">
                             <div class="font-bold text-sm">Go to {urlInput}</div>
                             <div class="text-xs text-gray-500">Visit Website</div>
                          </div>
                          <ChevronRight size={16} class="text-gray-500" />
                       </button>
                    </div>
                 </div>
              ) : (
                 <div class="flex flex-col gap-6">
                    {/* Recent Searches */}
                    {recentSearches.length > 0 && (
                       <div>
                          <div class="flex justify-between items-center mb-2">
                             <h3 class="text-xs font-bold text-gray-500 uppercase">Recent</h3>
                             <button onClick={() => setRecentSearches([])} class="p-1 hover:bg-white/10 rounded-full text-gray-500 hover:text-red-400 transition-colors">
                               <Trash2 size={14} />
                             </button>
                          </div>
                          <div class="flex flex-col gap-1">
                             {recentSearches.map((term, i) => (
                                <button 
                                  key={i} 
                                  onClick={() => { setUrlInput(term); handleSearch({ preventDefault: () => {} } as any); }}
                                  class="flex items-center gap-3 p-3 rounded-xl hover:bg-[#1C1C1E] transition-colors text-left group"
                                >
                                   <Clock size={16} class="text-gray-500 group-hover:text-white" />
                                   <span class="text-sm font-medium text-gray-300 group-hover:text-white">{term}</span>
                                   <div class="ml-auto opacity-0 group-hover:opacity-100 -rotate-45">
                                      <ArrowUpRight size={14} class="text-gray-500" />
                                   </div>
                                </button>
                             ))}
                          </div>
                       </div>
                    )}

                    {/* Explore Categories */}
                    <div>
                       <h3 class="text-xs font-bold text-gray-500 uppercase mb-3">Explore Categories</h3>
                       <div class="grid grid-cols-2 gap-3">
                          {categories.map(cat => (
                             <button 
                               key={cat.id}
                               onClick={() => setUrlInput(cat.label)}
                               class="flex items-center gap-3 p-3 rounded-xl bg-[#1C1C1E] border border-white/5 hover:border-white/10 hover:bg-[#2C2C2E] transition-all text-left group"
                             >
                                <div class={`w-10 h-10 rounded-lg ${cat.bg} flex items-center justify-center`}>
                                   <cat.icon size={20} class={cat.color} />
                                </div>
                                <span class="font-bold text-sm text-gray-200 group-hover:text-white">{cat.label}</span>
                             </button>
                          ))}
                       </div>
                    </div>

                    {/* Suggested / Trending */}
                     <div>
                        <h3 class="text-xs font-bold text-gray-500 uppercase mb-2">Trending Now</h3>
                        <div class="flex flex-col gap-2">
                           {TRENDING_APPS.slice(0, 3).map(app => (
                              <div 
                                 key={app.id} 
                                 onClick={() => openDApp(app.url)}
                                 class="flex items-center gap-3 p-3 rounded-xl hover:bg-[#1C1C1E] transition-colors cursor-pointer border border-transparent hover:border-white/5 group"
                              >
                                 <img src={app.icon} class="w-10 h-10 rounded-xl" alt={app.name} />
                                 <div class="flex-1">
                                    <div class="font-bold text-sm group-hover:text-[#AB9FF2] transition-colors">{app.name}</div>
                                    <div class="text-xs text-gray-500">{app.category}</div>
                                 </div>
                                 <div class="flex items-center gap-1 text-xs font-bold text-green-500 bg-green-500/10 px-2 py-1 rounded-lg">
                                    <TrendingUp size={12} />
                                    Hot
                                 </div>
                              </div>
                           ))}
                        </div>
                     </div>
                 </div>
              )}
          </div>
       ) : (
         <>
           <div class="px-5 py-2 border-b border-white/5">
              <div class="flex gap-6 mt-2">
                 <button 
                   onClick={() => setActiveSection('apps')}
                   class={`pb-2 text-sm font-bold relative transition-colors ${activeSection === 'apps' ? 'text-white' : 'text-gray-500'}`}
                 >
                   Ecosystem
                   {activeSection === 'apps' && <div class="absolute -bottom-[9px] left-0 right-0 h-0.5 bg-[#AB9FF2] rounded-full" />}
                 </button>
                 <button 
                   onClick={() => setActiveSection('feed')}
                   class={`pb-2 text-sm font-bold relative transition-colors ${activeSection === 'feed' ? 'text-white' : 'text-gray-500'}`}
                 >
                   Community
                   {activeSection === 'feed' && <div class="absolute -bottom-[9px] left-0 right-0 h-0.5 bg-[#AB9FF2] rounded-full" />}
                 </button>
              </div>
           </div>

           <div class="flex-1 overflow-y-auto p-5 scrollbar-hide">
              {activeSection === 'apps' ? (
                 <div class="flex flex-col gap-6">
                    <div>
                       <h3 class="font-bold text-lg mb-3 flex items-center gap-2">
                          <Flame size={18} class="text-orange-500" /> Trending Apps
                       </h3>
                       <div class="grid grid-cols-2 gap-3">
                          {TRENDING_APPS.map((app) => (
                             <div 
                               key={app.id} 
                               onClick={() => openDApp(app.url)}
                               class="bg-[#1C1C1E] p-3 rounded-2xl border border-white/5 hover:bg-[#2C2C2E] transition-colors cursor-pointer group active:scale-[0.98]"
                             >
                                <div class="flex justify-between items-start mb-2">
                                   <img src={app.icon} class="w-10 h-10 rounded-xl" alt={app.name} />
                                   <span class="text-[10px] bg-white/10 px-1.5 py-0.5 rounded text-gray-300">{app.category}</span>
                                </div>
                                <h4 class="font-bold text-sm">{app.name}</h4>
                                <p class="text-xs text-gray-500 line-clamp-1 mb-3">{app.description}</p>
                                <div class="flex items-center text-[10px] text-[#AB9FF2] font-bold">
                                   <User size={10} class="mr-1" /> {app.users} users
                                </div>
                             </div>
                          ))}
                       </div>
                    </div>

                    {/* Banner */}
                    <div class="bg-gradient-to-r from-purple-900 to-indigo-900 rounded-2xl p-4 flex items-center justify-between shadow-lg cursor-pointer hover:scale-[1.02] transition-transform">
                       <div>
                          <h3 class="font-bold text-lg mb-1">Quest Hub</h3>
                          <p class="text-xs text-gray-300 mb-2">Earn rewards by trying new apps.</p>
                          <button class="bg-white text-black text-xs font-bold px-3 py-1.5 rounded-lg active:scale-95 transition-transform">Start Quest</button>
                       </div>
                       <Compass size={48} class="text-white/20 rotate-12" />
                    </div>
                 </div>
              ) : (
                 <div class="flex flex-col gap-4">
                    <h3 class="font-bold text-lg mb-1">Following</h3>
                    {SOCIAL_FEED.map((post) => (
                       <div key={post.id} class="bg-[#1C1C1E] p-4 rounded-2xl border border-white/5 flex gap-3">
                          <div class="relative">
                             <img src={post.avatar} class="w-10 h-10 rounded-full" alt={post.user} />
                             <div class="absolute -bottom-1 -right-1 bg-[#2C2C2E] p-0.5 rounded-full">
                                {post.type === 'buy' && <ShoppingCart size={12} class="text-green-500" />}
                                {post.type === 'sell' && <Repeat size={12} class="text-red-500" />}
                                {post.type === 'mint' && <Flame size={12} class="text-orange-500" />}
                                {post.type === 'stake' && <ShieldCheck size={12} class="text-[#AB9FF2]" />}
                             </div>
                          </div>
                          <div class="flex-1">
                             <div class="flex justify-between items-start">
                                <span class="font-bold text-sm">{post.user}</span>
                                <span class="text-xs text-gray-500">{post.time}</span>
                             </div>
                             <p class="text-sm text-gray-300">
                                {post.action} <span class="text-white font-bold">{post.target}</span>
                                {post.amount && <span class="text-gray-500"> for {post.amount}</span>}
                             </p>
                          </div>
                       </div>
                    ))}
                    
                    <div class="text-center py-4">
                       <button class="text-sm text-[#AB9FF2] font-bold">Find more friends</button>
                    </div>
                 </div>
              )}
           </div>
         </>
       )}
    </div>
  );
};