import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Card, Row, Col, Button } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faLocationDot, faCalendarDays, faCoins } from "@fortawesome/free-solid-svg-icons";
import "./AllEventsPage.css";

function AllEventsPage() {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(1);
  const [totalEvents, setTotalEvents] = useState(0);
  const limit = 10;
  const navigate = useNavigate();

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/api/events/paginated?page=${page}&limit=${limit}`);
        setEvents((prevEvents) => {
          return page === 1
            ? response.data.events
            : [...prevEvents, ...response.data.events];
        });
        setTotalEvents(response.data.totalEvents);
        setLoading(false);
      } catch (err) {
        setError("Error loading events");
        setLoading(false);
      }
    };

    fetchEvents();
  }, [page]);

  const handleLoadMore = () => {
    if (events.length < totalEvents) {
      setPage(page + 1);
    }
  };

  return (
    <div className="container mt-5">
      <h1 className="text-center mb-4">All Events</h1>

      {loading && <p>Loading events...</p>}
      {error && <p className="text-danger">{error}</p>}

      <Row xs={1} sm={2} md={3} lg={4} className="g-4">
        {events.map((event) => {
          const formattedDate = new Intl.DateTimeFormat("ro-RO", {
            weekday: "long",
            day: "2-digit",
            month: "long",
            year: "numeric",
            hour: "2-digit",
            minute: "2-digit"
          }).format(new Date(event.eventDate));

          const formattedPrice = event.ticketTypes.length > 0
            ? `${Math.min(...event.ticketTypes.map(t => t.price))} - ${Math.max(...event.ticketTypes.map(t => t.price))} lei`
            : "Preț nespecificat";

          return (
            <Col key={event._id} className="d-flex">
              <Card className="all-events-card w-100" onClick={() => navigate(`/event/${event._id}`)}>
                <div className="all-events-img-wrapper">
                  <Card.Img variant="top" src={event.imageUrl} alt={event.title} />
                </div>
                <Card.Body className="all-events-card-body">
                  <Card.Title className="all-events-title">{event.title}</Card.Title>
                  <div className="all-events-info">
                    <p><FontAwesomeIcon icon={faCalendarDays} className="all-events-icon" /> {formattedDate}</p>
                    <p><FontAwesomeIcon icon={faLocationDot} className="all-events-icon" /> {event.location}</p>
                    <p><FontAwesomeIcon icon={faCoins} className="all-events-icon" /> {formattedPrice}</p>
                  </div>
                </Card.Body>
              </Card>
            </Col>
          );
        })}
      </Row>

      <div className="d-flex justify-content-center mt-4">
        <Button 
          variant="primary" 
          className="all-events-pagination-button"
          onClick={handleLoadMore}
          disabled={events.length >= totalEvents}
        >
          {events.length < totalEvents ? 'Show more' : 'No more events to load'}
        </Button>
      </div>

      <div className="all-events-pagination-info">
        <p>{`You have viewed ${events.length} of ${totalEvents} events`}</p>
      </div>
    </div>
  );
}

export default AllEventsPage;
