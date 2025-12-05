import { configureStore } from "@reduxjs/toolkit";
import settingsReducer from "./settingsSlice.js";
import resultsReducer from "./resultsSlice.js";

export const store = configureStore({
  reducer: {
    settings: settingsReducer,
    results: resultsReducer,
  },
});


