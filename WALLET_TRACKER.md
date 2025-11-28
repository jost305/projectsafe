# Wallet Tracker Feature - Implementation Guide

## Overview

The Wallet Tracker is a comprehensive system for monitoring multiple blockchain wallets across EVM chains (Ethereum, Base, Arbitrum, BSC) and Solana. This feature allows degen traders to track smart money wallets, whales, and influencers in real-time.

**Inspired by**: BullX Neo, Axiom Pulse, DeBank, Nansen

## Architecture

### System Components

```
┌─────────────────────────────────────────────────────────────┐
│                    React Frontend (UI)                      │
│              WalletTrackerUI Component                      │
└──────────────────────┬──────────────────────────────────────┘
                       │
┌──────────────────────▼──────────────────────────────────────┐
│              WalletTrackerContext (State)                   │
│         Manages trackers, events, flows, alerts             │
└──────────────────────┬──────────────────────────────────────┘
                       │
        ┌──────────────┴──────────────┐
        │                             │
┌───────▼────────────┐    ┌──────────▼──────────────┐
│ walletTracker.ts   │    │  eventEmitter.ts       │
│  (Moralis API)     │    │  (Real-time events)    │
└────────────────────┘    └────────────────────────┘
        │                             │
        └──────────────┬──────────────┘
                       │
        ┌──────────────▼──────────────┐
        │   Blockchain RPC/API        │
        │  (Moralis, Alchemy, etc.)   │
        └────────────────────────────┘
```

## File Structure

```
/workspaces/projectsafe/
├── components/
│   ├── Track.tsx                 # Main Track page (uses WalletTrackerUI)
│   └── WalletTracker.tsx         # WalletTrackerUI component
├── services/
│   ├── walletTracker.ts          # Moralis API integration
│   ├── eventEmitter.ts           # Real-time event system
│   └── WalletTrackerContext.tsx  # React Context for state management
├── types.ts                       # TypeScript interfaces
└── index.tsx                      # (Updated with WalletTrackerProvider)
```

## Features

### 1. **Wallet Tracking** 📊
- Add multiple wallets (up to 300)
- Custom naming with emoji tags
- Multi-chain support (ETH, BASE, ARBITRUM, BSC, SOL)
- Persistent storage

**Implementation**:
```tsx
// Add wallet
const newTracker: WalletTracker = {
  id: `tracker-${Date.now()}`,
  userId: 'user1',
  walletAddress: '0x...',
  alias: 'Whale Alpha',
  emoji: '🐋',
  chains: ['ETH', 'BASE', 'ARBITRUM', 'BSC'],
  tags: [],
  createdAt: new Date(),
  lastUpdated: new Date(),
};
addTracker(newTracker);
```

### 2. **Real-Time Event Detection** ⚡
- Buy signals (token inflows)
- Sell signals (token outflows)
- Swap detection (Uniswap, 1inch, etc.)
- Transfer tracking
- Liquidity events

**Event Types**:
```typescript
type WalletEventType = 
  | 'BUY'              // Token acquisition
  | 'SELL'             // Token disposal
  | 'TRANSFER_IN'      // Wallet receives tokens
  | 'TRANSFER_OUT'     // Wallet sends tokens
  | 'LIQUIDITY_ADD'    // Adds to LP
  | 'LIQUIDITY_REMOVE' // Removes from LP
  | 'SWAP';            // Token swap
```

### 3. **Inflow/Outflow Tracking** 💰
- Real-time portfolio value calculation
- Token flow monitoring
- Net flow detection (inflow - outflow)
- USD valuation

### 4. **Alerts & Notifications** 🔔
- Large buy detection (> $10k threshold)
- Large sell alerts
- New pair detection
- Rug pull detection (optional)
- Customizable alert thresholds

### 5. **Multi-Tab Interface** 📑
- **Following Tab**: List of tracked wallets with recent activity
- **Inflow Tab**: Real-time money flow analysis
- **Alerts Tab**: Notification feed

## Data Sources

### Moralis API (Recommended)

**Why Moralis?**
- Free tier available
- Real-time events via WebSocket
- EVM + Solana support
- Transaction history
- Token metadata

**Setup**:
```bash
# Add to .env
REACT_APP_MORALIS_API_KEY=your_moralis_key
```

**Key APIs**:
- `getAssetTransfers()` - Wallet transactions
- `erc20/transfers` - Token transfers
- Monitor wallet activity via WebSocket

### Alternative Data Sources

| Provider | Pros | Cons | Cost |
|----------|------|------|------|
| **Moralis** | Real-time, free tier, multi-chain | Rate limits | Free-$999 |
| **Alchemy** | High reliability, WebSocket | More expensive | $0.25-$1/k requests |
| **QuickNode** | Fast, good support | Limited free tier | $99/month |
| **Covalent** | Good free tier, simple API | Slower than others | Free-$500 |

## API Integration

### Fetch Wallet Transactions
```typescript
const events = await getWalletTransactions('0x123...', 'ETH');
// Returns: WalletEvent[]
```

### Detect Buys
```typescript
const buyEvents = await detectBuys('0x123...', 'BASE');
// Filters for token inflows only
```

### Detect Sells
```typescript
const sellEvents = await detectSells('0x123...', 'ARBITRUM');
// Filters for token outflows only
```

### Get Portfolio
```typescript
const { totalValue, flows } = await getWalletPortfolio('0x123...', 'ETH');
// Returns USD value + token flows
```

## State Management

### WalletTrackerContext
Manages all wallet tracking state:

```typescript
interface WalletTrackerContextType {
  // State
  trackers: WalletTracker[];
  events: WalletEvent[];
  flows: WalletFlow[];
  alerts: AlertNotification[];

  // Operations
  addTracker(tracker: WalletTracker): void;
  removeTracker(trackerId: string): void;
  addEvent(event: WalletEvent): void;
  addAlert(alert: AlertNotification): void;

  // Async Operations
  fetchTrackerData(trackerId: string, chain: Chain): Promise<void>;
  fetchAllTrackerData(): Promise<void>;
}
```

### Using the Context
```tsx
const { trackers, events, addTracker, fetchTrackerData } = useWalletTracker();
```

## Real-Time Events

### Event Emitter System
```typescript
const emitter = WalletEventEmitter.getInstance();

// Subscribe to wallet events
const unsubscribe = emitter.onWalletEvent('tracker-1', (event) => {
  console.log('New event:', event);
});

// Emit event
emitter.emitWalletEvent('tracker-1', walletEvent);

// Subscribe to alerts
const alertUnsub = emitter.onAlert((alert) => {
  console.log('New alert:', alert);
});
```

### WebSocket Integration (Production)
```typescript
// Connect to Moralis WebSocket
const ws = new WebSocket('wss://api.moralis.io/ws/v2/...');

ws.on('message', (data) => {
  const event = parseAlchemyEvent(data);
  emitter.emitWalletEvent(trackerId, event);
});
```

## UI Components

### WalletTrackerUI
Main component for the Track page.

**Features**:
- Wallet grid with cards
- Tabs (Following, Inflow, Alerts)
- Chain filter
- Add wallet modal
- Real-time updates

**Props**:
```typescript
interface WalletTrackerUIProps {
  onClose?: () => void;
}
```

### Wallet Card
Displays wallet summary:
- Emoji + Name
- Address (truncated)
- Portfolio Value
- Chains
- Recent Activity (last 2 events)

### Event Feed
Shows real-time transactions:
- Buy/Sell indicators
- Token symbol
- USD value
- Timestamp

## Configuration

### Environment Variables
```bash
# .env file
REACT_APP_MORALIS_API_KEY=your_key_here
REACT_APP_ALCHEMY_API_KEY=your_key_here
REACT_APP_QUICKNODE_URL=your_url_here
```

### Alert Thresholds
```typescript
const ALERT_THRESHOLDS = {
  LARGE_BUY: 10000,      // $10k
  LARGE_SELL: 10000,
  INFLOW: 50000,         // $50k
};
```

### Chain Configuration
```typescript
const CHAIN_MAP: Record<Chain, string> = {
  ETH: '0x1',
  BASE: '0x2105',
  ARBITRUM: '0xa4b1',
  BSC: '0x38',
  SOL: 'solana',
};
```

## Usage Guide

### For Degen Traders

1. **Add a Smart Money Wallet**
   - Click "+" button
   - Enter wallet address (0x... or ENS)
   - Give it a custom name (e.g., "Whale Alpha")
   - Select emoji tag
   - System auto-enables all chains

2. **Monitor in Real-Time**
   - View "Following" tab for wallet cards
   - See recent activity
   - Click card for detailed view (coming soon)

3. **Track Inflows/Outflows**
   - Switch to "Inflow" tab
   - See all token movements
   - Filter by chain

4. **Get Alerts**
   - Switch to "Alerts" tab
   - View large buy/sell notifications
   - Get alerted for smart money moves

### Smart Use Cases

**Example 1: Copy Trading**
```
1. Add influential trader's wallet
2. Get alerts when they buy new tokens
3. Front-run or mirror their trades
```

**Example 2: Token Discovery**
```
1. Monitor whale wallets
2. Track new token purchases
3. Identify emerging trends early
```

**Example 3: Exit Signals**
```
1. Track your portfolio holders
2. Get alerts when major holders sell
3. Exit before dumps
```

## Performance Optimization

### Limits & Quotas
- Max 300 wallets per user
- Events cached in memory (limit: 10k)
- API rate limits: 100 req/min (Moralis free tier)
- WebSocket events: Real-time, unlimited

### Caching Strategy
```typescript
// Events cached for 5 minutes
const CACHE_DURATION = 5 * 60 * 1000;

// Clear old events
events = events.filter(e => 
  Date.now() - e.timestamp.getTime() < CACHE_DURATION
);
```

### Batch Operations
```typescript
// Fetch all trackers' data efficiently
for (const tracker of trackers) {
  for (const chain of tracker.chains) {
    await fetchTrackerData(tracker.id, chain);
  }
}
```

## Future Enhancements

- [ ] **Wallet Detail View** - Tap wallet card → see full portfolio
- [ ] **Chart Signals** - Plot buy/sell markers on price charts
- [ ] **Import/Export** - CSV/JSON wallet lists
- [ ] **Smart Alerts** - ML-based anomaly detection
- [ ] **PnL Tracking** - Calculate wallet profit/loss
- [ ] **Twitter Integration** - Track tweets from monitored wallets
- [ ] **Linkage Detection** - Find related wallets
- [ ] **Risk Scoring** - Rate wallet reliability
- [ ] **Multi-wallet Groups** - Tag and organize wallets
- [ ] **Export Signals** - Send to Telegram, Discord

## Testing

### Mock Data
The component includes mock wallets, events, and flows for testing:

```typescript
const MOCK_TRACKERS: WalletTracker[] = [
  {
    id: '1',
    alias: 'Whale Alpha',
    emoji: '🐋',
    chains: ['ETH', 'BASE'],
    // ...
  }
];
```

### Starting Mock Event Stream
```typescript
emitter.startMockEventStream(trackerId);
// Emits mock BUY + TRANSFER events every 3 seconds
```

## Troubleshooting

### Issue: No events appearing
**Solution**: 
- Check Moralis API key is set
- Verify wallet address format (0x...)
- Check console for API errors
- Try manual refresh: `fetchTrackerData()`

### Issue: Slow performance
**Solution**:
- Reduce number of tracked wallets
- Clear old events: `clearEvents()`
- Increase cache duration
- Use polling instead of WebSocket

### Issue: Missing chains
**Solution**:
- Ensure RPC endpoints configured
- Check chain IDs in CHAIN_MAP
- Verify Moralis supports chain

## Support & Resources

- **Moralis Docs**: https://moralis.io/docs/
- **BullX Neo**: https://neo.bullx.io/
- **Axiom Pulse**: https://axiom.trade/
- **GitHub**: This repository

## License

Part of ProjectSafe - MIT License
