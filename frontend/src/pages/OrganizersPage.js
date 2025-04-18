import { useEffect, useState } from "react";
import axios from "axios";
import Container from "react-bootstrap/Container";
import { FaStar } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import Form from "react-bootstrap/Form";
import "./OrganizersPage.css";

export default function OrganizersPage() {
  const [organizers, setOrganizers] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    axios
      .get("http://localhost:5000/api/users/all-organizers")
      .then(async (res) => {
        const organizersWithStats = await Promise.all(
          res.data.map(async (org) => {
            const statsRes = await axios.get(
              `http://localhost:5000/api/reviews/stats/organizer/${org._id}`
            );
            return {
              ...org,
              averageRating: parseFloat(statsRes.data.averageRating),
              totalReviews: statsRes.data.totalReviews,
            };
          })
        );

        setOrganizers(
          organizersWithStats.sort((a, b) => b.averageRating - a.averageRating)
        );
      })
      .catch((err) => console.error("Error fetching organizers:", err));
  }, []);

  const filteredOrganizers = organizers.filter((org) =>
    `${org.firstName} ${org.lastName}`
      .toLowerCase()
      .includes(searchTerm.toLowerCase())
  );

  return (
    <Container className="my-5">
      <h2 className="text-center mb-4 fw-bold">Our Organizers</h2>

      <Form className="mb-5 w-50 mx-auto">
        <Form.Control
          type="text"
          placeholder="Search organizer by name..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </Form>

      <div className="row justify-content-center g-4">
        {filteredOrganizers.length > 0 ? (
          filteredOrganizers.map((org) => (
            <div key={org._id} className="col-md-6 col-lg-4">
              <div className="organizer-card">
                <div className="organizer-avatar">
                  <img
                    src={
                      org.profileImage ||
                      "https://img.freepik.com/premium-vector/man-avatar-profile-picture-vector-illustration_268834-541.jpg?w=360"
                    }
                    alt={org.username}
                    className="organizer-avatar-img"
                  />
                </div>
                <h5 className="text-center fw-bold text-mint mt-3">
                  {org.firstName} {org.lastName}
                </h5>
                <div className="text-center">
                  <p className="fw-bold mb-1">Rating:</p>
                  <div className="d-flex justify-content-center mb-2">
                    {[...Array(5)].map((_, i) => (
                      <FaStar
                        key={i}
                        color={i < Math.round(org.averageRating) ? "#FFD700" : "#ccc"}
                      />
                    ))}
                  </div>
                  <p>
                    Reviews: <strong>{org.totalReviews}</strong>
                  </p>
                  <button
                    className="btn btn-outline-mint mt-2"
                    onClick={() => navigate(`/organizer/${org._id}`)}
                  >
                    View Events
                  </button>
                </div>
              </div>
            </div>
          ))
        ) : (
          <p className="text-center">No organizers found.</p>
        )}
      </div>
    </Container>
  );
}
