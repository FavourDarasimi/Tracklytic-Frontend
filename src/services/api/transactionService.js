/**
 * Transaction Service
 * Handles transaction operations (create, OCR, etc.)
 */

import axiosInstance from "./axiosInstance";
import { API_CONFIG } from "./config";
import { getErrorMessage } from "./errorHandler";

/**
 * Add a new transaction
 * @param {Object} transactionData - Transaction details
 * @returns {Promise<Object>} - Created transaction object
 */
export const addTransaction = async (transactionData) => {
  try {
    const response = await axiosInstance.post(
      API_CONFIG.ENDPOINTS.TRACKER.TRANSACTIONS,
      transactionData,
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
 * Upload receipt and extract transaction data via OCR
 * @param {FormData} formData - FormData containing receipt image or PDF
 * @returns {Promise<Object>} - Extracted transaction data
 */
export const uploadReceipt = async (formData) => {
  try {
    const response = await axiosInstance.post(
      API_CONFIG.ENDPOINTS.TRACKER.UPLOAD_RECEIPT,
      formData,
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
 * Get user transactions
 * @returns {Promise<Array>} - Transaction list
 */
export const getTransactions = async () => {
  try {
    const response = await axiosInstance.get(
      API_CONFIG.ENDPOINTS.TRACKER.TRANSACTIONS,
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
 * Helper: Create FormData for receipt upload
 * @param {File} file - Receipt file (image or PDF)
 * @returns {FormData}
 */
export const createReceiptFormData = (file) => {
  const formData = new FormData();
  formData.append("receipt", file);
  return formData;
};

export default {
  addTransaction,
  uploadReceipt,
  createReceiptFormData,
};
