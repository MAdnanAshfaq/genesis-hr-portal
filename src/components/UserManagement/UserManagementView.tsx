
import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Users, Plus, Mail, Calendar } from 'lucide-react';
import { Logo } from '@/components/ui/logo';

interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: 'admin' | 'hr' | 'manager' | 'employee';
  department: string;
  joinDate: string;
  status: 'active' | 'inactive';
}

const mockUsers: User[] = [
  {
    id: '1',
    email: 'admin@hrportal.com',
    firstName: 'Admin',
    lastName: 'User',
    role: 'admin',
    department: 'IT',
    joinDate: '2020-01-01',
    status: 'active',
  },
  {
    id: '2',
    email: 'hr@hrportal.com',
    firstName: 'Sarah',
    lastName: 'Johnson',
    role: 'hr',
    department: 'Human Resources',
    joinDate: '2021-03-15',
    status: 'active',
  },
  {
    id: '3',
    email: 'manager@hrportal.com',
    firstName: 'Mike',
    lastName: 'Wilson',
    role: 'manager',
    department: 'Engineering',
    joinDate: '2020-06-01',
    status: 'active',
  },
  {
    id: '4',
    email: 'employee@hrportal.com',
    firstName: 'Emily',
    lastName: 'Davis',
    role: 'employee',
    department: 'Marketing',
    joinDate: '2022-01-10',
    status: 'active',
  },
  {
    id: '5',
    email: 'john.doe@hrportal.com',
    firstName: 'John',
    lastName: 'Doe',
    role: 'employee',
    department: 'Sales',
    joinDate: '2023-02-20',
    status: 'active',
  },
];

export function UserManagementView() {
  const [users] = useState<User[]>(mockUsers);

  const getRoleBadgeVariant = (role: string) => {
    switch (role) {
      case 'admin': return 'bg-red-500/20 text-red-300 border border-red-400/30';
      case 'hr': return 'bg-blue-500/20 text-blue-300 border border-blue-400/30';
      case 'manager': return 'bg-purple-500/20 text-purple-300 border border-purple-400/30';
      default: return 'bg-gray-500/20 text-gray-300 border border-gray-400/30';
    }
  };

  return (
    <div className="dashboard-bg">
      {/* Subtle floating particles */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-1 h-1 bg-blue-400/30 rounded-full animate-gentle-float"></div>
        <div className="absolute top-40 right-20 w-2 h-2 bg-purple-400/20 rounded-full animate-gentle-float" style={{ animationDelay: '1s' }}></div>
        <div className="absolute bottom-40 left-1/4 w-1.5 h-1.5 bg-blue-300/25 rounded-full animate-gentle-float" style={{ animationDelay: '2s' }}></div>
      </div>

      <div className="relative z-10 p-6 space-y-6">
        <div className="glass-card p-6 border-white/20 bg-white/5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Logo size="lg" />
              <div>
                <h1 className="text-3xl font-bold bg-gradient-to-r from-white via-blue-200 to-purple-200 bg-clip-text text-transparent">
                  User Management
                </h1>
                <p className="text-white/70">Manage employees and their access levels</p>
              </div>
            </div>
            <Button className="premium-button flex items-center gap-2 bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white border-0">
              <Plus className="h-4 w-4" />
              Add User
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {users.map((user, index) => {
            const initials = `${user.firstName[0]}${user.lastName[0]}`;
            
            return (
              <Card key={user.id} className="professional-card glass-card bg-white/5 border-white/20" 
                style={{ animationDelay: `${index * 100}ms` }}>
                <CardHeader className="pb-4">
                  <div className="flex items-center gap-3">
                    <Avatar className="h-12 w-12 ring-2 ring-blue-400/30">
                      <AvatarFallback className="bg-gradient-to-br from-blue-500 to-purple-500 text-white font-semibold">
                        {initials}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <CardTitle className="text-lg text-white">
                        {user.firstName} {user.lastName}
                      </CardTitle>
                      <CardDescription className="flex items-center gap-1 text-white/60">
                        <Mail className="h-3 w-3" />
                        {user.email}
                      </CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-white/70">Role</span>
                    <Badge className={`${getRoleBadgeVariant(user.role)} capitalize`}>
                      {user.role}
                    </Badge>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-white/70">Department</span>
                    <span className="text-sm font-medium text-white">{user.department}</span>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-white/70">Join Date</span>
                    <div className="flex items-center gap-1 text-sm text-white">
                      <Calendar className="h-3 w-3" />
                      {user.joinDate}
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-white/70">Status</span>
                    <Badge className={user.status === 'active' ? 
                      'bg-green-500/20 text-green-300 border border-green-400/30' : 
                      'bg-gray-500/20 text-gray-300 border border-gray-400/30'}>
                      {user.status}
                    </Badge>
                  </div>
                  
                  <div className="pt-3 border-t border-white/10">
                    <Button variant="outline" size="sm" className="w-full glass-card bg-white/5 text-white hover:bg-white/10 border-white/20">
                      Edit User
                    </Button>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        <Card className="glass-card bg-white/5 border-white/20">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-white">
              <Users className="h-5 w-5" />
              Department Summary
            </CardTitle>
            <CardDescription className="text-white/70">Employee distribution across departments</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {['Engineering', 'Marketing', 'Sales', 'Human Resources'].map((dept, index) => {
                const count = users.filter(u => u.department === dept).length;
                return (
                  <div key={dept} className="text-center p-4 glass-card bg-white/5 border-white/10" 
                    style={{ animationDelay: `${index * 150}ms` }}>
                    <div className="text-2xl font-bold text-blue-300">{count}</div>
                    <div className="text-sm text-white/70">{dept}</div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
