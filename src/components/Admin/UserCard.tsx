
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { User } from '@/types/auth';
import { Edit, Trash2, Copy, Mail, Calendar } from 'lucide-react';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';

interface UserCardProps {
  user: User;
  onEdit: (user: User) => void;
  onDelete: (userId: string) => void;
  onCopyCredentials: (username: string) => void;
}

export function UserCard({ user, onEdit, onDelete, onCopyCredentials }: UserCardProps) {
  const initials = `${user.firstName[0]}${user.lastName[0]}`;

  const getRoleBadgeVariant = (role: string) => {
    switch (role) {
      case 'admin': return 'destructive';
      case 'hr': return 'default';
      case 'manager': return 'secondary';
      default: return 'outline';
    }
  };

  const getDepartmentColor = (department: string) => {
    switch (department) {
      case 'sales': return 'bg-blue-100 text-blue-800';
      case 'production': return 'bg-green-100 text-green-800';
      case 'hr': return 'bg-purple-100 text-purple-800';
      case 'admin': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50">
      <div className="flex items-center gap-4">
        <Avatar className="h-12 w-12">
          <AvatarFallback className="bg-primary text-white">
            {initials}
          </AvatarFallback>
        </Avatar>
        
        <div className="space-y-1">
          <div className="flex items-center gap-3">
            <h3 className="font-medium text-lg">
              {user.firstName} {user.lastName}
            </h3>
            <Badge variant={getRoleBadgeVariant(user.role)} className="capitalize">
              {user.role}
            </Badge>
            <span className={`px-2 py-1 rounded-full text-xs font-medium capitalize ${getDepartmentColor(user.department)}`}>
              {user.department}
            </span>
          </div>
          
          <div className="flex items-center gap-4 text-sm text-gray-600">
            <span className="flex items-center gap-1">
              <Mail className="h-3 w-3" />
              {user.username}
            </span>
            <span className="flex items-center gap-1">
              <Calendar className="h-3 w-3" />
              Joined {user.joinDate}
            </span>
            {user.createdBy && (
              <span>Created by {user.createdBy}</span>
            )}
          </div>
        </div>
      </div>

      <div className="flex items-center gap-2">
        <Button
          variant="outline"
          size="sm"
          onClick={() => onCopyCredentials(user.username)}
          className="flex items-center gap-1"
        >
          <Copy className="h-3 w-3" />
          Copy Credentials
        </Button>
        
        <Button 
          variant="outline" 
          size="sm"
          onClick={() => onEdit(user)}
        >
          <Edit className="h-4 w-4" />
        </Button>
        
        <AlertDialog>
          <AlertDialogTrigger asChild>
            <Button variant="outline" size="sm" className="text-red-600 hover:text-red-700">
              <Trash2 className="h-4 w-4" />
            </Button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Delete User</AlertDialogTitle>
              <AlertDialogDescription>
                Are you sure you want to delete {user.firstName} {user.lastName}? 
                This action cannot be undone.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction 
                onClick={() => onDelete(user.id)}
                className="bg-red-600 hover:bg-red-700"
              >
                Delete
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </div>
  );
}
