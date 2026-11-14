import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { authApi } from "../api/client.js";
import { useAuth } from "../context/AuthContext.jsx";
import VideoCard from "../components/VideoCard.jsx";
import { HistoryIcon, Spinner } from "../components/Icons.jsx";

const History = () => {
  const { isAuthenticated, loading: authLoading } = useAuth();
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchHistory = async () => {
      if (!isAuthenticated) {
        setLoading(false);
        return;
      }
      try {
        setLoading(true);
        const res = await authApi.getWatchHistory();
        setHistory(res.data?.data || []);
      } catch (err) {
        console.error("Error fetching watch history:", err);
      } finally {
        setLoading(false);
      }
    };

    if (!authLoading) {
      fetchHistory();
    }
  }, [isAuthenticated, authLoading]);

  if (!isAuthenticated && !authLoading) {
    return (
      <div style={{ textAlign: "center", padding: "60px 20px", maxWidth: "480px", margin: "40px auto", backgroundColor: "#1e1e1e", borderRadius: "16px" }}>
        <h2 style={{ fontSize: "20px", fontWeight: "700", marginBottom: "8px", color: "#fff" }}>
          Keep track of what you watch
        </h2>
        <p style={{ color: "#aaa", fontSize: "14px", marginBottom: "20px" }}>
          Sign in to access your watch history across all devices.
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
        <HistoryIcon className="w-6 h-6 text-blue-400" />
        Watch History ({history.length})
      </h1>

      {loading ? (
        <div style={{ display: "flex", justifyContent: "center", padding: "50px" }}>
          <Spinner className="w-8 h-8 text-red-500" />
        </div>
      ) : history.length === 0 ? (
        <div style={{ textAlign: "center", padding: "60px 20px", backgroundColor: "#1e1e1e", borderRadius: "16px", color: "#aaa", maxWidth: "540px", margin: "40px auto" }}>
          Your watch history is empty. Start exploring videos on VideoTube!
        </div>
      ) : (
        <div className="yt-video-grid">
          {history.map((vid) => (
            <VideoCard key={vid._id} video={vid} />
          ))}
        </div>
      )}
    </div>
  );
};

export default History;
