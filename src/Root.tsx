import React from "react";
import { AbsoluteFill, Audio, Composition, Sequence, staticFile } from "remotion";
import "./style.css";
import { SYNC, TOTAL_FRAMES, FPS } from "./lib/sync";
import { SeqOffset } from "./lib/frame";
import { Background } from "./components/Background";
import { HUD } from "./components/HUD";
import { Subtitles } from "./components/Subtitles";
import { SceneShell, OVERLAP } from "./components/SceneShell";
import { Scene1Hook } from "./scenes/Scene1Hook";
import { Scene2Problem } from "./scenes/Scene2Problem";
import { Scene3Brand } from "./scenes/Scene3Brand";
import { Scene4Offer } from "./scenes/Scene4Offer";
import { Scene5Dashboard } from "./scenes/Scene5Dashboard";
import { Scene6Slots } from "./scenes/Scene6Slots";
import { Scene7Cta } from "./scenes/Scene7Cta";
import "./lib/theme";

const SCENES = [Scene1Hook, Scene2Problem, Scene3Brand, Scene4Offer, Scene5Dashboard, Scene6Slots, Scene7Cta];

export const AJReel: React.FC = () => (
  <AbsoluteFill style={{ background: "#fff", overflow: "hidden" }}>
    <Background />
    {SYNC.scenes.map((sc, i) => {
      const from = Math.max(0, sc.startFrame - OVERLAP);
      const end = i === SCENES.length - 1 ? TOTAL_FRAMES : sc.endFrame + OVERLAP;
      const Comp = SCENES[i];
      return (
        <Sequence key={sc.id} from={from} durationInFrames={end - from} layout="none">
          <SeqOffset.Provider value={from}>
            <SceneShell durationInFrames={end - from} first={i === 0} last={i === SCENES.length - 1}>
              <Comp />
            </SceneShell>
          </SeqOffset.Provider>
        </Sequence>
      );
    })}
    <HUD />
    <Subtitles />
    <Audio src={staticFile("voiceover.mp3")} />
  </AbsoluteFill>
);

export const RemotionRoot: React.FC = () => (
  <Composition id="AJReel" component={AJReel} durationInFrames={TOTAL_FRAMES} fps={FPS} width={1080} height={1920} />
);
