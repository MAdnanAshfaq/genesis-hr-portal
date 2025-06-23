
import { Card, CardContent } from '@/components/ui/card';
import { Users, Building2, Shield } from 'lucide-react';
import { User } from '@/types/auth';

interface UserStatsCardsProps {
  users: User[];
}

export function UserStatsCards({ users }: UserStatsCardsProps) {
  const nonAdminUsers = users.filter(user => user.role !== 'admin');

  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
      <Card>
        <CardContent className="p-4">
          <div className="flex items-center gap-3">
            <Users className="h-8 w-8 text-blue-600" />
            <div>
              <p className="text-2xl font-bold">{nonAdminUsers.length}</p>
              <p className="text-sm text-gray-600">Total Users</p>
            </div>
          </div>
        </CardContent>
      </Card>
      
      <Card>
        <CardContent className="p-4">
          <div className="flex items-center gap-3">
            <Building2 className="h-8 w-8 text-green-600" />
            <div>
              <p className="text-2xl font-bold">
                {nonAdminUsers.filter(u => u.department === 'sales').length}
              </p>
              <p className="text-sm text-gray-600">Sales Team</p>
            </div>
          </div>
        </CardContent>
      </Card>
      
      <Card>
        <CardContent className="p-4">
          <div className="flex items-center gap-3">
            <Building2 className="h-8 w-8 text-purple-600" />
            <div>
              <p className="text-2xl font-bold">
                {nonAdminUsers.filter(u => u.department === 'production').length}
              </p>
              <p className="text-sm text-gray-600">Production Team</p>
            </div>
          </div>
        </CardContent>
      </Card>
      
      <Card>
        <CardContent className="p-4">
          <div className="flex items-center gap-3">
            <Shield className="h-8 w-8 text-orange-600" />
            <div>
              <p className="text-2xl font-bold">
                {nonAdminUsers.filter(u => u.role === 'manager').length}
              </p>
              <p className="text-sm text-gray-600">Managers</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
