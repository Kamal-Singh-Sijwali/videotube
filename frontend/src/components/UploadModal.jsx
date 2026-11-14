import React, { useState } from "react";
import { videoApi } from "../api/client.js";
import { CloseIcon, Spinner, UploadIcon } from "./Icons.jsx";

const UploadModal = ({ isOpen, onClose, onUploadSuccess }) => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [videoFile, setVideoFile] = useState(null);
  const [thumbnail, setThumbnail] = useState(null);
  const [thumbnailPreview, setThumbnailPreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  if (!isOpen) return null;

  const handleThumbnailChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setThumbnail(file);
      setThumbnailPreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title.trim() || !description.trim()) {
      setError("Please provide both title and description.");
      return;
    }
    if (!videoFile) {
      setError("Please select a video file to upload.");
      return;
    }
    if (!thumbnail) {
      setError("Please select a thumbnail image.");
      return;
    }

    try {
      setLoading(true);
      setError("");

      const formData = new FormData();
      formData.append("title", title.trim());
      formData.append("description", description.trim());
      formData.append("videoFile", videoFile);
      formData.append("thumbnail", thumbnail);

      await videoApi.publishVideo(formData);

      setTitle("");
      setDescription("");
      setVideoFile(null);
      setThumbnail(null);
      setThumbnailPreview(null);
      onUploadSuccess?.();
      onClose();
    } catch (err) {
      setError(err.message || "Failed to upload video. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="yt-modal-overlay" onClick={onClose}>
      <div className="yt-modal-card" onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px", borderBottom: "1px solid #333", paddingBottom: "12px" }}>
          <h2 style={{ fontSize: "18px", fontWeight: "700", color: "#fff", display: "flex", alignItems: "center", gap: "10px" }}>
            <UploadIcon className="w-5 h-5 text-red-500" />
            Upload Video
          </h2>
          <button
            onClick={onClose}
            style={{ background: "transparent", border: "none", color: "#aaa", cursor: "pointer" }}
          >
            <CloseIcon className="w-5 h-5" />
          </button>
        </div>

        {error && (
          <div style={{ backgroundColor: "rgba(239, 68, 68, 0.2)", border: "1px solid #ef4444", color: "#fca5a5", padding: "10px 14px", borderRadius: "8px", marginBottom: "16px", fontSize: "13px" }}>
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          {/* Title */}
          <div className="yt-input-group">
            <label>Title *</label>
            <input
              type="text"
              className="yt-input-control"
              placeholder="Add a title that describes your video"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
            />
          </div>

          {/* Description */}
          <div className="yt-input-group">
            <label>Description *</label>
            <textarea
              className="yt-input-control"
              rows={4}
              placeholder="Tell viewers about your video"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              required
            />
          </div>

          {/* Video File */}
          <div className="yt-input-group">
            <label>Video File (MP4, MKV, WebM) *</label>
            <input
              type="file"
              accept="video/*"
              className="yt-input-control"
              onChange={(e) => setVideoFile(e.target.files[0])}
              required
            />
            {videoFile && (
              <div style={{ fontSize: "12px", color: "#3ea6ff", marginTop: "4px" }}>
                Selected: {videoFile.name} ({(videoFile.size / (1024 * 1024)).toFixed(1)} MB)
              </div>
            )}
          </div>

          {/* Thumbnail */}
          <div className="yt-input-group">
            <label>Thumbnail Image (PNG, JPG) *</label>
            <input
              type="file"
              accept="image/*"
              className="yt-input-control"
              onChange={handleThumbnailChange}
              required
            />
            {thumbnailPreview && (
              <div style={{ marginTop: "10px", width: "160px", aspectRatio: "16/9", borderRadius: "8px", overflow: "hidden", border: "1px solid #444" }}>
                <img src={thumbnailPreview} alt="Preview" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
              </div>
            )}
          </div>

          {/* Actions */}
          <div style={{ display: "flex", justifyContent: "flex-end", gap: "12px", marginTop: "24px" }}>
            <button
              type="button"
              onClick={onClose}
              className="yt-btn yt-btn-secondary"
              disabled={loading}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="yt-btn yt-btn-primary"
              disabled={loading}
              style={{ minWidth: "120px" }}
            >
              {loading ? (
                <>
                  <Spinner className="w-4 h-4" />
                  <span>Uploading...</span>
                </>
              ) : (
                "Publish Video"
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default UploadModal;
