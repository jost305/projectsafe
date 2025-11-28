# Wallet Tracker - Quick Setup Guide

## Installation Steps

### 1. Get Moralis API Key
```bash
# Go to https://moralis.io/
# Sign up → Create API Key
# Add to .env:
REACT_APP_MORALIS_API_KEY=your_key_here
```

### 2. Install Dependencies (if needed)
```bash
npm install axios @tanstack/react-query
```

Already installed:
- ✅ React & TypeScript
- ✅ Lucide Icons
- ✅ Tailwind CSS
- ✅ React Context

### 3. Verify Provider Setup
Check `index.tsx` includes:
```tsx
<WalletTrackerProvider>
  <App />
</WalletTrackerProvider>
```

### 4. Run Dev Server
```bash
npm run dev
```

Navigate to **Track** tab → Start tracking wallets!

## File Checklist

✅ `/components/WalletTracker.tsx` - Main UI component
✅ `/components/Track.tsx` - Track page wrapper
✅ `/services/walletTracker.ts` - Moralis integration
✅ `/services/eventEmitter.ts` - Real-time events
✅ `/services/WalletTrackerContext.tsx` - State management
✅ `/types.ts` - Updated with tracker types
✅ `/index.tsx` - Added WalletTrackerProvider
✅ `/WALLET_TRACKER.md` - Full documentation

## Quick Test

1. **Open Track page**
   - You should see "Wallet Tracker" header
   - Empty state with "No Wallets Tracked"

2. **Add Test Wallet**
   - Click "+" button
   - Enter: `0x1234567890abcdef1234567890abcdef12345678`
   - Name: "Test Whale"
   - Emoji: 🐋
   - Click "Start Tracking"

3. **View Real-Time Events**
   - Mock events auto-emit after 5 seconds
   - See them in the wallet card
   - Switch to "Alerts" tab for notifications

## Configuration

### API Keys (.env)
```bash
REACT_APP_MORALIS_API_KEY=your_moralis_api_key
REACT_APP_ALCHEMY_API_KEY=your_alchemy_key  # Optional
```

### Alert Thresholds (walletTracker.ts)
Modify these to customize alerts:
```typescript
const ALERT_THRESHOLDS = {
  LARGE_BUY: 10000,    // Alert for buys > $10k
  LARGE_SELL: 10000,
  INFLOW: 50000,
};
```

### Chains (walletTracker.ts)
Add/remove supported chains:
```typescript
const CHAIN_MAP: Record<Chain, string> = {
  ETH: '0x1',
  BASE: '0x2105',
  ARBITRUM: '0xa4b1',
  BSC: '0x38',
  SOL: 'solana',
};
```

## Features Enabled

### ✅ Implemented
- Add/remove tracked wallets
- Real-time event detection (mocked)
- Buy/Sell tracking
- Inflow/Outflow monitoring
- Alert notifications
- Multi-chain support
- Wallet filtering
- Event feed
- Responsive UI

### 🚀 Ready for Production
1. Connect real Moralis API (walletTracker.ts)
2. Enable WebSocket streaming (eventEmitter.ts)
3. Add persistent database storage
4. Implement import/export wallets
5. Add chart signals integration

## Example: Using the Context

```tsx
import { useWalletTracker } from '../services/WalletTrackerContext';

export function MyComponent() {
  const { 
    trackers,
    events,
    addTracker,
    fetchTrackerData,
    startMonitoring
  } = useWalletTracker();

  const handleAddWallet = async (address: string) => {
    const newTracker = {
      id: Date.now().toString(),
      walletAddress: address,
      // ... other fields
    };
    
    addTracker(newTracker);
    await fetchTrackerData(newTracker.id, 'ETH');
    startMonitoring(newTracker.id);
  };

  return (
    <div>
      {trackers.map(t => (
        <div key={t.id}>{t.alias}</div>
      ))}
    </div>
  );
}
```

## Troubleshooting

| Issue | Solution |
|-------|----------|
| "No data found" on wallets | API key not set, check .env |
| Alerts not showing | Check alert threshold, may be too high |
| Slow loading | Reduce number of trackers, check internet |
| TypeScript errors | Run `npm run build` to check |

## Next Steps

1. ✅ Test with mock data (works now)
2. Add Moralis API key to .env
3. Test with real wallet addresses
4. Customize alert thresholds
5. Deploy to production
6. Monitor WebSocket connections
7. Add database persistence
8. Scale to 300+ wallets

## Support

- Check `/WALLET_TRACKER.md` for full docs
- Review component comments for implementation details
- Test with mock data first
- Monitor browser console for errors

**You're all set! 🚀**
