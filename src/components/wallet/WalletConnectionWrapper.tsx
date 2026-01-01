'use client';

import { useEffect, useState } from 'react';
import { MetaMaskConnection } from './WalletConnect';
import { useWallet } from '@/lib/wallet/provider';
import { useWalletBalance } from '@/lib/wallet/hooks';
import { useMosyneStore } from '@/lib/store';

interface Permission {
  id: string;
  name: string;
  description: string;
  granted: boolean;
  icon: string;
  riskLevel?: 'low' | 'medium' | 'high';
  usageCount?: number;
}

export function WalletConnectionWrapper() {
  const { isConnected, address, connect, disconnect, chainId, switchToSepolia } = useWallet();
  const { balance, loading: balanceLoading } = useWalletBalance();
  const { setWallet, connectWallet, disconnectWallet } = useMosyneStore();
  const [permissions, setPermissions] = useState<Permission[]>([]);

  // Sync wallet state to store
  useEffect(() => {
    if (isConnected && address && chainId) {
      connectWallet(address, chainId);
      // Update balance separately
      setWallet({ balance });
    } else {
      disconnectWallet();
    }
  }, [isConnected, address, chainId, balance, connectWallet, disconnectWallet, setWallet]);

  const handleConnect = async () => {
    try {
      await connect();
      // Ensure we're on Sepolia
      if (chainId !== 11155111) {
        await switchToSepolia();
      }
    } catch (error) {
      console.error('Error connecting wallet:', error);
      alert('Failed to connect wallet. Please ensure MetaMask is installed.');
    }
  };

  const handleDisconnect = () => {
    disconnect();
  };

  const handlePermissionToggle = async (id: string) => {
    // In production, this would call the PermissionManager contract
    setPermissions(prev =>
      prev.map(p => p.id === id ? { ...p, granted: !p.granted } : p)
    );
  };

  // Fetch permissions from API (if available)
  useEffect(() => {
    if (isConnected && address) {
      fetch(`/api/wallet/permissions?wallet=${address}`)
        .then(res => res.json())
        .then(data => {
          if (data.success && data.permissions) {
            // Transform API permissions to UI format
            // This is a simplified version - adjust based on actual API response
          }
        })
        .catch(console.error);
    }
  }, [isConnected, address]);

  return (
    <MetaMaskConnection
      isConnected={isConnected}
      address={address || undefined}
      permissions={permissions}
      onConnect={handleConnect}
      onDisconnect={handleDisconnect}
      onPermissionToggle={handlePermissionToggle}
    />
  );
}

