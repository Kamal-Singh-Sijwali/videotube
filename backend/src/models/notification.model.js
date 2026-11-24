import mongoose, { Schema } from "mongoose";

const notificationSchema = new Schema(
  {
    recipient: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    sender: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    type: {
      type: String,
      enum: [
        "like_video",
        "like_comment",
        "like_tweet",
        "comment_video",
        "subscribe_channel",
      ],
      required: true,
    },
    video: {
      type: Schema.Types.ObjectId,
      ref: "Video",
      default: null,
    },
    comment: {
      type: Schema.Types.ObjectId,
      ref: "Comment",
      default: null,
    },
    tweet: {
      type: Schema.Types.ObjectId,
      ref: "tweet",
      default: null,
    },
    content: {
      type: String,
      default: "",
    },
    isRead: {
      type: Boolean,
      default: false,
      index: true,
    },
  },
  { timestamps: true }
);

export const Notification = mongoose.model("Notification", notificationSchema);
