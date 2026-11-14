import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';

const app = express();

const allowedOrigins = [
    process.env.CORS_ORIGIN,
    "http://localhost:5173",
    "http://localhost:3000",
    "http://127.0.0.1:5173"
].filter(Boolean);

app.use(cors({
    origin: function (origin, callback) {
        if (!origin || allowedOrigins.includes(origin) || allowedOrigins.includes("*")) {
            callback(null, true);
        } else {
            callback(null, true);
        }
    },
    credentials: true
}));

// ============== configurations ==================== //
app.use(express.json({ limit: "16kb" }));
app.use(express.urlencoded({ extended: true, limit: "16kb" }));
app.use(express.static("public"));
app.use(cookieParser());

// ************* routes import **************
import userRouter from "./routes/user.routes.js";
import videoRouter from "./routes/video.routes.js";
import playListRouter from './routes/playlist.routes.js';
import subscriberRouter from "./routes/subscribe.routes.js";
import commemntsRouter from "./routes/comment.routes.js";
import likesRouter from "./routes/like.routes.js";
import tweetsRouter from "./routes/tweet.routes.js";
import dashboardRouter from "./routes/dashboard.routes.js";

// routes declaration
app.use("/api/v1/users", userRouter);
app.use("/api/v1/videos", videoRouter);
app.use("/api/v1/playlist", playListRouter);
app.use("/api/v1/subscribe", subscriberRouter);
app.use("/api/v1/comment", commemntsRouter);
app.use("/api/v1/like", likesRouter);
app.use("/api/v1/tweet", tweetsRouter);
app.use("/api/v1/dashboard", dashboardRouter);

// Global Error Handler
app.use((err, req, res, next) => {
    const statusCode = err.statusCode || 500;
    return res.status(statusCode).json({
        statusCode,
        success: false,
        message: err.message || "Internal Server Error",
        errors: err.errors || []
    });
});

export { app };