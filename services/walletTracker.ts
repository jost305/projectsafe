import axios from 'axios';
import { WalletEvent, Chain, WalletFlow } from '../types';

const MORALIS_API_KEY = process.env.REACT_APP_MORALIS_API_KEY || '';
const MORALIS_BASE_URL = 'https://api.moralis.io/api/v2';

// Chain mapping for Moralis
const CHAIN_MAP: Record<Chain, string> = {
  ETH: '0x1',
  BASE: '0x2105',
  ARBITRUM: '0xa4b1',
  BSC: '0x38',
  SOL: 'solana',
};

/**
 * Get wallet transactions and swap history
 */
export const getWalletTransactions = async (
  walletAddress: string,
  chain: Chain
): Promise<WalletEvent[]> => {
  try {
    // For EVM chains
    if (chain !== 'SOL') {
      const chainId = CHAIN_MAP[chain];
      const response = await axios.get(
        `${MORALIS_BASE_URL}/${walletAddress}`,
        {
          params: {
            chain: chainId,
          },
          headers: {
            'X-API-Key': MORALIS_API_KEY,
          },
        }
      );

      const events: WalletEvent[] = [];
      // Parse transaction data from response
      if (response.data.result) {
        response.data.result.forEach((tx: any) => {
          events.push({
            id: tx.hash,
            trackerWalletId: '',
            type: determineTransactionType(tx),
            tokenAddress: tx.to_address || '',
            tokenSymbol: tx.token_symbol || 'UNKNOWN',
            tokenName: tx.token_name,
            amount: tx.value || '0',
            usdValue: parseFloat(tx.value_decimal || '0') * parseFloat(tx.token_price || '0'),
            txHash: tx.hash,
            blockNumber: tx.block_number,
            timestamp: new Date(tx.block_timestamp),
            chain,
          });
        });
      }
      return events;
    }

    // For Solana
    const solResponse = await axios.get(
      `${MORALIS_BASE_URL}/sol/${walletAddress}/tokens`,
      {
        headers: {
          'X-API-Key': MORALIS_API_KEY,
        },
      }
    );

    // Parse Solana transactions
    return [];
  } catch (error) {
    console.error(`Error fetching transactions for ${walletAddress}:`, error);
    return [];
  }
};

/**
 * Get wallet token balances and portfolio
 */
export const getWalletPortfolio = async (
  walletAddress: string,
  chain: Chain
): Promise<{ totalValue: number; flows: WalletFlow[] }> => {
  try {
    const chainId = CHAIN_MAP[chain];
    const response = await axios.get(
      `${MORALIS_BASE_URL}/${walletAddress}/erc20`,
      {
        params: {
          chain: chainId,
        },
        headers: {
          'X-API-Key': MORALIS_API_KEY,
        },
      }
    );

    let totalValue = 0;
    const flows: WalletFlow[] = [];

    if (response.data.result) {
      response.data.result.forEach((token: any) => {
        const balance = parseFloat(token.balance) / Math.pow(10, token.decimals);
        const value = balance * parseFloat(token.usd_price || '0');
        totalValue += value;

        flows.push({
          tokenAddress: token.token_address,
          tokenSymbol: token.symbol,
          inflow: balance,
          outflow: 0,
          netFlow: balance,
          usdValue: value,
        });
      });
    }

    return { totalValue, flows };
  } catch (error) {
    console.error(`Error fetching portfolio for ${walletAddress}:`, error);
    return { totalValue: 0, flows: [] };
  }
};

/**
 * Monitor real-time wallet swaps and trades
 */
export const monitorWalletSwaps = async (
  walletAddress: string,
  chain: Chain
): Promise<WalletEvent[]> => {
  try {
    const chainId = CHAIN_MAP[chain];
    const response = await axios.get(
      `${MORALIS_BASE_URL}/${walletAddress}`,
      {
        params: {
          chain: chainId,
          include: 'internal_transactions',
        },
        headers: {
          'X-API-Key': MORALIS_API_KEY,
        },
      }
    );

    // Filter for swap events (Uniswap, 1inch, etc.)
    const swapEvents: WalletEvent[] = [];
    if (response.data.result) {
      response.data.result.forEach((tx: any) => {
        if (isSwapTransaction(tx)) {
          swapEvents.push({
            id: tx.hash,
            trackerWalletId: '',
            type: 'SWAP',
            tokenAddress: tx.to_address,
            tokenSymbol: tx.token_symbol || 'UNKNOWN',
            amount: tx.value,
            usdValue: parseFloat(tx.value_decimal || '0') * parseFloat(tx.token_price || '0'),
            txHash: tx.hash,
            blockNumber: tx.block_number,
            timestamp: new Date(tx.block_timestamp),
            chain,
          });
        }
      });
    }

    return swapEvents;
  } catch (error) {
    console.error(`Error monitoring swaps for ${walletAddress}:`, error);
    return [];
  }
};

/**
 * Detect buy signal (token inflow)
 */
export const detectBuys = async (
  walletAddress: string,
  chain: Chain
): Promise<WalletEvent[]> => {
  try {
    const chainId = CHAIN_MAP[chain];
    const response = await axios.get(
      `${MORALIS_BASE_URL}/${walletAddress}/erc20/transfers`,
      {
        params: {
          chain: chainId,
          to_address: walletAddress,
        },
        headers: {
          'X-API-Key': MORALIS_API_KEY,
        },
      }
    );

    const buyEvents: WalletEvent[] = [];
    if (response.data.result) {
      response.data.result.forEach((transfer: any) => {
        buyEvents.push({
          id: transfer.hash,
          trackerWalletId: '',
          type: 'BUY',
          tokenAddress: transfer.token_address,
          tokenSymbol: transfer.token_symbol,
          tokenName: transfer.token_name,
          amount: transfer.value,
          usdValue: parseFloat(transfer.value_decimal || '0') * parseFloat(transfer.token_price || '0'),
          txHash: transfer.hash,
          blockNumber: transfer.block_number,
          timestamp: new Date(transfer.block_timestamp),
          chain,
        });
      });
    }

    return buyEvents;
  } catch (error) {
    console.error(`Error detecting buys for ${walletAddress}:`, error);
    return [];
  }
};

/**
 * Detect sell signal (token outflow)
 */
export const detectSells = async (
  walletAddress: string,
  chain: Chain
): Promise<WalletEvent[]> => {
  try {
    const chainId = CHAIN_MAP[chain];
    const response = await axios.get(
      `${MORALIS_BASE_URL}/${walletAddress}/erc20/transfers`,
      {
        params: {
          chain: chainId,
          from_address: walletAddress,
        },
        headers: {
          'X-API-Key': MORALIS_API_KEY,
        },
      }
    );

    const sellEvents: WalletEvent[] = [];
    if (response.data.result) {
      response.data.result.forEach((transfer: any) => {
        sellEvents.push({
          id: transfer.hash,
          trackerWalletId: '',
          type: 'SELL',
          tokenAddress: transfer.token_address,
          tokenSymbol: transfer.token_symbol,
          tokenName: transfer.token_name,
          amount: transfer.value,
          usdValue: parseFloat(transfer.value_decimal || '0') * parseFloat(transfer.token_price || '0'),
          txHash: transfer.hash,
          blockNumber: transfer.block_number,
          timestamp: new Date(transfer.block_timestamp),
          chain,
        });
      });
    }

    return sellEvents;
  } catch (error) {
    console.error(`Error detecting sells for ${walletAddress}:`, error);
    return [];
  }
};

// Helper functions

function determineTransactionType(tx: any): 'BUY' | 'SELL' | 'TRANSFER_IN' | 'TRANSFER_OUT' | 'SWAP' {
  // Check if swap (contains router address)
  if (tx.to_address && isUniswapRouter(tx.to_address)) {
    return 'SWAP';
  }

  // Check direction
  if (tx.direction === 'in') {
    return 'TRANSFER_IN';
  }

  return 'TRANSFER_OUT';
}

function isSwapTransaction(tx: any): boolean {
  const uniswapRouters = [
    '0x68b3465833fb72B5A828cCEEB955e0B7C1d8525B', // Uniswap V3 Router 2
    '0xE592427A0AEce92De3Edee1F18E0157C05861564', // Uniswap V3 Router
    '0x7a250d5630B4cF539739dF2C5dAcb4c659F2488D', // Uniswap V2 Router
    '0x1111111254fb6c44bAC0bed2854e76F90643097d', // 1inch
  ];

  return uniswapRouters.includes(tx.to_address?.toLowerCase());
}

function isUniswapRouter(address: string): boolean {
  const routers = [
    '0x68b3465833fb72B5A828cCEEB955e0B7C1d8525B',
    '0xE592427A0AEce92De3Edee1F18E0157C05861564',
    '0x7a250d5630B4cF539739dF2C5dAcb4c659F2488D',
    '0x1111111254fb6c44bAC0bed2854e76F90643097d',
  ];

  return routers.includes(address?.toLowerCase());
}

export default {
  getWalletTransactions,
  getWalletPortfolio,
  monitorWalletSwaps,
  detectBuys,
  detectSells,
};
