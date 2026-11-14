import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { likeApi } from "../api/client.js";
import { useAuth } from "../context/AuthContext.jsx";
import VideoCard from "../components/VideoCard.jsx";
import { LikedIcon, Spinner } from "../components/Icons.jsx";

const LikedVideos = () => {
  const { isAuthenticated, loading: authLoading } = useAuth();
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchLiked = async () => {
      if (!isAuthenticated) {
        setLoading(false);
        return;
      }
      try {
        setLoading(true);
        const res = await likeApi.getLikedVideos();
        setVideos(res.data?.data || []);
      } catch (err) {
        console.error("Error fetching liked videos:", err);
      } finally {
        setLoading(false);
      }
    };

    if (!authLoading) {
      fetchLiked();
    }
  }, [isAuthenticated, authLoading]);

  if (!isAuthenticated && !authLoading) {
    return (
      <div style={{ textAlign: "center", padding: "60px 20px", maxWidth: "480px", margin: "40px auto", backgroundColor: "#1e1e1e", borderRadius: "16px" }}>
        <h2 style={{ fontSize: "20px", fontWeight: "700", marginBottom: "8px", color: "#fff" }}>
          Liked Videos
        </h2>
        <p style={{ color: "#aaa", fontSize: "14px", marginBottom: "20px" }}>
          Sign in to view your collection of liked videos.
        </p>
        <Link to="/login" className="yt-btn yt-btn-primary">
          Sign In
        </Link>
      </div>
    );
  }

  return (
    <div>
      <h1 style={{ fontSize: "22px", fontWeight: "700", color: "#fff", marginBottom: "20px", display: "flex", alignItems: "center", gap: "10px" }}>
        <LikedIcon className="w-6 h-6 text-red-500" />
        Liked Videos ({videos.length})
      </h1>

      {loading ? (
        <div style={{ display: "flex", justifyContent: "center", padding: "50px" }}>
          <Spinner className="w-8 h-8 text-red-500" />
        </div>
      ) : videos.length === 0 ? (
        <div style={{ textAlign: "center", padding: "60px 20px", backgroundColor: "#1e1e1e", borderRadius: "16px", color: "#aaa", maxWidth: "540px", margin: "40px auto" }}>
          No liked videos yet. When you like a video, it will appear here!
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
};

export default LikedVideos;
