import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { Container, Card, Row, Col, Alert } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCalendarDays, faLocationDot, faCoins } from "@fortawesome/free-solid-svg-icons";

import "./FavoritesPage.css";

const FavoritesPage = () => {
  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (!token) {
      navigate("/account");
      return;
    }

    axios.get("http://localhost:5000/api/favorites", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((res) => {
        setFavorites(res.data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error fetching favorites:", err);
        setError("Failed to load favorites.");
        setLoading(false);
      });
  }, [navigate]);

  return (
    <div className="favorites-container">
      <Container className="mt-5">
        <h2 className="mb-4">Favorite Events</h2>
        {loading && <p>Loading favorites...</p>}
        {error && <Alert variant="danger">{error}</Alert>}
        {!loading && !error && favorites.length === 0 && (
          <Alert variant="info">You don't have any favorite events yet.</Alert>
        )}
        <Row>
          {favorites.map((item) => (
            <Col md={4} key={item._id} className="mb-4">
              <Card className="event-card" onClick={() => navigate(`/event/${item._id}`)}>
                <div className="img-wrapper">
                  <Card.Img variant="top" src={item.imageUrl} alt={item.title} />
                </div>
                <Card.Body>
                  <Card.Title className="event-title">{item.title}</Card.Title>
                  <div className="event-info">
                    <p>
                      <FontAwesomeIcon icon={faCalendarDays} className="event-icon" />{" "}
                      {new Intl.DateTimeFormat("en-GB", {
                        weekday: "long",
                        day: "2-digit",
                        month: "long",
                        year: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                      }).format(new Date(item.eventDate))}
                    </p>
                    <p>
                      <FontAwesomeIcon icon={faLocationDot} className="event-icon" /> {item.location}
                    </p>
                    <p>
                      <FontAwesomeIcon icon={faCoins} className="event-icon" />{" "}
                      {item.ticketTypes.length > 0
                        ? `${Math.min(...item.ticketTypes.map(t => t.price))} - ${Math.max(...item.ticketTypes.map(t => t.price))} lei`
                        : "Price not specified"}
                    </p>
                  </div>
                </Card.Body>
              </Card>
            </Col>
          ))}
        </Row>
      </Container>
    </div>
  );
};

export default FavoritesPage;
