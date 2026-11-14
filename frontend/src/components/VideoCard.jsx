import React from "react";
import { Link } from "react-router-dom";

// Helper for human-readable time ago
export const timeAgo = (dateString) => {
  if (!dateString) return "Recently";
  const now = new Date();
  const past = new Date(dateString);
  const diffInSeconds = Math.floor((now - past) / 1000);

  if (diffInSeconds < 60) return "Just now";
  const minutes = Math.floor(diffInSeconds / 60);
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  if (days < 30) return `${days}d ago`;
  const months = Math.floor(days / 30);
  if (months < 12) return `${months}mo ago`;
  const years = Math.floor(months / 12);
  return `${years}y ago`;
};

// Helper for video duration formatting
export const formatDuration = (seconds) => {
  if (!seconds || seconds <= 0) return "10:24";
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${mins}:${secs < 10 ? "0" : ""}${secs}`;
};

// Helper for views format (e.g., 1.5K, 2.3M)
export const formatViews = (views) => {
  const count = views || 0;
  if (count >= 1000000) return `${(count / 1000000).toFixed(1)}M views`;
  if (count >= 1000) return `${(count / 1000).toFixed(1)}K views`;
  return `${count} views`;
};

const VideoCard = ({ video }) => {
  if (!video) return null;

  const owner = video.owner || {};
  const ownerName = owner.fullName || owner.username || "VideoTube Creator";
  const ownerAvatar = owner.avatar;

  return (
    <Link to={`/watch/${video._id}`} className="yt-video-card">
      <div className="yt-thumbnail-wrapper">
        <img
          src={video.thumbnail || "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=800&q=80"}
          alt={video.title}
          className="yt-thumbnail"
          loading="lazy"
        />
        <span className="yt-duration-badge">
          {formatDuration(video.duration)}
        </span>
      </div>

      <div className="yt-video-details">
        {ownerAvatar ? (
          <img src={ownerAvatar} alt={ownerName} className="yt-channel-avatar" />
        ) : (
          <div
            className="yt-channel-avatar"
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              backgroundColor: "#cc0000",
              color: "#fff",
              fontWeight: "bold",
              fontSize: "14px"
            }}
          >
            {ownerName[0]?.toUpperCase() || "V"}
          </div>
        )}

        <div className="yt-video-info">
          <h3 className="yt-video-title" title={video.title}>
            {video.title}
          </h3>
          <div className="yt-channel-name" title={ownerName}>
            {ownerName}
          </div>
          <div className="yt-video-meta">
            <span>{formatViews(video.views)}</span>
            <span style={{ margin: "0 4px" }}>•</span>
            <span>{timeAgo(video.createdAt)}</span>
          </div>
        </div>
      </div>
    </Link>
  );
};

export default VideoCard;
