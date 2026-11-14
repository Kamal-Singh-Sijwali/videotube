import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";
import {
  YouTubeLogo,
  SearchIcon,
  UploadIcon,
  UserIcon,
  LogOutIcon,
  DashboardIcon,
  MenuIcon
} from "./Icons.jsx";

const Navbar = ({ onToggleSidebar, onOpenUpload }) => {
  const { user, isAuthenticated, logout } = useAuth();
  const [searchQuery, setSearchQuery] = useState("");
  const [showDropdown, setShowDropdown] = useState(false);
  const navigate = useNavigate();

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/?q=${encodeURIComponent(searchQuery.trim())}`);
    } else {
      navigate("/");
    }
  };

  return (
    <header className="yt-navbar">
      {/* Left: Menu & Logo */}
      <div style={{ display: "flex", alignItems: "center", gap: "14px" }}>
        <button
          onClick={onToggleSidebar}
          className="yt-icon-btn"
          title="Toggle Menu"
          aria-label="Toggle menu"
        >
          <MenuIcon size={22} />
        </button>
        <Link to="/" style={{ textDecoration: "none", display: "flex", alignItems: "center" }}>
          <YouTubeLogo />
        </Link>
      </div>

      {/* Center: Search Bar */}
      <form onSubmit={handleSearch} className="yt-search-container">
        <input
          type="text"
          className="yt-search-input"
          placeholder="Search videos, creators..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
        <button type="submit" className="yt-search-btn" title="Search" aria-label="Search">
          <SearchIcon size={20} />
        </button>
      </form>

      {/* Right: Actions & User Menu */}
      <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
        {isAuthenticated ? (
          <>
            <button
              onClick={onOpenUpload}
              className="yt-btn yt-btn-secondary"
              style={{
                height: "36px",
                padding: "0 14px",
                display: "inline-flex",
                alignItems: "center",
                gap: "7px",
                borderRadius: "18px"
              }}
              title="Upload Video"
            >
              <UploadIcon size={18} />
              <span style={{ fontSize: "13px", fontWeight: "600", lineHeight: "1" }}>Upload</span>
            </button>

            <div style={{ position: "relative", display: "flex", alignItems: "center" }}>
              <button
                onClick={() => setShowDropdown(!showDropdown)}
                style={{
                  background: "transparent",
                  border: "none",
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  padding: "0",
                  width: "36px",
                  height: "36px",
                  borderRadius: "50%"
                }}
                aria-label="Account menu"
              >
                {user?.avatar ? (
                  <img
                    src={user.avatar}
                    alt={user.fullName || "User"}
                    style={{
                      width: "34px",
                      height: "34px",
                      borderRadius: "50%",
                      objectFit: "cover",
                      border: "1.5px solid #3ea6ff"
                    }}
                  />
                ) : (
                  <div
                    style={{
                      width: "34px",
                      height: "34px",
                      borderRadius: "50%",
                      backgroundColor: "#cc0000",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      color: "#fff",
                      fontWeight: "bold",
                      fontSize: "14px"
                    }}
                  >
                    {user?.fullName?.[0]?.toUpperCase() || "U"}
                  </div>
                )}
              </button>

              {showDropdown && (
                <div
                  style={{
                    position: "absolute",
                    right: 0,
                    top: "44px",
                    width: "220px",
                    backgroundColor: "#282828",
                    borderRadius: "12px",
                    boxShadow: "0 8px 24px rgba(0,0,0,0.5)",
                    border: "1px solid #383838",
                    padding: "8px 0",
                    zIndex: 200
                  }}
                >
                  <div style={{ padding: "12px 16px", borderBottom: "1px solid #383838" }}>
                    <div style={{ fontWeight: "600", fontSize: "14px", color: "#fff" }}>
                      {user?.fullName || user?.username}
                    </div>
                    <div style={{ fontSize: "12px", color: "#aaa" }}>
                      @{user?.username}
                    </div>
                  </div>

                  <Link
                    to="/dashboard"
                    onClick={() => setShowDropdown(false)}
                    className="yt-nav-item"
                    style={{ margin: "4px 8px" }}
                  >
                    <DashboardIcon size={18} />
                    <span>Creator Studio</span>
                  </Link>

                  <button
                    onClick={() => {
                      setShowDropdown(false);
                      logout();
                      navigate("/");
                    }}
                    className="yt-nav-item"
                    style={{
                      width: "calc(100% - 16px)",
                      margin: "4px 8px",
                      background: "transparent",
                      border: "none",
                      color: "#ff5252"
                    }}
                  >
                    <LogOutIcon size={18} />
                    <span>Sign Out</span>
                  </button>
                </div>
              )}
            </div>
          </>
        ) : (
          <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
            <Link
              to="/login"
              className="yt-btn yt-btn-outline"
              style={{
                height: "36px",
                padding: "0 14px",
                display: "inline-flex",
                alignItems: "center",
                gap: "7px",
                borderRadius: "18px"
              }}
            >
              <UserIcon size={18} />
              <span style={{ fontSize: "13px", fontWeight: "600" }}>Sign In</span>
            </Link>
            <Link
              to="/register"
              className="yt-btn yt-btn-primary"
              style={{
                height: "36px",
                padding: "0 16px",
                display: "inline-flex",
                alignItems: "center",
                borderRadius: "18px",
                fontSize: "13px",
                fontWeight: "600"
              }}
            >
              <span>Sign Up</span>
            </Link>
          </div>
        )}
      </div>
    </header>
  );
};

export default Navbar;
