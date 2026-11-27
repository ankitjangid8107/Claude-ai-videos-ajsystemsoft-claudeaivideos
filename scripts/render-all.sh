#!/usr/bin/env bash
# Renders 4K (2160x3840) then 1080p (1080x1920). Same flags used in CI.
set -euo pipefail
mkdir -p output
npx remotion render src/index.ts AJReel output/AJ_Christmas_Offer_4K_Reels.mp4 --scale=2 --codec=h264 --pixel-format=yuv420p --crf=18 --audio-codec=aac --audio-bitrate=192k --enable-multiprocess-on-linux --timeout=180000 --concurrency="${CONCURRENCY:-4}"
npx remotion render src/index.ts AJReel output/AJ_Christmas_Offer_1080p_Reels.mp4 --scale=1 --codec=h264 --pixel-format=yuv420p --crf=18 --audio-codec=aac --audio-bitrate=192k --enable-multiprocess-on-linux --timeout=180000 --concurrency="${CONCURRENCY:-4}"
