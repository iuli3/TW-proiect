import React, { useState } from "react";
import { Form, Button, Alert } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import "./Login.css";
import BackgroundImage from "../assets/gradient.jpg";
import Logo from "../assets/logo.png";
import axios from "axios";
import { useCart } from "../context/CartContext";


const Login = () => {
  const navigate = useNavigate();
    // const location = useLocation(); // 🔹 Verificăm dacă avem o pagină anterioară
  const [inputUsername, setInputUsername] = useState("");
  const [inputPassword, setInputPassword] = useState("");
  const [show, setShow] = useState(false);
  const [loading, setLoading] = useState(false);
  const { loadCartFromStorage } = useCart();
  




  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);
  
    try {
      const response = await axios.post("http://localhost:5000/api/auth/login", {
        username: inputUsername,
        password: inputPassword
      });
  
      console.log("Login successful:", response.data);
  
      // ✅ Salvăm token + datele userului
      localStorage.setItem("token", response.data.token);
      localStorage.setItem("username", response.data.user.username);
      localStorage.setItem("role", response.data.user.role);
      localStorage.setItem("userId", response.data.user._id); // 🔥 Adăugat aici
      loadCartFromStorage(response.data.user.username);

  
      navigate("/");
      window.location.reload();
  
    }  catch (error) {
      console.error("Login failed:", error.response?.data || error.message || error);

      setShow(true);
    }
    
  
    setLoading(false);
  };
  


  return (
    <div className="sign-in__wrapper" style={{ backgroundImage: `url(${BackgroundImage})`, fontFamily: 'Rasa, system-ui' }}>
      <div className="sign-in__backdrop"></div>

      <Form className="shadow p-4 rounded" style={{ background: "white", borderRadius: "12px", padding: "25px" }} onSubmit={handleSubmit}>
        <img className="mx-auto d-block mb-2" src={Logo} alt="logo" />
        <div className="h4 mb-2 text-center">Sign In</div>

        {show && (
          <Alert className="mb-2" variant="danger" onClose={() => setShow(false)} dismissible>
            Incorrect username or password.
          </Alert>
        )}

        <Form.Group className="mb-2" controlId="username">
          <Form.Label>Username</Form.Label>
          <Form.Control
            type="text"
            value={inputUsername}
            placeholder="Username"
            onChange={(e) => setInputUsername(e.target.value)}
            required
          />
        </Form.Group>

        <Form.Group className="mb-2" controlId="password">
          <Form.Label>Password</Form.Label>
          <Form.Control
            type="password"
            value={inputPassword}
            placeholder="Password"
            onChange={(e) => setInputPassword(e.target.value)}
            required
          />
        </Form.Group>

        <Form.Group className="mb-2" controlId="checkbox">
          <Form.Check type="checkbox" label="Remember me" />
        </Form.Group>

        <Button className="w-100" style={{ backgroundColor: "rgb(44, 9, 240 )", border: "none" }} type="submit" disabled={loading}>
          {loading ? "Logging In..." : "Log In"}
        </Button>

        <div className="d-grid justify-content-end">
          <Button className="px-0" variant="link" style={{ color: "rgb(44, 9, 240 )", textDecoration: "none" }}>
            Forgot password?
          </Button>
        </div>

        <div className="text-center mt-3">
          <span className="text-muted">Don't have an account? </span>
          <button className="btn btn-link p-0" style={{ color: "rgb(44, 9, 240 )", fontWeight: "bold", textDecoration: "none" }} onClick={() => navigate("/register")}>
            Register here
          </button>
        </div>
      </Form>
    </div>
  );
};

export default Login;
