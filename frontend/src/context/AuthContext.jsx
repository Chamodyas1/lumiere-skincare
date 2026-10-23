import React, { createContext, useContext, useEffect, useState } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';

const AuthContext = createContext(null);

export const useAuth = () => {
  return useContext(AuthContext);
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('token'));
  const [loading, setLoading] = useState(false);

  const API_URL = 'http://localhost:5000/api/users';

  useEffect(() => {
    const savedToken = localStorage.getItem('token');
    const savedUser = localStorage.getItem('user');

    if (savedToken && savedUser) {
      try {
        setToken(savedToken);
        setUser(JSON.parse(savedUser));
      } catch (error) {
        console.error('Saved user error:', error);

        localStorage.removeItem('token');
        localStorage.removeItem('user');

        setToken(null);
        setUser(null);
      }
    }
  }, []);

  // =========================
  // LOGIN
  // =========================
  const login = async (email, password) => {
    try {
      setLoading(true);

      console.log('Login request:', email);

      const response = await axios.post(
        `${API_URL}/login`,
        {
          email,
          password,
        },
        {
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );

      console.log('Login response:', response.data);

      const { token, user } = response.data;

      if (!token || !user) {
        toast.error('Invalid login response from server');

        return {
          success: false,
          error: 'Invalid login response',
        };
      }

      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(user));

      setToken(token);
      setUser(user);

      return {
        success: true,
        user,
        token,
      };

    } catch (error) {
      console.error('LOGIN ERROR:', error);

      console.log('Status:', error.response?.status);
      console.log('Server response:', error.response?.data);

      const message =
        error.response?.data?.message ||
        error.message ||
        'Login failed';

      toast.error(message);

      return {
        success: false,
        error: message,
      };

    } finally {
      setLoading(false);
    }
  };

  // =========================
  // REGISTER
  // =========================
  const register = async (name, email, password) => {
    try {
      setLoading(true);

      const response = await axios.post(
        `${API_URL}/register`,
        {
          name,
          email,
          password,
        },
        {
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );

      console.log('Register response:', response.data);

      const { token, user } = response.data;

      if (!token || !user) {
        toast.error('Invalid registration response');

        return {
          success: false,
          error: 'Invalid registration response',
        };
      }

      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(user));

      setToken(token);
      setUser(user);

      return {
        success: true,
        user,
        token,
      };

    } catch (error) {
      console.error('REGISTER ERROR:', error);

      console.log('Status:', error.response?.status);
      console.log('Server response:', error.response?.data);

      const message =
        error.response?.data?.message ||
        error.message ||
        'Registration failed';

      toast.error(message);

      return {
        success: false,
        error: message,
      };

    } finally {
      setLoading(false);
    }
  };

  // =========================
  // LOGOUT
  // =========================
  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');

    setToken(null);
    setUser(null);

    toast.success('Logged out successfully');
  };

  // =========================
  // UPDATE PROFILE
  // =========================
  const updateProfile = async (userData) => {
    try {
      setLoading(true);

      const response = await axios.put(
        `${API_URL}/profile/${user.id}`,
        userData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const updatedUser = response.data.user;

      localStorage.setItem(
        'user',
        JSON.stringify(updatedUser)
      );

      setUser(updatedUser);

      toast.success('Profile updated successfully!');

      return {
        success: true,
        user: updatedUser,
      };

    } catch (error) {
      console.error('Profile update error:', error);

      toast.error(
        error.response?.data?.message || 'Update failed'
      );

      return {
        success: false,
      };

    } finally {
      setLoading(false);
    }
  };

  const value = {
    user,
    token,
    loading,
    login,
    register,
    logout,
    updateProfile,
    isAuthenticated: !!user,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;