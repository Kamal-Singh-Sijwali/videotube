import React from "react";
import { createBrowserRouter, RouterProvider, Navigate } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext.jsx";
import Layout from "./components/Layout.jsx";
import AllVideos from "./components/AllVideos.jsx";
import WatchVideo from "./pages/WatchVideo.jsx";
import Dashboard from "./components/Dashboard.jsx";
import MyVideos from "./components/MyVideos.jsx";
import Subscriptions from "./pages/Subscriptions.jsx";
import LikedVideos from "./pages/LikedVideos.jsx";
import History from "./pages/History.jsx";
import Community from "./pages/Community.jsx";
import LoginPage from "./components/LoginPage.jsx";
import RegisterPage from "./components/RegisterPage.jsx";
import "./App.css";

// Declare router outside component to prevent re-creation on renders
const router = createBrowserRouter([
  {
    path: "/",
    element: <Layout />,
    children: [
      { index: true, element: <AllVideos /> },
      { path: "watch/:videoId", element: <WatchVideo /> },
      { path: "dashboard", element: <Dashboard /> },
      { path: "my-videos", element: <MyVideos /> },
      { path: "subscriptions", element: <Subscriptions /> },
      { path: "liked", element: <LikedVideos /> },
      { path: "history", element: <History /> },
      { path: "community", element: <Community /> },
    ],
  },
  {
    path: "/login",
    element: <LoginPage />,
  },
  {
    path: "/register",
    element: <RegisterPage />,
  },
  {
    path: "*",
    element: <Navigate to="/" replace />,
  },
]);

function App() {
  return (
    <AuthProvider>
      <RouterProvider router={router} />
    </AuthProvider>
  );
}

export default App;
