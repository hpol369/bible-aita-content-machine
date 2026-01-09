import type { VercelRequest, VercelResponse } from "@vercel/node";

export default function handler(_req: VercelRequest, res: VercelResponse) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, OPTIONS");

  // Return demo stats
  return res.status(200).json({
    contentGenerated: 3,
    videosRendered: 1,
    pendingStories: 7,
    completedStories: 3,
    totalStories: 10,
  });
}
