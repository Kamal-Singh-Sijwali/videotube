import React, { useState, useEffect } from "react";
import { useSearchParams, useOutletContext } from "react-router-dom";
import { videoApi } from "../api/client.js";
import VideoCard from "./VideoCard.jsx";
import { Spinner, UploadIcon } from "./Icons.jsx";

const CATEGORIES = [
  "All",
  "React & Node",
  "Web Development",
  "Podcasts",
  "Gaming",
  "Music",
  "Tech News",
  "Artificial Intelligence",
  "Design",
];

function AllVideos() {
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [activeCategory, setActiveCategory] = useState("All");
  const [searchParams] = useSearchParams();
  const searchQuery = searchParams.get("q") || "";
  const outletContext = useOutletContext() || {};

  // Formulate the query to send to the backend / YouTube API
  const categoryQuery = activeCategory === "All" 
    ? (searchQuery || "") 
    : (searchQuery ? `${searchQuery} ${activeCategory}` : activeCategory);

  const fetchVideos = async () => {
    try {
      setLoading(true);
      setError("");
      const res = await videoApi.getAllVideos(categoryQuery);
      setVideos(res.data?.data || []);
    } catch (err) {
      setError(err.message || "Failed to load videos. Make sure the backend server is running.");
    } finally {
      setLoading(false);
    }
  };

  // Re-fetch from the YouTube API whenever the user clicks a category or searches
  useEffect(() => {
    fetchVideos();
  }, [activeCategory, searchQuery, outletContext.refreshTrigger]);

  const handleCategorySelect = (cat) => {
    setActiveCategory(cat);
  };

  return (
    <div>
      {/* Category Filter Chips */}
      <div className="yt-chips-container">
        {CATEGORIES.map((cat) => (
          <button
            key={cat}
            onClick={() => handleCategorySelect(cat)}
            className={`yt-chip ${activeCategory === cat ? "active" : ""}`}
          >
            {cat}
          </button>
        ))}
      </div>

      {(searchQuery || activeCategory !== "All") && (
        <div style={{ marginBottom: "20px", fontSize: "15px", color: "#aaa" }}>
          Showing videos for{" "}
          <span style={{ color: "#fff", fontWeight: "bold" }}>
            "{searchQuery ? `${searchQuery} (${activeCategory})` : activeCategory}"
          </span>
          {activeCategory !== "All" && (
            <button
              onClick={() => setActiveCategory("All")}
              style={{
                marginLeft: "12px",
                background: "transparent",
                border: "none",
                color: "#3ea6ff",
                cursor: "pointer",
                fontSize: "13px"
              }}
            >
              Clear filter
            </button>
          )}
        </div>
      )}

      {loading ? (
        <div style={{ display: "flex", justifyContent: "center", alignItems: "center", minHeight: "350px", flexDirection: "column", gap: "16px" }}>
          <Spinner className="w-8 h-8 text-red-500" />
          <p style={{ color: "#aaa", fontSize: "14px" }}>
            Searching YouTube for {activeCategory === "All" ? "trending videos" : activeCategory}...
          </p>
        </div>
      ) : error ? (
        <div style={{ backgroundColor: "#1e1e1e", border: "1px solid #383838", borderRadius: "12px", padding: "32px", textAlign: "center", margin: "40px auto", maxWidth: "500px" }}>
          <div style={{ color: "#ff5252", fontSize: "16px", fontWeight: "600", marginBottom: "8px" }}>
            Could not fetch videos
          </div>
          <p style={{ color: "#aaa", fontSize: "13px", marginBottom: "20px" }}>{error}</p>
          <button onClick={fetchVideos} className="yt-btn yt-btn-secondary">
            Try Again
          </button>
        </div>
      ) : videos.length === 0 ? (
        <div style={{ backgroundColor: "#1e1e1e", border: "1px solid #282828", borderRadius: "16px", padding: "60px 20px", textAlign: "center", maxWidth: "600px", margin: "40px auto" }}>
          <div style={{ width: "64px", height: "64px", borderRadius: "50%", backgroundColor: "#282828", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 16px" }}>
            <UploadIcon className="w-8 h-8 text-gray-400" />
          </div>
          <h3 style={{ fontSize: "18px", fontWeight: "600", marginBottom: "8px", color: "#fff" }}>
            No videos found for "{categoryQuery}"
          </h3>
          <p style={{ color: "#aaa", fontSize: "14px", marginBottom: "24px" }}>
            Try selecting a different category or search term.
          </p>
          <button onClick={() => setActiveCategory("All")} className="yt-btn yt-btn-secondary">
            View All Videos
          </button>
        </div>
      ) : (
        <div className="yt-video-grid">
          {videos.map((video) => (
            <VideoCard key={video._id} video={video} />
          ))}
        </div>
      )}
    </div>
  );
}

export default AllVideos;
