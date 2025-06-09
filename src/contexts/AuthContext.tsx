
import React, { createContext, useContext, useReducer, useEffect } from 'react';
import apiService from '@/services/apiService';
export type UserRole = 'patient' | 'doctor' | 'admin';


export interface User {
  id: number;
  username: string;
  email: string;
  first_name: string;
  last_name: string;
  role: 'patient' | 'doctor' | 'admin';
  phone_number: string | null;
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
  login: (username: string, password: string) => Promise<void>;
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

const login = async (username: string, password: string) => {
  dispatch({ type: 'LOGIN_START' });

  try {
    // Step 1: Authenticate and get tokens
    const loginResponse = await apiService.login(username, password);
    const { access, refresh } = loginResponse.data;

    // Step 2: Store tokens
    localStorage.setItem('healthcareToken', access);
    localStorage.setItem('healthcareRefreshToken', refresh);

    // Step 3: Fetch user profile using access token
    const profileResponse = await apiService.getProfile();
    const user = profileResponse.data;

    // Step 4: Store user info
    localStorage.setItem('healthcareUser', JSON.stringify(user));

    // Step 5: Dispatch success
    dispatch({ type: 'LOGIN_SUCCESS', payload: { user, token: access } });
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
