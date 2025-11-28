

import { Token, NFT, DApp, Validator, SocialPost, TransactionHistoryItem } from './types';

export const COLORS = {
  primary: '#AB9FF2',
  bg: '#0C0C0C',
  card: '#1C1C1E',
  green: '#22c55e',
  red: '#ef4444',
  textSecondary: '#9ca3af',
};

export const INITIAL_TOKENS: Token[] = [
  {
    id: 'solana',
    symbol: 'SOL',
    name: 'Solana',
    balance: 145.2,
    price: 142.50,
    change24h: 5.4,
    network: 'SOL',
    image: 'https://cryptologos.cc/logos/solana-sol-logo.png?v=029',
    marketCap: 65000000000,
    description: "Solana is a decentralized blockchain built to enable scalable, user-friendly apps for the world."
  },
  {
    id: 'ethereum',
    symbol: 'ETH',
    name: 'Ethereum',
    balance: 1.05,
    price: 2650.00,
    change24h: -1.2,
    network: 'ETH',
    image: 'https://cryptologos.cc/logos/ethereum-eth-logo.png?v=029',
    marketCap: 320000000000,
    description: "Ethereum is a decentralized open-source blockchain system that features its own cryptocurrency, Ether."
  },
  {
    id: 'bitcoin',
    symbol: 'BTC',
    name: 'Bitcoin',
    balance: 0.045,
    price: 64200.00,
    change24h: 0.8,
    network: 'BTC',
    image: 'https://cryptologos.cc/logos/bitcoin-btc-logo.png?v=029',
    marketCap: 1200000000000,
    description: "Bitcoin is a decentralized cryptocurrency originally described in a 2008 whitepaper by a person, or group of people, using the alias Satoshi Nakamoto."
  },
  {
    id: 'bonk',
    symbol: 'BONK',
    name: 'Bonk',
    balance: 4500000,
    price: 0.000024,
    change24h: 15.2,
    network: 'SOL',
    image: 'https://cryptologos.cc/logos/bonk1-bonk-logo.png?v=029',
    marketCap: 1500000000,
    description: "BONK is the first Solana dog coin for the people, by the people with 50% of the total supply airdropped to the Solana community."
  },
  {
    id: 'usdc',
    symbol: 'USDC',
    name: 'USD Coin',
    balance: 2400.50,
    price: 1.00,
    change24h: 0.01,
    network: 'SOL',
    image: 'https://cryptologos.cc/logos/usd-coin-usdc-logo.png?v=029',
    marketCap: 34000000000,
    description: "USDC is a fully collateralized US dollar stablecoin. USDC is the bridge between dollars and trading on crypto exchanges."
  }
];

export const MARKET_TOKENS: Token[] = [
  ...INITIAL_TOKENS,
  {
    id: 'wif',
    symbol: 'WIF',
    name: 'dogwifhat',
    balance: 0,
    price: 2.45,
    change24h: -2.1,
    network: 'SOL',
    image: 'https://dd.dexscreener.com/ds-data/tokens/solana/EKpQGSJtjMFqKZ9KQanSqYXRcF8fBopzLHYxdM65zcjm.png?size=lg&key=2f2546',
    marketCap: 2400000000
  },
  {
    id: 'popcat',
    symbol: 'POPCAT',
    name: 'Popcat',
    balance: 0,
    price: 0.45,
    change24h: 12.5,
    network: 'SOL',
    image: 'https://dd.dexscreener.com/ds-data/tokens/solana/7GCihgDB8fe6KNjn2MYtkzZcRjQy3t9GHdC8uHYmW2hr.png?size=lg&key=01625f',
    marketCap: 450000000
  },
  {
    id: 'jup',
    symbol: 'JUP',
    name: 'Jupiter',
    balance: 0,
    price: 1.12,
    change24h: 5.1,
    network: 'SOL',
    image: 'https://static.jup.ag/jup/icon.png',
    marketCap: 1200000000
  },
  {
    id: 'pepe',
    symbol: 'PEPE',
    name: 'Pepe',
    balance: 0,
    price: 0.000008,
    change24h: -4.5,
    network: 'ETH',
    image: 'https://cryptologos.cc/logos/pepe-pepe-logo.png?v=029',
    marketCap: 3000000000
  },
  {
    id: 'render',
    symbol: 'RNDR',
    name: 'Render',
    balance: 0,
    price: 7.80,
    change24h: 1.2,
    network: 'SOL',
    image: 'https://cryptologos.cc/logos/render-token-rndr-logo.png?v=029',
    marketCap: 4000000000
  }
];

export const INITIAL_NFTS: NFT[] = [
  {
    id: 'madlad-420',
    name: 'Mad Lad #8420',
    collection: 'Mad Lads',
    image: 'https://picsum.photos/400/400?random=1',
    isSpam: false,
    estValueSol: 185
  },
  {
    id: 'famous-fox-2',
    name: 'Famous Fox #221',
    collection: 'Famous Fox Federation',
    image: 'https://picsum.photos/400/400?random=2',
    isSpam: false,
    estValueSol: 32
  },
  {
    id: 'spam-drop-1',
    name: 'FREE SOL DROP',
    collection: 'Scam Collection',
    image: 'https://picsum.photos/400/400?random=3',
    isSpam: true,
    estValueSol: 0
  }
];

export const CHART_DATA = [
  { time: '10:00', price: 138.5 },
  { time: '11:00', price: 139.2 },
  { time: '12:00', price: 138.8 },
  { time: '13:00', price: 140.5 },
  { time: '14:00', price: 141.2 },
  { time: '15:00', price: 142.0 },
  { time: '16:00', price: 141.5 },
  { time: '17:00', price: 142.5 },
];

export const TRENDING_APPS: DApp[] = [
  {
    id: 'jupiter',
    name: 'Jupiter',
    description: 'The best swap aggregator on Solana',
    icon: 'https://static.jup.ag/jup/icon.png',
    users: '250k+',
    category: 'DeFi',
    url: 'https://jup.ag'
  },
  {
    id: 'magiceden',
    name: 'Magic Eden',
    description: 'The leading NFT Marketplace',
    icon: 'https://play-lh.googleusercontent.com/lM_cKkHjA-k-XpS8Z9Fz4M4XzK4Z5Z5Z5Z5Z5Z5Z5Z5Z5Z5Z5Z5Z5Z5Z5Z5Z5Z5Z=w240-h480-rw',
    users: '180k+',
    category: 'NFTs',
    url: 'https://magiceden.io'
  },
  {
    id: 'drip',
    name: 'DRiP',
    description: 'Free NFT drops every week',
    icon: 'https://pbs.twimg.com/profile_images/1630739942474768385/1X2X3X4X_400x400.jpg',
    users: '500k+',
    category: 'Collectibles',
    url: 'https://drip.haus'
  },
  {
    id: 'tensor',
    name: 'Tensor',
    description: 'Pro NFT Trading',
    icon: 'https://pbs.twimg.com/profile_images/1628135899932082177/X3X4X5X6_400x400.jpg',
    users: '90k+',
    category: 'NFTs',
    url: 'https://tensor.trade'
  }
];

export const VALIDATORS: Validator[] = [
  {
    id: 'phantom',
    name: 'Phantom',
    apy: 7.45,
    totalStaked: '4.2M SOL',
    verified: true,
    image: 'https://pbs.twimg.com/profile_images/1458212456488771587/w8FpQ2gX_400x400.jpg'
  },
  {
    id: 'cogent',
    name: 'Cogent Crypto',
    apy: 7.82,
    totalStaked: '2.1M SOL',
    verified: true
  },
  {
    id: 'shinobi',
    name: 'Shinobi Systems',
    apy: 7.76,
    totalStaked: '1.8M SOL',
    verified: true
  },
  {
    id: 'coinbase',
    name: 'Coinbase Cloud',
    apy: 6.95,
    totalStaked: '8.5M SOL',
    verified: true
  }
];

export const SOCIAL_FEED: SocialPost[] = [
  {
    id: '1',
    user: 'toly.sol',
    avatar: 'https://picsum.photos/seed/toly/200',
    action: 'bought',
    target: 'WIF',
    amount: '$5,000',
    type: 'buy',
    time: '2m ago'
  },
  {
    id: '2',
    user: 'mert.sol',
    avatar: 'https://picsum.photos/seed/mert/200',
    action: 'staked',
    target: 'SOL',
    amount: '500 SOL',
    type: 'stake',
    time: '15m ago'
  },
  {
    id: '3',
    user: 'raj.sol',
    avatar: 'https://picsum.photos/seed/raj/200',
    action: 'minted',
    target: 'Mad Lads',
    type: 'mint',
    time: '1h ago'
  }
];

export const MOCK_HISTORY: TransactionHistoryItem[] = [
  {
    id: 'tx-1',
    type: 'SWAP',
    title: 'Swapped SOL to USDC',
    subtitle: 'Jupiter Aggregator',
    amount: '-10 SOL',
    date: 'Today, 10:23 AM',
    status: 'CONFIRMED',
    image: 'https://static.jup.ag/jup/icon.png',
    direction: 'OUT'
  },
  {
    id: 'tx-2',
    type: 'RECEIVE',
    title: 'Received SOL',
    subtitle: 'From 8x7...2v3d',
    amount: '+5.2 SOL',
    date: 'Yesterday',
    status: 'CONFIRMED',
    direction: 'IN'
  },
  {
    id: 'tx-3',
    type: 'BURN',
    title: 'Burned Spam NFT',
    subtitle: 'Scam Collection',
    amount: '+0.002 SOL',
    date: '2 days ago',
    status: 'CONFIRMED',
    direction: 'IN'
  },
  {
    id: 'tx-4',
    type: 'STAKE',
    title: 'Staked SOL',
    subtitle: 'Phantom Validator',
    amount: '-50 SOL',
    date: 'Oct 24',
    status: 'CONFIRMED',
    direction: 'OUT'
  }
];