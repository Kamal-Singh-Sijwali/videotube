import axios from "axios";
import routes, { API_BASE_URL } from "../constant.js";

const api = axios.create({
  withCredentials: true,
});

// Request interceptor: attach accessToken from localStorage if stored
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("accessToken");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor: extract clean error message
api.interceptors.response.use(
  (response) => response,
  (error) => {
    const message =
      error.response?.data?.message ||
      error.response?.data?.errors?.[0] ||
      error.message ||
      "An unexpected error occurred";
    return Promise.reject(new Error(message));
  }
);

export const authApi = {
  register: (formData) => api.post(routes.users.register, formData),
  login: (credentials) => api.post(routes.users.login, credentials),
  logout: () => api.post(routes.users.logout),
  getCurrentUser: () => api.get(routes.users.currentUser),
  getChannelProfile: (username) => api.get(routes.users.channel(username)),
  getWatchHistory: () => api.get(routes.users.watchHistory),
};

export const videoApi = {
  getAllVideos: (query = "") =>
    api.get(`${routes.videos.all}${query ? `?query=${encodeURIComponent(query)}` : ""}`),
  getVideoById: (id) => api.get(routes.videos.byId(id)),
  publishVideo: (formData) => api.post(routes.videos.upload, formData),
  updateVideo: (id, formData) => api.patch(routes.videos.byId(id), formData),
  deleteVideo: (id) => api.delete(routes.videos.byId(id)),
  togglePublish: (id) => api.patch(routes.videos.togglePublish(id)),
  getUserVideos: (userId) => api.get(`${routes.videos.userVideos}${userId ? `?userId=${userId}` : ""}`),
};

export const likeApi = {
  toggleVideoLike: (videoId) => api.post(routes.likes.toggleVideo(videoId)),
  getVideoLikeStatus: (videoId) => api.get(routes.likes.videoStatus(videoId)),
  getLikedVideos: () => api.get(routes.likes.likedVideos),
  toggleCommentLike: (commentId) => api.post(routes.likes.toggleComment(commentId)),
  toggleTweetLike: (tweetId) => api.post(routes.likes.toggleTweet(tweetId)),
};

export const subscriptionApi = {
  toggleSubscription: (channelId) => api.post(routes.subscriptions.toggle(channelId)),
  getSubscriptionStatus: (channelId) => api.get(routes.subscriptions.status(channelId)),
  getSubscribedChannels: () => api.get(routes.subscriptions.userSubscriptions),
  getChannelSubscribers: (channelId) => api.get(routes.subscriptions.channelSubscribers(channelId)),
};

export const commentApi = {
  getVideoComments: (videoId) => api.get(routes.comments.byVideo(videoId)),
  addComment: (videoId, content) => api.post(routes.comments.add(videoId), { content }),
  deleteComment: (commentId) => api.delete(routes.comments.delete(commentId)),
};

export const dashboardApi = {
  getStats: (channelId) => api.get(routes.dashboard.stats(channelId)),
  getVideos: (channelId) => api.get(routes.dashboard.videos(channelId)),
};

export const tweetApi = {
  getAllTweets: () => api.get(routes.tweets.all),
  createTweet: (content) => api.post(routes.tweets.create, { content }),
  deleteTweet: (tweetId) => api.delete(routes.tweets.delete(tweetId)),
};

export const notificationApi = {
  getNotifications: () => api.get(routes.notifications.all),
  markAllRead: () => api.patch(routes.notifications.markAllRead),
  markRead: (id) => api.patch(routes.notifications.markRead(id)),
  deleteNotification: (id) => api.delete(routes.notifications.delete(id)),
  clearAll: () => api.delete(routes.notifications.clearAll),
};

export default api;
