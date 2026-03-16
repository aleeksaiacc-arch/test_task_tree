import type { RootBlock } from "../components/BlockCard";
import rootBlocks from "./trees.json";

type TreeParents = { wifeId: string; husbId: string };
type RootBlocksGroup = { parents?: TreeParents; descendants?: RootBlock[] };

export type LoadedTree = {
  parents: TreeParents;
  descendants: RootBlock[];
};

export function loadTree(id = "1"): Promise<LoadedTree> {
  const group = (rootBlocks as unknown as Record<string, RootBlocksGroup>)[id];
  const blocks = group?.descendants ?? [];
  return Promise.resolve({
    parents: group?.parents ?? { wifeId: "", husbId: "" },
    descendants: blocks,
  });
}
