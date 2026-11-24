import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { notificationApi } from "../api/client.js";
import { BellIcon, TrashIcon, CheckIcon } from "./Icons.jsx";
import { timeAgo } from "./VideoCard.jsx";

// Type-specific badge icons
const NotificationTypeBadge = ({ type }) => {
  if (type === "like_video" || type === "like_comment" || type === "like_tweet") {
    return (
      <div
        style={{
          position: "absolute",
          bottom: "-2px",
          right: "-2px",
          backgroundColor: "#ff0000",
          borderRadius: "50%",
          width: "18px",
          height: "18px",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          border: "2px solid #212121",
        }}
        title="Liked"
      >
        <svg width="10" height="10" viewBox="0 0 24 24" fill="#ffffff">
          <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
        </svg>
      </div>
    );
  }

  if (type === "comment_video") {
    return (
      <div
        style={{
          position: "absolute",
          bottom: "-2px",
          right: "-2px",
          backgroundColor: "#3ea6ff",
          borderRadius: "50%",
          width: "18px",
          height: "18px",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          border: "2px solid #212121",
        }}
        title="Commented"
      >
        <svg width="10" height="10" viewBox="0 0 24 24" fill="#ffffff">
          <path d="M20 2H4c-1.1 0-2 .9-2 2v18l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2z" />
        </svg>
      </div>
    );
  }

  if (type === "subscribe_channel") {
    return (
      <div
        style={{
          position: "absolute",
          bottom: "-2px",
          right: "-2px",
          backgroundColor: "#2ba640",
          borderRadius: "50%",
          width: "18px",
          height: "18px",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          border: "2px solid #212121",
        }}
        title="Subscribed"
      >
        <svg width="10" height="10" viewBox="0 0 24 24" fill="#ffffff">
          <path d="M15 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm-9-2V7H4v3H1v2h3v3h2v-3h3v-2H6zm9 4c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
        </svg>
      </div>
    );
  }

  return null;
};

const NotificationDropdown = () => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  // Fetch notifications with periodic polling
  const { data, isLoading } = useQuery({
    queryKey: ["notifications"],
    queryFn: async () => {
      const res = await notificationApi.getNotifications();
      return res.data?.data || { notifications: [], unreadCount: 0 };
    },
    refetchInterval: 15000, // 15 seconds polling for real-time feel
    refetchOnWindowFocus: true,
  });

  const notifications = data?.notifications || [];
  const unreadCount = data?.unreadCount || 0;

  // Mark all as read mutation
  const markAllReadMutation = useMutation({
    mutationFn: notificationApi.markAllRead,
    onSuccess: () => {
      queryClient.setQueryData(["notifications"], (old) => {
        if (!old) return old;
        return {
          ...old,
          unreadCount: 0,
          notifications: old.notifications.map((n) => ({ ...n, isRead: true })),
        };
      });
    },
  });

  // Mark single notification as read mutation
  const markReadMutation = useMutation({
    mutationFn: notificationApi.markRead,
    onSuccess: (_, notificationId) => {
      queryClient.setQueryData(["notifications"], (old) => {
        if (!old) return old;
        const updated = old.notifications.map((n) =>
          n._id === notificationId ? { ...n, isRead: true } : n
        );
        const count = updated.filter((n) => !n.isRead).length;
        return { ...old, notifications: updated, unreadCount: count };
      });
    },
  });

  // Delete notification mutation
  const deleteMutation = useMutation({
    mutationFn: notificationApi.deleteNotification,
    onSuccess: (_, notificationId) => {
      queryClient.setQueryData(["notifications"], (old) => {
        if (!old) return old;
        const updated = old.notifications.filter((n) => n._id !== notificationId);
        const count = updated.filter((n) => !n.isRead).length;
        return { ...old, notifications: updated, unreadCount: count };
      });
    },
  });

  // Clear all notifications mutation
  const clearAllMutation = useMutation({
    mutationFn: notificationApi.clearAll,
    onSuccess: () => {
      queryClient.setQueryData(["notifications"], {
        notifications: [],
        unreadCount: 0,
      });
    },
  });

  // Close on outside click
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen]);

  // Handle clicking on an item
  const handleItemClick = (notification) => {
    if (!notification.isRead) {
      markReadMutation.mutate(notification._id);
    }
    setIsOpen(false);

    if (notification.video?._id || notification.video) {
      const vidId = notification.video._id || notification.video;
      navigate(`/watch/${vidId}`);
    } else if (notification.type === "like_tweet") {
      navigate("/community");
    }
  };

  return (
    <div style={{ position: "relative" }} ref={dropdownRef}>
      {/* Bell Trigger Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="yt-icon-btn"
        title="Notifications"
        aria-label="Notifications"
        style={{
          position: "relative",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          color: isOpen ? "#ffffff" : "#f1f1f1",
          backgroundColor: isOpen ? "#272727" : "transparent",
          borderRadius: "50%",
        }}
      >
        <BellIcon size={20} />
        {unreadCount > 0 && (
          <span
            style={{
              position: "absolute",
              top: "4px",
              right: "4px",
              backgroundColor: "#cc0000",
              color: "#ffffff",
              fontSize: "11px",
              fontWeight: "700",
              minWidth: "18px",
              height: "18px",
              borderRadius: "9px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              padding: "0 4px",
              border: "2px solid #0f0f0f",
              lineHeight: 1,
            }}
          >
            {unreadCount > 9 ? "9+" : unreadCount}
          </span>
        )}
      </button>

      {/* YouTube Style Popover Dropdown */}
      {isOpen && (
        <div
          style={{
            position: "absolute",
            right: 0,
            top: "46px",
            width: "420px",
            maxWidth: "92vw",
            maxHeight: "520px",
            backgroundColor: "#212121",
            borderRadius: "14px",
            boxShadow: "0 12px 32px rgba(0, 0, 0, 0.7)",
            border: "1px solid #383838",
            display: "flex",
            flexDirection: "column",
            zIndex: 300,
            overflow: "hidden",
          }}
        >
          {/* Header */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              padding: "14px 18px",
              borderBottom: "1px solid #333333",
              backgroundColor: "#212121",
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
              <span style={{ fontSize: "16px", fontWeight: "600", color: "#f1f1f1" }}>
                Notifications
              </span>
              {unreadCount > 0 && (
                <span
                  style={{
                    backgroundColor: "#3ea6ff22",
                    color: "#3ea6ff",
                    fontSize: "12px",
                    fontWeight: "600",
                    padding: "2px 8px",
                    borderRadius: "10px",
                  }}
                >
                  {unreadCount} new
                </span>
              )}
            </div>

            <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
              {unreadCount > 0 && (
                <button
                  onClick={() => markAllReadMutation.mutate()}
                  style={{
                    background: "none",
                    border: "none",
                    color: "#3ea6ff",
                    fontSize: "12px",
                    fontWeight: "500",
                    cursor: "pointer",
                    padding: "4px 8px",
                    borderRadius: "4px",
                  }}
                  onMouseEnter={(e) => (e.target.style.backgroundColor = "#2a2a2a")}
                  onMouseLeave={(e) => (e.target.style.backgroundColor = "transparent")}
                  title="Mark all as read"
                >
                  Mark all as read
                </button>
              )}
              {notifications.length > 0 && (
                <button
                  onClick={() => clearAllMutation.mutate()}
                  style={{
                    background: "none",
                    border: "none",
                    color: "#aaaaaa",
                    fontSize: "12px",
                    cursor: "pointer",
                    padding: "4px 6px",
                    borderRadius: "4px",
                  }}
                  onMouseEnter={(e) => {
                    e.target.style.color = "#ff5252";
                    e.target.style.backgroundColor = "#2a2a2a";
                  }}
                  onMouseLeave={(e) => {
                    e.target.style.color = "#aaaaaa";
                    e.target.style.backgroundColor = "transparent";
                  }}
                  title="Clear all notifications"
                >
                  Clear all
                </button>
              )}
            </div>
          </div>

          {/* Notifications List */}
          <div
            style={{
              overflowY: "auto",
              maxHeight: "440px",
            }}
          >
            {isLoading ? (
              <div
                style={{
                  padding: "36px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  color: "#aaaaaa",
                  fontSize: "13px",
                  gap: "10px",
                }}
              >
                <div
                  style={{
                    width: "20px",
                    height: "20px",
                    border: "2px solid #555",
                    borderTopColor: "#3ea6ff",
                    borderRadius: "50%",
                    animation: "spin 1s linear infinite",
                  }}
                />
                Loading notifications...
              </div>
            ) : notifications.length === 0 ? (
              <div
                style={{
                  padding: "48px 24px",
                  textAlign: "center",
                  color: "#aaaaaa",
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  gap: "12px",
                }}
              >
                <div
                  style={{
                    width: "60px",
                    height: "60px",
                    borderRadius: "50%",
                    backgroundColor: "#2a2a2a",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    color: "#717171",
                  }}
                >
                  <BellIcon size={28} />
                </div>
                <div style={{ fontWeight: "600", fontSize: "15px", color: "#f1f1f1" }}>
                  Your notifications live here
                </div>
                <div style={{ fontSize: "12px", maxWidth: "260px", lineHeight: "1.4" }}>
                  When other users like or comment on your videos, you'll see them right here.
                </div>
              </div>
            ) : (
              notifications.map((item) => {
                const senderName =
                  item.sender?.fullName || item.sender?.username || "A user";
                const isUnread = !item.isRead;

                return (
                  <div
                    key={item._id}
                    onClick={() => handleItemClick(item)}
                    style={{
                      display: "flex",
                      alignItems: "flex-start",
                      gap: "12px",
                      padding: "12px 16px",
                      borderBottom: "1px solid #2a2a2a",
                      backgroundColor: isUnread ? "#2b2b2b" : "#212121",
                      cursor: "pointer",
                      position: "relative",
                      transition: "background-color 0.15s ease",
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.backgroundColor = isUnread
                        ? "#343434"
                        : "#2a2a2a";
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.backgroundColor = isUnread
                        ? "#2b2b2b"
                        : "#212121";
                    }}
                  >
                    {/* Unread dot */}
                    <div
                      style={{
                        width: "8px",
                        height: "8px",
                        borderRadius: "50%",
                        backgroundColor: isUnread ? "#3ea6ff" : "transparent",
                        marginTop: "14px",
                        flexShrink: 0,
                      }}
                    />

                    {/* Sender Avatar with badge */}
                    <div style={{ position: "relative", flexShrink: 0 }}>
                      {item.sender?.avatar ? (
                        <img
                          src={item.sender.avatar}
                          alt={senderName}
                          style={{
                            width: "40px",
                            height: "40px",
                            borderRadius: "50%",
                            objectFit: "cover",
                          }}
                        />
                      ) : (
                        <div
                          style={{
                            width: "40px",
                            height: "40px",
                            borderRadius: "50%",
                            backgroundColor: "#cc0000",
                            color: "#fff",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            fontWeight: "600",
                            fontSize: "15px",
                          }}
                        >
                          {senderName.charAt(0).toUpperCase()}
                        </div>
                      )}
                      <NotificationTypeBadge type={item.type} />
                    </div>

                    {/* Message Details */}
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div
                        style={{
                          fontSize: "13px",
                          color: "#f1f1f1",
                          lineHeight: "1.4",
                          wordBreak: "break-word",
                        }}
                      >
                        <span style={{ fontWeight: "600", color: "#ffffff" }}>
                          {senderName}{" "}
                        </span>
                        <span style={{ color: "#dddddd" }}>{item.content}</span>
                      </div>
                      <div
                        style={{
                          fontSize: "11px",
                          color: "#aaaaaa",
                          marginTop: "4px",
                        }}
                      >
                        {timeAgo(item.createdAt)}
                      </div>
                    </div>

                    {/* Video Thumbnail Preview */}
                    {item.video?.thumbnail && (
                      <div style={{ flexShrink: 0 }}>
                        <img
                          src={item.video.thumbnail}
                          alt={item.video.title || "Video"}
                          style={{
                            width: "60px",
                            height: "36px",
                            borderRadius: "4px",
                            objectFit: "cover",
                          }}
                        />
                      </div>
                    )}

                    {/* Dismiss Button */}
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        deleteMutation.mutate(item._id);
                      }}
                      title="Dismiss"
                      style={{
                        background: "none",
                        border: "none",
                        color: "#717171",
                        cursor: "pointer",
                        padding: "4px",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        borderRadius: "50%",
                        flexShrink: 0,
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.color = "#ff5252";
                        e.currentTarget.style.backgroundColor = "#383838";
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.color = "#717171";
                        e.currentTarget.style.backgroundColor = "transparent";
                      }}
                    >
                      <svg
                        width="14"
                        height="14"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <line x1="18" y1="6" x2="6" y2="18"></line>
                        <line x1="6" y1="6" x2="18" y2="18"></line>
                      </svg>
                    </button>
                  </div>
                );
              })
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default NotificationDropdown;
