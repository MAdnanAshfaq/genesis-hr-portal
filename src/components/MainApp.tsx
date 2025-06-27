
import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Header } from './Layout/Header';
import { Sidebar } from './Layout/Sidebar';
import { DashboardView } from './Dashboard/DashboardView';
import { LeaveRequestsList } from './LeaveRequests/LeaveRequestsList';
import { UserManagementView } from './UserManagement/UserManagementView';
import { AnnouncementsView } from './Announcements/AnnouncementsView';
import { ProfileView } from './Profile/ProfileView';
import { AdminConsole } from './Admin/AdminConsole';
import { Toaster } from '@/components/ui/toaster';

export function MainApp() {
  const { user, isLoading } = useAuth();
  const [activeTab, setActiveTab] = useState(() => {
    // Set default tab based on user role
    if (!user) return 'dashboard';
    
    switch (user.role) {
      case 'admin':
        return 'admin-console';
      case 'hr':
        return 'hr-dashboard';
      case 'manager':
        return user.department === 'sales' ? 'manager-dashboard-sales' : 'manager-dashboard-production';
      case 'employee':
        return 'employee-dashboard';
      default:
        return 'dashboard';
    }
  });

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary/5 via-background to-info/5 relative overflow-hidden">
        {/* Animated loading background */}
        <div className="absolute inset-0 bg-gradient-to-r from-primary/3 to-info/3 animate-pulse"></div>
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(59,130,246,0.05),transparent_50%)]"></div>
        
        {/* Floating particles */}
        <div className="absolute top-20 left-10 w-2 h-2 bg-primary/20 rounded-full animate-float"></div>
        <div className="absolute top-40 right-20 w-1 h-1 bg-info/30 rounded-full animate-float-delayed"></div>
        <div className="absolute bottom-40 left-1/4 w-1.5 h-1.5 bg-primary/10 rounded-full animate-float"></div>
        
        <div className="text-center relative z-10">
          <div className="w-20 h-20 bg-gradient-to-br from-primary to-info rounded-2xl flex items-center justify-center mx-auto mb-6 
            animate-pulse shadow-2xl backdrop-blur-md">
            <span className="text-white font-bold text-3xl">G</span>
          </div>
          <div className="space-y-3">
            <div className="h-4 bg-gradient-to-r from-primary/20 to-info/20 rounded-full w-32 mx-auto animate-pulse"></div>
            <p className="text-gray-600 text-lg">Loading your workspace...</p>
            <div className="flex space-x-1 justify-center">
              <div className="w-2 h-2 bg-primary/60 rounded-full animate-bounce"></div>
              <div className="w-2 h-2 bg-info/60 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
              <div className="w-2 h-2 bg-primary/60 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!user) {
    return null; // This will be handled by the auth check in Index
  }

  const renderContent = () => {
    const contentMap = {
      'admin-console': user.role === 'admin' ? <AdminConsole /> : <DashboardView />,
      'hr-dashboard': user.role === 'hr' ? <DashboardView /> : <DashboardView />,
      'manager-dashboard-sales': user.role === 'manager' && user.department === 'sales' ? <DashboardView /> : <DashboardView />,
      'manager-dashboard-production': user.role === 'manager' && user.department === 'production' ? <DashboardView /> : <DashboardView />,
      'employee-dashboard': user.role === 'employee' ? <DashboardView /> : <DashboardView />,
      'leave-requests': <LeaveRequestsList />,
      'users': <UserManagementView />,
      'announcements': <AnnouncementsView />,
      'profile': <ProfileView />
    };

    return contentMap[activeTab as keyof typeof contentMap] || <DashboardView />;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 via-background to-info/5 relative overflow-hidden">
      {/* Animated background layers */}
      <div className="absolute inset-0 bg-gradient-to-r from-primary/3 to-info/3 animate-pulse"></div>
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(59,130,246,0.05),transparent_50%)]"></div>
      
      {/* Global floating particles */}
      <div className="absolute top-20 left-10 w-2 h-2 bg-primary/20 rounded-full animate-float"></div>
      <div className="absolute top-60 right-32 w-1 h-1 bg-info/30 rounded-full animate-float-delayed"></div>
      <div className="absolute bottom-40 left-1/4 w-1.5 h-1.5 bg-primary/10 rounded-full animate-float"></div>
      <div className="absolute bottom-20 right-1/3 w-2 h-2 bg-info/20 rounded-full animate-float-delayed"></div>
      
      <div className="relative z-10">
        <Header />
        <div className="flex h-[calc(100vh-80px)]">
          <Sidebar activeTab={activeTab} onTabChange={setActiveTab} />
          <main className="flex-1 overflow-auto transition-all duration-500 ease-in-out">
            <div className="animate-fade-in">
              {renderContent()}
            </div>
          </main>
        </div>
      </div>
      <Toaster />
    </div>
  );
}
