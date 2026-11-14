import React, { createContext, useContext, useState, useEffect } from "react";
import { authApi } from "../api/client.js";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchCurrentUser = async () => {
    try {
      const res = await authApi.getCurrentUser();
      if (res.data?.data) {
        setUser(res.data.data);
      } else {
        setUser(null);
      }
    } catch (_) {
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCurrentUser();
  }, []);

  const login = async (credentials) => {
    const res = await authApi.login(credentials);
    const data = res.data?.data;
    if (data?.accesstoken) {
      localStorage.setItem("accessToken", data.accesstoken);
    }
    if (data?.user) {
      setUser(data.user);
    } else {
      await fetchCurrentUser();
    }
    return data;
  };

  const logout = async () => {
    try {
      await authApi.logout();
    } catch (_) {
      // Ignore logout errors
    } finally {
      localStorage.removeItem("accessToken");
      setUser(null);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        setUser,
        isAuthenticated: !!user,
        loading,
        login,
        logout,
        refreshUser: fetchCurrentUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
