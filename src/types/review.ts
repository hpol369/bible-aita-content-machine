/**
 * Script Review Types
 * Quality scoring system for viral short-form content
 */

export interface ViralCriteria {
  // Hook strength (0-10): Does the first line grab attention?
  hookStrength: number;
  hookFeedback: string;

  // Emotional engagement (0-10): Does it trigger strong emotions?
  emotionalEngagement: number;
  emotionalFeedback: string;

  // Controversy level (0-10): Will people argue in comments?
  controversyLevel: number;
  controversyFeedback: string;

  // Relatability (0-10): Can modern audiences connect?
  relatability: number;
  relatabilityFeedback: string;

  // Pacing (0-10): Does it maintain attention throughout?
  pacing: number;
  pacingFeedback: string;

  // Reveal impact (0-10): Is the Bible story reveal satisfying?
  revealImpact: number;
  revealFeedback: string;

  // Comment bait (0-10): Will people want to share their verdict?
  commentBait: number;
  commentBaitFeedback: string;
}

export interface ScriptReview {
  // Overall score (0-100)
  overallScore: number;

  // Pass/fail threshold (default 70)
  passed: boolean;

  // Individual criteria scores
  criteria: ViralCriteria;

  // Summary verdict
  verdict: "VIRAL_READY" | "NEEDS_REVISION" | "MAJOR_REWRITE";

  // Top 3 strengths
  strengths: string[];

  // Top 3 weaknesses to fix
  weaknesses: string[];

  // Specific revision suggestions
  revisionSuggestions: string[];

  // Predicted engagement level
  predictedEngagement: "LOW" | "MEDIUM" | "HIGH" | "VIRAL";

  // Red flags (anything that could get the video flagged/removed)
  redFlags: string[];

  // Timestamp of review
  reviewedAt: string;
}

export interface ReviewedContent {
  id: string;
  storyName: string;
  aitaContent: {
    post_title: string;
    post_body: string;
    fake_comments: Array<{ user: string; text: string; upvotes: number }>;
    pinned_comment: string;
    cta: string;
  };
  review: ScriptReview;
  status: "pending_review" | "approved" | "needs_revision" | "rejected";
}
