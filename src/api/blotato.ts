import axios from "axios";
import type { PlatformPost, PostResult, Platform } from "../types/index.js";
import { logger } from "../utils/index.js";
import { sleep } from "../utils/helpers.js";

const BLOTATO_BASE_URL = "https://backend.blotato.com";

interface BlotatoPostPayload {
  mediaUrls: string[];
  platforms: {
    platform: string;
    caption: string;
    accountId: string;
  }[];
}

interface BlotatoResponse {
  id: string;
  url?: string;
  status: string;
}

export async function postToBlotato(
  videoUrl: string,
  posts: PlatformPost[]
): Promise<PostResult[]> {
  const apiKey = process.env.BLOTATO_API_KEY;
  if (!apiKey) {
    throw new Error("BLOTATO_API_KEY environment variable is not set");
  }

  const results: PostResult[] = [];

  for (const post of posts) {
    // Skip YouTube - that's handled separately
    if (post.platform === "youtube") continue;

    const payload: BlotatoPostPayload = {
      mediaUrls: [videoUrl],
      platforms: [
        {
          platform: post.platform,
          caption: post.caption,
          accountId: post.accountId,
        },
      ],
    };

    try {
      logger.info(`Posting to ${post.platform} via Blotato`);

      const response = await axios.post<BlotatoResponse>(
        `${BLOTATO_BASE_URL}/v2/posts`,
        payload,
        {
          headers: {
            Authorization: `Bearer ${apiKey}`,
            "Content-Type": "application/json",
          },
        }
      );

      results.push({
        platform: post.platform,
        success: true,
        postId: response.data.id,
        url: response.data.url,
      });

      logger.info(`Successfully posted to ${post.platform}`);
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : String(error);
      logger.error(`Failed to post to ${post.platform}: ${errorMessage}`);

      results.push({
        platform: post.platform,
        success: false,
        error: errorMessage,
      });
    }

    // Rate limit: Blotato has rate limits
    await sleep(2000);
  }

  return results;
}

export function buildBlotatoPosts(
  videoUrl: string,
  aitaTitle: string,
  cta: string,
  pinnedComment: string
): PlatformPost[] {
  const posts: PlatformPost[] = [];

  // TikTok
  const tiktokAccountId = process.env.BLOTATO_TIKTOK_ID;
  if (tiktokAccountId) {
    posts.push({
      platform: "tiktok" as Platform,
      caption: `${cta} #redditstories #AITA #bible #familydrama #storytime`,
      accountId: tiktokAccountId,
    });
  }

  // Instagram
  const instagramAccountId = process.env.BLOTATO_INSTAGRAM_ID;
  if (instagramAccountId) {
    posts.push({
      platform: "instagram" as Platform,
      caption: `${aitaTitle.slice(0, 100)}... Give your verdict!\n\n${cta}\n\n#AITA #biblestories #redditstories #familydrama #storytime`,
      accountId: instagramAccountId,
    });
  }

  // Facebook
  const facebookAccountId = process.env.BLOTATO_FACEBOOK_ID;
  if (facebookAccountId) {
    posts.push({
      platform: "facebook" as Platform,
      caption: `${aitaTitle}\n\n${cta}`,
      accountId: facebookAccountId,
    });
  }

  return posts;
}
