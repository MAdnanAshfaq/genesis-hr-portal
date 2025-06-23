
import React, { createContext, useContext, useState, useEffect } from 'react';
import { User as SupabaseUser } from '@supabase/supabase-js';
import { supabase } from '@/lib/supabase';
import { User, AuthState, LoginCredentials, CreateUserData } from '@/types/auth';

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
    isLoading: true,
  });

  useEffect(() => {
    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session) {
        fetchUserProfile(session.user.id);
      } else {
        setAuthState(prev => ({ ...prev, isLoading: false }));
      }
    });

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (session) {
          await fetchUserProfile(session.user.id);
        } else {
          setAuthState({
            user: null,
            isAuthenticated: false,
            isLoading: false,
          });
        }
      }
    );

    return () => subscription.unsubscribe();
  }, []);

  const fetchUserProfile = async (userId: string) => {
    try {
      const { data, error } = await supabase
        .from('users')
        .select('*')
        .eq('id', userId)
        .single();

      if (error) throw error;

      const user: User = {
        id: data.id,
        username: data.username,
        password: '', // Don't expose password
        firstName: data.first_name,
        lastName: data.last_name,
        role: data.role,
        department: data.department,
        joinDate: data.join_date,
        createdBy: data.created_by,
        createdDate: data.created_at,
      };

      setAuthState({
        user,
        isAuthenticated: true,
        isLoading: false,
      });
    } catch (error) {
      console.error('Error fetching user profile:', error);
      setAuthState(prev => ({ ...prev, isLoading: false }));
    }
  };

  const login = async (credentials: LoginCredentials): Promise<boolean> => {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: credentials.username,
        password: credentials.password,
      });

      if (error) throw error;
      return true;
    } catch (error) {
      console.error('Login error:', error);
      return false;
    }
  };

  const logout = async () => {
    await supabase.auth.signOut();
  };

  const createUser = async (userData: CreateUserData): Promise<boolean> => {
    try {
      // First create auth user
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: userData.username,
        password: userData.password,
      });

      if (authError) throw authError;

      if (authData.user) {
        // Then create user profile
        const { error: profileError } = await supabase
          .from('users')
          .insert({
            id: authData.user.id,
            username: userData.username,
            first_name: userData.firstName,
            last_name: userData.lastName,
            role: userData.role,
            department: userData.department,
            join_date: new Date().toISOString().split('T')[0],
            created_by: authState.user?.username || 'admin',
          });

        if (profileError) throw profileError;
      }

      return true;
    } catch (error) {
      console.error('Create user error:', error);
      return false;
    }
  };

  const updateUser = async (userId: string, userData: Partial<User>): Promise<boolean> => {
    try {
      const { error } = await supabase
        .from('users')
        .update({
          username: userData.username,
          first_name: userData.firstName,
          last_name: userData.lastName,
          role: userData.role,
          department: userData.department,
        })
        .eq('id', userId);

      if (error) throw error;
      return true;
    } catch (error) {
      console.error('Update user error:', error);
      return false;
    }
  };

  const deleteUser = async (userId: string): Promise<boolean> => {
    try {
      const { error } = await supabase
        .from('users')
        .delete()
        .eq('id', userId);

      if (error) throw error;
      return true;
    } catch (error) {
      console.error('Delete user error:', error);
      return false;
    }
  };

  const getAllUsers = async (): Promise<User[]> => {
    try {
      const { data, error } = await supabase
        .from('users')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;

      return data.map(user => ({
        id: user.id,
        username: user.username,
        password: '',
        firstName: user.first_name,
        lastName: user.last_name,
        role: user.role,
        department: user.department,
        joinDate: user.join_date,
        createdBy: user.created_by,
        createdDate: user.created_at,
      }));
    } catch (error) {
      console.error('Get all users error:', error);
      return [];
    }
  };

  const getUsersByDepartment = async (department: string): Promise<User[]> => {
    try {
      const { data, error } = await supabase
        .from('users')
        .select('*')
        .eq('department', department)
        .order('created_at', { ascending: false });

      if (error) throw error;

      return data.map(user => ({
        id: user.id,
        username: user.username,
        password: '',
        firstName: user.first_name,
        lastName: user.last_name,
        role: user.role,
        department: user.department,
        joinDate: user.join_date,
        createdBy: user.created_by,
        createdDate: user.created_at,
      }));
    } catch (error) {
      console.error('Get users by department error:', error);
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
