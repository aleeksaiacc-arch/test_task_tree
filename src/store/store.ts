import { configureStore } from "@reduxjs/toolkit";
import { treeReducer } from "./treeSlice";
import { personsReducer } from "./personsSlice";

export const store = configureStore({
  reducer: {
    tree: treeReducer,
    persons: personsReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
