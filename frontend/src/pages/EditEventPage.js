import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import {
  Container, Card, Row, Col, Button, ListGroup, Form, Alert
} from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faLocationDot, faCalendarDays, faTrash, faPlus, faIcons
} from "@fortawesome/free-solid-svg-icons";

import "./EventPage.css";

const EditEventPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [error, setError] = useState(null);
  const [ticketTypes, setTicketTypes] = useState([]);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [location, setLocation] = useState("");
  const [eventDate, setEventDate] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [reviews, setReviews] = useState([]);

  useEffect(() => {
    const token = localStorage.getItem("token");

    const fetchData = async () => {
      try {
        const eventRes = await axios.get(`http://localhost:5000/api/events/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        const eventData = eventRes.data;
        setTitle(eventData.title);
        setDescription(eventData.description);
        setLocation(eventData.location);
        setEventDate(new Date(eventData.eventDate).toISOString().slice(0, 16));
        setImageUrl(eventData.imageUrl);
        setTicketTypes(eventData.ticketTypes || []);

        const reviewsRes = await axios.get(`http://localhost:5000/api/reviews/organizer/${eventData.organizer._id}`);
        setReviews(reviewsRes.data);
      } catch (err) {
        setError("Error loading event data.");
        console.error(err);
      }
    };

    fetchData();
  }, [id]);

  const handleTicketChange = (index, field, value) => {
    setTicketTypes((prevTickets) => {
      const updatedTickets = [...prevTickets];
      updatedTickets[index][field] = value;
      return updatedTickets;
    });
  };

  const addTicketType = () => {
    setTicketTypes([...ticketTypes, { type: "", price: 0 }]);
  };

  const removeTicketType = (index) => {
    setTicketTypes((prevTickets) => {
      const updated = [...prevTickets];
      updated.splice(index, 1);
      return updated;
    });
  };

  const deleteReview = async (reviewId) => {
    const token = localStorage.getItem("token");

    try {
      await axios.delete(`http://localhost:5000/api/reviews/${reviewId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setReviews((prev) => prev.filter((r) => r._id !== reviewId));
      alert("Review deleted successfully.");
    } catch (error) {
      console.error("Error deleting review:", error);
      setError("Error deleting review.");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem("token");

    try {
      await axios.put(`http://localhost:5000/api/events/${id}`, {
        title,
        description,
        location,
        eventDate,
        imageUrl,
        ticketTypes,
      }, {
        headers: { Authorization: `Bearer ${token}` },
      });

      navigate(`/event/${id}`);
    } catch {
      setError("Error updating event.");
    }
  };

  if (error) return <Alert variant="danger">{error}</Alert>;

  return (
    <Container className="event-container">
      <div className="event-banner" style={{ backgroundImage: `url(${imageUrl})` }}>
        <div className="event-overlay">
          <h1 className="event-page-title text-white">{title}</h1>
          <p className="event-meta text-white">
            <FontAwesomeIcon icon={faCalendarDays} />{" "}
            {new Date(eventDate).toLocaleString("en-GB")} |{" "}
            <FontAwesomeIcon icon={faLocationDot} /> {location}
          </p>
        </div>
      </div>

      <Form onSubmit={handleSubmit}>
        <Card className="mt-3 text-center">
          <Card.Body>
            <Form.Group>
              <h2>
                <FontAwesomeIcon icon={faIcons} className="me-2" />
                <Form.Control
                  name="title"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="text-center fw-bold"
                />
              </h2>
            </Form.Group>
          </Card.Body>
        </Card>

        <Row className="mt-4">
          <Col md={8}>
            <Card className="event-description-card">
              <Card.Body>
                <h3>Edit Tickets</h3>
                <ListGroup className="mb-3">
                  {ticketTypes.map((ticket, index) => (
                    <ListGroup.Item key={index} className="d-flex justify-content-between align-items-center">
                      <Form.Control
                        type="text"
                        placeholder="Ticket type"
                        value={ticket.type}
                        onChange={(e) => handleTicketChange(index, "type", e.target.value)}
                        className="me-2"
                      />
                      <Form.Control
                        type="number"
                        step="any"
                        min="0"
                        placeholder="Price"
                        value={ticket.price}
                        onChange={(e) => handleTicketChange(index, "price", e.target.value)}
                        className="me-2"
                        style={{ width: "100px" }}
                      />
                      <Button variant="danger" size="sm" onClick={() => removeTicketType(index)}>
                        <FontAwesomeIcon icon={faTrash} />
                      </Button>
                    </ListGroup.Item>
                  ))}
                </ListGroup>
                <Button variant="outline-primary" onClick={addTicketType}>
                  <FontAwesomeIcon icon={faPlus} /> Add ticket type
                </Button>
              </Card.Body>
            </Card>

            <Card className="event-description-card mt-4">
              <Card.Body>
                <h3>Event Description</h3>
                <Form.Control
                  as="textarea"
                  rows={5}
                  name="description"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Enter event description..."
                  style={{ height: "500px" }}
                />
              </Card.Body>
            </Card>
          </Col>

          <Col md={4}>
            <Card className="event-location-card">
              <Card.Body>
                <Form.Group>
                  <Form.Label>Location</Form.Label>
                  <Form.Control
                    name="location"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                  />
                </Form.Group>

                <Form.Group className="mt-3">
                  <Form.Label>Date and Time</Form.Label>
                  <Form.Control
                    type="datetime-local"
                    name="eventDate"
                    value={eventDate}
                    onChange={(e) => setEventDate(e.target.value)}
                  />
                </Form.Group>

                <Form.Group className="mt-3">
                  <Form.Label>Image URL</Form.Label>
                  <Form.Control
                    name="imageUrl"
                    value={imageUrl}
                    onChange={(e) => setImageUrl(e.target.value)}
                    placeholder="https://example.com/image.jpg"
                  />
                </Form.Group>
              </Card.Body>
            </Card>
          </Col>
        </Row>

        <Card className="event-reviews-card mt-4">
          <Card.Body>
            <h3>Reviews</h3>
            <ListGroup>
              {reviews.length > 0 ? (
                reviews.map((review) => (
                  <ListGroup.Item
                    key={review._id}
                    className="d-flex justify-content-between align-items-start flex-wrap"
                  >
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <strong>{review.userId?.username || "Anonymous"}</strong>
                      <p className="mb-1">⭐ {review.rating}</p>
                      <p
                        style={{
                          wordBreak: "break-word",
                          whiteSpace: "pre-wrap",
                          marginBottom: 0,
                        }}
                      >
                        {review.comment}
                      </p>
                    </div>

                    <Button
                      variant="danger"
                      size="sm"
                      onClick={() => deleteReview(review._id)}
                      className="ms-3 mt-2 mt-md-0"
                      style={{ whiteSpace: "nowrap" }}
                    >
                      <FontAwesomeIcon icon={faTrash} /> Delete
                    </Button>
                  </ListGroup.Item>
                ))
              ) : (
                <p className="text-muted">No reviews for this organizer.</p>
              )}
            </ListGroup>
          </Card.Body>
        </Card>

        <div className="text-center mt-4">
          <Button type="submit" variant="success">
            Save Changes
          </Button>
        </div>
      </Form>
    </Container>
  );
};

export default EditEventPage;
