import React, { useState, useEffect } from "react";
import { tweetApi, likeApi } from "../api/client.js";
import { useAuth } from "../context/AuthContext.jsx";
import { TweetIcon, LikedIcon, TrashIcon, Spinner } from "../components/Icons.jsx";
import { timeAgo } from "../components/VideoCard.jsx";
import { Link } from "react-router-dom";

const Community = () => {
  const { user, isAuthenticated } = useAuth();
  const [tweets, setTweets] = useState([]);
  const [tweetContent, setTweetContent] = useState("");
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  const fetchTweets = async () => {
    try {
      setLoading(true);
      const res = await tweetApi.getAllTweets();
      setTweets(res.data?.data || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTweets();
  }, []);

  const handleCreateTweet = async (e) => {
    e.preventDefault();
    if (!tweetContent.trim()) return;

    try {
      setSubmitting(true);
      const res = await tweetApi.createTweet(tweetContent.trim());
      const newTweet = res.data?.data;
      if (newTweet) {
        setTweets([newTweet, ...tweets]);
      }
      setTweetContent("");
    } catch (err) {
      alert(err.message || "Failed to post tweet.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteTweet = async (tweetId) => {
    if (!window.confirm("Delete this post?")) return;
    try {
      await tweetApi.deleteTweet(tweetId);
      setTweets(tweets.filter((t) => t._id !== tweetId));
    } catch (err) {
      alert(err.message || "Failed to delete post.");
    }
  };

  const handleLikeTweet = async (tweetId) => {
    if (!isAuthenticated) {
      alert("Sign in to like community posts.");
      return;
    }
    try {
      await likeApi.toggleTweetLike(tweetId);
      // Refresh or toggle local state
    } catch (err) {
      alert(err.message || "Error liking post.");
    }
  };

  return (
    <div style={{ maxWidth: "720px", margin: "0 auto", padding: "10px 0" }}>
      <h1 style={{ fontSize: "22px", fontWeight: "700", color: "#fff", marginBottom: "20px", display: "flex", alignItems: "center", gap: "10px" }}>
        <TweetIcon className="w-6 h-6 text-blue-400" />
        Community Posts
      </h1>

      {/* Tweet Box */}
      {isAuthenticated ? (
        <form
          onSubmit={handleCreateTweet}
          style={{
            backgroundColor: "#1e1e1e",
            border: "1px solid #333",
            borderRadius: "14px",
            padding: "18px",
            marginBottom: "24px",
          }}
        >
          <div style={{ display: "flex", gap: "12px", alignItems: "flex-start" }}>
            {user?.avatar ? (
              <img
                src={user.avatar}
                alt="Me"
                style={{ width: "40px", height: "40px", borderRadius: "50%", objectFit: "cover" }}
              />
            ) : (
              <div style={{ width: "40px", height: "40px", borderRadius: "50%", backgroundColor: "#cc0000", display: "flex", alignItems: "center", justifyContent: "center", color: "#fff", fontWeight: "bold" }}>
                {user?.fullName?.[0]?.toUpperCase() || "U"}
              </div>
            )}
            <div style={{ flex: 1 }}>
              <textarea
                placeholder="Share an update, announcement, or question with your community..."
                rows={3}
                value={tweetContent}
                onChange={(e) => setTweetContent(e.target.value)}
                className="yt-input-control"
                style={{ width: "100%", resize: "none", marginBottom: "12px" }}
              />
              <div style={{ display: "flex", justifyContent: "flex-end" }}>
                <button
                  type="submit"
                  disabled={submitting || !tweetContent.trim()}
                  className="yt-btn yt-btn-primary"
                  style={{ padding: "8px 20px" }}
                >
                  {submitting ? "Posting..." : "Post to Community"}
                </button>
              </div>
            </div>
          </div>
        </form>
      ) : (
        <div style={{ backgroundColor: "#1e1e1e", border: "1px solid #2e2e2e", borderRadius: "12px", padding: "16px 20px", marginBottom: "24px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <span style={{ color: "#aaa", fontSize: "14px" }}>Sign in to share your thoughts with the community</span>
          <Link to="/login" className="yt-btn yt-btn-outline" style={{ fontSize: "13px" }}>Sign In</Link>
        </div>
      )}

      {/* Tweets Feed */}
      {loading ? (
        <div style={{ display: "flex", justifyContent: "center", padding: "40px" }}>
          <Spinner className="w-8 h-8 text-red-500" />
        </div>
      ) : tweets.length === 0 ? (
        <div style={{ textAlign: "center", padding: "60px 20px", backgroundColor: "#1e1e1e", borderRadius: "14px", color: "#aaa" }}>
          No community posts yet. Be the first to start a conversation!
        </div>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
          {tweets.map((tweet) => {
            const author = tweet.owner || {};
            const authorName = author.fullName || author.username || "Creator";
            const isMyPost = user?._id && author._id === user._id;

            return (
              <div
                key={tweet._id}
                style={{
                  backgroundColor: "#1e1e1e",
                  border: "1px solid #2a2a2a",
                  borderRadius: "14px",
                  padding: "18px",
                }}
              >
                <div style={{ display: "flex", gap: "12px", alignItems: "center", marginBottom: "12px" }}>
                  {author.avatar ? (
                    <img
                      src={author.avatar}
                      alt={authorName}
                      style={{ width: "40px", height: "40px", borderRadius: "50%", objectFit: "cover" }}
                    />
                  ) : (
                    <div style={{ width: "40px", height: "40px", borderRadius: "50%", backgroundColor: "#444", display: "flex", alignItems: "center", justifyContent: "center", color: "#fff", fontWeight: "bold" }}>
                      {authorName[0]?.toUpperCase() || "C"}
                    </div>
                  )}
                  <div>
                    <div style={{ fontWeight: "600", fontSize: "15px", color: "#fff" }}>
                      {authorName}
                    </div>
                    <div style={{ fontSize: "12px", color: "#888" }}>
                      @{author.username} • {timeAgo(tweet.createdAt)}
                    </div>
                  </div>

                  {isMyPost && (
                    <button
                      onClick={() => handleDeleteTweet(tweet._id)}
                      style={{
                        background: "transparent",
                        border: "none",
                        color: "#888",
                        cursor: "pointer",
                        marginLeft: "auto",
                        padding: "6px",
                      }}
                      title="Delete post"
                    >
                      <TrashIcon className="w-4 h-4" />
                    </button>
                  )}
                </div>

                <p style={{ fontSize: "15px", color: "#f1f1f1", lineHeight: "1.5", whiteSpace: "pre-line", marginBottom: "14px" }}>
                  {tweet.content}
                </p>

                <div style={{ display: "flex", gap: "16px", borderTop: "1px solid #2a2a2a", paddingTop: "10px" }}>
                  <button
                    onClick={() => handleLikeTweet(tweet._id)}
                    style={{
                      background: "transparent",
                      border: "none",
                      color: "#aaa",
                      display: "flex",
                      alignItems: "center",
                      gap: "6px",
                      fontSize: "13px",
                      cursor: "pointer",
                    }}
                  >
                    <LikedIcon className="w-4 h-4" />
                    <span>Like</span>
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default Community;
