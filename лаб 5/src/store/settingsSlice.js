import { createSlice } from "@reduxjs/toolkit";
import { defaultSettings } from "../state/constants.js";

const STORAGE_KEY = "lab5-settings";

const loadState = () => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      return {
        currentUserId: null,
        profiles: {},
      };
    }
    const parsed = JSON.parse(raw);
    return {
      currentUserId: parsed.currentUserId ?? null,
      profiles: parsed.profiles ?? {},
    };
  } catch {
    return {
      currentUserId: null,
      profiles: {},
    };
  }
};

const persist = (state) => {
  try {
    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify({
        currentUserId: state.currentUserId,
        profiles: state.profiles,
      }),
    );
  } catch {
    // silent
  }
};

const ensureProfile = (state, userId) => {
  if (!state.profiles[userId]) {
    state.profiles[userId] = { ...defaultSettings };
  }
};

const initialState = loadState();

const settingsSlice = createSlice({
  name: "settings",
  initialState,
  reducers: {
    setCurrentUser(state, action) {
      const userId = action.payload;
      state.currentUserId = userId;
      if (userId) {
        ensureProfile(state, userId);
      }
      persist(state);
    },
    updateCurrentSettings(state, action) {
      if (!state.currentUserId) return;
      ensureProfile(state, state.currentUserId);
      state.profiles[state.currentUserId] = {
        ...state.profiles[state.currentUserId],
        ...action.payload,
      };
      persist(state);
    },
  },
});

export const { setCurrentUser, updateCurrentSettings } = settingsSlice.actions;

export const selectCurrentUserId = (state) => state.settings.currentUserId;

export const selectSettingsForUser = (state, userId) => {
  if (!userId) return { ...defaultSettings };
  return state.settings.profiles[userId] ?? { ...defaultSettings };
};

export const selectSettingsForCurrentUser = (state) => selectSettingsForUser(state, state.settings.currentUserId);

export default settingsSlice.reducer;


