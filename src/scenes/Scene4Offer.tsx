import React from "react";
import { AbsoluteFill } from "remotion";
import { Globe, Smartphone, Check, Gift } from "lucide-react";
import { useAbsFrame } from "../lib/frame";
import { cue, scene } from "../lib/sync";
import { C, F, SHADOW, SHADOW_LG } from "../lib/theme";
import { pop, ramp, rnd } from "../lib/anim";
import { Glass, Sweep } from "../components/Glass";

const S = 190; // half cube edge (cube = 380)
const CX = 515;

const Face: React.FC<{ t: string; fade: number; out: number }> = ({ t, fade, out }) => (
  <div
    style={{
      position: "absolute",
      left: -S,
      top: -S,
      width: S * 2,
      height: S * 2,
      transform: `${t} translateZ(${S + out}px)`,
      background: "linear-gradient(145deg,#FFFFFF 0%,#F1F5F9 100%)",
      border: "1px solid rgba(15,23,42,0.07)",
      boxShadow: "inset 0 0 60px rgba(15,23,42,0.05)",
      opacity: fade,
      backfaceVisibility: "hidden",
    }}
  >
    {/* brushed crimson vertical ribbon */}
    <div style={{ position: "absolute", left: "50%", top: 0, bottom: 0, width: 76, marginLeft: -38, background: "linear-gradient(90deg,#991B1B,#DC2626 45%,#EF4444 55%,#991B1B)", boxShadow: "0 0 0 3px rgba(217,119,6,0.55)" }} />
    {/* metallic gold horizontal ribbon */}
    <div style={{ position: "absolute", top: "50%", left: 0, right: 0, height: 76, marginTop: -38, background: "linear-gradient(180deg,#B45309,#F59E0B 45%,#FDE68A 52%,#B45309)", opacity: 0.96 }} />
    <div style={{ position: "absolute", left: "50%", top: "50%", width: 76, height: 76, marginLeft: -38, marginTop: -38, background: "linear-gradient(135deg,#DC2626,#991B1B)", boxShadow: "inset 0 0 0 3px rgba(251,191,36,0.7)" }} />
  </div>
);

export const Scene4Offer: React.FC = () => {
  const f = useAbsFrame();
  const s = scene("offer");
  const tSabse = cue("offer", "sabse");
  const tUnfold = cue("offer", "Poore") - 4;
  const tFully = cue("offer", "fully");
  const tFree = cue("offer", "free");
  const tDomain = cue("offer", "domain");
  const tCustom = cue("offer", "custom");
  const tHidden = cue("offer", "hidden");

  const cubeIn = pop(f, s.startFrame + 6, { damping: 15, stiffness: 120 });
  const unfold = ramp(f, tUnfold, tUnfold + 30, 0, 1);
  const rotY = (f - s.startFrame) * 1.6 + unfold * 90;
  const bob = Math.sin(f / 24) * 10;
  const heroIn = pop(f, tUnfold + 12, { damping: 15, stiffness: 130 });
  const subIn = pop(f, tFully);
  const burst = ramp(f, tFree, tFree + 26, 0, 1);
  const pulse = 0.5 + 0.5 * Math.sin(f / 11);

  const faces = [
    "rotateY(0deg)",
    "rotateY(90deg)",
    "rotateY(180deg)",
    "rotateY(-90deg)",
    "rotateX(90deg)",
    "rotateX(-90deg)",
  ];
  const pills = [
    { t: "Only Domain Yours", at: tDomain },
    { t: "100% Custom Design & Code", at: tCustom },
    { t: "Zero Hidden Charges • Full Tech Support", at: tHidden },
  ];

  const w1 = pop(f, tSabse - 6);
  return (
    <AbsoluteFill>
      {/* phase A headline */}
      <div style={{ position: "absolute", left: 40, width: 950, top: 262, textAlign: "center", fontFamily: F.head, fontWeight: 800, fontSize: 84, letterSpacing: "-0.035em", lineHeight: 1.02, color: C.ink, opacity: w1 * (1 - unfold), transform: `translateY(${(1 - w1) * 40 - unfold * 40}px)` }}>
        Sabse bada<br />
        <span style={{ color: C.crimson }}>Christmas Gift</span>
      </div>

      {/* 3D gift cube */}
      {unfold < 1 && (
        <div style={{ position: "absolute", left: CX, top: 880, width: 0, height: 0, perspective: 1700, opacity: cubeIn * (1 - unfold) }}>
          {/* floor shadow */}
          <div style={{ position: "absolute", left: -260, top: 270 - bob * 0.4, width: 520, height: 80, borderRadius: "50%", background: "radial-gradient(ellipse, rgba(15,23,42,0.28), rgba(15,23,42,0) 70%)" }} />
          <div style={{ position: "absolute", left: 0, top: bob, width: 0, height: 0, transformStyle: "preserve-3d", transform: `scale(${0.7 + 0.3 * cubeIn + unfold * 0.3}) rotateX(-24deg) rotateY(${rotY}deg)` }}>
            {faces.map((t, i) => <Face key={i} t={t} fade={1} out={unfold * 260} />)}
            {/* bow on top face */}
            <div style={{ position: "absolute", left: 0, top: 0, transform: `translateY(${-S - 2}px) rotateX(90deg)`, transformStyle: "preserve-3d" }}>
              {[-1, 1].map((d) => (
                <div key={d} style={{ position: "absolute", left: d === -1 ? -150 : 10, top: -62, width: 140, height: 124, borderRadius: "70px 70px 70px 70px / 62px 62px 62px 62px", border: "26px solid #DC2626", boxShadow: "0 0 0 3px #F59E0B", transform: `rotate(${d * 8}deg)`, background: "rgba(153,27,27,0.25)" }} />
              ))}
              <div style={{ position: "absolute", left: -26, top: -26, width: 52, height: 52, borderRadius: 14, background: "linear-gradient(135deg,#FDE68A,#D97706)", boxShadow: "0 4px 12px rgba(0,0,0,0.3)" }} />
            </div>
          </div>
        </div>
      )}

      {/* Bento grid */}
      <div style={{ position: "absolute", left: 60, top: 270, width: 900, perspective: 1800 }}>
        {/* hero card */}
        <div style={{ width: 900, height: 560, opacity: heroIn, transform: `rotateX(${(1 - heroIn) * -25}deg) translateY(${(1 - heroIn) * 160}px) scale(${0.85 + 0.15 * heroIn})`, transformOrigin: "50% 100%" }}>
          <div style={{ position: "absolute", inset: 0, borderRadius: 56, background: "linear-gradient(150deg,#FFFFFF 0%,#FFF7ED 60%,#FEF3C7 100%)", border: "1px solid rgba(217,119,6,0.28)", boxShadow: `${SHADOW_LG}, 0 0 ${40 + burst * 40 + pulse * 20}px rgba(217,119,6,${0.14 + burst * 0.14})`, overflow: "hidden" }}>
            <div style={{ position: "absolute", left: 44, top: 40, display: "flex", alignItems: "center", gap: 12, background: "linear-gradient(135deg,#DC2626,#991B1B)", color: "#fff", fontFamily: F.ui, fontWeight: 800, fontSize: 28, letterSpacing: "0.14em", padding: "14px 28px", borderRadius: 40, boxShadow: "0 10px 24px rgba(220,38,38,0.35)" }}>
              <Gift size={30} /> CHRISTMAS SPECIAL
            </div>
            <div style={{ position: "absolute", left: 0, right: 0, top: 120, textAlign: "center", fontFamily: F.mono, fontWeight: 800, fontSize: 330, lineHeight: 1, letterSpacing: "-0.07em", color: C.ink, transform: `scale(${1 + burst * 0.06 * Math.sin(burst * Math.PI)})`, background: "linear-gradient(180deg,#0F172A 30%,#B45309 130%)", WebkitBackgroundClip: "text" } as React.CSSProperties}>
              <span style={{ WebkitTextFillColor: "transparent" }}>₹0</span>
            </div>
            <div style={{ position: "absolute", left: 0, right: 0, bottom: 48, textAlign: "center", fontFamily: F.head, fontWeight: 800, fontSize: 76, letterSpacing: "-0.03em", color: C.emerald }}>6 MONTHS FREE</div>
            <Sweep p={((f - tUnfold) / 90) % 1} radius={56} color="255,247,220" />
            {/* free burst particles */}
            {burst > 0 && burst < 1 && Array.from({ length: 18 }).map((_, i) => {
              const a = (i / 18) * Math.PI * 2, r = 120 + burst * (200 + rnd(i) * 160);
              return <div key={i} style={{ position: "absolute", left: 450 + Math.cos(a) * r, top: 300 + Math.sin(a) * r * 0.75, width: 12, height: 12, borderRadius: 6, background: i % 3 === 0 ? C.crimson : C.goldLight, opacity: 1 - burst }} />;
            })}
          </div>
        </div>
        {/* sub card */}
        <div style={{ marginTop: 26, width: 900, opacity: subIn, transform: `translateY(${(1 - subIn) * 80}px) scale(${0.94 + 0.06 * subIn})` }}>
          <Glass strong style={{ borderRadius: 44, padding: "30px 38px", display: "flex", alignItems: "center", gap: 24, boxShadow: SHADOW }}>
            <div style={{ display: "flex", gap: 12 }}>
              <span style={{ width: 76, height: 76, borderRadius: 24, background: "rgba(37,99,235,0.1)", display: "grid", placeItems: "center" }}><Globe size={42} color={C.blue} /></span>
              <span style={{ width: 76, height: 76, borderRadius: 24, background: "rgba(16,185,129,0.12)", display: "grid", placeItems: "center" }}><Smartphone size={42} color={C.emerald} /></span>
            </div>
            <div style={{ fontFamily: F.head, fontWeight: 800, fontSize: 40, lineHeight: 1.1, letterSpacing: "-0.025em", color: C.ink }}>Full Custom Website<br /><span style={{ color: C.blue }}>+ Mobile App</span></div>
          </Glass>
        </div>
        {/* checkmark pills */}
        <div style={{ marginTop: 26, display: "flex", flexDirection: "column", gap: 16 }}>
          {pills.map((p, i) => {
            const pp = pop(f, p.at - 2, { damping: 14, stiffness: 170 });
            return (
              <div key={i} style={{ opacity: pp, transform: `translateX(${(1 - pp) * -140}px) scale(${0.9 + 0.1 * pp})` }}>
                <Glass strong style={{ borderRadius: 60, padding: "16px 32px 16px 18px", display: "inline-flex", alignItems: "center", gap: 18, boxShadow: SHADOW }}>
                  <span style={{ width: 52, height: 52, borderRadius: 26, background: "linear-gradient(135deg,#10B981,#059669)", display: "grid", placeItems: "center", boxShadow: "0 8px 18px rgba(16,185,129,0.4)" }}><Check size={32} color="#fff" strokeWidth={3.4} /></span>
                  <span style={{ fontFamily: F.ui, fontWeight: 700, fontSize: i === 2 ? 31 : 36, color: C.ink, letterSpacing: "-0.015em" }}>{p.t}</span>
                </Glass>
              </div>
            );
          })}
        </div>
      </div>
    </AbsoluteFill>
  );
};
