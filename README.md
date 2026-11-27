# AJ System Soft — Christmas ₹0 Offer Reel (Remotion)

9:16 vertical promo (4K 2160×3840 / 1080p), 30 fps, synced frame-exact to `public/voiceover.mp3`.

| Path | Purpose |
|---|---|
| `scripts/align.py` | ffmpeg speech-interval detection + syllable-weighted word aligner → `src/data/sync.json` |
| `src/data/sync.json` | scene, caption and word timings. **Every** scene cue, pop and subtitle reads from here |
| `src/scenes/*` | the 7 scenes (CSS-3D, no WebGL) |
| `scripts/previews.mjs` | renders a still per scene into `previews/` |
| `scripts/render-all.sh` | 4K + 1080p renders |
| `.github/workflows/render-4k-video.yml` | cloud render + Artifacts + Release assets |

Authoring canvas is 1080×1920; `--scale=2` produces the exact 2160×3840 4K frame (safe zones: top 240px, bottom 500px, right 180px at 4K).

```
npm ci
npm run align      # regenerate sync.json from the voiceover
npm run typecheck
npm run previews
npm run render:4k
npm run render:1080
```
