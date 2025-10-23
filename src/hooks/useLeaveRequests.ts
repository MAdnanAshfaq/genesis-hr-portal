
import { useState, useEffect } from 'react';
import { ApiService } from '@/services/api';
import { LeaveRequest, Reply } from '@/types/hr';

export function useLeaveRequests() {
  const [requests, setRequests] = useState<LeaveRequest[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchRequests = async () => {
    try {
      setIsLoading(true);
      const data = await ApiService.getLeaveRequests();
      setRequests(data);
    } catch (error) {
      console.error('Error fetching leave requests:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const createRequest = async (requestData: Omit<LeaveRequest, 'id' | 'userName' | 'status' | 'replies'>) => {
    try {
      const newRequest = await ApiService.createLeaveRequest(requestData);
      if (newRequest) {
        await fetchRequests();
        return true;
      }
      return false;
    } catch (error) {
      console.error('Error creating leave request:', error);
      return false;
    }
  };

  const updateRequestStatus = async (requestId: string, status: 'approved' | 'rejected', approvedBy: string) => {
    try {
      const success = await ApiService.updateLeaveRequestStatus(requestId, status, approvedBy);
      if (success) {
        await fetchRequests();
      }
      return success;
    } catch (error) {
      console.error('Error updating request status:', error);
      return false;
    }
  };

  const addReply = async (requestId: string, message: string, fromUser: string) => {
    try {
      const success = await ApiService.addLeaveReply(requestId, message, fromUser);
      if (success) {
        await fetchRequests();
      }
      return success;
    } catch (error) {
      console.error('Error adding reply:', error);
      return false;
    }
  };

  useEffect(() => {
    fetchRequests();
  }, []);

  return {
    requests,
    isLoading,
    createRequest,
    updateRequestStatus,
    addReply,
    refreshRequests: fetchRequests,
  };
}
