import React, { useEffect, useState, useCallback } from "react";
import { Carousel, Card, Container } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faLocationDot, faCalendarDays, faCoins } from "@fortawesome/free-solid-svg-icons";
import axios from "axios";
import "bootstrap/dist/css/bootstrap.min.css";
import "./CardsCarousel.css";

const CarouselWithMultipleCards = ({ events, setEvents, isFiltered }) => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [recommendedEvents, setRecommendedEvents] = useState([]);
  const [groupedRecommended, setGroupedRecommended] = useState([]);
  const [groupedWeekly, setGroupedWeekly] = useState([]);

  const isThisWeek = (eventDate) => {
    const today = new Date();
    const eventDateObj = new Date(eventDate);
    const startOfWeek = new Date(today);
    startOfWeek.setDate(today.getDate() - today.getDay());
    const endOfWeek = new Date(today);
    endOfWeek.setDate(today.getDate() - today.getDay() + 6);
    return eventDateObj >= startOfWeek && eventDateObj <= endOfWeek;
  };

  const groupItems = (array) => {
    let groupSize = 3;
    const width = window.innerWidth;
    if (width < 576) groupSize = 1;
    else if (width < 768) groupSize = 2;

    const result = [];
    for (let i = 0; i < array.length; i += groupSize) {
      result.push(array.slice(i, i + groupSize));
    }
    return result;
  };

  const regroup = useCallback((eventsList, recommendedList) => {
    const weekly = eventsList.filter(e => isThisWeek(e.eventDate));
    setGroupedWeekly(groupItems(weekly));
    setGroupedRecommended(groupItems(recommendedList));
  }, []);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const [allEventsRes, randomRes] = await Promise.all([
          axios.get("http://localhost:5000/api/events"),
          axios.get("http://localhost:5000/api/events/random/6")
        ]);
        setEvents(allEventsRes.data);
        setRecommendedEvents(randomRes.data);
        regroup(allEventsRes.data, randomRes.data);
        setLoading(false);
      } catch (err) {
        setError("Nu s-au putut încărca evenimentele.");
        setLoading(false);
      }
    };

    if (!isFiltered && (events.length === 0 || recommendedEvents.length === 0)) {
      fetchEvents();
    } else {
      regroup(events, recommendedEvents);
    }
    
    const handleResize = () => {
      regroup(events, recommendedEvents);
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [isFiltered, events, recommendedEvents, setEvents, regroup]);

  return (
    <Container className="mt-5 main-carousel">
      {loading && <p>Se încarcă evenimentele...</p>}
      {error && <p className="text-danger">{error}</p>}

      {!isFiltered && groupedRecommended.length > 0 && (
        <>
          <h2 className="carousel-title">Recommended Events</h2>
          <Carousel controls indicators={false} interval={3000} className="custom-carousel">
            {groupedRecommended.map((group, index) => (
              <Carousel.Item key={index}>
                <div className="d-flex justify-content-around flex-wrap">
                  {group.map((item) => (
                    <Card key={item._id} className="event-card" onClick={() => navigate(`/event/${item._id}`)}>
                      <div className="img-wrapper">
                        <Card.Img variant="top" src={item.imageUrl} alt={item.title} />
                      </div>
                      <Card.Body>
                        <Card.Title className="event-title">{item.title}</Card.Title>
                        <div className="event-info">
                          <p>
                            <FontAwesomeIcon icon={faCalendarDays} className="event-icon" />
                            {new Intl.DateTimeFormat("ro-RO", {
                              weekday: "long",
                              day: "2-digit",
                              month: "long",
                              year: "numeric",
                              hour: "2-digit",
                              minute: "2-digit"
                            }).format(new Date(item.eventDate))}
                          </p>
                          <p><FontAwesomeIcon icon={faLocationDot} className="event-icon" /> {item.location}</p>
                          <p><FontAwesomeIcon icon={faCoins} className="event-icon" />
                            {item.ticketTypes.length > 0
                              ? `${Math.min(...item.ticketTypes.map(t => t.price))} - ${Math.max(...item.ticketTypes.map(t => t.price))} lei`
                              : "Preț nespecificat"}
                          </p>
                        </div>
                      </Card.Body>
                    </Card>
                  ))}
                </div>
              </Carousel.Item>
            ))}
          </Carousel>
        </>
      )}

      {!isFiltered && groupedWeekly.length > 0 && (
        <>
          <div className="section-break"></div>
          <h2 className="carousel-title mt-5">This Week's Events</h2>
          <Carousel controls indicators={false} interval={3000} className="custom-carousel">
            {groupedWeekly.map((group, index) => (
              <Carousel.Item key={index}>
                <div className="d-flex justify-content-around flex-wrap">
                  {group.map((item) => (
                    <Card key={item._id} className="event-card" onClick={() => navigate(`/event/${item._id}`)}>
                      <div className="img-wrapper">
                        <Card.Img variant="top" src={item.imageUrl} alt={item.title} />
                      </div>
                      <Card.Body>
                        <Card.Title className="event-title">{item.title}</Card.Title>
                        <div className="event-info">
                          <p>
                            <FontAwesomeIcon icon={faCalendarDays} className="event-icon" />
                            {new Intl.DateTimeFormat("ro-RO", {
                              weekday: "long",
                              day: "2-digit",
                              month: "long",
                              year: "numeric",
                              hour: "2-digit",
                              minute: "2-digit"
                            }).format(new Date(item.eventDate))}
                          </p>
                          <p><FontAwesomeIcon icon={faLocationDot} className="event-icon" /> {item.location}</p>
                          <p><FontAwesomeIcon icon={faCoins} className="event-icon" />
                            {item.ticketTypes.length > 0
                              ? `${Math.min(...item.ticketTypes.map(t => t.price))} - ${Math.max(...item.ticketTypes.map(t => t.price))} lei`
                              : "Preț nespecificat"}
                          </p>
                        </div>
                      </Card.Body>
                    </Card>
                  ))}
                </div>
              </Carousel.Item>
            ))}
          </Carousel>
        </>
      )}

      {isFiltered && events.length > 0 && (
        <div className="filtered-results d-flex flex-wrap justify-content-center gap-4">
          {events.map((item) => (
            <Card key={item._id} className="event-card" onClick={() => navigate(`/event/${item._id}`)}>
              <div className="img-wrapper">
                <Card.Img variant="top" src={item.imageUrl} alt={item.title} />
              </div>
              <Card.Body>
                <Card.Title className="event-title">{item.title}</Card.Title>
                <div className="event-info">
                  <p>
                    <FontAwesomeIcon icon={faCalendarDays} className="event-icon" />
                    {new Intl.DateTimeFormat("ro-RO", {
                      weekday: "long",
                      day: "2-digit",
                      month: "long",
                      year: "numeric",
                      hour: "2-digit",
                      minute: "2-digit"
                    }).format(new Date(item.eventDate))}
                  </p>
                  <p><FontAwesomeIcon icon={faLocationDot} className="event-icon" /> {item.location}</p>
                  <p><FontAwesomeIcon icon={faCoins} className="event-icon" />
                    {item.ticketTypes.length > 0
                      ? `${Math.min(...item.ticketTypes.map(t => t.price))} - ${Math.max(...item.ticketTypes.map(t => t.price))} lei`
                      : "Preț nespecificat"}
                  </p>
                </div>
              </Card.Body>
            </Card>
          ))}
        </div>
      )}

      {isFiltered && events.length === 0 && (
        <p className="text-center mt-4">Nu a fost găsit niciun eveniment cu filtrele aplicate.</p>
      )}
    </Container>
  );
};

export default CarouselWithMultipleCards;
