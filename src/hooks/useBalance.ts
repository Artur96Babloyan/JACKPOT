'use client';

import { useState } from 'react';
import { useAccount, useBalance as useWagmiBalance } from 'wagmi';

export function useBalance() {
  const { address } = useAccount();
  const { data, isLoading } = useWagmiBalance({
    address,
  });
  const [isDepositing, setIsDepositing] = useState(false);
  const [isWithdrawing, setIsWithdrawing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const deposit = async (amount: string) => {
    setIsDepositing(true);
    setError(null);
    try {
      // Implement deposit logic here
      console.log('Depositing:', amount);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to deposit');
    } finally {
      setIsDepositing(false);
    }
  };

  const withdraw = async (amount: string) => {
    setIsWithdrawing(true);
    setError(null);
    try {
      // Implement withdraw logic here
      console.log('Withdrawing:', amount);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to withdraw');
    } finally {
      setIsWithdrawing(false);
    }
  };

  const transfer = async (recipient: string, amount: string) => {
    setError(null);
    try {
      // Implement transfer logic here
      console.log('Transferring:', amount, 'to:', recipient);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to transfer');
    }
  };

  return {
    balance: data ? `${Number(data.formatted).toFixed(4)} ${data.symbol}` : '0',
    isLoading,
    isDepositing,
    isWithdrawing,
    error,
    deposit,
    withdraw,
    transfer,
  };
} 