import React, { useState } from "react";
import "../auth.form.scss";
import { useNavigate, Link } from "react-router";
import { useAuth } from "../Hooks/useAuth.js";

const Login = () => {

  const navigate = useNavigate();

  // Get authentication functions and state FIRST
  const { loading, HandleLogin } = useAuth();

  // State
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    await HandleLogin({
      email,
      password
    });
    navigate("/");
  };

  // Show loading screen
  if (loading) {
    return (
      <main>
        <h1>Loading......</h1>
      </main>
    );
  }

  return (
    <main>
      <div className="form_container">

        <h1>Login</h1>

        <form onSubmit={handleSubmit}>

          <div className="input_group">
            <label htmlFor="email">
              Email
            </label>

            <input
              onChange={(e) => setEmail(e.target.value)}
              type="email"
              id="email"
              name="email"
              placeholder="Enter Email Address"
            />
          </div>

          <div className="input_group">
            <label htmlFor="password">
              Password
            </label>

            <input
              onChange={(e) => setPassword(e.target.value)}
              type="password"
              id="password"
              name="password"
              placeholder="Enter Password"
            />
          </div>

          <button className="button primary_button">
            Login
          </button>

        </form>

        <p>
          Don't have an account?
          <Link to="/register">Register</Link>
        </p>

      </div>
    </main>
  );
};

export default Login;