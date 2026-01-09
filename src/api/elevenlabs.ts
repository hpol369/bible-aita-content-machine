import { ElevenLabsClient } from "elevenlabs";
import * as fs from "fs/promises";
import * as path from "path";
import type { WordTimestamp, VoiceOverResult } from "../types/index.js";
import { logger } from "../utils/index.js";
import { ensureDir } from "../utils/helpers.js";

const DEFAULT_VOICE_ID = "pNInz6obpgDQGcFmaJgB"; // Adam - deep, storytelling voice

export async function generateVoiceOver(
  text: string,
  outputId: string
): Promise<VoiceOverResult> {
  const apiKey = process.env.ELEVENLABS_API_KEY;
  if (!apiKey) {
    throw new Error("ELEVENLABS_API_KEY environment variable is not set");
  }

  const voiceId = process.env.ELEVENLABS_VOICE_ID || DEFAULT_VOICE_ID;
  const assetsDir = process.env.ASSETS_DIR || "./assets";

  const client = new ElevenLabsClient({ apiKey });

  logger.info(`Generating voice-over for output ${outputId}`);

  // Generate audio with timestamps
  const response = await client.textToSpeech.convertWithTimestamps(voiceId, {
    text,
    model_id: "eleven_turbo_v2_5",
    voice_settings: {
      stability: 0.5,
      similarity_boost: 0.75,
      style: 0.5,
      use_speaker_boost: true,
    },
  });

  // Ensure output directory exists
  const audioDir = path.join(assetsDir, "audio");
  await ensureDir(audioDir);

  // Save audio file
  const audioPath = path.join(audioDir, `${outputId}.mp3`);

  // Handle the audio data - it comes as base64
  if (typeof response.audio_base64 === "string") {
    await fs.writeFile(audioPath, Buffer.from(response.audio_base64, "base64"));
  } else {
    throw new Error("Unexpected audio format from ElevenLabs");
  }

  // Extract and aggregate word timestamps
  if (!response.alignment) {
    throw new Error("No alignment data in ElevenLabs response");
  }
  const wordTimestamps = aggregateCharactersToWords(response.alignment as ElevenLabsAlignment);

  const duration =
    wordTimestamps.length > 0
      ? wordTimestamps[wordTimestamps.length - 1]?.end || 0
      : 0;

  logger.info(`Voice-over generated: ${audioPath} (${duration.toFixed(1)}s)`);

  return {
    audioPath,
    timestamps: wordTimestamps,
    duration,
  };
}

interface ElevenLabsAlignment {
  characters: string[];
  character_start_times_seconds: number[];
  character_end_times_seconds: number[];
}

function aggregateCharactersToWords(
  alignment: ElevenLabsAlignment
): WordTimestamp[] {
  const words: WordTimestamp[] = [];
  let currentWord = "";
  let wordStart = 0;

  const { characters, character_start_times_seconds, character_end_times_seconds } =
    alignment;

  for (let i = 0; i < characters.length; i++) {
    const char = characters[i];
    const startTime = character_start_times_seconds[i] ?? 0;
    const endTime = character_end_times_seconds[i] ?? 0;

    if (char === " " || char === "\n" || char === "\r") {
      if (currentWord.length > 0) {
        words.push({
          word: currentWord,
          start: wordStart,
          end: character_start_times_seconds[i - 1] !== undefined
            ? character_end_times_seconds[i - 1] ?? endTime
            : endTime,
        });
        currentWord = "";
      }
    } else {
      if (currentWord.length === 0) {
        wordStart = startTime;
      }
      currentWord += char;
    }
  }

  // Don't forget the last word
  if (currentWord.length > 0) {
    const lastEndTime =
      character_end_times_seconds[characters.length - 1] ?? 0;
    words.push({
      word: currentWord,
      start: wordStart,
      end: lastEndTime,
    });
  }

  return words;
}
