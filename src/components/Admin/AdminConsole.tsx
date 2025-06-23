
import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { CreateUserForm } from './CreateUserForm';
import { EditUserForm } from './EditUserForm';
import { UserStatsCards } from './UserStatsCards';
import { UsersList } from './UsersList';
import { useToast } from '@/hooks/use-toast';
import { User } from '@/types/auth';
import { Plus } from 'lucide-react';

export function AdminConsole() {
  const { getAllUsers, deleteUser } = useAuth();
  const { toast } = useToast();
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [editingUser, setEditingUser] = useState<any>(null);
  const [users, setUsers] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const loadUsers = async () => {
    setIsLoading(true);
    const allUsers = await getAllUsers();
    setUsers(allUsers);
    setIsLoading(false);
  };

  useEffect(() => {
    loadUsers();
  }, []);

  const handleUserCreated = async () => {
    await loadUsers();
    setShowCreateForm(false);
  };

  const handleUserUpdated = async () => {
    await loadUsers();
    setEditingUser(null);
  };

  const handleDeleteUser = async (userId: string) => {
    await deleteUser(userId);
    await loadUsers();
    toast({
      title: "User Deleted",
      description: "User has been successfully deleted.",
    });
  };

  const copyCredentials = (username: string) => {
    const credentials = `Username: ${username}\nPassword: Genesis@123sword`;
    navigator.clipboard.writeText(credentials);
    toast({
      title: "Credentials Copied",
      description: "Login credentials have been copied to clipboard.",
    });
  };

  if (showCreateForm) {
    return (
      <div className="p-6">
        <CreateUserForm
          onSuccess={handleUserCreated}
          onCancel={() => setShowCreateForm(false)}
        />
      </div>
    );
  }

  if (editingUser) {
    return (
      <div className="p-6">
        <EditUserForm
          user={editingUser}
          onSuccess={handleUserUpdated}
          onCancel={() => setEditingUser(null)}
        />
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="p-6 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
          <p className="mt-2 text-gray-600">Loading users...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Admin Console</h1>
          <p className="text-gray-600">Manage users, roles, and system access</p>
        </div>
        <Button onClick={() => setShowCreateForm(true)} className="flex items-center gap-2">
          <Plus className="h-4 w-4" />
          Create User
        </Button>
      </div>

      <UserStatsCards users={users} />
      
      <UsersList
        users={users}
        onEditUser={setEditingUser}
        onDeleteUser={handleDeleteUser}
        onCopyCredentials={copyCredentials}
      />
    </div>
  );
}
