import React, { useEffect, useState, useCallback } from 'react';
import axios from 'axios';
import ReactStars from 'react-stars';
import { Button, Form, Carousel } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import "./ReviewsSection.css";

const ReviewsSection = ({ organizerId }) => {
  const [reviews, setReviews] = useState([]);
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState('');
  const [expanded, setExpanded] = useState(null);
  const navigate = useNavigate();

  const token = localStorage.getItem('token');
  const currentUserId = localStorage.getItem('userId');

  const fetchReviews = useCallback(async () => {
    try {
      const res = await axios.get(`http://localhost:5000/api/reviews/organizer/${organizerId}`);
      setReviews(res.data);
    } catch (err) {
      console.error("Error fetching reviews:", err);
    }
  }, [organizerId]);

  useEffect(() => {
    if (organizerId) fetchReviews();
  }, [organizerId, fetchReviews]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!token) {
      alert('You need to be logged in to leave a review!');
      navigate('/account');
      return;
    }

    if (!organizerId || !currentUserId) return;

    if (!rating || rating < 1 || rating > 5) {
      alert("Please select a rating between 1 and 5 stars.");
      return;
    }

    try {
      await axios.post('http://localhost:5000/api/reviews', {
        organizerId,
        rating,
        comment: comment || '',
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });

      setRating(0);
      setComment('');
      fetchReviews();
    } catch (err) {
      console.error("Error submitting review:", err);
      if (err.response?.data?.message) {
        alert(`Error: ${err.response.data.message}`);
      }
    }
  };

  return (
    <div className="reviews-section my-5">
      <h4 className="mb-4">Reviews ({reviews.length})</h4>

      {reviews.length > 0 ? (
        <Carousel interval={null}>
          {reviews.map((review) => (
            <Carousel.Item key={review._id}>
              <div className="d-flex justify-content-center py-4">
                <div className="card shadow-sm" style={{ maxWidth: '600px', width: '100%' }}>
                  <div className="card-body text-center p-4">
                    <h5 className="card-title">{review.userId?.username || "Anonymous user"}</h5>

                    <ReactStars edit={false} value={review.rating} size={24} color2="#ffd700" />

                    {review.comment && (
                      <>
                        <p
                          className="card-text"
                          style={{
                            overflow: 'hidden',
                            display: '-webkit-box',
                            WebkitBoxOrient: 'vertical',
                            WebkitLineClamp: expanded === review._id ? 'unset' : 2,
                            transition: 'all 0.3s ease',
                          }}
                        >
                          {review.comment}
                        </p>

                        {review.comment.length > 100 && (
                          <button
                            className="btn btn-link p-0 mt-1"
                            style={{ fontSize: '0.9rem' }}
                            onClick={() => setExpanded(expanded === review._id ? null : review._id)}
                          >
                            {expanded === review._id ? 'Show less' : 'Read more'}
                          </button>
                        )}
                      </>
                    )}

                    <small className="text-muted">
                      {new Date(review.createdAt).toLocaleDateString()}
                    </small>
                  </div>
                </div>
              </div>
            </Carousel.Item>
          ))}
        </Carousel>
      ) : (
        <p className="text-muted">There are no reviews for this organizer.</p>
      )}

      {token && (
        <Form onSubmit={handleSubmit} className="mt-5">
          <h5>Leave a review:</h5>
          <ReactStars
            count={5}
            value={rating}
            onChange={(newRating) => setRating(newRating)}
            size={24}
            color2="#ffd700"
          />
          <Form.Control
            as="textarea"
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            className="my-3"
            placeholder="Comment (optional)"
          />
          <Button type="submit" className="btn-turquoise">
            Submit Review
          </Button>
        </Form>
      )}

      {!token && (
        <p className="text-muted mt-3">You must be logged in to leave a review.</p>
      )}
    </div>
  );
};

export default ReviewsSection;
