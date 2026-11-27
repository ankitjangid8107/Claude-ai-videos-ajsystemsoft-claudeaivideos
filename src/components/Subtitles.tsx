import React from "react";
import { useCurrentFrame } from "remotion";
import { SYNC, FPS } from "../lib/sync";
import { C, F } from "../lib/theme";
import { pop } from "../lib/anim";

const POWER = /^(₹0|0|free|6|months|christmas|aj|ajsystemsoft\.in|dot|in|msme|whatsapp|offer|bilkul|limited)$/i;
const isPower = (w: string, prev?: string, next?: string) => {
  const n = w.toLowerCase().replace(/[^a-z0-9₹.]/g, "");
  if (/^(free|christmas|₹0|whatsapp|limited|msme)$/.test(n)) return true;
  if (n === "6" || (n === "months" && prev === "6")) return true;
  if (n === "aj" || (n === "system" && prev?.toLowerCase() === "aj") || (n === "soft" && prev?.toLowerCase() === "system")) return true;
  if (n === "dot" || (n === "in" && prev?.toLowerCase() === "dot")) return true;
  return false;
};
void POWER;

/** Bottom subtitle bar: bottom 267 (=535px @4K) — inside safe zone. Words read straight from sync.json */
export const Subtitles: React.FC = () => {
  const frame = useCurrentFrame();
  const t = frame / FPS;
  const cap = SYNC.captions.find((c, i) => t >= c.start - 0.04 && (t < c.end + 0.25 || false) && (SYNC.captions[i + 1] ? t < SYNC.captions[i + 1].start - 0.04 : true));
  if (!cap) return null;
  const ws = SYNC.words.slice(cap.first, cap.last + 1);
  const local = frame - Math.round(cap.start * FPS);
  const enter = pop(local, 0, { damping: 18, stiffness: 180 });
  const out = Math.min(1, Math.max(0, (cap.end + 0.25 - t) / 0.12));
  return (
    <div style={{ position: "absolute", left: 0, right: 90, bottom: 267, display: "flex", justifyContent: "center", paddingLeft: 40 }}>
      <div
        style={{
          background: "rgba(15,23,42,0.92)",
          borderRadius: 52,
          padding: "20px 38px 22px",
          boxShadow: "0 14px 40px rgba(15,23,42,0.30), 0 2px 6px rgba(15,23,42,0.2)",
          border: "1px solid rgba(255,255,255,0.08)",
          display: "flex",
          gap: 22,
          flexWrap: "nowrap",
          alignItems: "baseline",
          fontFamily: F.ui,
          fontWeight: 600,
          fontSize: 46,
          letterSpacing: "-0.01em",
          whiteSpace: "nowrap",
          opacity: enter * out,
          transform: `translateY(${(1 - enter) * 24}px) scale(${0.94 + enter * 0.06})`,
        }}
      >
        {ws.map((w, i) => {
          const active = t >= w.start && t < w.end + 0.02;
          const spoken = t >= w.start;
          const power = isPower(w.w, ws[i - 1]?.w, ws[i + 1]?.w);
          const k = active ? 1 + 0.06 * Math.min(1, (t - w.start) / 0.08) : 1;
          const col = active ? (power ? C.goldLight : C.skyLight) : power ? C.goldLight : spoken ? "#FFFFFF" : "rgba(255,255,255,0.55)";
          return (
            <span
              key={i}
              style={{
                color: col,
                fontWeight: power ? 800 : 600,
                display: "inline-block",
                transform: `scale(${k}) translateY(${active ? -2 : 0}px)`,
                textShadow: active ? `0 0 22px ${power ? "rgba(251,191,36,0.55)" : "rgba(96,165,250,0.5)"}` : "none",
              }}
            >
              {w.w}
            </span>
          );
        })}
      </div>
    </div>
  );
};
