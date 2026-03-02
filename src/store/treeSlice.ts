import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import type { RootBlock } from "../components/BlockCard";
import { loadPeopleById } from "../data/loadPersons";
import { loadTree } from "../data/loadTree";
import type { PeopleById } from "../types";

export type TreeState = {
  rootBlocks: RootBlock[];
  peopleById: PeopleById | null;
  focusedId: string | null;
  status: "idle" | "loading" | "succeeded" | "failed";
  error: string | null;
};

export const fetchTree = createAsyncThunk("tree/fetchTree", async () => {
  const [peopleById, treeData] = await Promise.all([
    loadPeopleById(),
    loadTree(),
  ]);
  return { peopleById, rootBlocks: treeData.descendants };
});

const initialState: TreeState = {
  rootBlocks: [],
  peopleById: null,
  focusedId: null,
  status: "idle",
  error: null,
};

const treeSlice = createSlice({
  name: "tree",
  initialState,
  reducers: {
    setFocusedId(state, action: { payload: string | null }) {
      state.focusedId = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchTree.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(fetchTree.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.peopleById = action.payload.peopleById;
        state.rootBlocks = action.payload.rootBlocks;
        if (!state.focusedId) {
          const firstId = Object.keys(action.payload.peopleById)[0];
          state.focusedId = firstId ?? null;
        }
      })
      .addCase(fetchTree.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message ?? "Failed to load tree";
      });
  },
});

export const { setFocusedId } = treeSlice.actions;
export const treeReducer = treeSlice.reducer;
