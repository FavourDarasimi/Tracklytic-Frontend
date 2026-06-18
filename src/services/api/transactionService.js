import axiosInstance from "./axiosInstance";
import { API_CONFIG } from "./config";
import { getErrorMessage } from "./errorHandler";

export const addTransaction = async (transactionData) => {
  try {
    const response = await axiosInstance.post(
      API_CONFIG.ENDPOINTS.TRACKER.TRANSACTIONS,
      transactionData,
    );
    return response.data.data || response.data;
  } catch (error) {
    throw { message: getErrorMessage(error), originalError: error };
  }
};

export const uploadReceipt = async (formData) => {
  try {
    const response = await axiosInstance.post(
      API_CONFIG.ENDPOINTS.TRACKER.UPLOAD_RECEIPT,
      formData,
    );
    return response.data.data || response.data;
  } catch (error) {
    throw { message: getErrorMessage(error), originalError: error };
  }
};

export const getTransactions = async (params = {}) => {
  try {
    const response = await axiosInstance.get(
      API_CONFIG.ENDPOINTS.TRACKER.TRANSACTIONS,
      { params },
    );
    const data = response.data;
    return data.results || data.data || data;
  } catch (error) {
    throw { message: getErrorMessage(error), originalError: error };
  }
};

export const getTransaction = async (id) => {
  try {
    const response = await axiosInstance.get(
      API_CONFIG.ENDPOINTS.TRACKER.TRANSACTION(id),
    );
    return response.data.data || response.data;
  } catch (error) {
    throw { message: getErrorMessage(error), originalError: error };
  }
};

export const updateTransaction = async (id, transactionData) => {
  try {
    const response = await axiosInstance.patch(
      API_CONFIG.ENDPOINTS.TRACKER.TRANSACTION(id),
      transactionData,
    );
    return response.data.data || response.data;
  } catch (error) {
    throw { message: getErrorMessage(error), originalError: error };
  }
};

export const deleteTransaction = async (id) => {
  try {
    const response = await axiosInstance.delete(
      API_CONFIG.ENDPOINTS.TRACKER.TRANSACTION(id),
    );
    return response.data;
  } catch (error) {
    throw { message: getErrorMessage(error), originalError: error };
  }
};

export const restoreTransaction = async (id) => {
  try {
    const response = await axiosInstance.post(
      API_CONFIG.ENDPOINTS.TRACKER.RESTORE_TRANSACTION(id),
    );
    return response.data;
  } catch (error) {
    throw { message: getErrorMessage(error), originalError: error };
  }
};

export const bulkDeleteTransactions = async (ids) => {
  try {
    const response = await axiosInstance.post(
      API_CONFIG.ENDPOINTS.TRACKER.BULK_DELETE_TRANSACTIONS,
      { ids },
    );
    return response.data;
  } catch (error) {
    throw { message: getErrorMessage(error), originalError: error };
  }
};

export const exportTransactionsCsv = async (params = {}) => {
  const response = await axiosInstance.get(
    API_CONFIG.ENDPOINTS.TRACKER.EXPORT_CSV,
    { params, responseType: "blob" },
  );
  const url = window.URL.createObjectURL(new Blob([response.data], { type: "text/csv" }));
  const link = document.createElement("a");
  link.href = url;
  link.download = `transactions-${new Date().toISOString().split("T")[0]}.csv`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  window.URL.revokeObjectURL(url);
};

export const createReceiptFormData = (file) => {
  const formData = new FormData();
  formData.append("receipt", file);
  return formData;
};

export default {
  addTransaction,
  uploadReceipt,
  getTransactions,
  getTransaction,
  updateTransaction,
  deleteTransaction,
  restoreTransaction,
  bulkDeleteTransactions,
  exportTransactionsCsv,
  createReceiptFormData,
};
