import { Router } from "express";
import { verifyJWT, optionalVerifyJWT } from "../middlewares/auth.middleware.js";
import { getSubscribedChannels, getSubscriptionStatus, getUserChannelSubscribers, toggleSubscription } from "../controllers/subscribe.controllrers.js";

const router = Router();

router.route("/status/:channelId").get(optionalVerifyJWT, getSubscriptionStatus);
router.route("/:channelId").post(verifyJWT, toggleSubscription).get(verifyJWT, toggleSubscription);
router.route("/channel/:channelId").get(getUserChannelSubscribers);
router.route("/subscribers/:subscriberId").get(getSubscribedChannels);
router.route("/user/subscriptions").get(verifyJWT, getSubscribedChannels);

export default router;