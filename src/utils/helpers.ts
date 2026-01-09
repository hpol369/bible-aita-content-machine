import * as fs from "fs/promises";
import * as path from "path";

export function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export async function ensureDir(dirPath: string): Promise<void> {
  try {
    await fs.access(dirPath);
  } catch {
    await fs.mkdir(dirPath, { recursive: true });
  }
}

export function generateUsername(protagonist: string): string {
  const suffixes = ["_throwaway", "_2024", "_anon", "_drama", "_truth", "_real"];
  const suffix = suffixes[Math.floor(Math.random() * suffixes.length)];
  const cleanName = protagonist.toLowerCase().replace(/\s+/g, "_");
  return `${cleanName}${suffix}`;
}

export function formatUpvoteCount(n: number): string {
  if (n >= 1000) {
    return `${(n / 1000).toFixed(1)}k`;
  }
  return n.toString();
}

export function getRandomInt(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

export async function saveMetadata(
  outputDir: string,
  id: string,
  data: Record<string, unknown>
): Promise<string> {
  const metadataDir = path.join(outputDir, "metadata");
  await ensureDir(metadataDir);
  const filePath = path.join(metadataDir, `${id}.json`);
  await fs.writeFile(filePath, JSON.stringify(data, null, 2));
  return filePath;
}

export function extractJsonFromResponse(text: string): string {
  // Try to extract JSON from markdown code blocks
  const jsonMatch = text.match(/```(?:json)?\s*([\s\S]*?)```/);
  if (jsonMatch?.[1]) {
    return jsonMatch[1].trim();
  }

  // Try to find raw JSON object
  const objectMatch = text.match(/\{[\s\S]*\}/);
  if (objectMatch?.[0]) {
    return objectMatch[0];
  }

  return text;
}
