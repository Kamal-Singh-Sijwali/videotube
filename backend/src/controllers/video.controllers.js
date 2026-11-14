import mongoose from "mongoose";
import { Video } from "../models/video.model.js";
import { apiError } from "../utils/apiError.js";
import { apiResponse } from "../utils/apiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { uploadOncloudinary } from "../utils/cloudinary.js";
import { User } from "../models/user.model.js";
import { fetchYouTubeVideos, getYouTubeVideoById } from "../utils/youtube.js";

// ============ All videos without login ============
const allVideos = asyncHandler(async (req, res) => {
  const { query } = req.query;
  const filter = { isPublished: true };

  if (query) {
    filter.$or = [
      { title: { $regex: query, $options: "i" } },
      { description: { $regex: query, $options: "i" } }
    ];
  }

  let dbVideos = [];
  try {
    dbVideos = await Video.find(filter)
      .populate("owner", "fullName username avatar")
      .sort({ createdAt: -1 });
  } catch (err) {
    console.warn("DB query warning in allVideos:", err.message);
  }

  // Fetch YouTube data (live from YouTube Data API v3 if key configured, or from real YouTube catalog)
  let ytVideos = [];
  try {
    ytVideos = await fetchYouTubeVideos(query || "");
  } catch (err) {
    console.warn("YouTube fetch warning:", err.message);
  }

  // Combine user-uploaded videos from MongoDB with YouTube videos
  const combinedVideos = [...dbVideos, ...ytVideos];

  return res.status(200).json(new apiResponse(200, combinedVideos, "All videos fetched successfully"));
});

// ============== Get all videos (for user / dashboard) ===========
const getAllVideos = asyncHandler(async (req, res) => {
  const { userId } = req.query;
  const targetUserId = userId || req.user?._id;

  if (!targetUserId) {
    throw new apiError(400, "User ID is required");
  }

  const usersVideos = await Video.find({ owner: targetUserId })
    .populate("owner", "fullName username avatar")
    .sort({ createdAt: -1 });

  return res.status(200).json(new apiResponse(200, usersVideos, "All user videos fetched"));
});

// ============ Publish a video ============
const publishVideo = asyncHandler(async (req, res) => {
  const { title, description } = req.body;

  if (!title || !description) {
    throw new apiError(400, "Title and description are required");
  }

  const videoLocalPath = req.files?.videoFile?.[0]?.path;
  const thumbnailLocalPath = req.files?.thumbnail?.[0]?.path;

  if (!videoLocalPath) {
    throw new apiError(400, "Video file is required");
  }
  if (!thumbnailLocalPath) {
    throw new apiError(400, "Thumbnail is required");
  }

  const videoFile = await uploadOncloudinary(videoLocalPath);
  if (!videoFile?.url) {
    throw new apiError(500, "Cloudinary error while uploading video");
  }

  const thumbnail = await uploadOncloudinary(thumbnailLocalPath);
  if (!thumbnail?.url) {
    throw new apiError(500, "Cloudinary error while uploading thumbnail");
  }

  const video = await Video.create({
    title,
    description,
    videoFile: videoFile.url,
    thumbnail: thumbnail.url,
    duration: Math.round(videoFile?.duration || 0),
    isPublished: true,
    owner: req.user._id,
  });

  const createdVideo = await Video.findById(video._id).populate("owner", "fullName username avatar");

  return res.status(201).json(new apiResponse(201, createdVideo, "Video uploaded successfully"));
});

// =========== Get video by id =========
const getVideoById = asyncHandler(async (req, res) => {
  const { videoId } = req.params;

  if (!videoId) {
    throw new apiError(400, "Video ID is required");
  }

  // Handle YouTube video IDs
  if (videoId.startsWith("yt_") || !mongoose.isValidObjectId(videoId)) {
    const ytVideo = await getYouTubeVideoById(videoId);
    if (!ytVideo) {
      throw new apiError(404, "Video not found");
    }
    return res.status(200).json(new apiResponse(200, ytVideo, "YouTube video fetched successfully"));
  }

  const video = await Video.findByIdAndUpdate(
    videoId,
    { $inc: { views: 1 } },
    { new: true }
  ).populate("owner", "fullName username avatar");

  if (!video) {
    const ytVideo = await getYouTubeVideoById(videoId);
    if (ytVideo) {
      return res.status(200).json(new apiResponse(200, ytVideo, "Video fetched successfully"));
    }
    throw new apiError(404, "Video not found");
  }

  // Add to user watch history if authenticated
  if (req.user?._id) {
    await User.findByIdAndUpdate(req.user._id, {
      $addToSet: { watchHistory: videoId }
    });
  }

  return res.status(200).json(new apiResponse(200, video, "Video fetched successfully"));
});

  // return res.status(200).json(new apiResponse(200, video, "Video fetched successfully"));


// ============ Update video details ============
const updateVideoDetails = asyncHandler(async (req, res) => {
  const { videoId } = req.params;
  const { title, description } = req.body;

  if (!videoId) {
    throw new apiError(400, "Video ID is required");
  }

  const video = await Video.findById(videoId);
  if (!video) {
    throw new apiError(404, "Video not found");
  }

  if (video.owner.toString() !== req.user._id.toString()) {
    throw new apiError(403, "You are not authorized to update this video");
  }

  const updateFields = {};
  if (title?.trim()) updateFields.title = title.trim();
  if (description?.trim()) updateFields.description = description.trim();

  const localPath = req.file?.path;
  if (localPath) {
    const url = await uploadOncloudinary(localPath);
    if (url?.url) {
      updateFields.thumbnail = url.url;
    }
  }

  const updatedVideo = await Video.findByIdAndUpdate(
    videoId,
    { $set: updateFields },
    { new: true }
  ).populate("owner", "fullName username avatar");

  return res.status(200).json(new apiResponse(200, updatedVideo, "Video details updated"));
});

// ============== Delete a video ================
const deleteVideo = asyncHandler(async (req, res) => {
  const { videoId } = req.params;
  if (!videoId) {
    throw new apiError(400, "Video ID is required to delete");
  }

  const video = await Video.findById(videoId);
  if (!video) {
    throw new apiError(404, "Video not found");
  }

  if (video.owner.toString() !== req.user._id.toString()) {
    throw new apiError(403, "You are not authorized to delete this video");
  }

  await Video.findByIdAndDelete(videoId);

  return res.status(200).json(new apiResponse(200, {}, "Video deleted successfully"));
});

// =============== toggle publish status ==============
const togglePublishStatus = asyncHandler(async (req, res) => {
  const { videoId, id } = req.params;
  const targetId = videoId || id;

  if (!targetId) {
    throw new apiError(400, "Video ID is required");
  }

  const video = await Video.findById(targetId);
  if (!video) {
    throw new apiError(404, "Video not found");
  }

  if (video.owner.toString() !== req.user._id.toString()) {
    throw new apiError(403, "You are not authorized to modify this video");
  }

  video.isPublished = !video.isPublished;
  await video.save();

  return res.status(200).json(
    new apiResponse(200, video, `Video ${video.isPublished ? "published" : "unpublished"}`)
  );
});

export {
  allVideos,
  publishVideo,
  getVideoById,
  updateVideoDetails,
  deleteVideo,
  togglePublishStatus,
  getAllVideos,
};
