
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
import { Logo } from '@/components/ui/logo';

export function AdminConsole() {
  const { getAllUsers, deleteUser } = useAuth();
  const { toast } = useToast();
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [editingUser, setEditingUser] = useState<any>(null);
  const [users, setUsers] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const loadUsers = async () => {
    setIsLoading(true);
    try {
      const allUsers = await getAllUsers();
      setUsers(allUsers);
    } catch (error) {
      console.error('Error loading users:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadUsers();
  }, []);

  const handleUserCreated = async () => {
    await loadUsers(); // Refresh the list
    setShowCreateForm(false);
    toast({
      title: "Success",
      description: "User created successfully and list updated.",
    });
  };

  const handleUserUpdated = async () => {
    await loadUsers(); // Refresh the list
    setEditingUser(null);
    toast({
      title: "Success", 
      description: "User updated successfully.",
    });
  };

  const handleDeleteUser = async (userId: string) => {
    try {
      await deleteUser(userId);
      await loadUsers(); // Refresh the list
      toast({
        title: "User Deleted",
        description: "User has been successfully deleted.",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete user.",
        variant: "destructive",
      });
    }
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
      <div className="dashboard-bg p-6">
        <CreateUserForm
          onSuccess={handleUserCreated}
          onCancel={() => setShowCreateForm(false)}
        />
      </div>
    );
  }

  if (editingUser) {
    return (
      <div className="dashboard-bg p-6">
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
      <div className="dashboard-bg p-6 flex items-center justify-center min-h-screen">
        <div className="text-center glass-card p-8">
          <Logo size="lg" className="mx-auto mb-4 animate-pulse" />
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-gray-300">Loading users...</p>
        </div>
      </div>
    );
  }

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
                Admin Console
              </h1>
              <p className="text-gray-400">Manage users, roles, and system access</p>
            </div>
          </div>
          <Button 
            onClick={() => setShowCreateForm(true)} 
            className="flex items-center gap-2 ripple-effect"
          >
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
    </div>
  );
}
