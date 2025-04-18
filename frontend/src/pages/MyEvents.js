import React, { useEffect, useState } from "react";
import axios from "axios";
import { Card, Container, Alert, Button } from "react-bootstrap";
import { useNavigate, useParams } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faLocationDot, faCalendarDays, faCoins, faPen, faTrash } from "@fortawesome/free-solid-svg-icons";
import { jwtDecode } from "jwt-decode";

const MyEvents = () => {
  const [events, setEvents] = useState([]);
  const [error, setError] = useState("");
  const [pageTitle, setPageTitle] = useState("");
  const [currentUserId, setCurrentUserId] = useState(null);
  const [currentUserRole, setCurrentUserRole] = useState(null);
  const { organizerId } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const token = localStorage.getItem("token");
        let userId = null;
        let userRole = null;

        if (token) {
          const decoded = jwtDecode(token);
          userId = decoded.id;
          userRole = decoded.role;
          setCurrentUserId(userId);
          setCurrentUserRole(userRole);
        }

        let url = "";

        if (organizerId) {
          url = `http://localhost:5000/api/events?organizer=${organizerId}`;
          const userRes = await axios.get(`http://localhost:5000/api/users/${organizerId}`);
          setPageTitle(`Events organized by: ${userRes.data.username}`);
        } else {
          if (!token || userRole !== "organizer") {
            setError("You must be logged in as an organizer to view your events.");
            return;
          }

          url = "http://localhost:5000/api/events/my-events";
          setPageTitle("My Events");
        }

        const headers = token ? { Authorization: `Bearer ${token}` } : {};
        const response = await axios.get(url, { headers });
        setEvents(response.data);
      } catch (err) {
        console.error("Error fetching events:", err.response?.data || err.message);
        setError("Failed to load events.");
      }
    };

    fetchEvents();
  }, [organizerId]);

  const handleDelete = async (eventId) => {
    if (!window.confirm("Are you sure you want to delete this event?")) return;
    try {
      const token = localStorage.getItem("token");
      await axios.delete(`http://localhost:5000/api/events/${eventId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setEvents((prevEvents) => prevEvents.filter((e) => e._id !== eventId));
    } catch (err) {
      alert("Error deleting the event.");
      console.error(err);
    }
  };

  return (
    <Container style={{ padding: "40px 0", maxWidth: "900px" }}>
      <h2 className="mb-4 text-center">{pageTitle}</h2>
      {error && <Alert variant="danger">{error}</Alert>}

      {events.map((event) => {
        const isOwnerOrAdmin =
          currentUserId === event.organizer || currentUserRole === "admin";

        return (
          <Card
            key={event._id}
            className="mb-4"
            style={{
              cursor: "pointer",
              borderRadius: "10px",
              overflow: "hidden",
              boxShadow: "0 4px 8px rgba(0,0,0,0.1)",
            }}
            onClick={() => navigate(`/event/${event._id}`)}
          >
            <Card.Img
              variant="top"
              src={event.imageUrl}
              alt={event.title}
              style={{ height: "300px", objectFit: "cover", width: "100%" }}
            />
            <Card.Body>
              <Card.Title>{event.title}</Card.Title>
              <Card.Text className="mb-2">
                {event.description.length > 200
                  ? event.description.substring(0, 200) + "..."
                  : event.description}
              </Card.Text>
              <div className="event-info">
                <p>
                  <FontAwesomeIcon icon={faCalendarDays} className="event-icon me-2" />
                  {new Intl.DateTimeFormat("en-GB", {
                    weekday: "long",
                    day: "2-digit",
                    month: "long",
                    year: "numeric",
                    hour: "2-digit",
                    minute: "2-digit",
                  }).format(new Date(event.eventDate))}
                </p>
                <p>
                  <FontAwesomeIcon icon={faLocationDot} className="event-icon me-2" />
                  {event.location}
                </p>
                <p>
                  <FontAwesomeIcon icon={faCoins} className="event-icon me-2" />
                  {event.ticketTypes.length > 0
                    ? `${Math.min(...event.ticketTypes.map((t) => t.price))} - ${Math.max(
                        ...event.ticketTypes.map((t) => t.price)
                      )} lei`
                    : "Price not specified"}
                </p>
              </div>

              {isOwnerOrAdmin && (
                <div
                  style={{
                    position: "absolute",
                    bottom: "15px",
                    right: "15px",
                    display: "flex",
                    gap: "10px",
                  }}
                >
                  <Button
                    variant="outline-primary"
                    size="sm"
                    onClick={(e) => {
                      e.stopPropagation();
                      navigate(`/edit-event/${event._id}`);
                    }}
                  >
                    <FontAwesomeIcon icon={faPen} />
                  </Button>
                  <Button
                    variant="outline-danger"
                    size="sm"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDelete(event._id);
                    }}
                  >
                    <FontAwesomeIcon icon={faTrash} />
                  </Button>
                </div>
              )}
            </Card.Body>
          </Card>
        );
      })}
    </Container>
  );
};

export default MyEvents;
