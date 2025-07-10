import React, { useState } from "react";
import { register } from "../services/authService";
import { useNavigate } from "react-router-dom"; 
import "../styles/RegisterPage.css"; 

const RegisterPage = () => {
  const [form, setForm] = useState({
    username: "",
    email: "",
    password: "",
    phone: "",
  });

  const [message, setMessage] = useState({ text: "", isError: false });
  const navigate = useNavigate(); 

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await register(form);
      setMessage({ text: "Registration successful! Redirecting...", isError: false });
      setForm({ username: "", email: "", password: "", phone: "" });
      
      setTimeout(() => navigate("/login"), 2000);
    } catch (err) {
      setMessage({
        text: err.response?.data?.message || "Registration failed. Please try again.",
        isError: true
      });
    }
  };

  return (
    <div className="form-container">
      <h2>Create Account</h2>
      <form onSubmit={handleSubmit}>
        <input
          name="username"
          value={form.username}
          onChange={handleChange}
          placeholder="Username"
          required
          minLength="3"
        />
        <input
          name="email"
          type="email"
          value={form.email}
          onChange={handleChange}
          placeholder="Email"
          required
        />
        <input
          name="password"
          type="password"
          value={form.password}
          onChange={handleChange}
          placeholder="Password"
          required
          minLength="6"
        />
        <input
          name="phone"
          type="tel"
          value={form.phone}
          onChange={handleChange}
          placeholder="Phone (optional)"
        />
        <button type="submit">Register</button>
      </form>
      {message.text && (
        <p className={message.isError ? "" : "success"}>{message.text}</p>
      )}
      <p style={{ marginTop: "1rem", textAlign: "center" }}>
        Already have an account? <a href="/login">Login here</a>
      </p>
    </div>
  );
};

export default RegisterPage;