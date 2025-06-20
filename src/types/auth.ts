
export interface User {
  id: string;
  username: string;
  password: string;
  firstName: string;
  lastName: string;
  role: 'admin' | 'hr' | 'manager' | 'employee';
  department: 'sales' | 'production' | 'hr' | 'admin';
  joinDate: string;
  avatar?: string;
  createdBy?: string;
  createdDate?: string;
}

export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
}

export interface LoginCredentials {
  username: string;
  password: string;
}

export interface CreateUserData {
  username: string;
  password: string;
  firstName: string;
  lastName: string;
  role: 'hr' | 'manager' | 'employee';
  department: 'sales' | 'production' | 'hr';
}
