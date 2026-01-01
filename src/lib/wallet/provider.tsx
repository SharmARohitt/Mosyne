'use client';

import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { MetaMaskProvider, useSDK } from '@metamask/sdk-react';
import { ethers } from 'ethers';

const SEPOLIA_CHAIN_ID = '0xaa36a7'; // 11155111 in hex
const SEPOLIA_CHAIN_ID_DECIMAL = 11155111;

interface WalletContextType {
  provider: ethers.BrowserProvider | null;
  signer: ethers.JsonRpcSigner | null;
  address: string | null;
  chainId: number | null;
  isConnected: boolean;
  connect: () => Promise<void>;
  disconnect: () => void;
  switchToSepolia: () => Promise<void>;
  getBalance: () => Promise<string>;
}

const WalletContext = createContext<WalletContextType | undefined>(undefined);

export function useWallet() {
  const context = useContext(WalletContext);
  if (!context) {
    throw new Error('useWallet must be used within WalletProvider');
  }
  return context;
}

function WalletProviderInner({ children }: { children: ReactNode }) {
  const { sdk, connected, connecting, account, chainId } = useSDK();
  const [provider, setProvider] = useState<ethers.BrowserProvider | null>(null);
  const [signer, setSigner] = useState<ethers.JsonRpcSigner | null>(null);

  useEffect(() => {
    if (window.ethereum && connected && account) {
      const browserProvider = new ethers.BrowserProvider(window.ethereum);
      setProvider(browserProvider);
      browserProvider.getSigner().then(setSigner);
    } else {
      setProvider(null);
      setSigner(null);
    }
  }, [connected, account]);

  const connect = async () => {
    if (!sdk || !window.ethereum) {
      throw new Error('MetaMask not installed');
    }

    try {
      const accounts = await sdk.connect();
      if (accounts && accounts.length > 0) {
        // Check if we're on Sepolia, if not, prompt to switch
        const currentChainId = await window.ethereum.request({ 
          method: 'eth_chainId' 
        });
        
        if (currentChainId !== SEPOLIA_CHAIN_ID) {
          await switchToSepolia();
        }
      }
    } catch (error) {
      console.error('Error connecting wallet:', error);
      throw error;
    }
  };

  const disconnect = () => {
    if (sdk) {
      sdk.terminate();
    }
    setProvider(null);
    setSigner(null);
  };

  const switchToSepolia = async () => {
    if (!window.ethereum) {
      throw new Error('MetaMask not installed');
    }

    try {
      await window.ethereum.request({
        method: 'wallet_switchEthereumChain',
        params: [{ chainId: SEPOLIA_CHAIN_ID }],
      });
    } catch (switchError: any) {
      // This error code indicates that the chain has not been added to MetaMask
      if (switchError.code === 4902) {
        try {
          await window.ethereum.request({
            method: 'wallet_addEthereumChain',
            params: [
              {
                chainId: SEPOLIA_CHAIN_ID,
                chainName: 'Sepolia Test Network',
                nativeCurrency: {
                  name: 'SepoliaETH',
                  symbol: 'ETH',
                  decimals: 18,
                },
                rpcUrls: ['https://sepolia.infura.io/v3/'],
                blockExplorerUrls: ['https://sepolia.etherscan.io'],
              },
            ],
          });
        } catch (addError) {
          console.error('Error adding Sepolia network:', addError);
          throw addError;
        }
      } else {
        throw switchError;
      }
    }
  };

  const getBalance = async (): Promise<string> => {
    if (!provider || !account) {
      return '0';
    }

    try {
      const balance = await provider.getBalance(account);
      return ethers.formatEther(balance);
    } catch (error) {
      console.error('Error getting balance:', error);
      return '0';
    }
  };

  const value: WalletContextType = {
    provider,
    signer,
    address: account || null,
    chainId: chainId ? parseInt(chainId, 16) : null,
    isConnected: connected || false,
    connect,
    disconnect,
    switchToSepolia,
    getBalance,
  };

  return (
    <WalletContext.Provider value={value}>
      {children}
    </WalletContext.Provider>
  );
}

export function WalletProvider({ children }: { children: ReactNode }) {
  const [origin, setOrigin] = useState('https://mosyne.io');

  useEffect(() => {
    if (typeof window !== 'undefined') {
      setOrigin(window.location.origin);
    }
  }, []);

  const metadata = {
    name: process.env.NEXT_PUBLIC_METAMASK_DAPP_METADATA_NAME || 'MOSYNE',
    url: process.env.NEXT_PUBLIC_METAMASK_DAPP_METADATA_URL || origin,
  };

  return (
    <MetaMaskProvider
      debug={false}
      sdkOptions={{
        dappMetadata: metadata,
        infuraAPIKey: process.env.NEXT_PUBLIC_INFURA_API_KEY,
      }}
    >
      <WalletProviderInner>{children}</WalletProviderInner>
    </MetaMaskProvider>
  );
}

