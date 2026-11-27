import { spring, interpolate, Easing } from "remotion";
import { FPS } from "./sync";

/** Calibrated luxury spring: damping 14-18, stiffness 120-180 */
export const pop = (frame: number, at: number, opts: { damping?: number; stiffness?: number; mass?: number } = {}) =>
  spring({ frame: frame - at, fps: FPS, config: { damping: opts.damping ?? 16, stiffness: opts.stiffness ?? 150, mass: opts.mass ?? 0.9 } });

export const ramp = (frame: number, from: number, to: number, a = 0, b = 1, ease = true) =>
  interpolate(frame, [from, to], [a, b], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: ease ? Easing.bezier(0.22, 1, 0.36, 1) : undefined,
  });

export const rnd = (seed: number) => {
  const x = Math.sin(seed * 12.9898 + 78.233) * 43758.5453;
  return x - Math.floor(x);
};

export const inr = (n: number) => {
  const s = Math.round(n).toString();
  if (s.length <= 3) return s;
  const last = s.slice(-3);
  const rest = s.slice(0, -3).replace(/\B(?=(\d{2})+(?!\d))/g, ",");
  return `${rest},${last}`;
};
