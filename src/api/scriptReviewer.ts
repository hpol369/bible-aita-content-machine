/**
 * Script Reviewer - Internal Quality Control
 * Uses Claude to critically analyze AITA scripts for viral potential
 */

import Anthropic from "@anthropic-ai/sdk";
import type { AITAContent } from "../types/content.js";
import type { ScriptReview, ViralCriteria } from "../types/review.js";

const anthropic = new Anthropic();

const REVIEW_SYSTEM_PROMPT = `You are a ruthless content quality analyst specializing in viral short-form video content. Your job is to critically evaluate "Am I The Asshole" style scripts for TikTok/Reels/Shorts potential.

You must be HARSH and HONEST. A mediocre script that gets approved wastes production resources. Only truly engaging content should pass.

VIRAL SHORT-FORM CONTENT CRITERIA:

1. HOOK STRENGTH (0-10)
- First sentence MUST create instant curiosity or outrage
- "I did X to my Y" format works well
- Avoid generic openings
- 10 = "I can't scroll past this", 5 = "meh", 0 = "boring, skip"

2. EMOTIONAL ENGAGEMENT (0-10)
- Must trigger: outrage, shock, empathy, or "I need to know more"
- Moral dilemmas work best
- Reader should feel something within 3 seconds
- 10 = visceral reaction, 5 = mild interest, 0 = emotionless

3. CONTROVERSY LEVEL (0-10)
- Should split audience 40/60 or 50/50
- Both sides need valid arguments
- Too one-sided = low engagement
- 10 = comments will be a war zone, 5 = some debate, 0 = everyone agrees

4. RELATABILITY (0-10)
- Modern language, no archaic terms
- Situations people recognize from their own lives
- Universal themes (family, jealousy, betrayal, fairness)
- 10 = "this is my family", 5 = "I've heard of this", 0 = "what?"

5. PACING (0-10)
- New information every 2-3 sentences
- Building tension toward climax
- No boring exposition dumps
- 10 = couldn't stop reading, 5 = skimmed parts, 0 = lost interest

6. REVEAL IMPACT (0-10)
- The "this was actually a Bible story" moment
- Should make viewer go "WAIT WHAT"
- Connection should feel clever, not forced
- 10 = mind blown, 5 = "oh, okay", 0 = "who cares"

7. COMMENT BAIT (0-10)
- Does it make people NEED to share their verdict?
- Clear NTA/YTA/ESH decision point
- The CTA should drive engagement
- 10 = already typing my comment, 5 = might comment, 0 = nothing to say

PASS THRESHOLD: 70/100 overall
VIRAL THRESHOLD: 85/100 overall

Be specific in feedback. "The hook is weak" is useless. "The hook buries the conflict - lead with the betrayal, not the backstory" is useful.`;

const REVIEW_PROMPT = `Analyze this AITA script for viral short-form potential. Be critical and specific.

TITLE: {title}

POST:
{body}

TOP COMMENTS:
{comments}

PINNED REVEAL: {pinned}

CTA: {cta}

---

Respond with a JSON object matching this exact structure:
{
  "overallScore": <0-100>,
  "passed": <true if score >= 70>,
  "criteria": {
    "hookStrength": <0-10>,
    "hookFeedback": "<specific feedback>",
    "emotionalEngagement": <0-10>,
    "emotionalFeedback": "<specific feedback>",
    "controversyLevel": <0-10>,
    "controversyFeedback": "<specific feedback>",
    "relatability": <0-10>,
    "relatabilityFeedback": "<specific feedback>",
    "pacing": <0-10>,
    "pacingFeedback": "<specific feedback>",
    "revealImpact": <0-10>,
    "revealFeedback": "<specific feedback>",
    "commentBait": <0-10>,
    "commentBaitFeedback": "<specific feedback>"
  },
  "verdict": "<VIRAL_READY | NEEDS_REVISION | MAJOR_REWRITE>",
  "strengths": ["<strength 1>", "<strength 2>", "<strength 3>"],
  "weaknesses": ["<weakness 1>", "<weakness 2>", "<weakness 3>"],
  "revisionSuggestions": ["<specific actionable suggestion 1>", "<suggestion 2>", "<suggestion 3>"],
  "predictedEngagement": "<LOW | MEDIUM | HIGH | VIRAL>",
  "redFlags": ["<any content policy concerns or issues>"]
}

IMPORTANT: Return ONLY valid JSON, no markdown, no explanation.`;

export async function reviewScript(content: AITAContent): Promise<ScriptReview> {
  const commentsText = content.fake_comments
    .map((c) => `- ${c.user}: "${c.text}" (+${c.upvotes})`)
    .join("\n");

  const prompt = REVIEW_PROMPT
    .replace("{title}", content.post_title)
    .replace("{body}", content.post_body)
    .replace("{comments}", commentsText)
    .replace("{pinned}", content.pinned_comment)
    .replace("{cta}", content.cta);

  const response = await anthropic.messages.create({
    model: "claude-sonnet-4-20250514",
    max_tokens: 2000,
    messages: [
      {
        role: "user",
        content: prompt,
      },
    ],
    system: REVIEW_SYSTEM_PROMPT,
  });

  const textBlock = response.content.find((block) => block.type === "text");
  if (!textBlock || textBlock.type !== "text") {
    throw new Error("No text response from Claude");
  }

  const review: ScriptReview = JSON.parse(textBlock.text);
  review.reviewedAt = new Date().toISOString();

  return review;
}

/**
 * Quick score check without full review
 */
export function calculateQuickScore(criteria: ViralCriteria): number {
  const weights = {
    hookStrength: 0.20,      // 20% - most important
    emotionalEngagement: 0.15,
    controversyLevel: 0.15,
    relatability: 0.10,
    pacing: 0.15,
    revealImpact: 0.10,
    commentBait: 0.15,
  };

  return Math.round(
    criteria.hookStrength * weights.hookStrength * 10 +
    criteria.emotionalEngagement * weights.emotionalEngagement * 10 +
    criteria.controversyLevel * weights.controversyLevel * 10 +
    criteria.relatability * weights.relatability * 10 +
    criteria.pacing * weights.pacing * 10 +
    criteria.revealImpact * weights.revealImpact * 10 +
    criteria.commentBait * weights.commentBait * 10
  );
}

/**
 * Get verdict based on score
 */
export function getVerdict(score: number): "VIRAL_READY" | "NEEDS_REVISION" | "MAJOR_REWRITE" {
  if (score >= 85) return "VIRAL_READY";
  if (score >= 70) return "NEEDS_REVISION";
  return "MAJOR_REWRITE";
}

/**
 * Get engagement prediction based on score
 */
export function predictEngagement(score: number): "LOW" | "MEDIUM" | "HIGH" | "VIRAL" {
  if (score >= 90) return "VIRAL";
  if (score >= 80) return "HIGH";
  if (score >= 65) return "MEDIUM";
  return "LOW";
}
