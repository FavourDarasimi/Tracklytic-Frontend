import React, { createContext, useState, useCallback, useEffect } from "react";
import { authService } from "@/services/api";

/**
 * Auth Context
 * Manages global authentication state and provides auth functions
 */
export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [error, setError] = useState(null);

  /**
   * Initialize auth state from localStorage
   */
  useEffect(() => {
    const initializeAuth = async () => {
      setIsLoading(true);
      const token = localStorage.getItem("access_token");

      if (token) {
        try {
          const currentUser = await authService.getCurrentUser(token);
          setUser(currentUser);
          setIsAuthenticated(true);
          setError(null);
        } catch (err) {
          console.error("Failed to fetch current user:", err.message);
          // Token might be invalid, clear it
          localStorage.removeItem("access_token");
          localStorage.removeItem("refresh_token");
          setUser(null);
          setIsAuthenticated(false);
        }
      }

      setIsLoading(false);
    };

    initializeAuth();

    // Listen for logout events from other tabs/windows
    const handleLogout = () => {
      setUser(null);
      setIsAuthenticated(false);
    };

    window.addEventListener("logout", handleLogout);
    return () => window.removeEventListener("logout", handleLogout);
  }, []);

  /**
   * Handle user login
   */
  const login = useCallback(async (email, password) => {
    setIsLoading(true);
    setError(null);

    try {
      const login = await authService.login(email, password);
      console.log("Login successful:", login.access_token);
      const currentUser = await authService.getCurrentUser(login.access_token);

      setUser(currentUser);
      setIsAuthenticated(true);

      return { success: true, user: currentUser };
    } catch (err) {
      const errorMessage = err.message || "Login failed";
      console.log("Login error:", errorMessage);
      setError(errorMessage);
      setUser(null);
      setIsAuthenticated(false);

      return { success: false, error: errorMessage };
    } finally {
      setIsLoading(false);
    }
  }, []);

  /**
   * Handle user registration
   */
  const register = useCallback(async (userData) => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await authService.register(userData);

      // Check if tokens were returned (auto-login after registration)
      if (localStorage.getItem("access_token")) {
        const currentUser = await authService.getCurrentUser();
        setUser(currentUser);
        setIsAuthenticated(true);
      }

      return { success: true, data: response };
    } catch (err) {
      const errorMessage = err.message || "Registration failed";
      setError(errorMessage);

      return { success: false, error: errorMessage };
    } finally {
      setIsLoading(false);
    }
  }, []);

  /**
   * Handle user logout
   */
  const logout = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      await authService.logout();
      setUser(null);
      setIsAuthenticated(false);

      return { success: true };
    } catch (err) {
      const errorMessage = err.message || "Logout failed";
      setError(errorMessage);

      // Force logout anyway
      setUser(null);
      setIsAuthenticated(false);

      return { success: false, error: errorMessage };
    } finally {
      setIsLoading(false);
    }
  }, []);

  /**
   * Request password reset email
   */
  const requestPasswordReset = useCallback(async (email) => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await authService.requestPasswordReset(email);
      return { success: true, data: response };
    } catch (err) {
      const errorMessage = err.message || "Failed to request password reset";
      setError(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setIsLoading(false);
    }
  }, []);

  /**
   * Confirm password reset
   */
  const confirmPasswordReset = useCallback(async (data) => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await authService.confirmPasswordReset(data);
      return { success: true, data: response };
    } catch (err) {
      const errorMessage = err.message || "Failed to reset password";
      setError(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setIsLoading(false);
    }
  }, []);

  /**
   * Resend activation email
   */
  const resendActivationEmail = useCallback(async (email) => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await authService.resendActivationEmail(email);
      return { success: true, data: response };
    } catch (err) {
      const errorMessage = err.message || "Failed to resend activation email";
      setError(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setIsLoading(false);
    }
  }, []);

  /**
   * Activate account
   */
  const activateAccount = useCallback(async (uid, token) => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await authService.activateAccount({ uid, token });
      return { success: true, data: response };
    } catch (err) {
      const errorMessage = err.message || "Failed to activate account";
      setError(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setIsLoading(false);
    }
  }, []);

  /**
   * Change password
   */
  const changePassword = useCallback(async (oldPassword, newPassword) => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await authService.changePassword({
        old_password: oldPassword,
        new_password: newPassword,
        re_new_password: newPassword,
      });
      return { success: true, data: response };
    } catch (err) {
      const errorMessage = err.message || "Failed to change password";
      setError(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setIsLoading(false);
    }
  }, []);

  /**
   * Update user in context (e.g., after profile changes)
   */
  const updateUser = useCallback((userData) => {
    setUser(userData);
  }, []);

  const value = {
    // State
    user,
    isAuthenticated,
    isLoading,
    error,

    // Methods
    login,
    register,
    logout,
    requestPasswordReset,
    confirmPasswordReset,
    resendActivationEmail,
    activateAccount,
    changePassword,
    updateUser,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export default AuthContext;
