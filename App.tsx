import React, { useState, useEffect } from 'react';
import { 
  Wallet, 
  Grid2X2, 
  ArrowRightLeft, 
  Settings, 
  Activity, 
  Eye, 
  EyeOff, 
  Bell, 
  ScanLine, 
  ChevronDown, 
  ArrowDown, 
  ArrowUp, 
  CreditCard, 
  Flame, 
  Search, 
  Sparkles, 
  Shield, 
  ShieldCheck,
  Usb, 
  Lock, 
  ChevronRight, 
  Globe,
  History,
  SquareTerminal,
  Radar,
  BookUser,
  Fuel,
  Calendar,
  Wallet2
  ,X
} from 'lucide-react';
import Profile from './components/Profile';
import { usePrivy, useWallets } from '@privy-io/react-auth';
import { useAccount } from 'wagmi';
import { INITIAL_TOKENS, INITIAL_NFTS, COLORS, MARKET_TOKENS, MOCK_HISTORY } from './constants';
import { Token, NFT, Tab, ToastMessage, TransactionDetails } from './types';
import { Onboarding } from './components/Onboarding';
import { ToastSystem } from './components/ToastSystem';
import { Terminal } from './components/Terminal';
import { Track } from './components/Track';
import { Launch } from './components/Launch';
import { TransactionSigner } from './components/TransactionSigner';
import { RecoveryPhrase } from './components/RecoveryPhrase';
import { Watchlist } from './components/Watchlist';
import { ReceiveModal } from './components/ReceiveModal';
import { BuyModal } from './components/BuyModal';
import { StakingModal } from './components/StakingModal';
import { Explore } from './components/Explore';
import { TokenDetail } from './components/TokenDetail';
import { NFTDetail } from './components/NFTDetail';
import { Portfolio } from './components/Portfolio';
import { PriceAlerts } from './components/PriceAlerts';
import { fetchTopTokens, fetchTokenBalances } from './services/moralis';
import { AddressBook } from './components/AddressBook';
import { ChainSelector } from './components/ChainSelector';
import { SwapHistory } from './components/SwapHistory';
import { TokenDiscovery } from './components/TokenDiscovery';
import { GasOptimizer } from './components/GasOptimizer';
import { WalletManager } from './components/WalletManager';
import { TransactionScheduler } from './components/TransactionScheduler';
import { NotificationCenter } from './components/NotificationCenter';
import Swap from './components/Swap';

// Define the Tab enum with updated names
export enum Tab {
  HOME = 'HOME',
  SWAP = 'SWAP',
  LAUNCH = 'LAUNCH',
  MONITOR = 'MONITOR',
  EXPLORE = 'EXPLORE',
  SETTINGS = 'SETTINGS'
}

export default function App() {
  const [hasOnboarded, setHasOnboarded] = useState(false);
  const [activeTab, setActiveTab] = useState<Tab>(Tab.HOME);
  const [privacyMode, setPrivacyMode] = useState(false);
  const [tokens, setTokens] = useState<Token[]>(INITIAL_TOKENS);
  const [marketTokens, setMarketTokens] = useState<Token[]>(MARKET_TOKENS);
  const [nfts, setNfts] = useState<NFT[]>(INITIAL_NFTS);
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  // Privy Authentication
  const { ready, authenticated, user, login, logout } = usePrivy();
  const { wallets } = useWallets();
  const { address, isConnected } = useAccount();
  
  // Get primary wallet address
  const walletAddress = wallets?.[0]?.address || address;

  // New States for Features
  const [homeView, setHomeView] = useState<'ASSETS' | 'NFT' | 'WATCHLIST' | 'PORTFOLIO' | 'ALERTS' | 'DISCOVER'>('ASSETS');
  const [watchlistIds, setWatchlistIds] = useState<string[]>(['solana', 'wif', 'bonk']);
  const [transactionToSign, setTransactionToSign] = useState<TransactionDetails | null>(null);
  const [showRecoveryPhrase, setShowRecoveryPhrase] = useState(false);
  const [showReceiveModal, setShowReceiveModal] = useState(false);
  const [showBuyModal, setShowBuyModal] = useState(false);
  const [showStakingModal, setShowStakingModal] = useState(false);
  const [selectedToken, setSelectedToken] = useState<Token | null>(null);
  const [selectedNft, setSelectedNft] = useState<NFT | null>(null);
  const [hwWalletConnected, setHwWalletConnected] = useState(false);

  // New Feature States
  const [showNotificationCenter, setShowNotificationCenter] = useState(false);
  const [settingsView, setSettingsView] = useState<'main' | 'wallets' | 'addressbook' | 'scheduler' | 'gas' | 'history'>('main');

  // Notification Settings States
  const [priceAlertsEnabled, setPriceAlertsEnabled] = useState(true);
  const [transactionAlertsEnabled, setTransactionAlertsEnabled] = useState(true);

  // Fetch Moralis Data
  useEffect(() => {
    const loadMarketData = async () => {
      try {
        const topTokens = await fetchTopTokens();
        if (topTokens.length > 0) {
          setMarketTokens(prev => [...prev, ...topTokens]);
          setTokens(prev => prev.map(t => {
            const fresh = topTokens.find(ft => ft.symbol === t.symbol);
            return fresh ? { ...t, price: fresh.price, change24h: fresh.change24h } : t;
          }));
        }
      } catch (error) {
        console.error("Error loading market data", error);
      }
    };
    loadMarketData();
  }, []);

  // Fetch User Balances if connected
  useEffect(() => {
    const loadUserBalances = async () => {
       if (isConnected && address) {
          const balances = await fetchTokenBalances(address);
          if (balances.length > 0) {
             setTokens(balances);
          }
       }
    };
    loadUserBalances();
  }, [isConnected, address]);


  // Computed total balance
  const totalBalance = tokens.reduce((acc, t) => acc + (t.balance * t.price), 0);
  const balanceDisplay = privacyMode 
    ? '••••••' 
    : `$${totalBalance.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;

  const addToast = (title: string, type: ToastMessage['type'], subtitle?: string, image?: string) => {
    const id = Math.random().toString(36).substring(7);
    setToasts(prev => [...prev, { id, title, type, subtitle, image }]);
    setTimeout(() => removeToast(id), 4000);
  };

  const removeToast = (id: string) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  };

  const handleBurn = (nftId: string) => {
    const nft = nfts.find(n => n.id === nftId);
    if (!nft) return;
    setNfts(prev => prev.filter(n => n.id !== nftId));
    if (selectedNft?.id === nftId) setSelectedNft(null);
    const burnValue = 0.002;
    setTokens(prev => prev.map(t => t.symbol === 'SOL' ? { ...t, balance: t.balance + burnValue } : t));
    addToast('Burn Successful', 'burn', `+${burnValue} SOL Redeemed`, nft.image);
  };

  const toggleWatchlist = (id: string) => {
    setWatchlistIds(prev => 
      prev.includes(id) ? prev.filter(wId => wId !== id) : [...prev, id]
    );
  };

  const initSendTransaction = () => {
    setTransactionToSign({
      type: 'SEND',
      fromToken: tokens[0], // SOL
      fromAmount: 1.5,
      recipient: '8x7...2v3d', // Mock recipient
      fee: 0.00005,
      network: 'SOL'
    });
  };

  const handleDAppTransaction = (details: Partial<TransactionDetails>) => {
    setTransactionToSign({
        type: 'DAPP',
        fromToken: tokens[0], // SOL usually default
        toToken: INITIAL_TOKENS[4], // Default USDC if needed, or overridden
        fromAmount: details.fromAmount || 0,
        fee: 0.00005,
        network: 'SOL',
        dAppName: details.dAppName,
        dAppIcon: details.dAppIcon,
        ...details
    } as TransactionDetails);
  };

  if (!hasOnboarded && window.innerWidth < 768) {
    return <Onboarding onComplete={() => setHasOnboarded(true)} />;
  }

  return (
    <div class="min-h-screen bg-[#0C0C0C] text-white font-sans flex flex-col overflow-hidden mx-auto relative shadow-2xl">
      <ToastSystem toasts={toasts} removeToast={removeToast} />

      {/* Overlays */}
      {transactionToSign && (
        <TransactionSigner 
          transaction={transactionToSign}
          onConfirm={() => {
            setTransactionToSign(null);
            addToast('Transaction Sent', 'success', 'Confirmed on chain');
          }}
          onCancel={() => setTransactionToSign(null)}
        />
      )}

      {showRecoveryPhrase && (
        <RecoveryPhrase onClose={() => setShowRecoveryPhrase(false)} />
      )}

      {showReceiveModal && (
        <ReceiveModal onClose={() => setShowReceiveModal(false)} />
      )}

      {showBuyModal && (
        <BuyModal onClose={() => setShowBuyModal(false)} />
      )}

      {showStakingModal && (
        <StakingModal 
          tokenSymbol={selectedToken?.symbol || 'SOL'} 
          onClose={() => setShowStakingModal(false)} 
        />
      )}

      {selectedToken && (
        <TokenDetail 
          token={selectedToken}
          onBack={() => setSelectedToken(null)}
          onBuy={() => { setShowBuyModal(true); setSelectedToken(null); }}
          onSwap={() => { setActiveTab(Tab.SWAP); setSelectedToken(null); }}
          onStake={() => setShowStakingModal(true)}
        />
      )}

      {selectedNft && (
        <NFTDetail
          nft={selectedNft}
          onBack={() => setSelectedNft(null)}
          onBurn={handleBurn}
        />
      )}

      {showNotificationCenter && (
        <div class="fixed inset-0 bg-black/80 z-50 flex items-end md:items-start md:justify-end md:p-4">
          <div class="w-full md:w-96 bg-[#0C0C0C] rounded-t-2xl md:rounded-2xl overflow-y-auto max-h-96 md:max-h-screen border border-white/10">
            <div class="p-4 sticky top-0 bg-[#0C0C0C] border-b border-white/5">
              <div class="flex items-center justify-between">
                <h2 class="text-lg font-bold">Notifications</h2>
                <button 
                  onClick={() => setShowNotificationCenter(false)}
                  class="text-gray-400 hover:text-white text-2xl leading-none"
                >
                  ×
                </button>
              </div>
            </div>
            <div class="p-4">
              <NotificationCenter onClose={() => setShowNotificationCenter(false)} />
            </div>
          </div>
        </div>
      )}

      {/* Header with Navigation Menu */}
      <header class="sticky top-0 z-50 border-b border-white/5 bg-[#0C0C0C]/95 backdrop-blur-md">
        <div class="px-4 md:px-6 py-3 flex items-center justify-between max-w-4xl mx-auto w-full">
          {/* Logo */}
          <div class="flex items-center gap-2 shrink-0">
            <div class="w-8 h-8 bg-gradient-to-br from-purple-500 to-blue-500 rounded-lg flex items-center justify-center">
              <Wallet size={18} />
            </div>
            <span class="hidden sm:block text-lg font-bold">Phantom</span>
          </div>

          {/* Desktop Navigation Menu */}
          <nav class="hidden md:flex items-center gap-1">
            {[
              { tab: Tab.HOME, label: 'Home', icon: Wallet },
              { tab: Tab.SWAP, label: 'Swap', icon: ArrowRightLeft },
              { tab: Tab.LAUNCH, label: 'Launch', icon: Flame },
              { tab: Tab.MONITOR, label: 'Track', icon: Radar },
              { tab: Tab.EXPLORE, label: 'Terminal', icon: SquareTerminal },
              { tab: Tab.SETTINGS, label: 'Settings', icon: Settings },
            ].map(({ tab, label, icon: Icon }) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                class={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                  activeTab === tab
                    ? 'text-[#AB9FF2] bg-[#AB9FF2]/10'
                    : 'text-gray-400 hover:text-white hover:bg-white/5'
                }`}
              >
                {label}
              </button>
            ))}
          </nav>

          {/* Right Actions */}
          <div class="flex items-center gap-3 shrink-0">
            <button class="hidden md:flex text-gray-400 hover:text-white transition-colors active:scale-90">
              <ScanLine size={20} />
            </button>
            <button 
              onClick={() => setShowNotificationCenter(true)}
              class="relative text-gray-400 hover:text-white transition-colors active:scale-90"
            >
              <Bell size={20} />
              <span class="absolute -top-1 -right-1 w-2 h-2 bg-red-500 rounded-full"></span>
            </button>
            <Profile />
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <main class="flex-1 overflow-y-auto pb-24 md:pb-6 scrollbar-hide max-w-4xl mx-auto w-full pt-4 md:pt-6">

        {/* HOME TAB */}
        {activeTab === Tab.HOME && (
          <div class="flex flex-col gap-4 px-4 md:px-6 py-2 animate-fade-in">
            {/* Balance Card */}
            <div class="flex flex-col items-center mt-2">
              <div 
                class="flex items-center gap-2 cursor-pointer group"
                onClick={() => setPrivacyMode(!privacyMode)}
              >
                <h1 class="text-4xl md:text-5xl font-extrabold tracking-tight select-none tabular-nums">
                  {balanceDisplay}
                </h1>
                <span class="opacity-0 group-hover:opacity-100 transition-opacity text-gray-500">
                  {privacyMode ? <Eye size={20}/> : <EyeOff size={20}/>}
                </span>
              </div>
              <div class={`mt-2 flex items-center gap-1 text-sm md:text-base font-medium ${tokens[0]?.change24h >= 0 ? 'text-[#22c55e]' : 'text-red-500'}`}>
                {tokens[0]?.change24h >= 0 ? '+' : ''}${(tokens[0]?.balance * tokens[0]?.price * (tokens[0]?.change24h/100)).toFixed(2)} ({tokens[0]?.change24h}%)
                <span class="text-gray-500 ml-1">Today</span>
              </div>
            </div>

            {/* Action Grid */}
            <div class="grid grid-cols-4 gap-2 mt-3 md:flex md:justify-center md:gap-3">
              {[
                { label: 'Receive', icon: ArrowDown, color: 'bg-[#1C1C1E]', onClick: () => setShowReceiveModal(true) },
                { label: 'Send', icon: ArrowUp, color: 'bg-[#1C1C1E]', onClick: initSendTransaction },
                { label: 'Trade', icon: ArrowRightLeft, color: 'bg-[#1C1C1E]', onClick: () => setActiveTab(Tab.SWAP) },
                { label: 'Buy', icon: CreditCard, color: 'bg-[#AB9FF2]', text: 'text-black', onClick: () => setShowBuyModal(true) }
              ].map((action) => (
                <button 
                  key={action.label} 
                  onClick={action.onClick}
                  class="flex flex-col items-center gap-2 group lg:flex-row lg:px-6 lg:py-3"
                >
                  <div class={`w-14 h-14 lg:w-12 lg:h-12 ${action.color} rounded-2xl flex items-center justify-center transition-all duration-200 group-active:scale-90 shadow-lg`}>
                    <action.icon size={24} class={action.text || 'text-[#AB9FF2]'} />
                  </div>
                  <span class="text-xs lg:text-sm font-medium text-gray-300 lg:text-white">{action.label}</span>
                </button>
              ))}
            </div>

            {/* Assets / NFT / Watchlist / Portfolio / Alerts Toggle */}
            <div class="mt-4">
               <div class="flex gap-4 border-b border-white/5 pb-2 mb-4 overflow-x-auto scrollbar-hide">
                  <button 
                    onClick={() => setHomeView('ASSETS')}
                    class={`text-sm font-bold transition-colors pb-2 relative whitespace-nowrap ${homeView === 'ASSETS' ? 'text-white' : 'text-gray-500'}`}
                  >
                    Crypto
                    {homeView === 'ASSETS' && <div class="absolute -bottom-[9px] left-0 right-0 h-0.5 bg-[#AB9FF2] rounded-full" />}
                  </button>
                  <button 
                    onClick={() => setHomeView('NFT')}
                    class={`text-sm font-bold transition-colors pb-2 relative whitespace-nowrap ${homeView === 'NFT' ? 'text-white' : 'text-gray-500'}`}
                  >
                    Collectibles
                    {homeView === 'NFT' && <div class="absolute -bottom-[9px] left-0 right-0 h-0.5 bg-[#AB9FF2] rounded-full" />}
                  </button>
                  <button 
                    onClick={() => setHomeView('PORTFOLIO')}
                    class={`text-sm font-bold transition-colors pb-2 relative whitespace-nowrap ${homeView === 'PORTFOLIO' ? 'text-white' : 'text-gray-500'}`}
                  >
                    Analytics
                    {homeView === 'PORTFOLIO' && <div class="absolute -bottom-[9px] left-0 right-0 h-0.5 bg-[#AB9FF2] rounded-full" />}
                  </button>
                  <button 
                    onClick={() => setHomeView('ALERTS')}
                    class={`text-sm font-bold transition-colors pb-2 relative whitespace-nowrap ${homeView === 'ALERTS' ? 'text-white' : 'text-gray-500'}`}
                  >
                    Alerts
                    {homeView === 'ALERTS' && <div class="absolute -bottom-[9px] left-0 right-0 h-0.5 bg-[#AB9FF2] rounded-full" />}
                  </button>
                  <button 
                    onClick={() => setHomeView('WATCHLIST')}
                    class={`text-sm font-bold transition-colors pb-2 relative whitespace-nowrap ${homeView === 'WATCHLIST' ? 'text-white' : 'text-gray-500'}`}
                  >
                    Watchlist
                    {homeView === 'WATCHLIST' && <div class="absolute -bottom-[9px] left-0 right-0 h-0.5 bg-[#AB9FF2] rounded-full" />}
                  </button>
                  <button 
                    onClick={() => setHomeView('DISCOVER')}
                    class={`text-sm font-bold transition-colors pb-2 relative whitespace-nowrap ${homeView === 'DISCOVER' ? 'text-white' : 'text-gray-500'}`}
                  >
                    Discover
                    {homeView === 'DISCOVER' && <div class="absolute -bottom-[9px] left-0 right-0 h-0.5 bg-[#AB9FF2] rounded-full" />}
                  </button>
               </div>

              {homeView === 'ASSETS' && (
                <div class="flex flex-col gap-3 md:grid md:grid-cols-2 lg:grid-cols-3">
                  {tokens.map((token) => (
                    <div 
                      key={token.id} 
                      onClick={() => setSelectedToken(token)}
                      class="flex items-center justify-between p-3 rounded-2xl hover:bg-[#1C1C1E] transition-colors cursor-pointer group active:scale-[0.98]"
                    >
                      <div class="flex items-center gap-3">
                        <div class="relative">
                           <img src={token.image} alt={token.name} class="w-10 h-10 rounded-full object-cover" />
                           <div class="absolute -bottom-1 -right-1 w-4 h-4 bg-black rounded-full flex items-center justify-center border border-[#1C1C1E]">
                             <div class={`w-2 h-2 rounded-full ${token.network === 'SOL' ? 'bg-purple-400' : 'bg-blue-400'}`}></div>
                           </div>
                        </div>
                        <div class="flex flex-col">
                          <span class="font-bold text-base">{token.name}</span>
                          <div class="flex items-center gap-1">
                            <span class="text-xs text-gray-400">{token.balance.toFixed(4)} {token.symbol}</span>
                          </div>
                        </div>
                      </div>
                      <div class="flex flex-col items-end">
                        <span class="font-bold tabular-nums">
                          {privacyMode ? '****' : `$${(token.balance * token.price).toLocaleString(undefined, { maximumFractionDigits: 2 })}`}
                        </span>
                        <span class={`text-xs font-medium ${token.change24h >= 0 ? 'text-[#22c55e]' : 'text-[#ef4444]'}`}>
                           {token.change24h > 0 ? '+' : ''}{token.change24h.toFixed(2)}%
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {homeView === 'NFT' && (
                 <div class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 animate-fade-in">
                    {/* Spam Toggle */}
                    <div class="col-span-2 flex items-center justify-between bg-[#1C1C1E]/50 p-3 rounded-xl cursor-pointer hover:bg-[#1C1C1E] transition-colors">
                        <div class="flex items-center gap-3">
                        <div class="w-8 h-8 rounded-lg bg-gray-800 flex items-center justify-center">
                            <EyeOff size={16} class="text-gray-400" />
                        </div>
                        <span class="font-semibold text-sm">Hidden / Spam</span>
                        </div>
                        <ChevronDown size={16} class="text-gray-500 -rotate-90" />
                    </div>
                    {nfts.map((nft) => (
                    <div 
                    key={nft.id} 
                    onClick={() => setSelectedNft(nft)}
                    class="group relative bg-[#1C1C1E] rounded-2xl overflow-hidden shadow-lg transition-transform hover:-translate-y-1 cursor-pointer"
                    >
                        <img src={nft.image} alt={nft.name} class="w-full h-40 object-cover" />
                        <div class="p-3">
                            <h4 class="font-bold text-sm truncate">{nft.name}</h4>
                            <p class="text-xs text-gray-400 truncate">{nft.collection}</p>
                            <div class="flex justify-between items-center mt-3">
                                <span class="text-xs font-mono bg-black/50 px-1.5 py-0.5 rounded text-gray-300">
                                    {nft.estValueSol} SOL
                                </span>
                            </div>
                        </div>
                    </div>
                    ))}
                 </div>
              )}

              {homeView === 'PORTFOLIO' && (
                <Portfolio tokens={tokens} />
              )}

              {homeView === 'ALERTS' && (
                <PriceAlerts tokens={tokens} />
              )}

              {homeView === 'WATCHLIST' && (
                <Watchlist watchlistIds={watchlistIds} toggleWatchlist={toggleWatchlist} />
              )}

              {homeView === 'DISCOVER' && (
                <TokenDiscovery />
              )}
            </div>
          </div>
        )}

        {/* SWAP TAB - DEX Swap Interface */}
        {activeTab === Tab.SWAP && (
           <Swap tokens={tokens} onSwap={(from, to, amount) => {
             addToast('Swap Initiated', 'success', `${amount} ${from.symbol} → ${to.symbol}`);
           }} />
        )}

        {/* LAUNCH TAB */}
        {activeTab === Tab.LAUNCH && (
           <Launch />
        )}

        {/* MONITOR TAB (New name for Track) */}
        {activeTab === Tab.MONITOR && (
           <Track />
        )}

        {/* EXPLORE TAB - Now Terminal */}
        {activeTab === Tab.EXPLORE && (
          <Terminal />
        )}

        {/* SETTINGS TAB */}
        {activeTab === Tab.SETTINGS && (
          <div class="p-5 md:p-6 animate-fade-in md:max-w-4xl md:mx-auto">
             {settingsView === 'main' && (
               <>
                 <h2 class="text-2xl font-bold mb-6">Settings</h2>

                 {/* Profile */}
                 <div class="bg-[#1C1C1E] rounded-2xl p-4 flex items-center gap-4 mb-6">
                     <div class="w-16 h-16 rounded-full bg-gradient-to-tr from-purple-500 to-blue-500 p-0.5">
                       <div class="w-full h-full rounded-full bg-black flex items-center justify-center overflow-hidden">
                           {user?.google?.profilePictureUrl || user?.twitter?.profilePictureUrl ? (
                             <img src={user?.google?.profilePictureUrl || user?.twitter?.profilePictureUrl} alt="Avatar" class="w-full h-full object-cover" />
                           ) : (
                             <Wallet size={32} class="text-[#AB9FF2]" />
                           )}
                       </div>
                    </div>
                    <div>
                       <h3 class="font-bold text-lg">
                         {user?.twitter?.username ? `@${user.twitter.username}` : 
                          user?.google?.name || user?.email?.address || 'Wallet User'}
                       </h3>
                       <p class="text-sm text-gray-400">
                         {walletAddress ? `${walletAddress.slice(0, 6)}...${walletAddress.slice(-4)}` : 'Not Connected'}
                       </p>
                    </div>
                 </div>

                 {/* New Features Section */}
                 <h3 class="text-gray-500 font-bold text-xs uppercase tracking-wider mb-3 pl-1">Wallet Management</h3>
                 <div class="bg-[#1C1C1E] rounded-2xl overflow-hidden mb-6">
                    <button 
                      onClick={() => setSettingsView('wallets')}
                      class="w-full flex items-center justify-between p-4 hover:bg-white/5 transition-colors"
                    >
                       <div class="flex items-center gap-3">
                          <div class="w-8 h-8 rounded-full bg-[#AB9FF2]/10 flex items-center justify-center text-[#AB9FF2]">
                             <Wallet2 size={18} />
                          </div>
                          <span class="font-medium">Multi-Wallet Manager</span>
                       </div>
                       <ChevronRight size={18} class="text-gray-500" />
                    </button>
                    <div class="h-[1px] bg-white/5 mx-4" />
                    <button 
                      onClick={() => setSettingsView('addressbook')}
                      class="w-full flex items-center justify-between p-4 hover:bg-white/5 transition-colors"
                    >
                       <div class="flex items-center gap-3">
                          <div class="w-8 h-8 rounded-full bg-blue-500/10 flex items-center justify-center text-blue-500">
                             <BookUser size={18} />
                          </div>
                          <span class="font-medium">Address Book</span>
                       </div>
                       <ChevronRight size={18} class="text-gray-500" />
                    </button>
                 </div>

                 {/* Tools Section */}
                 <h3 class="text-gray-500 font-bold text-xs uppercase tracking-wider mb-3 pl-1">Tools</h3>
                 <div class="bg-[#1C1C1E] rounded-2xl overflow-hidden mb-6">
                    <button 
                      onClick={() => setSettingsView('scheduler')}
                      class="w-full flex items-center justify-between p-4 hover:bg-white/5 transition-colors"
                    >
                       <div class="flex items-center gap-3">
                          <div class="w-8 h-8 rounded-full bg-green-500/10 flex items-center justify-center text-green-500">
                             <Calendar size={18} />
                          </div>
                          <span class="font-medium">DCA & Scheduler</span>
                       </div>
                       <ChevronRight size={18} class="text-gray-500" />
                    </button>
                    <div class="h-[1px] bg-white/5 mx-4" />
                    <button 
                      onClick={() => setSettingsView('gas')}
                      class="w-full flex items-center justify-between p-4 hover:bg-white/5 transition-colors"
                    >
                       <div class="flex items-center gap-3">
                          <div class="w-8 h-8 rounded-full bg-orange-500/10 flex items-center justify-center text-orange-500">
                             <Fuel size={18} />
                          </div>
                          <span class="font-medium">Gas Optimizer</span>
                       </div>
                       <ChevronRight size={18} class="text-gray-500" />
                    </button>
                    <div class="h-[1px] bg-white/5 mx-4" />
                    <button 
                      onClick={() => setSettingsView('history')}
                      class="w-full flex items-center justify-between p-4 hover:bg-white/5 transition-colors"
                    >
                       <div class="flex items-center gap-3">
                          <div class="w-8 h-8 rounded-full bg-purple-500/10 flex items-center justify-center text-purple-500">
                             <History size={18} />
                          </div>
                          <span class="font-medium">Swap History</span>
                       </div>
                       <ChevronRight size={18} class="text-gray-500" />
                    </button>
                 </div>

                 {/* Network Section */}
                 <h3 class="text-gray-500 font-bold text-xs uppercase tracking-wider mb-3 mt-6 pl-1">Network</h3>
                 <ChainSelector />

                 {/* Security Section */}
                 <h3 class="text-gray-500 font-bold text-xs uppercase tracking-wider mb-3 mt-6 pl-1">Security & Privacy</h3>
                 <div class="bg-[#1C1C1E] rounded-2xl overflow-hidden mb-6">
                    <button 
                      onClick={() => setShowRecoveryPhrase(true)}
                      class="w-full flex items-center justify-between p-4 hover:bg-white/5 transition-colors"
                    >
                       <div class="flex items-center gap-3">
                          <div class="w-8 h-8 rounded-full bg-[#AB9FF2]/10 flex items-center justify-center text-[#AB9FF2]">
                             <Lock size={18} />
                          </div>
                          <span class="font-medium">Show Secret Phrase</span>
                       </div>
                       <ChevronRight size={18} class="text-gray-500" />
                    </button>
                    <div class="h-[1px] bg-white/5 mx-4" />
                    <button 
                      onClick={() => setHwWalletConnected(!hwWalletConnected)}
                      class="w-full flex items-center justify-between p-4 hover:bg-white/5 transition-colors"
                    >
                       <div class="flex items-center gap-3">
                          <div class="w-8 h-8 rounded-full bg-blue-500/10 flex items-center justify-center text-blue-500">
                             <Usb size={18} />
                          </div>
                          <span class="font-medium">Hardware Wallet</span>
                       </div>
                       <span class={`text-xs px-2 py-1 rounded-full font-bold ${hwWalletConnected ? 'bg-green-500/20 text-green-500' : 'bg-gray-800 text-gray-500'}`}>
                          {hwWalletConnected ? 'Connected' : 'Disconnected'}
                       </span>
                    </button>
                 </div>

                 {/* Notifications Section */}
                 <h3 class="text-gray-500 font-bold text-xs uppercase tracking-wider mb-3 pl-1">Notifications</h3>
                 <div class="bg-[#1C1C1E] rounded-2xl overflow-hidden mb-6">
                    <div class="flex items-center justify-between p-4 border-b border-white/5">
                       <div class="flex items-center gap-3">
                          <div class="w-8 h-8 rounded-full bg-gray-800 flex items-center justify-center text-gray-400">
                             <Bell size={18} />
                          </div>
                          <span class="font-medium">Price Alerts</span>
                       </div>
                       <button 
                          onClick={() => setPriceAlertsEnabled(!priceAlertsEnabled)}
                          class={`w-12 h-6 rounded-full transition-colors relative ${priceAlertsEnabled ? 'bg-[#AB9FF2]' : 'bg-gray-700'}`}
                       >
                          <div class={`absolute top-1 w-4 h-4 rounded-full bg-white transition-all ${priceAlertsEnabled ? 'left-7' : 'left-1'}`} />
                       </button>
                    </div>
                    <div class="flex items-center justify-between p-4">
                       <div class="flex items-center gap-3">
                          <div class="w-8 h-8 rounded-full bg-gray-800 flex items-center justify-center text-gray-400">
                             <ShieldCheck size={18} />
                          </div>
                          <span class="font-medium">Transaction Confirmations</span>
                       </div>
                       <button 
                          onClick={() => setTransactionAlertsEnabled(!transactionAlertsEnabled)}
                          class={`w-12 h-6 rounded-full transition-colors relative ${transactionAlertsEnabled ? 'bg-[#AB9FF2]' : 'bg-gray-700'}`}
                       >
                          <div class={`absolute top-1 w-4 h-4 rounded-full bg-white transition-all ${transactionAlertsEnabled ? 'left-7' : 'left-1'}`} />
                       </button>
                    </div>
                 </div>
               </>
             )}

             {settingsView === 'wallets' && (
               <div>
                 <button 
                   onClick={() => setSettingsView('main')}
                   class="flex items-center gap-2 text-gray-400 hover:text-white mb-4"
                 >
                   <ChevronDown class="rotate-90" size={20} />
                   <span>Back to Settings</span>
                 </button>
                 <WalletManager />
               </div>
             )}

             {settingsView === 'addressbook' && (
               <div>
                 <button 
                   onClick={() => setSettingsView('main')}
                   class="flex items-center gap-2 text-gray-400 hover:text-white mb-4"
                 >
                   <ChevronDown class="rotate-90" size={20} />
                   <span>Back to Settings</span>
                 </button>
                 <AddressBook />
               </div>
             )}

             {settingsView === 'scheduler' && (
               <div>
                 <button 
                   onClick={() => setSettingsView('main')}
                   class="flex items-center gap-2 text-gray-400 hover:text-white mb-4"
                 >
                   <ChevronDown class="rotate-90" size={20} />
                   <span>Back to Settings</span>
                 </button>
                 <TransactionScheduler />
               </div>
             )}

             {settingsView === 'gas' && (
               <div>
                 <button 
                   onClick={() => setSettingsView('main')}
                   class="flex items-center gap-2 text-gray-400 hover:text-white mb-4"
                 >
                   <ChevronDown class="rotate-90" size={20} />
                   <span>Back to Settings</span>
                 </button>
                 <GasOptimizer />
               </div>
             )}

             {settingsView === 'history' && (
               <div>
                 <button 
                   onClick={() => setSettingsView('main')}
                   class="flex items-center gap-2 text-gray-400 hover:text-white mb-4"
                 >
                   <ChevronDown class="rotate-90" size={20} />
                   <span>Back to Settings</span>
                 </button>
                 <SwapHistory />
               </div>
             )}
          </div>
        )}

      </main>

      {/* Bottom Navigation - Mobile Only */}
      <nav class="md:hidden fixed bottom-0 left-0 right-0 max-w-md mx-auto bg-[#0C0C0C]/90 backdrop-blur-xl border-t border-white/5 pb-6 pt-2 px-4 flex justify-between items-center z-40">
         <NavButton 
            active={activeTab === Tab.HOME} 
            onClick={() => setActiveTab(Tab.HOME)} 
            icon={Wallet}
            label="Home"
         />
         <NavButton 
            active={activeTab === Tab.SWAP} 
            onClick={() => setActiveTab(Tab.SWAP)} 
            icon={ArrowRightLeft}
            label="Trade"
         />
         <NavButton 
            active={activeTab === Tab.LAUNCH} 
            onClick={() => setActiveTab(Tab.LAUNCH)} 
            icon={Flame}
            label="Launch"
         />
         <NavButton 
            active={activeTab === Tab.MONITOR} 
            onClick={() => setActiveTab(Tab.MONITOR)} 
            icon={Radar}
            label="Track"
         />
         <NavButton 
            active={activeTab === Tab.EXPLORE} 
            onClick={() => setActiveTab(Tab.EXPLORE)} 
            icon={SquareTerminal}
            label="Terminal"
         />
         <NavButton 
            active={activeTab === Tab.SETTINGS} 
            onClick={() => setActiveTab(Tab.SETTINGS)} 
            icon={Settings} 
            label="Settings"
         />
      </nav>


    </div>
  );
}

const NavButton = ({ active, onClick, icon: Icon, label }: { active: boolean, onClick: () => void, icon: React.ComponentType<any>, label: string }) => (
  <button 
    onClick={onClick}
    class={`p-1 rounded-xl transition-all duration-300 active:scale-90 flex flex-col items-center gap-1 w-14 ${active ? 'text-[#AB9FF2]' : 'text-gray-500 hover:text-gray-300'}`}
  >
    <Icon size={24} strokeWidth={active ? 2.5 : 2} />
    <span class="text-[10px] font-medium">{label}</span>
  </button>
);