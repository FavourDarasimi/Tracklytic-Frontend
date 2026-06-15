import React, { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import ModernNavbar from "../components/ModernNavbar";
import Footer from "../components/Footer";
import { useAuth } from "../hooks/useAuth";
import { validatePassword, validatePasswordConfirm, validateResetLink } from "../utils/validation";

const ResetPasswordConfirm = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { confirmPasswordReset, isLoading } = useAuth();

  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // Get uid and token from URL query params
  const uid = searchParams.get("uid");
  const token = searchParams.get("token");

  useEffect(() => {
    const linkErr = validateResetLink(uid, token);
    if (linkErr) {
      setError(linkErr);
    }
  }, [uid, token]);

  const validateForm = () => {
    setError("");

    const passwordErr = validatePassword(newPassword);
    if (passwordErr) return (setError(passwordErr), false);

    const confirmErr = validatePasswordConfirm(newPassword, confirmPassword);
    if (confirmErr) return (setError(confirmErr), false);

    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccessMessage("");

    if (!uid || !token) {
      setError("Invalid reset link. Please request a new password reset.");
      return;
    }

    if (!validateForm()) {
      return;
    }

    // URL-decode the parameters
    const decodedUid = decodeURIComponent(uid);
    const decodedToken = decodeURIComponent(token);

    const result = await confirmPasswordReset({
      uid: decodedUid,
      token: decodedToken,
      new_password: newPassword,
      re_new_password: confirmPassword,
    });

    if (result.success) {
      setSuccessMessage("Password reset successfully! Redirecting to login...");
      setTimeout(() => {
        navigate("/auth");
      }, 2000);
    } else {
      setError(
        result.error || "Failed to reset password. The link may have expired.",
      );
    }
  };

  if (!uid || !token) {
    return (
      <div className="flex flex-col">
        <ModernNavbar />
        <div className="flex flex-col items-center justify-center min-h-[calc(100vh-var(--navbar-height))]">
          <div className="px-10 w-full sm:w-[50%] md:w-[40%] lg:w-[34%] xl:w-[26%]">
            <div className="p-4 rounded-lg bg-red-50 border-l-4 border-red-600">
              <p className="text-red-600 font-medium mb-4">
                Invalid or expired reset link
              </p>
              <p className="text-red-600 text-sm mb-4">
                The password reset link is invalid or has expired. Please
                request a new one.
              </p>
              <button
                onClick={() => navigate("/password-reset")}
                className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg transition"
              >
                Request New Reset Link
              </button>
            </div>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="flex flex-col">
      <ModernNavbar />
      <div className="flex flex-col items-center justify-center min-h-[calc(100vh-var(--navbar-height))]">
        <div className="px-10 w-full sm:w-[50%] md:w-[40%] lg:w-[34%] xl:w-[26%]">
          {/* Header */}
          <div className="pb-7 text-center">
            <h1 className="font-bold text-[25px]">Set New Password</h1>
            <h1 className="text-gray-600 text-[15px] pt-1">
              Enter your new password below
            </h1>
          </div>

          {/* Error Message */}
          {error && (
            <div className="mb-4 p-3 rounded-lg bg-red-50 border-l-4 border-red-600">
              <p className="text-red-600 text-sm font-medium">{error}</p>
            </div>
          )}

          {/* Success Message */}
          {successMessage && (
            <div className="mb-4 p-3 rounded-lg bg-green-50 border-l-4 border-green-600">
              <p className="text-green-600 text-sm font-medium">
                {successMessage}
              </p>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="flex flex-col space-y-5">
            {/* New Password */}
            <div className="flex flex-col">
              <label className="text-[14.5px] font-semibold">
                New Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className="border-[1px] border-[#a9a9b0] rounded-xl w-full h-[48px] p-3 mt-2 text-[14px] focus:border-2 focus:border-green-600 outline-none transition pr-10"
                  placeholder="Enter new password"
                  disabled={isLoading}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-600 hover:text-gray-800"
                >
                  {showPassword ? "👁️" : "👁️‍🗨️"}
                </button>
              </div>
            </div>

            {/* Confirm Password */}
            <div className="flex flex-col">
              <label className="text-[14.5px] font-semibold">
                Confirm Password
              </label>
              <div className="relative">
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="border-[1px] border-[#a9a9b0] rounded-xl w-full h-[48px] p-3 mt-2 text-[14px] focus:border-2 focus:border-green-600 outline-none transition pr-10"
                  placeholder="Confirm your password"
                  disabled={isLoading}
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-600 hover:text-gray-800"
                >
                  {showConfirmPassword ? "👁️" : "👁️‍🗨️"}
                </button>
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="cursor-pointer bg-green-600 hover:bg-green-700 disabled:bg-green-400 disabled:cursor-not-allowed text-white w-full py-3 rounded-3xl mt-5 font-semibold transition transform hover:scale-105 duration-200"
            >
              {isLoading ? (
                <span className="flex items-center justify-center">
                  <svg
                    className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    ></path>
                  </svg>
                  Resetting...
                </span>
              ) : (
                "Reset Password"
              )}
            </button>
          </form>

          {/* Back to Login */}
          <div className="pt-4 text-center">
            <span className="text-gray-600 text-sm">
              <span
                className="text-green-600 font-semibold cursor-pointer hover:text-green-700 transition"
                onClick={() => navigate("/auth")}
              >
                Back to Login
              </span>
            </span>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default ResetPasswordConfirm;
