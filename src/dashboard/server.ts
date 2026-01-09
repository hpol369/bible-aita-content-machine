import express from "express";
import * as path from "path";
import * as fs from "fs/promises";
import * as dotenv from "dotenv";
import open from "open";
import { fileURLToPath } from "url";
import type { Story } from "../types/story.js";

dotenv.config();

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const app = express();
const PORT = process.env.DASHBOARD_PORT || 3000;

// Middleware
app.use(express.json());
app.use(express.static(path.join(__dirname, "public")));

// Serve videos and assets
app.use("/output", express.static(path.join(process.cwd(), "output")));
app.use("/assets", express.static(path.join(process.cwd(), "assets")));

// API Routes

// Get all stories
app.get("/api/stories", async (req, res) => {
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

// Get all generated content metadata
app.get("/api/content", async (req, res) => {
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
app.get("/api/videos", async (req, res) => {
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
app.get("/api/status", async (req, res) => {
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
    } catch {}

    try {
      const videoFiles = await fs.readdir(videosDir);
      videoCount = videoFiles.filter((f) => f.endsWith(".mp4")).length;
    } catch {}

    try {
      const storiesData = await fs.readFile(storiesPath, "utf-8");
      const stories: Story[] = JSON.parse(storiesData);
      pendingStories = stories.filter((s) => !s.completed).length;
      completedStories = stories.filter((s) => s.completed).length;
    } catch {}

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

// Serve the dashboard HTML for all other routes
app.get("*", (req, res) => {
  res.send(getDashboardHTML());
});

function getDashboardHTML(): string {
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Bible AITA - Content Dashboard</title>
  <style>
    :root {
      --bg-primary: #0f0f0f;
      --bg-secondary: #1a1a1b;
      --bg-tertiary: #272729;
      --text-primary: #d7dadc;
      --text-secondary: #818384;
      --accent: #ff4500;
      --accent-hover: #ff5722;
      --success: #46d160;
      --warning: #ffd700;
      --error: #ff4444;
    }

    * {
      margin: 0;
      padding: 0;
      box-sizing: border-box;
    }

    body {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
      background: var(--bg-primary);
      color: var(--text-primary);
      min-height: 100vh;
    }

    .header {
      background: var(--bg-secondary);
      border-bottom: 1px solid var(--bg-tertiary);
      padding: 16px 24px;
      display: flex;
      align-items: center;
      justify-content: space-between;
    }

    .logo {
      display: flex;
      align-items: center;
      gap: 12px;
      font-size: 20px;
      font-weight: bold;
    }

    .logo-icon {
      width: 36px;
      height: 36px;
      background: var(--accent);
      border-radius: 8px;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 18px;
    }

    .nav {
      display: flex;
      gap: 8px;
    }

    .nav-btn {
      background: transparent;
      border: none;
      color: var(--text-secondary);
      padding: 8px 16px;
      border-radius: 20px;
      cursor: pointer;
      font-size: 14px;
      transition: all 0.2s;
    }

    .nav-btn:hover, .nav-btn.active {
      background: var(--bg-tertiary);
      color: var(--text-primary);
    }

    .container {
      max-width: 1400px;
      margin: 0 auto;
      padding: 24px;
    }

    .stats-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
      gap: 16px;
      margin-bottom: 32px;
    }

    .stat-card {
      background: var(--bg-secondary);
      border-radius: 12px;
      padding: 20px;
      border: 1px solid var(--bg-tertiary);
    }

    .stat-label {
      color: var(--text-secondary);
      font-size: 13px;
      margin-bottom: 8px;
    }

    .stat-value {
      font-size: 32px;
      font-weight: bold;
    }

    .stat-value.accent { color: var(--accent); }
    .stat-value.success { color: var(--success); }
    .stat-value.warning { color: var(--warning); }

    .section {
      margin-bottom: 32px;
    }

    .section-header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      margin-bottom: 16px;
    }

    .section-title {
      font-size: 18px;
      font-weight: 600;
    }

    .card-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
      gap: 16px;
    }

    .content-card {
      background: var(--bg-secondary);
      border-radius: 12px;
      overflow: hidden;
      border: 1px solid var(--bg-tertiary);
      transition: transform 0.2s, box-shadow 0.2s;
    }

    .content-card:hover {
      transform: translateY(-2px);
      box-shadow: 0 8px 24px rgba(0,0,0,0.3);
    }

    .card-video {
      width: 100%;
      aspect-ratio: 9/16;
      max-height: 300px;
      object-fit: cover;
      background: var(--bg-tertiary);
    }

    .card-body {
      padding: 16px;
    }

    .card-title {
      font-size: 14px;
      font-weight: 600;
      margin-bottom: 8px;
      line-height: 1.4;
      display: -webkit-box;
      -webkit-line-clamp: 2;
      -webkit-box-orient: vertical;
      overflow: hidden;
    }

    .card-meta {
      display: flex;
      gap: 12px;
      color: var(--text-secondary);
      font-size: 12px;
    }

    .card-meta span {
      display: flex;
      align-items: center;
      gap: 4px;
    }

    .story-list {
      background: var(--bg-secondary);
      border-radius: 12px;
      border: 1px solid var(--bg-tertiary);
      overflow: hidden;
    }

    .story-item {
      display: flex;
      align-items: center;
      padding: 16px;
      border-bottom: 1px solid var(--bg-tertiary);
      gap: 16px;
    }

    .story-item:last-child {
      border-bottom: none;
    }

    .story-status {
      width: 12px;
      height: 12px;
      border-radius: 50%;
      flex-shrink: 0;
    }

    .story-status.pending { background: var(--text-secondary); }
    .story-status.completed { background: var(--success); }

    .story-info {
      flex: 1;
    }

    .story-name {
      font-weight: 500;
      margin-bottom: 4px;
    }

    .story-hook {
      font-size: 13px;
      color: var(--text-secondary);
    }

    .story-emotion {
      font-size: 12px;
      padding: 4px 10px;
      border-radius: 12px;
      background: var(--bg-tertiary);
      color: var(--text-secondary);
    }

    .btn {
      background: var(--accent);
      color: white;
      border: none;
      padding: 10px 20px;
      border-radius: 20px;
      cursor: pointer;
      font-size: 14px;
      font-weight: 500;
      transition: background 0.2s;
    }

    .btn:hover {
      background: var(--accent-hover);
    }

    .btn-secondary {
      background: var(--bg-tertiary);
      color: var(--text-primary);
    }

    .btn-secondary:hover {
      background: #3a3a3c;
    }

    .empty-state {
      text-align: center;
      padding: 48px;
      color: var(--text-secondary);
    }

    .empty-state-icon {
      font-size: 48px;
      margin-bottom: 16px;
    }

    .modal {
      display: none;
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background: rgba(0,0,0,0.8);
      z-index: 1000;
      align-items: center;
      justify-content: center;
    }

    .modal.active {
      display: flex;
    }

    .modal-content {
      background: var(--bg-secondary);
      border-radius: 16px;
      max-width: 900px;
      max-height: 90vh;
      overflow: auto;
      position: relative;
    }

    .modal-close {
      position: absolute;
      top: 16px;
      right: 16px;
      background: var(--bg-tertiary);
      border: none;
      color: var(--text-primary);
      width: 32px;
      height: 32px;
      border-radius: 50%;
      cursor: pointer;
      font-size: 18px;
    }

    .modal-video {
      width: 100%;
      max-height: 70vh;
    }

    .modal-body {
      padding: 24px;
    }

    .post-preview {
      background: var(--bg-tertiary);
      border-radius: 8px;
      padding: 16px;
      margin-top: 16px;
      font-size: 14px;
      line-height: 1.6;
      max-height: 200px;
      overflow-y: auto;
    }

    .tab-content {
      display: none;
    }

    .tab-content.active {
      display: block;
    }

    @keyframes pulse {
      0%, 100% { opacity: 1; }
      50% { opacity: 0.5; }
    }

    .loading {
      animation: pulse 1.5s infinite;
    }
  </style>
</head>
<body>
  <header class="header">
    <div class="logo">
      <div class="logo-icon">📖</div>
      <span>Bible AITA Dashboard</span>
    </div>
    <nav class="nav">
      <button class="nav-btn active" data-tab="overview">Overview</button>
      <button class="nav-btn" data-tab="content">Content</button>
      <button class="nav-btn" data-tab="stories">Stories</button>
    </nav>
  </header>

  <div class="container">
    <!-- Overview Tab -->
    <div id="overview" class="tab-content active">
      <div class="stats-grid">
        <div class="stat-card">
          <div class="stat-label">Videos Generated</div>
          <div class="stat-value accent" id="stat-videos">-</div>
        </div>
        <div class="stat-card">
          <div class="stat-label">Content Pieces</div>
          <div class="stat-value" id="stat-content">-</div>
        </div>
        <div class="stat-card">
          <div class="stat-label">Pending Stories</div>
          <div class="stat-value warning" id="stat-pending">-</div>
        </div>
        <div class="stat-card">
          <div class="stat-label">Completed Stories</div>
          <div class="stat-value success" id="stat-completed">-</div>
        </div>
      </div>

      <div class="section">
        <div class="section-header">
          <h2 class="section-title">Recent Content</h2>
        </div>
        <div class="card-grid" id="recent-content">
          <div class="empty-state loading">Loading...</div>
        </div>
      </div>
    </div>

    <!-- Content Tab -->
    <div id="content" class="tab-content">
      <div class="section">
        <div class="section-header">
          <h2 class="section-title">All Generated Content</h2>
        </div>
        <div class="card-grid" id="all-content">
          <div class="empty-state loading">Loading...</div>
        </div>
      </div>
    </div>

    <!-- Stories Tab -->
    <div id="stories" class="tab-content">
      <div class="section">
        <div class="section-header">
          <h2 class="section-title">Story Queue</h2>
        </div>
        <div class="story-list" id="story-list">
          <div class="empty-state loading">Loading...</div>
        </div>
      </div>
    </div>
  </div>

  <!-- Video Modal -->
  <div class="modal" id="video-modal">
    <div class="modal-content">
      <button class="modal-close" onclick="closeModal()">&times;</button>
      <video class="modal-video" id="modal-video" controls></video>
      <div class="modal-body">
        <h3 id="modal-title"></h3>
        <div class="card-meta" style="margin: 12px 0;">
          <span id="modal-meta"></span>
        </div>
        <h4 style="margin-top: 16px; margin-bottom: 8px;">Post Content</h4>
        <div class="post-preview" id="modal-body"></div>
      </div>
    </div>
  </div>

  <script>
    // Tab navigation
    document.querySelectorAll('.nav-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        document.querySelectorAll('.nav-btn').forEach(b => b.classList.remove('active'));
        document.querySelectorAll('.tab-content').forEach(t => t.classList.remove('active'));
        btn.classList.add('active');
        document.getElementById(btn.dataset.tab).classList.add('active');
      });
    });

    // Load data
    async function loadDashboard() {
      try {
        // Load status
        const status = await fetch('/api/status').then(r => r.json());
        document.getElementById('stat-videos').textContent = status.videosRendered;
        document.getElementById('stat-content').textContent = status.contentGenerated;
        document.getElementById('stat-pending').textContent = status.pendingStories;
        document.getElementById('stat-completed').textContent = status.completedStories;

        // Load content
        const content = await fetch('/api/content').then(r => r.json());
        renderContent(content.slice(0, 6), 'recent-content');
        renderContent(content, 'all-content');

        // Load stories
        const stories = await fetch('/api/stories').then(r => r.json());
        renderStories(stories);
      } catch (error) {
        console.error('Failed to load dashboard:', error);
      }
    }

    function renderContent(items, containerId) {
      const container = document.getElementById(containerId);

      if (items.length === 0) {
        container.innerHTML = \`
          <div class="empty-state">
            <div class="empty-state-icon">📹</div>
            <p>No content generated yet</p>
            <p style="margin-top: 8px; font-size: 13px;">Run: npm run generate "Jacob and Esau"</p>
          </div>
        \`;
        return;
      }

      container.innerHTML = items.map(item => \`
        <div class="content-card" onclick="openModal('\${item.id}')">
          \${item.videoPath ? \`
            <video class="card-video" src="/output/videos/\${item.id}.mp4" muted></video>
          \` : \`
            <div class="card-video" style="display:flex;align-items:center;justify-content:center;font-size:48px;">📝</div>
          \`}
          <div class="card-body">
            <div class="card-title">\${item.aitaContent?.post_title || item.storyName}</div>
            <div class="card-meta">
              <span>📖 \${item.storyName}</span>
              <span>⏱️ \${item.duration ? Math.round(item.duration) + 's' : 'N/A'}</span>
              <span>😤 \${item.storyData?.primary_emotion || 'N/A'}</span>
            </div>
          </div>
        </div>
      \`).join('');
    }

    function renderStories(stories) {
      const container = document.getElementById('story-list');

      container.innerHTML = stories.map((story, index) => \`
        <div class="story-item">
          <div class="story-status \${story.completed ? 'completed' : 'pending'}"></div>
          <div class="story-info">
            <div class="story-name">\${story.name}</div>
            <div class="story-hook">\${story.hook || 'No hook defined'}</div>
          </div>
          <div class="story-emotion">\${story.emotion || 'N/A'}</div>
        </div>
      \`).join('');
    }

    let currentContent = null;

    async function openModal(id) {
      try {
        currentContent = await fetch(\`/api/content/\${id}\`).then(r => r.json());

        const modal = document.getElementById('video-modal');
        const video = document.getElementById('modal-video');
        const title = document.getElementById('modal-title');
        const meta = document.getElementById('modal-meta');
        const body = document.getElementById('modal-body');

        if (currentContent.videoPath) {
          video.src = \`/output/videos/\${id}.mp4\`;
          video.style.display = 'block';
        } else {
          video.style.display = 'none';
        }

        title.textContent = currentContent.aitaContent?.post_title || currentContent.storyName;
        meta.textContent = \`\${currentContent.storyName} • \${currentContent.storyData?.primary_emotion || ''} • \${new Date(currentContent.createdAt).toLocaleDateString()}\`;
        body.textContent = currentContent.aitaContent?.post_body || 'No content available';

        modal.classList.add('active');
      } catch (error) {
        console.error('Failed to load content:', error);
      }
    }

    function closeModal() {
      const modal = document.getElementById('video-modal');
      const video = document.getElementById('modal-video');
      modal.classList.remove('active');
      video.pause();
      video.src = '';
    }

    // Close modal on outside click
    document.getElementById('video-modal').addEventListener('click', (e) => {
      if (e.target.classList.contains('modal')) {
        closeModal();
      }
    });

    // Close modal on escape
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') closeModal();
    });

    // Initial load
    loadDashboard();

    // Refresh every 30 seconds
    setInterval(loadDashboard, 30000);
  </script>
</body>
</html>`;
}

// Start server
app.listen(PORT, async () => {
  const url = \`http://localhost:\${PORT}\`;
  console.log(\`
┌─────────────────────────────────────────────┐
│                                             │
│   📖 Bible AITA Dashboard                   │
│                                             │
│   Running at: \${url}              │
│                                             │
│   Press Ctrl+C to stop                      │
│                                             │
└─────────────────────────────────────────────┘
\`);

  // Open browser automatically
  try {
    await open(url);
  } catch {
    console.log(\`Open \${url} in your browser\`);
  }
});
