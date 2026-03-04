import type { RootBlock } from "../components/BlockCard";
import rootBlocks from "./trees.json";

type RootBlockRaw = Omit<RootBlock, "id"> & { htmlId: string };
type TreeParents = { wifeId: string; husbId: string };
type RootBlocksGroup = { parents?: TreeParents; descendants?: RootBlockRaw[] };

export type LoadedTree = {
  parents: TreeParents;
  descendants: RootBlock[];
};

export function loadTree(id = "1"): Promise<LoadedTree> {
  const group = (rootBlocks as unknown as Record<string, RootBlocksGroup>)[id];
  const blocks = group?.descendants ?? [];
  const normalized = blocks.map(({ htmlId, ...rest }) => ({
    id: htmlId,
    ...rest,
  }));
  return Promise.resolve({
    parents: group?.parents ?? { wifeId: "", husbId: "" },
    descendants: normalized,
  });
}
