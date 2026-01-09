import { v4 as uuidv4 } from "uuid";
import { extractStoryFacts } from "../api/gemini.js";
import { generateAITAContent } from "../api/claude.js";
import type { GeminiStoryOutput, AITAContent } from "../types/index.js";
import { logger } from "../utils/index.js";

export interface ContentOutput {
  id: string;
  storyName: string;
  storyData: GeminiStoryOutput;
  aitaContent: AITAContent;
}

export async function generateContent(storyName: string): Promise<ContentOutput> {
  const id = uuidv4();

  logger.info(`[${id}] Starting content generation for: "${storyName}"`);

  // Stage 1: Extract facts from Bible story via Gemini
  logger.info(`[${id}] Stage 1: Extracting story facts via Gemini API`);
  const storyData = await extractStoryFacts(storyName);

  logger.info(`[${id}] Story: ${storyData.source_story}`);
  logger.info(`[${id}] Protagonist: ${storyData.protagonist}`);
  logger.info(`[${id}] Primary emotion: ${storyData.primary_emotion} (intensity: ${storyData.emotion_intensity})`);

  // Stage 2: Generate AITA content via Claude
  logger.info(`[${id}] Stage 2: Generating AITA content via Claude API`);
  const aitaContent = await generateAITAContent(storyData);

  logger.info(`[${id}] Post title: ${aitaContent.post_title}`);
  logger.info(`[${id}] Post length: ${aitaContent.post_body.length} characters`);
  logger.info(`[${id}] Controversy level: ${aitaContent.metadata.controversy_level}`);

  logger.info(`[${id}] Content generation complete`);

  return {
    id,
    storyName,
    storyData,
    aitaContent,
  };
}
