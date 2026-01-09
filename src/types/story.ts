import { z } from "zod";

export const EmotionTypeSchema = z.enum([
  "betrayal",
  "hope",
  "strength",
  "jealousy",
  "wisdom",
  "conflict",
  "forgiveness",
  "judgment",
]);

export type EmotionType = z.infer<typeof EmotionTypeSchema>;

export const GeminiStoryOutputSchema = z.object({
  source_story: z.string(),
  protagonist: z.string(),
  conflict_core: z.string(),
  raw_facts: z.object({
    event_1: z.string(),
    event_2: z.string(),
    motive: z.string(),
  }),
  theological_context: z.string(),
  character_profiles: z.record(z.string()),
  primary_emotion: EmotionTypeSchema,
  emotion_intensity: z.number().min(1).max(10),
});

export type GeminiStoryOutput = z.infer<typeof GeminiStoryOutputSchema>;

export interface Story {
  name: string;
  completed: boolean;
  protagonist?: string;
  hook?: string;
  emotion?: EmotionType;
}
