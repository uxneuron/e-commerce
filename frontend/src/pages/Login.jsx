import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { loginUser } from "../services/api";

function Login() {

  const [email, setEmail] =
    useState("");

  const [password, setPassword] =
    useState("");

  const [error, setError] =
    useState("");

  const navigate = useNavigate();

  async function handleLogin(e) {

    e.preventDefault();

    try {

      const data =
        await loginUser(
          email,
          password
        );

      localStorage.setItem(
        "token",
        data.access_token
      );

      navigate("/");

    } catch {
      setError(
        "Invalid email or password"
      );
    }
  }

  return (
    <div className="auth-page">

      <div className="auth-card">

        <div className="auth-logo">
          meesho
        </div>

        <h1>Welcome Back</h1>

        <p>
          Login to continue shopping
        </p>

        <form
          onSubmit={handleLogin}
          className="auth-form"
        >

          <label>Email</label>

          <input
            type="email"
            placeholder="Enter your email"
            value={email}
            onChange={(e) =>
              setEmail(e.target.value)
            }
            required
          />

          <label>Password</label>

          <input
            type="password"
            placeholder="Enter your password"
            value={password}
            onChange={(e) =>
              setPassword(e.target.value)
            }
            required
          />

          {error && (
            <p className="form-error">
              {error}
            </p>
          )}

          <button type="submit">
            Login
          </button>

        </form>

        <p className="auth-bottom">
          Don't have an account?

          <span
            onClick={() =>
              navigate("/register")
            }
          >
            Register
          </span>
        </p>

      </div>

    </div>
  );
}

export default Login;