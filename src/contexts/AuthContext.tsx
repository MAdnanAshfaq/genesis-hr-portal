
import React, { createContext, useContext, useState, useEffect } from 'react';
import { User, AuthState, LoginCredentials } from '@/types/auth';

interface AuthContextType extends AuthState {
  login: (credentials: LoginCredentials) => Promise<boolean>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Mock users for demo
const mockUsers: User[] = [
  {
    id: '1',
    email: 'admin@genesishr.com',
    firstName: 'Admin',
    lastName: 'User',
    role: 'admin',
    department: 'IT',
    joinDate: '2020-01-01',
  },
  {
    id: '2',
    email: 'hr@genesishr.com',
    firstName: 'Sarah',
    lastName: 'Johnson',
    role: 'hr',
    department: 'Human Resources',
    joinDate: '2021-03-15',
  },
  {
    id: '3',
    email: 'manager@genesishr.com',
    firstName: 'Mike',
    lastName: 'Wilson',
    role: 'manager',
    department: 'Engineering',
    joinDate: '2020-06-01',
  },
  {
    id: '4',
    email: 'employee@genesishr.com',
    firstName: 'Emily',
    lastName: 'Davis',
    role: 'employee',
    department: 'Marketing',
    joinDate: '2022-01-10',
  },
];

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [authState, setAuthState] = useState<AuthState>({
    user: null,
    isAuthenticated: false,
    isLoading: true,
  });

  useEffect(() => {
    // Check for stored session on mount
    const storedUser = localStorage.getItem('genesishr_user');
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

  const login = async (credentials: LoginCredentials): Promise<boolean> => {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    const user = mockUsers.find(u => u.email === credentials.email);
    
    if (user && credentials.password === 'Genesis@123sword') {
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

  return (
    <AuthContext.Provider value={{ ...authState, login, logout }}>
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
