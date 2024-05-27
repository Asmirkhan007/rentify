// src/components/BuyerDashboardPage.jsx
import React, { useEffect, useState } from "react";
import {
  Card,
  Button,
  message,
  Input,
  Row,
  Col,
  Modal,
  Pagination,
  Select,
  Empty,
} from "antd";
import { LikeOutlined, LikeFilled } from "@ant-design/icons";
import axios from "axios";
import placeholderImage from "../assets/svg/property.webp";
import { useAuth } from "../auth/AuthContext";
import { useLoading } from "../context/LoadingContext";
import AppBar from "./AppBar";

const { Meta } = Card;
const { Search } = Input;
const { Option } = Select;

const BuyerDashboardPage = () => {
  const [properties, setProperties] = useState([]);
  const [filteredProperties, setFilteredProperties] = useState([]);
  const [sellerDetails, setSellerDetails] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize] = useState(8);
  const [filters, setFilters] = useState({
    place: "",
    bedrooms: "",
    bathrooms: "",
  });
  const { currentUser } = useAuth();
  const { setLoading } = useLoading();

  // Environment variable for backend URL
  const backendUrl = import.meta.env.VITE_BACKEND_URL || '/api';

  useEffect(() => {
    fetchProperties();
  }, []);

  useEffect(() => {
    applyFilters();
  }, [filters]);

  const fetchProperties = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`${backendUrl}/properties`);
      console.log("Fetched properties:", response.data);
      if (Array.isArray(response.data)) {
        setProperties(response.data);
        setFilteredProperties(response.data);
      } else {
        message.error("Unexpected data format from API");
      }
    } catch (error) {
      console.error("Failed to fetch properties", error);
      message.error("Failed to load properties");
    } finally {
      setLoading(false);
    }
  };

  // Other functions (handleLike, handleInterest) should also use `${backendUrl}` for API requests
  // Example for handleLike:
  const handleLike = async (id) => {
    setLoading(true);
    try {
      if (!currentUser || !currentUser.token) {
        throw new Error("User not authenticated");
      }
      await axios.patch(
        `${backendUrl}/properties/${id}/like`,
        {},
        {
          headers: {
            Authorization: `Bearer ${currentUser.token}`,
          },
        }
      );
      // Update the properties state as previously done
    } catch (error) {
      console.error("Failed to like property", error);
      message.error("Failed to like property");
    } finally {
      setLoading(false);
    }
  };

  // Continue with other parts of the component as before

  return (
    // JSX as previously defined
  );
};

export default BuyerDashboardPage;
