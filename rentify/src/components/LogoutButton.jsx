// src/components/LogoutButton.jsx
import React from "react";
import { Button } from "antd";
import { useAuth } from "../auth/AuthContext";
import { useNavigate } from "react-router-dom";

const LogoutButton = () => {
  const { logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await logout();
      navigate("/login"); // Redirect to the login page after logout
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  return <Button onClick={handleLogout}>Logout</Button>;
};

export default LogoutButton;
