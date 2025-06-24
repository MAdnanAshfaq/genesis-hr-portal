
import React, { createContext, useContext, useState, useEffect } from 'react';
import { User, AuthState, LoginCredentials, CreateUserData } from '@/types/auth';

// Demo users data
const demoUsers: User[] = [
  {
    id: '1',
    username: 'admin',
    password: 'Genesis@123',
    firstName: 'Admin',
    lastName: 'User',
    role: 'admin',
    department: 'admin',
    joinDate: '2024-01-01',
    createdBy: 'system',
    createdDate: '2024-01-01',
  },
  {
    id: '2',
    username: 'hr_sarah',
    password: 'Genesis@123',
    firstName: 'Sarah',
    lastName: 'Johnson',
    role: 'hr',
    department: 'hr',
    joinDate: '2024-01-01',
    createdBy: 'admin',
    createdDate: '2024-01-01',
  },
  {
    id: '3',
    username: 'manager_sales',
    password: 'Genesis@123',
    firstName: 'Mike',
    lastName: 'Thompson',
    role: 'manager',
    department: 'sales',
    joinDate: '2024-01-01',
    createdBy: 'admin',
    createdDate: '2024-01-01',
  },
  {
    id: '4',
    username: 'manager_production',
    password: 'Genesis@123',
    firstName: 'Lisa',
    lastName: 'Chen',
    role: 'manager',
    department: 'production',
    joinDate: '2024-01-01',
    createdBy: 'admin',
    createdDate: '2024-01-01',
  },
  {
    id: '5',
    username: 'emp_sales_1',
    password: 'Genesis@123',
    firstName: 'John',
    lastName: 'Smith',
    role: 'employee',
    department: 'sales',
    joinDate: '2024-01-01',
    createdBy: 'manager_sales',
    createdDate: '2024-01-01',
  },
  {
    id: '6',
    username: 'emp_production_1',
    password: 'Genesis@123',
    firstName: 'Emma',
    lastName: 'Davis',
    role: 'employee',
    department: 'production',
    joinDate: '2024-01-01',
    createdBy: 'manager_production',
    createdDate: '2024-01-01',
  },
];

interface AuthContextType extends AuthState {
  login: (credentials: LoginCredentials) => Promise<boolean>;
  logout: () => void;
  createUser: (userData: CreateUserData) => Promise<boolean>;
  updateUser: (userId: string, userData: Partial<User>) => Promise<boolean>;
  deleteUser: (userId: string) => Promise<boolean>;
  getAllUsers: () => Promise<User[]>;
  getUsersByDepartment: (department: string) => Promise<User[]>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [authState, setAuthState] = useState<AuthState>({
    user: null,
    isAuthenticated: false,
    isLoading: false,
  });

  useEffect(() => {
    // Check for stored session
    const storedUser = localStorage.getItem('currentUser');
    if (storedUser) {
      try {
        const user = JSON.parse(storedUser);
        setAuthState({
          user,
          isAuthenticated: true,
          isLoading: false,
        });
      } catch (error) {
        console.error('Error parsing stored user:', error);
        localStorage.removeItem('currentUser');
      }
    }
  }, []);

  const login = async (credentials: LoginCredentials): Promise<boolean> => {
    console.log('Attempting login with:', credentials.username);
    
    // Find user in demo data
    const user = demoUsers.find(
      u => u.username === credentials.username && u.password === credentials.password
    );

    if (user) {
      const userWithoutPassword = { ...user, password: '' };
      setAuthState({
        user: userWithoutPassword,
        isAuthenticated: true,
        isLoading: false,
      });
      
      // Store session
      localStorage.setItem('currentUser', JSON.stringify(userWithoutPassword));
      
      console.log('Login successful for:', user.username);
      return true;
    }

    console.log('Login failed - invalid credentials');
    return false;
  };

  const logout = async () => {
    setAuthState({
      user: null,
      isAuthenticated: false,
      isLoading: false,
    });
    localStorage.removeItem('currentUser');
  };

  const createUser = async (userData: CreateUserData): Promise<boolean> => {
    // In a real app, this would create a user in the database
    console.log('Create user called:', userData);
    return true;
  };

  const updateUser = async (userId: string, userData: Partial<User>): Promise<boolean> => {
    console.log('Update user called:', userId, userData);
    return true;
  };

  const deleteUser = async (userId: string): Promise<boolean> => {
    console.log('Delete user called:', userId);
    return true;
  };

  const getAllUsers = async (): Promise<User[]> => {
    return demoUsers.map(user => ({ ...user, password: '' }));
  };

  const getUsersByDepartment = async (department: string): Promise<User[]> => {
    return demoUsers
      .filter(user => user.department === department)
      .map(user => ({ ...user, password: '' }));
  };

  return (
    <AuthContext.Provider value={{ 
      ...authState, 
      login, 
      logout, 
      createUser, 
      updateUser, 
      deleteUser, 
      getAllUsers, 
      getUsersByDepartment 
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
