import { User, CreateUserData } from '@/types/auth';
import { LeaveRequest, Announcement, LeaveBalance, DashboardStats } from '@/types/hr';

const API_BASE_URL = 'http://localhost:3001/api';

// API service with backend integration - NO MOCK DATA
export class ApiService {
  private static async makeRequest(url: string, options?: RequestInit): Promise<Response> {
    const response = await fetch(url, options);
    if (!response.ok) {
      throw new Error(`API request failed: ${response.status} ${response.statusText}`);
    }
    return response;
  }

  // User Management APIs
  static async getCurrentUser(userId: string): Promise<User | null> {
    try {
      const response = await this.makeRequest(`${API_BASE_URL}/users/${userId}`);
      return await response.json();
    } catch (error) {
      console.error('Error fetching current user:', error);
      return null;
    }
  }

  static async getAllUsers(): Promise<User[]> {
    try {
      const response = await this.makeRequest(`${API_BASE_URL}/users`);
      return await response.json();
    } catch (error) {
      console.error('Error fetching users:', error);
      return [];
    }
  }

  static async createUser(userData: CreateUserData, createdBy: string): Promise<boolean> {
    try {
      await this.makeRequest(`${API_BASE_URL}/users`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...userData,
          createdBy
        }),
      });
      return true;
    } catch (error) {
      console.error('Error creating user:', error);
      return false;
    }
  }

  static async updateUser(userId: string, userData: Partial<User>): Promise<boolean> {
    try {
      await this.makeRequest(`${API_BASE_URL}/users/${userId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(userData),
      });
      return true;
    } catch (error) {
      console.error('Error updating user:', error);
      return false;
    }
  }

  static async deleteUser(userId: string): Promise<boolean> {
    try {
      await this.makeRequest(`${API_BASE_URL}/users/${userId}`, {
        method: 'DELETE',
      });
      return true;
    } catch (error) {
      console.error('Error deleting user:', error);
      return false;
    }
  }

  static async getUserByUsername(username: string): Promise<User | null> {
    try {
      const response = await this.makeRequest(`${API_BASE_URL}/users/username/${username}`);
      return await response.json();
    } catch (error) {
      console.error('Error fetching user by username:', error);
      return null;
    }
  }

  static async getUsersByDepartment(department: string): Promise<User[]> {
    const allUsers = await this.getAllUsers();
    return allUsers.filter(user => user.department === department);
  }

  // Leave Request APIs
  static async getLeaveRequests(): Promise<LeaveRequest[]> {
    try {
      const response = await this.makeRequest(`${API_BASE_URL}/leave-requests`);
      return await response.json();
    } catch (error) {
      console.error('Error fetching leave requests:', error);
      return [];
    }
  }

  static async getLeaveRequestsByUser(userId: string): Promise<LeaveRequest[]> {
    const allRequests = await this.getLeaveRequests();
    return allRequests.filter(request => request.userId === userId);
  }

  static async createLeaveRequest(requestData: Omit<LeaveRequest, 'id' | 'userName' | 'status' | 'replies'>): Promise<LeaveRequest | null> {
    try {
      const response = await this.makeRequest(`${API_BASE_URL}/leave-requests`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestData),
      });
      return await response.json();
    } catch (error) {
      console.error('Error creating leave request:', error);
      return null;
    }
  }

  static async updateLeaveRequestStatus(requestId: string, status: 'approved' | 'rejected', approvedBy: string): Promise<boolean> {
    try {
      await this.makeRequest(`${API_BASE_URL}/leave-requests/${requestId}/status`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status, approvedBy }),
      });
      return true;
    } catch (error) {
      console.error('Error updating leave request status:', error);
      return false;
    }
  }

  static async addLeaveReply(requestId: string, message: string, fromUser: string): Promise<boolean> {
    // This would need to be implemented in the backend
    console.log('Add leave reply not implemented yet');
    return true;
  }

  // Leave Balance APIs
  static async getLeaveBalance(userId: string, year?: number): Promise<LeaveBalance | null> {
    // This would need to be implemented in the backend
    console.log('Get leave balance not implemented yet');
    return null;
  }

  // Announcements APIs
  static async getAnnouncements(): Promise<Announcement[]> {
    try {
      const response = await this.makeRequest(`${API_BASE_URL}/announcements`);
      return await response.json();
    } catch (error) {
      console.error('Error fetching announcements:', error);
      return [];
    }
  }

  static async createAnnouncement(announcementData: Omit<Announcement, 'id' | 'createdDate'>): Promise<boolean> {
    // This would need to be implemented in the backend
    console.log('Create announcement not implemented yet');
    return true;
  }

  // Dashboard Analytics APIs
  static async getDashboardStats(): Promise<DashboardStats> {
    try {
      const response = await this.makeRequest(`${API_BASE_URL}/dashboard/stats`);
      return await response.json();
    } catch (error) {
      console.error('Error fetching dashboard stats:', error);
      return {
        totalEmployees: 0,
        pendingLeaves: 0,
        approvedLeaves: 0,
        totalDepartments: 0
      };
    }
  }

  // Backend health check
  static async testConnection(): Promise<boolean> {
    try {
      const response = await this.makeRequest(`${API_BASE_URL}/health`);
      return response.ok;
    } catch (error) {
      console.error('Error testing backend connection:', error);
      return false;
    }
  }

  // Database initialization (handled by backend)
  static async initializeDatabase(): Promise<boolean> {
    // Backend handles initialization automatically
    return true;
  }
}
