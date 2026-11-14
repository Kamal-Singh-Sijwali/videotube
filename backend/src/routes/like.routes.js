import { Router } from "express";
import { verifyJWT, optionalVerifyJWT } from "../middlewares/auth.middleware.js";
import { getLikedVideos, getVideoLikeStatus, toggleCommentLike, toggleTweetLike, toggleVideoLike } from "../controllers/likes.controllers.js";

const router = Router();

router.route("/status/:videoId").get(optionalVerifyJWT, getVideoLikeStatus);
router.route("/videos").get(verifyJWT, getLikedVideos);
router.route("/:videoId").post(verifyJWT, toggleVideoLike).get(verifyJWT, toggleVideoLike);
router.route("/c/:commentId").post(verifyJWT, toggleCommentLike).get(verifyJWT, toggleCommentLike);
router.route("/t/:tweetId").post(verifyJWT, toggleTweetLike).get(verifyJWT, toggleTweetLike);

export default router;