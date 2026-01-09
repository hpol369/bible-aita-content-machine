import React from "react";
import { useCurrentFrame, interpolate, Easing } from "remotion";

interface UpvoteCounterProps {
  targetCount: number;
  duration?: number; // frames
}

export const UpvoteCounter: React.FC<UpvoteCounterProps> = ({
  targetCount,
  duration = 300, // 10 seconds at 30fps
}) => {
  const frame = useCurrentFrame();

  const count = Math.floor(
    interpolate(frame, [0, duration], [0, targetCount], {
      extrapolateRight: "clamp",
      easing: Easing.out(Easing.cubic),
    })
  );

  const formatCount = (n: number): string => {
    if (n >= 1000) {
      return `${(n / 1000).toFixed(1)}k`;
    }
    return n.toString();
  };

  return (
    <span
      style={{
        color: "#FF4500",
        fontWeight: "bold",
        display: "flex",
        alignItems: "center",
        gap: 6,
        fontSize: 28,
      }}
    >
      <svg width="20" height="20" viewBox="0 0 24 24" fill="#FF4500">
        <path d="M12 4l8 8h-6v8h-4v-8H4l8-8z" />
      </svg>
      {formatCount(count)}
    </span>
  );
};
