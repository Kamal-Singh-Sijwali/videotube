# VideoTube - Full-Stack YouTube Clone

A full-stack video sharing and streaming application with modern YouTube-style dark theme UI, JWT authentication, video streaming, comments, likes, subscriptions, community posts, and a creator analytics studio.

---

## Tech Stack

- **Backend:** Node.js, Express.js (ES Modules), MongoDB & Mongoose, JWT (Access & Refresh tokens), Multer, Cloudinary
- **Frontend:** React 19, Vite, React Router v7, TanStack Query, Axios, Custom YouTube Dark Theme UI

---

## Features

- **Video Feed & Search:** Responsive video grid with category chips, keyword search, video duration badges, view counters, and relative timestamps.
- **Video Watch Page:** HTML5 video player, like toggle with real-time counter, subscribe toggle with live channel subscriber count, shareable link copier, expandable description, and interactive comments.
- **Creator Studio / Dashboard:** Analytics cards showing total views, subscribers, total videos, and total likes. Uploaded video management with public/private toggle and delete actions.
- **Video Uploading:** Modal with drag-and-drop / file selector for video file and thumbnail, title and description inputs, and progress indicators.
- **User Authentication:** Complete JWT authentication with access and refresh tokens, user registration with avatar and cover image uploads, login via username or email, and profile dropdown.
- **Community / Tweets:** Social feed for creators to post announcements and updates with like toggles and owner deletion.
- **Liked Videos & History:** Dedicated pages to track your liked videos and watch history.

---

## Getting Started

### 1. Backend Setup

```bash
cd backend
npm install
npm run dev
```

The backend server will start on `http://localhost:8000`.

### 2. Frontend Setup

```bash
cd frontend
npm install
npm run dev
```

The frontend application will start on `http://localhost:5173`.
