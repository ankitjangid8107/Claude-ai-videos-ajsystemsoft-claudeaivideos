import React from "react";
import { AbsoluteFill } from "remotion";
import { useAbsFrame } from "../lib/frame";
import { cue, scene } from "../lib/sync";
import { C, F, SHADOW, SHADOW_LG } from "../lib/theme";
import { pop, ramp, inr } from "../lib/anim";
import { Glass } from "../components/Glass";
import { Receipt, Boxes, IndianRupee } from "lucide-react";

const DAYS = [["Mon", 142], ["Tue", 168], ["Wed", 155], ["Thu", 191], ["Fri", 176], ["Sat", 224], ["Sun", 184]] as const;
const DARK = { bg: "#0B0F19", panel: "#111827", line: "rgba(255,255,255,0.08)", txt: "#F8FAFC", mut: "#94A3B8" };

const Tile: React.FC<{ label: string; value: string; delta: string; good?: boolean; small?: boolean }> = ({ label, value, delta, good = true, small }) => (
  <div style={{ flex: 1, background: DARK.panel, border: `1px solid ${DARK.line}`, borderRadius: 14, padding: small ? "10px 12px" : "14px 16px" }}>
    <div style={{ fontFamily: F.ui, fontWeight: 600, fontSize: small ? 11 : 14, color: DARK.mut }}>{label}</div>
    <div style={{ fontFamily: F.mono, fontWeight: 800, fontSize: small ? 20 : 28, color: DARK.txt, letterSpacing: "-0.04em", fontVariantNumeric: "tabular-nums", marginTop: 4, whiteSpace: "nowrap" }}>{value}</div>
    <div style={{ fontFamily: F.ui, fontWeight: 700, fontSize: small ? 10 : 13, color: good ? "#34D399" : "#F87171", marginTop: 2 }}>{delta}</div>
  </div>
);

const Chart: React.FC<{ p: (i: number) => number; h: number }> = ({ p, h }) => (
  <div style={{ display: "flex", alignItems: "flex-end", gap: 10, height: h }}>
    {DAYS.map(([d, v], i) => (
      <div key={d} style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "flex-end", height: "100%" }}>
        <div style={{ fontFamily: F.mono, fontWeight: 700, fontSize: 12, color: DARK.mut, marginBottom: 4, opacity: p(i) }}>{v}</div>
        <div style={{ width: "100%", height: `${(v / 224) * 100 * p(i) * 0.78}%`, borderRadius: "7px 7px 3px 3px", background: d === "Sat" ? "linear-gradient(180deg,#60A5FA,#2563EB)" : "linear-gradient(180deg,#334155,#1E293B)" }} />
        <div style={{ fontFamily: F.ui, fontWeight: 600, fontSize: 12, color: DARK.mut, marginTop: 6 }}>{d}</div>
      </div>
    ))}
  </div>
);

const ROW1 = [["Retail Stores", "retail"], ["Clinics & Hospitals", "clinic"], ["Hotels", "hotel"], ["Manufacturing", "manufacturing"], ["Coaching Institutes", "coaching"]] as const;
const ROW2 = [["Smart Admin Panel", "admin"], ["SEO Setup", "SEO"], ["Live Billing", "billing"], ["Inventory", "inventory"], ["Sales Tracking", "tracking"]] as const;

export const Scene5Dashboard: React.FC = () => {
  const f = useAbsFrame();
  const s = scene("dashboard");
  const t0 = s.startFrame;
  const devIn = pop(f, t0 + 6, { damping: 17, stiffness: 120 });
  const phoneIn = pop(f, t0 + 22, { damping: 16, stiffness: 130 });
  const count = ramp(f, t0 + 26, t0 + 110, 0, 1);
  const barP = (i: number) => ramp(f, t0 + 50 + i * 7, t0 + 100 + i * 7, 0, 1);
  const sway = Math.sin((f - t0) / 90);
  const tAuto = cue("dashboard", "autopilot");
  const auto = pop(f, tAuto - 8);
  const mq = (f - t0);

  const marquee = (items: readonly (readonly [string, string])[], dir: 1 | -1, speed: number, top: number) => {
    const itemW = 360;
    const total = items.length * itemW;
    const off = (((mq * speed) % total) + total) % total;
    const list = [...items, ...items, ...items];
    const rowIn = pop(f, t0 + 30);
    return (
      <div style={{ position: "absolute", left: 0, width: 1080, top, height: 96, overflow: "hidden", opacity: rowIn, maskImage: "linear-gradient(90deg,transparent,#000 8%,#000 80%,transparent)", WebkitMaskImage: "linear-gradient(90deg,transparent,#000 8%,#000 80%,transparent)" }}>
        <div style={{ position: "absolute", left: dir === 1 ? -total + off : -off, top: 0, display: "flex" }}>
          {list.map(([label, word], i) => {
            const lit = f >= cue("dashboard", word) - 2;
            const k = lit ? pop(f, cue("dashboard", word) - 2, { damping: 14, stiffness: 170 }) : 0;
            return (
              <div key={i} style={{ width: itemW, display: "flex", justifyContent: "center" }}>
                <div style={{ fontFamily: F.ui, fontWeight: 700, fontSize: 34, whiteSpace: "nowrap", borderRadius: 60, padding: "20px 36px", border: lit ? "1px solid rgba(37,99,235,0.5)" : C.border, background: lit ? "linear-gradient(135deg,#2563EB,#1D4ED8)" : "rgba(255,255,255,0.85)", color: lit ? "#fff" : C.ink, boxShadow: lit ? `0 12px 28px rgba(37,99,235,${0.18 + 0.2 * k})` : SHADOW, transform: `scale(${1 + 0.05 * Math.sin(k * Math.PI)})` }}>{label}</div>
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  return (
    <AbsoluteFill>
      <div style={{ position: "absolute", left: 40, width: 950, top: 250, textAlign: "center", fontFamily: F.head, fontWeight: 800, fontSize: 64, letterSpacing: "-0.03em", lineHeight: 1.05, color: C.ink, opacity: pop(f, t0 + 2) }}>
        Aapka business <span style={{ color: C.blue }}>autopilot</span> par
      </div>

      {/* devices */}
      <div style={{ position: "absolute", left: 0, top: 400, width: 1080, height: 700, perspective: 2000, perspectiveOrigin: "50% 40%", opacity: devIn }}>
        {/* laptop */}
        <div style={{ position: "absolute", left: 45, top: 40 + (1 - devIn) * 120, width: 740, transformStyle: "preserve-3d", transform: `rotateY(${-15 + sway * 6}deg) rotateX(${6}deg)` }}>
          <div style={{ borderRadius: "26px 26px 8px 8px", padding: 16, background: "linear-gradient(145deg,#E5E7EB,#9CA3AF)", boxShadow: `${SHADOW_LG}, inset 0 0 0 2px rgba(255,255,255,0.6)` }}>
            <div style={{ width: 708, height: 440, background: DARK.bg, borderRadius: 14, padding: 18, overflow: "hidden", position: "relative" }}>
              <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 14 }}>
                {[["Billing", <Receipt key="a" size={14} />], ["Inventory", <Boxes key="b" size={14} />], ["Payments", <IndianRupee key="c" size={14} />]].map(([t, ic], i) => (
                  <div key={i} style={{ display: "flex", alignItems: "center", gap: 6, padding: "7px 14px", borderRadius: 18, background: i === 0 ? "#2563EB" : "transparent", color: i === 0 ? "#fff" : DARK.mut, fontFamily: F.ui, fontWeight: 600, fontSize: 14 }}>{ic as React.ReactNode}{t as string}</div>
                ))}
                <div style={{ marginLeft: "auto", display: "flex", alignItems: "center", gap: 6, fontFamily: F.ui, fontWeight: 700, fontSize: 12, color: DARK.mut }}>
                  <span style={{ width: 8, height: 8, borderRadius: 4, background: "#10B981", boxShadow: `0 0 ${6 + 6 * Math.sin(f / 8)}px #10B981` }} /> LIVE · SAMPLE DATA
                </div>
              </div>
              <div style={{ display: "flex", gap: 12 }}>
                <Tile label="Today's sales" value={`₹${inr(184250 * count)}`} delta={`+${(12.4 * count).toFixed(1)}% vs last week`} />
                <Tile label="Invoices generated" value={`${Math.round(126 * count)}`} delta="+18 vs last week" />
                <Tile label="Avg. billing time" value={`${Math.round(48 * count)} sec`} delta="-82% vs last week" />
              </div>
              <div style={{ marginTop: 14, background: DARK.panel, border: `1px solid ${DARK.line}`, borderRadius: 14, padding: "12px 16px 10px" }}>
                <div style={{ fontFamily: F.ui, fontWeight: 600, fontSize: 13, color: DARK.mut, marginBottom: 6 }}>Daily sales this week · ₹ thousand</div>
                <Chart p={barP} h={218} />
              </div>
            </div>
          </div>
          <div style={{ height: 22, margin: "0 -40px", borderRadius: "0 0 40px 40px", background: "linear-gradient(180deg,#D1D5DB,#9CA3AF)", boxShadow: "0 30px 50px rgba(15,23,42,0.25)" }} />
          <div style={{ height: 120, margin: "6px 20px 0", opacity: 0.16, transform: "scaleY(-1)", background: "linear-gradient(180deg,rgba(15,23,42,0.5),transparent)", filter: "blur(8px)", borderRadius: 20 }} />
        </div>

        {/* iPhone */}
        <div style={{ position: "absolute", left: 705, top: 150 + (1 - phoneIn) * 200, width: 262, opacity: phoneIn, transformStyle: "preserve-3d", transform: `rotateY(${-18 + sway * 8}deg) rotateX(5deg) translateZ(90px)` }}>
          <div style={{ borderRadius: 52, padding: 11, background: "linear-gradient(145deg,#F3F4F6,#9CA3AF)", boxShadow: `${SHADOW_LG}, inset 0 0 0 2px rgba(255,255,255,0.7)` }}>
            <div style={{ width: 240, height: 500, borderRadius: 42, background: DARK.bg, padding: "14px 12px", overflow: "hidden", position: "relative" }}>
              <div style={{ position: "absolute", top: 10, left: "50%", marginLeft: -45, width: 90, height: 26, borderRadius: 14, background: "#000" }} />
              <div style={{ marginTop: 34, fontFamily: F.ui, fontWeight: 700, fontSize: 13, color: DARK.mut }}>Today's sales</div>
              <div style={{ fontFamily: F.mono, fontWeight: 800, fontSize: 27, color: DARK.txt, letterSpacing: "-0.04em", whiteSpace: "nowrap" }}>₹{inr(184250 * count)}</div>
              <div style={{ fontFamily: F.ui, fontWeight: 700, fontSize: 12, color: "#34D399" }}>+{(12.4 * count).toFixed(1)}% vs last week</div>
              <div style={{ display: "flex", gap: 8, marginTop: 12 }}>
                <Tile small label="Invoices" value={`${Math.round(126 * count)}`} delta="+18" />
                <Tile small label="Avg. bill" value={`${Math.round(48 * count)}s`} delta="-82%" />
              </div>
              <div style={{ marginTop: 12, background: DARK.panel, borderRadius: 12, padding: "8px 8px 6px", border: `1px solid ${DARK.line}` }}><Chart p={barP} h={150} /></div>
              {[["INV-2041", "₹18,400"], ["INV-2040", "₹7,250"], ["INV-2039", "₹32,900"]].map(([a, b], i) => (
                <div key={a} style={{ display: "flex", justifyContent: "space-between", marginTop: 8, fontFamily: F.mono, fontWeight: 600, fontSize: 12, color: DARK.txt, opacity: ramp(f, t0 + 90 + i * 8, t0 + 110 + i * 8) }}><span style={{ color: DARK.mut }}>{a}</span><span>{b}</span></div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* industry marquee */}
      {marquee(ROW1, 1, 2.6, 1170)}
      {marquee(ROW2, -1, 2.2, 1290)}
      <div style={{ position: "absolute", left: 40, width: 950, top: 1420, textAlign: "center", fontFamily: F.ui, fontWeight: 700, fontSize: 30, color: C.emerald, opacity: auto, transform: `translateY(${(1 - auto) * 20}px)` }}>● Cloud speed • Fast • Autopilot</div>
    </AbsoluteFill>
  );
};
