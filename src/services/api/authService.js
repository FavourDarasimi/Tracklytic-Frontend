/**
 * Authentication Service
 * Handles login, logout, registration, and user management
 */

import axiosInstance from "./axiosInstance";
import { API_CONFIG } from "./config";
import { getErrorMessage } from "./errorHandler";

/**
 * Login user with email and password
 * @param {string} email - User email
 * @param {string} password - User password
 * @returns {Promise<Object>} - { access_token, refresh_token, user }
 */
export const login = async (email, password) => {
  try {
    const response = await axiosInstance.post(API_CONFIG.ENDPOINTS.AUTH.LOGIN, {
      email,
      password,
    });

    const { access, refresh } = response.data;

    // Store tokens
    localStorage.setItem("access_token", access);
    localStorage.setItem("refresh_token", refresh);

    return {
      access_token: access,
      refresh_token: refresh,
    };
  } catch (error) {
    throw {
      message: getErrorMessage(error),
      originalError: error,
    };
  }
};

/**
 * Register new user
 * @param {Object} userData - { email, password, password_confirm, first_name?, last_name? }
 * @returns {Promise<Object>} - User data or tokens
 */
export const register = async (userData) => {
  try {
    const response = await axiosInstance.post(
      API_CONFIG.ENDPOINTS.AUTH.REGISTER,
      userData,
    );

    // Some backends return tokens immediately, some require login
    if (response.data.access && response.data.refresh) {
      localStorage.setItem("access_token", response.data.access);
      localStorage.setItem("refresh_token", response.data.refresh);
    }

    return response.data;
  } catch (error) {
    console.log(error);
    throw {
      message: getErrorMessage(error),
      originalError: error,
    };
  }
};

/**
 * Get current user info
 * @returns {Promise<Object>} - Current user data
 */
export const getCurrentUser = async (token) => {
  try {
    const response = await axiosInstance.get(
      API_CONFIG.ENDPOINTS.AUTH.CURRENT_USER,
    );
    return response.data;
  } catch (error) {
    throw {
      message: getErrorMessage(error),
      originalError: error,
    };
  }
};

/**
 * Logout user
 * @returns {Promise<Object>} - Logout response
 */
export const logout = async () => {
  try {
    await axiosInstance.post(API_CONFIG.ENDPOINTS.AUTH.LOGOUT);

    // Clear tokens from storage
    localStorage.removeItem("access_token");
    localStorage.removeItem("refresh_token");
    localStorage.removeItem("user");

    return { message: "Logged out successfully" };
  } catch (error) {
    // Clear tokens even if logout fails
    localStorage.removeItem("access_token");
    localStorage.removeItem("refresh_token");
    localStorage.removeItem("user");

    throw {
      message: getErrorMessage(error),
      originalError: error,
    };
  }
};

/**
 * Refresh access token
 * @returns {Promise<string>} - New access token
 */
export const refreshAccessToken = async () => {
  try {
    const refreshToken = localStorage.getItem("refresh_token");

    if (!refreshToken) {
      throw new Error("No refresh token available");
    }

    const response = await axiosInstance.post(
      API_CONFIG.ENDPOINTS.AUTH.REFRESH,
      {
        refresh: refreshToken,
      },
    );

    const newAccessToken = response.data.access;
    localStorage.setItem("access_token", newAccessToken);

    return newAccessToken;
  } catch (error) {
    // Clear tokens on refresh failure
    localStorage.removeItem("access_token");
    localStorage.removeItem("refresh_token");
    localStorage.removeItem("user");

    throw {
      message: getErrorMessage(error),
      originalError: error,
    };
  }
};

/**
 * Check if user is authenticated
 * @returns {boolean}
 */
export const isAuthenticated = () => {
  return !!localStorage.getItem("access_token");
};

/**
 * Get stored access token
 * @returns {string|null}
 */
export const getAccessToken = () => {
  return localStorage.getItem("access_token");
};

/**
 * Request password reset email
 * @param {string} email - User email
 * @returns {Promise<Object>} - Response message
 */
export const requestPasswordReset = async (email) => {
  try {
    const response = await axiosInstance.post(
      API_CONFIG.ENDPOINTS.AUTH.PASSWORD_RESET,
      { email },
    );
    return response.data;
  } catch (error) {
    throw {
      message: getErrorMessage(error),
      originalError: error,
    };
  }
};

/**
 * Confirm password reset with token
 * @param {Object} data - { uid, token, new_password, re_new_password }
 * @returns {Promise<Object>} - Response message
 */
export const confirmPasswordReset = async (data) => {
  try {
    const response = await axiosInstance.post(
      API_CONFIG.ENDPOINTS.AUTH.PASSWORD_RESET_CONFIRM,
      data,
    );
    return response.data;
  } catch (error) {
    throw {
      message: getErrorMessage(error),
      originalError: error,
    };
  }
};

/**
 * Resend activation email
 * @param {string} email - User email
 * @returns {Promise<Object>} - Response message
 */
export const resendActivationEmail = async (email) => {
  try {
    const response = await axiosInstance.post(
      API_CONFIG.ENDPOINTS.AUTH.RESEND_ACTIVATION,
      { email },
    );
    return response.data;
  } catch (error) {
    throw {
      message: getErrorMessage(error),
      originalError: error,
    };
  }
};

/**
 * Activate user account with token
 *  { uid, token }
 * @returns {Promise<Object>} - Response message
 */
export const activateAccount = async ({ uid, token }) => {
  try {
    const response = await axiosInstance.post(
      API_CONFIG.ENDPOINTS.AUTH.ACTIVATE,
      { uid, token },
    );
    return response.data;
  } catch (error) {
    throw {
      message: getErrorMessage(error),
      originalError: error,
    };
  }
};

/**
 * Change password for authenticated user
 * @param {Object} data - { old_password, new_password, re_new_password }
 * @returns {Promise<Object>} - Response message
 */
export const changePassword = async (data) => {
  try {
    const response = await axiosInstance.post(
      API_CONFIG.ENDPOINTS.AUTH.CHANGE_PASSWORD,
      data,
    );
    return response.data;
  } catch (error) {
    throw {
      message: getErrorMessage(error),
      originalError: error,
    };
  }
};

/**
 * Update user profile
 * @param {Object} profileData - Fields to update
 * @returns {Promise<Object>} - Updated user data
 */
export const updateProfile = async (profileData) => {
  try {
    const response = await axiosInstance.patch(
      API_CONFIG.ENDPOINTS.AUTH.CURRENT_USER,
      profileData,
    );
    return response.data;
  } catch (error) {
    throw {
      message: getErrorMessage(error),
      originalError: error,
    };
  }
};

/**
 * Get user profile
 * @returns {Promise<Object>} - User profile object
 */
export const getUserProfile = async () => {
  try {
    const response = await axiosInstance.get(
      API_CONFIG.ENDPOINTS.AUTH.PROFILE,
    );
    return response.data;
  } catch (error) {
    throw {
      message: getErrorMessage(error),
      originalError: error,
    };
  }
};

/**
 * Update user profile
 * @param {Object|FormData} profileData - Profile fields to update
 * @returns {Promise<Object>} - Updated profile data
 */
export const updateUserProfile = async (profileData) => {
  try {
    const response = await axiosInstance.patch(
      API_CONFIG.ENDPOINTS.AUTH.PROFILE,
      profileData,
    );
    return response.data;
  } catch (error) {
    throw {
      message: getErrorMessage(error),
      originalError: error,
    };
  }
};

export default {
  login,
  register,
  getCurrentUser,
  logout,
  refreshAccessToken,
  isAuthenticated,
  getAccessToken,
  requestPasswordReset,
  confirmPasswordReset,
  resendActivationEmail,
  activateAccount,
  changePassword,
  updateProfile,
  getUserProfile,
  updateUserProfile,
};
