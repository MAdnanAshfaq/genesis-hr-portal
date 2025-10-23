
import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { LogOut, Bell, Shield, Users, Building2, User } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { LogoutAnimation } from '@/components/Auth/LogoutAnimation';

export function Header() {
  const { user, logout } = useAuth();
  const [showLogoutAnimation, setShowLogoutAnimation] = useState(false);

  if (!user) return null;

  const initials = `${user.firstName[0]}${user.lastName[0]}`;
  
  const getRoleIcon = () => {
    switch (user.role) {
      case 'admin': return Shield;
      case 'hr': return Users;
      case 'manager': return Building2;
      default: return User;
    }
  };

  const RoleIcon = getRoleIcon();

  const getPortalTitle = () => {
    switch (user.role) {
      case 'admin': return 'Admin Console';
      case 'hr': return 'HR Portal';
      case 'manager': return `${user.department.charAt(0).toUpperCase() + user.department.slice(1)} Manager Portal`;
      case 'employee': return `Employee Portal - ${user.department.charAt(0).toUpperCase() + user.department.slice(1)}`;
      default: return 'HR Portal';
    }
  };

  const handleLogout = () => {
    setShowLogoutAnimation(true);
  };

  const handleLogoutComplete = () => {
    setShowLogoutAnimation(false);
    logout();
  };

  return (
    <>
      <header className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">G</span>
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900">HR Portal</h1>
                <p className="text-sm text-gray-600 flex items-center gap-1">
                  <RoleIcon className="h-3 w-3" />
                  {getPortalTitle()}
                </p>
              </div>
            </div>
          </div>

          <div className="flex items-center space-x-4">
            <Button variant="ghost" size="sm">
              <Bell className="h-4 w-4" />
            </Button>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="flex items-center space-x-2 p-2">
                  <Avatar className="h-8 w-8">
                    <AvatarFallback className="bg-primary text-white text-sm">
                      {initials}
                    </AvatarFallback>
                  </Avatar>
                  <div className="text-left">
                    <p className="text-sm font-medium">{user.firstName} {user.lastName}</p>
                    <p className="text-xs text-gray-500 capitalize flex items-center gap-1">
                      <RoleIcon className="h-3 w-3" />
                      {user.role}
                      {user.department !== 'admin' && user.department !== 'hr' && ` • ${user.department}`}
                    </p>
                  </div>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <div className="px-2 py-1.5">
                  <p className="text-sm font-medium">{user.firstName} {user.lastName}</p>
                  <p className="text-xs text-gray-500">@{user.username}</p>
                  <p className="text-xs text-gray-500 capitalize">
                    {user.role} • {user.department}
                  </p>
                </div>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleLogout} className="text-red-600">
                  <LogOut className="mr-2 h-4 w-4" />
                  Sign out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </header>

      {showLogoutAnimation && (
        <LogoutAnimation onComplete={handleLogoutComplete} />
      )}
    </>
  );
}
