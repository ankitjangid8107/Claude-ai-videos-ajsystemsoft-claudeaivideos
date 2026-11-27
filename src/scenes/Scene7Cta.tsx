import React from "react";
import { AbsoluteFill } from "remotion";
import { MessageCircle, Globe, Lock } from "lucide-react";
import { useAbsFrame } from "../lib/frame";
import { cue, scene } from "../lib/sync";
import { C, F, SHADOW, SHADOW_LG } from "../lib/theme";
import { pop, ramp, rnd } from "../lib/anim";
import { Glass, Sweep } from "../components/Glass";

export const Scene7Cta: React.FC = () => {
  const f = useAbsFrame();
  const s = scene("cta");
  const t0 = s.startFrame;
  const emb = pop(f, t0 + 6, { damping: 16, stiffness: 130 });
  const tUrl = cue("cta", "dot") - 6;
  const urlIn = pop(f, Math.min(tUrl, t0 + 40));
  const urlGlow = ramp(f, tUrl, tUrl + 12, 0, 1);
  const tBtn = cue("cta", "WhatsApp") - 6;
  const btnIn = pop(f, tBtn - 20, { damping: 15, stiffness: 140 });
  const tClick = cue("cta", "message") + 6;
  const tagIn = pop(f, cue("cta", "claim") - 4);

  // cursor path: from lower-right to button centre
  const BX = 515, BY = 1000;
  const cp = ramp(f, tBtn, tClick - 2, 0, 1);
  const cx = 880 + (BX + 120 - 880) * cp + Math.sin(cp * Math.PI) * -40;
  const cy = 1330 + (BY + 20 - 1330) * cp - Math.sin(cp * Math.PI) * 60;
  const press = f >= tClick && f < tClick + 8 ? 0.94 : 1;
  const rip = ramp(f, tClick, tClick + 34, 0, 1);
  const pulse = 0.5 + 0.5 * Math.sin(f / 9);
  return (
    <AbsoluteFill>
      {/* champagne-gold festive shimmer */}
      {Array.from({ length: 26 }).map((_, i) => {
        const x = rnd(i + 3) * 1000 + 20;
        const y = ((rnd(i + 30) * 1900 - (f - t0) * (0.5 + rnd(i + 60)) * 1.6) % 1800 + 1800) % 1800 + 60;
        const tw = 0.5 + 0.5 * Math.sin(f / 10 + i);
        return <div key={i} style={{ position: "absolute", left: x, top: y, width: 8 + rnd(i) * 10, height: 8 + rnd(i) * 10, borderRadius: "50%", background: "radial-gradient(circle,#FDE68A,#D97706 70%,rgba(217,119,6,0))", opacity: 0.28 * tw }} />;
      })}

      <div style={{ position: "absolute", left: 40, width: 950, top: 262, display: "flex", justifyContent: "center", opacity: emb, transform: `translateY(${(1 - emb) * 50}px) scale(${0.9 + 0.1 * emb})` }}>
        <Glass strong style={{ padding: "22px 44px 22px 26px", borderRadius: 56, display: "flex", alignItems: "center", gap: 24, boxShadow: SHADOW_LG, overflow: "hidden" }}>
          <div style={{ width: 108, height: 108, borderRadius: 32, background: "linear-gradient(145deg,#3B82F6,#1D4ED8)", display: "grid", placeItems: "center", color: "#fff", fontFamily: F.head, fontWeight: 800, fontSize: 54, letterSpacing: "-0.04em", boxShadow: "0 14px 30px rgba(37,99,235,0.4), inset 0 2px 0 rgba(255,255,255,0.35)" }}>AJ</div>
          <div style={{ fontFamily: F.head, fontWeight: 800, fontSize: 48, lineHeight: 1.04, letterSpacing: "-0.03em", color: C.ink }}>AJ System Soft<br /><span style={{ color: C.blue }}>Technology</span></div>
          <Sweep p={((f - t0) / 80) % 1} radius={56} color="255,247,220" />
        </Glass>
      </div>

      <div style={{ position: "absolute", left: 40, width: 950, top: 560, textAlign: "center", fontFamily: F.head, fontWeight: 800, fontSize: 70, letterSpacing: "-0.035em", color: C.ink, lineHeight: 1.05, opacity: pop(f, t0 + 18) }}>
        Is Christmas dijiye ek <span style={{ color: C.crimson }}>smart</span> digital upgrade
      </div>

      {/* 3D glass URL bar */}
      <div style={{ position: "absolute", left: 80, top: 780, width: 870, opacity: urlIn, transform: `perspective(1600px) rotateX(${(1 - urlIn) * 25 + 6}deg) translateY(${(1 - urlIn) * 50}px)` }}>
        <Glass strong style={{ borderRadius: 60, padding: "26px 36px", display: "flex", alignItems: "center", gap: 18, boxShadow: `${SHADOW_LG}, 0 0 ${urlGlow * 50}px rgba(37,99,235,${0.28 * urlGlow})`, border: `1px solid rgba(37,99,235,${0.08 + 0.4 * urlGlow})` }}>
          <Lock size={32} color={C.emerald} />
          <Globe size={34} color={C.blue} />
          <div style={{ fontFamily: F.mono, fontWeight: 700, fontSize: 38, color: C.ink, letterSpacing: "-0.03em" }}>https://www.ajsystemsoft.in</div>
        </Glass>
      </div>

      {/* WhatsApp button */}
      <div style={{ position: "absolute", left: 65, top: 940, width: 900, opacity: btnIn, transform: `translateY(${(1 - btnIn) * 70}px) scale(${(0.92 + 0.08 * btnIn) * press})` }}>
        <div style={{ position: "relative", height: 132, borderRadius: 66, background: "linear-gradient(135deg,#34D399 0%,#10B981 45%,#059669 100%)", boxShadow: `0 0 0 ${6 + pulse * 10}px rgba(16,185,129,${0.12 + pulse * 0.1}), 0 22px 50px rgba(5,150,105,0.45), inset 0 2px 0 rgba(255,255,255,0.45)`, display: "flex", alignItems: "center", justifyContent: "center", gap: 20, overflow: "hidden" }}>
          <MessageCircle size={56} color="#fff" strokeWidth={2.4} />
          <div style={{ fontFamily: F.ui, fontWeight: 800, fontSize: 38, color: "#fff", letterSpacing: "-0.015em" }}>WhatsApp — Claim <span style={{ fontFamily: F.mono }}>₹0</span> Christmas Offer</div>
          <Sweep p={((f - tBtn) / 60) % 1} radius={66} />
          {rip > 0 && rip < 1 && <div style={{ position: "absolute", left: 570, top: 66, width: 40, height: 40, marginLeft: -20, marginTop: -20, borderRadius: "50%", border: "6px solid rgba(255,255,255,0.8)", transform: `scale(${1 + rip * 14})`, opacity: 1 - rip }} />}
        </div>
      </div>

      {/* tagline */}
      <div style={{ position: "absolute", left: 40, width: 950, top: 1200, textAlign: "center", opacity: tagIn, transform: `translateY(${(1 - tagIn) * 30}px)` }}>
        <div style={{ fontFamily: F.head, fontWeight: 800, fontSize: 48, letterSpacing: "-0.03em", color: C.ink }}>Software built around<br /><span style={{ color: C.blue }}>your requirements.</span></div>
      </div>

      {/* cursor */}
      {f >= tBtn - 14 && (
        <svg width={64} height={64} viewBox="0 0 24 24" style={{ position: "absolute", left: cx, top: cy, zIndex: 30, filter: "drop-shadow(0 6px 8px rgba(15,23,42,0.35))", transform: `scale(${f >= tClick && f < tClick + 8 ? 0.85 : 1})`, opacity: ramp(f, tBtn - 14, tBtn - 4) }}>
          <path d="M5 3l14 8-6 2 4 7-3 1.5-4-7-5 4z" fill="#0F172A" stroke="#fff" strokeWidth={1.4} strokeLinejoin="round" />
        </svg>
      )}
      <div style={{ display: "none" }}>{SHADOW}</div>
    </AbsoluteFill>
  );
};
