import mongoose from "mongoose";
import { asyncHandler } from "../utils/asyncHandler.js";
import { apiError } from "../utils/apiError.js";
import { apiResponse } from "../utils/apiResponse.js";
import { Subscription } from "../models/subscription.model.js";
import { Notification } from "../models/notification.model.js";

const toggleSubscription = asyncHandler(async (req, res) => {
  const { channelId } = req.params;

  if (!channelId || !mongoose.isValidObjectId(channelId)) {
    throw new apiError(400, "Valid channel ID is required");
  }

  if (channelId.toString() === req.user._id.toString()) {
    throw new apiError(400, "You cannot subscribe to your own channel");
  }

  const existingSubscription = await Subscription.findOne({
    channel: channelId,
    subscriber: req.user._id,
  });

  let isSubscribed = false;
  if (existingSubscription) {
    await Subscription.findByIdAndDelete(existingSubscription._id);
    isSubscribed = false;
  } else {
    await Subscription.create({
      channel: channelId,
      subscriber: req.user._id,
    });
    isSubscribed = true;

    // Notify channel owner
    try {
      await Notification.create({
        recipient: channelId,
        sender: req.user._id,
        type: "subscribe_channel",
        content: `subscribed to your channel`
      });
    } catch (err) {
      console.warn("Subscribe notification skipped:", err.message);
    }
  }

  const subscribersCount = await Subscription.countDocuments({ channel: channelId });

  return res.status(200).json(
    new apiResponse(
      200,
      { isSubscribed, subscribersCount },
      isSubscribed ? "Channel subscribed" : "Channel unsubscribed"
    )
  );
});

const getSubscriptionStatus = asyncHandler(async (req, res) => {
  const { channelId } = req.params;

  if (!channelId || !mongoose.isValidObjectId(channelId)) {
    throw new apiError(400, "Valid channel ID is required");
  }

  const subscribersCount = await Subscription.countDocuments({ channel: channelId });
  let isSubscribed = false;

  if (req.user?._id) {
    const sub = await Subscription.findOne({
      channel: channelId,
      subscriber: req.user._id
    });
    if (sub) isSubscribed = true;
  }

  return res.status(200).json(
    new apiResponse(200, { isSubscribed, subscribersCount }, "Subscription status fetched")
  );
});

// controller to return subscriber list of a channel
const getUserChannelSubscribers = asyncHandler(async (req, res) => {
  const { channelId } = req.params;
  if (!channelId || !mongoose.isValidObjectId(channelId)) {
    throw new apiError(400, "Valid channel ID is required");
  }
  const subscribers = await Subscription.find({ channel: channelId })
    .populate("subscriber", "fullName username avatar");

  return res.status(200).json(
    new apiResponse(200, subscribers, `Channel has ${subscribers.length} subscribers`)
  );
});

// controller to return channel list to which user has subscribed
const getSubscribedChannels = asyncHandler(async (req, res) => {
  const targetId = req.params.subscriberId || req.user?._id;
  if (!targetId || !mongoose.isValidObjectId(targetId)) {
    throw new apiError(400, "Valid subscriber ID is required");
  }
  const subscriptions = await Subscription.find({ subscriber: targetId })
    .populate("channel", "fullName username avatar");

  return res.status(200).json(
    new apiResponse(200, subscriptions, `Subscribed to ${subscriptions.length} channels`)
  );
});

export {
  toggleSubscription,
  getSubscriptionStatus,
  getUserChannelSubscribers,
  getSubscribedChannels
};
