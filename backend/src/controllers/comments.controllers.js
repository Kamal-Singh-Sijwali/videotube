
import mongoose from "mongoose";
import { asyncHandler } from "../utils/asyncHandler.js";
import { apiError } from "../utils/apiError.js";
import { Comment } from "../models/comment.model.js";
import { Video } from "../models/video.model.js";
import { Notification } from "../models/notification.model.js";
import { apiResponse } from "../utils/apiResponse.js";

const getVideoComments = asyncHandler(async (req, res) => {
  const { videoId } = req.params;

  if (!videoId) {
    throw new apiError(400, "Video ID is required");
  }

  if (!mongoose.isValidObjectId(videoId)) {
    return res.status(200).json(new apiResponse(200, [], "All comments fetched successfully"));
  }

  const comments = await Comment.find({ video: videoId })
    .populate("owner", "fullName username avatar")
    .sort({ createdAt: -1 });

  return res.status(200).json(new apiResponse(200, comments, "All comments fetched successfully"));
});

const addComment = asyncHandler(async (req, res) => {
  const { videoId } = req.params;
  const { content } = req.body;

  if (!content?.trim()) {
    throw new apiError(400, "Comment content is required");
  }

  const comment = await Comment.create({
    content: content.trim(),
    video: videoId,
    owner: req.user?._id,
  });

  const populatedComment = await Comment.findById(comment._id).populate("owner", "fullName username avatar");

  // Notify video owner
  try {
    const video = await Video.findById(videoId);
    if (video && video.owner && video.owner.toString() !== req.user._id.toString()) {
      await Notification.create({
        recipient: video.owner,
        sender: req.user._id,
        type: "comment_video",
        video: video._id,
        comment: comment._id,
        content: `commented on your video: "${content.trim().slice(0, 50)}"`
      });
    }
  } catch (err) {
    console.warn("Comment notification skipped:", err.message);
  }

  return res.status(201).json(new apiResponse(201, populatedComment, "Comment added successfully"));
});

const updateComment = asyncHandler(async (req, res) => {
  const { commentId } = req.params;
  const { content } = req.body;

  if (!content?.trim()) {
    throw new apiError(400, "Comment content is required");
  }

  const existingComment = await Comment.findById(commentId);
  if (!existingComment) {
    throw new apiError(404, "Comment not found");
  }

  if (existingComment.owner.toString() !== req.user._id.toString()) {
    throw new apiError(403, "You are not authorized to update this comment");
  }

  existingComment.content = content.trim();
  await existingComment.save();

  const populatedComment = await Comment.findById(commentId).populate("owner", "fullName username avatar");

  return res.status(200).json(new apiResponse(200, populatedComment, "Comment updated successfully"));
});

const deleteComment = asyncHandler(async (req, res) => {
  const { commentId } = req.params;

  if (!commentId) {
    throw new apiError(400, "Comment ID is required");
  }

  const existingComment = await Comment.findById(commentId);
  if (!existingComment) {
    throw new apiError(404, "Comment not found");
  }

  if (existingComment.owner.toString() !== req.user._id.toString()) {
    throw new apiError(403, "You are not authorized to delete this comment");
  }

  await Comment.findByIdAndDelete(commentId);

  return res.status(200).json(new apiResponse(200, {}, "Comment deleted successfully"));
});

export {
  getVideoComments,
  addComment,
  updateComment,
  deleteComment,
};
