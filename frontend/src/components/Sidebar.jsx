import React from "react";
import { NavLink } from "react-router-dom";
import {
  HomeIcon,
  SubscriptionsIcon,
  LikedIcon,
  HistoryIcon,
  TweetIcon,
  DashboardIcon
} from "./Icons.jsx";

const Sidebar = ({ isCollapsed }) => {
  const navItems = [
    { label: "Home", path: "/", icon: <HomeIcon /> },
    { label: "Subscriptions", path: "/subscriptions", icon: <SubscriptionsIcon /> },
    { label: "Liked Videos", path: "/liked", icon: <LikedIcon /> },
    { label: "History", path: "/history", icon: <HistoryIcon /> },
    { label: "Community", path: "/community", icon: <TweetIcon /> },
    { label: "Studio", path: "/dashboard", icon: <DashboardIcon /> },
  ];

  return (
    <aside className={`yt-sidebar ${isCollapsed ? "yt-sidebar-collapsed" : ""}`}>
      {navItems.map((item) => (
        <NavLink
          key={item.path}
          to={item.path}
          className={({ isActive }) => `yt-nav-item ${isActive ? "active" : ""}`}
          title={item.label}
        >
          {item.icon}
          <span>{item.label}</span>
        </NavLink>
      ))}

      {!isCollapsed && (
        <div style={{ marginTop: "auto", padding: "16px 8px 8px", borderTop: "1px solid #272727", fontSize: "11px", color: "#717171" }}>
          <div>© 2026 VideoTube LLC</div>
          <div style={{ marginTop: "4px" }}>Terms • Privacy • Policy</div>
        </div>
      )}
    </aside>
  );
};

export default Sidebar;
