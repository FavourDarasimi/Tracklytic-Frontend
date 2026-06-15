import React, { useState } from "react";
import Footer from "../components/Footer";
import { useNavigate, useLocation } from "react-router-dom";
import ModernNavbar from "../components/ModernNavbar";
import { useAuth } from "../hooks/useAuth";
import { validateEmail, validatePassword, validatePasswordConfirm, validateRequired } from "../utils/validation";

const Authentication = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { login, register, isLoading } = useAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [passwordConfirm, setPasswordConfirm] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [username, setUsername] = useState("");
  const [authState, setAuthState] = useState("login");
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  const validateForm = () => {
    setError("");

    const emailErr = validateEmail(email);
    if (emailErr) return (setError(emailErr), false);

    const passwordErr = validatePassword(password);
    if (passwordErr) return (setError(passwordErr), false);

    if (authState === "signup") {
      const firstNameErr = validateRequired(firstName, "First name");
      if (firstNameErr) return (setError(firstNameErr), false);

      const lastNameErr = validateRequired(lastName, "Last name");
      if (lastNameErr) return (setError(lastNameErr), false);

      const confirmErr = validatePasswordConfirm(password, passwordConfirm);
      if (confirmErr) return (setError(confirmErr), false);
    }

    return true;
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    setSuccessMessage("");

    if (!validateForm()) return;

    const result = await login(email, password);

    if (result.success) {
      setSuccessMessage("Login successful! Redirecting...");
      const from = location.state?.from?.pathname || "/dashboard";
      setTimeout(() => navigate(from), 500);
    } else {
      setError(result.error || "Login failed");
    }
  };

  const handleSignup = async (e) => {
    e.preventDefault();
    setError("");
    setSuccessMessage("");

    if (!validateForm()) return;

    const userData = {
      username,
      email,
      password,
      re_password: passwordConfirm,
      first_name: firstName,
      last_name: lastName,
    };

    const result = await register(userData);

    if (result.success) {
      setSuccessMessage(
        "Account created! Check your email to verify your account.",
      );

      setTimeout(() => {
        setUsername("");
        setEmail("");
        setPassword("");
        setPasswordConfirm("");
        setFirstName("");
        setLastName("");
        setAuthState("login");
      }, 1500);
    } else {
      setError(result.error || "Registration failed");
    }
  };

  const handleSubmit = (e) => {
    authState === "login" ? handleLogin(e) : handleSignup(e);
  };

  return (
    <div className="flex flex-col min-h-screen">
      <ModernNavbar />

      <div className="flex flex-col items-center justify-center flex-1 px-4 py-10 min-h-[calc(100vh-var(--navbar-height))]">
        <div className="w-full max-w-md px-4 sm:px-6 md:px-0">
          {/* Header */}
          <div className="pb-6 text-center">
            <h1 className="font-bold text-xl sm:text-2xl">
              {authState === "signup" ? "Let's Get Started" : "Welcome Back!"}
            </h1>
            <p className="text-gray-600 text-sm sm:text-base pt-1">
              {authState === "signup"
                ? "Take control of your finances with smart expense tracking"
                : "Sign in to continue tracking your expenses"}
            </p>
          </div>

          {/* Error */}
          {error && (
            <div className="mb-4 p-3 rounded-lg bg-red-50 border-l-4 border-red-600">
              <p className="text-red-600 text-sm font-medium">{error}</p>
            </div>
          )}

          {/* Success */}
          {successMessage && (
            <div className="mb-4 p-3 rounded-lg bg-green-50 border-l-4 border-green-600">
              <p className="text-green-600 text-sm font-medium">
                {successMessage}
              </p>
            </div>
          )}

          {/* Form */}
          <form
            onSubmit={handleSubmit}
            className="flex flex-col space-y-5 pb-6"
          >
            {/* Signup Fields */}
            {authState === "signup" && (
              <div className="space-y-5">
                <div className="flex flex-col">
                  <label className="text-sm font-semibold">Username</label>
                  <input
                    type="text"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    className="border border-gray-300 rounded-xl w-full h-12 px-3 mt-2 text-sm focus:border-2 focus:border-green-600 outline-none transition"
                    placeholder="johndoe"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="flex flex-col">
                    <label className="text-sm font-semibold">First Name</label>
                    <input
                      type="text"
                      value={firstName}
                      onChange={(e) => setFirstName(e.target.value)}
                      className="border border-gray-300 rounded-xl w-full h-12 px-3 mt-2 text-sm focus:border-2 focus:border-green-600 outline-none transition"
                      placeholder="John"
                    />
                  </div>

                  <div className="flex flex-col">
                    <label className="text-sm font-semibold">Last Name</label>
                    <input
                      type="text"
                      value={lastName}
                      onChange={(e) => setLastName(e.target.value)}
                      className="border border-gray-300 rounded-xl w-full h-12 px-3 mt-2 text-sm focus:border-2 focus:border-green-600 outline-none transition"
                      placeholder="Doe"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Email */}
            <div className="flex flex-col">
              <label className="text-sm font-semibold">Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="border border-gray-300 rounded-xl w-full h-12 px-3 mt-2 text-sm focus:border-2 focus:border-green-600 outline-none transition"
                placeholder="johndoe@gmail.com"
              />
            </div>

            {/* Password */}
            <div className="flex flex-col">
              <label className="text-sm font-semibold">Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="border border-gray-300 rounded-xl w-full h-12 px-3 mt-2 text-sm focus:border-2 focus:border-green-600 outline-none transition"
                placeholder="Enter your password"
              />
            </div>

            {/* Confirm Password */}
            {authState === "signup" && (
              <div className="flex flex-col">
                <label className="text-sm font-semibold">
                  Confirm Password
                </label>
                <input
                  type="password"
                  value={passwordConfirm}
                  onChange={(e) => setPasswordConfirm(e.target.value)}
                  className="border border-gray-300 rounded-xl w-full h-12 px-3 mt-2 text-sm focus:border-2 focus:border-green-600 outline-none transition"
                  placeholder="Confirm your password"
                />
              </div>
            )}

            {/* Forgot Password */}
            {authState === "login" && (
              <p
                className="text-right text-xs sm:text-sm cursor-pointer text-green-600 font-semibold hover:text-green-700"
                onClick={() => navigate("/password-reset")}
              >
                Forgot password?
              </p>
            )}

            {/* Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3 rounded-2xl mt-4 font-semibold bg-green-600 text-white hover:bg-green-700 active:scale-95 disabled:bg-green-400 transition"
            >
              {isLoading
                ? "Processing..."
                : authState === "signup"
                  ? "Create Account"
                  : "Log In"}
            </button>
          </form>

          {/* Toggle */}
          <p className="pt-4 text-center text-sm">
            {authState === "signup"
              ? "Already have an account?"
              : "New to Tracklytic?"}{" "}
            <span
              className="text-green-600 font-semibold cursor-pointer hover:text-green-700"
              onClick={() => {
                setAuthState(authState === "login" ? "signup" : "login");
                setError("");
                setSuccessMessage("");
              }}
            >
              {authState === "signup" ? "Login" : "Create Account"}
            </span>
          </p>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default Authentication;
