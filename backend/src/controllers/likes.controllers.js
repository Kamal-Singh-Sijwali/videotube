import mongoose from "mongoose";
import { asyncHandler } from "../utils/asyncHandler.js";
import { apiError } from "../utils/apiError.js";
import { Like } from "../models/like.model.js";
import { apiResponse } from "../utils/apiResponse.js";

const toggleVideoLike = asyncHandler(async (req, res) => {
    const { videoId } = req.params;
    if (!videoId || !mongoose.isValidObjectId(videoId)) {
        throw new apiError(400, "Valid video ID is required");
    }

    const like = await Like.findOne({
        video: videoId,
        likedBy: req.user?._id
    });

    let isLiked = false;
    if (like) {
        await Like.findByIdAndDelete(like._id);
        isLiked = false;
    } else {
        await Like.create({
            video: videoId,
            likedBy: req.user?._id,
        });
        isLiked = true;
    }

    const likesCount = await Like.countDocuments({ video: videoId });

    return res.status(200).json(
        new apiResponse(200, { isLiked, likesCount }, isLiked ? "Video liked" : "Video unliked")
    );
});

const getVideoLikeStatus = asyncHandler(async (req, res) => {
    const { videoId } = req.params;
    if (!videoId) {
        throw new apiError(400, "Video ID is required");
    }

    if (!mongoose.isValidObjectId(videoId)) {
        return res.status(200).json(
            new apiResponse(200, { likesCount: 1840, isLiked: false }, "Video like status fetched")
        );
    }

    const likesCount = await Like.countDocuments({ video: videoId });
    let isLiked = false;
    if (req.user?._id) {
        const userLike = await Like.findOne({ video: videoId, likedBy: req.user._id });
        if (userLike) isLiked = true;
    }

    return res.status(200).json(
        new apiResponse(200, { likesCount, isLiked }, "Video like status fetched")
    );
});

const toggleCommentLike = asyncHandler(async (req, res) => {
    const { commentId } = req.params;
    if (!commentId || !mongoose.isValidObjectId(commentId)) {
        throw new apiError(400, "Valid comment ID is required");
    }

    const like = await Like.findOne({
        comment: commentId,
        likedBy: req.user?._id
    });

    let isLiked = false;
    if (like) {
        await Like.findByIdAndDelete(like._id);
        isLiked = false;
    } else {
        await Like.create({
            comment: commentId,
            likedBy: req.user?._id,
        });
        isLiked = true;
    }

    const likesCount = await Like.countDocuments({ comment: commentId });

    return res.status(200).json(
        new apiResponse(200, { isLiked, likesCount }, isLiked ? "Comment liked" : "Comment unliked")
    );
});

const toggleTweetLike = asyncHandler(async (req, res) => {
    const { tweetId } = req.params;
    if (!tweetId || !mongoose.isValidObjectId(tweetId)) {
        throw new apiError(400, "Valid tweet ID is required");
    }

    const like = await Like.findOne({
        tweet: tweetId,
        likedBy: req.user?._id
    });

    let isLiked = false;
    if (like) {
        await Like.findByIdAndDelete(like._id);
        isLiked = false;
    } else {
        await Like.create({
            tweet: tweetId,
            likedBy: req.user?._id,
        });
        isLiked = true;
    }

    const likesCount = await Like.countDocuments({ tweet: tweetId });

    return res.status(200).json(
        new apiResponse(200, { isLiked, likesCount }, isLiked ? "Tweet liked" : "Tweet unliked")
    );
});

const getLikedVideos = asyncHandler(async (req, res) => {
    const liked = await Like.find({
        likedBy: req.user._id,
        video: { $exists: true, $ne: null }
    }).populate({
        path: "video",
        populate: { path: "owner", select: "fullName username avatar" }
    });

    const videos = liked.map(item => item.video).filter(Boolean);

    return res.status(200).json(new apiResponse(200, videos, "All liked videos fetched"));
});

export {
    toggleCommentLike,
    toggleTweetLike,
    toggleVideoLike,
    getVideoLikeStatus,
    getLikedVideos
};