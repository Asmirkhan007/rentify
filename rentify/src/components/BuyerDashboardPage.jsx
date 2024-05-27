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
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize] = useState(8);
  const [filters, setFilters] = useState({
    place: "",
    bedrooms: "",
    bathrooms: "",
  });
  const { currentUser } = useAuth();
  const { setLoading } = useLoading();
  const backendUrl = import.meta.env.VITE_BACKEND_URL || "/api";

  useEffect(() => {
    fetchProperties();
  }, []);

  useEffect(() => {
    applyFilters();
  }, [filters, properties]);

  const fetchProperties = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`${backendUrl}/properties`);
      setProperties(response.data);
      setFilteredProperties(response.data);
    } catch (error) {
      console.error("Failed to fetch properties", error);
      message.error("Failed to load properties");
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (value) => {
    setFilters((prevFilters) => ({ ...prevFilters, place: value }));
  };

  const handleFilterChange = (filterName, value) => {
    setFilters((prevFilters) => ({ ...prevFilters, [filterName]: value }));
  };

  const applyFilters = () => {
    const { place, bedrooms, bathrooms } = filters;
    const filtered = properties.filter((property) => {
      return (
        property.place.toLowerCase().includes(place.toLowerCase()) &&
        (bedrooms ? property.numberOfBedrooms.toString() === bedrooms : true) &&
        (bathrooms ? property.numberOfBathrooms.toString() === bathrooms : true)
      );
    });
    setFilteredProperties(filtered);
    setCurrentPage(1);
  };

  const handleLike = async (id) => {
    setLoading(true);
    try {
      if (!currentUser || !currentUser.token) {
        throw new Error("User not authenticated");
      }
      const property = properties.find((property) => property.id === id);
      const isLiked = property.likedBy.includes(currentUser.uid);

      await axios.patch(
        `${backendUrl}/properties/${id}/like`,
        {
          likedBy: isLiked
            ? property.likedBy.filter((uid) => uid !== currentUser.uid)
            : [...property.likedBy, currentUser.uid],
        },
        {
          headers: {
            Authorization: `Bearer ${currentUser.token}`,
          },
        }
      );

      setProperties((prevProperties) =>
        prevProperties.map((property) =>
          property.id === id
            ? {
                ...property,
                likeCount: property.likeCount + (isLiked ? -1 : 1),
                likedBy: isLiked
                  ? property.likedBy.filter((uid) => uid !== currentUser.uid)
                  : [...property.likedBy, currentUser.uid],
              }
            : property
        )
      );

      message.success(`Property ${isLiked ? "unliked" : "liked"}!`);
    } catch (error) {
      console.error("Failed to like property", error);
      message.error("Failed to like property");
    } finally {
      setLoading(false);
    }
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const currentData = filteredProperties.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );

  return (
    <div>
      <AppBar />
      <div style={{ padding: "20px" }}>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: "20px",
          }}
        >
          <Search
            placeholder="Search by place"
            onSearch={handleSearch}
            enterButton
            style={{ width: 400 }}
          />
          <div>
            <Select
              placeholder="Bedrooms"
              style={{ width: 120, marginRight: 10 }}
              onChange={(value) => handleFilterChange("bedrooms", value)}
              allowClear
            >
              <Option value="1">1</Option>
              <Option value="2">2</Option>
              <Option value="3">3</Option>
              <Option value="4">4</Option>
              <Option value="5">5</Option>
            </Select>
            <Select
              placeholder="Bathrooms"
              style={{ width: 120 }}
              onChange={(value) => handleFilterChange("bathrooms", value)}
              allowClear
            >
              <Option value="1">1</Option>
              <Option value="2">2</Option>
              <Option value="3">3</Option>
              <Option value="4">4</Option>
              <Option value="5">5</Option>
            </Select>
          </div>
        </div>
        <Row gutter={[16, 16]}>
          {currentData.map((property) => (
            <Col xs={24} sm={12} md={8} lg={6} key={property.id}>
              <Card
                hoverable
                cover={<img alt="property" src={placeholderImage} />}
                actions={[
                  <Button
                    type="primary"
                    onClick={() => handleLike(property.id)}
                    icon={
                      property.likedBy.includes(currentUser.uid) ? (
                        <LikeFilled />
                      ) : (
                        <LikeOutlined />
                      )
                    }
                  >
                    {property.likeCount}
                  </Button>,
                ]}
              >
                <Meta
                  title={property.place}
                  description={`Area: ${property.area}, Bedrooms: ${property.numberOfBedrooms}, Bathrooms: ${property.numberOfBathrooms}`}
                />
              </Card>
            </Col>
          ))}
        </Row>
        <Pagination
          current={currentPage}
          pageSize={pageSize}
          total={filteredProperties.length}
          onChange={handlePageChange}
          style={{ marginTop: "20px", textAlign: "center" }}
        />
      </div>
    </div>
  );
};

export default BuyerDashboardPage;
