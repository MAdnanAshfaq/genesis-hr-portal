
import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Header } from './Layout/Header';
import { Sidebar } from './Layout/Sidebar';
import { DashboardView } from './Dashboard/DashboardView';
import { LeaveRequestsList } from './LeaveRequests/LeaveRequestsList';
import { UserManagementView } from './UserManagement/UserManagementView';
import { AnnouncementsView } from './Announcements/AnnouncementsView';
import { ProfileView } from './Profile/ProfileView';

export function MainApp() {
  const { user, isLoading } = useAuth();
  const [activeTab, setActiveTab] = useState('dashboard');

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
      case 'dashboard':
        return <DashboardView />;
      case 'leave-requests':
        return <LeaveRequestsList />;
      case 'users':
        return <UserManagementView />;
      case 'announcements':
        return <AnnouncementsView />;
      case 'team':
        return <UserManagementView />; // Managers see user management as team management
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
    </div>
  );
}
