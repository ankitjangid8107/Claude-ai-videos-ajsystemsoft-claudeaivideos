import React from "react";
import { AbsoluteFill, interpolate } from "remotion";
import { useAbsFrame } from "../lib/frame";
import { Sparkles, Layers, Briefcase } from "lucide-react";
import { cue, scene } from "../lib/sync";
import { C, F, SHADOW_LG } from "../lib/theme";
import { pop, ramp } from "../lib/anim";
import { Sweep } from "../components/Glass";

const CW = 780, CH = 300;
const CX = 515; // content centre x (keeps right safe zone clear)

const Front: React.FC<{ name: string; price: string; sub: string; icon: React.ReactNode }> = ({ name, price, sub, icon }) => (
  <div style={{ position: "absolute", inset: 0, backfaceVisibility: "hidden", borderRadius: 44, background: "linear-gradient(145deg,rgba(255,255,255,0.97),rgba(244,247,252,0.94))", border: C.border, boxShadow: SHADOW_LG, padding: "38px 46px", display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
    <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
      <div style={{ width: 58, height: 58, borderRadius: 18, background: "rgba(37,99,235,0.10)", display: "grid", placeItems: "center" }}>{icon}</div>
      <div style={{ fontFamily: F.ui, fontWeight: 700, fontSize: 30, letterSpacing: "0.12em", color: C.muted }}>{name}</div>
      <div style={{ marginLeft: "auto", fontFamily: F.ui, fontWeight: 600, fontSize: 24, color: C.muted }}>{sub}</div>
    </div>
    <div style={{ fontFamily: F.mono, fontWeight: 800, fontSize: 118, letterSpacing: "-0.04em", color: C.ink, lineHeight: 1, fontVariantNumeric: "tabular-nums" }}>{price}</div>
  </div>
);

const Back: React.FC<{ glow: number }> = ({ glow }) => (
  <div style={{ position: "absolute", inset: 0, backfaceVisibility: "hidden", transform: "rotateY(180deg)", borderRadius: 44, overflow: "hidden", background: "linear-gradient(135deg,#047857 0%,#10B981 42%,#F59E0B 100%)", boxShadow: `0 0 ${60 * glow}px rgba(16,185,129,0.45), ${SHADOW_LG}`, border: "1px solid rgba(255,255,255,0.5)", display: "flex", alignItems: "center", padding: "0 44px", gap: 30 }}>
    <div style={{ fontFamily: F.mono, fontWeight: 800, fontSize: 210, color: "#fff", letterSpacing: "-0.06em", lineHeight: 1, textShadow: "0 6px 24px rgba(4,120,87,0.45)" }}>₹0</div>
    <div style={{ color: "#fff", fontFamily: F.head, lineHeight: 1.08 }}>
      <div style={{ fontFamily: F.ui, fontWeight: 700, fontSize: 24, letterSpacing: "0.16em", opacity: 0.92 }}>CHRISTMAS GIFT</div>
      <div style={{ fontWeight: 800, fontSize: 52, letterSpacing: "-0.03em", margin: "8px 0" }}>6 MONTHS FREE</div>
      <div style={{ fontFamily: F.ui, fontWeight: 600, fontSize: 26, opacity: 0.95 }}>Website + Mobile App</div>
    </div>
    <Sweep p={((glow * 3) % 1)} radius={44} color="255,255,255" />
  </div>
);

export const Scene1Hook: React.FC = () => {
  const f = useAbsFrame();
  const s = scene("hook");
  const tEk = cue("hook", "Ek"), tSecond = cue("hook", "second"), tRukiye = cue("hook", "rukiye");
  const tA = cue("hook", "pachchis"), tB = cue("hook", "pachhattar");
  const tMat = cue("hook", "Mat");
  const tFlip = tMat + 4;

  const slashP = ramp(f, tMat, tMat + 6, 0, 1);
  const flip = ramp(f, tFlip, tFlip + 22, 0, 1);
  const merge = ramp(f, tFlip - 2, tFlip + 24, 0, 1);

  const enterA = pop(f, tA), enterB = pop(f, tB);
  const hl = (at: number, txt: string, color = C.ink) => {
    const p = pop(f, at, { damping: 15, stiffness: 170 });
    return <span style={{ display: "inline-block", opacity: p, transform: `translateY(${(1 - p) * 60}px) scale(${0.9 + 0.1 * p})`, color, marginRight: 24 }}>{txt}</span>;
  };
  const headOut = 1 - ramp(f, tMat - 2, tMat + 8, 0, 1);
  const mat = pop(f, tMat + 2, { damping: 14, stiffness: 160 });

  // card geometry
  const cardCenter = (i: 0 | 1) => {
    const y0 = i === 0 ? 835 : 1165;
    const y1 = 1010;
    return y0 + (y1 - y0) * merge;
  };
  const card = (i: 0 | 1, enter: number) => {
    const sc = 1 + 0.22 * merge;
    const tiltY = (i === 0 ? -11 : 9) * (1 - merge) + Math.sin(f / 40 + i) * 2;
    const tiltX = 6 * (1 - merge);
    const fadeB = i === 1 ? 1 - ramp(f, tFlip + 4, tFlip + 18, 0, 1) : 1;
    return (
      <div
        key={i}
        style={{
          position: "absolute",
          left: CX - CW / 2,
          top: cardCenter(i) - CH / 2,
          width: CW,
          height: CH,
          opacity: enter * fadeB,
          transform: `translateX(${(1 - enter) * (i === 0 ? -260 : 260)}px) translateZ(${(1 - enter) * -300}px) rotateX(${tiltX}deg) rotateY(${tiltY + flip * 180}deg) scale(${sc})`,
          transformStyle: "preserve-3d",
          zIndex: i === 0 ? 3 : 2,
        }}
      >
        {i === 0 ? <Front name="STARTER" price="₹25,000" sub="Website + App" icon={<Layers size={30} color={C.blue} />} /> : <Front name="BUSINESS" price="₹75,000" sub="Website + App" icon={<Briefcase size={30} color={C.blue} />} />}
        <Back glow={flip} />
      </div>
    );
  };

  // metallic crimson slash
  const slashAng = -12;
  return (
    <AbsoluteFill>
      {/* radiant burst behind the ₹0 reveal */}
      <div style={{ position: "absolute", left: CX - 620, top: 1010 - 620, width: 1240, height: 1240, opacity: flip, transform: `scale(${0.6 + 0.4 * flip}) rotate(${f * 0.4}deg)`, background: "conic-gradient(from 0deg, rgba(16,185,129,0) 0deg, rgba(251,191,36,0.20) 20deg, rgba(16,185,129,0) 40deg, rgba(16,185,129,0) 60deg, rgba(251,191,36,0.20) 80deg, rgba(16,185,129,0) 100deg, rgba(16,185,129,0) 120deg, rgba(251,191,36,0.20) 140deg, rgba(16,185,129,0) 160deg, rgba(16,185,129,0) 180deg, rgba(251,191,36,0.2) 200deg, rgba(16,185,129,0) 220deg, rgba(16,185,129,0) 240deg, rgba(251,191,36,0.2) 260deg, rgba(16,185,129,0) 280deg, rgba(16,185,129,0) 300deg, rgba(251,191,36,0.2) 320deg, rgba(16,185,129,0) 340deg)", maskImage: "radial-gradient(circle, #000 20%, transparent 68%)", WebkitMaskImage: "radial-gradient(circle, #000 20%, transparent 68%)" }} />

      {/* kinetic headline */}
      <div style={{ position: "absolute", left: 40, width: 950, top: 262, textAlign: "center", fontFamily: F.head, fontWeight: 800, fontSize: 132, letterSpacing: "-0.03em", lineHeight: 1.0, color: C.ink, opacity: headOut, transform: `translateY(${(1 - headOut) * -40}px)` }}>
        <div>{hl(tEk, "EK")}{hl(tSecond, "SECOND", C.ink)}</div>
        <div>{hl(tRukiye, "RUKIYE", C.blue)}</div>
      </div>
      <div style={{ position: "absolute", left: 40, width: 950, top: 262, textAlign: "center", fontFamily: F.head, fontWeight: 800, fontSize: 150, letterSpacing: "-0.04em", lineHeight: 1, color: C.crimson, opacity: mat, transform: `translateY(${(1 - mat) * 50}px) scale(${0.92 + 0.08 * mat})`, textShadow: "0 12px 40px rgba(220,38,38,0.25)" }}>
        <div>MAT</div>
        <div>KIJIYE.</div>
      </div>
      <div style={{ position: "absolute", left: 40, width: 950, top: 590, textAlign: "center", fontFamily: F.ui, fontWeight: 600, fontSize: 31, color: C.muted, opacity: headOut * pop(f, tA - 10) }}>
        Website + Mobile App ka typical agency quote
      </div>

      <div style={{ position: "absolute", inset: 0, transformStyle: "preserve-3d" }}>
        {card(1, enterB)}
        {card(0, enterA)}
      </div>

      {/* crimson metallic slash across both prices */}
      {slashP > 0 && slashP < 1.0 && flip < 0.4 && (
        <div style={{ position: "absolute", left: CX - 520, top: 1000 - 14, width: 1040, height: 28, zIndex: 20, transform: `rotate(${slashAng}deg) scaleX(${slashP})`, transformOrigin: "left center", borderRadius: 14, background: "linear-gradient(180deg,#FCA5A5 0%,#DC2626 35%,#7F1D1D 100%)", boxShadow: "0 0 40px rgba(220,38,38,0.55), 0 10px 30px rgba(127,29,29,0.4)" }} />
      )}
      {slashP >= 1 && flip < 0.35 && (
        <div style={{ position: "absolute", left: CX - 520, top: 1000 - 14, width: 1040, height: 28, zIndex: 20, transform: `rotate(${slashAng}deg)`, borderRadius: 14, background: "linear-gradient(180deg,#FCA5A5 0%,#DC2626 35%,#7F1D1D 100%)", boxShadow: "0 0 40px rgba(220,38,38,0.55)", opacity: 1 - flip / 0.35 }} />
      )}

      {/* sparkle caption after reveal */}
      <div style={{ position: "absolute", left: 40, width: 950, top: 1290, display: "flex", justifyContent: "center", opacity: ramp(f, tFlip + 22, tFlip + 38), transform: `translateY(${(1 - ramp(f, tFlip + 22, tFlip + 38)) * 24}px)` }}>
        <div style={{ display: "flex", alignItems: "center", gap: 12, background: "rgba(16,185,129,0.10)", border: "1px solid rgba(16,185,129,0.35)", borderRadius: 40, padding: "14px 30px", fontFamily: F.ui, fontWeight: 700, fontSize: 30, color: "#047857" }}>
          <Sparkles size={30} /> Is Christmas — poora development FREE
        </div>
      </div>
      <div style={{ display: "none" }}>{interpolate(f, [0, 1], [0, 1])}{s.start}</div>
    </AbsoluteFill>
  );
};
