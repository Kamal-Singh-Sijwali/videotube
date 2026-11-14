import mongoose from "mongoose";
import { asyncHandler } from "../utils/asyncHandler.js";
import { apiError } from "../utils/apiError.js";
import { Video } from "../models/video.model.js";
import { apiResponse } from "../utils/apiResponse.js";
import { Subscription } from "../models/subscription.model.js";
import { Like } from "../models/like.model.js";

const getChannelStats = asyncHandler(async (req, res) => {
    const channelId = req.params.channelId || req.user?._id;

    if (!mongoose.isValidObjectId(channelId)) {
        throw new apiError(400, "Channel ID is invalid");
    }

    const channelAllVideos = await Video.find({ owner: channelId });
    const videoIds = channelAllVideos.map((v) => v._id);

    const totalLikes = videoIds.length > 0 
        ? await Like.countDocuments({ video: { $in: videoIds } }) 
        : 0;

    const totalSubscribers = await Subscription.countDocuments({ channel: channelId });
    const totalViews = channelAllVideos.reduce((acc, cur) => acc + (cur.views || 0), 0);

    const stats = {
        views: totalViews,
        subscribers: totalSubscribers,
        totalVideos: channelAllVideos.length,
        likes: totalLikes
    };

    return res.status(200).json(new apiResponse(200, stats, "Channel statistics fetched"));
});

const getChannelVideos = asyncHandler(async (req, res) => {
    const channelId = req.params.channelId || req.user?._id;
    if (!mongoose.isValidObjectId(channelId)) {
        throw new apiError(400, "Channel ID is invalid");
    }

    const allVideos = await Video.find({ owner: channelId })
        .populate("owner", "fullName username avatar")
        .sort({ createdAt: -1 });

    return res.status(200).json(new apiResponse(200, allVideos, "Channel videos fetched"));
});

export {
    getChannelStats, 
    getChannelVideos
};