
import { useAuth } from '@/contexts/AuthContext';
import { StatsCard } from './StatsCard';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { mockDashboardStats, mockLeaveRequests, mockAnnouncements } from '@/data/mockData';
import { Users, Calendar, CheckCircle, Building } from 'lucide-react';

export function DashboardView() {
  const { user } = useAuth();

  if (!user) return null;

  const userLeaveRequests = mockLeaveRequests.filter(req => req.userId === user.id);
  const recentAnnouncements = mockAnnouncements.slice(0, 3);

  const renderAdminDashboard = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatsCard
          title="Total Employees"
          value={mockDashboardStats.totalEmployees}
          icon={Users}
          trend={{ value: 8.2, isPositive: true }}
        />
        <StatsCard
          title="Pending Leaves"
          value={mockDashboardStats.pendingLeaves}
          icon={Calendar}
          description="Awaiting approval"
        />
        <StatsCard
          title="Approved Leaves"
          value={mockDashboardStats.approvedLeaves}
          icon={CheckCircle}
          trend={{ value: 12.5, isPositive: true }}
        />
        <StatsCard
          title="Departments"
          value={mockDashboardStats.totalDepartments}
          icon={Building}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Recent Leave Requests</CardTitle>
            <CardDescription>Latest employee leave requests</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {mockLeaveRequests.slice(0, 5).map((request) => (
                <div key={request.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div>
                    <p className="font-medium">{request.userName}</p>
                    <p className="text-sm text-gray-500">{request.type} • {request.days} days</p>
                  </div>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                    request.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                    request.status === 'approved' ? 'bg-green-100 text-green-800' :
                    'bg-red-100 text-red-800'
                  }`}>
                    {request.status}
                  </span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Recent Announcements</CardTitle>
            <CardDescription>Company updates and news</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentAnnouncements.map((announcement) => (
                <div key={announcement.id} className="p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="font-medium">{announcement.title}</h4>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      announcement.priority === 'high' ? 'bg-red-100 text-red-800' :
                      announcement.priority === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                      'bg-green-100 text-green-800'
                    }`}>
                      {announcement.priority}
                    </span>
                  </div>
                  <p className="text-sm text-gray-600 line-clamp-2">{announcement.content}</p>
                  <p className="text-xs text-gray-500 mt-2">By {announcement.author}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );

  const renderEmployeeDashboard = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <StatsCard
          title="Leave Balance"
          value="19 days"
          description="Remaining this year"
          icon={Calendar}
        />
        <StatsCard
          title="Pending Requests"
          value={userLeaveRequests.filter(r => r.status === 'pending').length}
          icon={Calendar}
        />
        <StatsCard
          title="Approved Requests"
          value={userLeaveRequests.filter(r => r.status === 'approved').length}
          icon={CheckCircle}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>My Leave Requests</CardTitle>
            <CardDescription>Your recent leave requests</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {userLeaveRequests.length > 0 ? userLeaveRequests.map((request) => (
                <div key={request.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div>
                    <p className="font-medium capitalize">{request.type}</p>
                    <p className="text-sm text-gray-500">{request.startDate} to {request.endDate}</p>
                  </div>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                    request.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                    request.status === 'approved' ? 'bg-green-100 text-green-800' :
                    'bg-red-100 text-red-800'
                  }`}>
                    {request.status}
                  </span>
                </div>
              )) : (
                <p className="text-gray-500 text-center py-4">No leave requests found</p>
              )}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Company Announcements</CardTitle>
            <CardDescription>Latest updates</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentAnnouncements.map((announcement) => (
                <div key={announcement.id} className="p-3 bg-gray-50 rounded-lg">
                  <h4 className="font-medium mb-1">{announcement.title}</h4>
                  <p className="text-sm text-gray-600 line-clamp-2">{announcement.content}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">
          Welcome back, {user.firstName}!
        </h1>
        <p className="text-gray-600">Here's what's happening in your organization today.</p>
      </div>
      
      {user.role === 'admin' || user.role === 'hr' ? renderAdminDashboard() : renderEmployeeDashboard()}
    </div>
  );
}
