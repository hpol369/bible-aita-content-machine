import React from "react";
import { useCurrentFrame, spring, useVideoConfig } from "remotion";

interface AwardBadgeProps {
  type: string;
}

const AWARD_COLORS: Record<string, string> = {
  gold: "#FFD700",
  wholesome: "#FF69B4",
  silver: "#C0C0C0",
  helpful: "#FF4500",
  hugz: "#FF6B6B",
};

const AWARD_ICONS: Record<string, string> = {
  gold: "★",
  wholesome: "❤",
  silver: "✦",
  helpful: "✓",
  hugz: "🤗",
};

export const AwardBadge: React.FC<AwardBadgeProps> = ({ type }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const scale = spring({
    frame,
    fps,
    config: {
      damping: 10,
      stiffness: 100,
      mass: 0.5,
    },
  });

  const color = AWARD_COLORS[type] || "#FFD700";
  const icon = AWARD_ICONS[type] || "★";

  return (
    <div
      style={{
        transform: `scale(${scale})`,
        backgroundColor: color,
        borderRadius: "50%",
        width: 32,
        height: 32,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        fontSize: 18,
        boxShadow: `0 0 10px ${color}`,
      }}
    >
      {icon}
    </div>
  );
};
