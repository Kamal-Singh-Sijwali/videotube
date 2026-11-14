import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { videoApi, likeApi, subscriptionApi, commentApi } from "../api/client.js";
import { useAuth } from "../context/AuthContext.jsx";
import {
  LikedIcon,
  SubscriptionsIcon,
  Spinner,
  TrashIcon,
  CheckIcon
} from "../components/Icons.jsx";
import { timeAgo, formatViews } from "../components/VideoCard.jsx";

const WatchVideo = () => {
  const { videoId } = useParams();
  const { user, isAuthenticated } = useAuth();

  const [video, setVideo] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Likes state
  const [likesCount, setLikesCount] = useState(0);
  const [isLiked, setIsLiked] = useState(false);
  const [likeLoading, setLikeLoading] = useState(false);

  // Subscription state
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [subscribersCount, setSubscribersCount] = useState(0);
  const [subLoading, setSubLoading] = useState(false);

  // Comments state
  const [comments, setComments] = useState([]);
  const [commentText, setCommentText] = useState("");
  const [commentLoading, setCommentLoading] = useState(false);

  // Recommended videos
  const [recommendedVideos, setRecommendedVideos] = useState([]);
  const [copied, setCopied] = useState(false);
  const [showFullDesc, setShowFullDesc] = useState(false);

  useEffect(() => {
    const fetchVideoData = async () => {
      try {
        setLoading(true);
        setError("");

        // 1. Fetch Video Details
        const res = await videoApi.getVideoById(videoId);
        const videoData = res.data?.data;
        setVideo(videoData);

        // 2. Fetch Like Status
        try {
          const likeRes = await likeApi.getVideoLikeStatus(videoId);
          setIsLiked(likeRes.data?.data?.isLiked || false);
          setLikesCount(likeRes.data?.data?.likesCount || 0);
        } catch (_) {}

        // 3. Fetch Subscription Status if channel exists
        if (videoData?.owner?._id) {
          try {
            const subRes = await subscriptionApi.getSubscriptionStatus(videoData.owner._id);
            setIsSubscribed(subRes.data?.data?.isSubscribed || false);
            setSubscribersCount(subRes.data?.data?.subscribersCount || 0);
          } catch (_) {}
        }

        // 4. Fetch Comments
        try {
          const commentsRes = await commentApi.getVideoComments(videoId);
          setComments(commentsRes.data?.data || []);
        } catch (_) {}

        // 5. Fetch Recommended Videos
        try {
          const allRes = await videoApi.getAllVideos();
          setRecommendedVideos(
            (allRes.data?.data || []).filter((v) => v._id !== videoId)
          );
        } catch (_) {}
      } catch (err) {
        setError(err.message || "Failed to load video.");
      } finally {
        setLoading(false);
      }
    };

    if (videoId) {
      fetchVideoData();
      window.scrollTo(0, 0);
    }
  }, [videoId]);

  // Toggle Like
  const handleToggleLike = async () => {
    if (!isAuthenticated) {
      alert("Please sign in to like this video.");
      return;
    }
    try {
      setLikeLoading(true);
      const res = await likeApi.toggleVideoLike(videoId);
      setIsLiked(res.data?.data?.isLiked);
      setLikesCount(res.data?.data?.likesCount);
    } catch (err) {
      alert(err.message || "Failed to update like.");
    } finally {
      setLikeLoading(false);
    }
  };

  // Toggle Subscribe
  const handleToggleSubscribe = async () => {
    if (!isAuthenticated) {
      alert("Please sign in to subscribe.");
      return;
    }
    if (video?.owner?._id === user?._id) {
      alert("You cannot subscribe to your own channel.");
      return;
    }
    try {
      setSubLoading(true);
      const res = await subscriptionApi.toggleSubscription(video.owner._id);
      setIsSubscribed(res.data?.data?.isSubscribed);
      setSubscribersCount(res.data?.data?.subscribersCount);
    } catch (err) {
      alert(err.message || "Failed to update subscription.");
    } finally {
      setSubLoading(false);
    }
  };

  // Add Comment
  const handleAddComment = async (e) => {
    e.preventDefault();
    if (!isAuthenticated) {
      alert("Please sign in to comment.");
      return;
    }
    if (!commentText.trim()) return;

    try {
      setCommentLoading(true);
      const res = await commentApi.addComment(videoId, commentText.trim());
      const newComment = res.data?.data;
      if (newComment) {
        setComments([newComment, ...comments]);
      }
      setCommentText("");
    } catch (err) {
      alert(err.message || "Failed to post comment.");
    } finally {
      setCommentLoading(false);
    }
  };

  // Delete Comment
  const handleDeleteComment = async (commentId) => {
    if (!window.confirm("Delete this comment?")) return;
    try {
      await commentApi.deleteComment(commentId);
      setComments(comments.filter((c) => c._id !== commentId));
    } catch (err) {
      alert(err.message || "Failed to delete comment.");
    }
  };

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  if (loading) {
    return (
      <div style={{ display: "flex", justifyContent: "center", alignItems: "center", minHeight: "500px", flexDirection: "column", gap: "16px" }}>
        <Spinner className="w-10 h-10 text-red-500" />
        <p style={{ color: "#aaa" }}>Loading video player...</p>
      </div>
    );
  }

  if (error || !video) {
    return (
      <div style={{ padding: "40px", textAlign: "center", maxWidth: "600px", margin: "40px auto", backgroundColor: "#1e1e1e", borderRadius: "12px" }}>
        <h2 style={{ color: "#ff5252", marginBottom: "12px" }}>Video Not Found</h2>
        <p style={{ color: "#aaa", marginBottom: "20px" }}>{error || "The video you are looking for does not exist or has been removed."}</p>
        <Link to="/" className="yt-btn yt-btn-primary">Back to Home</Link>
      </div>
    );
  }

  const owner = video.owner || {};
  const ownerName = owner.fullName || owner.username || "VideoTube Creator";

  return (
    <div className="yt-watch-container">
      {/* Main Video & Comments Column */}
      <div className="yt-watch-player-column">
        {/* Video Player Box */}
        <div className="yt-player-box">
          {video.videoFile?.includes("youtube.com") || video.videoFile?.includes("youtu.be") || video.youtubeId || video._id?.startsWith("yt_") ? (
            <iframe
              src={
                video.videoFile?.includes("embed")
                  ? video.videoFile
                  : `https://www.youtube.com/embed/${video.youtubeId || video._id.replace("yt_", "")}?autoplay=1&enablejsapi=1`
              }
              title={video.title}
              className="yt-player-video"
              style={{ border: "none", width: "100%", height: "100%" }}
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              allowFullScreen
            />
          ) : (
            <video
              controls
              autoPlay
              poster={video.thumbnail}
              src={video.videoFile}
              className="yt-player-video"
            >
              Your browser does not support the video tag.
            </video>
          )}
        </div>

        {/* Video Title */}
        <h1 style={{ fontSize: "20px", fontWeight: "700", color: "#fff", marginBottom: "12px", lineHeight: "1.3" }}>
          {video.title}
        </h1>

        {/* Channel & Action Bar */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "16px", paddingBottom: "16px", borderBottom: "1px solid #272727" }}>
          {/* Creator Profile */}
          <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
            {owner.avatar ? (
              <img
                src={owner.avatar}
                alt={ownerName}
                style={{ width: "42px", height: "42px", borderRadius: "50%", objectFit: "cover" }}
              />
            ) : (
              <div style={{ width: "42px", height: "42px", borderRadius: "50%", backgroundColor: "#cc0000", display: "flex", alignItems: "center", justifyContent: "center", color: "#fff", fontWeight: "bold" }}>
                {ownerName[0]?.toUpperCase() || "C"}
              </div>
            )}
            <div>
              <div style={{ fontWeight: "700", fontSize: "15px", color: "#fff" }}>
                {ownerName}
              </div>
              <div style={{ fontSize: "12px", color: "#aaa" }}>
                {subscribersCount} subscriber{subscribersCount !== 1 ? "s" : ""}
              </div>
            </div>

            {user?._id !== owner._id && (
              <button
                onClick={handleToggleSubscribe}
                disabled={subLoading}
                className={isSubscribed ? "yt-btn yt-btn-subscribed" : "yt-btn yt-btn-subscribe"}
                style={{ marginLeft: "12px" }}
              >
                {subLoading ? (
                  <Spinner className="w-4 h-4" />
                ) : isSubscribed ? (
                  "Subscribed"
                ) : (
                  "Subscribe"
                )}
              </button>
            )}
          </div>

          {/* Action Buttons: Like, Share */}
          <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
            <button
              onClick={handleToggleLike}
              disabled={likeLoading}
              className={`yt-btn yt-btn-secondary ${isLiked ? "active" : ""}`}
              style={{
                backgroundColor: isLiked ? "#3ea6ff22" : "#272727",
                color: isLiked ? "#3ea6ff" : "#fff",
                border: isLiked ? "1px solid #3ea6ff" : "none"
              }}
            >
              <LikedIcon className="w-5 h-5" />
              <span>{likesCount}</span>
            </button>

            <button onClick={handleShare} className="yt-btn yt-btn-secondary">
              {copied ? (
                <>
                  <CheckIcon className="w-5 h-5 text-green-400" />
                  <span style={{ color: "#4ade80" }}>Copied!</span>
                </>
              ) : (
                <span>Share</span>
              )}
            </button>
          </div>
        </div>

        {/* Video Description Box */}
        <div style={{ backgroundColor: "#272727", borderRadius: "12px", padding: "14px 16px", marginTop: "16px", cursor: "pointer" }} onClick={() => setShowFullDesc(!showFullDesc)}>
          <div style={{ fontWeight: "600", fontSize: "14px", color: "#fff", marginBottom: "6px" }}>
            <span>{formatViews(video.views)}</span>
            <span style={{ margin: "0 8px" }}>•</span>
            <span>{timeAgo(video.createdAt)}</span>
          </div>
          <p style={{
            fontSize: "14px",
            color: "#e1e1e1",
            lineHeight: "1.5",
            whiteSpace: "pre-line",
            display: showFullDesc ? "block" : "-webkit-box",
            WebkitLineClamp: showFullDesc ? "none" : 3,
            WebkitBoxOrient: "vertical",
            overflow: "hidden"
          }}>
            {video.description}
          </p>
          <button style={{ background: "transparent", border: "none", color: "#aaa", fontWeight: "600", fontSize: "13px", marginTop: "6px", cursor: "pointer" }}>
            {showFullDesc ? "Show less" : "...more"}
          </button>
        </div>

        {/* Comments Section */}
        <div style={{ marginTop: "28px" }}>
          <h3 style={{ fontSize: "18px", fontWeight: "700", color: "#fff", marginBottom: "18px" }}>
            {comments.length} Comment{comments.length !== 1 ? "s" : ""}
          </h3>

          {/* Add Comment Input */}
          <form onSubmit={handleAddComment} style={{ display: "flex", gap: "14px", marginBottom: "24px", alignItems: "flex-start" }}>
            {user?.avatar ? (
              <img
                src={user.avatar}
                alt="Me"
                style={{ width: "38px", height: "38px", borderRadius: "50%", objectFit: "cover", flexShrink: 0 }}
              />
            ) : (
              <div style={{ width: "38px", height: "38px", borderRadius: "50%", backgroundColor: "#333", display: "flex", alignItems: "center", justifyContent: "center", color: "#fff", fontWeight: "bold", flexShrink: 0 }}>
                {user?.fullName?.[0]?.toUpperCase() || "U"}
              </div>
            )}
            <div style={{ flex: 1 }}>
              <input
                type="text"
                placeholder={isAuthenticated ? "Add a comment..." : "Sign in to leave a comment"}
                disabled={!isAuthenticated || commentLoading}
                value={commentText}
                onChange={(e) => setCommentText(e.target.value)}
                style={{
                  width: "100%",
                  background: "transparent",
                  border: "none",
                  borderBottom: "1px solid #444",
                  padding: "8px 0",
                  color: "#fff",
                  fontSize: "14px",
                  outline: "none",
                  transition: "border-color 0.2s"
                }}
                onFocus={(e) => (e.target.style.borderBottomColor = "#3ea6ff")}
                onBlur={(e) => (e.target.style.borderBottomColor = "#444")}
              />
              {commentText.trim() && (
                <div style={{ display: "flex", justifyContent: "flex-end", gap: "10px", marginTop: "10px" }}>
                  <button
                    type="button"
                    onClick={() => setCommentText("")}
                    className="yt-btn yt-btn-secondary"
                    style={{ padding: "6px 14px", fontSize: "13px" }}
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={commentLoading}
                    className="yt-btn yt-btn-primary"
                    style={{ padding: "6px 16px", fontSize: "13px" }}
                  >
                    {commentLoading ? "Posting..." : "Comment"}
                  </button>
                </div>
              )}
            </div>
          </form>

          {/* Comments List */}
          <div style={{ display: "flex", flexDirection: "column", gap: "18px" }}>
            {comments.map((comment) => {
              const commentOwner = comment.owner || {};
              const commentAuthor = commentOwner.fullName || commentOwner.username || "Anonymous";
              const isMyComment = user?._id && commentOwner._id === user._id;

              return (
                <div key={comment._id} style={{ display: "flex", gap: "14px", alignItems: "flex-start" }}>
                  {commentOwner.avatar ? (
                    <img
                      src={commentOwner.avatar}
                      alt={commentAuthor}
                      style={{ width: "36px", height: "36px", borderRadius: "50%", objectFit: "cover", flexShrink: 0 }}
                    />
                  ) : (
                    <div style={{ width: "36px", height: "36px", borderRadius: "50%", backgroundColor: "#444", display: "flex", alignItems: "center", justifyContent: "center", color: "#fff", fontWeight: "bold", fontSize: "13px", flexShrink: 0 }}>
                      {commentAuthor[0]?.toUpperCase() || "A"}
                    </div>
                  )}

                  <div style={{ flex: 1 }}>
                    <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "4px" }}>
                      <span style={{ fontSize: "13px", fontWeight: "600", color: "#fff" }}>
                        @{commentOwner.username || commentAuthor}
                      </span>
                      <span style={{ fontSize: "12px", color: "#aaa" }}>
                        {timeAgo(comment.createdAt)}
                      </span>
                      {isMyComment && (
                        <button
                          onClick={() => handleDeleteComment(comment._id)}
                          style={{
                            background: "transparent",
                            border: "none",
                            color: "#888",
                            cursor: "pointer",
                            marginLeft: "auto",
                            display: "flex",
                            alignItems: "center"
                          }}
                          title="Delete comment"
                        >
                          <TrashIcon className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                    <p style={{ fontSize: "14px", color: "#e1e1e1", lineHeight: "1.4" }}>
                      {comment.content}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Sidebar / Recommended Videos Column */}
      <div className="yt-watch-sidebar-column">
        <h3 style={{ fontSize: "16px", fontWeight: "700", marginBottom: "14px", color: "#fff" }}>
          Recommended Videos
        </h3>
        <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
          {recommendedVideos.slice(0, 10).map((item) => (
            <Link
              key={item._id}
              to={`/watch/${item._id}`}
              style={{ display: "flex", gap: "10px", textDecoration: "none", color: "inherit" }}
            >
              <div style={{ width: "140px", aspectRatio: "16/9", borderRadius: "8px", overflow: "hidden", flexShrink: 0, backgroundColor: "#222" }}>
                <img
                  src={item.thumbnail}
                  alt={item.title}
                  style={{ width: "100%", height: "100%", objectFit: "cover" }}
                />
              </div>
              <div style={{ display: "flex", flexDirection: "column", overflow: "hidden" }}>
                <h4 style={{ fontSize: "13px", fontWeight: "600", color: "#fff", lineHeight: "1.3", marginBottom: "4px", display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical", overflow: "hidden" }}>
                  {item.title}
                </h4>
                <div style={{ fontSize: "12px", color: "#aaa" }}>
                  {item.owner?.fullName || item.owner?.username || "Creator"}
                </div>
                <div style={{ fontSize: "11px", color: "#888" }}>
                  {formatViews(item.views)} • {timeAgo(item.createdAt)}
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
};

export default WatchVideo;
