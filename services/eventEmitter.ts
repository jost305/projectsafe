import { WalletEvent, AlertNotification } from '../types';
import { Interface, BigNumber } from 'ethers';
import { getTokenUsdValue, fetchNativePriceUSD } from './price';

type WsMap = {
  [key: string]: WebSocket | null;
};

export class WalletEventEmitter {
  private static instance: WalletEventEmitter;
  private listeners: Map<string, Set<(event: WalletEvent) => void>> = new Map();
  private alertListeners: Set<(alert: AlertNotification) => void> = new Set();
  private wsMap: WsMap = {};

  // Common router addresses to watch (lowercased)
  private static ROUTERS = [
    '0x7a250d5630b4cf539739df2c5dacb4c659f2488d', // Uniswap V2
    '0xe592427a0aece92de3edee1f18e0157c05861564', // Uniswap V3
    '0x68b3465833fb72b5a828cceeb955e0b7c1d8525b', // Uniswap V3 Router 2
    '0x1111111254fb6c44bac0bed2854e76f90643097d', // 1inch
    // PancakeSwap (BSC)
    '0x10ed43c718714eb63d5aa57b78b54704e256024e',
    // SushiSwap
    '0xd9e1ce17f2641f24ae83637ab66a2cca9c378b9f',
    // QuickSwap (Polygon)
    '0xa5e0829cd8bf45b6efdc8c6d8c8f0f6f9b6c3b3b',
    // TraderJoe (Avalanche)
    '0x60aE616a2155Ee3d9A68541Ba4544862310933d4',
    // Pancake Router v1 (legacy)
    '0x05fF2B0DB69458A0750badebc4f9e13aDd608C7F'.toLowerCase(),
  ];

  private constructor() {}

  static getInstance(): WalletEventEmitter {
    if (!WalletEventEmitter.instance) {
      WalletEventEmitter.instance = new WalletEventEmitter();
    }
    return WalletEventEmitter.instance;
  }

  /**
   * Subscribe to events for a specific tracker wallet
   */
  onWalletEvent(trackerId: string, callback: (event: WalletEvent) => void) {
    if (!this.listeners.has(trackerId)) {
      this.listeners.set(trackerId, new Set());
    }
    this.listeners.get(trackerId)!.add(callback);

    // Return unsubscribe function
    return () => {
      this.listeners.get(trackerId)?.delete(callback);
    };
  }

  /**
   * Subscribe to alert notifications
   */
  onAlert(callback: (alert: AlertNotification) => void) {
    this.alertListeners.add(callback);

    // Return unsubscribe function
    return () => {
      this.alertListeners.delete(callback);
    };
  }

  /**
   * Emit a wallet event to all subscribers
   */
  emitWalletEvent(trackerId: string, event: WalletEvent) {
    const callbacks = this.listeners.get(trackerId);
    if (callbacks) {
      callbacks.forEach(callback => callback(event));
    }
  }

  /**
   * Emit an alert notification
   */
  emitAlert(alert: AlertNotification) {
    this.alertListeners.forEach(callback => callback(alert));
  }

  /**
   * Simulate real-time events (mock for demo)
   */
  startMockEventStream(trackerId: string) {
    const mockEvents: WalletEvent[] = [
      {
        id: `mock-${Date.now()}-1`,
        trackerWalletId: trackerId,
        type: 'BUY',
        tokenAddress: '0x1234567890abcdef',
        tokenSymbol: 'MEME',
        tokenName: 'Memecoin',
        amount: '1000000',
        usdValue: 5000,
        txHash: '0xmock1234',
        blockNumber: 18500000,
        timestamp: new Date(),
        chain: 'ETH',
      },
      {
        id: `mock-${Date.now()}-2`,
        trackerWalletId: trackerId,
        type: 'TRANSFER_OUT',
        tokenAddress: '0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2',
        tokenSymbol: 'WETH',
        tokenName: 'Wrapped Ethereum',
        amount: '10',
        usdValue: 30000,
        txHash: '0xmock5678',
        blockNumber: 18499999,
        timestamp: new Date(Date.now() + 5000),
        chain: 'ETH',
      },
    ];

    // Emit mock events
    mockEvents.forEach((event, index) => {
      setTimeout(() => {
        this.emitWalletEvent(trackerId, event);

        // Emit alert if large transaction
        if (event.usdValue > 10000) {
          this.emitAlert({
            id: `alert-${Date.now()}`,
            alertId: trackerId,
            eventId: event.id,
            title: `Large ${event.type} Detected`,
            message: `${event.tokenSymbol}: ${event.usdValue.toLocaleString('en-US', { style: 'currency', currency: 'USD' })}`,
            read: false,
            createdAt: new Date(),
          });
        }
      }, index * 3000);
    });
  }

  /**
   * Connect to Alchemy WebSocket for real-time pending transactions to known routers
   * and decode swap function calls for tracked wallets.
   *
   * This implementation subscribes to Alchemy's `alchemy_pendingTransactions` filter
   * and checks whether the `from` matches the tracked wallet address.
   */
  connectWebSocket(trackerId: string, trackedWalletAddress: string, chain: string) {
    const ALCHEMY_KEY =
      (typeof (import.meta as any) !== 'undefined' && (import.meta as any).env?.VITE_ALCHEMY_API_KEY) ||
      process.env.ALCHEMY_API_KEY ||
      (window as any).__ALCHEMY_KEY__ ||
      '';
    if (!ALCHEMY_KEY) {
      console.warn('Alchemy API key not provided; real-time WS will not connect.');
      return;
    }

    const chainToWs: Record<string, string> = {
      ETH: `wss://eth-mainnet.g.alchemy.com/v2/${ALCHEMY_KEY}`,
      ARBITRUM: `wss://arb-mainnet.g.alchemy.com/v2/${ALCHEMY_KEY}`,
      BASE: `wss://base-mainnet.g.alchemy.com/v2/${ALCHEMY_KEY}`,
    };

    const wsUrl = chainToWs[chain.toUpperCase()];
    if (!wsUrl) {
      console.warn(`No Alchemy WS endpoint configured for chain ${chain}.`);
      return;
    }

    const key = `${trackerId}@${trackedWalletAddress.toLowerCase()}@${chain}`;
    if (this.wsMap[key]) return; // already connected for this tracker

    try {
      const ws = new WebSocket(wsUrl as string);
      this.wsMap[key] = ws;

      ws.onopen = () => {
        // Subscribe to pending txs to known routers
        const routers = WalletEventEmitter.ROUTERS;
        const msg = {
          jsonrpc: '2.0',
          id: 1,
          method: 'alchemy_pendingTransactions',
          params: [
            {
              toAddress: routers,
              hashesOnly: false,
            },
          ],
        };
        ws.send(JSON.stringify(msg));
        console.log(`Alchemy WS connected for ${trackedWalletAddress} on ${chain}`);
      };

      ws.onmessage = async (message) => {
        try {
          const data = JSON.parse(message.data as string);
          // Alchemy publishes pending transactions under params.result
          const tx = data?.params?.result;
          if (!tx) return;

          // Standardize addresses
          const from = (tx.from || '').toLowerCase();
          if (from !== trackedWalletAddress.toLowerCase()) return;

          const input = tx.input || tx.data || '';
          const value = tx.value || '0x0';

          // Decode function using ethers Interface for common router ABIs
          const abi = [
            // UniswapV2-style
            'function swapExactTokensForTokens(uint256,uint256,address[],address,uint256)',
            'function swapExactETHForTokens(uint256,address[],address,uint256)',
            'function swapExactTokensForETH(uint256,uint256,address[],address,uint256)',
            'function swapTokensForExactTokens(uint256,uint256,address[],address,uint256)',
            // Support fee-on-transfer tokens
            'function swapExactTokensForTokensSupportingFeeOnTransferTokens(uint256,uint256,address[],address,uint256)',
            'function swapExactETHForTokensSupportingFeeOnTransferTokens(uint256,address[],address,uint256)',
            // UniswapV3-style
            'function exactInputSingle((address,address,uint24,address,uint256,uint256,uint256,uint160))',
            'function exactInput(bytes)',
            'function exactOutput(bytes)',
            // 1inch generic swap (approx)
            'function swap(address,address,uint256,bytes)',
          ];

          const iface = new Interface(abi);
          let parsed: any = null;
          try {
            parsed = iface.parseTransaction({ data: input });
          } catch (e) {
            // not a known router fn
            return;
          }

          if (!parsed) return;

          // Determine tokens involved (best-effort)
          let tokenSymbol = parsed.name || 'SWAP';
          let tokenAddress = '';
          let amount = '0';

          // For V2 style, path param indicates tokens
          if (parsed.args && parsed.args.length) {
            for (const arg of Object.values(parsed.args)) {
              if (Array.isArray(arg) && arg.length > 0 && typeof arg[0] === 'string' && arg[0].startsWith('0x')) {
                tokenAddress = arg[arg.length - 1]; // last token in path
                break;
              }
            }
          }

          const event: WalletEvent = {
            id: tx.hash || `tx-${Date.now()}`,
            trackerWalletId: trackerId,
            type: 'SWAP',
            tokenAddress: tokenAddress || '',
            tokenSymbol: tokenSymbol,
            tokenName: parsed.name || 'swap',
            amount: amount,
            usdValue: 0, // will be updated below by price lookup
            txHash: tx.hash,
            blockNumber: tx.blockNumber || 0,
            timestamp: new Date(),
            chain: chain as any,
            details: {
              from: tx.from,
              to: tx.to,
              gasUsed: tx.gas,
              gasPrice: tx.gasPrice,
            },
          };

          // Attempt to extract an amount value from parsed args (best-effort)
          try {
            let foundAmount: string | undefined;
            for (const arg of Object.values(parsed.args)) {
              // ethers BigNumber
              if (arg && typeof (arg as any).toString === 'function' && (arg as any)._hex) {
                const bn = arg as unknown as BigNumber;
                const s = bn.toString();
                if (s !== '0') {
                  foundAmount = s;
                  break;
                }
              }
              // hex string
              if (typeof arg === 'string' && arg.startsWith('0x')) {
                try {
                  const s = BigInt(arg).toString();
                  if (s !== '0') {
                    foundAmount = s;
                    break;
                  }
                } catch (e) {}
              }
            }

            if (foundAmount) {
              event.amount = foundAmount;
              // Compute USD value using CoinGecko (assume 18 decimals if unknown)
              if (event.tokenAddress) {
                const priceRes = await getTokenUsdValue(chain, event.tokenAddress, foundAmount, undefined);
                event.usdValue = priceRes.usdValue;
                // normalize amount for display
                event.amount = String(priceRes.amountNormalized);
              }
            } else {
              // Fallback: if the tx carries native value (ETH), compute usdValue from that
              const rawValue = tx.value || tx.transactionValue || '0x0';
              if (rawValue && rawValue !== '0x0') {
                try {
                  const wei = BigInt(rawValue);
                  const ethAmount = Number(wei) / 1e18;
                  const nativePrice = await fetchNativePriceUSD(chain);
                  event.usdValue = nativePrice * ethAmount;
                  event.amount = String(ethAmount);
                } catch (e) {}
              }
            }
          } catch (e) {
            // ignore price lookup errors
          }

          // Emit event to listeners for this tracked tracker id
          this.emitWalletEvent(trackerId, event);

          // Optionally emit alert for large gas/value
          const approxValue = parseInt(value, 16) || 0;
          if (approxValue > 0 && approxValue > 1e18) {
            this.emitAlert({
              id: `alert-${Date.now()}`,
              alertId: trackerId,
              eventId: event.id,
              title: `Swap by ${trackedWalletAddress}`,
              message: `${tokenSymbol} swap tx ${event.txHash}`,
              read: false,
              createdAt: new Date(),
            });
          }
        } catch (err) {
          // ignore parse errors
        }
      };

      ws.onclose = () => {
        console.log(`Alchemy WS closed for ${trackedWalletAddress} on ${chain}`);
        this.wsMap[key] = null;
      };

      ws.onerror = (err) => {
        console.error('Alchemy WS error', err);
        ws.close();
      };
    } catch (error) {
      console.error('Failed to connect Alchemy WS', error);
    }
  }
}

export default WalletEventEmitter;
