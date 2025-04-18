import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate, useParams, useLocation } from "react-router-dom";
import {
  Container, Card, Row, Col, Button, ListGroup
} from "react-bootstrap";
import {
  faLocationDot, faCalendarDays, faUser, faHeart as faSolidHeart, faPen
} from "@fortawesome/free-solid-svg-icons";
import { faHeart as faRegularHeart } from "@fortawesome/free-regular-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import ReviewsSection from "../components/ReviewsSection";
import RatingStats from "../components/RatingStats";
import { useCart } from "../context/CartContext";
import "./EventPage.css";

const EventPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedTickets, setSelectedTickets] = useState({});
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isFavorite, setIsFavorite] = useState(false);
  const { addToCart, setOpenCart } = useCart();
  const [userId, setUserId] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem("token");
    const storedId = localStorage.getItem("userId");
    setUserId(storedId);

    axios.get(`http://localhost:5000/api/events/${id}`)
      .then((res) => {
        setEvent(res.data);
        setLoading(false);
      })
      .catch(() => {
        setLoading(false);
      });

    if (token) {
      setIsAuthenticated(true);
      axios.get("http://localhost:5000/api/favorites", {
        headers: { Authorization: `Bearer ${token}` },
      }).then((res) => {
        const favoriteIds = res.data.map(ev => ev._id);
        setIsFavorite(favoriteIds.includes(id));
      });
    }
  }, [id]);

  const handleQuantityChange = (ticketType, amount) => {
    setSelectedTickets(prev => ({
      ...prev,
      [ticketType]: Math.max(0, (prev[ticketType] || 0) + amount),
    }));
  };

  const handleAddToCart = () => {
    if (!isAuthenticated) {
      alert("Please log in to purchase tickets.");
      navigate("/account", { state: { from: location.pathname } });
      return;
    }

    const selected = Object.entries(selectedTickets)
      .filter(([_, quantity]) => quantity > 0)
      .map(([type, quantity]) => {
        const ticket = event.ticketTypes.find(t => t.type === type);
        return {
          eventId: event._id,
          eventTitle: event.title,
          ticketType: type,
          quantity,
          price: Number(ticket.price),
        };
      });

    selected.forEach(item => addToCart(item));
    setOpenCart(true);
  };

  const handleFavoriteToggle = () => {
    const token = localStorage.getItem("token");
    const config = { headers: { Authorization: `Bearer ${token}` } };
    if (!isFavorite) {
      axios.post(`http://localhost:5000/api/favorites`, { eventId: id }, config)
        .then(() => setIsFavorite(true));
    } else {
      axios.delete(`http://localhost:5000/api/favorites/${id}`, config)
        .then(() => setIsFavorite(false));
    }
  };

  if (loading || !event) return <p>Loading...</p>;

  return (
    <Container className="event-container">
      <div className="event-banner" style={{ backgroundImage: `url(${event.imageUrl})` }}>
        <div className="event-overlay">
          <h1 className="event-page-title">{event.title}</h1>
          <p className="event-meta">
            <FontAwesomeIcon icon={faCalendarDays} />{" "}
            {new Intl.DateTimeFormat("en-GB", {
              weekday: "long", day: "2-digit", month: "long",
              year: "numeric", hour: "2-digit", minute: "2-digit"
            }).format(new Date(event.eventDate))}{" "}
            | <FontAwesomeIcon icon={faLocationDot} /> {event.location}
          </p>
        </div>
      </div>

      <Row className="mt-4">
        <Col md={8}>
          <Card className="event-description-card mb-4">
            <Card.Body>
              <h3>About the Event</h3>
              <p className="event-description">{event.description}</p>
            </Card.Body>
          </Card>

          {event.organizer && (
            <Card className="event-organizer-card shadow-sm mb-4">
              <Card.Body className="text-center py-3">
                <h5>Organizer:</h5>
                <Button
                  variant="outline-dark"
                  className="organizer-button px-4 py-2 rounded-pill"
                  onClick={() => navigate(`/organizer/${event.organizer._id}`)}
                >
                  <FontAwesomeIcon icon={faUser} className="me-2" />
                  {event.organizer.username}
                </Button>
              </Card.Body>
            </Card>
          )}
        </Col>

        <Col md={4}>
          <Card className="event-description-card mb-4">
            <Card.Body>
              <div className="d-flex justify-content-between align-items-center mb-3">
                <h4>Buy Tickets</h4>
                {isAuthenticated && userId === event.organizer?._id && (
                  <Button
                    variant="light"
                    className="edit-button"
                    onClick={() => navigate(`/edit-event/${event._id}`)}
                  >
                    <FontAwesomeIcon icon={faPen} />
                  </Button>
                )}
              </div>

              <ListGroup>
                {event.ticketTypes.map((ticket, index) => (
                  <ListGroup.Item key={index}>
                    <div className="ticket-row">
                      <div className="ticket-type">
                        <span className="ticket-name">{ticket.type}</span>
                        <span className="ticket-price">{ticket.price} lei</span>
                      </div>
                      <div className="quantity-selector">
                        <Button size="sm" variant="outline-dark" onClick={() => handleQuantityChange(ticket.type, -1)}>-</Button>
                        <span className="quantity-number">{selectedTickets[ticket.type] || 0}</span>
                        <Button size="sm" variant="outline-dark" onClick={() => handleQuantityChange(ticket.type, 1)}>+</Button>
                      </div>
                    </div>
                  </ListGroup.Item>
                ))}
              </ListGroup>

              <div className="text-center mt-3">
                <Button className="buy-tickets-button" onClick={handleAddToCart}>
                  Add to cart
                </Button>
              </div>

              <div className="text-center mt-3">
                <Button
                  variant={isFavorite ? "dark" : "outline-dark"}
                  onClick={handleFavoriteToggle}
                >
                  <FontAwesomeIcon icon={isFavorite ? faSolidHeart : faRegularHeart} className="me-2" />
                  {isFavorite ? "Favorited" : "Add to favorites"}
                </Button>
              </div>
            </Card.Body>
          </Card>

          <Card className="event-location-card">
            <Card.Body>
              <h5><FontAwesomeIcon icon={faLocationDot} /> {event.location}</h5>
              <p>Strada Mihail Kogălniceanu, Brașov, Romania</p>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {event.organizer && (
        <>
          <RatingStats organizerId={event.organizer._id} />
          <ReviewsSection organizerId={event.organizer._id} />
        </>
      )}
    </Container>
  );
};

export default EventPage;
