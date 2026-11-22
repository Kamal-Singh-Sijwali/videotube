import mongoose from "mongoose";
import { asyncHandler } from "../utils/asyncHandler.js";
import { apiError } from "../utils/apiError.js";
import { apiResponse } from "../utils/apiResponse.js";
import { Notification } from "../models/notification.model.js";

// Fetch notifications for the current user
const getUserNotifications = asyncHandler(async (req, res) => {
  const userId = req.user._id;

  const notifications = await Notification.find({ recipient: userId })
    .populate("sender", "fullName username avatar")
    .populate("video", "title thumbnail duration")
    .populate("comment", "content")
    .sort({ createdAt: -1 })
    .limit(50);

  const unreadCount = await Notification.countDocuments({
    recipient: userId,
    isRead: false,
  });

  return res.status(200).json(
    new apiResponse(
      200,
      { notifications, unreadCount },
      "Notifications fetched successfully"
    )
  );
});

// Mark single notification as read
const markNotificationAsRead = asyncHandler(async (req, res) => {
  const { id } = req.params;

  if (!id || !mongoose.isValidObjectId(id)) {
    throw new apiError(400, "Valid notification ID is required");
  }

  const notification = await Notification.findOneAndUpdate(
    { _id: id, recipient: req.user._id },
    { $set: { isRead: true } },
    { new: true }
  );

  if (!notification) {
    throw new apiError(404, "Notification not found");
  }

  const unreadCount = await Notification.countDocuments({
    recipient: req.user._id,
    isRead: false,
  });

  return res.status(200).json(
    new apiResponse(
      200,
      { notification, unreadCount },
      "Notification marked as read"
    )
  );
});

// Mark all notifications as read
const markAllNotificationsAsRead = asyncHandler(async (req, res) => {
  await Notification.updateMany(
    { recipient: req.user._id, isRead: false },
    { $set: { isRead: true } }
  );

  return res.status(200).json(
    new apiResponse(200, { unreadCount: 0 }, "All notifications marked as read")
  );
});

// Delete a single notification
const deleteNotification = asyncHandler(async (req, res) => {
  const { id } = req.params;

  if (!id || !mongoose.isValidObjectId(id)) {
    throw new apiError(400, "Valid notification ID is required");
  }

  const notification = await Notification.findOneAndDelete({
    _id: id,
    recipient: req.user._id,
  });

  if (!notification) {
    throw new apiError(404, "Notification not found");
  }

  const unreadCount = await Notification.countDocuments({
    recipient: req.user._id,
    isRead: false,
  });

  return res.status(200).json(
    new apiResponse(200, { unreadCount }, "Notification deleted successfully")
  );
});

// Clear all notifications
const clearAllNotifications = asyncHandler(async (req, res) => {
  await Notification.deleteMany({ recipient: req.user._id });

  return res.status(200).json(
    new apiResponse(200, { unreadCount: 0 }, "All notifications cleared")
  );
});

export {
  getUserNotifications,
  markNotificationAsRead,
  markAllNotificationsAsRead,
  deleteNotification,
  clearAllNotifications,
};
