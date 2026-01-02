'use client';

import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { MetaMaskProvider, useSDK } from '@metamask/sdk-react';
import { ethers } from 'ethers';
import {
  requestAdvancedPermissions,
  hasAdvancedPermissions,
  revokeAdvancedPermissions,
  getPermissionStatus,
  supportsERC7715,
  type PermissionGrant,
} from './permissions';

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
  // ERC-7715 Advanced Permissions
  hasERC7715Permissions: boolean;
  supportsERC7715: boolean;
  requestPermissions: () => Promise<void>;
  revokePermissions: () => Promise<void>;
  permissionStatus: { granted: boolean; expiry?: number } | null;
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
  
  // ERC-7715 Permission state
  const [hasERC7715Perms, setHasERC7715Perms] = useState(false);
  const [erc7715Support, setERC7715Support] = useState(false);
  const [permStatus, setPermStatus] = useState<{ granted: boolean; expiry?: number } | null>(null);

  useEffect(() => {
    if (window.ethereum && connected && account) {
      const browserProvider = new ethers.BrowserProvider(window.ethereum);
      setProvider(browserProvider);
      browserProvider.getSigner().then(setSigner);
      
      // Check ERC-7715 support
      setERC7715Support(supportsERC7715());
      
      // Check existing permissions
      checkPermissions(browserProvider);
    } else {
      setProvider(null);
      setSigner(null);
      setHasERC7715Perms(false);
      setPermStatus(null);
    }
  }, [connected, account]);
  
  const checkPermissions = async (browserProvider: ethers.BrowserProvider) => {
    try {
      const hasPerms = await hasAdvancedPermissions(browserProvider);
      setHasERC7715Perms(hasPerms);
      
      if (hasPerms) {
        const status = await getPermissionStatus(browserProvider);
        setPermStatus(status);
      }
    } catch (error) {
      console.error('Error checking ERC-7715 permissions:', error);
    }
  };

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
  
  // ERC-7715: Request Advanced Permissions
  const requestPermissions = async () => {
    if (!provider) {
      throw new Error('Wallet not connected');
    }
    
    if (!erc7715Support) {
      throw new Error('ERC-7715 not supported by this MetaMask version. Please update MetaMask or use Flask.');
    }
    
    try {
      console.log('🔐 Requesting ERC-7715 Advanced Permissions...');
      await requestAdvancedPermissions(provider);
      
      // Refresh permission status
      await checkPermissions(provider);
      
      console.log('✅ ERC-7715 Permissions granted successfully');
    } catch (error: any) {
      console.error('❌ Failed to request permissions:', error);
      throw error;
    }
  };
  
  // ERC-7715: Revoke Advanced Permissions
  const revokePermissions = async () => {
    if (!provider) {
      throw new Error('Wallet not connected');
    }
    
    try {
      console.log('🔓 Revoking ERC-7715 Permissions...');
      await revokeAdvancedPermissions(provider);
      
      setHasERC7715Perms(false);
      setPermStatus(null);
      
      console.log('✅ ERC-7715 Permissions revoked successfully');
    } catch (error) {
      console.error('❌ Failed to revoke permissions:', error);
      throw error;
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
    // ERC-7715 Advanced Permissions
    hasERC7715Permissions: hasERC7715Perms,
    supportsERC7715: erc7715Support,
    requestPermissions,
    revokePermissions,
    permissionStatus: permStatus,
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


