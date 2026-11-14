export const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:8000/api/v1";

const routes = {
  baseUrl: API_BASE_URL,
  users: {
    register: `${API_BASE_URL}/users/register`,
    login: `${API_BASE_URL}/users/login`,
    logout: `${API_BASE_URL}/users/logout`,
    currentUser: `${API_BASE_URL}/users/current-user`,
    refreshToken: `${API_BASE_URL}/users/refreshToken`,
    channel: (username) => `${API_BASE_URL}/users/c/${username}`,
    watchHistory: `${API_BASE_URL}/users/watch-history`,
    updateAvatar: `${API_BASE_URL}/users/update-avatar`,
    updateCover: `${API_BASE_URL}/users/update-coverImage`,
    updateAccount: `${API_BASE_URL}/users/update-account`,
  },
  videos: {
    all: `${API_BASE_URL}/videos/allVideos`,
    userVideos: `${API_BASE_URL}/videos`,
    upload: `${API_BASE_URL}/videos/uploadVideo`,
    byId: (id) => `${API_BASE_URL}/videos/${id}`,
    togglePublish: (id) => `${API_BASE_URL}/videos/toggle/publish/${id}`,
  },
  likes: {
    toggleVideo: (id) => `${API_BASE_URL}/like/${id}`,
    videoStatus: (id) => `${API_BASE_URL}/like/status/${id}`,
    likedVideos: `${API_BASE_URL}/like/videos`,
    toggleComment: (id) => `${API_BASE_URL}/like/c/${id}`,
    toggleTweet: (id) => `${API_BASE_URL}/like/t/${id}`,
  },
  subscriptions: {
    toggle: (channelId) => `${API_BASE_URL}/subscribe/${channelId}`,
    status: (channelId) => `${API_BASE_URL}/subscribe/status/${channelId}`,
    channelSubscribers: (channelId) => `${API_BASE_URL}/subscribe/channel/${channelId}`,
    userSubscriptions: `${API_BASE_URL}/subscribe/user/subscriptions`,
  },
  comments: {
    byVideo: (videoId) => `${API_BASE_URL}/comment/${videoId}`,
    add: (videoId) => `${API_BASE_URL}/comment/${videoId}`,
    delete: (commentId) => `${API_BASE_URL}/comment/${commentId}`,
    update: (commentId) => `${API_BASE_URL}/comment/${commentId}`,
  },
  dashboard: {
    stats: (channelId) => channelId ? `${API_BASE_URL}/dashboard/stats/${channelId}` : `${API_BASE_URL}/dashboard/stats`,
    videos: (channelId) => channelId ? `${API_BASE_URL}/dashboard/getAllvideos/${channelId}` : `${API_BASE_URL}/dashboard/videos`,
  },
  tweets: {
    all: `${API_BASE_URL}/tweet/getAll`,
    create: `${API_BASE_URL}/tweet`,
    delete: (id) => `${API_BASE_URL}/tweet/${id}`,
  }
};

export default routes;
