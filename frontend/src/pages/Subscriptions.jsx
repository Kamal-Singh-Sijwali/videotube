import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { subscriptionApi } from "../api/client.js";
import { useAuth } from "../context/AuthContext.jsx";
import { SubscriptionsIcon, Spinner } from "../components/Icons.jsx";

const Subscriptions = () => {
  const { isAuthenticated, loading: authLoading } = useAuth();
  const [channels, setChannels] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSubscriptions = async () => {
      if (!isAuthenticated) {
        setLoading(false);
        return;
      }
      try {
        setLoading(true);
        const res = await subscriptionApi.getSubscribedChannels();
        setChannels(res.data?.data || []);
      } catch (err) {
        console.error("Error fetching subscriptions:", err);
      } finally {
        setLoading(false);
      }
    };

    if (!authLoading) {
      fetchSubscriptions();
    }
  }, [isAuthenticated, authLoading]);

  if (!isAuthenticated && !authLoading) {
    return (
      <div style={{ textAlign: "center", padding: "60px 20px", maxWidth: "480px", margin: "40px auto", backgroundColor: "#1e1e1e", borderRadius: "16px" }}>
        <h2 style={{ fontSize: "20px", fontWeight: "700", marginBottom: "8px", color: "#fff" }}>
          Don’t miss new videos
        </h2>
        <p style={{ color: "#aaa", fontSize: "14px", marginBottom: "20px" }}>
          Sign in to see updates from your favorite YouTube channels.
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
        <SubscriptionsIcon className="w-6 h-6 text-red-500" />
        Subscriptions ({channels.length})
      </h1>

      {loading ? (
        <div style={{ display: "flex", justifyContent: "center", padding: "50px" }}>
          <Spinner className="w-8 h-8 text-red-500" />
        </div>
      ) : channels.length === 0 ? (
        <div style={{ textAlign: "center", padding: "60px 20px", backgroundColor: "#1e1e1e", borderRadius: "16px", color: "#aaa", maxWidth: "540px", margin: "40px auto" }}>
          You haven’t subscribed to any channels yet. Explore videos and subscribe to creators!
        </div>
      ) : (
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(240px, 1fr))", gap: "20px" }}>
          {channels.map((sub) => {
            const channel = sub.channel || {};
            const channelName = channel.fullName || channel.username || "Creator";
            return (
              <div
                key={sub._id}
                style={{
                  backgroundColor: "#1e1e1e",
                  border: "1px solid #2e2e2e",
                  borderRadius: "16px",
                  padding: "24px 20px",
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  textAlign: "center",
                }}
              >
                {channel.avatar ? (
                  <img
                    src={channel.avatar}
                    alt={channelName}
                    style={{ width: "72px", height: "72px", borderRadius: "50%", objectFit: "cover", marginBottom: "12px" }}
                  />
                ) : (
                  <div style={{ width: "72px", height: "72px", borderRadius: "50%", backgroundColor: "#cc0000", display: "flex", alignItems: "center", justifyContent: "center", color: "#fff", fontWeight: "bold", fontSize: "24px", marginBottom: "12px" }}>
                    {channelName[0]?.toUpperCase() || "C"}
                  </div>
                )}
                <div style={{ fontWeight: "700", fontSize: "16px", color: "#fff", marginBottom: "4px" }}>
                  {channelName}
                </div>
                <div style={{ fontSize: "13px", color: "#888", marginBottom: "16px" }}>
                  @{channel.username}
                </div>
                <span className="yt-btn yt-btn-secondary" style={{ fontSize: "12px", pointerEvents: "none" }}>
                  Subscribed
                </span>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default Subscriptions;
