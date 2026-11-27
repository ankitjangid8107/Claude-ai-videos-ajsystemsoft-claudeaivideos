import { staticFile } from "remotion";
import { loadFont } from "@remotion/fonts";
import faces from "../fonts.generated.json";

// Self-hosted fonts (Plus Jakarta Sans, Inter, JetBrains Mono): deterministic renders, no network at render time.
// @remotion/fonts handles delayRender/continueRender for us.
(faces as string[]).forEach((block) => {
  const family = /font-family:\s*'([^']+)'/.exec(block)?.[1];
  const weight = /font-weight:\s*(\d+)/.exec(block)?.[1];
  const file = /@@FONT\/([^@]+)@@/.exec(block)?.[1];
  const range = /unicode-range:\s*([^;]+);/.exec(block)?.[1];
  if (!family || !file) return;
  loadFont({ family, url: staticFile(`fonts/${file}`), weight, unicodeRange: range, format: "woff2" }).catch(() => undefined);
});

export const C = {
  ink: "#0F172A",
  muted: "#475569",
  blue: "#2563EB",
  crimson: "#DC2626",
  gold: "#D97706",
  goldLight: "#FBBF24",
  skyLight: "#60A5FA",
  emerald: "#10B981",
  border: "1px solid rgba(15,23,42,0.08)",
};
export const F = {
  head: `"Plus Jakarta Sans", Inter, sans-serif`,
  ui: `Inter, sans-serif`,
  mono: `"JetBrains Mono", monospace`,
};
// layered studio shadow used on all cards
export const SHADOW =
  "0 1px 1px rgba(15,23,42,0.04), 0 4px 8px rgba(15,23,42,0.05), 0 14px 28px rgba(15,23,42,0.07), 0 36px 70px rgba(15,23,42,0.10)";
export const SHADOW_LG =
  "0 2px 2px rgba(15,23,42,0.05), 0 8px 16px rgba(15,23,42,0.06), 0 24px 48px rgba(15,23,42,0.09), 0 60px 110px rgba(15,23,42,0.14)";
