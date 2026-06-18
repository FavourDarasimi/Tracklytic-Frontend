/**
 * Budget Service
 * Handles budget/spending limit operations
 */

import axiosInstance from "./axiosInstance";
import { API_CONFIG } from "./config";
import { getErrorMessage } from "./errorHandler";

/**
 * Add general spending limit (budget)
 * @param {Object} budgetData - { amount, period?, description? }
 * @returns {Promise<Object>} - Created budget object
 */
export const addGeneralBudget = async (budgetData) => {
  try {
    const response = await axiosInstance.post(
      API_CONFIG.ENDPOINTS.TRACKER.GENERAL_BUDGETS,
      budgetData,
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

/**
 * Edit general spending limit
 * @param {number} id - Budget ID
 * @param {Object} budgetData - Updated budget data
 * @returns {Promise<Object>} - Updated budget object
 */
export const editGeneralBudget = async (id, budgetData) => {
  try {
    const response = await axiosInstance.patch(
      API_CONFIG.ENDPOINTS.TRACKER.GENERAL_BUDGET(id),
      budgetData,
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

/**
 * Add category-specific spending limit
 * @param {Object} budgetData - { category, amount, period?, description? }
 * @returns {Promise<Object>} - Created category budget object
 */
export const addCategoryBudget = async (budgetData) => {
  try {
    const response = await axiosInstance.post(
      API_CONFIG.ENDPOINTS.TRACKER.CATEGORY_BUDGETS,
      budgetData,
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

/**
 * Edit category spending limit
 * @param {number} id - Category budget ID
 * @param {Object} budgetData - Updated budget data
 * @returns {Promise<Object>} - Updated category budget object
 */
export const editCategoryBudget = async (id, budgetData) => {
  try {
    const response = await axiosInstance.patch(
      API_CONFIG.ENDPOINTS.TRACKER.CATEGORY_BUDGET(id),
      budgetData,
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

/**
 * Get all general budgets
 * @returns {Promise<Array>} - Array of general budget objects
 */
export const getGeneralBudgets = async () => {
  try {
    const response = await axiosInstance.get(
      API_CONFIG.ENDPOINTS.TRACKER.GENERAL_BUDGETS,
    );
    return response.data.data || response.data;
  } catch (error) {
    throw {
      message: getErrorMessage(error),
      originalError: error,
    };
  }
};

/**
 * Get all category budgets
 * @returns {Promise<Array>} - Array of category budget objects
 */
export const getCategoryBudgets = async () => {
  try {
    const response = await axiosInstance.get(
      API_CONFIG.ENDPOINTS.TRACKER.CATEGORY_BUDGETS,
    );
    return response.data.data || response.data;
  } catch (error) {
    throw {
      message: getErrorMessage(error),
      originalError: error,
    };
  }
};

export const deleteGeneralBudget = async (id) => {
  try {
    const response = await axiosInstance.delete(
      API_CONFIG.ENDPOINTS.TRACKER.GENERAL_BUDGET(id),
    );
    return response.data;
  } catch (error) {
    throw { message: getErrorMessage(error), originalError: error };
  }
};

export const deleteCategoryBudget = async (id) => {
  try {
    const response = await axiosInstance.delete(
      API_CONFIG.ENDPOINTS.TRACKER.CATEGORY_BUDGET(id),
    );
    return response.data;
  } catch (error) {
    throw { message: getErrorMessage(error), originalError: error };
  }
};

export default {
  addGeneralBudget,
  editGeneralBudget,
  addCategoryBudget,
  editCategoryBudget,
  getGeneralBudgets,
  getCategoryBudgets,
  deleteGeneralBudget,
  deleteCategoryBudget,
};
