import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { videoApi } from "../api/client.js";
import { useAuth } from "../context/AuthContext.jsx";
import VideoCard from "./VideoCard.jsx";
import { Spinner, UploadIcon } from "./Icons.jsx";

function MyVideos() {
  const { user, isAuthenticated, loading: authLoading } = useAuth();
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUserVideos = async () => {
      if (!user?._id) return;
      try {
        setLoading(true);
        const res = await videoApi.getUserVideos(user._id);
        setVideos(res.data?.data || []);
      } catch (err) {
        console.error("Error fetching user videos:", err);
      } finally {
        setLoading(false);
      }
    };

    if (user?._id) {
      fetchUserVideos();
    } else if (!authLoading) {
      setLoading(false);
    }
  }, [user?._id, authLoading]);

  if (!isAuthenticated && !authLoading) {
    return (
      <div style={{ textAlign: "center", padding: "60px 20px", maxWidth: "480px", margin: "40px auto", backgroundColor: "#1e1e1e", borderRadius: "16px" }}>
        <h2 style={{ fontSize: "20px", fontWeight: "700", marginBottom: "8px", color: "#fff" }}>
          Your Videos
        </h2>
        <p style={{ color: "#aaa", fontSize: "14px", marginBottom: "20px" }}>
          Sign in to view and manage your uploaded content.
        </p>
        <Link to="/login" className="yt-btn yt-btn-primary">
          Sign In
        </Link>
      </div>
    );
  }

  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px" }}>
        <h1 style={{ fontSize: "22px", fontWeight: "700", color: "#fff" }}>
          My Uploaded Videos ({videos.length})
        </h1>
        <Link to="/dashboard" className="yt-btn yt-btn-secondary" style={{ fontSize: "13px" }}>
          Go to Creator Studio
        </Link>
      </div>

      {loading ? (
        <div style={{ display: "flex", justifyContent: "center", padding: "50px" }}>
          <Spinner className="w-8 h-8 text-red-500" />
        </div>
      ) : videos.length === 0 ? (
        <div style={{ textAlign: "center", padding: "60px 20px", backgroundColor: "#1e1e1e", borderRadius: "16px", color: "#aaa", maxWidth: "540px", margin: "40px auto" }}>
          You have not uploaded any videos yet.
        </div>
      ) : (
        <div className="yt-video-grid">
          {videos.map((vid) => (
            <VideoCard key={vid._id} video={vid} />
          ))}
        </div>
      )}
    </div>
  );
}

export default MyVideos;
