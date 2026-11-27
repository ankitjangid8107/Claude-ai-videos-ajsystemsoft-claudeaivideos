import React from "react";
import { AbsoluteFill } from "remotion";
import { useAbsFrame } from "../lib/frame";
import { Search, Store, TrendingUp, UserPlus, PhoneCall, ShoppingBag, MapPin } from "lucide-react";
import { cue, cueEnd, scene, FPS } from "../lib/sync";
import { C, F, SHADOW, SHADOW_LG } from "../lib/theme";
import { pop, ramp } from "../lib/anim";
import { Glass } from "../components/Glass";

const QUERY = "best custom website & app developer near me";

export const Scene2Problem: React.FC = () => {
  const f = useAbsFrame();
  const s = scene("problem");
  const tSearch = cue("problem", "Customers");
  const tTypeEnd = cueEnd("problem", "search");
  const tOffline = cue("problem", "offline");
  const tAgar = cue("problem", "agar");
  const tComp = cue("problem", "competitors");
  const sf = s.startFrame;
  void sf; void FPS;

  const head = pop(f, tOffline - 20 > 0 ? 8 : 8);
  const typed = Math.floor(ramp(f, tSearch + 4, tTypeEnd + 6, 0, QUERY.length, false));
  const searchIn = pop(f, tSearch - 6);
  const caret = Math.floor(f / 15) % 2 === 0;

  // offline card sinks backward
  const sink = ramp(f, tAgar - 4, tAgar + 24, 0, 1);
  const offlineIn = pop(f, tOffline - 4);
  // competitor chart
  const compIn = ramp(f, tComp - 20, tComp + 40, 0, 1);
  const bars = [0.18, 0.26, 0.34, 0.5, 0.62, 0.78, 1.0];
  const leads = [
    { t: "+24 new leads", icon: <UserPlus size={26} />, x: 640, y: 745, d: 0 },
    { t: "Order placed", icon: <ShoppingBag size={26} />, x: 600, y: 1025, d: 12 },
    { t: "Call from Jaipur", icon: <PhoneCall size={26} />, x: 110, y: 1000, d: 24 },
  ];

  return (
    <AbsoluteFill>
      <div style={{ position: "absolute", left: 40, width: 950, top: 250, textAlign: "center", fontFamily: F.head, fontWeight: 800, fontSize: 70, letterSpacing: "-0.03em", lineHeight: 1.05, color: C.ink, opacity: head, transform: `translateY(${(1 - head) * 30}px)` }}>
        Customers pehle <span style={{ color: C.blue }}>online</span> dhoondte hain
      </div>

      {/* 3D search mockup */}
      <div style={{ position: "absolute", left: 90, top: 470, width: 850, opacity: searchIn, transform: `perspective(1600px) rotateX(${8 - searchIn * 4}deg) rotateY(-9deg) translateY(${(1 - searchIn) * 60}px)`, transformStyle: "preserve-3d" }}>
        <Glass strong style={{ padding: "26px 34px", borderRadius: 60, display: "flex", alignItems: "center", gap: 20, boxShadow: SHADOW_LG }}>
          <Search size={40} color={C.blue} strokeWidth={2.6} />
          <div style={{ fontFamily: F.ui, fontWeight: 500, fontSize: 36, color: C.ink, whiteSpace: "nowrap", letterSpacing: "-0.01em" }}>
            {QUERY.slice(0, typed)}
            <span style={{ display: "inline-block", width: 3, height: 40, background: caret ? C.blue : "transparent", marginLeft: 3, verticalAlign: "middle" }} />
          </div>
        </Glass>
        <div style={{ marginTop: 14, display: "flex", gap: 10, paddingLeft: 24, opacity: ramp(f, tTypeEnd, tTypeEnd + 10) }}>
          {["Websites", "Android & iOS apps", "Near me"].map((t) => (
            <div key={t} style={{ fontFamily: F.ui, fontWeight: 600, fontSize: 24, color: C.muted, background: "rgba(255,255,255,0.8)", border: C.border, borderRadius: 24, padding: "8px 18px" }}>{t}</div>
          ))}
        </div>
      </div>

      {/* Offline shop card */}
      <div
        style={{
          position: "absolute",
          left: 120,
          top: 760 + sink * 140,
          width: 560,
          opacity: offlineIn * (1 - sink * 0.62),
          transform: `perspective(1600px) translateZ(${-sink * 420}px) rotateX(${sink * 28}deg) rotateY(${-10 + sink * 8}deg) translateX(${(1 - offlineIn) * -200}px) scale(${0.92 + 0.08 * offlineIn})`,
          filter: `grayscale(${sink})`,
        }}
      >
        <Glass strong style={{ padding: 30, borderRadius: 36 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 18 }}>
            <div style={{ width: 84, height: 84, borderRadius: 24, background: "rgba(148,163,184,0.18)", display: "grid", placeItems: "center" }}><Store size={44} color="#64748B" /></div>
            <div>
              <div style={{ fontFamily: F.head, fontWeight: 800, fontSize: 36, color: C.ink, letterSpacing: "-0.02em" }}>Offline Shop</div>
              <div style={{ fontFamily: F.ui, fontWeight: 600, fontSize: 26, color: C.crimson, display: "flex", alignItems: "center", gap: 8, marginTop: 4 }}><MapPin size={24} /> Not Found Online</div>
            </div>
          </div>
        </Glass>
      </div>

      {/* Competitor growth chart */}
      <div
        style={{
          position: "absolute",
          left: 250,
          top: 880,
          width: 690,
          opacity: compIn,
          transform: `perspective(1800px) rotateY(-12deg) rotateX(7deg) translateY(${(1 - compIn) * 160}px) translateZ(${compIn * 40}px)`,
          transformStyle: "preserve-3d",
        }}
      >
        <Glass strong style={{ padding: "30px 34px 34px", borderRadius: 40, boxShadow: SHADOW_LG }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
            <div style={{ fontFamily: F.ui, fontWeight: 700, fontSize: 28, color: C.muted, letterSpacing: "0.08em" }}>COMPETITOR GROWTH</div>
            <div style={{ display: "flex", alignItems: "center", gap: 8, color: C.emerald, fontFamily: F.mono, fontWeight: 800, fontSize: 32 }}><TrendingUp size={32} />+{Math.round(compIn * 312)}%</div>
          </div>
          <div style={{ marginTop: 22, height: 270, display: "flex", alignItems: "flex-end", gap: 18 }}>
            {bars.map((b, i) => {
              const p = ramp(f, tComp - 10 + i * 5, tComp + 34 + i * 5, 0, 1);
              return <div key={i} style={{ flex: 1, height: `${b * p * 100}%`, borderRadius: "14px 14px 6px 6px", background: i === bars.length - 1 ? `linear-gradient(180deg,${C.emerald},#047857)` : `linear-gradient(180deg,${C.blue},#1D4ED8)`, boxShadow: "0 12px 24px rgba(37,99,235,0.25)" }} />;
            })}
          </div>
          <div style={{ marginTop: 16, fontFamily: F.ui, fontWeight: 600, fontSize: 26, color: C.ink }}>Aapke clients → <span style={{ color: C.crimson, fontWeight: 800 }}>competitors ke paas</span></div>
        </Glass>
      </div>

      {/* floating lead badges (parallax) */}
      {leads.map((l, i) => {
        const p = pop(f, tComp + 20 + l.d);
        const fl = Math.sin(f / 22 + i * 2) * 10;
        return (
          <div key={i} style={{ position: "absolute", left: l.x, top: l.y + 330 + fl, opacity: p, transform: `translateY(${(1 - p) * 50}px) scale(${0.8 + 0.2 * p}) translateZ(60px)`, zIndex: 5 }}>
            <Glass strong blur={false} style={{ borderRadius: 40, padding: "14px 26px 14px 18px", display: "flex", alignItems: "center", gap: 12, fontFamily: F.ui, fontWeight: 700, fontSize: 27, color: C.ink, boxShadow: SHADOW }}>
              <span style={{ width: 44, height: 44, borderRadius: 22, background: "rgba(16,185,129,0.14)", color: C.emerald, display: "grid", placeItems: "center" }}>{l.icon}</span>
              {l.t}
            </Glass>
          </div>
        );
      })}
    </AbsoluteFill>
  );
};
