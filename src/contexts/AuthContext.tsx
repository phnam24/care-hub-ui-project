
import React, { createContext, useContext, useReducer, useEffect } from 'react';

export type UserRole = 'patient' | 'doctor' | 'admin';

export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: UserRole;
  avatar?: string;
}

interface AuthState {
  user: User | null;
  token: string | null;
  isLoading: boolean;
  isAuthenticated: boolean;
}

type AuthAction = 
  | { type: 'LOGIN_START' }
  | { type: 'LOGIN_SUCCESS'; payload: { user: User; token: string } }
  | { type: 'LOGIN_FAILURE' }
  | { type: 'LOGOUT' }
  | { type: 'SET_LOADING'; payload: boolean };

const initialState: AuthState = {
  user: null,
  token: null,
  isLoading: true,
  isAuthenticated: false,
};

const authReducer = (state: AuthState, action: AuthAction): AuthState => {
  switch (action.type) {
    case 'LOGIN_START':
      return { ...state, isLoading: true };
    case 'LOGIN_SUCCESS':
      return {
        ...state,
        user: action.payload.user,
        token: action.payload.token,
        isLoading: false,
        isAuthenticated: true,
      };
    case 'LOGIN_FAILURE':
      return { ...state, isLoading: false, isAuthenticated: false };
    case 'LOGOUT':
      return { ...initialState, isLoading: false };
    case 'SET_LOADING':
      return { ...state, isLoading: action.payload };
    default:
      return state;
  }
};

interface AuthContextType extends AuthState {
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(authReducer, initialState);

  useEffect(() => {
    // Check for existing token on mount
    const token = localStorage.getItem('healthcareToken');
    const userStr = localStorage.getItem('healthcareUser');
    
    if (token && userStr) {
      try {
        const user = JSON.parse(userStr);
        dispatch({ type: 'LOGIN_SUCCESS', payload: { user, token } });
      } catch (error) {
        localStorage.removeItem('healthcareToken');
        localStorage.removeItem('healthcareUser');
      }
    }
    dispatch({ type: 'SET_LOADING', payload: false });
  }, []);

  const login = async (email: string, password: string) => {
    dispatch({ type: 'LOGIN_START' });
    
    try {
      // Mock API call - replace with actual API Gateway call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Mock user data based on email for demo
      let mockUser: User;
      if (email.includes('doctor')) {
        mockUser = {
          id: '2',
          email,
          firstName: 'Dr. Sarah',
          lastName: 'Johnson',
          role: 'doctor',
        };
      } else if (email.includes('admin')) {
        mockUser = {
          id: '3',
          email,
          firstName: 'Admin',
          lastName: 'User',
          role: 'admin',
        };
      } else {
        mockUser = {
          id: '1',
          email,
          firstName: 'John',
          lastName: 'Doe',
          role: 'patient',
        };
      }
      
      const mockToken = 'mock-jwt-token-' + Date.now();
      
      localStorage.setItem('healthcareToken', mockToken);
      localStorage.setItem('healthcareUser', JSON.stringify(mockUser));
      
      dispatch({ type: 'LOGIN_SUCCESS', payload: { user: mockUser, token: mockToken } });
    } catch (error) {
      dispatch({ type: 'LOGIN_FAILURE' });
      throw error;
    }
  };

  const logout = () => {
    localStorage.removeItem('healthcareToken');
    localStorage.removeItem('healthcareUser');
    dispatch({ type: 'LOGOUT' });
  };

  return (
    <AuthContext.Provider value={{ ...state, login, logout }}>
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
