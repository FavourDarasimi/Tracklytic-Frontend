export const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export const validateEmail = (email) => {
  if (!email?.trim()) return "Email is required";
  if (!EMAIL_REGEX.test(email)) return "Please enter a valid email address";
  return null;
};

export const validatePassword = (password) => {
  if (!password) return "Password is required";
  if (password.length < 8) return "Password must be at least 8 characters long";
  return null;
};

export const validatePasswordConfirm = (password, confirm) => {
  if (!confirm) return "Password confirmation is required";
  if (password !== confirm) return "Passwords do not match";
  return null;
};

export const validateRequired = (value, fieldName) => {
  if (!value?.trim()) return `${fieldName} is required`;
  return null;
};

export const validateResetLink = (uid, token) => {
  if (!uid || !token) return "Invalid reset link. Please request a new password reset.";
  return null;
};
