import * as dotenv from "dotenv";
import * as fs from "fs/promises";
import * as path from "path";
import { generateContent } from "./pipeline/generateContent.js";
import { generateVideo } from "./pipeline/generateVideo.js";
import { postVideo, skipPosting } from "./pipeline/postVideo.js";
import { logger } from "./utils/index.js";
import { ensureDir, saveMetadata } from "./utils/helpers.js";
import type { Story } from "./types/story.js";

// Load environment variables
dotenv.config();

interface PipelineOptions {
  skipPosting?: boolean;
  skipVideo?: boolean;
}

interface PipelineResult {
  id: string;
  storyName: string;
  success: boolean;
  videoPath?: string;
  postResults?: { platform: string; success: boolean; url?: string }[];
  error?: string;
  processingTime: number;
}

async function runPipeline(
  storyName: string,
  options: PipelineOptions = {}
): Promise<PipelineResult> {
  const startTime = Date.now();
  const outputDir = process.env.OUTPUT_DIR || "./output";

  logger.info(`========================================`);
  logger.info(`Starting pipeline for: "${storyName}"`);
  logger.info(`Options: ${JSON.stringify(options)}`);
  logger.info(`========================================`);

  try {
    // Stage 1-2: Generate content
    const content = await generateContent(storyName);

    if (options.skipVideo) {
      // Content-only mode
      logger.info(`[${content.id}] Skipping video generation (content-only mode)`);

      // Save content metadata
      await saveMetadata(outputDir, content.id, {
        id: content.id,
        storyName,
        storyData: content.storyData,
        aitaContent: content.aitaContent,
        mode: "content-only",
        createdAt: new Date().toISOString(),
        processingTime: Date.now() - startTime,
      });

      return {
        id: content.id,
        storyName,
        success: true,
        processingTime: Date.now() - startTime,
      };
    }

    // Stage 3-4: Generate video
    const video = await generateVideo(content);

    // Stage 5: Post to platforms (or skip)
    let postingResult;
    if (options.skipPosting) {
      postingResult = await skipPosting(content.id);
    } else {
      // For posting, we need a public URL. In production, you'd upload to S3 first.
      // For now, we'll use the local path as a placeholder
      const videoUrl = video.videoPath; // Replace with S3 upload in production

      postingResult = await postVideo({
        id: content.id,
        videoPath: video.videoPath,
        videoUrl,
        aitaContent: content.aitaContent,
      });
    }

    // Save complete metadata
    const metadata = {
      id: content.id,
      storyName,
      storyData: content.storyData,
      aitaContent: content.aitaContent,
      videoPath: video.videoPath,
      duration: video.duration,
      postResults: postingResult.results,
      createdAt: new Date().toISOString(),
      processingTime: Date.now() - startTime,
    };

    await saveMetadata(outputDir, content.id, metadata);

    const processingTime = Date.now() - startTime;
    logger.info(`========================================`);
    logger.info(`Pipeline completed for: "${storyName}"`);
    logger.info(`ID: ${content.id}`);
    logger.info(`Processing time: ${(processingTime / 1000).toFixed(1)}s`);
    logger.info(`Video: ${video.videoPath}`);
    logger.info(`Posted to: ${postingResult.successCount}/${postingResult.results.length} platforms`);
    logger.info(`========================================`);

    return {
      id: content.id,
      storyName,
      success: true,
      videoPath: video.videoPath,
      postResults: postingResult.results.map((r) => ({
        platform: r.platform,
        success: r.success,
        url: r.url,
      })),
      processingTime,
    };
  } catch (error) {
    const processingTime = Date.now() - startTime;
    const errorMessage = error instanceof Error ? error.message : String(error);

    logger.error(`========================================`);
    logger.error(`Pipeline FAILED for: "${storyName}"`);
    logger.error(`Error: ${errorMessage}`);
    logger.error(`========================================`);

    return {
      id: "failed",
      storyName,
      success: false,
      error: errorMessage,
      processingTime,
    };
  }
}

async function loadStories(): Promise<Story[]> {
  const storiesPath = path.join(process.cwd(), "data", "stories.json");
  try {
    const data = await fs.readFile(storiesPath, "utf-8");
    return JSON.parse(data) as Story[];
  } catch {
    logger.warn("No stories.json found, using default story");
    return [{ name: "Jacob and Esau", completed: false }];
  }
}

async function getNextStory(): Promise<string | null> {
  const stories = await loadStories();
  const pending = stories.find((s) => !s.completed);
  return pending?.name || null;
}

// CLI interface
async function main() {
  const args = process.argv.slice(2);

  // Parse command line arguments
  let storyName: string | null = null;
  let skipPosting = false;
  let skipVideo = false;

  for (let i = 0; i < args.length; i++) {
    const arg = args[i];
    if (arg === "--skip-posting" || arg === "-sp") {
      skipPosting = true;
    } else if (arg === "--skip-video" || arg === "-sv") {
      skipVideo = true;
    } else if (arg === "--help" || arg === "-h") {
      printHelp();
      return;
    } else if (arg && !arg.startsWith("-")) {
      storyName = arg;
    }
  }

  // If no story specified, get next from queue
  if (!storyName) {
    storyName = await getNextStory();
    if (!storyName) {
      logger.info("No pending stories in queue");
      return;
    }
  }

  // Ensure output directories exist
  const outputDir = process.env.OUTPUT_DIR || "./output";
  await ensureDir(path.join(outputDir, "videos"));
  await ensureDir(path.join(outputDir, "metadata"));

  // Run the pipeline
  const result = await runPipeline(storyName, {
    skipPosting,
    skipVideo,
  });

  if (!result.success) {
    process.exit(1);
  }
}

function printHelp() {
  console.log(`
Bible AITA Content Machine

Usage:
  npm run generate [story-name] [options]

Options:
  --skip-posting, -sp   Generate video but don't post to platforms
  --skip-video, -sv     Generate content only (no video rendering)
  --help, -h            Show this help message

Examples:
  npm run generate "Jacob and Esau"
  npm run generate "Cain and Abel" --skip-posting
  npm run generate --skip-video

If no story name is provided, the next pending story from stories.json will be used.
`);
}

// Export for programmatic use
export { runPipeline, loadStories, getNextStory };

// Run if called directly
main().catch((error) => {
  logger.error("Fatal error:", error);
  process.exit(1);
});
