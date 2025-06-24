
import { supabase } from '@/lib/supabase';
import { User, CreateUserData } from '@/types/auth';
import { LeaveRequest, Announcement, LeaveBalance } from '@/types/hr';

export class ApiService {
  // User Management APIs
  static async getCurrentUser(): Promise<User | null> {
    try {
      const { data: { user: authUser }, error: authError } = await supabase.auth.getUser();
      
      if (authError || !authUser) return null;

      const { data, error } = await supabase
        .from('users')
        .select('*')
        .eq('id', authUser.id)
        .single();

      if (error) throw error;

      return {
        id: data.id,
        username: data.username,
        password: '',
        firstName: data.first_name,
        lastName: data.last_name,
        role: data.role,
        department: data.department,
        joinDate: data.join_date,
        createdBy: data.created_by,
        createdDate: data.created_at,
      };
    } catch (error) {
      console.error('Error fetching current user:', error);
      return null;
    }
  }

  static async getAllUsers(): Promise<User[]> {
    try {
      const { data, error } = await supabase
        .from('users')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;

      return data.map(user => ({
        id: user.id,
        username: user.username,
        password: '',
        firstName: user.first_name,
        lastName: user.last_name,
        role: user.role,
        department: user.department,
        joinDate: user.join_date,
        createdBy: user.created_by,
        createdDate: user.created_at,
      }));
    } catch (error) {
      console.error('Error fetching users:', error);
      return [];
    }
  }

  static async createUser(userData: CreateUserData, createdBy: string): Promise<boolean> {
    try {
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: userData.username,
        password: userData.password,
      });

      if (authError) throw authError;

      if (authData.user) {
        const { error: profileError } = await supabase
          .from('users')
          .insert({
            id: authData.user.id,
            username: userData.username,
            first_name: userData.firstName,
            last_name: userData.lastName,
            role: userData.role,
            department: userData.department,
            created_by: createdBy,
          });

        if (profileError) throw profileError;
      }

      return true;
    } catch (error) {
      console.error('Error creating user:', error);
      return false;
    }
  }

  static async updateUser(userId: string, userData: Partial<User>): Promise<boolean> {
    try {
      const { error } = await supabase
        .from('users')
        .update({
          username: userData.username,
          first_name: userData.firstName,
          last_name: userData.lastName,
          role: userData.role,
          department: userData.department,
          updated_at: new Date().toISOString(),
        })
        .eq('id', userId);

      if (error) throw error;
      return true;
    } catch (error) {
      console.error('Error updating user:', error);
      return false;
    }
  }

  static async deleteUser(userId: string): Promise<boolean> {
    try {
      // First delete from auth (this will cascade to users table)
      const { error: authError } = await supabase.auth.admin.deleteUser(userId);
      if (authError) throw authError;
      
      return true;
    } catch (error) {
      console.error('Error deleting user:', error);
      return false;
    }
  }

  // Leave Request APIs
  static async getLeaveRequests(): Promise<LeaveRequest[]> {
    try {
      const { data, error } = await supabase
        .from('leave_requests')
        .select(`
          *,
          users!leave_requests_user_id_fkey(first_name, last_name),
          leave_replies(*)
        `)
        .order('created_at', { ascending: false });

      if (error) throw error;

      return data.map(request => ({
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
    } catch (error) {
      console.error('Error fetching leave requests:', error);
      return [];
    }
  }

  static async createLeaveRequest(requestData: Omit<LeaveRequest, 'id' | 'userName' | 'status' | 'replies'>): Promise<boolean> {
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
      return true;
    } catch (error) {
      console.error('Error creating leave request:', error);
      return false;
    }
  }

  static async updateLeaveRequestStatus(requestId: string, status: 'approved' | 'rejected', approvedBy: string): Promise<boolean> {
    try {
      const { error } = await supabase
        .from('leave_requests')
        .update({
          status,
          approved_by: approvedBy,
          approved_date: new Date().toISOString().split('T')[0],
          updated_at: new Date().toISOString(),
        })
        .eq('id', requestId);

      if (error) throw error;
      return true;
    } catch (error) {
      console.error('Error updating request status:', error);
      return false;
    }
  }

  static async addLeaveReply(requestId: string, message: string, fromUser: string): Promise<boolean> {
    try {
      const { error } = await supabase
        .from('leave_replies')
        .insert({
          leave_request_id: requestId,
          message,
          from_user: fromUser,
        });

      if (error) throw error;
      return true;
    } catch (error) {
      console.error('Error adding reply:', error);
      return false;
    }
  }

  // Leave Balance APIs
  static async getLeaveBalance(userId: string, year?: number): Promise<LeaveBalance | null> {
    try {
      const targetYear = year || new Date().getFullYear();
      
      const { data, error } = await supabase
        .from('leave_balances')
        .select('*')
        .eq('user_id', userId)
        .eq('year', targetYear)
        .single();

      if (error) throw error;

      return {
        userId: data.user_id,
        year: data.year,
        totalDays: data.total_days,
        usedDays: data.used_days,
        remainingDays: data.remaining_days,
      };
    } catch (error) {
      console.error('Error fetching leave balance:', error);
      return null;
    }
  }

  // Announcements APIs
  static async getAnnouncements(): Promise<Announcement[]> {
    try {
      const { data, error } = await supabase
        .from('announcements')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;

      return data.map(announcement => ({
        id: announcement.id,
        title: announcement.title,
        content: announcement.content,
        author: announcement.author,
        createdDate: announcement.created_at,
        priority: announcement.priority,
        department: announcement.department,
      }));
    } catch (error) {
      console.error('Error fetching announcements:', error);
      return [];
    }
  }

  static async createAnnouncement(announcementData: Omit<Announcement, 'id' | 'createdDate'>): Promise<boolean> {
    try {
      const { error } = await supabase
        .from('announcements')
        .insert({
          title: announcementData.title,
          content: announcementData.content,
          author: announcementData.author,
          priority: announcementData.priority,
          department: announcementData.department,
        });

      if (error) throw error;
      return true;
    } catch (error) {
      console.error('Error creating announcement:', error);
      return false;
    }
  }

  // Dashboard Analytics APIs
  static async getDashboardStats(): Promise<any> {
    try {
      const [usersResult, leaveRequestsResult] = await Promise.all([
        supabase.from('users').select('id, role, department'),
        supabase.from('leave_requests').select('status')
      ]);

      const users = usersResult.data || [];
      const leaveRequests = leaveRequestsResult.data || [];

      return {
        totalEmployees: users.filter(u => u.role !== 'admin').length,
        pendingLeaves: leaveRequests.filter(r => r.status === 'pending').length,
        approvedLeaves: leaveRequests.filter(r => r.status === 'approved').length,
        totalDepartments: new Set(users.map(u => u.department)).size,
        departmentBreakdown: {
          sales: users.filter(u => u.department === 'sales').length,
          production: users.filter(u => u.department === 'production').length,
          hr: users.filter(u => u.department === 'hr').length,
        },
        roleBreakdown: {
          managers: users.filter(u => u.role === 'manager').length,
          employees: users.filter(u => u.role === 'employee').length,
          hr: users.filter(u => u.role === 'hr').length,
        }
      };
    } catch (error) {
      console.error('Error fetching dashboard stats:', error);
      return {
        totalEmployees: 0,
        pendingLeaves: 0,
        approvedLeaves: 0,
        totalDepartments: 0,
        departmentBreakdown: { sales: 0, production: 0, hr: 0 },
        roleBreakdown: { managers: 0, employees: 0, hr: 0 }
      };
    }
  }
}
