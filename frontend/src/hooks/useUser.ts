import { useState, useEffect } from 'react';
import { userService } from '../lib/api';

export interface UserProfile {
  id?: number;
  username: string;
  email: string;
  phone?: string;
  active?: boolean;
  roles?: string[]; // ['STUDENT', 'ADMIN']
  createdAt?: string;
}

interface LoginResponse {
  token: string;
  email: string;
  username: string;
  roles: string[];
}

export function useUser() {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const token = localStorage.getItem('authToken');
    if (token) {
      fetchProfile();
    } else {
      setLoading(false);
    }
  }, []);

  const fetchProfile = async () => {
    try {
      setLoading(true);
      const data = await userService.getProfile() as UserProfile;
      setUser(data);
      setError(null);
      // Store email and roles in localStorage for quick access
      if (data.email) {
        localStorage.setItem('userEmail', data.email);
      }
      if (data.username) {
        localStorage.setItem('username', data.username);
      }
      if (data.roles) {
        localStorage.setItem('userRoles', JSON.stringify(data.roles));
      }
    } catch (err: any) {
      setError(err.message || 'Failed to fetch profile');
      console.error('Error fetching profile:', err);
      // If unauthorized, clear token
      if (err.message?.includes('401')) {
        localStorage.removeItem('authToken');
        localStorage.removeItem('userEmail');
        localStorage.removeItem('userRoles');
        localStorage.removeItem('username');
        setUser(null);
      }
    } finally {
      setLoading(false);
    }
  };

  const login = async (email: string, password: string) => {
    try {
      const response = await userService.login(email, password) as LoginResponse;
      if (response.token) {
        localStorage.setItem('authToken', response.token);
        localStorage.setItem('userEmail', response.email);
        localStorage.setItem('username', response.username);
        localStorage.setItem('userRoles', JSON.stringify(response.roles));
        
        setUser({
          email: response.email,
          username: response.username,
          roles: response.roles,
          active: true
        });
        return response;
      }
    } catch (err: any) {
      setError(err.message || 'Login failed');
      throw err;
    }
  };

  const logout = () => {
    localStorage.removeItem('authToken');
    localStorage.removeItem('userEmail');
    localStorage.removeItem('userRoles');
    localStorage.removeItem('username');
    setUser(null);
  };

  const updateProfile = async (profileData: { username?: string; phone?: string }) => {
    try {
      await userService.updateProfile(profileData);
      await fetchProfile();
    } catch (err: any) {
      setError(err.message || 'Failed to update profile');
      throw err;
    }
  };

  return {
    user,
    loading,
    error,
    login,
    logout,
    updateProfile,
    fetchProfile,
  };
}
