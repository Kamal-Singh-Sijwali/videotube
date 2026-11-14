import React, { useState } from "react";
import { Outlet } from "react-router-dom";
import Navbar from "./Navbar.jsx";
import Sidebar from "./Sidebar.jsx";
import UploadModal from "./UploadModal.jsx";

const Layout = () => {
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [isUploadOpen, setIsUploadOpen] = useState(false);
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  const toggleSidebar = () => {
    setIsSidebarCollapsed(!isSidebarCollapsed);
  };

  const handleUploadSuccess = () => {
    setRefreshTrigger((prev) => prev + 1);
  };

  return (
    <div className="yt-app">
      <Navbar
        onToggleSidebar={toggleSidebar}
        onOpenUpload={() => setIsUploadOpen(true)}
      />
      <div className="yt-main">
        <Sidebar isCollapsed={isSidebarCollapsed} />
        <main className="yt-content">
          <Outlet context={{ refreshTrigger, openUpload: () => setIsUploadOpen(true) }} />
        </main>
      </div>

      <UploadModal
        isOpen={isUploadOpen}
        onClose={() => setIsUploadOpen(false)}
        onUploadSuccess={handleUploadSuccess}
      />
    </div>
  );
};

export default Layout;
