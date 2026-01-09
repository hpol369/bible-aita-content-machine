import React from "react";
import {
  useCurrentFrame,
  useVideoConfig,
  OffthreadVideo,
  interpolate,
  Sequence,
} from "remotion";

interface NatureBackgroundProps {
  clips: string[];
  clipDuration?: number; // frames per clip
}

export const NatureBackground: React.FC<NatureBackgroundProps> = ({
  clips,
  clipDuration = 120, // 4 seconds at 30fps
}) => {
  const frame = useCurrentFrame();
  const { fps, durationInFrames } = useVideoConfig();

  if (clips.length === 0) {
    // Fallback gradient background
    return (
      <div
        style={{
          width: "100%",
          height: "100%",
          background: "linear-gradient(180deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%)",
        }}
      />
    );
  }

  // Calculate subtle zoom effect (10% over clip duration)
  const clipIndex = Math.floor(frame / clipDuration) % clips.length;
  const frameInClip = frame % clipDuration;

  const scale = interpolate(frameInClip, [0, clipDuration], [1, 1.1], {
    extrapolateRight: "clamp",
  });

  return (
    <div
      style={{
        width: "100%",
        height: "100%",
        overflow: "hidden",
        position: "relative",
      }}
    >
      {clips.map((clip, index) => {
        const clipStartFrame = index * clipDuration;
        const isVisible =
          frame >= clipStartFrame && frame < clipStartFrame + clipDuration;

        if (!isVisible && Math.abs(index - clipIndex) > 1) {
          return null;
        }

        return (
          <Sequence
            key={clip}
            from={clipStartFrame}
            durationInFrames={clipDuration}
          >
            <div
              style={{
                position: "absolute",
                top: 0,
                left: 0,
                width: "100%",
                height: "100%",
                transform: `scale(${scale})`,
                transformOrigin: "center center",
              }}
            >
              <OffthreadVideo
                src={clip}
                style={{
                  width: "100%",
                  height: "100%",
                  objectFit: "cover",
                }}
                muted
              />
            </div>
          </Sequence>
        );
      })}

      {/* Dark overlay for better text readability */}
      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          width: "100%",
          height: "100%",
          background: "linear-gradient(180deg, rgba(0,0,0,0.3) 0%, rgba(0,0,0,0.1) 100%)",
        }}
      />
    </div>
  );
};
