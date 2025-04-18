import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { Container, Card, Row, Col, Alert } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCalendarDays, faLocationDot } from "@fortawesome/free-solid-svg-icons";

const OrganizerEvents = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    axios.get(`http://localhost:5000/api/events/organizer/${id}`)
      .then(response => {
        setEvents(response.data);
        setLoading(false);
      })
      .catch(error => {
        console.error("Error fetching organizer events:", error);
        setError("This organizer has no events.");
        setLoading(false);
      });
  }, [id]);

  if (loading) return <p>Loading events...</p>;
  if (error) return <Alert variant="danger">{error}</Alert>;

  return (
    <Container className="mt-4">
      <h2>Events organized by this user</h2>
      <Row>
        {events.map((event) => (
          <Col md={4} key={event._id} className="mb-4">
            <Card onClick={() => navigate(`/event/${event._id}`)} className="event-card">
              <Card.Img variant="top" src={event.imageUrl} />
              <Card.Body>
                <Card.Title>{event.title}</Card.Title>
                <p>
                  <FontAwesomeIcon icon={faCalendarDays} />{" "}
                  {new Intl.DateTimeFormat("en-GB", {
                    weekday: "long",
                    day: "2-digit",
                    month: "long",
                    year: "numeric"
                  }).format(new Date(event.eventDate))}
                </p>
                <p><FontAwesomeIcon icon={faLocationDot} /> {event.location}</p>
              </Card.Body>
            </Card>
          </Col>
        ))}
      </Row>
    </Container>
  );
};

export default OrganizerEvents;
