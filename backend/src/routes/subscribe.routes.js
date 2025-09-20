import { Router } from "express";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import { getSubscribedChannels, getUserChannelSubscribers, toggleSubscription } from "../controllers/subscribe.controllrers.js";

const router =  Router()

router.get("/:channelId",verifyJWT,toggleSubscription)
router.get("/channel/:channelId",verifyJWT,getUserChannelSubscribers)
router.get("/subscribers/:subscriberId",verifyJWT,getSubscribedChannels)

export default router