import { Router } from "express";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import { createTweet, deleteTweet, getAllTweets, getUserTweets, updateTweet } from "../controllers/tweets.controllers.js";

const router = Router();

router.route("/").post(verifyJWT, createTweet).get(getAllTweets);
router.route("/user").get(verifyJWT, getUserTweets);
router.route("/getAll").get(getAllTweets);
router.route("/:tweetId").patch(verifyJWT, updateTweet).delete(verifyJWT, deleteTweet);

export default router; 