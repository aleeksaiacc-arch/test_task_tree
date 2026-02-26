import type { Tree } from "../types";
import sampleTree from "./sample-tree.json";

export function loadTree(): Promise<Tree> {
  return Promise.resolve(sampleTree as Tree);
}
