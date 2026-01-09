import { GoogleGenAI } from "@google/genai";
import { GeminiStoryOutputSchema, type GeminiStoryOutput } from "../types/index.js";
import { logger } from "../utils/index.js";
import { extractJsonFromResponse, sleep } from "../utils/helpers.js";

const MAX_RETRIES = 3;
const RETRY_DELAY_MS = 2000;

export async function extractStoryFacts(
  storyName: string
): Promise<GeminiStoryOutput> {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    throw new Error("GEMINI_API_KEY environment variable is not set");
  }

  const ai = new GoogleGenAI({ apiKey });

  const prompt = `You are a Bible scholar and storytelling expert.
Extract the following information from the Bible story "${storyName}".
Return ONLY valid JSON (no markdown, no explanation) matching this exact structure:

{
  "source_story": "Story name with book and chapter reference",
  "protagonist": "Main character name",
  "conflict_core": "One sentence describing the central conflict",
  "raw_facts": {
    "event_1": "First key event in the story",
    "event_2": "Second key event in the story",
    "motive": "The protagonist's motivation"
  },
  "theological_context": "Important theological or cultural context modern readers need",
  "character_profiles": {
    "CharacterName": "Brief personality description"
  },
  "primary_emotion": "One of: betrayal, hope, strength, jealousy, wisdom, conflict, forgiveness, judgment",
  "emotion_intensity": 8
}

Focus on:
- The core conflict and moral dilemma
- Character motivations and personalities
- The primary emotion that drives the story (must be one of the listed options)
- Theological context that modern readers may not know

Return ONLY the JSON object, no other text.`;

  let lastError: Error | null = null;

  for (let attempt = 1; attempt <= MAX_RETRIES; attempt++) {
    try {
      logger.info(`Extracting story facts for "${storyName}" (attempt ${attempt})`);

      const response = await ai.models.generateContent({
        model: "gemini-2.0-flash",
        contents: prompt,
      });

      const text = response.text;
      if (!text) {
        throw new Error("Empty response from Gemini API");
      }

      const jsonStr = extractJsonFromResponse(text);
      const parsed = JSON.parse(jsonStr);
      const validated = GeminiStoryOutputSchema.parse(parsed);

      logger.info(`Successfully extracted facts for "${storyName}"`);
      logger.debug(`Primary emotion: ${validated.primary_emotion}`);

      return validated;
    } catch (error) {
      lastError = error instanceof Error ? error : new Error(String(error));
      logger.warn(
        `Attempt ${attempt} failed for "${storyName}": ${lastError.message}`
      );

      if (attempt < MAX_RETRIES) {
        await sleep(RETRY_DELAY_MS * attempt);
      }
    }
  }

  throw new Error(
    `Failed to extract story facts after ${MAX_RETRIES} attempts: ${lastError?.message}`
  );
}
