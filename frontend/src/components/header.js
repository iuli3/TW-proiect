import { useState, useEffect } from "react";
import Container from "react-bootstrap/Container";
import Nav from "react-bootstrap/Nav";
import Navbar from "react-bootstrap/Navbar";
import Button from "react-bootstrap/Button";
import Dropdown from "react-bootstrap/Dropdown";
import Offcanvas from "react-bootstrap/Offcanvas";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUser, faShoppingCart, faTrash } from "@fortawesome/free-solid-svg-icons";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useCart } from "../context/CartContext";
import logo from "../assets/logo.png";
import "./header.css";

export default function AppHeader() {
  const location = useLocation();
  const navigate = useNavigate();
  const [role, setRole] = useState(null);
  const [username, setUsername] = useState(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const { cartItems, removeFromCart, updateQuantity, openCart, setOpenCart } = useCart();
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("token");
    const userRole = localStorage.getItem("role");
    const storedUsername = localStorage.getItem("username");

    if (token) {
      setIsLoggedIn(true);
      setRole(userRole);
      setUsername(storedUsername);
    }
  }, []);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 992);
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const handleLogout = () => {
    const username = localStorage.getItem("username");
    if (username && cartItems.length > 0) {
      localStorage.setItem(`cart_${username}`, JSON.stringify(cartItems));
    }
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    localStorage.removeItem("username");
    localStorage.removeItem("userId");
    setIsLoggedIn(false);
    navigate("/");
    window.location.reload();
  };

  if (location.pathname === "/register" || location.pathname === "/account") return null;

  return (
    <>
      <Navbar expand="lg" className="navbar-custom nav-spacing" data-bs-theme="light">
        <Container fluid="lg" className="d-flex justify-content-between align-items-center">
          <Navbar.Brand as={Link} to="/" className="navbar-brand d-flex align-items-center">
            <img src={logo} alt="Logo" className="navbar-logo" />
            Eventix
          </Navbar.Brand>

          <Navbar.Toggle aria-controls="offcanvas-navbar" className="d-lg-none" />

          <Navbar.Offcanvas id="offcanvas-navbar" placement="end">
            <Offcanvas.Header closeButton>
              <Offcanvas.Title>Events</Offcanvas.Title>
            </Offcanvas.Header>
            <Offcanvas.Body>
              <Nav className="me-auto">
                <Nav.Link as={Link} to="/" className="custom-nav-link">Home</Nav.Link>
                <Nav.Link as={Link} to="/organizers" className="custom-nav-link">Organizers</Nav.Link>
                <Nav.Link as={Link} to="/all-events" className="custom-nav-link">All Events</Nav.Link>

                {isLoggedIn && role === "user" && (
                  <>
                    <Nav.Link as={Link} to="/request-organizer" className="custom-nav-link">Become Organizer</Nav.Link>

                    <Nav.Link as={Link} to="/favorites" className="custom-nav-link">Favorites</Nav.Link>
                    <Nav.Link as={Link} to="/myTickets" className="custom-nav-link">My Tickets</Nav.Link>
                  </>
                )}

                {role === "organizer" && (
                  <>
                    <Nav.Link as={Link} to="/adauga-eveniment" className="custom-nav-link">Add Event</Nav.Link>
                    <Nav.Link as={Link} to="/my-events" className="custom-nav-link">My Events</Nav.Link>
                    <Nav.Link as={Link} to="/organizer-dashboard" className="custom-nav-link">Organizer Dashboard</Nav.Link>
                  </>
                )}

                {role === "admin" && (
                  <Nav.Link as={Link} to="/admin-dashboard" className="custom-nav-link">Admin Panel</Nav.Link>
                )}

                {isMobile && !isLoggedIn && (
                  <Link to="/account" className="btn btn-signin-offcanvas w-100 mt-3">
                    <FontAwesomeIcon icon={faUser} /> Sign In
                  </Link>
                )}

                {isMobile && isLoggedIn && (
                  <Dropdown className="mt-3">
                    <Dropdown.Toggle variant="outline-light" className="my-account w-100">
                      <FontAwesomeIcon icon={faUser} /> {username}
                    </Dropdown.Toggle>
                    <Dropdown.Menu className="w-100">
                      <Dropdown.Item as={Link} to="/user-profile">My Profile</Dropdown.Item>
                      <Dropdown.Item onClick={handleLogout}>Logout</Dropdown.Item>
                    </Dropdown.Menu>
                  </Dropdown>
                )}
              </Nav>
            </Offcanvas.Body>
          </Navbar.Offcanvas>

          {!isMobile && (
            <div className="user-cart-wrapper d-flex align-items-center gap-3" style={{ height: "70px" }}>
              {isLoggedIn ? (
                <Dropdown className="nav-item-wrapper">
                  <Dropdown.Toggle variant="outline-light" className="my-account nav-item-fix">
                    <FontAwesomeIcon icon={faUser} /> {username}
                  </Dropdown.Toggle>
                  <Dropdown.Menu>
                    <Dropdown.Item as={Link} to="/user-profile">My Profile</Dropdown.Item>
                    <Dropdown.Item onClick={handleLogout}>Logout</Dropdown.Item>
                  </Dropdown.Menu>
                </Dropdown>
              ) : (
                <Button variant="outline-light" className="my-account nav-item-wrapper nav-item-fix">
                  <Link to="/account" className="account-link">
                    Sign In <FontAwesomeIcon icon={faUser} />
                  </Link>
                </Button>
              )}

              <Button
                variant="outline-light"
                className="cart-button nav-item-wrapper"
                onClick={() => setOpenCart(true)}
              >
                <FontAwesomeIcon
                  icon={faShoppingCart}
                  style={{ color: cartItems.length > 0 ? "#9c0007" : "#000000" }}
                />
              </Button>
            </div>
          )}
        </Container>
      </Navbar>

      <div className="section-divider"></div>

      <Offcanvas show={openCart} onHide={() => setOpenCart(false)} placement="end">
        <Offcanvas.Header closeButton>
          <Offcanvas.Title style={{ fontWeight: 600, fontSize: "1.25rem", color: "#0A1828" }}>
            My Cart
          </Offcanvas.Title>
        </Offcanvas.Header>
        <Offcanvas.Body>
          {cartItems.length === 0 ? (
            <p>Your cart is empty.</p>
          ) : (
            <div>
              {cartItems.map((item, index) => (
                <div
                  key={index}
                  className="mb-3 p-3 rounded border"
                  style={{ borderColor: "#178582" }}
                >
                  <strong style={{ color: "#0A1828" }}>{item.eventTitle}</strong>
                  <p>Ticket type: <em>{item.ticketType}</em></p>
                  <div className="d-flex justify-content-between align-items-center">
                    <div>
                      <div className="d-flex align-items-center gap-2 mb-2">
                        <Button
                          variant="outline-secondary"
                          size="sm"
                          onClick={() => updateQuantity(item.eventId, item.ticketType, item.quantity - 1)}
                          disabled={item.quantity <= 1}
                        >−</Button>
                        <span style={{ minWidth: 24, textAlign: "center" }}>{item.quantity}</span>
                        <Button
                          variant="outline-secondary"
                          size="sm"
                          onClick={() => updateQuantity(item.eventId, item.ticketType, item.quantity + 1)}
                        >+</Button>
                      </div>
                      <p className="mb-1">Price per ticket: {item.price} lei</p>
                      <p className="mb-0 fw-bold">Total: {item.quantity * item.price} lei</p>
                    </div>
                    <Button
                      variant="outline-danger"
                      size="sm"
                      onClick={() => removeFromCart(item.eventId, item.ticketType)}
                    >
                      <FontAwesomeIcon icon={faTrash} />
                    </Button>
                  </div>
                </div>
              ))}
              <Button
                variant="success"
                className="w-100 mt-2"
                style={{ backgroundColor: "#178582", borderColor: "#178582", fontWeight: 600 }}
                onClick={() => {
                  setOpenCart(false);
                  navigate("/checkout");
                }}
              >
                Checkout
              </Button>
            </div>
          )}
        </Offcanvas.Body>
      </Offcanvas>
    </>
  );
}
