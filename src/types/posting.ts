export type Platform = "tiktok" | "instagram" | "facebook" | "youtube";

export interface PlatformPost {
  platform: Platform;
  caption: string;
  accountId: string;
}

export interface PostResult {
  platform: Platform;
  success: boolean;
  postId?: string;
  url?: string;
  error?: string;
}

export interface YouTubeMetadata {
  title: string;
  description: string;
  tags: string[];
}

export interface YouTubeUploadResult {
  success: boolean;
  videoId?: string;
  url?: string;
  error?: string;
}
