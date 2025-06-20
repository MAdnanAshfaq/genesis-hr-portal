
import { LeaveRequest, LeaveBalance, Announcement, DashboardStats } from '@/types/hr';

export const mockLeaveRequests: LeaveRequest[] = [
  {
    id: '1',
    userId: '4',
    userName: 'Emily Davis',
    type: 'vacation',
    startDate: '2024-07-15',
    endDate: '2024-07-19',
    days: 5,
    reason: 'Family vacation to the beach',
    status: 'pending',
    submittedDate: '2024-06-20',
  },
  {
    id: '2',
    userId: '3',
    userName: 'Mike Wilson',
    type: 'sick',
    startDate: '2024-06-25',
    endDate: '2024-06-26',
    days: 2,
    reason: 'Doctor appointment and recovery',
    status: 'approved',
    submittedDate: '2024-06-24',
    approvedBy: 'Sarah Johnson',
    approvedDate: '2024-06-24',
  },
  {
    id: '3',
    userId: '4',
    userName: 'Emily Davis',
    type: 'personal',
    startDate: '2024-08-01',
    endDate: '2024-08-01',
    days: 1,
    reason: 'Moving to new apartment',
    status: 'approved',
    submittedDate: '2024-06-18',
    approvedBy: 'Mike Wilson',
    approvedDate: '2024-06-19',
  },
];

export const mockLeaveBalances: LeaveBalance[] = [
  {
    userId: '4',
    year: 2024,
    totalDays: 25,
    usedDays: 6,
    remainingDays: 19,
  },
  {
    userId: '3',
    year: 2024,
    totalDays: 30,
    usedDays: 8,
    remainingDays: 22,
  },
];

export const mockAnnouncements: Announcement[] = [
  {
    id: '1',
    title: 'Q2 Company Meeting',
    content: 'Join us for our quarterly company meeting next Friday at 2 PM in the main conference room. We will discuss Q2 results and Q3 planning.',
    author: 'Sarah Johnson',
    createdDate: '2024-06-20',
    priority: 'high',
  },
  {
    id: '2',
    title: 'New Health Insurance Benefits',
    content: 'We are excited to announce improved health insurance coverage starting July 1st. Please review the updated benefits package.',
    author: 'Sarah Johnson',
    createdDate: '2024-06-18',
    priority: 'medium',
  },
  {
    id: '3',
    title: 'Office Renovation Update',
    content: 'The office renovation on the 3rd floor will begin next month. Temporary workspaces have been arranged on the 2nd floor.',
    author: 'Admin User',
    createdDate: '2024-06-15',
    priority: 'medium',
  },
];

export const mockDashboardStats: DashboardStats = {
  totalEmployees: 150,
  pendingLeaves: 8,
  approvedLeaves: 24,
  totalDepartments: 6,
};
