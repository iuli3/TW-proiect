import React, { useState } from "react";
import { Form, Button, Alert } from "react-bootstrap";
import "./Register.css";
import BackgroundImage from "../assets/gradient.jpg";
import Logo from "../assets/logo.png";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const Register = () => {
  const navigate = useNavigate();
  const [inputFirstName, setInputFirstName] = useState("");
  const [inputLastName, setInputLastName] = useState("");
  const [inputUsername, setInputUsername] = useState("");
  const [inputPassword, setInputPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [inputEmail, setInputEmail] = useState("");
  const [show, setShow] = useState(false);
  const [loading, setLoading] = useState(false);
  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);
  
    if (inputPassword !== confirmPassword) {
      alert("Passwords do not match!");
      setShow(true);
      setLoading(false);
      return;
    }
  
    const userData = {
      firstName: inputFirstName,
      lastName: inputLastName,
      username: inputUsername,
      email: inputEmail,
      password: inputPassword,
      role: "user"
    };
  
    console.log("📤 Sending request:", userData); // ✅ Debug: vezi ce trimite frontend-ul
  
    try {
      const response = await axios.post("http://localhost:5000/api/auth/register", userData);
      console.log("✅ Registration successful:", response.data);
      alert("Account created successfully!");
      navigate("/login");
    } catch (error) {
      console.error("❌ Registration failed:", error.response);
      alert("Registration failed: " + (error.response?.data?.message || "Unknown error"));
    }
  
    setLoading(false);
  };
  

  return (
    <div className="sign-in__wrapper"
      style={{ backgroundImage: `url(${BackgroundImage})`, fontFamily: 'Rasa, system-ui' }}>
      <div className="sign-in__backdrop"></div>

      <Form className="shadow p-4 rounded" style={{ background: "white" }} onSubmit={handleSubmit}>
        <img className="mx-auto d-block mb-2" src={Logo} alt="logo" />
        <div className="h4 mb-2 text-center custom-font">Sign Up</div>

        {show && (
          <Alert className="mb-2" variant="danger" onClose={() => setShow(false)} dismissible>
            Passwords do not match!
          </Alert>
        )}

        <Form.Group className="mb-2 " controlId="firstName">
          <Form.Label>First Name</Form.Label>
          <Form.Control type="text" value={inputFirstName} placeholder="Enter your first name"
            onChange={(e) => setInputFirstName(e.target.value)} required />
        </Form.Group>

        <Form.Group className="mb-2" controlId="lastName">
          <Form.Label>Last Name</Form.Label>
          <Form.Control type="text" value={inputLastName} placeholder="Enter your last name"
            onChange={(e) => setInputLastName(e.target.value)} required />
        </Form.Group>

        <Form.Group className="mb-2" controlId="username">
          <Form.Label>Username</Form.Label>
          <Form.Control type="text" value={inputUsername} placeholder="Choose a username"
            onChange={(e) => setInputUsername(e.target.value)} required />
        </Form.Group>

        <Form.Group className="mb-2" controlId="email">
          <Form.Label>Email</Form.Label>
          <Form.Control type="email" value={inputEmail} placeholder="Enter your email"
            onChange={(e) => setInputEmail(e.target.value)} required />
        </Form.Group>

        <Form.Group className="mb-2" controlId="password">
          <Form.Label>Password</Form.Label>
          <Form.Control type="password" value={inputPassword} placeholder="Enter a password"
            onChange={(e) => setInputPassword(e.target.value)} required />
        </Form.Group>

        <Form.Group className="mb-2" controlId="confirmPassword">
          <Form.Label>Confirm Password</Form.Label>
          <Form.Control type="password" value={confirmPassword} placeholder="Re-enter your password"
            onChange={(e) => setConfirmPassword(e.target.value)} required />
        </Form.Group>

        {!loading ? (
          <Button className="w-100" style={{ backgroundColor: "rgb(44, 9, 240)", border: "none" }}
            variant="primary" type="submit">
            Register
          </Button>
        ) : (
          <Button className="w-100" variant="primary" type="submit" disabled>
            Registering...
          </Button>
        )}

        <div className="text-center mt-3">
          <span className="text-muted">Already have an account? </span>
          <button className="btn btn-link p-0" style={{ color: "rgb(44, 9, 240)", fontWeight: "bold", textDecoration: "none" }}
            onClick={() => navigate("/login")}>
            Log in here
          </button>
        </div>

      </Form>
    </div>
  );
};

export default Register;
