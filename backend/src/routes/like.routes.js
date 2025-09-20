import { Router } from "express";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import { getLikedVideos, toggleCommentLike, toggleTweetLike, toggleVideoLike } from "../controllers/likes.controllers.js";

const router = Router()

router.get("/:videoId",verifyJWT,toggleVideoLike)
router.get("/c/:commentId",verifyJWT,toggleCommentLike)
router.get("/t/:tweetId",verifyJWT,toggleTweetLike)
router.get("/all/:videoId",verifyJWT,getLikedVideos)

export default router