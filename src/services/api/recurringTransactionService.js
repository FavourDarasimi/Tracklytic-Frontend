import axiosInstance from "./axiosInstance";
import { API_CONFIG } from "./config";
import { getErrorMessage } from "./errorHandler";

export const getRecurringTransactions = async () => {
  try {
    const response = await axiosInstance.get(
      API_CONFIG.ENDPOINTS.TRACKER.RECURRING_TRANSACTIONS,
    );
    return response.data.results || response.data.data || response.data;
  } catch (error) {
    throw { message: getErrorMessage(error), originalError: error };
  }
};

export const getRecurringTransaction = async (id) => {
  try {
    const response = await axiosInstance.get(
      API_CONFIG.ENDPOINTS.TRACKER.RECURRING_TRANSACTION(id),
    );
    return response.data.data || response.data;
  } catch (error) {
    throw { message: getErrorMessage(error), originalError: error };
  }
};

export const addRecurringTransaction = async (data) => {
  try {
    const response = await axiosInstance.post(
      API_CONFIG.ENDPOINTS.TRACKER.RECURRING_TRANSACTIONS,
      data,
    );
    return response.data.data || response.data;
  } catch (error) {
    throw { message: getErrorMessage(error), originalError: error };
  }
};

export const updateRecurringTransaction = async (id, data) => {
  try {
    const response = await axiosInstance.patch(
      API_CONFIG.ENDPOINTS.TRACKER.RECURRING_TRANSACTION(id),
      data,
    );
    return response.data.data || response.data;
  } catch (error) {
    throw { message: getErrorMessage(error), originalError: error };
  }
};

export const deleteRecurringTransaction = async (id) => {
  try {
    const response = await axiosInstance.delete(
      API_CONFIG.ENDPOINTS.TRACKER.RECURRING_TRANSACTION(id),
    );
    return response.data;
  } catch (error) {
    throw { message: getErrorMessage(error), originalError: error };
  }
};

export const getNonRecurringTransactions = async (params = {}) => {
  try {
    const response = await axiosInstance.get(
      API_CONFIG.ENDPOINTS.TRACKER.TRANSACTIONS,
      { params: { recurring: false, deleted: false, ...params } },
    );
    return response.data;
  } catch (error) {
    throw { message: getErrorMessage(error), originalError: error };
  }
};

export const makeTransactionRecurring = async (transactionId, data) => {
  try {
    const response = await axiosInstance.post(
      API_CONFIG.ENDPOINTS.TRACKER.MAKE_TRANSACTION_RECURRING(transactionId),
      data,
    );
    return response.data;
  } catch (error) {
    throw { message: getErrorMessage(error), originalError: error };
  }
};

export default {
  getRecurringTransactions,
  getRecurringTransaction,
  addRecurringTransaction,
  updateRecurringTransaction,
  deleteRecurringTransaction,
  getNonRecurringTransactions,
  makeTransactionRecurring,
};
