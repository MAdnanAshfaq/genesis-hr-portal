
import { useState, useEffect } from 'react';
import { ApiService } from '@/services/api';
import { LeaveBalance } from '@/types/hr';

export function useLeaveBalance(userId: string, year?: number) {
  const [balance, setBalance] = useState<LeaveBalance | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const fetchBalance = async () => {
    try {
      setIsLoading(true);
      const data = await ApiService.getLeaveBalance(userId, year);
      setBalance(data);
    } catch (error) {
      console.error('Error fetching leave balance:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (userId) {
      fetchBalance();
    }
  }, [userId, year]);

  return {
    balance,
    isLoading,
    refreshBalance: fetchBalance,
  };
}
