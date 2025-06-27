
import { useAuth } from '@/contexts/AuthContext';
import { StatsCard } from './StatsCard';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { mockDashboardStats, mockLeaveRequests, mockAnnouncements } from '@/data/mockData';
import { Users, Calendar, CheckCircle, Building } from 'lucide-react';
import { useEffect, useState } from 'react';

export function DashboardView() {
  const { user } = useAuth();
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  if (!user) return null;

  const userLeaveRequests = mockLeaveRequests.filter(req => req.userId === user.id);
  const recentAnnouncements = mockAnnouncements.slice(0, 3);

  const renderAdminDashboard = () => (
    <div className="space-y-8 relative">
      {/* Floating particles background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-2 h-2 bg-primary/20 rounded-full animate-float"></div>
        <div className="absolute top-40 right-20 w-1 h-1 bg-info/30 rounded-full animate-float-delayed"></div>
        <div className="absolute bottom-40 left-1/4 w-1.5 h-1.5 bg-primary/10 rounded-full animate-float"></div>
        <div className="absolute bottom-20 right-1/3 w-2 h-2 bg-info/20 rounded-full animate-float-delayed"></div>
      </div>

      <div className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 transition-all duration-1000 ${
        isVisible ? 'opacity-100 transform translate-y-0' : 'opacity-0 transform translate-y-10'
      }`}>
        <div className="animate-fade-in" style={{ animationDelay: '0ms' }}>
          <StatsCard
            title="Total Employees"
            value={mockDashboardStats.totalEmployees}
            icon={Users}
            trend={{ value: 8.2, isPositive: true }}
            colorScheme="blue"
          />
        </div>
        <div className="animate-fade-in" style={{ animationDelay: '100ms' }}>
          <StatsCard
            title="Pending Leaves"
            value={mockDashboardStats.pendingLeaves}
            icon={Calendar}
            description="Awaiting approval"
            colorScheme="amber"
          />
        </div>
        <div className="animate-fade-in" style={{ animationDelay: '200ms' }}>
          <StatsCard
            title="Approved Leaves"
            value={mockDashboardStats.approvedLeaves}
            icon={CheckCircle}
            trend={{ value: 12.5, isPositive: true }}
            colorScheme="green"
          />
        </div>
        <div className="animate-fade-in" style={{ animationDelay: '300ms' }}>
          <StatsCard
            title="Departments"
            value={mockDashboardStats.totalDepartments}
            icon={Building}
            colorScheme="purple"
          />
        </div>
      </div>

      <div className={`grid grid-cols-1 lg:grid-cols-2 gap-8 transition-all duration-1000 delay-300 ${
        isVisible ? 'opacity-100 transform translate-y-0' : 'opacity-0 transform translate-y-10'
      }`}>
        <Card className="dashboard-card group hover:shadow-xl transition-all duration-500 hover:scale-[1.02] backdrop-blur-md bg-white/80 border-white/20 shadow-lg">
          <CardHeader className="bg-gradient-to-r from-primary/10 to-info/10 rounded-t-lg">
            <CardTitle className="bg-gradient-to-r from-primary to-info bg-clip-text text-transparent">
              Recent Leave Requests
            </CardTitle>
            <CardDescription className="text-gray-600">Latest employee leave requests</CardDescription>
          </CardHeader>
          <CardContent className="pt-6">
            <div className="space-y-4">
              {mockLeaveRequests.slice(0, 5).map((request, index) => (
                <div 
                  key={request.id} 
                  className="animated-table-row flex items-center justify-between p-4 bg-gradient-to-r from-gray-50/50 to-white/50 rounded-lg hover:shadow-md transition-all duration-300 group cursor-pointer"
                  style={{ animationDelay: `${index * 50}ms` }}
                >
                  <div className="space-y-1">
                    <p className="font-medium text-gray-900 group-hover:text-primary transition-colors">
                      {request.userName}
                    </p>
                    <p className="text-sm text-gray-500">{request.type} • {request.days} days</p>
                  </div>
                  <span className={`animated-badge px-3 py-1 rounded-full text-xs font-medium transition-all duration-300 ${
                    request.status === 'pending' ? 'bg-gradient-to-r from-amber-100 to-yellow-100 text-amber-800 shadow-amber-200/50' :
                    request.status === 'approved' ? 'bg-gradient-to-r from-green-100 to-emerald-100 text-green-800 shadow-green-200/50' :
                    'bg-gradient-to-r from-red-100 to-pink-100 text-red-800 shadow-red-200/50'
                  } shadow-lg hover:shadow-xl`}>
                    {request.status}
                  </span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card className="dashboard-card group hover:shadow-xl transition-all duration-500 hover:scale-[1.02] backdrop-blur-md bg-white/80 border-white/20 shadow-lg">
          <CardHeader className="bg-gradient-to-r from-info/10 to-primary/10 rounded-t-lg">
            <CardTitle className="bg-gradient-to-r from-info to-primary bg-clip-text text-transparent">
              Recent Announcements
            </CardTitle>
            <CardDescription className="text-gray-600">Company updates and news</CardDescription>
          </CardHeader>
          <CardContent className="pt-6">
            <div className="space-y-4">
              {recentAnnouncements.map((announcement, index) => (
                <div 
                  key={announcement.id} 
                  className="animated-table-row p-4 bg-gradient-to-r from-gray-50/50 to-white/50 rounded-lg hover:shadow-md transition-all duration-300 cursor-pointer group"
                  style={{ animationDelay: `${index * 50}ms` }}
                >
                  <div className="flex items-center justify-between mb-3">
                    <h4 className="font-medium text-gray-900 group-hover:text-primary transition-colors">
                      {announcement.title}
                    </h4>
                    <span className={`animated-badge px-2 py-1 rounded-full text-xs font-medium transition-all duration-300 ${
                      announcement.priority === 'high' ? 'bg-gradient-to-r from-red-100 to-pink-100 text-red-800 shadow-red-200/50' :
                      announcement.priority === 'medium' ? 'bg-gradient-to-r from-amber-100 to-yellow-100 text-amber-800 shadow-amber-200/50' :
                      'bg-gradient-to-r from-green-100 to-emerald-100 text-green-800 shadow-green-200/50'
                    } shadow-lg hover:shadow-xl`}>
                      {announcement.priority}
                    </span>
                  </div>
                  <p className="text-sm text-gray-600 line-clamp-2 mb-2">{announcement.content}</p>
                  <p className="text-xs text-gray-500">By {announcement.author}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );

  const renderEmployeeDashboard = () => (
    <div className="space-y-8 relative">
      {/* Floating particles background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-16 left-8 w-2 h-2 bg-primary/20 rounded-full animate-float"></div>
        <div className="absolute top-32 right-16 w-1 h-1 bg-info/30 rounded-full animate-float-delayed"></div>
        <div className="absolute bottom-32 left-1/4 w-1.5 h-1.5 bg-primary/10 rounded-full animate-float"></div>
      </div>

      <div className={`grid grid-cols-1 md:grid-cols-3 gap-6 transition-all duration-1000 ${
        isVisible ? 'opacity-100 transform translate-y-0' : 'opacity-0 transform translate-y-10'
      }`}>
        <div className="animate-fade-in" style={{ animationDelay: '0ms' }}>
          <StatsCard
            title="Leave Balance"
            value="19 days"
            description="Remaining this year"
            icon={Calendar}
            colorScheme="green"
          />
        </div>
        <div className="animate-fade-in" style={{ animationDelay: '100ms' }}>
          <StatsCard
            title="Pending Requests"
            value={userLeaveRequests.filter(r => r.status === 'pending').length}
            icon={Calendar}
            colorScheme="amber"
          />
        </div>
        <div className="animate-fade-in" style={{ animationDelay: '200ms' }}>
          <StatsCard
            title="Approved Requests"
            value={userLeaveRequests.filter(r => r.status === 'approved').length}
            icon={CheckCircle}
            colorScheme="blue"
          />
        </div>
      </div>

      <div className={`grid grid-cols-1 lg:grid-cols-2 gap-8 transition-all duration-1000 delay-300 ${
        isVisible ? 'opacity-100 transform translate-y-0' : 'opacity-0 transform translate-y-10'
      }`}>
        <Card className="dashboard-card group hover:shadow-xl transition-all duration-500 hover:scale-[1.02] backdrop-blur-md bg-white/80 border-white/20 shadow-lg">
          <CardHeader className="bg-gradient-to-r from-primary/10 to-info/10 rounded-t-lg">
            <CardTitle className="bg-gradient-to-r from-primary to-info bg-clip-text text-transparent">
              My Leave Requests
            </CardTitle>
            <CardDescription className="text-gray-600">Your recent leave requests</CardDescription>
          </CardHeader>
          <CardContent className="pt-6">
            <div className="space-y-4">
              {userLeaveRequests.length > 0 ? userLeaveRequests.map((request, index) => (
                <div 
                  key={request.id} 
                  className="animated-table-row flex items-center justify-between p-4 bg-gradient-to-r from-gray-50/50 to-white/50 rounded-lg hover:shadow-md transition-all duration-300 group cursor-pointer"
                  style={{ animationDelay: `${index * 50}ms` }}
                >
                  <div className="space-y-1">
                    <p className="font-medium capitalize text-gray-900 group-hover:text-primary transition-colors">
                      {request.type}
                    </p>
                    <p className="text-sm text-gray-500">{request.startDate} to {request.endDate}</p>
                  </div>
                  <span className={`animated-badge px-3 py-1 rounded-full text-xs font-medium transition-all duration-300 ${
                    request.status === 'pending' ? 'bg-gradient-to-r from-amber-100 to-yellow-100 text-amber-800 shadow-amber-200/50' :
                    request.status === 'approved' ? 'bg-gradient-to-r from-green-100 to-emerald-100 text-green-800 shadow-green-200/50' :
                    'bg-gradient-to-r from-red-100 to-pink-100 text-red-800 shadow-red-200/50'
                  } shadow-lg hover:shadow-xl`}>
                    {request.status}
                  </span>
                </div>
              )) : (
                <div className="text-center py-8">
                  <div className="animate-pulse">
                    <Calendar className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                    <p className="text-gray-500">No leave requests found</p>
                  </div>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        <Card className="dashboard-card group hover:shadow-xl transition-all duration-500 hover:scale-[1.02] backdrop-blur-md bg-white/80 border-white/20 shadow-lg">
          <CardHeader className="bg-gradient-to-r from-info/10 to-primary/10 rounded-t-lg">
            <CardTitle className="bg-gradient-to-r from-info to-primary bg-clip-text text-transparent">
              Company Announcements
            </CardTitle>
            <CardDescription className="text-gray-600">Latest updates</CardDescription>
          </CardHeader>
          <CardContent className="pt-6">
            <div className="space-y-4">
              {recentAnnouncements.map((announcement, index) => (
                <div 
                  key={announcement.id} 
                  className="animated-table-row p-4 bg-gradient-to-r from-gray-50/50 to-white/50 rounded-lg hover:shadow-md transition-all duration-300 cursor-pointer group"
                  style={{ animationDelay: `${index * 50}ms` }}
                >
                  <h4 className="font-medium mb-2 text-gray-900 group-hover:text-primary transition-colors">
                    {announcement.title}
                  </h4>
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
    <div className="min-h-screen bg-gradient-to-br from-primary/5 via-background to-info/5 relative overflow-hidden">
      {/* Animated background gradients */}
      <div className="absolute inset-0 bg-gradient-to-r from-primary/3 to-info/3 animate-pulse"></div>
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(59,130,246,0.05),transparent_50%)]"></div>
      
      <div className="relative z-10 p-6">
        <div className={`mb-8 transition-all duration-1000 ${
          isVisible ? 'opacity-100 transform translate-y-0' : 'opacity-0 transform translate-y-5'
        }`}>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-primary via-info to-primary bg-clip-text text-transparent mb-2">
            Welcome back, {user.firstName}! ✨
          </h1>
          <p className="text-gray-600 text-lg">Here's what's happening in your organization today.</p>
        </div>
        
        {user.role === 'admin' || user.role === 'hr' ? renderAdminDashboard() : renderEmployeeDashboard()}
      </div>
    </div>
  );
}
