import React from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "./AuthContext";

const ProtectedRoute = ({ children, role }) => {
  const { currentUser, loading } = useAuth();

  if (loading) {
    return <div>Loading...</div>;
  }

  if (currentUser && (!role || currentUser.role === role)) {
    return children;
  }

  return <Navigate to="/login" />;
};

export default ProtectedRoute;
