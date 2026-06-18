import { Routes, Route } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import LandingPage from "./pages/LandingPage";
import Authentication from "./pages/Authentication";
import PasswordReset from "./pages/PasswordReset";
import ResetPasswordConfirm from "./pages/ResetPasswordConfirm";
import VerifyEmail from "./pages/VerifyEmail";
import ResendVerification from "./pages/ResendVerification";
import Dashboard from "./pages/Dashboard";
import Transactions from "./pages/Transactions";
import Settings from "./pages/Settings";
import Budget from "./pages/Budget";
import RecurringTransactions from "./pages/RecurringTransactions";
import Statistics from "./pages/Statistics";
import MainLayout from "./layout/MainLayout";
import { AuthProvider } from "./context/AuthContext";
import { CategoryProvider } from "./context/CategoryContext";
import ProtectedRoute from "./components/ProtectedRoute";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000,
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <div className="bg-white min-h-screen">
          <Routes>
            {/* Public Routes */}
            <Route path="/" element={<LandingPage />} />
            <Route path="/auth" element={<Authentication />} />
            <Route path="/password-reset" element={<PasswordReset />} />
            <Route
              path="/reset-password-confirm"
              element={<ResetPasswordConfirm />}
            />
            <Route path="/verify-email/" element={<VerifyEmail />} />
            <Route path="/resend-verification" element={<ResendVerification />} />

            {/* Protected Dashboard layout routes */}
            <Route
              element={
                <ProtectedRoute>
                  <CategoryProvider>
                    <MainLayout />
                  </CategoryProvider>
                </ProtectedRoute>
              }
            >
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/transactions" element={<Transactions />} />
              <Route path="/settings" element={<Settings />} />
              <Route path="/budget" element={<Budget />} />
              <Route path="/recurring-transactions" element={<RecurringTransactions />} />
              <Route path="/statistics" element={<Statistics />} />
            </Route>
          </Routes>
        </div>
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;
