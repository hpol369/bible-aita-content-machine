import axios from "axios";
import * as fs from "fs/promises";
import * as path from "path";
import type { EmotionType, FootageResult, PexelsSearchResponse } from "../types/index.js";
import { logger } from "../utils/index.js";
import { ensureDir, sleep, getRandomInt } from "../utils/helpers.js";

const PEXELS_API_URL = "https://api.pexels.com/videos/search";

// Emotion to search term mapping
const EMOTION_SEARCH_MAP: Record<EmotionType, string[]> = {
  betrayal: ["storm clouds", "dark ocean", "heavy rain", "mist forest", "fog"],
  hope: ["sunrise", "golden hour", "flower meadow", "calm lake", "light rays"],
  forgiveness: ["sunrise", "golden hour", "peaceful nature", "calm water", "gentle waves"],
  strength: ["mountain peaks", "canyon", "waterfall", "lightning storm", "rocky cliffs"],
  judgment: ["mountain peaks", "thunderstorm", "dramatic clouds", "lightning", "dark sky"],
  jealousy: ["desert", "cracked earth", "sand dunes", "dead trees", "barren landscape"],
  wisdom: ["ancient trees", "sunbeams forest", "starry night", "old oak", "misty woods"],
  conflict: ["crashing waves", "volcano", "red sunset", "dark mountains", "stormy sea"],
};

export async function downloadFootage(
  emotion: EmotionType,
  outputId: string,
  clipCount: number = 10
): Promise<FootageResult> {
  const apiKey = process.env.PEXELS_API_KEY;
  if (!apiKey) {
    throw new Error("PEXELS_API_KEY environment variable is not set");
  }

  const assetsDir = process.env.ASSETS_DIR || "./assets";
  const searchTerms = EMOTION_SEARCH_MAP[emotion] || EMOTION_SEARCH_MAP.conflict;
  const clips: string[] = [];

  // Ensure output directory exists
  const footageDir = path.join(assetsDir, "footage", outputId);
  await ensureDir(footageDir);

  logger.info(`Downloading ${clipCount} clips for emotion: ${emotion}`);

  const usedVideoIds = new Set<number>();

  for (let i = 0; i < clipCount; i++) {
    const searchTerm = searchTerms[i % searchTerms.length];
    if (!searchTerm) continue;

    try {
      const response = await axios.get<PexelsSearchResponse>(PEXELS_API_URL, {
        headers: { Authorization: apiKey },
        params: {
          query: searchTerm,
          orientation: "portrait",
          size: "large",
          per_page: 10,
          page: Math.floor(i / searchTerms.length) + 1,
        },
      });

      const videos = response.data.videos.filter(
        (v) => !usedVideoIds.has(v.id)
      );

      if (videos.length === 0) {
        logger.warn(`No new videos found for search term: ${searchTerm}`);
        continue;
      }

      // Select random video from results
      const video = videos[getRandomInt(0, videos.length - 1)];
      if (!video) continue;

      usedVideoIds.add(video.id);

      // Find HD portrait video file (height > width for portrait)
      const videoFile =
        video.video_files.find(
          (f) => f.height >= 1080 && f.height > f.width && f.quality === "hd"
        ) ||
        video.video_files.find((f) => f.height >= 720 && f.height > f.width) ||
        video.video_files[0];

      if (!videoFile) {
        logger.warn(`No suitable video file found for video ${video.id}`);
        continue;
      }

      // Download video
      const videoPath = path.join(footageDir, `clip_${i}.mp4`);

      logger.debug(`Downloading clip ${i + 1}/${clipCount}: ${searchTerm}`);

      const videoResponse = await axios.get(videoFile.link, {
        responseType: "arraybuffer",
      });

      await fs.writeFile(videoPath, Buffer.from(videoResponse.data));
      clips.push(videoPath);

      // Rate limiting: Pexels allows 200 req/hour
      await sleep(500);
    } catch (error) {
      logger.warn(
        `Failed to download clip for "${searchTerm}": ${error instanceof Error ? error.message : String(error)}`
      );
    }
  }

  logger.info(`Downloaded ${clips.length}/${clipCount} clips for ${emotion}`);

  return {
    clips,
    emotion,
    searchTerms: searchTerms.slice(0, clipCount),
  };
}
