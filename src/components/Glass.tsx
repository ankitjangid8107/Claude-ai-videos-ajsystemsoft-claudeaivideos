import React from "react";
import { C, SHADOW } from "../lib/theme";

export const Glass: React.FC<{ style?: React.CSSProperties; children?: React.ReactNode; strong?: boolean; blur?: boolean }> = ({ style, children, strong, blur = false }) => (
  <div
    style={{
      background: strong ? "rgba(255,255,255,0.94)" : "rgba(255,255,255,0.82)",
      border: C.border,
      borderRadius: 36,
      boxShadow: SHADOW,
      backdropFilter: blur ? "blur(18px) saturate(1.4)" : undefined,
      WebkitBackdropFilter: blur ? "blur(18px) saturate(1.4)" : undefined,
      position: "relative",
      ...style,
    }}
  >
    {/* top specular edge */}
    <div style={{ position: "absolute", inset: 0, borderRadius: "inherit", boxShadow: "inset 0 1px 0 rgba(255,255,255,0.95)", pointerEvents: "none" }} />
    {children}
  </div>
);

/** Soft diagonal specular light sweep across a card; p in 0..1 */
export const Sweep: React.FC<{ p: number; radius?: number; color?: string }> = ({ p, radius = 36, color = "255,255,255" }) => (
  <div style={{ position: "absolute", inset: 0, borderRadius: radius, overflow: "hidden", pointerEvents: "none" }}>
    <div
      style={{
        position: "absolute",
        top: "-20%",
        bottom: "-20%",
        width: "34%",
        left: `${-40 + p * 150}%`,
        transform: "skewX(-20deg)",
        background: `linear-gradient(90deg, rgba(${color},0) 0%, rgba(${color},0.75) 50%, rgba(${color},0) 100%)`,
      }}
    />
  </div>
);
