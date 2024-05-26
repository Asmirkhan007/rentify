import React from "react";
import {
  BrowserRouter as Router,
  Route,
  Routes,
  Navigate,
} from "react-router-dom";
import { AuthProvider } from "./auth/AuthContext";
import { LoadingProvider } from "./context/LoadingContext"; // Import LoadingProvider
import ProtectedRoute from "./auth/ProtectedRoute";
import LoginPage from "./components/LoginPage";
import SignupPage from "./components/SignupPage";
import SellerDashboardPage from "./components/SellerDashboardPage";
import BuyerDashboardPage from "./components/BuyerDashboardPage";

function App() {
  return (
    <Router>
      <AuthProvider>
        <LoadingProvider>
          {" "}
          {/* Wrap with LoadingProvider */}
          <Routes>
            <Route path="/login" element={<LoginPage />} />
            <Route path="/signup" element={<SignupPage />} />
            <Route
              path="/seller-dashboard"
              element={
                <ProtectedRoute role="seller">
                  <SellerDashboardPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/buyer-dashboard"
              element={
                <ProtectedRoute role="buyer">
                  <BuyerDashboardPage />
                </ProtectedRoute>
              }
            />
            <Route path="/" element={<Navigate to="/login" />} />
          </Routes>
        </LoadingProvider>
      </AuthProvider>
    </Router>
  );
}

export default App;
