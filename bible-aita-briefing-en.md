# Bible AITA Content Machine - Briefing for Claude Code

## Project Overview

We're building a fully automated content machine that creates and posts Bible-related videos daily. We start with **1 format (Bible AITA)** and scale to **10+ formats** later.

**Goal:** 2 unique videos per day, posted to 4 platforms (TikTok, YouTube Shorts, Instagram Reels, Facebook).

---

## The Stack

| Component | Tool | Role |
|-----------|------|------|
| Research & Facts | Gemini API | Bible stories, emotion analysis, theological context |
| Scripting & Polish | Claude API | Writing AITA posts, fake comments, CTAs |
| Voice-over | ElevenLabs API | Audio + word timestamps |
| Footage | Pexels API | Nature footage matched to emotion |
| Video Rendering | Remotion | React-based video composition |
| Posting | Blotato + YouTube API | Multi-platform publishing |

---

## Format 1: Bible AITA

### Concept
Bible stories rewritten as Reddit "Am I The Asshole" posts. The viewer only realizes it's a Bible story at the end.

### Video Structure

```
┌─────────────────────────────────┐
│     REDDIT UI (Dark Mode)       │  ← Top 60%
│  - Title                        │
│  - Username + upvotes           │
│  - Post text (scrolling)        │
│  - Awards popping in            │
├─────────────────────────────────┤
│     NATURE FOOTAGE              │  ← Bottom 40%
│  - Matched to story emotion     │
│  - New clip every 3-5 sec       │
│  - Subtle 10% zoom              │
└─────────────────────────────────┘
│     CAPTIONS (Center)           │
│  - Word-by-word highlight       │
│  - Montserrat Bold              │
│  - White + black outline        │
│  - Gold highlight on active     │
└─────────────────────────────────┘
```

---

## Pipeline Flow

### Step 1: Gemini API - Story & Facts

**Input:** Story name (e.g., "Jacob and Esau")

**Output JSON:**
```json
{
  "source_story": "Jacob and Esau (Genesis 25 & 27)",
  "protagonist": "Jacob",
  "conflict_core": "Stealing the birthright and his blind father's blessing.",
  "raw_facts": {
    "event_1": "Esau comes home starving from the field; Jacob refuses to give food unless Esau sells his inheritance.",
    "event_2": "Mother Rebekah helps Jacob disguise himself as Esau (with goat skin) to deceive the blind Isaac.",
    "motive": "Jacob believed he deserved the spiritual promise more than the carnal Esau."
  },
  "theological_context": "The birthright (bechorah) entitled one to a double portion of inheritance and spiritual leadership.",
  "character_profiles": {
    "Jacob": "Clever, calculating, 'tent dweller', mother's favorite.",
    "Esau": "Impulsive, hunter, lives for the moment, father's favorite.",
    "Isaac": "Old, blind, determined to follow tradition."
  },
  "primary_emotion": "betrayal",
  "emotion_intensity": 8
}
```

### Step 2: Claude API - Write AITA Post

**Input:** Gemini's JSON + prompt

**Prompt for Claude:**
```
You are a Reddit expert and copywriter specializing in viral 'Am I The Asshole' (AITA) stories.

Rules:
- Use modern terms (red flags, gaslighting, inheritance, sibling rivalry)
- Do NOT mention Biblical names in the post (use 'my brother (M25)', 'my father (M70)', etc.)
- Make the tone dramatic and 'entitled', like real Reddit posts
- Also generate 3 fake comments and a pinned reveal comment
- Deliver output in strict JSON format
```

**Output JSON:**
```json
{
  "post_title": "AITA for letting my brother 'sell' his inheritance for a meal and then stealing my father's blessing?",
  "post_body": "Okay, this might sound bad, but hear me out...[FULL POST]",
  "fake_comments": [
    {"user": "judgment_judy_99", "text": "NTA. Your brother knew what he was doing when he ate that soup.", "upvotes": 2341},
    {"user": "family_first_always", "text": "YTA. Deceiving your father on his deathbed is a massive red flag.", "upvotes": 1892},
    {"user": "biblical_scholar", "text": "INFO: Did your mother know this would happen?", "upvotes": 956}
  ],
  "pinned_comment": "This was the story of Jacob and Esau from Genesis 27. Did you figure it out? 🤯",
  "cta": "Drop a 🐍 if you think he was right, or a 🍎 if he was wrong!",
  "metadata": {
    "biblical_source": "Genesis 25-27",
    "characters": ["Jacob", "Esau", "Isaac", "Rebekah"],
    "controversy_level": 8
  }
}
```

### Step 3: ElevenLabs API - Voice-over

**Voice:** Adam or Marcus (deep, storytelling voice)

**Input:** `post_title` + `post_body` from Claude's output

**Output:**
- Audio file (MP3)
- Word timestamps JSON:
```json
{
  "timestamps": [
    {"word": "AITA", "start": 0.1, "end": 0.5},
    {"word": "for", "start": 0.5, "end": 0.65},
    {"word": "letting", "start": 0.65, "end": 0.95}
  ]
}
```

### Step 4: Pexels API - Footage

**Emotion-Visual Mapping:**

| Emotion | Search Tags | Color Tones |
|---------|-------------|-------------|
| Betrayal | storm clouds, dark ocean, heavy rain, mist forest | Cold, blue/grey |
| Hope / Forgiveness | sunrise, golden hour, flower meadow, calm lake | Warm, gold |
| Strength / Judgment | mountain peaks, canyon, waterfall, lightning | Monumental, saturated |
| Jealousy / Drought | desert, cracked earth, sand dunes, dead trees | Desaturated, brown/beige |
| Wisdom / Peace | ancient trees, sunbeams through leaves, starry night | Deep green, dreamy |
| Conflict / Battle | crashing waves, volcano, red sunset, dark mountains | Red/orange, aggressive |

**Logic:**
1. Read `primary_emotion` from Gemini's output
2. Map to search tags
3. Download 10+ clips of 5 seconds each (portrait orientation)
4. Switch clips every 3-5 seconds

### Step 5: Remotion - Video Rendering

**Use the TikTok Captions template as base.**

**Composition structure:**

```typescript
// data.json structure for Remotion
{
  "voiceover_url": "./assets/audio_1.mp3",
  "background_clips": [
    "./assets/nature_1.mp4",
    "./assets/nature_2.mp4",
    "./assets/nature_3.mp4"
  ],
  "reddit_data": {
    "title": "AITA for stealing my brother's blessing?",
    "username": "Jacob_The_Deceiver",
    "upvotes": 4200,
    "awards": ["gold", "wholesome"]
  },
  "timestamps": [
    {"word": "AITA", "start": 0.1, "end": 0.5},
    {"word": "for", "start": 0.5, "end": 0.65}
  ],
  "fake_comments": [...],
  "reveal": {
    "text": "This was Genesis 27",
    "timestamp": 55.0
  }
}
```

**Video specs:**

| Spec | Value |
|------|-------|
| Resolution | 1080x1920 (9:16 portrait) |
| FPS | 30 |
| Length TikTok | 60-80 seconds |
| Length YouTube Shorts | <58 seconds |
| Length Reels | 30-45 seconds |

**Reddit UI specs:**

| Element | Spec |
|---------|------|
| Mode | Dark (#1A1A1B background, #D7DADC text) |
| Font | IBM Plex Sans |
| Upvotes | Odometer animation (0 → 1.5k-5.2k in 10 sec) |
| Awards | Pop in with twinkle sound |

**Caption specs:**

| Element | Spec |
|---------|------|
| Style | Word-by-word with highlight |
| Font | Montserrat Bold |
| Color | White with black outline (2-3px) |
| Highlight | #FFD700 (gold) or #FF4500 (Reddit orange) |
| Position | Center (Y-axis 50%) |

**Audio specs:**

| Layer | Volume |
|-------|--------|
| Voice-over | -6 dB |
| Background music (lo-fi) | -22 to -26 dB |
| SFX (pops, typing, awards) | -12 dB |

**SFX needed:**
- `typing.mp3` - keyboard sound for title (first 3 sec)
- `ui_pop.mp3` - when Reddit header appears
- `award_ding.mp3` - when awards pop
- `upvote_tick.mp3` - subtle tick for upvote counter

### Step 6: Posting via Blotato + YouTube API

**Per video, post to:**
1. TikTok (via Blotato)
2. Instagram Reels (via Blotato)
3. Facebook Reels (via Blotato)
4. YouTube Shorts (via YouTube API)

**Metadata per platform:**

**TikTok:**
```
Caption: "My brother traded his entire inheritance for a meal and now wants to kill me... AITA? 🚩 #redditstories #AITA #bible #family"
```

**YouTube Shorts:**
```
Title: "AITA for stealing my blind father's inheritance? 🥣"
Description: "AITA for stealing my blind father's inheritance with a bowl of soup and a goat skin disguise? The bizarre family story of Jacob and Esau in a modern twist.

#AITA #biblestories #redditstories #familydrama"
```

**Instagram:**
```
Caption: "Revenge, deceit, and a hairy disguise. 🎭 Is this the most toxic family story ever? Give your verdict: ⬇️

#AITA #biblestories #redditstories #familydrama #jacobandesau"
```

**Pinned comment (all platforms):**
```
"Did you realize this was about Jacob and Esau from Genesis? 🤯 Who do you think was wrong?"
```

---

## Directory Structure

```
bible-content-machine/
├── src/
│   ├── api/
│   │   ├── gemini.ts        # Gemini API calls
│   │   ├── claude.ts        # Claude API calls
│   │   ├── elevenlabs.ts    # Voice generation
│   │   ├── pexels.ts        # Footage downloads
│   │   ├── blotato.ts       # Social posting
│   │   └── youtube.ts       # YouTube Shorts API
│   ├── remotion/
│   │   ├── compositions/
│   │   │   └── BibleAITA.tsx    # Main composition
│   │   ├── components/
│   │   │   ├── RedditUI.tsx     # Reddit overlay
│   │   │   ├── Captions.tsx     # Word-by-word captions
│   │   │   ├── NatureBackground.tsx
│   │   │   └── UpvoteCounter.tsx
│   │   └── index.ts
│   ├── pipeline/
│   │   ├── generateContent.ts   # Orchestrates Gemini → Claude
│   │   ├── generateVideo.ts     # Orchestrates audio → video
│   │   └── postVideo.ts         # Handles multi-platform posting
│   └── index.ts                 # Main entry point
├── assets/
│   ├── audio/               # Generated voice-overs
│   ├── footage/             # Downloaded Pexels clips
│   ├── sfx/                 # Sound effects
│   │   ├── typing.mp3
│   │   ├── ui_pop.mp3
│   │   ├── award_ding.mp3
│   │   └── upvote_tick.mp3
│   └── fonts/
│       ├── IBMPlexSans.ttf
│       └── Montserrat-Bold.ttf
├── output/
│   ├── videos/              # Rendered videos
│   └── metadata/            # JSON metadata per video
├── data/
│   ├── stories.json         # Database of Bible stories
│   └── seo-packages.json    # Hashtags and captions per topic
├── package.json
├── remotion.config.ts
└── .env                     # API keys
```

---

## Environment Variables

```env
GEMINI_API_KEY=
ANTHROPIC_API_KEY=
ELEVENLABS_API_KEY=
PEXELS_API_KEY=
BLOTATO_API_KEY=
YOUTUBE_CLIENT_ID=
YOUTUBE_CLIENT_SECRET=
YOUTUBE_REFRESH_TOKEN=
```

---

## Content Database (Starter)

First 10 Bible AITA stories to test with:

| # | Story | Protagonist | Hook | Emotion |
|---|-------|-------------|------|---------|
| 1 | Jacob & Esau | Jacob | "AITA for stealing my brother's inheritance for soup?" | Betrayal |
| 2 | Cain & Abel | Cain | "AITA for being jealous of my brother's offering?" | Jealousy |
| 3 | David & Bathsheba | David | "AITA for sleeping with a married woman and having her husband killed?" | Betrayal |
| 4 | Joseph & Brothers | Joseph | "AITA for sharing my dreams where my family bowed to me?" | Conflict |
| 5 | Abraham & Hagar | Abraham | "AITA for sending my concubine and son into the desert?" | Conflict |
| 6 | Samson & Delilah | Samson | "AITA for telling my secret to my girlfriend?" | Betrayal |
| 7 | Lot & Daughters | Lot | "AITA for offering my daughters to an angry mob?" | Conflict |
| 8 | Rachel & Leah | Rachel | "AITA for being jealous of my sister's children?" | Jealousy |
| 9 | Moses & Pharaoh | Moses | "AITA for sending plagues to an entire nation?" | Strength |
| 10 | Jonah & Nineveh | Jonah | "AITA for being angry that God forgave a city?" | Conflict |

---

## Scheduling

**Daily schedule:**

| Time | Action |
|------|--------|
| 06:00 | Pipeline starts: Gemini fetches story |
| 06:05 | Claude writes AITA post |
| 06:10 | ElevenLabs generates voice-over |
| 06:15 | Pexels downloads footage |
| 06:20 | Remotion renders video 1 |
| 06:40 | Post video 1 to all platforms |
| 12:00 | Repeat for video 2 |
| 12:40 | Post video 2 to all platforms |

**Posting times (optimal for engagement):**
- Video 1: 07:00 (morning scroll)
- Video 2: 18:00 (evening scroll)

---

## Future Formats (After AITA)

This system is built to scale. The following formats use the same pipeline with adjusted Remotion compositions:

| # | Format | Complexity |
|---|--------|------------|
| 2 | Bible Red Flags | Low (same Reddit UI) |
| 3 | Bible Tier Lists | Low (list format) |
| 4 | Bible vs Science | Medium (split screen) |
| 5 | Bible Dark Lore | Medium (dark visuals) |
| 6 | Bible in 60 Seconds | Medium (fast-paced) |
| 7 | Bible Mysteries | Medium (mystery aesthetic) |
| 8 | Greek/Hebrew Word | Low (minimalist) |
| 9 | Bible Prophecies | Medium (news integration) |
| 10 | Bible Stories Animated | High (AI animation) |

---

## Success Metrics

Measure after 30 days:

| Metric | Target |
|--------|--------|
| Videos posted | 60 |
| Average views | 10k+ |
| Engagement rate | 5%+ |
| Follower growth | 1000+ per platform |
| Virals (100k+ views) | 2-3 |

---

## First Test

Start with **Jacob & Esau** story:
1. Generate all assets manually first
2. Test the Remotion composition
3. Post manually to check quality
4. Then automate the entire pipeline

---

## Notes

- **Quality over quantity:** Better 1 perfect video than 2 mediocre ones
- **First hour engagement:** Reply to comments in the first hour
- **A/B test:** Vary hooks and thumbnails
- **Niche authority:** This channel does ONLY Bible AITA, no mixing formats
