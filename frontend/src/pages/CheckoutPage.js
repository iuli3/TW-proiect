import React, { useState } from "react";
import { useCart } from "../context/CartContext";
import { Container, Row, Col, Card, Form, Button, Spinner, Alert } from "react-bootstrap";
import { FaCcVisa, FaCcMastercard } from "react-icons/fa";
import { Link } from "react-router-dom";
import axios from "axios";
import "./CheckoutPage.css";

const CheckoutPage = () => {
  const { cartItems, clearCart } = useCart();
  const [form, setForm] = useState({
    name: "",
    cardNumber: "",
    expiry: "",
    cvv: "",
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState(null);
  const [submitted, setSubmitted] = useState(false);

  const total = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);

  const fakeEncrypt = (data) => btoa(data);

  const validateCard = () => {
    const { name, cardNumber, expiry, cvv } = form;
    const cleaned = cardNumber.replace(/\s+/g, "");

    const cardRegex = /^\d{16}$/;
    const expiryRegex = /^(0[1-9]|1[0-2])\/\d{2}$/;
    const cvvRegex = /^\d{3}$/;

    if (!name || !cardRegex.test(cleaned) || !expiryRegex.test(expiry) || !cvvRegex.test(cvv)) {
      return false;
    }
    return true;
  };

  const handleExpiryChange = (e) => {
    let value = e.target.value.replace(/[^\d]/g, "");
    if (value.length >= 3) {
      value = value.slice(0, 2) + "/" + value.slice(2, 4);
    }
    setForm({ ...form, expiry: value.slice(0, 5) });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateCard()) {
      setMessage({ type: "danger", text: "Invalid card details." });
      return;
    }

    setLoading(true);
    setMessage(null);
    setSubmitted(true);

    const token = localStorage.getItem("token");
    const encryptedData = {
      cardName: fakeEncrypt(form.name),
      cardNumber: fakeEncrypt(form.cardNumber.replace(/\s+/g, "")),
      expDate: fakeEncrypt(form.expiry),
      cvv: fakeEncrypt(form.cvv),
      cartItems
    };

    setTimeout(async () => {
      try {
        await axios.post("http://localhost:5000/api/payment", encryptedData, {
          headers: { Authorization: `Bearer ${token}` }
        });

        setMessage({
          type: "success",
          text: (
            <div className="text-center">
              <h5>✅ Payment successfully processed!</h5>
              <p>
                Please check your order in the <Link to="/myTickets"><strong>My Tickets</strong></Link> section.
              </p>
            </div>
          )
        });
        clearCart();
      } catch (err) {
        console.error("❌ Payment error:", err);
        setMessage({ type: "danger", text: "❌ Error while processing payment." });
      } finally {
        setLoading(false);
      }
    }, 2000);
  };

  return (
    <div className="checkout-wrapper">
      <Container className="checkout-container py-5 d-flex justify-content-center align-items-center" style={{ minHeight: "60vh" }}>
        {loading && submitted ? (
          <Card className="p-5 text-center shadow" style={{ maxWidth: "500px", width: "100%" }}>
            <Spinner animation="border" role="status" className="mb-3" />
            <h5 style={{ fontWeight: 600 }}>Contacting bank...</h5>
          </Card>
        ) : message && message.type === "success" ? (
          <Card className="p-4 text-center shadow" style={{ maxWidth: "600px", width: "100%" }}>{message.text}</Card>
        ) : (
          <Row>
            <Col md={6}>
              <h2 className="mb-3">Your Cart</h2>
              {cartItems.length === 0 ? (
                <p>Your cart is empty.</p>
              ) : (
                <Card className="mb-3 p-3 shadow-sm">
                  {cartItems.map((item, idx) => (
                    <div key={idx} className="mb-3 border-bottom pb-2">
                      <strong>{item.eventTitle}</strong>
                      <p className="mb-1">Ticket type: <em>{item.ticketType}</em></p>
                      <p className="mb-1">Quantity: {item.quantity}</p>
                      <p className="mb-1">Price per ticket: {item.price} lei</p>
                      <p className="fw-bold">Total: {item.quantity * item.price} lei</p>
                    </div>
                  ))}
                  <h5 className="text-end mt-3">Total: {total} lei</h5>
                </Card>
              )}
            </Col>

            <Col md={6}>
              <Card className="p-4 shadow-sm text-center">
                <div className="d-flex align-items-center gap-2 mb-3">
                  <FaCcVisa size={36} color="#1a1f71" />
                  <FaCcMastercard size={36} color="#eb001b" />
                </div>
                <h4 className="mb-3">Payment Details</h4>
                {message && message.type !== "success" && <Alert variant={message.type}>{message.text}</Alert>}
                <Form onSubmit={handleSubmit}>
                  <Form.Group className="mb-3">
                    <Form.Label>Name on card</Form.Label>
                    <Form.Control
                      type="text"
                      placeholder="e.g. John Doe"
                      required
                      value={form.name}
                      onChange={(e) => setForm({ ...form, name: e.target.value })}
                    />
                  </Form.Group>

                  <Form.Group className="mb-3">
                    <Form.Label>Card number</Form.Label>
                    <Form.Control
                      type="text"
                      placeholder="1234567812345678"
                      required
                      value={form.cardNumber}
                      onChange={(e) => setForm({ ...form, cardNumber: e.target.value })}
                    />
                  </Form.Group>

                  <Row>
                    <Col>
                      <Form.Group className="mb-3">
                        <Form.Label>Expiry date</Form.Label>
                        <Form.Control
                          type="text"
                          placeholder="MM/YY"
                          required
                          value={form.expiry}
                          onChange={handleExpiryChange}
                        />
                      </Form.Group>
                    </Col>
                    <Col>
                      <Form.Group className="mb-3">
                        <Form.Label>CVV</Form.Label>
                        <Form.Control
                          type="text"
                          placeholder="123"
                          required
                          value={form.cvv}
                          onChange={(e) => setForm({ ...form, cvv: e.target.value })}
                        />
                      </Form.Group>
                    </Col>
                  </Row>

                  <Button
                    type="submit"
                    variant="success"
                    className="w-100 d-flex justify-content-center align-items-center"
                    style={{ backgroundColor: "#178582", borderColor: "#178582", fontWeight: 600 }}
                    disabled={loading}
                  >
                    Pay Now
                  </Button>
                </Form>
              </Card>
            </Col>
          </Row>
        )}
      </Container>
    </div>
  );
};

export default CheckoutPage;
