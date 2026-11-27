// Robust chunked render: bundle once, fresh Chromium every N frames, per-chunk retries, lossless join, exact voiceover mux.
// usage: node scripts/render-chunks.mjs <scale> <out.mp4> [chunkFrames=80] [concurrency=4]
import { bundle } from "@remotion/bundler";
import { renderMedia, selectComposition } from "@remotion/renderer";
import { enableTailwind } from "@remotion/tailwind";
import { mkdtempSync, writeFileSync, mkdirSync, rmSync } from "node:fs";
import { execFileSync } from "node:child_process";
import path from "node:path";
import os from "node:os";

const [scaleArg, out, chunkArg, concArg] = process.argv.slice(2);
const scale = Number(scaleArg), CH = Number(chunkArg || 80), CONC = Number(concArg || 4);
const work = mkdtempSync(path.join(os.tmpdir(), "aj-chunks-"));
mkdirSync(path.dirname(out), { recursive: true });
const serveUrl = await bundle({ entryPoint: path.resolve("src/index.ts"), webpackOverride: (c) => enableTailwind(c) });
const comp = await selectComposition({ serveUrl, id: "AJReel" });
const total = comp.durationInFrames;
console.log(`total=${total} scale=${scale} chunk=${CH} work=${work}`);
const files = [];
const t0 = Date.now();
for (let s = 0, i = 0; s < total; s += CH, i++) {
  const e = Math.min(total - 1, s + CH - 1);
  const f = path.join(work, `c${String(i).padStart(3, "0")}.mp4`);
  let ok = false;
  for (let a = 1; a <= 5 && !ok; a++) {
    try {
      await renderMedia({
        composition: comp, serveUrl, codec: "h264", pixelFormat: "yuv420p", crf: 18, outputLocation: f,
        frameRange: [s, e], scale, muted: true, concurrency: CONC, timeoutInMilliseconds: 120000,
        chromiumOptions: { enableMultiProcessOnLinux: true }, overwrite: true,
      });
      ok = true;
    } catch (err) {
      console.log(`chunk ${i} (${s}-${e}) attempt ${a} failed: ${String(err.message).split("\n")[0]}`);
    }
  }
  if (!ok) { console.log("chunk failed permanently"); process.exit(1); }
  files.push(f);
  console.log(`== chunk ${i} ${s}-${e} ok  (${Math.round((Date.now() - t0) / 1000)}s elapsed, ${Math.round(((e + 1) / total) * 100)}%)`);
}
const list = path.join(work, "list.txt");
writeFileSync(list, files.map((f) => `file '${f}'`).join("\n"));
execFileSync("ffmpeg", ["-y", "-v", "error", "-f", "concat", "-safe", "0", "-i", list, "-i", "public/voiceover.mp3",
  "-map", "0:v:0", "-map", "1:a:0", "-c:v", "copy", "-c:a", "aac", "-b:a", "192k", "-ar", "48000", "-ac", "2",
  "-movflags", "+faststart", "-shortest", out], { stdio: "inherit" });
rmSync(work, { recursive: true, force: true });
console.log("DONE", out);
