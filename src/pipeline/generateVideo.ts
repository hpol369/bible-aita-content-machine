import * as path from "path";
import { bundle } from "@remotion/bundler";
import { renderMedia, selectComposition } from "@remotion/renderer";
import { generateVoiceOver } from "../api/elevenlabs.js";
import { downloadFootage } from "../api/pexels.js";
import type { ContentOutput } from "./generateContent.js";
import type { BibleAITAProps } from "../types/remotion.js";
import { logger } from "../utils/index.js";
import { ensureDir, generateUsername, getRandomInt } from "../utils/helpers.js";

export interface VideoOutput {
  videoPath: string;
  duration: number;
  props: BibleAITAProps;
}

export async function generateVideo(content: ContentOutput): Promise<VideoOutput> {
  const { id, storyData, aitaContent } = content;
  const outputDir = process.env.OUTPUT_DIR || "./output";

  logger.info(`[${id}] Starting video generation`);

  // Stage 3A & 3B: Run voice-over and footage download in parallel
  logger.info(`[${id}] Stage 3: Generating voice-over and downloading footage (parallel)`);

  const voiceText = `${aitaContent.post_title}\n\n${aitaContent.post_body}`;

  const [voiceOver, footage] = await Promise.all([
    generateVoiceOver(voiceText, id),
    downloadFootage(storyData.primary_emotion, id, 10),
  ]);

  logger.info(`[${id}] Voice-over duration: ${voiceOver.duration.toFixed(1)}s`);
  logger.info(`[${id}] Downloaded ${footage.clips.length} footage clips`);

  // Prepare Remotion props
  const props: BibleAITAProps = {
    voiceoverUrl: voiceOver.audioPath,
    backgroundClips: footage.clips,
    redditData: {
      title: aitaContent.post_title,
      username: generateUsername(storyData.protagonist),
      upvotes: getRandomInt(1500, 5200),
      awards: ["gold", "wholesome"],
      postBody: aitaContent.post_body,
    },
    timestamps: voiceOver.timestamps,
    fakeComments: aitaContent.fake_comments,
    reveal: {
      text: aitaContent.pinned_comment,
      timestamp: voiceOver.duration - 5, // Show reveal 5 seconds before end
    },
  };

  // Stage 4: Render video via Remotion
  logger.info(`[${id}] Stage 4: Rendering video via Remotion`);

  // Ensure output directory exists
  const videosDir = path.join(outputDir, "videos");
  await ensureDir(videosDir);

  // Bundle the Remotion project
  const bundleLocation = await bundle({
    entryPoint: path.resolve("./src/remotion/index.ts"),
    webpackOverride: (config) => config,
  });

  // Select the composition
  const composition = await selectComposition({
    serveUrl: bundleLocation,
    id: "BibleAITA",
    inputProps: props as unknown as Record<string, unknown>,
  });

  const outputPath = path.join(videosDir, `${id}.mp4`);

  // Render the video
  await renderMedia({
    composition,
    serveUrl: bundleLocation,
    codec: "h264",
    outputLocation: outputPath,
    inputProps: props as unknown as Record<string, unknown>,
  });

  logger.info(`[${id}] Video rendered: ${outputPath}`);

  return {
    videoPath: outputPath,
    duration: voiceOver.duration,
    props,
  };
}
