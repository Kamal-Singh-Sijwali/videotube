// YouTube Data Integration Utility
// Supports live YouTube Data API v3 when YOUTUBE_API_KEY is present in .env,
// and provides a rich catalog of real YouTube videos as a robust fallback.

const DEFAULT_YOUTUBE_CATALOG = [
  {
    youtubeId: "bMknfKXIFA8",
    title: "React Course - Beginner's Tutorial for React JavaScript Library",
    description: "Learn React by building 8 real-world projects and solving over 140 coding challenges. Perfect for beginners entering web development.",
    channelTitle: "freeCodeCamp.org",
    channelAvatar: "https://yt3.googleusercontent.com/ytc/AIdro_k6K0XJ2_f910z75_wQ9yXgZ8b3L8f3P1=s176-c-k-c0x00ffffff-no-rj",
    thumbnail: "https://i.ytimg.com/vi/bMknfKXIFA8/hqdefault.jpg",
    views: 3420000,
    duration: 43200, // 12 hours
    publishedAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 12).toISOString(),
    category: "React & Node"
  },
  {
    youtubeId: "DHjqpvDnNGE",
    title: "JavaScript in 100 Seconds",
    description: "JavaScript is the software world's most ubiquitous language. Learn what makes it so popular and how it runs in the browser and Node.js.",
    channelTitle: "Fireship",
    channelAvatar: "https://yt3.googleusercontent.com/ytc/AIdro_mK_N4b_12903_xYz0=s176-c-k-c0x00ffffff-no-rj",
    thumbnail: "https://i.ytimg.com/vi/DHjqpvDnNGE/hqdefault.jpg",
    views: 2890000,
    duration: 145,
    publishedAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 5).toISOString(),
    category: "Web Development"
  },
  {
    youtubeId: "fBNz5xF-Kx4",
    title: "Node.js & Express From Scratch - Full Course",
    description: "Build robust REST APIs and backends with Node.js, Express, MongoDB, and Mongoose from scratch.",
    channelTitle: "Traversy Media",
    channelAvatar: "https://yt3.googleusercontent.com/ytc/AIdro_n3912_xY=s176-c-k-c0x00ffffff-no-rj",
    thumbnail: "https://i.ytimg.com/vi/fBNz5xF-Kx4/hqdefault.jpg",
    views: 1850000,
    duration: 7200,
    publishedAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 20).toISOString(),
    category: "React & Node"
  },
  {
    youtubeId: "1Rs2ND1ryYc",
    title: "CSS Tutorial - Zero to Hero in Modern CSS",
    description: "Everything you need to master modern CSS including Flexbox, Grid, Custom Properties, Responsive Design, and CSS Animations.",
    channelTitle: "Web Dev Simplified",
    channelAvatar: "https://yt3.googleusercontent.com/ytc/AIdro_l2309_xZ=s176-c-k-c0x00ffffff-no-rj",
    thumbnail: "https://i.ytimg.com/vi/1Rs2ND1ryYc/hqdefault.jpg",
    views: 1200000,
    duration: 1800,
    publishedAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 35).toISOString(),
    category: "Web Development"
  },
  {
    youtubeId: "V2SKnS8P5v8",
    title: "The Ultimate Smartphone Awards 2024!",
    description: "The best and worst smartphones of the entire year! We breakdown best camera, best battery, best value, and phone of the year.",
    channelTitle: "Marques Brownlee",
    channelAvatar: "https://yt3.googleusercontent.com/ytc/AIdro_nZ9201=s176-c-k-c0x00ffffff-no-rj",
    thumbnail: "https://i.ytimg.com/vi/V2SKnS8P5v8/hqdefault.jpg",
    views: 5200000,
    duration: 1320,
    publishedAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 3).toISOString(),
    category: "Tech News"
  },
  {
    youtubeId: "jfKfP5AUPBw",
    title: "lofi hip hop radio - beats to relax/study to",
    description: "Welcome to the Lofi Girl livestream! Peaceful lofi hip hop beats to help you study, work, code, relax, and sleep.",
    channelTitle: "Lofi Girl",
    channelAvatar: "https://yt3.googleusercontent.com/ytc/AIdro_lofi_girl=s176-c-k-c0x00ffffff-no-rj",
    thumbnail: "https://i.ytimg.com/vi/jfKfP5AUPBw/hqdefault.jpg",
    views: 89400000,
    duration: 86400,
    publishedAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 60).toISOString(),
    category: "Music"
  },
  {
    youtubeId: "8mAITcNt710",
    title: "Harvard CS50 – Full Computer Science Course",
    description: "Introduction to the intellectual enterprises of computer science and the art of programming from Harvard University.",
    channelTitle: "CS50",
    channelAvatar: "https://yt3.googleusercontent.com/ytc/AIdro_cs50_harvard=s176-c-k-c0x00ffffff-no-rj",
    thumbnail: "https://i.ytimg.com/vi/8mAITcNt710/hqdefault.jpg",
    views: 6300000,
    duration: 88000,
    publishedAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 90).toISOString(),
    category: "Podcasts"
  },
  {
    youtubeId: "kX3nB4PpJko",
    title: "7 Days Stranded In An Abandoned City",
    description: "I spent 7 days surviving in a completely abandoned ghost town with nothing but basic tools and water.",
    channelTitle: "MrBeast",
    channelAvatar: "https://yt3.googleusercontent.com/ytc/AIdro_mrbeast=s176-c-k-c0x00ffffff-no-rj",
    thumbnail: "https://i.ytimg.com/vi/kX3nB4PpJko/hqdefault.jpg",
    views: 125000000,
    duration: 1540,
    publishedAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 14).toISOString(),
    category: "Gaming"
  },
  {
    youtubeId: "JyECrGp-Sw8",
    title: "What If We Detonated All Nuclear Bombs at Once?",
    description: "There are approximately 15,000 nuclear weapons on planet Earth. What would happen if we put them all in one place and detonated them together?",
    channelTitle: "Kurzgesagt – In a Nutshell",
    channelAvatar: "https://yt3.googleusercontent.com/ytc/AIdro_kurzgesagt=s176-c-k-c0x00ffffff-no-rj",
    thumbnail: "https://i.ytimg.com/vi/JyECrGp-Sw8/hqdefault.jpg",
    views: 29800000,
    duration: 672,
    publishedAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 45).toISOString(),
    category: "Animation"
  },
  {
    youtubeId: "aircAruvnKk",
    title: "Build the Future with Google AI & Developer Tools",
    description: "Discover new breakthroughs in AI, machine learning, web technologies, and cloud computing from Google I/O.",
    channelTitle: "Google for Developers",
    channelAvatar: "https://yt3.googleusercontent.com/ytc/AIdro_google_devs=s176-c-k-c0x00ffffff-no-rj",
    thumbnail: "https://i.ytimg.com/vi/aircAruvnKk/hqdefault.jpg",
    views: 1560000,
    duration: 2100,
    publishedAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 8).toISOString(),
    category: "Artificial Intelligence"
  },
  {
    youtubeId: "FTFaQWZBqQ8",
    title: "Figma UI/UX Design Essentials Course",
    description: "Learn how to use Figma for web and mobile design, wireframing, prototyping, and design systems from scratch.",
    channelTitle: "Envato Tuts+",
    channelAvatar: "https://yt3.googleusercontent.com/ytc/AIdro_envato=s176-c-k-c0x00ffffff-no-rj",
    thumbnail: "https://i.ytimg.com/vi/FTFaQWZBqQ8/hqdefault.jpg",
    views: 2100000,
    duration: 3800,
    publishedAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 16).toISOString(),
    category: "Design"
  },
  {
    youtubeId: "u044iM9xsWU",
    title: "Learn CSS Flexbox in 15 Minutes",
    description: "A fast, straightforward breakdown of everything you need to know about CSS Flexbox properties and layouts.",
    channelTitle: "Kevin Powell",
    channelAvatar: "https://yt3.googleusercontent.com/ytc/AIdro_kevin_powell=s176-c-k-c0x00ffffff-no-rj",
    thumbnail: "https://i.ytimg.com/vi/u044iM9xsWU/hqdefault.jpg",
    views: 1450000,
    duration: 960,
    publishedAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 22).toISOString(),
    category: "Web Development"
  }
];

export const formatYouTubeVideo = (item, customId = null) => {
  const videoId = customId || item.youtubeId || item.id?.videoId || item.id;
  return {
    _id: `yt_${videoId}`,
    youtubeId: videoId,
    title: item.title || item.snippet?.title || "YouTube Video",
    description: item.description || item.snippet?.description || "",
    videoFile: `https://www.youtube.com/embed/${videoId}?autoplay=1&enablejsapi=1`,
    thumbnail: item.thumbnail || item.snippet?.thumbnails?.high?.url || item.snippet?.thumbnails?.medium?.url || `https://i.ytimg.com/vi/${videoId}/hqdefault.jpg`,
    duration: item.duration || 600,
    views: item.views || Math.floor(Math.random() * 850000) + 12000,
    isPublished: true,
    createdAt: item.publishedAt || item.snippet?.publishedAt || new Date().toISOString(),
    owner: {
      _id: `channel_${item.channelTitle || item.snippet?.channelTitle || 'youtube'}`,
      fullName: item.channelTitle || item.snippet?.channelTitle || "YouTube Creator",
      username: (item.channelTitle || item.snippet?.channelTitle || "creator").replace(/[^a-zA-Z0-9]/g, "").toLowerCase() || "creator",
      avatar: item.channelAvatar || `https://api.dicebear.com/7.x/identicon/svg?seed=${item.channelTitle || item.snippet?.channelTitle || videoId}`
    }
  };
};

export const fetchYouTubeVideos = async (searchQuery = "") => {
  const apiKey = process.env.YOUTUBE_API_KEY;

  if (apiKey) {
    try {
      const q = searchQuery ? encodeURIComponent(searchQuery) : "trending technology coding web development";
      const url = `https://www.googleapis.com/youtube/v3/search?part=snippet&maxResults=20&q=${q}&type=video&key=${apiKey}`;
      const res = await fetch(url);
      if (res.ok) {
        const data = await res.json();
        if (data?.items?.length) {
          return data.items.map((item) => formatYouTubeVideo(item, item.id?.videoId));
        }
      } else {
        const errJson = await res.json().catch(() => ({}));
        console.warn("YouTube API responded with status", res.status, errJson?.error?.message || "");
      }
    } catch (err) {
      console.warn("YouTube API call failed, using fallback catalog:", err.message);
    }
  }

  // Filter or return default catalog
  if (searchQuery) {
    const q = searchQuery.toLowerCase();
    const matched = DEFAULT_YOUTUBE_CATALOG.filter(
      (v) =>
        v.title.toLowerCase().includes(q) ||
        v.description.toLowerCase().includes(q) ||
        v.channelTitle.toLowerCase().includes(q) ||
        (v.category && v.category.toLowerCase().includes(q))
    );
    if (matched.length > 0) {
      return matched.map((v) => formatYouTubeVideo(v));
    }
  }

  return DEFAULT_YOUTUBE_CATALOG.map((v) => formatYouTubeVideo(v));
};

export const getYouTubeVideoById = async (id) => {
  const cleanId = id.replace(/^yt_/, "");

  const found = DEFAULT_YOUTUBE_CATALOG.find((v) => v.youtubeId === cleanId);
  if (found) {
    return formatYouTubeVideo(found, cleanId);
  }

  const apiKey = process.env.YOUTUBE_API_KEY;
  if (apiKey) {
    try {
      const url = `https://www.googleapis.com/youtube/v3/videos?part=snippet,contentDetails,statistics&id=${cleanId}&key=${apiKey}`;
      const res = await fetch(url);
      if (res.ok) {
        const data = await res.json();
        if (data?.items?.[0]) {
          const item = data.items[0];
          return formatYouTubeVideo({
            title: item.snippet.title,
            description: item.snippet.description,
            channelTitle: item.snippet.channelTitle,
            thumbnail: item.snippet.thumbnails?.high?.url,
            views: parseInt(item.statistics?.viewCount || "10000", 10),
            publishedAt: item.snippet.publishedAt,
          }, cleanId);
        }
      }
    } catch (_) {}
  }

  // Fallback generic YouTube video object
  return formatYouTubeVideo({
    youtubeId: cleanId,
    title: `YouTube Video (${cleanId})`,
    description: "Watched on VideoTube from YouTube.",
    channelTitle: "YouTube Creator",
    thumbnail: `https://i.ytimg.com/vi/${cleanId}/hqdefault.jpg`,
    views: 45000,
    duration: 360,
    publishedAt: new Date().toISOString()
  }, cleanId);
};
