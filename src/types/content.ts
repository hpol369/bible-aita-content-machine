import { z } from "zod";

export const FakeCommentSchema = z.object({
  user: z.string(),
  text: z.string(),
  upvotes: z.number(),
});

export type FakeComment = z.infer<typeof FakeCommentSchema>;

export const AITAContentSchema = z.object({
  post_title: z.string().max(150),
  post_body: z.string().min(300).max(3000),
  fake_comments: z.array(FakeCommentSchema).length(3),
  pinned_comment: z.string(),
  cta: z.string(),
  metadata: z.object({
    biblical_source: z.string(),
    characters: z.array(z.string()),
    controversy_level: z.number().min(1).max(10),
  }),
});

export type AITAContent = z.infer<typeof AITAContentSchema>;
