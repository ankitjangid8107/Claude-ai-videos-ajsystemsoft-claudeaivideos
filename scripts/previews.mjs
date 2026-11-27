import { bundle } from "@remotion/bundler";
import { renderStill, selectComposition } from "@remotion/renderer";
import { readFileSync, mkdirSync } from "node:fs";
import path from "node:path";
import { enableTailwind } from "@remotion/tailwind";

const sync = JSON.parse(readFileSync("src/data/sync.json", "utf8"));
const extra = (process.argv[2] || "").split(",").filter(Boolean).map(Number); // extra absolute frames
const scale = Number(process.env.SCALE || 1);
mkdirSync("previews", { recursive: true });
const serveUrl = await bundle({ entryPoint: path.resolve("src/index.ts"), webpackOverride: (c) => enableTailwind(c) });
const comp = await selectComposition({ serveUrl, id: "AJReel" });
const frames = sync.scenes.map((s, i) => [`scene${i + 1}-${s.id}`, Math.round((s.startFrame + s.endFrame) / 2)]);
extra.forEach((f) => frames.push([`extra-${f}`, f]));
for (const [name, frame] of frames) {
  await renderStill({ composition: comp, serveUrl, frame, scale, output: `previews/${name}.png`, imageFormat: "png" });
  console.log("rendered", name, frame);
}
