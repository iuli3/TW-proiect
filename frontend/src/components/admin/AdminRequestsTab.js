import { useState } from "react";
import { Container, Card, Button, Alert, Spinner, Form } from "react-bootstrap";
import "./AdminRequestsTab.css";

const AdminRequestsTab = ({ requests, loading, message, onAction }) => {
  const [searchTerm, setSearchTerm] = useState("");

  const filteredRequests = requests.filter((req) =>
    req.user.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
    req.user.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <Container className="my-4">
      <h3 className="text-center mb-4">Organizer Requests</h3>
      {message && <Alert variant="info">{message}</Alert>}

      <div className="d-flex justify-content-center mb-3">
        <Form.Control
          type="text"
          placeholder="Search by username or email..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="search-input"
        />
      </div>

      {loading ? (
        <div className="text-center"><Spinner animation="border" /></div>
      ) : filteredRequests.length === 0 ? (
        <p className="text-center">No requests match your search.</p>
      ) : (
        filteredRequests.map((req) => (
          <Card key={req._id} className="mb-3 shadow-sm custom-card">
            <Card.Body>
              <h5>{req.user.username} ({req.user.email})</h5>
              <p><strong>Company:</strong> {req.companyName}</p>
              <p><strong>Phone:</strong> {req.phone}</p>
              <p><strong>Details:</strong> {req.details}</p>
              <div className="d-flex gap-3 mt-3 justify-content-center flex-wrap">
                <Button className="btn-approve" onClick={() => onAction(req._id, "approve")}>
                  Approve
                </Button>
                <Button className="btn-reject" onClick={() => onAction(req._id, "reject")}>
                  Reject
                </Button>
              </div>
            </Card.Body>
          </Card>
        ))
      )}
    </Container>
  );
};

export default AdminRequestsTab;
