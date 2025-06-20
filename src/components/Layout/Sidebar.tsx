
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { 
  LayoutDashboard, 
  Calendar, 
  Users, 
  FileText, 
  User,
  Shield,
  Settings,
  Building2
} from 'lucide-react';

interface SidebarProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
}

export function Sidebar({ activeTab, onTabChange }: SidebarProps) {
  const { user } = useAuth();

  if (!user) return null;

  const getMenuItems = () => {
    const items = [];

    // Role-specific dashboards
    switch (user.role) {
      case 'admin':
        items.push(
          { id: 'admin-console', label: 'Admin Console', icon: Shield, description: 'Manage users and system' }
        );
        break;
      
      case 'hr':
        items.push(
          { id: 'hr-dashboard', label: 'HR Dashboard', icon: LayoutDashboard, description: 'HR overview' },
          { id: 'leave-requests', label: 'All Leave Requests', icon: Calendar, description: 'Manage all leaves' },
          { id: 'users', label: 'Employee Records', icon: Users, description: 'View all employees' },
          { id: 'announcements', label: 'Announcements', icon: FileText, description: 'Manage announcements' }
        );
        break;
      
      case 'manager':
        const dashboardId = user.department === 'sales' ? 'manager-dashboard-sales' : 'manager-dashboard-production';
        const teamLabel = user.department === 'sales' ? 'Sales Team' : 'Production Team';
        
        items.push(
          { id: dashboardId, label: `${user.department.charAt(0).toUpperCase() + user.department.slice(1)} Dashboard`, icon: LayoutDashboard, description: 'Manager overview' },
          { id: 'leave-requests', label: 'Team Leave Requests', icon: Calendar, description: 'Approve team leaves' },
          { id: 'users', label: teamLabel, icon: Building2, description: 'Manage your team' }
        );
        break;
      
      case 'employee':
        items.push(
          { id: 'employee-dashboard', label: 'My Dashboard', icon: LayoutDashboard, description: 'Personal overview' },
          { id: 'leave-requests', label: 'My Leave Requests', icon: Calendar, description: 'Submit and track leaves' }
        );
        break;
    }

    // Common items for all roles (except admin)
    if (user.role !== 'admin') {
      items.push(
        { id: 'profile', label: 'Profile', icon: User, description: 'Personal information' }
      );
    }

    return items;
  };

  const menuItems = getMenuItems();

  return (
    <aside className="w-64 bg-white border-r border-gray-200 h-full">
      <div className="p-4 border-b border-gray-200">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center">
            <span className="text-white font-bold">
              {user.role === 'admin' ? 'A' : 
               user.role === 'hr' ? 'H' : 
               user.role === 'manager' ? 'M' : 'E'}
            </span>
          </div>
          <div>
            <p className="font-medium text-gray-900">{user.firstName} {user.lastName}</p>
            <p className="text-sm text-gray-600 capitalize">
              {user.role} {user.department !== 'admin' && user.department !== 'hr' && `• ${user.department}`}
            </p>
          </div>
        </div>
      </div>
      
      <nav className="p-4 space-y-2">
        {menuItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          
          return (
            <Button
              key={item.id}
              variant={isActive ? 'default' : 'ghost'}
              className={cn(
                'w-full justify-start h-auto p-3',
                isActive && 'bg-primary text-white'
              )}
              onClick={() => onTabChange(item.id)}
            >
              <div className="flex items-center gap-3 w-full">
                <Icon className="h-5 w-5 flex-shrink-0" />
                <div className="text-left">
                  <div className="font-medium">{item.label}</div>
                  {item.description && (
                    <div className={cn(
                      "text-xs mt-1",
                      isActive ? "text-white/80" : "text-gray-500"
                    )}>
                      {item.description}
                    </div>
                  )}
                </div>
              </div>
            </Button>
          );
        })}
      </nav>
    </aside>
  );
}
