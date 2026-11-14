import React, { useState, useEffect } from "react";
import { Link, useOutletContext } from "react-router-dom";
import { dashboardApi, videoApi } from "../api/client.js";
import { useAuth } from "../context/AuthContext.jsx";
import {
  UploadIcon,
  EyeIcon,
  SubscriptionsIcon,
  LikedIcon,
  TrashIcon,
  Spinner
} from "./Icons.jsx";
import { formatViews, timeAgo } from "./VideoCard.jsx";

function Dashboard() {
  const { user, isAuthenticated, loading: authLoading } = useAuth();
  const outletContext = useOutletContext() || {};

  const [stats, setStats] = useState({
    views: 0,
    subscribers: 0,
    totalVideos: 0,
    likes: 0,
  });
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [actionLoadingId, setActionLoadingId] = useState(null);

  const fetchDashboardData = async () => {
    if (!user?._id) return;
    try {
      setLoading(true);

      const [statsRes, videosRes] = await Promise.all([
        dashboardApi.getStats(user._id),
        dashboardApi.getVideos(user._id),
      ]);

      setStats(statsRes.data?.data || { views: 0, subscribers: 0, totalVideos: 0, likes: 0 });
      setVideos(videosRes.data?.data || []);
    } catch (err) {
      console.error("Dashboard data fetch error:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user?._id) {
      fetchDashboardData();
    }
  }, [user?._id, outletContext.refreshTrigger]);

  const handleTogglePublish = async (videoId) => {
    try {
      setActionLoadingId(videoId);
      const res = await videoApi.togglePublish(videoId);
      const updatedVideo = res.data?.data;
      setVideos((prev) =>
        prev.map((v) => (v._id === videoId ? { ...v, isPublished: updatedVideo.isPublished } : v))
      );
    } catch (err) {
      alert(err.message || "Failed to update video status.");
    } finally {
      setActionLoadingId(null);
    }
  };

  const handleDeleteVideo = async (videoId) => {
    if (!window.confirm("Are you sure you want to permanently delete this video?")) return;
    try {
      setActionLoadingId(videoId);
      await videoApi.deleteVideo(videoId);
      setVideos((prev) => prev.filter((v) => v._id !== videoId));
      setStats((prev) => ({
        ...prev,
        totalVideos: Math.max(0, prev.totalVideos - 1),
      }));
    } catch (err) {
      alert(err.message || "Failed to delete video.");
    } finally {
      setActionLoadingId(null);
    }
  };

  if (authLoading) {
    return (
      <div style={{ display: "flex", justifyContent: "center", alignItems: "center", minHeight: "400px" }}>
        <Spinner className="w-8 h-8 text-red-500" />
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div style={{ textAlign: "center", padding: "60px 20px", maxWidth: "480px", margin: "40px auto", backgroundColor: "#1e1e1e", borderRadius: "16px" }}>
        <h2 style={{ fontSize: "20px", fontWeight: "700", marginBottom: "8px", color: "#fff" }}>
          Channel Dashboard
        </h2>
        <p style={{ color: "#aaa", fontSize: "14px", marginBottom: "20px" }}>
          Sign in to view your channel analytics and manage your uploaded content.
        </p>
        <Link to="/login" className="yt-btn yt-btn-primary">
          Sign In
        </Link>
      </div>
    );
  }

  return (
    <div style={{ maxWidth: "1200px", margin: "0 auto" }}>
      {/* Channel Header Banner */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          flexWrap: "wrap",
          gap: "16px",
          marginBottom: "28px",
          backgroundColor: "#1e1e1e",
          padding: "24px",
          borderRadius: "16px",
          border: "1px solid #2e2e2e",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
          {user?.avatar ? (
            <img
              src={user.avatar}
              alt={user.fullName}
              style={{ width: "64px", height: "64px", borderRadius: "50%", objectFit: "cover" }}
            />
          ) : (
            <div style={{ width: "64px", height: "64px", borderRadius: "50%", backgroundColor: "#cc0000", display: "flex", alignItems: "center", justifyContent: "center", color: "#fff", fontWeight: "bold", fontSize: "24px" }}>
              {user?.fullName?.[0]?.toUpperCase() || "U"}
            </div>
          )}
          <div>
            <h1 style={{ fontSize: "22px", fontWeight: "700", color: "#fff", marginBottom: "4px" }}>
              {user?.fullName || user?.username}'s Channel
            </h1>
            <div style={{ fontSize: "13px", color: "#aaa" }}>
              @{user?.username} • Creator Studio
            </div>
          </div>
        </div>

        {outletContext.openUpload && (
          <button onClick={outletContext.openUpload} className="yt-btn yt-btn-primary">
            <UploadIcon className="w-4 h-4" />
            <span>Upload New Video</span>
          </button>
        )}
      </div>

      {/* 4 Analytics Stat Cards */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
          gap: "16px",
          marginBottom: "36px",
        }}
      >
        {/* Card 1: Total Views */}
        <div style={{ backgroundColor: "#1e1e1e", border: "1px solid #2e2e2e", borderRadius: "14px", padding: "20px" }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "8px" }}>
            <span style={{ fontSize: "13px", color: "#aaa", fontWeight: "500" }}>Total Views</span>
            <div style={{ padding: "8px", borderRadius: "8px", backgroundColor: "rgba(59, 130, 246, 0.15)", color: "#3b82f6" }}>
              <EyeIcon className="w-5 h-5" />
            </div>
          </div>
          <div style={{ fontSize: "26px", fontWeight: "700", color: "#fff" }}>
            {formatViews(stats.views).replace(" views", "")}
          </div>
        </div>

        {/* Card 2: Subscribers */}
        <div style={{ backgroundColor: "#1e1e1e", border: "1px solid #2e2e2e", borderRadius: "14px", padding: "20px" }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "8px" }}>
            <span style={{ fontSize: "13px", color: "#aaa", fontWeight: "500" }}>Subscribers</span>
            <div style={{ padding: "8px", borderRadius: "8px", backgroundColor: "rgba(168, 85, 247, 0.15)", color: "#a855f7" }}>
              <SubscriptionsIcon className="w-5 h-5" />
            </div>
          </div>
          <div style={{ fontSize: "26px", fontWeight: "700", color: "#fff" }}>
            {stats.subscribers || 0}
          </div>
        </div>

        {/* Card 3: Total Videos */}
        <div style={{ backgroundColor: "#1e1e1e", border: "1px solid #2e2e2e", borderRadius: "14px", padding: "20px" }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "8px" }}>
            <span style={{ fontSize: "13px", color: "#aaa", fontWeight: "500" }}>Videos Uploaded</span>
            <div style={{ padding: "8px", borderRadius: "8px", backgroundColor: "rgba(239, 68, 68, 0.15)", color: "#ef4444" }}>
              <UploadIcon className="w-5 h-5" />
            </div>
          </div>
          <div style={{ fontSize: "26px", fontWeight: "700", color: "#fff" }}>
            {stats.totalVideos || 0}
          </div>
        </div>

        {/* Card 4: Total Likes */}
        <div style={{ backgroundColor: "#1e1e1e", border: "1px solid #2e2e2e", borderRadius: "14px", padding: "20px" }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "8px" }}>
            <span style={{ fontSize: "13px", color: "#aaa", fontWeight: "500" }}>Total Likes</span>
            <div style={{ padding: "8px", borderRadius: "8px", backgroundColor: "rgba(34, 197, 94, 0.15)", color: "#22c55e" }}>
              <LikedIcon className="w-5 h-5" />
            </div>
          </div>
          <div style={{ fontSize: "26px", fontWeight: "700", color: "#fff" }}>
            {stats.likes || 0}
          </div>
        </div>
      </div>

      {/* Uploaded Videos Table / Management */}
      <div style={{ backgroundColor: "#1e1e1e", border: "1px solid #2e2e2e", borderRadius: "16px", padding: "24px" }}>
        <h3 style={{ fontSize: "18px", fontWeight: "700", color: "#fff", marginBottom: "18px" }}>
          Channel Content ({videos.length})
        </h3>

        {loading ? (
          <div style={{ display: "flex", justifyContent: "center", padding: "40px" }}>
            <Spinner className="w-8 h-8 text-red-500" />
          </div>
        ) : videos.length === 0 ? (
          <div style={{ textAlign: "center", padding: "40px 20px" }}>
            <p style={{ color: "#aaa", fontSize: "14px", marginBottom: "16px" }}>
              You haven't uploaded any videos yet.
            </p>
            {outletContext.openUpload && (
              <button onClick={outletContext.openUpload} className="yt-btn yt-btn-primary">
                Upload your first video
              </button>
            )}
          </div>
        ) : (
          <div style={{ overflowX: "auto" }}>
            <table style={{ width: "100%", borderCollapse: "collapse", textAlign: "left" }}>
              <thead>
                <tr style={{ borderBottom: "1px solid #333", color: "#aaa", fontSize: "12px", textTransform: "uppercase" }}>
                  <th style={{ padding: "12px 16px" }}>Video</th>
                  <th style={{ padding: "12px 16px" }}>Visibility</th>
                  <th style={{ padding: "12px 16px" }}>Date</th>
                  <th style={{ padding: "12px 16px" }}>Views</th>
                  <th style={{ padding: "12px 16px", textAlign: "right" }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {videos.map((vid) => (
                  <tr key={vid._id} style={{ borderBottom: "1px solid #2a2a2a", fontSize: "14px" }}>
                    {/* Video Info */}
                    <td style={{ padding: "14px 16px" }}>
                      <div style={{ display: "flex", gap: "12px", alignItems: "center" }}>
                        <Link to={`/watch/${vid._id}`}>
                          <img
                            src={vid.thumbnail}
                            alt={vid.title}
                            style={{ width: "100px", aspectRatio: "16/9", borderRadius: "6px", objectFit: "cover" }}
                          />
                        </Link>
                        <div style={{ maxWidth: "280px" }}>
                          <Link
                            to={`/watch/${vid._id}`}
                            style={{ color: "#fff", fontWeight: "600", textDecoration: "none", fontSize: "14px", display: "-webkit-box", WebkitLineClamp: 1, WebkitBoxOrient: "vertical", overflow: "hidden" }}
                          >
                            {vid.title}
                          </Link>
                          <div style={{ color: "#888", fontSize: "12px", marginTop: "2px", display: "-webkit-box", WebkitLineClamp: 1, WebkitBoxOrient: "vertical", overflow: "hidden" }}>
                            {vid.description}
                          </div>
                        </div>
                      </div>
                    </td>

                    {/* Visibility status */}
                    <td style={{ padding: "14px 16px" }}>
                      <span
                        style={{
                          padding: "4px 10px",
                          borderRadius: "12px",
                          fontSize: "12px",
                          fontWeight: "600",
                          backgroundColor: vid.isPublished ? "rgba(34, 197, 94, 0.15)" : "rgba(239, 68, 68, 0.15)",
                          color: vid.isPublished ? "#4ade80" : "#f87171",
                        }}
                      >
                        {vid.isPublished ? "Public" : "Private"}
                      </span>
                    </td>

                    {/* Date */}
                    <td style={{ padding: "14px 16px", color: "#aaa", fontSize: "13px" }}>
                      {timeAgo(vid.createdAt)}
                    </td>

                    {/* Views */}
                    <td style={{ padding: "14px 16px", color: "#aaa", fontSize: "13px" }}>
                      {vid.views || 0}
                    </td>

                    {/* Actions */}
                    <td style={{ padding: "14px 16px", textAlign: "right" }}>
                      <div style={{ display: "flex", justifyContent: "flex-end", gap: "8px" }}>
                        <button
                          onClick={() => handleTogglePublish(vid._id)}
                          disabled={actionLoadingId === vid._id}
                          className="yt-btn yt-btn-secondary"
                          style={{ padding: "6px 12px", fontSize: "12px" }}
                        >
                          {vid.isPublished ? "Unpublish" : "Publish"}
                        </button>
                        <button
                          onClick={() => handleDeleteVideo(vid._id)}
                          disabled={actionLoadingId === vid._id}
                          style={{
                            background: "transparent",
                            border: "1px solid #ef444444",
                            color: "#ef4444",
                            borderRadius: "8px",
                            padding: "6px 10px",
                            cursor: "pointer",
                            display: "flex",
                            alignItems: "center"
                          }}
                          title="Delete video"
                        >
                          <TrashIcon className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

export default Dashboard;
