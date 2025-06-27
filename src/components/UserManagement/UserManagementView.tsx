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
    email: 'admin@genesishr.com',
    firstName: 'Admin',
    lastName: 'User',
    role: 'admin',
    department: 'IT',
    joinDate: '2020-01-01',
    status: 'active',
  },
  {
    id: '2',
    email: 'hr@genesishr.com',
    firstName: 'Sarah',
    lastName: 'Johnson',
    role: 'hr',
    department: 'Human Resources',
    joinDate: '2021-03-15',
    status: 'active',
  },
  {
    id: '3',
    email: 'manager@genesishr.com',
    firstName: 'Mike',
    lastName: 'Wilson',
    role: 'manager',
    department: 'Engineering',
    joinDate: '2020-06-01',
    status: 'active',
  },
  {
    id: '4',
    email: 'employee@genesishr.com',
    firstName: 'Emily',
    lastName: 'Davis',
    role: 'employee',
    department: 'Marketing',
    joinDate: '2022-01-10',
    status: 'active',
  },
  {
    id: '5',
    email: 'john.doe@genesishr.com',
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
      case 'admin': return 'bg-red-100 text-red-800 border-red-200';
      case 'hr': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'manager': return 'bg-purple-100 text-purple-800 border-purple-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  return (
    <div className="dashboard-bg">
      <div className="floating-particles">
        {[...Array(8)].map((_, i) => (
          <div
            key={i}
            className="particle floating-particle"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 5}s`,
            }}
          />
        ))}
      </div>

      <div className="relative z-10 p-6 space-y-6">
        <div className="flex items-center justify-between glass-card p-6">
          <div className="flex items-center gap-4">
            <Logo size="lg" />
            <div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-primary to-blue-400 bg-clip-text text-transparent">
                User Management
              </h1>
              <p className="text-gray-400">Manage employees and their access levels</p>
            </div>
          </div>
          <Button className="flex items-center gap-2 ripple-effect">
            <Plus className="h-4 w-4" />
            Add User
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {users.map((user, index) => {
            const initials = `${user.firstName[0]}${user.lastName[0]}`;
            
            return (
              <Card key={user.id} className="glass-card calm-card" style={{ animationDelay: `${index * 50}ms` }}>
                <CardHeader className="pb-3">
                  <div className="flex items-center gap-3">
                    <Avatar className="h-12 w-12 ring-2 ring-primary/20">
                      <AvatarFallback className="bg-gradient-to-br from-primary to-blue-500 text-white font-semibold">
                        {initials}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <CardTitle className="text-lg text-white number-counter">
                        {user.firstName} {user.lastName}
                      </CardTitle>
                      <CardDescription className="flex items-center gap-1 text-gray-400">
                        <Mail className="h-3 w-3" />
                        {user.email}
                      </CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-400">Role</span>
                    <Badge className={`${getRoleBadgeVariant(user.role)} capitalize backdrop-blur-sm`}>
                      {user.role}
                    </Badge>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-400">Department</span>
                    <span className="text-sm font-medium text-gray-300">{user.department}</span>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-400">Join Date</span>
                    <div className="flex items-center gap-1 text-sm text-gray-300">
                      <Calendar className="h-3 w-3" />
                      {user.joinDate}
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-400">Status</span>
                    <Badge className={user.status === 'active' ? 'bg-green-100 text-green-800 border-green-200' : 'bg-gray-100 text-gray-800 border-gray-200'}>
                      {user.status}
                    </Badge>
                  </div>
                  
                  <div className="pt-3 border-t border-white/10">
                    <Button variant="outline" size="sm" className="w-full glass-card text-white hover:bg-white/10">
                      Edit User
                    </Button>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        <Card className="glass-card">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-white">
              <Users className="h-5 w-5" />
              Department Summary
            </CardTitle>
            <CardDescription className="text-gray-400">Employee distribution across departments</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {['Engineering', 'Marketing', 'Sales', 'Human Resources'].map((dept, index) => {
                const count = users.filter(u => u.department === dept).length;
                return (
                  <div key={dept} className="text-center p-4 glass-card gentle-float" style={{ animationDelay: `${index * 200}ms` }}>
                    <div className="text-2xl font-bold text-primary number-counter">{count}</div>
                    <div className="text-sm text-gray-400">{dept}</div>
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
