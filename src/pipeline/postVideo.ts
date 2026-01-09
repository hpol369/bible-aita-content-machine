import { postToBlotato, buildBlotatoPosts } from "../api/blotato.js";
import {
  uploadToYouTubeShorts,
  addPinnedComment,
  buildYouTubeMetadata,
} from "../api/youtube.js";
import type { AITAContent } from "../types/content.js";
import type { PostResult } from "../types/posting.js";
import { logger } from "../utils/index.js";

export interface PostingInput {
  id: string;
  videoPath: string;
  videoUrl: string; // Public URL (e.g., S3 URL)
  aitaContent: AITAContent;
}

export interface PostingOutput {
  results: PostResult[];
  successCount: number;
  failCount: number;
}

export async function postVideo(input: PostingInput): Promise<PostingOutput> {
  const { id, videoPath, videoUrl, aitaContent } = input;
  const results: PostResult[] = [];

  logger.info(`[${id}] Stage 5: Posting video to platforms`);

  // Build platform-specific posts for Blotato
  const blotatoPosts = buildBlotatoPosts(
    videoUrl,
    aitaContent.post_title,
    aitaContent.cta,
    aitaContent.pinned_comment
  );

  // Post to Blotato platforms (TikTok, Instagram, Facebook)
  if (blotatoPosts.length > 0) {
    logger.info(`[${id}] Posting to Blotato platforms (${blotatoPosts.length} platforms)`);
    const blotatoResults = await postToBlotato(videoUrl, blotatoPosts);
    results.push(...blotatoResults);
  } else {
    logger.warn(`[${id}] No Blotato accounts configured, skipping`);
  }

  // Post to YouTube Shorts
  const youtubeMetadata = buildYouTubeMetadata(
    aitaContent.post_title,
    aitaContent.post_body,
    aitaContent.metadata.biblical_source,
    aitaContent.cta
  );

  logger.info(`[${id}] Uploading to YouTube Shorts`);
  const youtubeResult = await uploadToYouTubeShorts(videoPath, youtubeMetadata);

  if (youtubeResult.success && youtubeResult.videoId) {
    // Add pinned comment with reveal
    await addPinnedComment(youtubeResult.videoId, aitaContent.pinned_comment);

    results.push({
      platform: "youtube",
      success: true,
      postId: youtubeResult.videoId,
      url: youtubeResult.url,
    });
  } else {
    results.push({
      platform: "youtube",
      success: false,
      error: youtubeResult.error,
    });
  }

  const successCount = results.filter((r) => r.success).length;
  const failCount = results.filter((r) => !r.success).length;

  logger.info(`[${id}] Posting complete: ${successCount} succeeded, ${failCount} failed`);

  for (const result of results) {
    if (result.success) {
      logger.info(`[${id}] ✓ ${result.platform}: ${result.url}`);
    } else {
      logger.error(`[${id}] ✗ ${result.platform}: ${result.error}`);
    }
  }

  return {
    results,
    successCount,
    failCount,
  };
}

// Skip posting - useful for testing content/video generation only
export async function skipPosting(id: string): Promise<PostingOutput> {
  logger.info(`[${id}] Skipping posting (dry run mode)`);
  return {
    results: [],
    successCount: 0,
    failCount: 0,
  };
}
