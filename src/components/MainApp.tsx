
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
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="w-16 h-16 bg-primary rounded-xl flex items-center justify-center mx-auto mb-4">
            <span className="text-white font-bold text-2xl">G</span>
          </div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return null; // This will be handled by the auth check in Index
  }

  const renderContent = () => {
    switch (activeTab) {
      case 'admin-console':
        return user.role === 'admin' ? <AdminConsole /> : <DashboardView />;
      case 'hr-dashboard':
        return user.role === 'hr' ? <DashboardView /> : <DashboardView />;
      case 'manager-dashboard-sales':
        return user.role === 'manager' && user.department === 'sales' ? <DashboardView /> : <DashboardView />;
      case 'manager-dashboard-production':
        return user.role === 'manager' && user.department === 'production' ? <DashboardView /> : <DashboardView />;
      case 'employee-dashboard':
        return user.role === 'employee' ? <DashboardView /> : <DashboardView />;
      case 'leave-requests':
        return <LeaveRequestsList />;
      case 'users':
        return <UserManagementView />;
      case 'announcements':
        return <AnnouncementsView />;
      case 'profile':
        return <ProfileView />;
      default:
        return <DashboardView />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <div className="flex h-[calc(100vh-80px)]">
        <Sidebar activeTab={activeTab} onTabChange={setActiveTab} />
        <main className="flex-1 overflow-auto bg-gray-50">
          {renderContent()}
        </main>
      </div>
      <Toaster />
    </div>
  );
}
