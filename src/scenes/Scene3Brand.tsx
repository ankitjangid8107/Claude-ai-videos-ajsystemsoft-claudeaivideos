import React from "react";
import { AbsoluteFill, Img, staticFile } from "remotion";
import { useAbsFrame } from "../lib/frame";
import { BadgeCheck, Smartphone, Cloud, Database, Atom, Triangle, Layers } from "lucide-react";
import { cue, scene } from "../lib/sync";
import { C, F, SHADOW, SHADOW_LG } from "../lib/theme";
import { pop, ramp } from "../lib/anim";
import { Glass, Sweep } from "../components/Glass";

const TECH = [
  { t: "React", icon: <Atom size={28} />, c: "#0EA5E9", x: 20, y: 40, z: 90, at: "websites" },
  { t: "Next.js", icon: <Triangle size={26} />, c: C.ink, x: 700, y: 70, z: 60, at: "websites" },
  { t: "Android & iOS", icon: <Smartphone size={28} />, c: C.emerald, x: -10, y: 390, z: 110, at: "Android" },
  { t: "Flutter", icon: <Layers size={28} />, c: C.blue, x: 740, y: 430, z: 80, at: "iOS" },
  { t: "Supabase", icon: <Database size={28} />, c: "#059669", x: 10, y: 690, z: 70, at: "SaaS" },
  { t: "Cloud AI", icon: <Cloud size={28} />, c: "#7C3AED", x: 720, y: 720, z: 100, at: "dashboards" },
] as const;

export const Scene3Brand: React.FC = () => {
  const f = useAbsFrame();
  const s = scene("brand");
  const len = s.endFrame - s.startFrame;
  const tBrand = cue("brand", "AJ");
  const tMsme = cue("brand", "MSME");
  const tWeb = cue("brand", "websites");
  const logoIn = pop(f, tBrand - 8, { damping: 15, stiffness: 140 });
  const badgeIn = pop(f, tMsme + 2);
  const browserIn = pop(f, tMsme + 16, { damping: 18, stiffness: 110 });
  const scroll = ramp(f, tWeb, s.endFrame - 30, 0, 1, false);
  const orbit = Math.sin(((f - s.startFrame) / len) * Math.PI * 1.6); // -1..1 camera orbit
  const sweepP = ((f - tBrand) / 70) % 1;

  // compact the brand header once browser rises
  const compact = ramp(f, tMsme + 10, tMsme + 36, 0, 1);

  return (
    <AbsoluteFill>
      {/* lead-in line while the voice says "Isi gap ko khatam karne aaya hai" */}
      <div style={{ position: "absolute", left: 40, width: 950, top: 560, textAlign: "center", fontFamily: F.head, fontWeight: 800, fontSize: 92, lineHeight: 1.04, letterSpacing: "-0.035em", color: C.ink, opacity: pop(f, s.startFrame + 4) * (1 - logoIn), transform: `translateY(${(1 - pop(f, s.startFrame + 4)) * 50 - logoIn * 30}px)` }}>
        Isi <span style={{ color: C.crimson }}>gap</span> ko<br />khatam karne<br />aaya hai
      </div>

      {/* brand reveal */}
      <div style={{ position: "absolute", left: 40, width: 950, top: 262 + (1 - logoIn) * 40 - compact * 0, display: "flex", flexDirection: "column", alignItems: "center", opacity: logoIn, transform: `perspective(1400px) rotateX(${(1 - logoIn) * 14}deg) scale(${0.9 + 0.1 * logoIn})` }}>
        <Glass strong style={{ padding: "22px 40px 22px 26px", borderRadius: 52, display: "flex", alignItems: "center", gap: 24, boxShadow: SHADOW_LG, overflow: "hidden" }}>
          <div style={{ width: 104, height: 104, borderRadius: 30, background: "linear-gradient(145deg,#3B82F6,#1D4ED8)", display: "grid", placeItems: "center", color: "#fff", fontFamily: F.head, fontWeight: 800, fontSize: 52, letterSpacing: "-0.04em", boxShadow: "0 14px 30px rgba(37,99,235,0.4), inset 0 2px 0 rgba(255,255,255,0.35)" }}>AJ</div>
          <div style={{ fontFamily: F.head, fontWeight: 800, color: C.ink, lineHeight: 1.02, letterSpacing: "-0.03em" }}>
            <div style={{ fontSize: 56 }}>AJ System Soft</div>
            <div style={{ fontSize: 44, color: C.blue }}>Technology</div>
          </div>
          <Sweep p={sweepP} radius={52} />
        </Glass>
        <div style={{ marginTop: 22, opacity: badgeIn, transform: `translateY(${(1 - badgeIn) * 24}px) scale(${0.9 + 0.1 * badgeIn})` }}>
          <div style={{ display: "flex", alignItems: "center", gap: 12, background: "linear-gradient(135deg,#ECFDF5,#fff)", border: "1px solid rgba(16,185,129,0.4)", borderRadius: 40, padding: "12px 28px 12px 18px", boxShadow: "0 10px 26px rgba(16,185,129,0.18)" }}>
            <BadgeCheck size={38} color={C.emerald} fill="rgba(16,185,129,0.16)" />
            <div style={{ fontFamily: F.mono, fontWeight: 700, fontSize: 25, color: "#065F46", letterSpacing: "-0.01em" }}>MSME Registered • UDYAM-RJ-17-0685557</div>
          </div>
        </div>
      </div>

      {/* 3D browser window with the real ajsystemsoft.in homepage */}
      <div style={{ position: "absolute", left: 0, right: 0, top: 560, height: 960, perspective: 1900, opacity: browserIn }}>
        <div style={{ position: "absolute", left: 130, top: 40 + (1 - browserIn) * 260, width: 760, transformStyle: "preserve-3d", transform: `rotateY(${orbit * -16}deg) rotateX(${7 - orbit * 2}deg) rotateZ(${orbit * 1.2}deg) translateZ(${browserIn * 20}px)` }}>
          <div style={{ borderRadius: 30, overflow: "hidden", background: "#0B0F19", border: "1px solid rgba(15,23,42,0.25)", boxShadow: `${-orbit * 40}px 60px 100px rgba(15,23,42,0.28), 0 18px 36px rgba(15,23,42,0.2)` }}>
            <div style={{ height: 52, background: "#1E293B", display: "flex", alignItems: "center", gap: 10, padding: "0 20px" }}>
              {["#EF4444", "#F59E0B", "#10B981"].map((c) => <span key={c} style={{ width: 14, height: 14, borderRadius: 7, background: c }} />)}
              <div style={{ marginLeft: 16, flex: 1, height: 32, borderRadius: 16, background: "#0F172A", color: "#94A3B8", fontFamily: F.mono, fontWeight: 500, fontSize: 19, display: "flex", alignItems: "center", padding: "0 16px" }}>https://www.ajsystemsoft.in</div>
            </div>
            <div style={{ height: 640, overflow: "hidden", position: "relative" }}>
              <Img src={staticFile("site-tall.png")} style={{ position: "absolute", left: 0, top: 0, width: 760, transform: `translateY(${-scroll * 760}px)` }} />
              <div style={{ position: "absolute", inset: 0, background: "linear-gradient(135deg,rgba(255,255,255,0.12) 0%,rgba(255,255,255,0) 40%)" }} />
            </div>
          </div>
          {/* floor reflection */}
          <div style={{ position: "absolute", top: "100%", left: 0, right: 0, height: 120, marginTop: 14, opacity: 0.18, background: "linear-gradient(180deg,rgba(15,23,42,0.5),transparent)", transform: "scaleY(-1)", borderRadius: 30, filter: "blur(10px)" }} />
        </div>
        {TECH.map((b, i) => {
          const p = pop(f, cue("brand", b.at) + 2 + (i % 2) * 6);
          const fl = Math.sin(f / 26 + i * 1.7) * 12;
          const par = orbit * (b.z - 70) * 0.9;
          return (
            <div key={b.t} style={{ position: "absolute", left: b.x + par, top: b.y + fl + 60, opacity: p, transform: `translateZ(${b.z}px) scale(${0.7 + 0.3 * p})`, zIndex: 10 }}>
              <Glass strong blur={false} style={{ borderRadius: 40, padding: "13px 26px 13px 16px", display: "flex", alignItems: "center", gap: 12, fontFamily: F.ui, fontWeight: 700, fontSize: 28, color: C.ink, boxShadow: SHADOW }}>
                <span style={{ width: 46, height: 46, borderRadius: 23, background: `${b.c}18`, color: b.c, display: "grid", placeItems: "center" }}>{b.icon}</span>
                {b.t}
              </Glass>
            </div>
          );
        })}
      </div>
    </AbsoluteFill>
  );
};
