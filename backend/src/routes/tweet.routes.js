import { Router } from "express";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import { createTweet, deleteTweet, getUserTweets, updateTweet } from "../controllers/tweets.controllers.js";

const router = Router()

router.post("/",verifyJWT,createTweet)
router.get("/getAll",verifyJWT,getUserTweets)
router.patch("/:tweetId",verifyJWT,updateTweet)
router.delete("/:tweetId",verifyJWT,deleteTweet)

export default router 