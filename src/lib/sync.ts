import raw from "../data/sync.json";

export type Word = { w: string; spoken: string; scene: number; start: number; end: number; punct: string };
export type Caption = { start: number; end: number; first: number; last: number };
export type SceneInfo = { id: string; start: number; end: number; startFrame: number; endFrame: number };

export const SYNC = raw as unknown as {
  fps: number;
  duration: number;
  durationInFrames: number;
  scenes: SceneInfo[];
  words: Word[];
  captions: Caption[];
};

export const FPS = SYNC.fps;
export const TOTAL_FRAMES = SYNC.durationInFrames;
export const SCENE_IDS = ["hook", "problem", "brand", "offer", "dashboard", "slots", "cta"] as const;
export type SceneId = (typeof SCENE_IDS)[number];

export const scene = (id: SceneId) => SYNC.scenes[SCENE_IDS.indexOf(id)];

const norm = (s: string) => s.toLowerCase().replace(/[^a-z0-9₹]/g, "");

/** Start time (seconds) of the nth (0-based) occurrence of `word` in the scene. Falls back to scene start. */
export const cueSec = (id: SceneId, word: string, nth = 0): number => {
  const si = SCENE_IDS.indexOf(id);
  const hits = SYNC.words.filter((x) => x.scene === si && norm(x.w) === norm(word));
  const h = hits[nth] ?? hits[hits.length - 1];
  return h ? h.start : SYNC.scenes[si].start;
};
/** Same as cueSec but returns the END time of the word. */
export const cueEndSec = (id: SceneId, word: string, nth = 0): number => {
  const si = SCENE_IDS.indexOf(id);
  const hits = SYNC.words.filter((x) => x.scene === si && norm(x.w) === norm(word));
  const h = hits[nth] ?? hits[hits.length - 1];
  return h ? h.end : SYNC.scenes[si].end;
};
export const cue = (id: SceneId, word: string, nth = 0) => Math.round(cueSec(id, word, nth) * FPS);
export const cueEnd = (id: SceneId, word: string, nth = 0) => Math.round(cueEndSec(id, word, nth) * FPS);
