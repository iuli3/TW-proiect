import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { Form, Button, Container, Alert, Row, Col } from "react-bootstrap";
import "./AddEvent.css";
import "bootstrap/dist/css/bootstrap.min.css";

const AddEvent = () => {
  const navigate = useNavigate();
  const [eventData, setEventData] = useState({
    title: "",
    description: "",
    location: "",
    eventDate: "",
    eventTime: "",
    imageType: "upload",
    imageFile: null,
    imageUrl: "",
    ticketTypes: [],
    category: ""
  });

  const [ticket, setTicket] = useState({ type: "", price: "", quantity: "" });
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setEventData({ ...eventData, [name]: value });
  };

  const handleFileChange = (e) => {
    setEventData({ ...eventData, imageFile: e.target.files[0] });
  };

  const handleImageTypeChange = (e) => {
    setEventData({ ...eventData, imageType: e.target.value });
  };

  const addTicket = () => {
    if (ticket.type && ticket.price && ticket.quantity) {
      setEventData({ ...eventData, ticketTypes: [...eventData.ticketTypes, ticket] });
      setTicket({ type: "", price: "", quantity: "" });
    } else {
      setError("Please complete all ticket fields!");
    }
  };

  const removeTicket = (index) => {
    const newTickets = eventData.ticketTypes.filter((_, i) => i !== index);
    setEventData({ ...eventData, ticketTypes: newTickets });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");
    setError("");

    const formData = new FormData();
    formData.append("title", eventData.title);
    formData.append("description", eventData.description);
    formData.append("location", eventData.location);
    formData.append("eventDate", eventData.eventDate);
    formData.append("eventTime", eventData.eventTime);
    formData.append("ticketTypes", JSON.stringify(eventData.ticketTypes));
    formData.append("category", eventData.category);

    if (eventData.imageType === "upload" && eventData.imageFile) {
      formData.append("image", eventData.imageFile);
    } else if (eventData.imageType === "url" && eventData.imageUrl) {
      formData.append("imageUrl", eventData.imageUrl);
    }

    try {
      const token = localStorage.getItem("token");
      await axios.post("http://localhost:5000/api/events/create", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${token}`,
        },
      });

      setMessage("Event added successfully!");
      navigate("/");
    } catch (err) {
      console.log(err.response);
      setError("Failed to add event. Please check the provided data.");
    }
  };

  return (
    <div className="add-event-wrapper">
      <Container className="add-event-container">
        <h2 className="form-title text-center">Add Event</h2>
        {message && <Alert variant="success">{message}</Alert>}
        {error && <Alert variant="danger">{error}</Alert>}
        <Form onSubmit={handleSubmit} className="event-form">
          <Row>
            <Col md={6}>
              <Form.Group className="mb-3">
                <Form.Label>Title</Form.Label>
                <Form.Control type="text" name="title" value={eventData.title} onChange={handleChange} required />
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label>Description</Form.Label>
                <Form.Control as="textarea" rows={4} name="description" value={eventData.description} onChange={handleChange} required />
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label>Location</Form.Label>
                <Form.Control type="text" name="location" value={eventData.location} onChange={handleChange} required />
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label>Date</Form.Label>
                <Form.Control type="date" name="eventDate" value={eventData.eventDate} onChange={handleChange} required />
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label>Time</Form.Label>
                <Form.Control type="time" name="eventTime" value={eventData.eventTime} onChange={handleChange} required />
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label>Category</Form.Label>
                <Form.Select name="category" value={eventData.category} onChange={handleChange} required>
                  <option value="">Select a category</option>
                  <option value="Muzică">Muzică</option>
                  <option value="Teatru">Teatru</option>
                  <option value="Sport">Sport</option>
                  <option value="Stand-up">Stand-up</option>
                  <option value="Business">Business</option>
                  <option value="Festival">Festival</option>
                </Form.Select>
              </Form.Group>
            </Col>

            <Col md={6}>
              <Form.Group className="mb-3">
                <Form.Label>Image Type</Form.Label>
                <div className="d-flex gap-3">
                  <Form.Check type="radio" label="Upload" value="upload" checked={eventData.imageType === "upload"} onChange={handleImageTypeChange} />
                  <Form.Check type="radio" label="URL" value="url" checked={eventData.imageType === "url"} onChange={handleImageTypeChange} />
                </div>
              </Form.Group>

              {eventData.imageType === "upload" ? (
                <Form.Group className="mb-3">
                  <Form.Label>Upload Image</Form.Label>
                  <Form.Control type="file" onChange={handleFileChange} />
                </Form.Group>
              ) : (
                <Form.Group className="mb-3">
                  <Form.Label>Image URL</Form.Label>
                  <Form.Control type="text" name="imageUrl" value={eventData.imageUrl} onChange={handleChange} />
                </Form.Group>
              )}

              <h4>Ticket Types</h4>
              {eventData.ticketTypes.map((t, index) => (
                <div key={index} className="ticket-preview d-flex justify-content-between align-items-center mb-2">
                  <span>{t.type} - {t.price} lei ({t.quantity} available)</span>
                  <Button variant="danger" size="sm" onClick={() => removeTicket(index)}>Delete</Button>
                </div>
              ))}

              <Form.Group className="mb-3">
                <Form.Label>Ticket Type</Form.Label>
                <Form.Control type="text" placeholder="e.g. VIP, Standard" value={ticket.type} onChange={(e) => setTicket({ ...ticket, type: e.target.value })} />
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label>Price</Form.Label>
                <Form.Control type="number" placeholder="e.g. 50" value={ticket.price} onChange={(e) => setTicket({ ...ticket, price: e.target.value })} />
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label>Quantity</Form.Label>
                <Form.Control type="number" placeholder="e.g. 100" value={ticket.quantity} onChange={(e) => setTicket({ ...ticket, quantity: e.target.value })} />
              </Form.Group>

              <Button onClick={addTicket} className="mb-3">Add Ticket</Button>

              <div className="d-grid">
                <Button type="submit" variant="primary">Add Event</Button>
              </div>
            </Col>
          </Row>
        </Form>
      </Container>
    </div>
  );
};

export default AddEvent;
