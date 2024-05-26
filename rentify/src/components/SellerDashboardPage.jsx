// src/components/SellerDashboardPage.jsx
import React, { useEffect, useState } from "react";
import {
  Card,
  Button,
  message,
  Row,
  Col,
  Modal,
  Form,
  Input,
  Layout,
  Pagination,
  Empty,
} from "antd";
import {
  collection,
  addDoc,
  getDocs,
  query,
  where,
  doc,
  updateDoc,
  deleteDoc,
} from "firebase/firestore";
import { db } from "../firebaseConfig";
import placeholderImage from "../assets/svg/property.webp";
import { useAuth } from "../auth/AuthContext";
import { useLoading } from "../context/LoadingContext"; // Import useLoading
import AppBar from "./AppBar"; // Import AppBar

const { Content } = Layout;
const { Meta } = Card;

const SellerDashboardPage = () => {
  const [properties, setProperties] = useState([]);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isDeleteModalVisible, setIsDeleteModalVisible] = useState(false);
  const [propertyToDelete, setPropertyToDelete] = useState(null);
  const [editingProperty, setEditingProperty] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize] = useState(8); // Set the number of cards per page
  const { currentUser } = useAuth();
  const { setLoading } = useLoading(); // Get setLoading from useLoading

  useEffect(() => {
    if (currentUser) {
      fetchProperties();
    }
  }, [currentUser]);

  const fetchProperties = async () => {
    setLoading(true); // Start loading
    if (!currentUser) return;

    try {
      const q = query(
        collection(db, "properties"),
        where("ownerId", "==", currentUser.uid)
      );
      const querySnapshot = await getDocs(q);
      const propertiesData = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setProperties(propertiesData);
    } catch (error) {
      console.error("Failed to fetch properties", error);
      message.error("Failed to load properties");
    } finally {
      setLoading(false); // End loading
    }
  };

  const handleAdd = () => {
    setEditingProperty(null);
    setIsModalVisible(true);
  };

  const handleEdit = (property) => {
    setEditingProperty(property);
    setIsModalVisible(true);
  };

  const handleDelete = async () => {
    if (!propertyToDelete) return;

    setLoading(true); // Start loading
    try {
      await deleteDoc(doc(db, "properties", propertyToDelete));
      message.success("Property deleted");
      fetchProperties();
      setIsDeleteModalVisible(false);
    } catch (error) {
      console.error("Failed to delete property", error);
      message.error("Failed to delete property");
    } finally {
      setLoading(false); // End loading
      setPropertyToDelete(null);
    }
  };

  const showDeleteModal = (id) => {
    setPropertyToDelete(id);
    setIsDeleteModalVisible(true);
  };

  const handleDeleteCancel = () => {
    setIsDeleteModalVisible(false);
    setPropertyToDelete(null);
  };

  const handleModalCancel = () => {
    setIsModalVisible(false);
  };

  const handleFormSubmit = async (values) => {
    setLoading(true); // Start loading
    try {
      if (editingProperty) {
        await updateDoc(doc(db, "properties", editingProperty.id), values);
        message.success("Property updated");
      } else {
        await addDoc(collection(db, "properties"), {
          ...values,
          ownerId: currentUser.uid,
        });
        message.success("Property added");
      }
      fetchProperties();
      setIsModalVisible(false);
    } catch (error) {
      console.error("Failed to save property", error);
      message.error("Failed to save property");
    } finally {
      setLoading(false); // End loading
    }
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const currentData = properties.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );

  return (
    <Layout style={{ minHeight: "100vh" }}>
      <AppBar onAddProperty={handleAdd} />
      <Content style={{ padding: "0 50px", marginTop: 64 }}>
        {properties.length === 0 ? (
          <div style={{ textAlign: "center", marginTop: 50 }}>
            <Empty
              description={
                <span>
                  No properties added. Use the "Add Property" button to add a
                  new property.
                </span>
              }
            >
              <Button type="primary" onClick={handleAdd}>
                Add Property
              </Button>
            </Empty>
          </div>
        ) : (
          <>
            <Row gutter={[16, 16]} style={{ marginTop: 20 }}>
              {currentData.map((property) => (
                <Col xs={24} sm={12} md={8} lg={6} key={property.id}>
                  <Card
                    hoverable
                    cover={<img alt="property" src={placeholderImage} />}
                    actions={[
                      <Button
                        type="primary"
                        style={{
                          backgroundColor: "#1890ff",
                          borderColor: "#1890ff",
                        }}
                        onClick={() => handleEdit(property)}
                      >
                        Edit
                      </Button>,
                      <Button
                        type="primary"
                        danger
                        onClick={() => showDeleteModal(property.id)}
                      >
                        Delete
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
              total={properties.length}
              onChange={handlePageChange}
              style={{ marginTop: 20, textAlign: "center" }}
            />
          </>
        )}
        <Modal
          title={editingProperty ? "Edit Property" : "Add Property"}
          visible={isModalVisible}
          onCancel={handleModalCancel}
          footer={null}
        >
          <PropertyForm
            initialValues={editingProperty}
            onSubmit={handleFormSubmit}
          />
        </Modal>
        <Modal
          title="Confirm Delete"
          visible={isDeleteModalVisible}
          onOk={handleDelete}
          onCancel={handleDeleteCancel}
          okText="Yes, Delete"
          cancelText="Cancel"
        >
          <p>Are you sure you want to delete this property?</p>
        </Modal>
      </Content>
    </Layout>
  );
};

const PropertyForm = ({ initialValues, onSubmit }) => {
  const [form] = Form.useForm();

  useEffect(() => {
    form.resetFields();
  }, [initialValues, form]);

  return (
    <Form
      form={form}
      layout="vertical"
      initialValues={initialValues}
      onFinish={onSubmit}
    >
      <Form.Item name="place" label="Place" rules={[{ required: true }]}>
        <Input />
      </Form.Item>
      <Form.Item name="area" label="Area" rules={[{ required: true }]}>
        <Input />
      </Form.Item>
      <Form.Item
        name="numberOfBedrooms"
        label="Number of Bedrooms"
        rules={[{ required: true }]}
      >
        <Input type="number" />
      </Form.Item>
      <Form.Item
        name="numberOfBathrooms"
        label="Number of Bathrooms"
        rules={[{ required: true }]}
      >
        <Input type="number" />
      </Form.Item>
      <Form.Item name="nearbyHospitals" label="Nearby Hospitals">
        <Input />
      </Form.Item>
      <Form.Item name="nearbyColleges" label="Nearby Colleges">
        <Input />
      </Form.Item>
      <Button type="primary" htmlType="submit">
        Save
      </Button>
    </Form>
  );
};

export default SellerDashboardPage;
