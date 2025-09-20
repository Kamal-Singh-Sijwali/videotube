import mongoose, { isValidObjectId } from "mongoose";
import { asyncHandler } from "../utils/asyncHandler.js";
import { apiError } from "../utils/apiError.js";
import { User } from "../models/user.model.js";
import { apiResponse } from "../utils/apiResponse.js";
import { Subscription } from "../models/subscription.model.js";

const toggleSubscription = asyncHandler(async (req, res) => {
  const { channelId } = req.params;
  // TODO: toggle subscription
  if (!channelId) {
    throw new apiError(400, "channel is required");
  }

  const userChannel = await Subscription.findOne({
    channel: channelId,
    subscriber: req.user._id,
  });
  if (userChannel) {
    await Subscription.findByIdAndDelete(userChannel._id);
    userChannel.isSubscribed = false;
    return res
      .status(200)
      .json(new apiResponse(200, userChannel, `Channel is Unsubscribed`));
  } else {
    const newSubscription = await Subscription.create({
      channel: channelId,
      subscriber: req.user._id,
    });
    newSubscription.isSubscribed = true;
    // userChannel.push(newSubscription);
    return res
      .status(200)
      .json(new apiResponse(200, newSubscription, `Channel is Subscribed :`));
  }


});

// controller to return subscriber list of a channel
const getUserChannelSubscribers = asyncHandler(async (req, res) => {
  const { channelId } = req.params;
  if(!channelId){
    throw new apiError(400,"Channel id is required")
  }
  const subscribers = await Subscription.find({ channel: channelId })
//   .populate(
//     "username email"
//   );
  console.log("lll",subscribers)
  return res.status(200)
  .json(new apiResponse(200,subscribers,`Your have been subscribed by ${subscribers?.length} people`))
});

// controller to return channel list to which user has subscribed
const getSubscribedChannels = asyncHandler(async (req, res) => {
  const { subscriberId } = req.params;
    if(!subscriberId){
    throw new apiError(400,"subscriber id is required")
  }
  const subscribers = await Subscription.find({ subscriber: subscriberId })

  console.log("lll",subscribers)
  return res.status(200)
  .json(new apiResponse(200,subscribers,`You have subscribed ${subscribers?.length} channels`))

});

export { toggleSubscription, getUserChannelSubscribers, getSubscribedChannels };
