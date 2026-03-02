import { createSlice } from "@reduxjs/toolkit";
import type { Person } from "../types";

export type PersonsState = Record<string, Person>;

const initialState: PersonsState = {};

const personsSlice = createSlice({
  name: "persons",
  initialState,
  reducers: {},
});

export const personsReducer = personsSlice.reducer;
