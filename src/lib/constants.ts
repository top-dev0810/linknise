import { FaDiscord, FaYoutube, FaInstagram, FaTwitter, FaTiktok, FaFacebook, FaTelegram, FaSpotify, FaTwitch, FaReddit, FaGlobe, FaPinterest, FaVk } from "react-icons/fa";

export const PLATFORM_OPTIONS = [
    { value: "YouTube", label: "YouTube", icon: FaYoutube, color: "bg-red-600" },
    { value: "Instagram", label: "Instagram", icon: FaInstagram, color: "bg-pink-600" },
    { value: "X", label: "X (Twitter)", icon: FaTwitter, color: "bg-black" },
    { value: "TikTok", label: "TikTok", icon: FaTiktok, color: "bg-black" },
    { value: "Facebook", label: "Facebook", icon: FaFacebook, color: "bg-blue-600" },
    { value: "Discord", label: "Discord", icon: FaDiscord, color: "bg-indigo-600" },
    { value: "Threads", label: "Threads", icon: FaInstagram, color: "bg-black" },
    { value: "VK", label: "VK", icon: FaVk, color: "bg-blue-500" },
    { value: "Pinterest", label: "Pinterest", icon: FaPinterest, color: "bg-red-500" },
    { value: "Telegram", label: "Telegram", icon: FaTelegram, color: "bg-blue-500" },
    { value: "Spotify", label: "Spotify", icon: FaSpotify, color: "bg-green-500" },
    { value: "Soundcloud", label: "Soundcloud", icon: FaGlobe, color: "bg-orange-500" },
    { value: "Twitch", label: "Twitch", icon: FaTwitch, color: "bg-purple-600" },
    { value: "Reddit", label: "Reddit", icon: FaReddit, color: "bg-orange-500" },
    { value: "Beatstars", label: "Beatstars", icon: FaGlobe, color: "bg-purple-500" },
    { value: "Roblox", label: "Roblox", icon: FaGlobe, color: "bg-red-500" },
    { value: "Website", label: "Visit Website", icon: FaGlobe, color: "bg-gray-600" },
];

export const ACTION_TYPE_OPTIONS: {
    [key: string]: { value: string; label: string; validationExample: string }[];
    YouTube: { value: string; label: string; validationExample: string }[];
    Instagram: { value: string; label: string; validationExample: string }[];
    X: { value: string; label: string; validationExample: string }[];
    TikTok: { value: string; label: string; validationExample: string }[];
    Facebook: { value: string; label: string; validationExample: string }[];
    Discord: { value: string; label: string; validationExample: string }[];
    Threads: { value: string; label: string; validationExample: string }[];
    VK: { value: string; label: string; validationExample: string }[];
    Pinterest: { value: string; label: string; validationExample: string }[];
    Telegram: { value: string; label: string; validationExample: string }[];
    Spotify: { value: string; label: string; validationExample: string }[];
    Soundcloud: { value: string; label: string; validationExample: string }[];
    Twitch: { value: string; label: string; validationExample: string }[];
    Reddit: { value: string; label: string; validationExample: string }[];
    Beatstars: { value: string; label: string; validationExample: string }[];
    Roblox: { value: string; label: string; validationExample: string }[];
    Website: { value: string; label: string; validationExample: string }[];
} = {
    YouTube: [
        { value: "subscribe", label: "Subscribe to channel", validationExample: "https://youtube.com/channel/UC..." },
        { value: "subscribe_notify", label: "Subscribe & enable notifications", validationExample: "https://youtube.com/channel/UC..." },
        { value: "like", label: "Like video", validationExample: "https://youtube.com/watch?v=..." },
        { value: "comment", label: "Comment on video", validationExample: "https://youtube.com/watch?v=..." },
        { value: "like_comment", label: "Like & Comment video", validationExample: "https://youtube.com/watch?v=..." },
        { value: "vote", label: "Vote on community post", validationExample: "https://youtube.com/post/..." },
        { value: "share", label: "Share video", validationExample: "https://youtube.com/watch?v=..." },
    ],
    Instagram: [
        { value: "follow", label: "Follow profile", validationExample: "https://instagram.com/username" },
        { value: "like", label: "Like post", validationExample: "https://instagram.com/p/postid" },
        { value: "comment", label: "Comment on picture", validationExample: "https://instagram.com/p/postid" },
        { value: "share", label: "Share post", validationExample: "https://instagram.com/p/postid" },
    ],
    X: [
        { value: "follow", label: "Follow profile", validationExample: "https://x.com/username" },
        { value: "like", label: "Like post", validationExample: "https://x.com/username/status/..." },
        { value: "comment", label: "Comment on post", validationExample: "https://x.com/username/status/..." },
        { value: "repost", label: "Repost", validationExample: "https://x.com/username/status/..." },
    ],
    TikTok: [
        { value: "follow", label: "Follow profile", validationExample: "https://tiktok.com/@username" },
        { value: "like", label: "Like tiktok", validationExample: "https://tiktok.com/@username/video/..." },
        { value: "comment", label: "Comment on tiktok", validationExample: "https://tiktok.com/@username/video/..." },
        { value: "share", label: "Share tiktok", validationExample: "https://tiktok.com/@username/video/..." },
    ],
    Facebook: [
        { value: "like_page", label: "Like page", validationExample: "https://facebook.com/pagename" },
        { value: "like_post", label: "Like post", validationExample: "https://facebook.com/username/posts/..." },
        { value: "react", label: "React to post", validationExample: "https://facebook.com/username/posts/..." },
        { value: "comment", label: "Comment on post", validationExample: "https://facebook.com/username/posts/..." },
        { value: "share", label: "Share post", validationExample: "https://facebook.com/username/posts/..." },
    ],
    Discord: [
        { value: "join_server", label: "Join server", validationExample: "https://discord.gg/inviteCode" },
    ],
    Threads: [
        { value: "follow", label: "Follow profile", validationExample: "https://threads.net/@username" },
    ],
    VK: [
        { value: "follow", label: "Follow profile", validationExample: "https://vk.com/username" },
        { value: "follow_group", label: "Follow group", validationExample: "https://vk.com/groupname" },
        { value: "like", label: "Like post", validationExample: "https://vk.com/wall-..." },
    ],
    Pinterest: [
        { value: "follow_account", label: "Follow account", validationExample: "https://pinterest.com/username" },
        { value: "follow_board", label: "Follow board", validationExample: "https://pinterest.com/username/boardname" },
        { value: "like", label: "Like pin", validationExample: "https://pinterest.com/pin/..." },
        { value: "repin", label: "Repin", validationExample: "https://pinterest.com/pin/..." },
    ],
    Telegram: [
        { value: "join_channel", label: "Join channel", validationExample: "https://t.me/channelname" },
        { value: "join_group", label: "Join group", validationExample: "https://t.me/groupname" },
        { value: "react", label: "React to message", validationExample: "https://t.me/channelname/123" },
        { value: "vote", label: "Vote in poll", validationExample: "https://t.me/channelname/123" },
    ],
    Spotify: [
        { value: "follow_artist", label: "Follow artist", validationExample: "https://open.spotify.com/artist/..." },
        { value: "like_song", label: "Like song", validationExample: "https://open.spotify.com/track/..." },
        { value: "like_playlist", label: "Like playlist", validationExample: "https://open.spotify.com/playlist/..." },
        { value: "add_playlist", label: "Add to playlist", validationExample: "https://open.spotify.com/track/..." },
        { value: "like_album", label: "Like album", validationExample: "https://open.spotify.com/album/..." },
    ],
    Soundcloud: [
        { value: "follow_artist", label: "Follow artist", validationExample: "https://soundcloud.com/artistname" },
        { value: "like_track", label: "Like track", validationExample: "https://soundcloud.com/artistname/trackname" },
        { value: "comment", label: "Comment track", validationExample: "https://soundcloud.com/artistname/trackname" },
        { value: "repost", label: "Repost track", validationExample: "https://soundcloud.com/artistname/trackname" },
    ],
    Twitch: [
        { value: "follow", label: "Follow streamer", validationExample: "https://twitch.tv/streamername" },
    ],
    Reddit: [
        { value: "upvote_post", label: "↑ Upvote post", validationExample: "https://reddit.com/r/subreddit/comments/..." },
        { value: "upvote_comment", label: "↑ Upvote comment", validationExample: "https://reddit.com/r/subreddit/comments/..." },
        { value: "join", label: "Join subreddit", validationExample: "https://reddit.com/r/subreddit" },
    ],
    Beatstars: [
        { value: "follow_producer", label: "Follow producer", validationExample: "https://beatstars.com/producername" },
        { value: "like_beat", label: "Like beat", validationExample: "https://beatstars.com/producername/beatname" },
        { value: "comment", label: "Comment on beat", validationExample: "https://beatstars.com/producername/beatname" },
        { value: "share", label: "Share beat", validationExample: "https://beatstars.com/producername/beatname" },
        { value: "add_playlist", label: "+ Add to playlist", validationExample: "https://beatstars.com/producername/beatname" },
        { value: "repost", label: "Repost beat", validationExample: "https://beatstars.com/producername/beatname" },
    ],
    Roblox: [
        { value: "follow", label: "Follow user", validationExample: "https://roblox.com/users/username" },
        { value: "favorite_game", label: "Favorite game", validationExample: "https://roblox.com/games/gameid" },
        { value: "like_game", label: "Like game", validationExample: "https://roblox.com/games/gameid" },
        { value: "join_group", label: "Join group", validationExample: "https://roblox.com/groups/groupid" },
        { value: "vote_model", label: "Vote on model/asset", validationExample: "https://roblox.com/catalog/modelid" },
        { value: "favorite_model", label: "Favorite model/asset", validationExample: "https://roblox.com/catalog/modelid" },
        { value: "comment_group", label: "Comment on group", validationExample: "https://roblox.com/groups/groupid" },
    ],
    Website: [
        { value: "visit", label: "Visit Website", validationExample: "https://example.com" },
    ],
};

export function getActionTypeOptions(platform: string): { value: string; label: string; validationExample: string }[] {
    return ACTION_TYPE_OPTIONS[platform] || ACTION_TYPE_OPTIONS["Website"];
}

// Validation regexes for each platform/action
export const URL_VALIDATORS: { [key: string]: (url: string) => boolean } = {
    'Discord:join_server': url => /^https:\/\/(discord\.gg|discord\.com\/invite)\/[\w-]+$/i.test(url),
    'YouTube:subscribe': url => /^https:\/\/youtube\.com\/channel\/[\w-]+$/i.test(url),
    'YouTube:subscribe_notify': url => /^https:\/\/youtube\.com\/channel\/[\w-]+$/i.test(url),
    'YouTube:like': url => /^https:\/\/youtube\.com\/watch\?v=[\w-]+$/i.test(url),
    'YouTube:comment': url => /^https:\/\/youtube\.com\/watch\?v=[\w-]+$/i.test(url),
    'YouTube:like_comment': url => /^https:\/\/youtube\.com\/watch\?v=[\w-]+$/i.test(url),
    'YouTube:vote': url => /^https:\/\/youtube\.com\/post\/[\w-]+$/i.test(url),
    'YouTube:share': url => /^https:\/\/youtube\.com\/watch\?v=[\w-]+$/i.test(url),
    'Instagram:follow': url => /^https:\/\/instagram\.com\/[\w_.]+$/i.test(url),
    'Instagram:like': url => /^https:\/\/instagram\.com\/p\/[\w-]+$/i.test(url),
    'Instagram:comment': url => /^https:\/\/instagram\.com\/p\/[\w-]+$/i.test(url),
    'Instagram:share': url => /^https:\/\/instagram\.com\/p\/[\w-]+$/i.test(url),
    'X:follow': url => /^https:\/\/x\.com\/[\w_]+$/i.test(url),
    'X:like': url => /^https:\/\/x\.com\/[\w_]+\/status\/[\d]+$/i.test(url),
    'X:comment': url => /^https:\/\/x\.com\/[\w_]+\/status\/[\d]+$/i.test(url),
    'X:repost': url => /^https:\/\/x\.com\/[\w_]+\/status\/[\d]+$/i.test(url),
    'TikTok:follow': url => /^https:\/\/tiktok\.com\/@[\w_.]+$/i.test(url),
    'TikTok:like': url => /^https:\/\/tiktok\.com\/@[\w_.]+\/video\/[\d]+$/i.test(url),
    'TikTok:comment': url => /^https:\/\/tiktok\.com\/@[\w_.]+\/video\/[\d]+$/i.test(url),
    'TikTok:share': url => /^https:\/\/tiktok\.com\/@[\w_.]+\/video\/[\d]+$/i.test(url),
    'Facebook:like_page': url => /^https:\/\/facebook\.com\/[\w.]+$/i.test(url),
    'Facebook:like_post': url => /^https:\/\/facebook\.com\/[\w.]+\/posts\/[\d]+$/i.test(url),
    'Facebook:react': url => /^https:\/\/facebook\.com\/[\w.]+\/posts\/[\d]+$/i.test(url),
    'Facebook:comment': url => /^https:\/\/facebook\.com\/[\w.]+\/posts\/[\d]+$/i.test(url),
    'Facebook:share': url => /^https:\/\/facebook\.com\/[\w.]+\/posts\/[\d]+$/i.test(url),
    'Website:visit': url => /^https?:\/\//i.test(url),
    // Add more as needed for other platforms/actions
}; 