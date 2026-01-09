import type { EmotionType } from "./story.js";

export interface FootageResult {
  clips: string[];
  emotion: EmotionType;
  searchTerms: string[];
}

export interface PexelsVideo {
  id: number;
  width: number;
  height: number;
  duration: number;
  url: string;
  video_files: PexelsVideoFile[];
}

export interface PexelsVideoFile {
  id: number;
  quality: string;
  file_type: string;
  width: number;
  height: number;
  link: string;
}

export interface PexelsSearchResponse {
  page: number;
  per_page: number;
  total_results: number;
  videos: PexelsVideo[];
}
