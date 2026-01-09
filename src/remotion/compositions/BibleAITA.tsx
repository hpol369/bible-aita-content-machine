import React from "react";
import {
  AbsoluteFill,
  Audio,
  useCurrentFrame,
  useVideoConfig,
  staticFile,
} from "remotion";
import { NatureBackground } from "../components/NatureBackground.js";
import { RedditUI } from "../components/RedditUI.js";
import { Captions } from "../components/Captions.js";
import type { BibleAITAProps } from "../../types/remotion.js";

export const BibleAITA: React.FC<BibleAITAProps> = ({
  voiceoverUrl,
  backgroundClips,
  redditData,
  timestamps,
  fakeComments,
  reveal,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const revealFrame = Math.floor(reveal.timestamp * fps);

  return (
    <AbsoluteFill
      style={{
        backgroundColor: "#000",
        overflow: "hidden",
      }}
    >
      {/* Layer 1: Nature footage (bottom 40%) */}
      <div
        style={{
          position: "absolute",
          bottom: 0,
          width: "100%",
          height: "40%",
          overflow: "hidden",
        }}
      >
        <NatureBackground
          clips={backgroundClips}
          clipDuration={fps * 4} // 4 seconds per clip
        />
      </div>

      {/* Layer 2: Reddit UI (top 60%) */}
      <div
        style={{
          position: "absolute",
          top: 0,
          width: "100%",
          height: "60%",
          overflow: "hidden",
        }}
      >
        <RedditUI
          title={redditData.title}
          username={redditData.username}
          upvotes={redditData.upvotes}
          awards={redditData.awards}
          postBody={redditData.postBody}
          timestamps={timestamps}
          fakeComments={fakeComments}
          revealFrame={revealFrame}
          revealText={reveal.text}
        />
      </div>

      {/* Layer 3: Captions (centered, overlaid on both sections) */}
      <div
        style={{
          position: "absolute",
          top: "45%",
          left: 0,
          right: 0,
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          transform: "translateY(-50%)",
          zIndex: 10,
        }}
      >
        <Captions timestamps={timestamps} highlightColor="#FFD700" />
      </div>

      {/* Audio layers */}
      {voiceoverUrl && (
        <Audio
          src={voiceoverUrl}
          volume={0.5} // -6 dB
        />
      )}

      {/* Background music - lo-fi (optional) */}
      {/* Uncomment when you have background music
      <Audio
        src={staticFile("sfx/lofi-bg.mp3")}
        volume={0.05} // -26 dB
        loop
      />
      */}
    </AbsoluteFill>
  );
};
