
export interface LeaveRequest {
  id: string;
  userId: string;
  userName: string;
  type: 'vacation' | 'sick' | 'personal' | 'emergency';
  startDate: string;
  endDate: string;
  days: number;
  reason: string;
  status: 'pending' | 'approved' | 'rejected';
  submittedDate: string;
  approvedBy?: string;
  approvedDate?: string;
  replies?: Reply[];
}

export interface Reply {
  id: string;
  message: string;
  from: string;
  timestamp: string;
}

export interface LeaveBalance {
  userId: string;
  year: number;
  totalDays: number;
  usedDays: number;
  remainingDays: number;
}

export interface Announcement {
  id: string;
  title: string;
  content: string;
  author: string;
  createdDate: string;
  priority: 'low' | 'medium' | 'high';
  department?: string;
}

export interface DashboardStats {
  totalEmployees: number;
  pendingLeaves: number;
  approvedLeaves: number;
  totalDepartments: number;
}
