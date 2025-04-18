import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  Container,
  Row,
  Col,
  Button,
  Offcanvas,
  Form,
  Tab,
  Nav,
  Image,
  Alert,
  Table,
} from "react-bootstrap";
import {
  FaList,
  FaUser,
  FaEdit,
  FaEnvelope,
  FaPhone,
  FaSignOutAlt,
  FaUserEdit,
  FaCamera,
} from "react-icons/fa";
import "./UserProfileLayout.css";

const UserProfileLayout = () => {
  const [user, setUser] = useState({});
  const [orders, setOrders] = useState([]);
  const [showCanvas, setShowCanvas] = useState(false);
  const [editField, setEditField] = useState(null);
  const [editValue, setEditValue] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      const token = localStorage.getItem("token");
      const headers = { Authorization: `Bearer ${token}` };
      const profileRes = await axios.get("http://localhost:5000/api/profile", { headers });
      setUser(profileRes.data);
      const orderRes = await axios.get("http://localhost:5000/api/payment", { headers });
      setOrders(orderRes.data);
    };
    fetchData();
  }, []);

  const handleEdit = (field) => {
    setEditField(field);
    setEditValue(user[field] || "");
    setShowCanvas(true);
  };

  const handleSave = async () => {
    if (!editValue.trim()) return alert("Field cannot be empty.");
    const token = localStorage.getItem("token");
    await axios.put(
      `http://localhost:5000/api/profile/update`,
      { [editField]: editValue },
      { headers: { Authorization: `Bearer ${token}` } }
    );
    setUser((prev) => ({ ...prev, [editField]: editValue }));
    setSuccessMessage(`✔️ '${editField}' was updated.`);
    setShowCanvas(false);
    setTimeout(() => setSuccessMessage(""), 3000);
  };

  return (
    <Container fluid className="user-profile-wrapper py-4 fixed-navbar">
      <Tab.Container defaultActiveKey="profile">
        <Nav variant="tabs" className="justify-content-center mb-4">
          <Nav.Item>
            <Nav.Link eventKey="profile"><FaUser className="me-2 text-warning" />USER ACCOUNT</Nav.Link>
          </Nav.Item>
          <Nav.Item>
            <Nav.Link eventKey="orders"><FaList className="me-2 text-warning" />ORDERS</Nav.Link>
          </Nav.Item>
        </Nav>

        <Tab.Content>
          <Tab.Pane eventKey="profile">
            <Row className="justify-content-center text-center">
              <Col md={12} className="user-profile-section">
                <Image
                  src={
                    user.profileImage ||
                    "https://img.freepik.com/premium-vector/man-avatar-profile-picture-vector-illustration_268834-541.jpg?w=360"
                  }
                  className="logo-img mb-3"
                  roundedCircle
                  style={{ width: "120px", height: "120px", objectFit: "cover" }}
                />
                <h4>{user.firstName} {user.lastName}</h4>
                <p>{user.email}</p>
                <p>{user.phone || <em style={{ color: "red" }}>Phone missing – please update</em>}</p>

                <div className="d-flex justify-content-center gap-2 mt-3 flex-wrap">
                  {user.role === "organizer" && (
                    <>
                      <Button size="sm" variant="outline-secondary" onClick={() => handleEdit("profileImage")}>
                        <FaCamera className="me-2" /> Change image
                      </Button>
                      <Button size="sm" variant="outline-secondary" onClick={() => handleEdit("firstName")}>
                        <FaUserEdit className="me-2" /> First name
                      </Button>
                      <Button size="sm" variant="outline-secondary" onClick={() => handleEdit("lastName")}>
                        <FaUserEdit className="me-2" /> Last name
                      </Button>
                      <Button size="sm" variant="outline-secondary" onClick={() => handleEdit("username")}>
                        <FaEdit className="me-2" /> Username
                      </Button>
                    </>
                  )}
                  <Button size="sm" variant="outline-secondary" onClick={() => handleEdit("email")}>
                    <FaEnvelope className="me-2" /> Change email
                  </Button>
                  <Button size="sm" variant="outline-secondary" onClick={() => handleEdit("phone")}>
                    <FaPhone className="me-2" /> Change phone
                  </Button>
                  <Button size="sm" variant="outline-dark">
                    <FaSignOutAlt className="me-2" /> Logout
                  </Button>
                </div>

                {successMessage && (
                  <Alert variant="success" className="mt-3">{successMessage}</Alert>
                )}
              </Col>
            </Row>
          </Tab.Pane>

          <Tab.Pane eventKey="orders">
            <Row className="justify-content-center">
              <Col md={10}>
                {orders.length === 0 ? (
                  <Alert variant="info" className="text-center">You have no orders.</Alert>
                ) : (
                  <Table striped bordered hover responsive className="text-center align-middle">
                    <thead className="table-dark">
                      <tr>
                        <th>#</th>
                        <th>Event</th>
                        <th>Ticket type</th>
                        <th>Quantity</th>
                        <th>Price</th>
                        <th>Total</th>
                        <th>Date</th>
                      </tr>
                    </thead>
                    <tbody>
                      {orders.map((order, idx) =>
                        order.items.map((item, i) => (
                          <tr key={`${order._id}-${i}`}>
                            <td>{idx + 1}.{i + 1}</td>
                            <td>{item.event?.title || "Unknown event"}</td>
                            <td>{item.ticketType}</td>
                            <td>{item.quantity}</td>
                            <td>{item.price} lei</td>
                            <td>{item.quantity * item.price} lei</td>
                            <td>{new Date(order.createdAt).toLocaleString("ro-RO")}</td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </Table>
                )}
              </Col>
            </Row>
          </Tab.Pane>
        </Tab.Content>
      </Tab.Container>

      <Offcanvas placement="end" show={showCanvas} onHide={() => setShowCanvas(false)}>
        <Offcanvas.Header closeButton>
          <Offcanvas.Title>Edit {editField}</Offcanvas.Title>
        </Offcanvas.Header>
        <Offcanvas.Body>
          <Form>
            <Form.Group>
              <Form.Label>{editField}</Form.Label>
              <Form.Control
                type="text"
                value={editValue}
                onChange={(e) => setEditValue(e.target.value)}
              />
            </Form.Group>
            <Button className="mt-3" onClick={handleSave}>Save</Button>
          </Form>
        </Offcanvas.Body>
      </Offcanvas>
    </Container>
  );
};

export default UserProfileLayout;
