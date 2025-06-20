
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { User, Calendar, Building } from 'lucide-react';

export function ProfileView() {
  const { user } = useAuth();

  if (!user) return null;

  const initials = `${user.firstName[0]}${user.lastName[0]}`;

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Profile</h1>
        <p className="text-gray-600">Manage your personal information and preferences</p>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center gap-4">
            <Avatar className="h-20 w-20">
              <AvatarFallback className="bg-primary text-white text-2xl">
                {initials}
              </AvatarFallback>
            </Avatar>
            <div>
              <CardTitle className="text-2xl">{user.firstName} {user.lastName}</CardTitle>
              <CardDescription className="text-lg capitalize flex items-center gap-2">
                <Badge variant="outline" className="capitalize">
                  {user.role}
                </Badge>
                • {user.department}
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <User className="h-5 w-5 text-gray-500" />
                <div>
                  <p className="text-sm text-gray-500">Username</p>
                  <p className="font-medium">@{user.username}</p>
                </div>
              </div>
              
              <div className="flex items-center gap-3">
                <Building className="h-5 w-5 text-gray-500" />
                <div>
                  <p className="text-sm text-gray-500">Department</p>
                  <p className="font-medium capitalize">{user.department}</p>
                </div>
              </div>
            </div>
            
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <Calendar className="h-5 w-5 text-gray-500" />
                <div>
                  <p className="text-sm text-gray-500">Join Date</p>
                  <p className="font-medium">{user.joinDate}</p>
                </div>
              </div>
              
              <div className="flex items-center gap-3">
                <User className="h-5 w-5 text-gray-500" />
                <div>
                  <p className="text-sm text-gray-500">Employee ID</p>
                  <p className="font-medium">EMP-{user.id.padStart(4, '0')}</p>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Leave Balance</CardTitle>
            <CardDescription>Your current leave balance for 2024</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-gray-600">Total Annual Leave</span>
                <span className="font-medium">25 days</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Used</span>
                <span className="font-medium">6 days</span>
              </div>
              <div className="flex justify-between border-t pt-3">
                <span className="font-medium">Remaining</span>
                <span className="font-bold text-primary">19 days</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Quick Stats</CardTitle>
            <CardDescription>Your activity summary</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-gray-600">Leave Requests</span>
                <span className="font-medium">3 total</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Pending Approvals</span>
                <span className="font-medium">1 request</span>
              </div>
              <div className="flex justify-between border-t pt-3">
                <span className="text-gray-600">Time with Company</span>
                <span className="font-medium">
                  {new Date().getFullYear() - new Date(user.joinDate).getFullYear()} years
                </span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
