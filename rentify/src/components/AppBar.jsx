// src/components/AppBar.jsx
import React, { useState } from "react";
import { Layout, Menu, Button, Modal } from "antd";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../auth/AuthContext";
import { LogoutOutlined } from "@ant-design/icons";

const { Header } = Layout;

const AppBar = ({ onAddProperty }) => {
  const { logout, currentUser } = useAuth();
  const navigate = useNavigate();
  const [isLogoutModalVisible, setIsLogoutModalVisible] = useState(false);

  const handleLogout = async () => {
    try {
      await logout();
      navigate("/login");
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  const showLogoutModal = () => {
    setIsLogoutModalVisible(true);
  };

  const handleLogoutCancel = () => {
    setIsLogoutModalVisible(false);
  };

  return (
    <Header className="header">
      <div className="logo" />
      <Menu theme="dark" mode="horizontal" defaultSelectedKeys={["1"]}>
        <Menu.Item
          key="1"
          onClick={() =>
            navigate(
              currentUser.role === "seller"
                ? "/seller-dashboard"
                : "/buyer-dashboard"
            )
          }
        >
          Dashboard
        </Menu.Item>
      </Menu>
      <div style={{ float: "right" }}>
        {currentUser.role === "seller" && (
          <Button
            type="primary"
            style={{ marginRight: 10 }}
            onClick={onAddProperty}
          >
            Add Property
          </Button>
        )}
        <Button
          type="primary"
          danger
          icon={<LogoutOutlined />}
          onClick={showLogoutModal}
        >
          Logout
        </Button>
      </div>
      <Modal
        title="Confirm Logout"
        visible={isLogoutModalVisible}
        onOk={handleLogout}
        onCancel={handleLogoutCancel}
        okText="Yes, Logout"
        cancelText="Cancel"
      >
        <p>Are you sure you want to logout?</p>
      </Modal>
    </Header>
  );
};

export default AppBar;
