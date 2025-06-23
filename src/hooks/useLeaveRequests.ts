
import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { LeaveRequest, Reply } from '@/types/hr';

export function useLeaveRequests() {
  const [requests, setRequests] = useState<LeaveRequest[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchRequests = async () => {
    try {
      setIsLoading(true);
      const { data, error } = await supabase
        .from('leave_requests')
        .select(`
          *,
          users!leave_requests_user_id_fkey(first_name, last_name),
          leave_replies(*)
        `)
        .order('created_at', { ascending: false });

      if (error) throw error;

      const formattedRequests: LeaveRequest[] = data.map(request => ({
        id: request.id,
        userId: request.user_id,
        userName: `${request.users.first_name} ${request.users.last_name}`,
        type: request.type,
        startDate: request.start_date,
        endDate: request.end_date,
        days: request.days,
        reason: request.reason,
        status: request.status,
        submittedDate: request.submitted_date,
        approvedBy: request.approved_by,
        approvedDate: request.approved_date,
        replies: request.leave_replies?.map((reply: any) => ({
          id: reply.id,
          message: reply.message,
          from: reply.from_user,
          timestamp: reply.created_at,
        })) || [],
      }));

      setRequests(formattedRequests);
    } catch (error) {
      console.error('Error fetching leave requests:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const createRequest = async (requestData: Omit<LeaveRequest, 'id' | 'userName' | 'status' | 'replies'>) => {
    try {
      const { error } = await supabase
        .from('leave_requests')
        .insert({
          user_id: requestData.userId,
          type: requestData.type,
          start_date: requestData.startDate,
          end_date: requestData.endDate,
          days: requestData.days,
          reason: requestData.reason,
          submitted_date: requestData.submittedDate,
        });

      if (error) throw error;
      await fetchRequests();
      return true;
    } catch (error) {
      console.error('Error creating leave request:', error);
      return false;
    }
  };

  const updateRequestStatus = async (requestId: string, status: 'approved' | 'rejected', approvedBy: string) => {
    try {
      const { error } = await supabase
        .from('leave_requests')
        .update({
          status,
          approved_by: approvedBy,
          approved_date: new Date().toISOString().split('T')[0],
        })
        .eq('id', requestId);

      if (error) throw error;
      await fetchRequests();
      return true;
    } catch (error) {
      console.error('Error updating request status:', error);
      return false;
    }
  };

  const addReply = async (requestId: string, message: string, fromUser: string) => {
    try {
      const { error } = await supabase
        .from('leave_replies')
        .insert({
          leave_request_id: requestId,
          message,
          from_user: fromUser,
        });

      if (error) throw error;
      await fetchRequests();
      return true;
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
