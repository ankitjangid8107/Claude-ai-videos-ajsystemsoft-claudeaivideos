import React from "react";
import { AbsoluteFill, useCurrentFrame, useVideoConfig } from "remotion";
import { ramp } from "../lib/anim";

export const OVERLAP = 14;

/**
 * 3D camera zoom-through wrapper. Scene is mounted [start-OVERLAP, end+OVERLAP].
 * Entering: pushes in from slightly behind with a tilt; exiting: camera flies through (scale up + fade) with a light whip.
 */
export const SceneShell: React.FC<{ durationInFrames: number; first?: boolean; last?: boolean; children: React.ReactNode }> = ({ durationInFrames, first, last, children }) => {
  const f = useCurrentFrame();
  const { fps } = useVideoConfig();
  void fps;
  const inStart = first ? -1 : 0;
  const inP = first ? 1 : ramp(f, inStart, OVERLAP * 2, 0, 1);
  const outStart = durationInFrames - OVERLAP * 2;
  const outP = last ? 0 : ramp(f, outStart, durationInFrames, 0, 1);
  const op = Math.min(first ? 1 : ramp(f, OVERLAP - 4, OVERLAP + 8, 0, 1, false), last ? 1 : 1 - ramp(f, durationInFrames - OVERLAP - 12, durationInFrames - OVERLAP, 0, 1, false));
  const scale = (0.9 + 0.1 * inP) * (1 + outP * 0.16);
  const rx = (1 - inP) * 7 - outP * 4;
  const ty = (1 - inP) * 60 - outP * 30;
  // whip sweep at entry
  const whip = first ? -1 : ramp(f, 0, OVERLAP * 2.2, 0, 1, false);
  return (
    <AbsoluteFill style={{ opacity: op, perspective: 1800, perspectiveOrigin: "50% 45%" }}>
      <AbsoluteFill style={{ transform: `translateY(${ty}px) rotateX(${rx}deg) scale(${scale})`, transformOrigin: "50% 50%", transformStyle: "preserve-3d" }}>{children}</AbsoluteFill>
      {!first && whip < 1 && whip > 0 && (
        <AbsoluteFill style={{ pointerEvents: "none", overflow: "hidden" }}>
          <div
            style={{
              position: "absolute",
              top: -200,
              bottom: -200,
              width: 360,
              left: -500 + whip * 2000,
              transform: "skewX(-18deg)",
              background: "linear-gradient(90deg, rgba(255,255,255,0), rgba(255,255,255,0.85), rgba(251,191,36,0.18), rgba(255,255,255,0))",
            }}
          />
        </AbsoluteFill>
      )}
    </AbsoluteFill>
  );
};
