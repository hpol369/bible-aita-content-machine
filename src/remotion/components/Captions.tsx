import React from "react";
import { useCurrentFrame, useVideoConfig, interpolate } from "remotion";
import type { WordTimestamp } from "../../types/audio.js";

interface CaptionsProps {
  timestamps: WordTimestamp[];
  highlightColor?: string;
}

export const Captions: React.FC<CaptionsProps> = ({
  timestamps,
  highlightColor = "#FFD700",
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const currentTime = frame / fps;

  // Show 4-5 words at a time
  const windowSize = 5;

  // Find the current word index
  const currentWordIndex = timestamps.findIndex(
    (t) => currentTime >= t.start && currentTime < t.end
  );

  if (currentWordIndex === -1 && timestamps.length > 0) {
    // Check if we're past all words or before any
    const lastWord = timestamps[timestamps.length - 1];
    if (lastWord && currentTime >= lastWord.end) {
      // Show last few words
      const startIndex = Math.max(0, timestamps.length - windowSize);
      const visibleWords = timestamps.slice(startIndex);
      return (
        <CaptionDisplay
          words={visibleWords}
          currentWordIndex={-1}
          highlightColor={highlightColor}
          currentTime={currentTime}
        />
      );
    }
    return null;
  }

  const startIndex = Math.max(0, currentWordIndex - Math.floor(windowSize / 2));
  const endIndex = Math.min(timestamps.length, startIndex + windowSize);
  const visibleWords = timestamps.slice(startIndex, endIndex);
  const adjustedCurrentIndex = currentWordIndex - startIndex;

  return (
    <CaptionDisplay
      words={visibleWords}
      currentWordIndex={adjustedCurrentIndex}
      highlightColor={highlightColor}
      currentTime={currentTime}
    />
  );
};

interface CaptionDisplayProps {
  words: WordTimestamp[];
  currentWordIndex: number;
  highlightColor: string;
  currentTime: number;
}

const CaptionDisplay: React.FC<CaptionDisplayProps> = ({
  words,
  currentWordIndex,
  highlightColor,
  currentTime,
}) => {
  return (
    <div
      style={{
        display: "flex",
        flexWrap: "wrap",
        justifyContent: "center",
        alignItems: "center",
        gap: "12px",
        maxWidth: "900px",
        padding: "20px",
      }}
    >
      {words.map((word, i) => {
        const isActive = i === currentWordIndex;
        const isPast = i < currentWordIndex;

        // Calculate progress for the active word
        const progress = isActive
          ? interpolate(currentTime, [word.start, word.end], [0, 1], {
              extrapolateLeft: "clamp",
              extrapolateRight: "clamp",
            })
          : isPast
            ? 1
            : 0;

        return (
          <span
            key={`${word.word}-${i}`}
            style={{
              fontFamily: "Montserrat, sans-serif",
              fontWeight: "bold",
              fontSize: isActive ? 56 : 48,
              color: isActive ? highlightColor : "#FFFFFF",
              textShadow: `
                -3px -3px 0 #000,
                3px -3px 0 #000,
                -3px 3px 0 #000,
                3px 3px 0 #000,
                0 0 20px rgba(0,0,0,0.8)
              `,
              transform: isActive ? "scale(1.1)" : "scale(1)",
              transition: "transform 0.1s ease-out",
              opacity: isPast ? 0.7 : 1,
            }}
          >
            {word.word}
          </span>
        );
      })}
    </div>
  );
};
