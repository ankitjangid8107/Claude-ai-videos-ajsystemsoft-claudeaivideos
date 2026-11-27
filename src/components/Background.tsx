import React from "react";
import { AbsoluteFill, useCurrentFrame } from "remotion";
import { rnd } from "../lib/anim";
import { C } from "../lib/theme";

const BLOBS = [
  { c: C.blue, x: 0.2, y: 0.18, r: 760, sx: 0.011, sy: 0.008, ph: 0 },
  { c: C.crimson, x: 0.85, y: 0.5, r: 700, sx: 0.009, sy: 0.012, ph: 2 },
  { c: C.gold, x: 0.25, y: 0.86, r: 720, sx: 0.013, sy: 0.007, ph: 4 },
];
const BOKEH = Array.from({ length: 30 }, (_, i) => ({
  x: rnd(i + 1) * 1080,
  y: rnd(i + 50) * 1920,
  r: 10 + rnd(i + 90) * 42,
  d: rnd(i + 130), // depth 0..1
  gold: rnd(i + 170) > 0.45,
  sp: 0.15 + rnd(i + 210) * 0.5,
  ph: rnd(i + 250) * 6.28,
}));

export const Background: React.FC = () => {
  const f = useCurrentFrame();
  const t = f / 30;
  return (
    <AbsoluteFill style={{ background: "linear-gradient(180deg,#FFFFFF 0%,#FBFCFE 45%,#F8FAFC 100%)" }}>
      {/* ambient glass-light mesh blobs */}
      {BLOBS.map((b, i) => {
        const cx = (b.x + Math.sin(t * b.sx * 6 + b.ph) * 0.12) * 1080;
        const cy = (b.y + Math.cos(t * b.sy * 6 + b.ph) * 0.07) * 1920;
        return (
          <div
            key={i}
            style={{
              position: "absolute",
              left: cx - b.r,
              top: cy - b.r,
              width: b.r * 2,
              height: b.r * 2,
              borderRadius: "50%",
              background: `radial-gradient(circle, ${b.c}18 0%, ${b.c}0D 38%, ${b.c}00 70%)`,
            }}
          />
        );
      })}
      {/* micro-dot grid */}
      <AbsoluteFill
        style={{
          backgroundImage: "radial-gradient(rgba(15,23,42,0.055) 1.4px, transparent 1.6px)",
          backgroundSize: "36px 36px",
          backgroundPosition: `${(t * 4) % 36}px ${(t * 2.5) % 36}px`,
          maskImage: "radial-gradient(ellipse at 50% 45%, #000 20%, transparent 85%)",
          WebkitMaskImage: "radial-gradient(ellipse at 50% 45%, #000 20%, transparent 85%)",
        }}
      />
      {/* bokeh: translucent glass + champagne-gold, depth-of-field */}
      {BOKEH.map((b, i) => {
        const y = (b.y - t * b.sp * (30 + b.d * 40) + 3000) % 2100 - 90;
        const x = b.x + Math.sin(t * 0.5 + b.ph) * (14 + b.d * 22);
        const tw = 0.55 + 0.45 * Math.sin(t * 1.3 + b.ph);
        const op = (b.gold ? 0.2 : 0.16) * (0.5 + b.d * 0.5) * tw;
        const col = b.gold ? "251,191,36" : "148,185,255";
        return (
          <div
            key={i}
            style={{
              position: "absolute",
              left: x - b.r,
              top: y - b.r,
              width: b.r * 2,
              height: b.r * 2,
              borderRadius: "50%",
              background: `radial-gradient(circle at 35% 30%, rgba(255,255,255,${op * 3}) 0%, rgba(${col},${op}) 45%, rgba(${col},${op * 0.4}) 70%, rgba(${col},0) 72%)`,
              boxShadow: `inset 0 0 ${b.r * 0.35}px rgba(255,255,255,${op * 2})`,
            }}
          />
        );
      })}
    </AbsoluteFill>
  );
};
