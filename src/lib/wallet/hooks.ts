import { useWallet } from './provider';
import { useEffect, useState } from 'react';
import { getRiskScore } from '../contracts/hooks';
import { SEPOLIA_CHAIN_ID } from '../contracts/addresses';

export function useWalletBalance() {
  const { provider, address, getBalance } = useWallet();
  const [balance, setBalance] = useState<string>('0');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (provider && address) {
      setLoading(true);
      getBalance()
        .then(setBalance)
        .catch(console.error)
        .finally(() => setLoading(false));
    } else {
      setBalance('0');
    }
  }, [provider, address, getBalance]);

  return { balance, loading };
}

export function useWalletRisk() {
  const { provider, address, chainId } = useWallet();
  const [riskScore, setRiskScore] = useState<number>(0);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (provider && address && chainId === SEPOLIA_CHAIN_ID) {
      setLoading(true);
      getRiskScore(provider, chainId, address)
        .then(setRiskScore)
        .catch(console.error)
        .finally(() => setLoading(false));
    } else {
      setRiskScore(0);
    }
  }, [provider, address, chainId]);

  return { riskScore, loading };
}

