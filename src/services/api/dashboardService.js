import axiosInstance from "./axiosInstance";
import { API_CONFIG } from "./config";
import { getErrorMessage } from "./errorHandler";

/**
 * Dashboard Service
 * Fetches the dashboard overview data from the backend.
 */
export const getDashboardData = async (period = "1M") => {
  try {
    const response = await axiosInstance.get(
      API_CONFIG.ENDPOINTS.TRACKER.DASHBOARD_OVERVIEW,
      { params: { period } },
    );

    return response.data.data || {};
  } catch (error) {
    throw {
      message: getErrorMessage(error),
      originalError: error,
    };
  }
};

export default {
  getDashboardData,
};
