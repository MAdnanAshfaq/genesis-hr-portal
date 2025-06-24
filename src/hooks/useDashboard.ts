
import { useState, useEffect } from 'react';
import { ApiService } from '@/services/api';
import { DashboardStats } from '@/types/hr';

export function useDashboard() {
  const [stats, setStats] = useState<DashboardStats>({
    totalEmployees: 0,
    pendingLeaves: 0,
    approvedLeaves: 0,
    totalDepartments: 0,
  });
  const [isLoading, setIsLoading] = useState(true);

  const fetchStats = async () => {
    try {
      setIsLoading(true);
      const data = await ApiService.getDashboardStats();
      setStats(data);
    } catch (error) {
      console.error('Error fetching dashboard stats:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchStats();
  }, []);

  return {
    stats,
    isLoading,
    refreshStats: fetchStats,
  };
}
