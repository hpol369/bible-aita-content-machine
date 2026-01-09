import { z } from "zod";
import type { WordTimestamp } from "./audio.js";
import type { FakeComment } from "./content.js";

export const BibleAITAPropsSchema = z.object({
  voiceoverUrl: z.string(),
  backgroundClips: z.array(z.string()),
  redditData: z.object({
    title: z.string(),
    username: z.string(),
    upvotes: z.number(),
    awards: z.array(z.string()),
    postBody: z.string(),
  }),
  timestamps: z.array(
    z.object({
      word: z.string(),
      start: z.number(),
      end: z.number(),
    })
  ),
  fakeComments: z.array(
    z.object({
      user: z.string(),
      text: z.string(),
      upvotes: z.number(),
    })
  ),
  reveal: z.object({
    text: z.string(),
    timestamp: z.number(),
  }),
});

export interface BibleAITAProps {
  voiceoverUrl: string;
  backgroundClips: string[];
  redditData: {
    title: string;
    username: string;
    upvotes: number;
    awards: string[];
    postBody: string;
  };
  timestamps: WordTimestamp[];
  fakeComments: FakeComment[];
  reveal: {
    text: string;
    timestamp: number;
  };
}
