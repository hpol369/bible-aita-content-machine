import Anthropic from "@anthropic-ai/sdk";
import { AITAContentSchema, type AITAContent } from "../types/index.js";
import type { GeminiStoryOutput } from "../types/index.js";
import { logger } from "../utils/index.js";
import { extractJsonFromResponse, sleep } from "../utils/helpers.js";

const MAX_RETRIES = 3;
const RETRY_DELAY_MS = 2000;

const SYSTEM_PROMPT = `You are a Reddit expert and copywriter specializing in viral 'Am I The Asshole' (AITA) stories.

Rules:
- Use modern terms (red flags, gaslighting, inheritance, sibling rivalry, toxic, boundaries, etc.)
- Do NOT mention Biblical names in the post (use 'my brother (M25)', 'my father (M70)', 'my mother (F65)', etc.)
- Make the tone dramatic and 'entitled', like real Reddit posts
- The post should be 500-800 words for a 60-80 second read
- Include specific details that make it feel real
- Generate 3 fake comments with realistic Reddit usernames
- Include a pinned reveal comment that identifies the Bible story
- The controversy level should reflect how divisive this story would be on Reddit
- Include a call-to-action (CTA) asking viewers to vote/comment

Return ONLY valid JSON, no markdown code blocks or explanation.`;

export async function generateAITAContent(
  storyData: GeminiStoryOutput
): Promise<AITAContent> {
  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) {
    throw new Error("ANTHROPIC_API_KEY environment variable is not set");
  }

  const client = new Anthropic({ apiKey });

  const userPrompt = `Based on this Bible story data, write an AITA post:

Source Story: ${storyData.source_story}
Protagonist: ${storyData.protagonist}
Conflict: ${storyData.conflict_core}

Key Events:
- ${storyData.raw_facts.event_1}
- ${storyData.raw_facts.event_2}

Protagonist's Motive: ${storyData.raw_facts.motive}

Character Profiles:
${Object.entries(storyData.character_profiles)
  .map(([name, desc]) => `- ${name}: ${desc}`)
  .join("\n")}

Theological Context: ${storyData.theological_context}

Primary Emotion: ${storyData.primary_emotion} (intensity: ${storyData.emotion_intensity}/10)

Return ONLY a JSON object with this exact structure:
{
  "post_title": "AITA for [action]? (max 150 chars)",
  "post_body": "Full Reddit post (500-800 words)",
  "fake_comments": [
    {"user": "username1", "text": "Comment text", "upvotes": 1234},
    {"user": "username2", "text": "Comment text", "upvotes": 567},
    {"user": "username3", "text": "Comment text", "upvotes": 890}
  ],
  "pinned_comment": "Reveal comment identifying the Bible story",
  "cta": "Call-to-action for viewers",
  "metadata": {
    "biblical_source": "${storyData.source_story}",
    "characters": ["list", "of", "characters"],
    "controversy_level": 8
  }
}`;

  let lastError: Error | null = null;

  for (let attempt = 1; attempt <= MAX_RETRIES; attempt++) {
    try {
      logger.info(
        `Generating AITA content for "${storyData.protagonist}" (attempt ${attempt})`
      );

      const response = await client.messages.create({
        model: "claude-sonnet-4-20250514",
        max_tokens: 4096,
        system: SYSTEM_PROMPT,
        messages: [
          {
            role: "user",
            content: userPrompt,
          },
        ],
      });

      const textBlock = response.content.find((block) => block.type === "text");
      if (!textBlock || textBlock.type !== "text") {
        throw new Error("No text content in Claude response");
      }

      const jsonStr = extractJsonFromResponse(textBlock.text);
      const parsed = JSON.parse(jsonStr);
      const validated = AITAContentSchema.parse(parsed);

      logger.info(`Successfully generated AITA content`);
      logger.debug(`Post title: ${validated.post_title}`);

      return validated;
    } catch (error) {
      lastError = error instanceof Error ? error : new Error(String(error));
      logger.warn(`Attempt ${attempt} failed: ${lastError.message}`);

      if (attempt < MAX_RETRIES) {
        await sleep(RETRY_DELAY_MS * attempt);
      }
    }
  }

  throw new Error(
    `Failed to generate AITA content after ${MAX_RETRIES} attempts: ${lastError?.message}`
  );
}
