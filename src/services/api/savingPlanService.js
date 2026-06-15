/**
 * Saving Plan Service
 * Handles saving plan operations (create, check status, renew)
 */

import axiosInstance from "./axiosInstance";
import { API_CONFIG } from "./config";
import { getErrorMessage } from "./errorHandler";

/**
 * Add a new saving plan
 * @param {Object} planData - { name, description?, target_amount, deadline, priority? }
 * @returns {Promise<Object>} - Created saving plan object
 */
export const addSavingPlan = async (planData) => {
  try {
    const response = await axiosInstance.post(
      API_CONFIG.ENDPOINTS.TRACKER.SAVING_PLANS,
      planData,
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
 * Check status of all user saving plans
 * @returns {Promise<Array>} - Array of saving plans with status
 */
export const checkSavingPlanStatus = async () => {
  try {
    const response = await axiosInstance.get(
      API_CONFIG.ENDPOINTS.TRACKER.CHECK_SAVING_PLAN_STATUS,
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
 * Renew a saving plan with new target amount
 * @param {number} id - Saving plan ID
 * @param {Object} planData - { savings_amount, status? }
 * @returns {Promise<Object>} - Renewed saving plan object
 */
export const renewSavingPlan = async (id, planData) => {
  try {
    const response = await axiosInstance.put(
      API_CONFIG.ENDPOINTS.TRACKER.RENEW_SAVING_PLAN(id),
      planData,
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
 * Get all user saving plans
 * @returns {Promise<Array>} - Array of saving plan objects
 */
export const getUserSavingPlans = async () => {
  try {
    const response = await axiosInstance.get(
      API_CONFIG.ENDPOINTS.TRACKER.SAVING_PLANS,
    );

    // Backend returns { success, message, data } or array directly
    return response.data.data || response.data;
  } catch (error) {
    throw {
      message: getErrorMessage(error),
      originalError: error,
    };
  }
};

export default {
  addSavingPlan,
  checkSavingPlanStatus,
  renewSavingPlan,
  getUserSavingPlans,
};
