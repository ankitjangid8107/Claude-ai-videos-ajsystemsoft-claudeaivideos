import React, { createContext, useContext } from "react";
import { useCurrentFrame } from "remotion";

/** Offset (in frames) of the enclosing scene Sequence so scenes can use ABSOLUTE timeline frames from sync.json. */
export const SeqOffset = createContext(0);
export const useAbsFrame = () => useCurrentFrame() + useContext(SeqOffset);
export { React };
