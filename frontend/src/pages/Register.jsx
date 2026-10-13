import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { registerUser } from "../services/api";

function Register() {

  const [name, setName] =
    useState("");

  const [email, setEmail] =
    useState("");

  const [password, setPassword] =
    useState("");

  const [role, setRole] =
    useState("customer");

  const [error, setError] =
    useState("");

  const navigate = useNavigate();

  async function handleRegister(e) {

    e.preventDefault();

    try {

      await registerUser(
        name,
        email,
        password,
        role
      );

      navigate("/login");

    } catch {
      setError(
        "Registration failed"
      );
    }
  }

  return (
    <div className="auth-page">

      <div className="auth-card">

        <div className="auth-logo">
          meesho
        </div>

        <h1>Create Account</h1>

        <p>
          Join us and start shopping
        </p>

        <form
          onSubmit={handleRegister}
          className="auth-form"
        >

          <label>Name</label>

          <input
            type="text"
            placeholder="Enter your name"
            value={name}
            onChange={(e) =>
              setName(e.target.value)
            }
            required
          />

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
            placeholder="Create a password"
            value={password}
            onChange={(e) =>
              setPassword(e.target.value)
            }
            required
          />

          <label>Account Type</label>

          <select
            value={role}
            onChange={(e) =>
              setRole(e.target.value)
            }
          >
            <option value="customer">
              Customer
            </option>

            <option value="seller">
              Seller
            </option>
          </select>

          {error && (
            <p className="form-error">
              {error}
            </p>
          )}

          <button type="submit">
            Create Account
          </button>

        </form>

        <p className="auth-bottom">
          Already have an account?

          <span
            onClick={() =>
              navigate("/login")
            }
          >
            Login
          </span>
        </p>

      </div>

    </div>
  );
}

export default Register;