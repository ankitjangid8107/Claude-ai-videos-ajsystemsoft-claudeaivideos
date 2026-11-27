#!/usr/bin/env bash
set -euo pipefail
node scripts/render-chunks.mjs 2 output/AJ_Christmas_Offer_4K_Reels.mp4 80 4
node scripts/render-chunks.mjs 1 output/AJ_Christmas_Offer_1080p_Reels.mp4 150 4
