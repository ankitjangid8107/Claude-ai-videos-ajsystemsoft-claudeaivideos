import React from "react";
import { AbsoluteFill } from "remotion";
import { UserCheck, LayoutTemplate, BadgeIndianRupee } from "lucide-react";
import { useAbsFrame } from "../lib/frame";
import { cue, scene } from "../lib/sync";
import { C, F, SHADOW, SHADOW_LG } from "../lib/theme";
import { pop, ramp } from "../lib/anim";
import { Glass, Sweep } from "../components/Glass";

export const Scene6Slots: React.FC = () => {
  const f = useAbsFrame();
  const s = scene("slots");
  const t0 = s.startFrame;
  const gIn = pop(f, t0 + 6, { damping: 17, stiffness: 120 });
  const tLim = cue("slots", "slots");
  const fill = ramp(f, tLim - 6, tLim + 70, 0, 0.87, true);
  const pulse = 0.5 + 0.5 * Math.sin(f / 9);
  const R = 190, CIRC = 2 * Math.PI * R;
  const cards = [
    { t: "1-on-1 Dedicated Focus", icon: <UserCheck size={40} />, at: cue("slots", "personal") - 6, c: C.blue },
    { t: "Zero Forced Templates", icon: <LayoutTemplate size={40} />, at: cue("slots", "special") , c: C.gold },
    { t: "₹0 Development Cost", icon: <BadgeIndianRupee size={40} />, at: cue("slots", "free"), c: C.emerald },
  ];
  const stamp = pop(f, cue("slots", "mauka") - 2, { damping: 14, stiffness: 170 });
  return (
    <AbsoluteFill>
      <div style={{ position: "absolute", left: 40, width: 950, top: 250, textAlign: "center", fontFamily: F.head, fontWeight: 800, fontSize: 64, letterSpacing: "-0.03em", color: C.ink, opacity: pop(f, t0 + 2) }}>
        Slots bohot <span style={{ color: C.crimson }}>limited</span>
      </div>
      {/* 3D gauge */}
      <div style={{ position: "absolute", left: 515 - 250, top: 380, width: 500, height: 500, perspective: 1500, opacity: gIn, transform: `scale(${0.85 + 0.15 * gIn})` }}>
        <div style={{ position: "absolute", inset: 0, transform: `rotateX(${14}deg) rotateY(${Math.sin(f / 60) * 8}deg)`, transformStyle: "preserve-3d" }}>
          <div style={{ position: "absolute", inset: 20, borderRadius: "50%", background: "linear-gradient(145deg,#fff,#F1F5F9)", boxShadow: `${SHADOW_LG}, 0 0 ${30 + pulse * 30}px rgba(220,38,38,${0.10 + pulse * 0.1})`, border: C.border }} />
          <svg width={500} height={500} viewBox="0 0 500 500" style={{ position: "absolute", inset: 0 }}>
            <defs>
              <linearGradient id="gg" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stopColor="#F59E0B" /><stop offset="1" stopColor="#DC2626" /></linearGradient>
            </defs>
            <circle cx={250} cy={250} r={R} fill="none" stroke="rgba(15,23,42,0.07)" strokeWidth={34} />
            <circle cx={250} cy={250} r={R} fill="none" stroke="url(#gg)" strokeWidth={34} strokeLinecap="round" strokeDasharray={`${CIRC * fill} ${CIRC}`} transform="rotate(-90 250 250)" />
          </svg>
          <div style={{ position: "absolute", inset: 0, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", textAlign: "center" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 10, fontFamily: F.ui, fontWeight: 800, fontSize: 24, letterSpacing: "0.14em", color: C.crimson }}>
              <span style={{ width: 16, height: 16, borderRadius: 8, background: C.crimson, boxShadow: `0 0 ${8 + pulse * 16}px ${C.crimson}` }} /> LIVE
            </div>
            <div style={{ fontFamily: F.head, fontWeight: 800, fontSize: 62, lineHeight: 1.0, letterSpacing: "-0.03em", color: C.ink, marginTop: 12 }}>LIMITED</div>
            <div style={{ fontFamily: F.head, fontWeight: 800, fontSize: 40, lineHeight: 1.1, letterSpacing: "-0.02em", color: C.crimson, marginTop: 4 }}>CHRISTMAS<br />SLOTS</div>
          </div>
        </div>
      </div>

      {/* trust cards */}
      <div style={{ position: "absolute", left: 100, top: 930, width: 830, display: "flex", flexDirection: "column", gap: 18 }}>
        {cards.map((c, i) => {
          const p = pop(f, c.at, { damping: 15, stiffness: 160 });
          return (
            <div key={i} style={{ opacity: p, transform: `translateY(${(1 - p) * 60}px) rotateX(${(1 - p) * 20}deg) scale(${0.94 + 0.06 * p})`, transformOrigin: "50% 100%" }}>
              <Glass strong style={{ borderRadius: 40, padding: "22px 34px", display: "flex", alignItems: "center", gap: 24, boxShadow: SHADOW, overflow: "hidden" }}>
                <span style={{ width: 80, height: 80, borderRadius: 26, background: `${c.c}18`, color: c.c, display: "grid", placeItems: "center" }}>{c.icon}</span>
                <span style={{ fontFamily: F.head, fontWeight: 800, fontSize: 42, letterSpacing: "-0.025em", color: C.ink }}>{c.t}</span>
                <Sweep p={ramp(f, c.at, c.at + 36, 0, 1, false)} radius={40} />
              </Glass>
            </div>
          );
        })}
      </div>
      <div style={{ position: "absolute", left: 40, width: 950, top: 1395, textAlign: "center", fontFamily: F.head, fontWeight: 800, fontSize: 46, letterSpacing: "-0.02em", color: C.crimson, opacity: stamp, transform: `scale(${0.85 + 0.15 * stamp})` }}>Ye mauka dobara nahi aayega.</div>
    </AbsoluteFill>
  );
};
