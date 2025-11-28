

export enum AssetType {
  TOKEN = 'TOKEN',
  NFT = 'NFT'
}

export interface Token {
  id: string;
  symbol: string;
  name: string;
  balance: number;
  price: number;
  change24h: number;
  network: 'SOL' | 'ETH' | 'BTC' | 'POLY';
  image: string;
  marketCap?: number;
  description?: string;
}

export interface NFT {
  id: string;
  name: string;
  collection: string;
  image: string;
  isSpam: boolean;
  estValueSol: number;
}

export interface ToastMessage {
  id: string;
  title: string;
  subtitle?: string;
  type: 'success' | 'error' | 'burn';
  image?: string;
}

export interface TransactionDetails {
  type: 'SWAP' | 'SEND' | 'DAPP';
  fromToken: Token;
  toToken?: Token; // For Swap or DApp
  fromAmount: number;
  toAmount?: number; // For Swap
  recipient?: string; // For Send
  fee: number;
  network: string;
  dAppName?: string;
  dAppIcon?: string;
}

export interface TransactionHistoryItem {
  id: string;
  type: 'SWAP' | 'SEND' | 'RECEIVE' | 'BURN' | 'STAKE' | 'DAPP';
  title: string;
  subtitle: string;
  amount: string;
  date: string;
  status: 'CONFIRMED' | 'FAILED';
  image?: string;
  direction: 'IN' | 'OUT';
}

export interface DApp {
  id: string;
  name: string;
  description: string;
  icon: string;
  users: string;
  category: string;
  url: string;
}

export interface Validator {
  id: string;
  name: string;
  apy: number;
  totalStaked: string;
  image?: string;
  verified: boolean;
}

export interface SocialPost {
  id: string;
  user: string;
  avatar: string;
  action: string;
  target: string;
  time: string;
  type: 'buy' | 'sell' | 'mint' | 'stake';
  amount?: string;
}

export interface TrackedWallet {
  address: string;
  name?: string;
  label?: 'Whale' | 'Smart Money' | 'Dev' | 'Friend';
  netWorth: number;
  topTokens: string[];
  chain: 'SOL' | 'ETH';
  recentActivity?: TransactionHistoryItem[];

export interface WalletTracker {
  id: string;
  userId: string;
  walletAddress: string;
  alias: string;
  emoji: string;
  chains: Chain[];
  tags: string[];
  createdAt: Date;
  lastUpdated: Date;
}

export type Chain = 'ETH' | 'BASE' | 'ARBITRUM' | 'BSC' | 'SOL';

export interface WalletEvent {
  id: string;
  trackerWalletId: string;
  type: 'BUY' | 'SELL' | 'TRANSFER_IN' | 'TRANSFER_OUT' | 'LIQUIDITY_ADD' | 'LIQUIDITY_REMOVE' | 'SWAP';
  tokenAddress: string;
  tokenSymbol: string;
  tokenName?: string;
  amount: string;
  usdValue: number;
  txHash: string;
  blockNumber: number;
  timestamp: Date;
  chain: Chain;
  details?: {
    from?: string;
    to?: string;
    gasUsed?: string;
    gasPrice?: string;
    pricePerUnit?: number;
  };
}

export interface WalletFlow {
  tokenAddress: string;
  tokenSymbol: string;
  inflow: number;
  outflow: number;
  netFlow: number;
  usdValue: number;
}

export interface WalletAlert {
  id: string;
  trackerId: string;
  type: 'LARGE_BUY' | 'LARGE_SELL' | 'INFLOW' | 'OUTFLOW' | 'NEW_PAIR' | 'RUG_PULL';
  threshold?: number;
  enabled: boolean;
  createdAt: Date;
}

export interface AlertNotification {
  id: string;
  alertId: string;
  eventId: string;
  title: string;
  message: string;
  read: boolean;
  createdAt: Date;
}
}

export enum Tab {
  HOME = 'HOME',
  SWAP = 'SWAP',
  MONITOR = 'MONITOR',
  EXPLORE = 'EXPLORE',
  SETTINGS = 'SETTINGS'
}

export interface AddressBookEntry {
  id: string;
  address: string;
  label: string;
  chain: 'ETH' | 'SOL' | 'POLY' | 'ARB' | 'BASE' | 'OP';
  isFavorite: boolean;
  lastUsed?: string;
}

export interface ManagedWallet {
  id: string;
  address: string;
  name: string;
  isActive: boolean;
  balance: number;
  chain: string;
  avatar?: string;
}

export interface SwapHistoryItem {
  id: string;
  date: string;
  fromToken: string;
  toToken: string;
  fromAmount: number;
  toAmount: number;
  fromTokenImage: string;
  toTokenImage: string;
  status: 'completed' | 'pending' | 'failed';
  txHash: string;
  chain: string;
  gasFee: number;
}

export interface ScheduledTransaction {
  id: string;
  type: 'DCA' | 'ONE_TIME';
  fromToken: string;
  toToken: string;
  amount: number;
  frequency?: 'daily' | 'weekly' | 'monthly';
  nextExecution: string;
  isActive: boolean;
  totalExecuted: number;
  createdAt: string;
}

export interface GasPrice {
  chain: string;
  slow: number;
  standard: number;
  fast: number;
  instant: number;
  baseFee: number;
  congestionLevel: 'low' | 'medium' | 'high';
  estimatedTime: {
    slow: string;
    standard: string;
    fast: string;
    instant: string;
  };
}

export interface TrendingToken {
  id: string;
  symbol: string;
  name: string;
  price: number;
  change1h: number;
  change24h: number;
  change7d: number;
  volume24h: number;
  marketCap: number;
  image: string;
  rank: number;
  isNew?: boolean;
}

export interface NotificationItem {
  id: string;
  type: 'price_alert' | 'transaction' | 'security' | 'system';
  title: string;
  message: string;
  timestamp: string;
  isRead: boolean;
  data?: any;
}