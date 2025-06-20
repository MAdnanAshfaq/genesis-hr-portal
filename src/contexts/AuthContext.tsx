
import React, { createContext, useContext, useState, useEffect } from 'react';
import { User, AuthState, LoginCredentials, CreateUserData } from '@/types/auth';

interface AuthContextType extends AuthState {
  login: (credentials: LoginCredentials) => Promise<boolean>;
  logout: () => void;
  createUser: (userData: CreateUserData) => Promise<boolean>;
  updateUser: (userId: string, userData: Partial<User>) => Promise<boolean>;
  deleteUser: (userId: string) => Promise<boolean>;
  getAllUsers: () => User[];
  getUsersByDepartment: (department: string) => User[];
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Mock users with new structure
const initialMockUsers: User[] = [
  {
    id: '1',
    username: 'admin',
    password: 'Genesis@123sword',
    firstName: 'System',
    lastName: 'Administrator',
    role: 'admin',
    department: 'admin',
    joinDate: '2020-01-01',
  },
  {
    id: '2',
    username: 'hr_sarah',
    password: 'Genesis@123sword',
    firstName: 'Sarah',
    lastName: 'Johnson',
    role: 'hr',
    department: 'hr',
    joinDate: '2021-03-15',
    createdBy: 'admin',
    createdDate: '2021-03-15',
  },
  {
    id: '3',
    username: 'manager_sales',
    password: 'Genesis@123sword',
    firstName: 'Mike',
    lastName: 'Wilson',
    role: 'manager',
    department: 'sales',
    joinDate: '2020-06-01',
    createdBy: 'admin',
    createdDate: '2020-06-01',
  },
  {
    id: '4',
    username: 'manager_production',
    password: 'Genesis@123sword',
    firstName: 'Lisa',
    lastName: 'Chen',
    role: 'manager',
    department: 'production',
    joinDate: '2020-08-15',
    createdBy: 'admin',
    createdDate: '2020-08-15',
  },
  {
    id: '5',
    username: 'emp_sales_1',
    password: 'Genesis@123sword',
    firstName: 'Emily',
    lastName: 'Davis',
    role: 'employee',
    department: 'sales',
    joinDate: '2022-01-10',
    createdBy: 'admin',
    createdDate: '2022-01-10',
  },
  {
    id: '6',
    username: 'emp_production_1',
    password: 'Genesis@123sword',
    firstName: 'John',
    lastName: 'Smith',
    role: 'employee',
    department: 'production',
    joinDate: '2022-03-20',
    createdBy: 'admin',
    createdDate: '2022-03-20',
  },
];

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [authState, setAuthState] = useState<AuthState>({
    user: null,
    isAuthenticated: false,
    isLoading: true,
  });
  const [users, setUsers] = useState<User[]>(initialMockUsers);

  useEffect(() => {
    // Check for stored session on mount
    const storedUser = localStorage.getItem('genesishr_user');
    const storedUsers = localStorage.getItem('genesishr_users');
    
    if (storedUsers) {
      try {
        const parsedUsers = JSON.parse(storedUsers);
        setUsers(parsedUsers);
      } catch (error) {
        console.error('Error parsing stored users:', error);
      }
    }
    
    if (storedUser) {
      try {
        const user = JSON.parse(storedUser);
        setAuthState({
          user,
          isAuthenticated: true,
          isLoading: false,
        });
      } catch (error) {
        localStorage.removeItem('genesishr_user');
        setAuthState(prev => ({ ...prev, isLoading: false }));
      }
    } else {
      setAuthState(prev => ({ ...prev, isLoading: false }));
    }
  }, []);

  // Save users to localStorage whenever users change
  useEffect(() => {
    localStorage.setItem('genesishr_users', JSON.stringify(users));
  }, [users]);

  const login = async (credentials: LoginCredentials): Promise<boolean> => {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    const user = users.find(u => u.username === credentials.username);
    
    if (user && user.password === credentials.password) {
      localStorage.setItem('genesishr_user', JSON.stringify(user));
      setAuthState({
        user,
        isAuthenticated: true,
        isLoading: false,
      });
      return true;
    }
    
    return false;
  };

  const logout = () => {
    localStorage.removeItem('genesishr_user');
    setAuthState({
      user: null,
      isAuthenticated: false,
      isLoading: false,
    });
  };

  const createUser = async (userData: CreateUserData): Promise<boolean> => {
    // Check if username already exists
    if (users.some(u => u.username === userData.username)) {
      return false;
    }

    const newUser: User = {
      id: String(Date.now()),
      ...userData,
      joinDate: new Date().toISOString().split('T')[0],
      createdBy: authState.user?.username || 'admin',
      createdDate: new Date().toISOString().split('T')[0],
    };

    setUsers(prev => [...prev, newUser]);
    return true;
  };

  const updateUser = async (userId: string, userData: Partial<User>): Promise<boolean> => {
    setUsers(prev => prev.map(user => 
      user.id === userId ? { ...user, ...userData } : user
    ));
    return true;
  };

  const deleteUser = async (userId: string): Promise<boolean> => {
    setUsers(prev => prev.filter(user => user.id !== userId));
    return true;
  };

  const getAllUsers = () => {
    return users;
  };

  const getUsersByDepartment = (department: string) => {
    return users.filter(user => user.department === department);
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
