#!/usr/bin/env bash
# Robust chunked render: short browser sessions, per-chunk retries, lossless join, exact voiceover mux.
# usage: scripts/render-chunked.sh <scale> <out.mp4> [chunk_frames]
set -uo pipefail
SCALE="${1:?scale}"; OUT="${2:?out}"; CHUNK="${3:-300}"
CONC="${CONCURRENCY:-4}"
TOTAL=$(node -e 'console.log(require("./src/data/sync.json").durationInFrames)')
WORK="$(mktemp -d "${TMPDIR:-/tmp}/aj-chunks-XXXX")"
mkdir -p "$(dirname "$OUT")"
echo "total=$TOTAL scale=$SCALE chunk=$CHUNK work=$WORK"
: > "$WORK/list.txt"
i=0
for ((s=0; s<TOTAL; s+=CHUNK)); do
  e=$((s+CHUNK-1)); ((e>TOTAL-1)) && e=$((TOTAL-1))
  f="$WORK/c$(printf %03d $i).mp4"
  ok=0
  for attempt in 1 2 3 4; do
    echo "== chunk $i frames $s-$e (attempt $attempt)"
    if npx remotion render src/index.ts AJReel "$f" --scale="$SCALE" --frames="$s-$e" --muted \
        --codec=h264 --pixel-format=yuv420p --crf=18 --enable-multiprocess-on-linux \
        --timeout=60000 --concurrency="$CONC" > "$WORK/log$i.txt" 2>&1; then ok=1; break; fi
    tail -3 "$WORK/log$i.txt"; sleep 3
  done
  [ "$ok" = 1 ] || { echo "chunk $i failed permanently"; exit 1; }
  echo "file '$f'" >> "$WORK/list.txt"; i=$((i+1))
done
ffmpeg -y -v error -f concat -safe 0 -i "$WORK/list.txt" -i public/voiceover.mp3 \
  -map 0:v:0 -map 1:a:0 -c:v copy -c:a aac -b:a 192k -ar 48000 -ac 2 -movflags +faststart -shortest "$OUT"
echo "DONE $OUT"
