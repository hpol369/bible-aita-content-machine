import React from "react";
import { Composition } from "remotion";
import { BibleAITA } from "./compositions/BibleAITA.js";
import { BibleAITAPropsSchema, type BibleAITAProps } from "../types/remotion.js";

export const RemotionRoot: React.FC = () => {
  return (
    <>
      <Composition
        id="BibleAITA"
        component={BibleAITA as unknown as React.FC<Record<string, unknown>>}
        durationInFrames={30 * 75} // 75 seconds at 30fps (adjustable)
        fps={30}
        width={1080}
        height={1920}
        schema={BibleAITAPropsSchema}
        defaultProps={{
          voiceoverUrl: "",
          backgroundClips: [],
          redditData: {
            title: "AITA for stealing my brother's inheritance?",
            username: "throwaway_family",
            upvotes: 4200,
            awards: ["gold", "wholesome"],
            postBody: "Sample post body text...",
          },
          timestamps: [],
          fakeComments: [
            { user: "reddit_user_1", text: "NTA. Your brother knew.", upvotes: 1234 },
            { user: "reddit_user_2", text: "YTA. That's manipulation.", upvotes: 567 },
            { user: "reddit_user_3", text: "INFO: Did your parents know?", upvotes: 890 },
          ],
          reveal: {
            text: "This was the story of Jacob and Esau from Genesis 27.",
            timestamp: 60,
          },
        }}
        calculateMetadata={({ props }) => {
          // Calculate duration based on voice-over length
          const lastTimestamp = props.timestamps[props.timestamps.length - 1];
          const duration = lastTimestamp ? lastTimestamp.end + 5 : 75; // +5s for reveal
          return {
            durationInFrames: Math.ceil(duration * 30),
          };
        }}
      />
    </>
  );
};
