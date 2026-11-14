import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";
import { YouTubeLogo, Spinner } from "./Icons.jsx";

function LoginPage() {
  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!identifier.trim() || !password.trim()) {
      setError("Please enter your username/email and password.");
      return;
    }

    try {
      setLoading(true);
      setError("");

      const isEmail = identifier.includes("@");
      const credentials = {
        password: password.trim(),
        ...(isEmail ? { email: identifier.trim() } : { username: identifier.trim() }),
      };

      await login(credentials);
      navigate("/");
    } catch (err) {
      setError(err.message || "Failed to sign in. Please verify your credentials.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "#0f0f0f",
        padding: "20px",
      }}
    >
      <div
        style={{
          width: "100%",
          maxWidth: "420px",
          backgroundColor: "#1e1e1e",
          border: "1px solid #333",
          borderRadius: "16px",
          padding: "36px 32px",
          boxShadow: "0 16px 32px rgba(0,0,0,0.5)",
        }}
      >
        <div style={{ display: "flex", justifyContent: "center", marginBottom: "24px" }}>
          <YouTubeLogo />
        </div>

        <h2
          style={{
            fontSize: "22px",
            fontWeight: "700",
            color: "#fff",
            textAlign: "center",
            marginBottom: "8px",
          }}
        >
          Sign In
        </h2>
        <p
          style={{
            fontSize: "13px",
            color: "#aaa",
            textAlign: "center",
            marginBottom: "24px",
          }}
        >
          to continue to VideoTube
        </p>

        {error && (
          <div
            style={{
              backgroundColor: "rgba(239, 68, 68, 0.15)",
              border: "1px solid #ef4444",
              color: "#fca5a5",
              padding: "10px 14px",
              borderRadius: "8px",
              marginBottom: "18px",
              fontSize: "13px",
            }}
          >
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="yt-input-group">
            <label>Username or Email</label>
            <input
              type="text"
              className="yt-input-control"
              placeholder="e.g. johndoe or user@example.com"
              value={identifier}
              onChange={(e) => setIdentifier(e.target.value)}
              required
            />
          </div>

          <div className="yt-input-group">
            <label>Password</label>
            <input
              type="password"
              className="yt-input-control"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="yt-btn yt-btn-primary"
            style={{
              width: "100%",
              padding: "11px",
              fontSize: "15px",
              marginTop: "8px",
              marginBottom: "20px",
              borderRadius: "8px",
            }}
          >
            {loading ? (
              <>
                <Spinner className="w-5 h-5" />
                <span>Signing in...</span>
              </>
            ) : (
              "Sign In"
            )}
          </button>
        </form>

        <div style={{ textAlign: "center", fontSize: "14px", color: "#aaa" }}>
          Don't have an account?{" "}
          <Link
            to="/register"
            style={{ color: "#3ea6ff", textDecoration: "none", fontWeight: "600" }}
          >
            Create account
          </Link>
        </div>
      </div>
    </div>
  );
}

export default LoginPage;
