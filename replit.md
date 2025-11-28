# Phantom Pro Clone - Crypto Wallet App

## Overview
A comprehensive Phantom wallet clone with 9 advanced features across three complexity tiers. Built with React 19, TypeScript, Vite, RainbowKit, Wagmi, and Tailwind CSS.

## Recent Changes (2024-01-28)
- Added 9 new advanced features across three complexity tiers
- Migrated hardcoded API keys to environment variables for security
- Added localStorage persistence for Address Book, Wallet Manager, and Transaction Scheduler
- Integrated all features into the Settings tab with sub-views
- Fixed React 19 compatibility issues with updated dependencies

## Project Architecture

### Tech Stack
- **Frontend**: React 19, TypeScript, Vite
- **Styling**: Tailwind CSS (via CDN)
- **Wallet Integration**: RainbowKit, Wagmi, Viem
- **Charts**: Recharts
- **Icons**: Lucide React

### Directory Structure
```
/
├── App.tsx                    # Main application component
├── index.tsx                  # Entry point with wallet configuration
├── types.ts                   # TypeScript interfaces
├── vite.config.ts             # Vite configuration
├── vite-env.d.ts              # TypeScript env declarations
├── components/
│   ├── AddressBook.tsx        # Address book management
│   ├── ChainSelector.tsx      # Multi-chain support UI
│   ├── SwapHistory.tsx        # Swap history with P/L tracking
│   ├── TokenDiscovery.tsx     # Token research and discovery
│   ├── GasOptimizer.tsx       # Gas price optimization
│   ├── WalletManager.tsx      # Multi-wallet management
│   ├── TransactionScheduler.tsx # DCA and scheduled transactions
│   ├── NotificationCenter.tsx # Push notification center
│   ├── Portfolio.tsx          # Portfolio analytics
│   ├── PriceAlerts.tsx        # Price alert management
│   ├── Watchlist.tsx          # Token watchlist
│   ├── Terminal.tsx           # Terminal interface
│   ├── Track.tsx              # Transaction tracking
│   └── Explore.tsx            # dApp exploration
└── services/
    └── moralis.ts             # Moralis API integration
```

### Features by Complexity Tier

**Beginner (1-2 hours):**
1. Address Book - Save and label frequently used addresses
2. Multi-Chain Support UI - Chain selector (Ethereum, Polygon, Optimism, Arbitrum, Base)
3. Swap History - View past swaps with profit/loss tracking

**Intermediate (3-5 hours):**
4. Token Discovery - Research and find new tokens with filters
5. Gas Optimization - Gas price suggestions and timing recommendations
6. Multi-Wallet Management - Multiple wallet accounts with switching

**Advanced (1-2 days):**
7. Transaction Scheduler - Schedule future transactions and DCA strategies
8. Push Notifications - Notification center for alerts (UI only)
9. Portfolio Analytics - Charts and visualizations with Recharts

## Environment Variables
- `ALCHEMY_API_KEY` - Alchemy API key for blockchain data
- `WALLETCONNECT_PROJECT_ID` - WalletConnect Cloud project ID
- `MORALIS_API_KEY` - Moralis API key for token data

## Running the Project
```bash
npm install --legacy-peer-deps
npm run dev
```

## Development Notes
- Use `--legacy-peer-deps` for npm install due to React 19 peer dependency conflicts
- The app binds to port 5000 for web preview
- localStorage is used for persisting Address Book, Wallets, and Scheduled Transactions
- Environment variables are exposed via Vite's define config
