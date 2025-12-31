import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { UserProfile } from '../hooks/useUser';
import { userService } from '../lib/api';

interface LoginResponse {
  id: number;
  token: string;
  email: string;
  username: string;
  roles: string[];
}

interface AuthContextType {
  user: UserProfile | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  isAuthenticated: boolean;
  hasRole: (role: string) => boolean;
  isStudent: boolean;
  isAdmin: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  // Check if user is already logged in on mount
  useEffect(() => {
    const token = localStorage.getItem('authToken');
    if (token) {
      // Try to restore user from localStorage first, then fetch fresh profile
      const storedId = localStorage.getItem('userId');
      const storedEmail = localStorage.getItem('userEmail');
      const storedRoles = localStorage.getItem('userRoles');
      const storedUsername = localStorage.getItem('username');
      
      if (storedEmail && storedRoles) {
        setUser({
          id: storedId ? parseInt(storedId) : undefined,
          email: storedEmail,
          username: storedUsername || '',
          roles: JSON.parse(storedRoles),
          active: true
        });
      }
      fetchProfile();
    } else {
      setLoading(false);
    }
  }, []);

  const fetchProfile = async () => {
    try {
      const data = await userService.getProfile() as UserProfile;
      setUser(data);
      // Update localStorage with fresh data
      if (data.id) {
        localStorage.setItem('userId', data.id.toString());
      }
      if (data.email) {
        localStorage.setItem('userEmail', data.email);
      }
      if (data.username) {
        localStorage.setItem('username', data.username);
      }
      if (data.roles) {
        localStorage.setItem('userRoles', JSON.stringify(data.roles));
      }
    } catch (err) {
      console.error('Failed to fetch profile:', err);
      localStorage.removeItem('authToken');
      localStorage.removeItem('userId');
      localStorage.removeItem('userEmail');
      localStorage.removeItem('userRoles');
      localStorage.removeItem('username');
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  const login = async (email: string, password: string) => {
    const response = await userService.login(email, password) as LoginResponse;
    if (response.token) {
      // Store token and user data from login response
      localStorage.setItem('authToken', response.token);
      localStorage.setItem('userId', response.id.toString());
      localStorage.setItem('userEmail', response.email);
      localStorage.setItem('username', response.username);
      localStorage.setItem('userRoles', JSON.stringify(response.roles));
      
      // Set user immediately from login response
      setUser({
        id: response.id,
        email: response.email,
        username: response.username,
        roles: response.roles,
        active: true
      });
    }
  };

  const logout = () => {
    localStorage.removeItem('authToken');
    localStorage.removeItem('userId');
    localStorage.removeItem('userEmail');
    localStorage.removeItem('userRoles');
    localStorage.removeItem('username');
    setUser(null);
  };

  const hasRole = (role: string): boolean => {
    if (!user || !user.roles) return false;
    return user.roles.includes(role);
  };

  const value = {
    user,
    loading,
    login,
    logout,
    isAuthenticated: !!user,
    hasRole,
    isStudent: hasRole('STUDENT'),
    isAdmin: hasRole('ADMIN'),
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
