// src/components/HomePage.jsx
import React, { useEffect, useState } from "react";
import { Card, Col, Row, message } from "antd";
import { useAuth } from "../auth/AuthContext";
import axios from "axios";

function HomePage() {
  const [properties, setProperties] = useState([]);
  const { currentUser } = useAuth();

  useEffect(() => {
    // Fetch properties from the backend (replace with your API endpoint)
    const fetchProperties = async () => {
      try {
        const response = await axios.get("/api/properties");
        setProperties(response.data);
      } catch (error) {
        console.error("Failed to fetch properties", error);
        message.error("Failed to load properties");
      }
    };

    fetchProperties();
  }, []);

  return (
    <div className="p-5">
      <h1 className="text-center text-2xl font-bold mb-5">Property Listings</h1>
      <Row gutter={[16, 16]}>
        {properties.map((property) => (
          <Col key={property.id} xs={24} sm={12} md={8} lg={6}>
            <Card title={property.title} bordered={false}>
              <p>{property.description}</p>
              <p>
                <strong>Location:</strong> {property.location}
              </p>
              <p>
                <strong>Price:</strong> ${property.price}
              </p>
              {/* Add more property details as needed */}
            </Card>
          </Col>
        ))}
      </Row>
    </div>
  );
}

export default HomePage;
