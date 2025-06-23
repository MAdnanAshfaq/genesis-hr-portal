
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Users } from 'lucide-react';
import { User } from '@/types/auth';
import { UserCard } from './UserCard';

interface UsersListProps {
  users: User[];
  onEditUser: (user: User) => void;
  onDeleteUser: (userId: string) => void;
  onCopyCredentials: (username: string) => void;
}

export function UsersList({ users, onEditUser, onDeleteUser, onCopyCredentials }: UsersListProps) {
  const nonAdminUsers = users.filter(user => user.role !== 'admin');

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Users className="h-5 w-5" />
          User Management
        </CardTitle>
        <CardDescription>Manage all system users and their access levels</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid gap-4">
          {nonAdminUsers.map((user) => (
            <UserCard
              key={user.id}
              user={user}
              onEdit={onEditUser}
              onDelete={onDeleteUser}
              onCopyCredentials={onCopyCredentials}
            />
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
