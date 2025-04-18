import React, { useEffect, useState } from "react";
import { Carousel, Card, Container } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCalendarDays, faLocationDot, faCoins } from "@fortawesome/free-solid-svg-icons";
import "./CategoryCarousel.css";

const CategoryCarousel = ({ category }) => {
  const [events, setEvents] = useState([]);
  const [groupedEvents, setGroupedEvents] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const res = await axios.get(`http://localhost:5000/api/events/categoryOnly/${category}`);
        setEvents(res.data);
        groupAndSet(res.data);
      } catch {}
    };

    fetchEvents();

    const handleResize = () => {
      groupAndSet(events);
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [category, events]);

  const groupAndSet = (array) => {
    const width = window.innerWidth;
    let groupSize = 3;
    if (width < 576) groupSize = 1;
    else if (width < 768) groupSize = 2;

    const result = [];
    for (let i = 0; i < array.length; i += groupSize) {
      result.push(array.slice(i, i + groupSize));
    }
    setGroupedEvents(result);
  };

  if (!events || events.length === 0) return null;

  return (
    <Container className="category-carousel-wrapper">
      <h2 className="carousel-title">Events in category {category}</h2>
      <Carousel controls indicators={false} interval={4000} className="custom-carousel">
        {groupedEvents.map((group, index) => (
          <Carousel.Item key={index}>
            <div className="d-flex justify-content-around flex-wrap gap-3">
              {group.map((event) => (
                <Card key={event._id} className="event-card" onClick={() => navigate(`/event/${event._id}`)}>
                  <div className="img-wrapper">
                    <Card.Img variant="top" src={event.imageUrl} alt={event.title} />
                  </div>
                  <Card.Body>
                    <Card.Title className="event-title">{event.title}</Card.Title>
                    <div className="event-info">
                      <p>
                        <FontAwesomeIcon icon={faCalendarDays} className="event-icon" />
                        {new Intl.DateTimeFormat("ro-RO", {
                          weekday: "long",
                          day: "2-digit",
                          month: "long",
                          year: "numeric",
                          hour: "2-digit",
                          minute: "2-digit",
                        }).format(new Date(event.eventDate))}
                      </p>
                      <p><FontAwesomeIcon icon={faLocationDot} className="event-icon" /> {event.location}</p>
                      <p><FontAwesomeIcon icon={faCoins} className="event-icon" />
                        {event.ticketTypes?.length > 0
                          ? `${Math.min(...event.ticketTypes.map(t => t.price))} - ${Math.max(...event.ticketTypes.map(t => t.price))} lei`
                          : "Price not specified"}
                      </p>
                    </div>
                  </Card.Body>
                </Card>
              ))}
            </div>
          </Carousel.Item>
        ))}
      </Carousel>
    </Container>
  );
};

export default CategoryCarousel;
