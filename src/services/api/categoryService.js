/**
 * Category Service
 * Handles category operations (CRUD)
 */

import axiosInstance from "./axiosInstance";
import { API_CONFIG } from "./config";
import { getErrorMessage } from "./errorHandler";

/**
 * Get all user categories
 * @returns {Promise<Array>} - Array of category objects
 */
export const getCategories = async () => {
  try {
    const response = await axiosInstance.get(
      API_CONFIG.ENDPOINTS.TRACKER.CATEGORIES,
    );

    const data = response.data;
    return data.results || data.data || data;
  } catch (error) {
    throw {
      message: getErrorMessage(error),
      originalError: error,
    };
  }
};

/**
 * Add a new category
 * @param {Object} categoryData - { name, description?, color?, icon? }
 * @returns {Promise<Object>} - Created category object
 */
export const addCategory = async (categoryData) => {
  try {
    const response = await axiosInstance.post(
      API_CONFIG.ENDPOINTS.TRACKER.CATEGORIES,
      categoryData,
    );

    // Backend returns { success, message, data }
    return response.data.data || response.data;
  } catch (error) {
    throw {
      message: getErrorMessage(error),
      originalError: error,
    };
  }
};

export default {
  getCategories,
  addCategory,
};
