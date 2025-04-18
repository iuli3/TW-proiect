import React, { useState } from "react";
import { Container } from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";
import "./Footer.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faMapMarkerAlt, faEnvelope, faPhone } from "@fortawesome/free-solid-svg-icons";
import logo from "../assets/logo.png";

const Footer = () => {
  const [faqOpen, setFaqOpen] = useState(false);

  return (
    <footer className="custom-footer">
      <Container className="footer-content">
        <div className="footer-top">
          <img src={logo} alt="Eventix Logo" className="footer-logo" />
          <p className="footer-subtitle">
            Găsește și distribuie evenimentele tale preferate, rapid și simplu!
          </p>
        </div>

        <div className="footer-columns">
          <div className="footer-section">
            <h5>Contact</h5>
            <p>
              <FontAwesomeIcon icon={faMapMarkerAlt} className="footer-icon" />
              Sediu București: Str. Victoriei 45, Sector 1
            </p>
            <p>
              <FontAwesomeIcon icon={faMapMarkerAlt} className="footer-icon" />
              Sediu Iași: Str. Alexandru cel Bun 12
            </p>
            <p>
              <FontAwesomeIcon icon={faEnvelope} className="footer-icon" />
              contact@eventix.ro
            </p>
            <p>
              <FontAwesomeIcon icon={faPhone} className="footer-icon" />
              +40 745 123 456
            </p>
          </div>

          <div className="footer-section">
            <h5>Politica organizatorului</h5>
            <p>
              Pentru a deveni organizator, este necesar să respectați termenii și condițiile platformei.
              Ne rezervăm dreptul de a refuza orice solicitare care nu respectă regulile noastre.
            </p>
          </div>
        </div>

        <div className="footer-faq">
          <div className="faq-toggle" onClick={() => setFaqOpen(!faqOpen)}>
            <span className="faq-icon">{faqOpen ? "−" : "☰"}</span> Întrebări frecvente
          </div>
          <div className={`faq-content ${faqOpen ? "open" : ""}`}>
            {faqOpen && (
              <>
                <p><strong>🎫 Cum cumpăr bilete?</strong> Selectezi un eveniment și alegi tipul de bilet dorit.</p>
                <p><strong>👤 Cum creez un cont?</strong> Apasă pe „Autentificare” și completează formularul.</p>
                <p><strong>📢 Cum devin organizator?</strong> Trimiți o cerere din secțiunea „Devino organizator”.</p>
              </>
            )}
          </div>
        </div>

        <p className="footer-copy">
          &copy; {new Date().getFullYear()} Eventix – Toate drepturile rezervate
        </p>
      </Container>
    </footer>
  );
};

export default Footer;
