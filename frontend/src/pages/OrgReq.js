import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { Form, Button, Container, Alert } from "react-bootstrap";
import { FaEnvelope, FaHandshake, FaShoppingCart } from "react-icons/fa";
import "./OrgReq.css";
import VideoBanner from "../components/VideoBanner";

const RequestOrganizer = ({ isAuthenticated }) => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    companyName: "",
    phone: "",
    details: "",
  });

  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isAuth, setIsAuth] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) setIsAuth(true);
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (isSubmitting) return;

    setError(null);
    setSuccess(null);
    setIsSubmitting(true);

    if (!isAuth) {
      setError("Trebuie să fii autentificat pentru a trimite cererea!");
      setIsSubmitting(false);
      return;
    }

    try {
      const token = localStorage.getItem("token");
      await axios.post(
        "http://localhost:5000/api/organizer-requests",
        formData,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      setSuccess("Cererea a fost trimisă cu succes!");
      setFormData({ companyName: "", phone: "", details: "" });
    } catch (error) {
      setError(error.response?.data?.message || "Eroare la trimiterea cererii!");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="org-container">
      <VideoBanner />
      <div className="back-button-container">
        <button className="back-button" onClick={() => navigate("/")}>
          ⬅ Înapoi la site
        </button>
      </div>

      <div className="background-wrapper">
        <Container className="steps-container">
          <h3 className="steps-title">Cum putem colabora?</h3>
          <h2 className="steps-subtitle">3 pași simpli</h2>

          <div className="steps-wrapper">
            <Step
              icon={<FaEnvelope />}
              front="Detaliem ce ai nevoie"
              back="Ne adaptăm nevoilor tale și te ghidăm pas cu pas în organizarea evenimentului."
            />
            <Step
              icon={<FaHandshake />}
              front="Negociem comisionul"
              back="Comision transparent, negociat prietenos, fără costuri ascunse."
              highlight
            />
            <Step
              icon={<FaShoppingCart />}
              front="Începem vânzarea"
              back="Lansarea se face rapid, iar tu poți monitoriza totul în timp real."
            />
          </div>
        </Container>

        <Container className="content-wrapper">
          <div className="contact-section">
            <div className="contact-gif-container">
              <img
                src="https://media4.giphy.com/media/v1.Y2lkPTc5MGI3NjExM3FlbHhtdWl2aDZ3cjlkaHp0MXdmb3d2NHRnMWVxeHhiZDZ6MWthOSZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/xT1R9UtTcD2Uli09GM/giphy.gif"
                alt="Eventix fun gif"
                className="contact-gif"
              />
            </div>
            <h2>Contact</h2>
            <p><strong>Sediu București</strong></p>
            <p>Str. Victoriei 45, Sector 1, București</p>
            <p><strong>Sediu Iași</strong></p>
            <p>Str. Alexandru cel Bun 12, Iași</p>
            <h3>Politica organizatorului</h3>
            <p>
              Pentru a deveni organizator, este necesar să respectați termenii și condițiile platformei.
              Toate evenimentele trebuie să fie verificate și aprobate de echipa noastră.
              Ne rezervăm dreptul de a refuza orice solicitare care nu respectă regulile noastre.
            </p>
          </div>

          <div className="form-section">
            <h2 className="form-title">Solicită rol de organizator</h2>
            <p className="form-subtitle">
              Completează formularul și cererea ta va fi înregistrată.
            </p>

            {!isAuth && (
              <Alert variant="warning" className="auth-warning">
                Trebuie să fii <strong>autentificat</strong> pentru a trimite cererea!
                <br />
                <span
                  className="login-link"
                  onClick={() => navigate("/account")}
                >
                  Autentifică-te aici
                </span>
              </Alert>
            )}

            {success && <Alert variant="success">{success}</Alert>}
            {error && <Alert variant="danger">{error}</Alert>}

            <Form onSubmit={handleSubmit}>
              <Form.Group className="form-group">
                <Form.Label className="form-label">
                  Numele companiei / Username
                </Form.Label>
                <Form.Control
                  type="text"
                  name="companyName"
                  value={formData.companyName}
                  onChange={handleChange}
                  required
                  disabled={!isAuth}
                />
              </Form.Group>

              <Form.Group className="form-group">
                <Form.Label className="form-label">Telefon</Form.Label>
                <Form.Control
                  type="text"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  required
                  disabled={!isAuth}
                />
              </Form.Group>

              <Form.Group className="form-group">
                <Form.Label className="form-label">Detalii</Form.Label>
                <Form.Control
                  as="textarea"
                  rows={4}
                  name="details"
                  value={formData.details}
                  onChange={handleChange}
                  required
                  disabled={!isAuth}
                />
              </Form.Group>

              <Button
                className="btn-submit"
                type="submit"
                disabled={!isAuth || isSubmitting || success}
              >
                {success ? "Cerere trimisă" : isSubmitting ? "Se trimite..." : "Trimite Cererea"}
              </Button>
            </Form>
          </div>
        </Container>
      </div>
    </div>
  );
};

const Step = ({ icon, front, back, highlight }) => (
  <div className="step-flip-card">
    <div className="step-flip-inner">
      <div className={`step-front ${highlight ? "highlight" : ""}`}>
        <div className="step-icon">{icon}</div>
        <h4>{front}</h4>
      </div>
      <div className={`step-back ${highlight ? "highlight" : ""}`}>
        <p>{back}</p>
      </div>
    </div>
  </div>
);

export default RequestOrganizer;
