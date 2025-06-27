import { useAuth } from '@/contexts/AuthContext';
import { StatsCard } from './StatsCard';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { mockDashboardStats, mockLeaveRequests, mockAnnouncements } from '@/data/mockData';
import { Users, Calendar, CheckCircle, Building, Sparkles } from 'lucide-react';
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
      {/* Subtle floating particles background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-1 h-1 bg-blue-400/30 rounded-full animate-gentle-float"></div>
        <div className="absolute top-40 right-20 w-2 h-2 bg-purple-400/20 rounded-full animate-gentle-float" style={{ animationDelay: '1s' }}></div>
        <div className="absolute bottom-40 left-1/4 w-1.5 h-1.5 bg-blue-300/25 rounded-full animate-gentle-float" style={{ animationDelay: '2s' }}></div>
      </div>

      <div className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 transition-all duration-700 ${
        isVisible ? 'opacity-100 transform translate-y-0' : 'opacity-0 transform translate-y-10'
      }`}>
        <div className="animate-fade-in-up stagger-1">
          <StatsCard
            title="Total Employees"
            value={mockDashboardStats.totalEmployees}
            icon={Users}
            trend={{ value: 8.2, isPositive: true }}
            colorScheme="blue"
          />
        </div>
        <div className="animate-fade-in-up stagger-2">
          <StatsCard
            title="Pending Leaves"
            value={mockDashboardStats.pendingLeaves}
            icon={Calendar}
            description="Awaiting approval"
            colorScheme="amber"
          />
        </div>
        <div className="animate-fade-in-up stagger-3">
          <StatsCard
            title="Approved Leaves"
            value={mockDashboardStats.approvedLeaves}
            icon={CheckCircle}
            trend={{ value: 12.5, isPositive: true }}
            colorScheme="green"
          />
        </div>
        <div className="animate-fade-in-up stagger-4">
          <StatsCard
            title="Departments"
            value={mockDashboardStats.totalDepartments}
            icon={Building}
            colorScheme="purple"
          />
        </div>
      </div>

      <div className={`grid grid-cols-1 lg:grid-cols-2 gap-8 transition-all duration-700 delay-300 ${
        isVisible ? 'opacity-100 transform translate-y-0' : 'opacity-0 transform translate-y-10'
      }`}>
        <Card className="professional-card glass-card border-white/20 bg-white/5">
          <CardHeader className="bg-gradient-to-r from-blue-500/10 to-purple-500/10 rounded-t-2xl">
            <CardTitle className="bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent flex items-center gap-2">
              <Calendar className="h-5 w-5 text-blue-400" />
              Recent Leave Requests
            </CardTitle>
            <CardDescription className="text-white/70">Latest employee leave requests</CardDescription>
          </CardHeader>
          <CardContent className="pt-6">
            <div className="space-y-4">
              {mockLeaveRequests.slice(0, 5).map((request, index) => (
                <div 
                  key={request.id} 
                  className="table-row flex items-center justify-between p-4 glass-card bg-white/5 rounded-xl border-white/10"
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  <div className="space-y-1">
                    <p className="font-medium text-white">
                      {request.userName}
                    </p>
                    <p className="text-sm text-white/60">{request.type} • {request.days} days</p>
                  </div>
                  <span className={`status-badge px-3 py-1.5 rounded-full text-xs font-medium ${
                    request.status === 'pending' ? 'bg-amber-500/20 text-amber-300 border border-amber-400/30' :
                    request.status === 'approved' ? 'bg-green-500/20 text-green-300 border border-green-400/30' :
                    'bg-red-500/20 text-red-300 border border-red-400/30'
                  }`}>
                    {request.status}
                  </span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card className="professional-card glass-card border-white/20 bg-white/5">
          <CardHeader className="bg-gradient-to-r from-purple-500/10 to-blue-500/10 rounded-t-2xl">
            <CardTitle className="bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent flex items-center gap-2">
              <Sparkles className="h-5 w-5 text-purple-400" />
              Recent Announcements
            </CardTitle>
            <CardDescription className="text-white/70">Company updates and news</CardDescription>
          </CardHeader>
          <CardContent className="pt-6">
            <div className="space-y-4">
              {recentAnnouncements.map((announcement, index) => (
                <div 
                  key={announcement.id} 
                  className="table-row p-4 glass-card bg-white/5 rounded-xl border-white/10"
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  <div className="flex items-center justify-between mb-3">
                    <h4 className="font-medium text-white">
                      {announcement.title}
                    </h4>
                    <span className={`status-badge px-2 py-1 rounded-full text-xs font-medium ${
                      announcement.priority === 'high' ? 'bg-red-500/20 text-red-300 border border-red-400/30' :
                      announcement.priority === 'medium' ? 'bg-amber-500/20 text-amber-300 border border-amber-400/30' :
                      'bg-green-500/20 text-green-300 border border-green-400/30'
                    }`}>
                      {announcement.priority}
                    </span>
                  </div>
                  <p className="text-sm text-white/60 line-clamp-2 mb-2">{announcement.content}</p>
                  <p className="text-xs text-white/50">By {announcement.author}</p>
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
      {/* Subtle floating particles background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-16 left-8 w-1 h-1 bg-blue-400/30 rounded-full animate-gentle-float"></div>
        <div className="absolute top-32 right-16 w-2 h-2 bg-purple-400/20 rounded-full animate-gentle-float" style={{ animationDelay: '1s' }}></div>
      </div>

      <div className={`grid grid-cols-1 md:grid-cols-3 gap-6 transition-all duration-700 ${
        isVisible ? 'opacity-100 transform translate-y-0' : 'opacity-0 transform translate-y-10'
      }`}>
        <div className="animate-fade-in-up stagger-1">
          <StatsCard
            title="Leave Balance"
            value="19 days"
            description="Remaining this year"
            icon={Calendar}
            colorScheme="green"
          />
        </div>
        <div className="animate-fade-in-up stagger-2">
          <StatsCard
            title="Pending Requests"
            value={userLeaveRequests.filter(r => r.status === 'pending').length}
            icon={Calendar}
            colorScheme="amber"
          />
        </div>
        <div className="animate-fade-in-up stagger-3">
          <StatsCard
            title="Approved Requests"
            value={userLeaveRequests.filter(r => r.status === 'approved').length}
            icon={CheckCircle}
            colorScheme="blue"
          />
        </div>
      </div>

      <div className={`grid grid-cols-1 lg:grid-cols-2 gap-8 transition-all duration-700 delay-300 ${
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
    <div className="dashboard-bg">
      <div className="relative z-10 p-6">
        <div className={`mb-8 transition-all duration-700 ${
          isVisible ? 'opacity-100 transform translate-y-0' : 'opacity-0 transform translate-y-5'
        }`}>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-white via-blue-200 to-purple-200 bg-clip-text text-transparent mb-3 flex items-center gap-3">
            <Sparkles className="h-8 w-8 text-yellow-400 animate-smooth-pulse" />
            Welcome back, {user.firstName}!
          </h1>
          <p className="text-white/70 text-lg">Here's what's happening in your organization today.</p>
        </div>
        
        {user.role === 'admin' || user.role === 'hr' ? renderAdminDashboard() : renderEmployeeDashboard()}
      </div>
    </div>
  );
}
