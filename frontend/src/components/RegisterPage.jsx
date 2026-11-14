import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { authApi } from "../api/client.js";
import { useAuth } from "../context/AuthContext.jsx";
import { YouTubeLogo, Spinner, UserIcon } from "./Icons.jsx";

function RegisterPage() {
  const [fullName, setFullName] = useState("");
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [avatar, setAvatar] = useState(null);
  const [avatarPreview, setAvatarPreview] = useState(null);
  const [coverImage, setCoverImage] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const { login } = useAuth();
  const navigate = useNavigate();

  const handleAvatarChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setAvatar(file);
      setAvatarPreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!fullName.trim() || !username.trim() || !email.trim() || !password.trim()) {
      setError("All fields are required.");
      return;
    }
    if (!avatar) {
      setError("Please select an avatar profile picture.");
      return;
    }

    try {
      setLoading(true);
      setError("");

      const formData = new FormData();
      formData.append("fullName", fullName.trim());
      formData.append("username", username.trim().toLowerCase());
      formData.append("email", email.trim().toLowerCase());
      formData.append("password", password.trim());
      formData.append("avatar", avatar);
      if (coverImage) {
        formData.append("coverImage", coverImage);
      }

      await authApi.register(formData);

      // Auto login after registration
      try {
        await login({ username: username.trim().toLowerCase(), password: password.trim() });
        navigate("/");
      } catch (_) {
        navigate("/login");
      }
    } catch (err) {
      setError(err.message || "Registration failed. Username or email may already be taken.");
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
        padding: "30px 20px",
      }}
    >
      <div
        style={{
          width: "100%",
          maxWidth: "480px",
          backgroundColor: "#1e1e1e",
          border: "1px solid #333",
          borderRadius: "16px",
          padding: "36px 32px",
          boxShadow: "0 16px 32px rgba(0,0,0,0.5)",
        }}
      >
        <div style={{ display: "flex", justifyContent: "center", marginBottom: "20px" }}>
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
          Create your Account
        </h2>
        <p
          style={{
            fontSize: "13px",
            color: "#aaa",
            textAlign: "center",
            marginBottom: "24px",
          }}
        >
          Join VideoTube to share videos, like, and comment
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
          {/* Avatar Upload Preview */}
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              marginBottom: "20px",
            }}
          >
            <label
              htmlFor="avatar-input"
              style={{
                width: "80px",
                height: "80px",
                borderRadius: "50%",
                backgroundColor: "#2a2a2a",
                border: "2px dashed #444",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                cursor: "pointer",
                overflow: "hidden",
                position: "relative",
              }}
            >
              {avatarPreview ? (
                <img
                  src={avatarPreview}
                  alt="Avatar preview"
                  style={{ width: "100%", height: "100%", objectFit: "cover" }}
                />
              ) : (
                <div style={{ textAlign: "center", color: "#aaa" }}>
                  <UserIcon className="w-8 h-8 mx-auto" />
                  <span style={{ fontSize: "10px", display: "block" }}>+ Avatar</span>
                </div>
              )}
            </label>
            <input
              id="avatar-input"
              type="file"
              accept="image/*"
              style={{ display: "none" }}
              onChange={handleAvatarChange}
            />
            <span style={{ fontSize: "12px", color: "#888", marginTop: "6px" }}>
              Upload Profile Photo *
            </span>
          </div>

          <div className="yt-input-group">
            <label>Full Name *</label>
            <input
              type="text"
              className="yt-input-control"
              placeholder="e.g. John Doe"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              required
            />
          </div>

          <div className="yt-input-group">
            <label>Username *</label>
            <input
              type="text"
              className="yt-input-control"
              placeholder="e.g. johndoe"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
          </div>

          <div className="yt-input-group">
            <label>Email *</label>
            <input
              type="email"
              className="yt-input-control"
              placeholder="e.g. user@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="yt-input-group">
            <label>Password *</label>
            <input
              type="password"
              className="yt-input-control"
              placeholder="At least 6 characters"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <div className="yt-input-group">
            <label>Cover Banner (Optional)</label>
            <input
              type="file"
              accept="image/*"
              className="yt-input-control"
              onChange={(e) => setCoverImage(e.target.files[0])}
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
                <span>Creating account...</span>
              </>
            ) : (
              "Sign Up"
            )}
          </button>
        </form>

        <div style={{ textAlign: "center", fontSize: "14px", color: "#aaa" }}>
          Already have an account?{" "}
          <Link
            to="/login"
            style={{ color: "#3ea6ff", textDecoration: "none", fontWeight: "600" }}
          >
            Sign in
          </Link>
        </div>
      </div>
    </div>
  );
}

export default RegisterPage;
