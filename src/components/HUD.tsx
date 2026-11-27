import React from "react";
import { useCurrentFrame } from "remotion";
import { Globe } from "lucide-react";
import { C, F, SHADOW } from "../lib/theme";
import { pop } from "../lib/anim";

/** Persistent top HUD. Reels safe zone: top 120 (=240px @4K) -> pill at top:127 (=255px @4K). */
export const HUD: React.FC = () => {
  const f = useCurrentFrame();
  const enter = pop(f, 6);
  const pulse = 0.5 + 0.5 * Math.sin(f / 30 * Math.PI * 2 * 0.9);
  return (
    <div
      style={{
        position: "absolute",
        top: 127,
        left: 40,
        width: 950,
        height: 76,
        borderRadius: 38,
        background: "rgba(255,255,255,0.86)",
        border: C.border,
        boxShadow: SHADOW,
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        padding: "0 12px 0 26px",
        opacity: enter,
        transform: `translateY(${(1 - enter) * -30}px)`,
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: 12, fontFamily: F.mono, fontWeight: 700, fontSize: 25, color: C.ink, letterSpacing: "-0.01em" }}>
        <Globe size={28} color={C.blue} strokeWidth={2.4} />
        www.ajsystemsoft.in
      </div>
      <div
        style={{
          height: 54,
          borderRadius: 27,
          padding: "0 24px",
          display: "flex",
          alignItems: "center",
          gap: 12,
          background: `linear-gradient(135deg, ${C.crimson} 0%, #B91C1C 100%)`,
          color: "#fff",
          fontFamily: F.ui,
          fontWeight: 700,
          fontSize: 21,
          letterSpacing: "0.02em",
          boxShadow: `0 0 0 ${3 + pulse * 7}px rgba(220,38,38,${0.10 + pulse * 0.10}), 0 8px 20px rgba(220,38,38,0.35)`,
          whiteSpace: "nowrap",
        }}
      >
        <span style={{ width: 10, height: 10, borderRadius: 5, background: C.goldLight, boxShadow: `0 0 ${6 + pulse * 8}px ${C.goldLight}` }} />
        CHRISTMAS OFFER • <span style={{ fontFamily: F.mono, fontWeight: 800, color: C.goldLight }}>₹0</span> (6 MO FREE)
      </div>
    </div>
  );
};
