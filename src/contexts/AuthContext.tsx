
import React, { createContext, useContext, useState, useEffect } from 'react';
import { User, AuthState, LoginCredentials, CreateUserData } from '@/types/auth';
import { ApiService } from '@/services/api';

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
    
    try {
      // Find user in database
      const user = await ApiService.getUserByUsername(credentials.username);

      if (user && user.password === credentials.password) {
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

      console.log('Login failed - invalid credentials or user not found');
      return false;
    } catch (error) {
      console.error('Login error:', error);
      return false;
    }
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
    try {
      const currentUser = authState.user;
      if (!currentUser) return false;
      
      return await ApiService.createUser(userData, currentUser.username);
    } catch (error) {
      console.error('Error creating user:', error);
      return false;
    }
  };

  const updateUser = async (userId: string, userData: Partial<User>): Promise<boolean> => {
    try {
      return await ApiService.updateUser(userId, userData);
    } catch (error) {
      console.error('Error updating user:', error);
      return false;
    }
  };

  const deleteUser = async (userId: string): Promise<boolean> => {
    try {
      return await ApiService.deleteUser(userId);
    } catch (error) {
      console.error('Error deleting user:', error);
      return false;
    }
  };

  const getAllUsers = async (): Promise<User[]> => {
    try {
      return await ApiService.getAllUsers();
    } catch (error) {
      console.error('Error fetching users:', error);
      return [];
    }
  };

  const getUsersByDepartment = async (department: string): Promise<User[]> => {
    try {
      return await ApiService.getUsersByDepartment(department);
    } catch (error) {
      console.error('Error fetching users by department:', error);
      return [];
    }
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
