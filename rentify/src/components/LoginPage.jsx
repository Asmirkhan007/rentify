import { useState, useEffect } from "react";
import { Button, Form, Input, message, Spin } from "antd";
import { useNavigate, Link } from "react-router-dom";
import {
  GoogleOutlined,
  WindowsOutlined,
  AppleOutlined,
} from "@ant-design/icons";
import { useAuth } from "../auth/AuthContext";
import { useLoading } from "../context/LoadingContext"; // Import useLoading
import login_illustration from "../assets/svg/login_illustration.svg";

function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loginSuccess, setLoginSuccess] = useState(false);
  const navigate = useNavigate();
  const { login, currentUser } = useAuth();
  const { setLoading } = useLoading(); // Get setLoading from useLoading

  useEffect(() => {
    if (loginSuccess && currentUser) {
      const redirectTo =
        currentUser.role === "seller"
          ? "/seller-dashboard"
          : "/buyer-dashboard";
      navigate(redirectTo, { replace: true });
    }
  }, [currentUser, loginSuccess, navigate]);

  const handleSubmit = async (values) => {
    setLoading(true); // Start loading
    try {
      await login(values.email, values.password);
      setLoginSuccess(true);
      message.success("Login successful! Redirecting...");
    } catch (error) {
      console.error("Login error:", error);
      message.error("Login failed! Please check your credentials.");
      setLoginSuccess(false); // Ensure login success is false on error
    } finally {
      setLoading(false); // End loading
    }
  };

  const handleOAuthSignIn = (provider) => {
    const providerUrls = {
      google: "http://localhost:3000/auth/google",
      microsoft: "http://localhost:3000/auth/microsoft",
      apple: "http://localhost:3000/auth/apple",
    };

    window.location.href = providerUrls[provider];
  };

  return (
    <div className="flex h-screen bg-white p-5">
      <div className="hidden lg:flex lg:w-1/2 items-center justify-center p-5 bg-indigo-200">
        <img
          src={login_illustration}
          alt="Login Illustration"
          className="object-cover"
        />
      </div>
      <div className="flex flex-1 items-center justify-center p-5">
        <div className="w-full max-w-xs">
          <div className="mb-8">
            <h1 className="font-semibold text-gray-700">Sign in</h1>
          </div>
          <Form layout="vertical" onFinish={handleSubmit} className="space-y-6">
            <Form.Item
              label="Email"
              name="email"
              rules={[{ required: true, message: "Please input your email!" }]}
            >
              <Input
                type="text"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
                className="rounded-none h-10"
              />
            </Form.Item>
            <Form.Item
              label="Password"
              name="password"
              rules={[
                { required: true, message: "Please input your password!" },
                {
                  min: 6,
                  message: "Password must be at least 6 characters long!",
                },
              ]}
            >
              <Input.Password
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your password"
                className="rounded-none h-10"
              />
            </Form.Item>
            <Button
              type="primary"
              htmlType="submit"
              className="w-full h-10 rounded-none"
            >
              Sign In
            </Button>

            <div className="flex items-center justify-center mt-4">
              <div className="border-b w-1/4 mr-2"></div>
              <span>Or</span>
              <div className="border-b w-1/4 ml-2"></div>
            </div>
          </Form>

          <p className="mt-6 text-center">
            {`Don't have an account? `}
            <Link to="/signup" className="text-blue-600 hover:underline">
              Sign up
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}

export default LoginPage;
