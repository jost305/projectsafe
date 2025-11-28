import { Token } from '../types';

const MORALIS_API_KEY = process.env.MORALIS_API_KEY || '';

export const fetchTopTokens = async (): Promise<Token[]> => {
  try {
    const response = await fetch('https://deep-index.moralis.io/api/v2.2/market-data/erc20s/top-tokens', {
      headers: {
        'Accept': 'application/json',
        'X-API-Key': MORALIS_API_KEY
      }
    });

    if (!response.ok) {
      throw new Error(`Moralis API Error: ${response.statusText}`);
    }

    const data = await response.json();

    // Map Moralis response to our Token interface
    // Note: The API returns EVM tokens. We map them to our interface.
    return data.map((item: any) => ({
      id: item.contract_address || item.symbol.toLowerCase(), // Use contract address as ID for uniqueness
      symbol: item.symbol,
      name: item.name,
      balance: 0, // Market data doesn't have user balance
      price: item.usd_price || 0,
      change24h: parseFloat(item.price_change_24h_percent || '0'),
      network: 'ETH', // Defaulting to ETH as this is an ERC20 endpoint
      image: item.thumbnail || item.logo || `https://ui-avatars.com/api/?name=${item.symbol}&background=random`,
      marketCap: item.market_cap || 0,
      description: item.summary || `${item.name} on Ethereum Network.`
    }));
  } catch (error) {
    console.error('Failed to fetch top tokens from Moralis:', error);
    return [];
  }
};

export const fetchTokenBalances = async (address: string): Promise<Token[]> => {
    try {
        const response = await fetch(`https://deep-index.moralis.io/api/v2.2/${address}/erc20?chain=eth`, {
            headers: {
                'Accept': 'application/json',
                'X-API-Key': MORALIS_API_KEY
            }
        });

        if (!response.ok) {
            return [];
        }

        const data = await response.json();
        
        return data.map((item: any) => ({
            id: item.token_address,
            symbol: item.symbol,
            name: item.name,
            balance: parseFloat(item.balance) / Math.pow(10, item.decimals),
            price: item.usd_price || 0, // Sometimes included, else might need separate fetch
            change24h: 0, // Balance endpoint might not have 24h change
            network: 'ETH',
            image: item.thumbnail || item.logo || `https://ui-avatars.com/api/?name=${item.symbol}&background=random`,
            marketCap: 0
        }));
    } catch (error) {
        console.error('Failed to fetch balances:', error);
        return [];
    }
}
