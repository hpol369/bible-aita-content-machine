import express from "express";
import * as path from "path";
import * as fs from "fs/promises";
import * as dotenv from "dotenv";
import open from "open";
import { fileURLToPath } from "url";
import type { Story } from "../types/story.js";
import { runPipeline } from "../index.js";

dotenv.config();

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const app = express();
const PORT = process.env.DASHBOARD_PORT || 3000;

// Middleware
app.use(express.json());

// API Routes (Must be before static files)

// Get all stories
app.get("/api/stories", async (_req, res) => {
  try {
    const storiesPath = path.join(process.cwd(), "data", "stories.json");
    const data = await fs.readFile(storiesPath, "utf-8");
    const stories: Story[] = JSON.parse(data);
    res.json(stories);
  } catch (error) {
    res.status(500).json({ error: "Failed to load stories" });
  }
});

// Update story status
app.patch("/api/stories/:index", async (req, res) => {
  try {
    const index = parseInt(req.params.index);
    const storiesPath = path.join(process.cwd(), "data", "stories.json");
    const data = await fs.readFile(storiesPath, "utf-8");
    const stories: Story[] = JSON.parse(data);

    if (index >= 0 && index < stories.length) {
      stories[index] = { ...stories[index], ...req.body };
      await fs.writeFile(storiesPath, JSON.stringify(stories, null, 2));
      res.json(stories[index]);
    } else {
      res.status(404).json({ error: "Story not found" });
    }
  } catch (error) {
    res.status(500).json({ error: "Failed to update story" });
  }
});

// Trigger generation
app.post("/api/generate", async (req, res) => {
  const { storyName, skipPosting = true } = req.body;

  if (!storyName) {
    res.status(400).json({ error: "Story name is required" });
    return;
  }

  // Run in background (don't await)
  runPipeline(storyName, { skipPosting, skipVideo: false })
    .then(() => console.log(`[Dashboard] Generation complete for ${storyName}`))
    .catch(err => console.error(`[Dashboard] Generation failed for ${storyName}`, err));

  res.json({ message: "Generation started", storyName });
});

// Get all generated content metadata
app.get("/api/content", async (_req, res) => {
  try {
    const metadataDir = path.join(process.cwd(), "output", "metadata");

    try {
      await fs.access(metadataDir);
    } catch {
      res.json([]);
      return;
    }

    const files = await fs.readdir(metadataDir);
    const jsonFiles = files.filter((f) => f.endsWith(".json"));

    const content = await Promise.all(
      jsonFiles.map(async (file) => {
        const data = await fs.readFile(path.join(metadataDir, file), "utf-8");
        return JSON.parse(data);
      })
    );

    // Sort by creation date, newest first
    content.sort((a, b) =>
      new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );

    res.json(content);
  } catch (error) {
    res.status(500).json({ error: "Failed to load content" });
  }
});

// Get single content by ID
app.get("/api/content/:id", async (req, res) => {
  try {
    const metadataPath = path.join(
      process.cwd(),
      "output",
      "metadata",
      `${req.params.id}.json`
    );
    const data = await fs.readFile(metadataPath, "utf-8");
    res.json(JSON.parse(data));
  } catch (error) {
    res.status(404).json({ error: "Content not found" });
  }
});

// Get list of generated videos
app.get("/api/videos", async (_req, res) => {
  try {
    const videosDir = path.join(process.cwd(), "output", "videos");

    try {
      await fs.access(videosDir);
    } catch {
      res.json([]);
      return;
    }

    const files = await fs.readdir(videosDir);
    const videoFiles = files.filter((f) => f.endsWith(".mp4"));

    const videos = await Promise.all(
      videoFiles.map(async (file) => {
        const stats = await fs.stat(path.join(videosDir, file));
        return {
          id: file.replace(".mp4", ""),
          filename: file,
          path: `/output/videos/${file}`,
          size: stats.size,
          createdAt: stats.birthtime,
        };
      })
    );

    videos.sort((a, b) =>
      new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );

    res.json(videos);
  } catch (error) {
    res.status(500).json({ error: "Failed to load videos" });
  }
});

// Get pipeline status (simple implementation)
app.get("/api/status", async (_req, res) => {
  try {
    const metadataDir = path.join(process.cwd(), "output", "metadata");
    const videosDir = path.join(process.cwd(), "output", "videos");
    const storiesPath = path.join(process.cwd(), "data", "stories.json");

    let contentCount = 0;
    let videoCount = 0;
    let pendingStories = 0;
    let completedStories = 0;

    try {
      const metadataFiles = await fs.readdir(metadataDir);
      contentCount = metadataFiles.filter((f) => f.endsWith(".json")).length;
    } catch { }

    try {
      const videoFiles = await fs.readdir(videosDir);
      videoCount = videoFiles.filter((f) => f.endsWith(".mp4")).length;
    } catch { }

    try {
      const storiesData = await fs.readFile(storiesPath, "utf-8");
      const stories: Story[] = JSON.parse(storiesData);
      pendingStories = stories.filter((s) => !s.completed).length;
      completedStories = stories.filter((s) => s.completed).length;
    } catch { }

    res.json({
      contentGenerated: contentCount,
      videosRendered: videoCount,
      pendingStories,
      completedStories,
      totalStories: pendingStories + completedStories,
    });
  } catch (error) {
    res.status(500).json({ error: "Failed to get status" });
  }
});

// Serve static assets
app.use("/output", express.static(path.join(process.cwd(), "output")));
app.use(express.static(path.join(__dirname, "client", "dist")));

// Serve the React App for any other route (SPA)
app.get("*", (_req, res) => {
  res.sendFile(path.join(__dirname, "client", "dist", "index.html"));
});

// Start server
app.listen(PORT, async () => {
  const url = `http://localhost:${PORT}`;
  console.log(`
┌─────────────────────────────────────────────┐
│                                             │
│   📖 Bible AITA Dashboard                   │
│                                             │
│   Running at: ${url}              │
│                                             │
│   Press Ctrl+C to stop                      │
│                                             │
└─────────────────────────────────────────────┘
`);

  // Open browser automatically
  try {
    if (process.env.NODE_ENV !== 'development') {
      await open(url);
    }
  } catch {
    console.log(`Open ${url} in your browser`);
  }
});
