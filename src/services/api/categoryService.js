import axiosInstance from "./axiosInstance";
import { API_CONFIG } from "./config";
import { getErrorMessage } from "./errorHandler";

export const getCategories = async () => {
  try {
    const response = await axiosInstance.get(
      API_CONFIG.ENDPOINTS.TRACKER.CATEGORIES,
    );
    const data = response.data;
    return data.results || data.data || data;
  } catch (error) {
    throw { message: getErrorMessage(error), originalError: error };
  }
};

export const addCategory = async (categoryData) => {
  try {
    const response = await axiosInstance.post(
      API_CONFIG.ENDPOINTS.TRACKER.CATEGORIES,
      categoryData,
    );
    return response.data.data || response.data;
  } catch (error) {
    throw { message: getErrorMessage(error), originalError: error };
  }
};

export const updateCategory = async (id, categoryData) => {
  try {
    const response = await axiosInstance.patch(
      API_CONFIG.ENDPOINTS.TRACKER.CATEGORY(id),
      categoryData,
    );
    return response.data.data || response.data;
  } catch (error) {
    throw { message: getErrorMessage(error), originalError: error };
  }
};

export const deleteCategory = async (id) => {
  try {
    const response = await axiosInstance.delete(
      API_CONFIG.ENDPOINTS.TRACKER.CATEGORY(id),
    );
    return response.data;
  } catch (error) {
    throw { message: getErrorMessage(error), originalError: error };
  }
};

export default {
  getCategories,
  addCategory,
  updateCategory,
  deleteCategory,
};
