import { continueRender, delayRender, staticFile } from "remotion";
import faces from "../fonts.generated.json";

// Self-hosted fonts (Plus Jakarta Sans, Inter, JetBrains Mono) -> deterministic renders, no network at render time
const css = (faces as string[]).map((b) => b.replace(/@@FONT\/([^@]+)@@/g, (_, f) => staticFile(`fonts/${f}`))).join("\n");
if (typeof document !== "undefined" && !document.getElementById("aj-fonts")) {
  const st = document.createElement("style");
  st.id = "aj-fonts";
  st.textContent = css;
  document.head.appendChild(st);
  const h = delayRender("fonts", { timeoutInMilliseconds: 60000 });
  Promise.all(
    ["800 40px 'Plus Jakarta Sans'", "700 40px 'Plus Jakarta Sans'", "500 40px Inter", "600 40px Inter", "700 40px Inter", "500 40px 'JetBrains Mono'", "700 40px 'JetBrains Mono'", "800 40px 'JetBrains Mono'"].map((f) => document.fonts.load(f, "₹0 AJ aA9")),
  ).then(() => continueRender(h), () => continueRender(h));
  // safety net: never block a render on font loading (fonts are local, this resolves in ms)
  setTimeout(() => { try { continueRender(h); } catch { /* already cleared */ } }, 8000);
}

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
