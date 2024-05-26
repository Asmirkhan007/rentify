import { useState } from "react";
import { Button, Form, Input, message, Radio, Spin } from "antd";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../auth/AuthContext";
import { useLoading } from "../context/LoadingContext"; // Import useLoading
import login_illustration from "../assets/svg/login_illustration.svg";

function SignupPage() {
  const [form] = Form.useForm();
  const navigate = useNavigate();
  const { signup } = useAuth();
  const { setLoading } = useLoading(); // Get setLoading from useLoading

  const handleSubmit = async (values) => {
    if (values.password !== values.confirmPassword) {
      message.error("Passwords do not match!");
      return;
    }

    setLoading(true); // Start loading
    try {
      await signup(
        values.email,
        values.password,
        values.firstName,
        values.lastName,
        values.phoneNumber,
        values.role
      );
    } catch (error) {
      console.error("Signup error:", error);
      message.error("An error occurred during sign up.");
    } finally {
      setLoading(false); // End loading
    }
  };

  return (
    <div className="flex h-screen bg-white">
      <div className="hidden lg:flex lg:w-1/2 items-center justify-center p-5 bg-indigo-200">
        <img
          src={login_illustration}
          alt="Sign up Illustration"
          className="object-cover"
        />
      </div>
      <div className="flex flex-1 items-center justify-center p-5 overflow-y-auto">
        <div className="w-full max-w-md mt-20">
          {" "}
          {/* Added mt-10 for top margin */}
          <div className="mb-8">
            <h1 className="font-semibold text-gray-700">Sign Up</h1>
          </div>
          <Form
            layout="vertical"
            onFinish={handleSubmit}
            className="space-y-4"
            form={form}
          >
            <Form.Item
              label="First Name"
              name="firstName"
              rules={[
                { required: true, message: "Please input your first name!" },
              ]}
            >
              <Input
                placeholder="Enter your first name"
                className="rounded-none h-10"
              />
            </Form.Item>
            <Form.Item
              label="Last Name"
              name="lastName"
              rules={[
                { required: true, message: "Please input your last name!" },
              ]}
            >
              <Input
                placeholder="Enter your last name"
                className="rounded-none h-10"
              />
            </Form.Item>
            <Form.Item
              label="Email"
              name="email"
              rules={[{ required: true, message: "Please input your email!" }]}
            >
              <Input
                type="email"
                placeholder="Enter your email"
                className="rounded-none h-10"
              />
            </Form.Item>
            <Form.Item
              label="Phone Number"
              name="phoneNumber"
              rules={[
                { required: true, message: "Please input your phone number!" },
              ]}
            >
              <Input
                placeholder="Enter your phone number"
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
                placeholder="Enter your password"
                className="rounded-none h-10"
              />
            </Form.Item>
            <Form.Item
              label="Confirm Password"
              name="confirmPassword"
              rules={[
                { required: true, message: "Please confirm your password!" },
                {
                  min: 6,
                  message: "Password must be at least 6 characters long!",
                },
              ]}
            >
              <Input.Password
                placeholder="Confirm your password"
                className="rounded-none h-10"
              />
            </Form.Item>
            <Form.Item
              name="role"
              label="Role"
              rules={[{ required: true, message: "Please select your role!" }]}
            >
              <Radio.Group>
                <Radio value="buyer">Buyer</Radio>
                <Radio value="seller">Seller</Radio>
              </Radio.Group>
            </Form.Item>
            <Button
              type="primary"
              htmlType="submit"
              className="w-full h-10 rounded-none"
            >
              Sign Up
            </Button>
            <Button
              type="default"
              className="w-full h-10 rounded-none mt-4"
              onClick={() => navigate("/login")}
            >
              Cancel
            </Button>
          </Form>
          <p className="mt-6 text-center">
            {`Already have an account? `}
            <Link to="/login" className="text-blue-600 hover:underline">
              Login
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}

export default SignupPage;
