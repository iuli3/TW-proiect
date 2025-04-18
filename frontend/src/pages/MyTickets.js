import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  Container,
  Card,
  Spinner,
  Alert,
  Image,
  Button,
  Accordion
} from "react-bootstrap";
import { format } from "date-fns";
import html2pdf from "html2pdf.js";
import { QRCodeSVG } from "qrcode.react";
import "./MyTickets.css";
import logo from "../assets/logo.png";

const MyTickets = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchOrders = async () => {
      const token = localStorage.getItem("token");

      try {
        const res = await axios.get("http://localhost:5000/api/payment", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setOrders(res.data);
      } catch (err) {
        console.error("Error fetching orders:", err);
        setError("Failed to load your orders.");
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  const handleDownloadPDF = (orderId) => {
    const element = document.getElementById(`order-${orderId}`);
    const accordions = element.querySelectorAll(".accordion-collapse");
    accordions.forEach((acc) => acc.classList.add("show"));
    element.classList.add("pdf-preview");

    const opt = {
      margin: 0,
      filename: `ticket-order-${orderId}.pdf`,
      image: { type: "jpeg", quality: 0.98 },
      html2canvas: {
        scale: 2,
        backgroundColor: null,
      },
      jsPDF: { unit: "in", format: "letter", orientation: "portrait" },
    };

    setTimeout(() => {
      html2pdf().from(element).set(opt).save().then(() => {
        element.classList.remove("pdf-preview");
        accordions.forEach((acc) => acc.classList.remove("show"));
      });
    }, 100);
  };

  if (loading) {
    return (
      <Container className="py-5 text-center">
        <Spinner animation="border" />
        <p>Loading your orders...</p>
      </Container>
    );
  }

  if (error) {
    return (
      <Container className="py-5">
        <Alert variant="danger">{error}</Alert>
      </Container>
    );
  }

  return (
    <Container className="py-5 my-tickets-container">
      <h2 className="mb-4 fw-bold my-tickets-title">
        🎫 My Orders <span className="eventix-highlight">- Eventix</span>
      </h2>

      {orders.length === 0 ? (
        <Alert variant="info" className="text-center">
          You have no orders yet.
        </Alert>
      ) : (
        orders.map((order, idx) => (
          <Card
            key={idx}
            id={`order-${order._id}`}
            className="mb-5 p-4 shadow-lg order-card"
          >
            <div className="d-flex justify-content-between align-items-center mb-4 order-header">
              <h3 className="order-title">🎫 Eventix - Official Ticket</h3>
              <img src={logo} alt="logo" className="order-logo" />
            </div>

            <div className="d-flex justify-content-between align-items-start mb-3 order-details">
              <div>
                <h5 className="fw-bold text-uppercase order-event-title">
                  {order.items[0]?.event?.title || "Unknown Event"}
                </h5>
                <small className="text-muted order-date">
                  Order placed on {format(new Date(order.createdAt), "d MMMM yyyy, HH:mm")}
                </small>
              </div>
              <Image
                src={order.items[0]?.event?.imageUrl || "https://via.placeholder.com/200x140?text=No+Image"}
                alt="event"
                className="order-event-image"
              />
            </div>

            <p className="fw-semibold order-total">
              <strong>Total:</strong> {order.total} lei
            </p>

            <div className="ticket-items mb-3">
              <Accordion>
                {order.items.map((item, i) => (
                  <Accordion.Item eventKey={i.toString()} key={i}>
                    <Accordion.Header>
                      <span className="fw-bold me-2">{item.quantity}x</span>
                      {item.ticketType} — <strong>{item.event?.title || "Unknown Event"}</strong>
                    </Accordion.Header>
                    <Accordion.Body className="text-center">
                      <p className="mb-2 fw-semibold">Price: {item.price} lei</p>
                      <p className="fw-bold mb-3">QR Codes for validation:</p>
                      <div className="qr-grid">
                        {Array.from({ length: item.quantity }).map((_, idx) => (
                          <div key={idx}>
                            <QRCodeSVG
                              value={`Ticket ${idx + 1} / ${item.quantity} - ${item.ticketType} - ${item.event?.title}`}
                              size={100}
                            />
                            <small className="d-block mt-2">#{idx + 1}</small>
                          </div>
                        ))}
                      </div>
                    </Accordion.Body>
                  </Accordion.Item>
                ))}
              </Accordion>
            </div>

            <div className="text-end">
              <Button
                className="download-pdf-button"
                onClick={() => handleDownloadPDF(order._id)}
              >
                Download Ticket as PDF
              </Button>
            </div>
          </Card>
        ))
      )}
    </Container>
  );
};

export default MyTickets;
