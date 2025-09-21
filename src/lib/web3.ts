import { ThirdwebSDK } from '@thirdweb-dev/sdk';
import { Polygon } from '@thirdweb-dev/chains';

const CHAIN_ID = parseInt(import.meta.env.VITE_APP_CHAIN_ID || '80002');
const RPC_URL = import.meta.env.VITE_APP_RPC_URL;
const CLIENT_ID = import.meta.env.VITE_APP_THIRDWEB_CLIENT_ID;

// Initialize SDK
export const sdk = new ThirdwebSDK(CHAIN_ID, {
  clientId: CLIENT_ID,
});

// Contract addresses
export const NFT_CONTRACT_ADDRESS = import.meta.env.VITE_NFT_CONTRACT_ADDRESS;
export const MARKETPLACE_CONTRACT_ADDRESS = import.meta.env.VITE_MARKETPLACE_CONTRACT_ADDRESS;
export const NFT_DROP_ADDRESS = import.meta.env.VITE_NFT_DROP_ADDRESS;

// Get contracts
export const getNFTContract = () => {
  if (!NFT_CONTRACT_ADDRESS) throw new Error('NFT contract address not configured');
  return sdk.getContract(NFT_CONTRACT_ADDRESS);
};

export const getMarketplaceContract = () => {
  if (!MARKETPLACE_CONTRACT_ADDRESS) throw new Error('Marketplace contract address not configured');
  return sdk.getContract(MARKETPLACE_CONTRACT_ADDRESS);
};

export const getNFTDropContract = () => {
  if (!NFT_DROP_ADDRESS) throw new Error('NFT Drop contract address not configured');
  return sdk.getContract(NFT_DROP_ADDRESS);
};

// Utility functions
export const formatAddress = (address: string): string => {
  return `${address.slice(0, 6)}...${address.slice(-4)}`;
};

export const convertToWei = (amount: number): string => {
  return (amount * 1e18).toString();
};

export const convertFromWei = (amount: string): number => {
  return parseInt(amount) / 1e18;
};

// MetaMask integration utilities
export const checkMetaMaskAvailability = (): boolean => {
  return typeof window !== 'undefined' && typeof window.ethereum !== 'undefined';
};

export const requestMetaMaskConnection = async (): Promise<string[]> => {
  if (!checkMetaMaskAvailability()) {
    throw new Error('MetaMask is not installed');
  }

  try {
    const accounts = await window.ethereum!.request({
      method: 'eth_requestAccounts',
    });
    return accounts;
  } catch (error: any) {
    if (error.code === 4001) {
      throw new Error('User rejected the connection request');
    }
    throw error;
  }
};

export const switchToPolygonNetwork = async (): Promise<void> => {
  if (!checkMetaMaskAvailability()) {
    throw new Error('MetaMask is not installed');
  }

  try {
    await window.ethereum!.request({
      method: 'wallet_switchEthereumChain',
      params: [{ chainId: '0x89' }], // Polygon Mainnet
    });
  } catch (switchError: any) {
    // This error code indicates that the chain has not been added to MetaMask
    if (switchError.code === 4902) {
      try {
        await window.ethereum!.request({
          method: 'wallet_addEthereumChain',
          params: [
            {
              chainId: '0x89',
              chainName: 'Polygon Mainnet',
              nativeCurrency: {
                name: 'MATIC',
                symbol: 'MATIC',
                decimals: 18,
              },
              rpcUrls: ['https://polygon-rpc.com/'],
              blockExplorerUrls: ['https://polygonscan.com/'],
            },
          ],
        });
      } catch (addError) {
        throw new Error('Failed to add Polygon network to MetaMask');
      }
    } else {
      throw new Error('Failed to switch to Polygon network');
    }
  }
};

export const getNetworkInfo = async (): Promise<{ chainId: string; networkName: string }> => {
  if (!checkMetaMaskAvailability()) {
    throw new Error('MetaMask is not installed');
  }

  const chainId = await window.ethereum!.request({ method: 'eth_chainId' });
  
  const networkNames: { [key: string]: string } = {
    '0x1': 'Ethereum Mainnet',
    '0x89': 'Polygon Mainnet',
    '0x13881': 'Polygon Mumbai Testnet',
    '0x5': 'Goerli Testnet',
  };

  return {
    chainId,
    networkName: networkNames[chainId] || 'Unknown Network',
  };
};