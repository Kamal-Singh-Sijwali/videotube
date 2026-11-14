import mongoose from "mongoose";
import { asyncHandler } from "../utils/asyncHandler.js";
import { apiError } from "../utils/apiError.js";
import { Tweet } from "../models/tweet.model.js";
import { apiResponse } from "../utils/apiResponse.js";

const createTweet = asyncHandler(async (req, res) => {
    const { content } = req.body;
    if (!content?.trim()) {
        throw new apiError(400, "Content is required");
    }
    const tweet = await Tweet.create({
        content: content.trim(),
        owner: req.user?._id
    });

    const populatedTweet = await Tweet.findById(tweet._id).populate("owner", "fullName username avatar");

    return res.status(201).json(new apiResponse(201, populatedTweet, "Tweet created successfully"));
});

const getUserTweets = asyncHandler(async (req, res) => {
    const targetUserId = req.query.userId || req.user?._id;
    const filter = targetUserId ? { owner: targetUserId } : {};

    const allTweets = await Tweet.find(filter)
        .populate("owner", "fullName username avatar")
        .sort({ createdAt: -1 });

    return res.status(200).json(new apiResponse(200, allTweets, "All tweets fetched"));
});

const getAllTweets = asyncHandler(async (req, res) => {
    const allTweets = await Tweet.find({})
        .populate("owner", "fullName username avatar")
        .sort({ createdAt: -1 });

    return res.status(200).json(new apiResponse(200, allTweets, "All community tweets fetched"));
});

const updateTweet = asyncHandler(async (req, res) => {
    const { tweetId } = req.params;
    const { content } = req.body;

    if (!tweetId || !mongoose.isValidObjectId(tweetId)) {
        throw new apiError(400, "Invalid tweet ID");
    }
    if (!content?.trim()) {
        throw new apiError(400, "Content is required");
    }

    const existingTweet = await Tweet.findById(tweetId);
    if (!existingTweet) {
        throw new apiError(404, "Tweet not found");
    }

    if (existingTweet.owner.toString() !== req.user._id.toString()) {
        throw new apiError(403, "You are not authorized to update this tweet");
    }

    existingTweet.content = content.trim();
    await existingTweet.save();

    const populatedTweet = await Tweet.findById(tweetId).populate("owner", "fullName username avatar");

    return res.status(200).json(new apiResponse(200, populatedTweet, "Tweet updated successfully"));
});

const deleteTweet = asyncHandler(async (req, res) => {
    const { tweetId } = req.params;

    if (!tweetId || !mongoose.isValidObjectId(tweetId)) {
        throw new apiError(400, "Invalid tweet ID");
    }

    const existingTweet = await Tweet.findById(tweetId);
    if (!existingTweet) {
        throw new apiError(404, "Tweet not found");
    }

    if (existingTweet.owner.toString() !== req.user._id.toString()) {
        throw new apiError(403, "You are not authorized to delete this tweet");
    }

    await Tweet.findByIdAndDelete(tweetId);

    return res.status(200).json(new apiResponse(200, {}, "Tweet deleted successfully"));
});

export {
    createTweet,
    getUserTweets,
    getAllTweets,
    updateTweet,
    deleteTweet
};