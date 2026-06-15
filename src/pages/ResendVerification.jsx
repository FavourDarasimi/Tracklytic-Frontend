import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import ModernNavbar from "../components/ModernNavbar";
import Footer from "../components/Footer";
import { useAuth } from "../hooks/useAuth";
import { validateEmail } from "../utils/validation";

const ResendVerification = () => {
  const navigate = useNavigate();
  const { resendActivationEmail, isLoading } = useAuth();
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  const validateEmailField = () => {
    setError("");

    const emailErr = validateEmail(email);
    if (emailErr) {
      setError(emailErr);
      return false;
    }

    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccessMessage("");

    if (!validateEmailField()) {
      return;
    }

    const result = await resendActivationEmail(email);

    if (result.success) {
      setSuccessMessage(
        "Verification email has been sent! Please check your inbox and click the link to verify your account.",
      );
      setEmail("");
      setTimeout(() => {
        navigate("/auth");
      }, 3000);
    } else {
      setError(result.error || "Failed to send verification email");
    }
  };

  return (
    <div className="flex flex-col">
      <ModernNavbar />
      <div className="flex flex-col items-center justify-center min-h-[calc(100vh-var(--navbar-height))]">
        <div className="px-10 w-full sm:w-[50%] md:w-[40%] lg:w-[34%] xl:w-[26%]">
          {/* Header */}
          <div className="pb-7 text-center">
            <h1 className="font-bold text-[25px]">Verify Your Email</h1>
            <h1 className="text-gray-600 text-[15px] pt-1">
              Enter your email address and we'll send you a verification link
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
            {/* Email */}
            <div className="flex flex-col">
              <label className="text-[14.5px] font-semibold">
                Email Address
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="border-[1px] border-[#a9a9b0] rounded-xl w-full h-[48px] p-3 mt-2 text-[14px] focus:border-2 focus:border-green-600 outline-none transition"
                placeholder="your@email.com"
                disabled={isLoading}
              />
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
                  Sending...
                </span>
              ) : (
                "Send Verification Link"
              )}
            </button>
          </form>

          {/* Back to Login */}
          <div className="pt-4 text-center">
            <span className="text-gray-600 text-sm">
              Already verified?{" "}
              <span
                className="text-green-600 font-semibold cursor-pointer hover:text-green-700 transition"
                onClick={() => navigate("/auth")}
              >
                Go to Login
              </span>
            </span>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default ResendVerification;
