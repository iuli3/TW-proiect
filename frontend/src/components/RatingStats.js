  import React, { useEffect, useState } from 'react';
  import axios from 'axios';
  import ReactStars from 'react-rating-stars-component';
  import './RatingStats.css';

  const RatingStats = ({ organizerId }) => {
    const [stats, setStats] = useState(null);

    useEffect(() => {
      const fetchStats = async () => {
        try {
          const res = await axios.get(`http://localhost:5000/api/reviews/stats/organizer/${organizerId}`);
          setStats(res.data);
        } catch (err) {
          console.error("Error loading statistics:", err);
        }
      };

      if (organizerId) fetchStats();
    }, [organizerId]);

    if (!stats) return null;

    return (
      <div className="mb-4 mt-5">
        <h4 className="mb-3 rating-title">User Reviews</h4>

        <div className="rating-stats-card card p-4">
          <div className="d-flex align-items-center gap-2 mb-4">
            <ReactStars value={Number(stats.averageRating)} edit={false} size={22} color="#4ECCA3" />
            <span className="text-dark">
              {stats.averageRating} / 5 – based on {stats.totalReviews} reviews
            </span>
          </div>

          {[5, 4, 3, 2, 1].map((star) => {
            const match = stats?.percentages?.find(p => Number(p.rating) === star) || { percentage: 0, count: 0 };
            return (
              <div key={star} className="d-flex align-items-center gap-2 mb-2">
                <span style={{ width: "30px", color: "#0A1828" }}>{star} ★</span>
                <div className="progress w-100">
                  <div
                    className="progress-bar"
                    role="progressbar"
                    style={{ width: `${match.percentage}%` }}
                  />
                </div>
                <span style={{ width: "30px", textAlign: "right", color: "#0A1828" }}>{match.count}</span>
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  export default RatingStats;
