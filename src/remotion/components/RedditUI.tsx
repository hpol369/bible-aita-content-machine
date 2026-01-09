import React from "react";
import {
  useCurrentFrame,
  useVideoConfig,
  interpolate,
  Sequence,
} from "remotion";
import { UpvoteCounter } from "./UpvoteCounter.js";
import { AwardBadge } from "./AwardBadge.js";
import type { WordTimestamp } from "../../types/audio.js";
import type { FakeComment } from "../../types/content.js";

interface RedditUIProps {
  title: string;
  username: string;
  upvotes: number;
  awards: string[];
  postBody: string;
  timestamps: WordTimestamp[];
  fakeComments: FakeComment[];
  revealFrame: number;
  revealText: string;
}

export const RedditUI: React.FC<RedditUIProps> = ({
  title,
  username,
  upvotes,
  awards,
  postBody,
  timestamps,
  fakeComments,
  revealFrame,
  revealText,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Typing animation for title (first 2 seconds)
  const titleProgress = interpolate(frame, [0, fps * 2], [0, 1], {
    extrapolateRight: "clamp",
  });
  const visibleTitleLength = Math.floor(title.length * titleProgress);

  // Generate visible post body from timestamps (synced with voice-over)
  const currentTime = frame / fps;
  const spokenWords = timestamps
    .filter((t) => t.end <= currentTime)
    .map((t) => t.word)
    .join(" ");

  // Use the spoken words if available, otherwise show post body progressively
  const visibleBody = spokenWords || postBody.slice(0, Math.floor(postBody.length * (frame / (fps * 60))));

  return (
    <div
      style={{
        backgroundColor: "#1A1A1B",
        height: "100%",
        padding: "40px",
        fontFamily: "'IBM Plex Sans', -apple-system, BlinkMacSystemFont, sans-serif",
        color: "#D7DADC",
        overflow: "hidden",
        display: "flex",
        flexDirection: "column",
      }}
    >
      {/* Subreddit Header */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          marginBottom: 24,
        }}
      >
        <div
          style={{
            width: 48,
            height: 48,
            borderRadius: "50%",
            backgroundColor: "#FF4500",
            marginRight: 16,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: 24,
          }}
        >
          🤔
        </div>
        <div>
          <span
            style={{
              fontSize: 20,
              fontWeight: "bold",
              color: "#FFFFFF",
            }}
          >
            r/AmItheAsshole
          </span>
          <div style={{ fontSize: 14, color: "#818384" }}>
            Posted by u/{username}
          </div>
        </div>
      </div>

      {/* Post Title with typing effect */}
      <h1
        style={{
          fontSize: 32,
          fontWeight: "bold",
          marginBottom: 20,
          lineHeight: 1.3,
          color: "#FFFFFF",
        }}
      >
        {title.slice(0, visibleTitleLength)}
        {titleProgress < 1 && (
          <span style={{ opacity: frame % 30 < 15 ? 1 : 0 }}>|</span>
        )}
      </h1>

      {/* Upvotes and Awards */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          marginBottom: 24,
          gap: 16,
        }}
      >
        <UpvoteCounter targetCount={upvotes} duration={fps * 10} />

        <div style={{ display: "flex", gap: 8 }}>
          {awards.map((award, i) => (
            <Sequence key={award} from={fps * (3 + i * 2)}>
              <AwardBadge type={award} />
            </Sequence>
          ))}
        </div>
      </div>

      {/* Post Body - Scrolling Text */}
      <div
        style={{
          flex: 1,
          overflow: "hidden",
          position: "relative",
        }}
      >
        <div
          style={{
            fontSize: 24,
            lineHeight: 1.7,
            color: "#D7DADC",
            maxHeight: "100%",
            overflow: "hidden",
          }}
        >
          {visibleBody}
        </div>

        {/* Fade out gradient at bottom */}
        <div
          style={{
            position: "absolute",
            bottom: 0,
            left: 0,
            right: 0,
            height: 80,
            background: "linear-gradient(transparent, #1A1A1B)",
            pointerEvents: "none",
          }}
        />
      </div>

      {/* Reveal Section */}
      {frame >= revealFrame && (
        <Sequence from={revealFrame}>
          <RevealComment text={revealText} />
        </Sequence>
      )}
    </div>
  );
};

const RevealComment: React.FC<{ text: string }> = ({ text }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const opacity = interpolate(frame, [0, fps * 0.5], [0, 1], {
    extrapolateRight: "clamp",
  });

  const translateY = interpolate(frame, [0, fps * 0.5], [20, 0], {
    extrapolateRight: "clamp",
  });

  return (
    <div
      style={{
        marginTop: 24,
        padding: 24,
        backgroundColor: "#272729",
        borderRadius: 12,
        borderLeft: "4px solid #FF4500",
        opacity,
        transform: `translateY(${translateY}px)`,
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 8,
          marginBottom: 12,
        }}
      >
        <span
          style={{
            backgroundColor: "#FF4500",
            color: "#FFFFFF",
            padding: "4px 8px",
            borderRadius: 4,
            fontSize: 12,
            fontWeight: "bold",
          }}
        >
          PINNED BY MODERATORS
        </span>
      </div>
      <p
        style={{
          fontSize: 22,
          lineHeight: 1.5,
          color: "#FFFFFF",
          margin: 0,
        }}
      >
        {text}
      </p>
    </div>
  );
};
