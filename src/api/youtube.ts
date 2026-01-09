import { google } from "googleapis";
import * as fs from "fs";
import type { YouTubeMetadata, YouTubeUploadResult } from "../types/index.js";
import { logger } from "../utils/index.js";

export async function uploadToYouTubeShorts(
  videoPath: string,
  metadata: YouTubeMetadata
): Promise<YouTubeUploadResult> {
  const clientId = process.env.YOUTUBE_CLIENT_ID;
  const clientSecret = process.env.YOUTUBE_CLIENT_SECRET;
  const refreshToken = process.env.YOUTUBE_REFRESH_TOKEN;

  if (!clientId || !clientSecret || !refreshToken) {
    throw new Error("YouTube API credentials are not configured");
  }

  const oauth2Client = new google.auth.OAuth2(clientId, clientSecret);

  oauth2Client.setCredentials({
    refresh_token: refreshToken,
  });

  const youtube = google.youtube({ version: "v3", auth: oauth2Client });

  // Ensure #Shorts hashtag is present for YouTube Shorts
  let description = metadata.description;
  if (!description.includes("#Shorts")) {
    description = `${description}\n\n#Shorts`;
  }

  try {
    logger.info(`Uploading to YouTube Shorts: ${metadata.title}`);

    const response = await youtube.videos.insert({
      part: ["snippet", "status"],
      requestBody: {
        snippet: {
          title: metadata.title.slice(0, 100), // YouTube title limit
          description,
          tags: metadata.tags,
          categoryId: "22", // People & Blogs
        },
        status: {
          privacyStatus: "public",
          selfDeclaredMadeForKids: false,
        },
      },
      media: {
        body: fs.createReadStream(videoPath),
      },
    });

    const videoId = response.data.id;
    if (!videoId) {
      throw new Error("No video ID returned from YouTube");
    }

    logger.info(`Successfully uploaded to YouTube: ${videoId}`);

    return {
      success: true,
      videoId,
      url: `https://youtube.com/shorts/${videoId}`,
    };
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : String(error);
    logger.error(`Failed to upload to YouTube: ${errorMessage}`);

    return {
      success: false,
      error: errorMessage,
    };
  }
}

export async function addPinnedComment(
  videoId: string,
  comment: string
): Promise<boolean> {
  const clientId = process.env.YOUTUBE_CLIENT_ID;
  const clientSecret = process.env.YOUTUBE_CLIENT_SECRET;
  const refreshToken = process.env.YOUTUBE_REFRESH_TOKEN;

  if (!clientId || !clientSecret || !refreshToken) {
    logger.warn("YouTube API credentials not configured, skipping comment");
    return false;
  }

  const oauth2Client = new google.auth.OAuth2(clientId, clientSecret);

  oauth2Client.setCredentials({
    refresh_token: refreshToken,
  });

  const youtube = google.youtube({ version: "v3", auth: oauth2Client });

  try {
    logger.info(`Adding pinned comment to video ${videoId}`);

    await youtube.commentThreads.insert({
      part: ["snippet"],
      requestBody: {
        snippet: {
          videoId,
          topLevelComment: {
            snippet: {
              textOriginal: comment,
            },
          },
        },
      },
    });

    logger.info("Successfully added pinned comment");
    return true;
  } catch (error) {
    logger.warn(
      `Failed to add pinned comment: ${error instanceof Error ? error.message : String(error)}`
    );
    return false;
  }
}

export function buildYouTubeMetadata(
  aitaTitle: string,
  postBody: string,
  biblicalSource: string,
  cta: string
): YouTubeMetadata {
  return {
    title: aitaTitle.slice(0, 100),
    description: `${postBody.slice(0, 500)}...

${cta}

Source: ${biblicalSource}

#AITA #biblestories #redditstories #Shorts`,
    tags: [
      "AITA",
      "Am I The Asshole",
      "Reddit Stories",
      "Bible Stories",
      "Family Drama",
      "Story Time",
      "Shorts",
    ],
  };
}
