/**
 * API Configuration
 * Centralized configuration for API base URL and default settings
 */

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:8000";

export const API_CONFIG = {
  BASE_URL: API_BASE_URL,
  TIMEOUT: 30000, // 30 seconds
  ENDPOINTS: {
    // Auth endpoints
    AUTH: {
      LOGIN: "/auth/v1/jwt/create/",
      REFRESH: "/auth/v1/jwt/refresh/",
      LOGOUT: "/auth/v1/logout/",
      REGISTER: "/auth/v1/users/",
      CURRENT_USER: "/auth/v1/users/me/",
      PASSWORD_RESET: "/auth/v1/users/reset_password/",
      PASSWORD_RESET_CONFIRM: "/auth/v1/users/reset_password_confirm/",
      CHANGE_PASSWORD: "/auth/v1/users/set_password/",
      RESEND_ACTIVATION: "/auth/v1/users/resend_activation/",
      ACTIVATE: "/auth/v1/users/activation/",
    },
    // Tracker endpoints
    TRACKER: {
      // Categories
      CATEGORIES: "/api/v1/categories/",

      // Transactions
      TRANSACTIONS: "/api/v1/transactions/",
      UPLOAD_RECEIPT: "/api/v1/transaction/upload/receipt/",

      // General Budget
      GENERAL_BUDGETS: "/api/v1/general-budgets/",
      GENERAL_BUDGET: (id) => `/api/v1/general-budgets/${id}/`,

      // Category Budget
      CATEGORY_BUDGETS: "/api/v1/category-budgets/",
      CATEGORY_BUDGET: (id) => `/api/v1/category-budgets/${id}/`,

      // Saving Plans
      SAVING_PLANS: "/api/v1/saving-plans/",
      CHECK_SAVING_PLAN_STATUS: "/api/v1/check/saving/plan/status/",
      RENEW_SAVING_PLAN: (id) => `/api/v1/renew/saving/plan/${id}/`,

      // AI Insights
      AI_INSIGHTS: "/api/v1/ai/insights/",
      DASHBOARD_OVERVIEW: "/api/v1/dashboard/overview/",
    },
  },
};

export default API_CONFIG;
