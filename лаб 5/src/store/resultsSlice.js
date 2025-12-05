import { createSlice, nanoid } from "@reduxjs/toolkit";

const STORAGE_KEY = "lab5-results";

const loadState = () => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      return {
        entries: {},
        lastResultByUser: {},
      };
    }
    const parsed = JSON.parse(raw);
    return {
      entries: parsed.entries ?? {},
      lastResultByUser: parsed.lastResultByUser ?? {},
    };
  } catch {
    return {
      entries: {},
      lastResultByUser: {},
    };
  }
};

const persist = (state) => {
  try {
    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify({
        entries: state.entries,
        lastResultByUser: state.lastResultByUser,
      }),
    );
  } catch {
    // ignore persistence errors
  }
};

const initialState = loadState();

const resultsSlice = createSlice({
  name: "results",
  initialState,
  reducers: {
    addResult: {
      reducer(state, action) {
        const { userId, result } = action.payload;
        if (!userId) return;
        if (!state.entries[userId]) {
          state.entries[userId] = [];
        }
        state.entries[userId].unshift(result);
        state.entries[userId] = state.entries[userId].slice(0, 20);
        state.lastResultByUser[userId] = result.id;
        persist(state);
      },
      prepare({ userId, stats }) {
        const id = nanoid();
        return {
          payload: {
            userId,
            result: {
              id,
              createdAt: new Date().toISOString(),
              moves: stats?.moves ?? 0,
              accuracy: stats?.accuracy ?? 0,
              elapsed: stats?.elapsed ?? "--:--",
            },
          },
        };
      },
    },
    clearResults(state, action) {
      const userId = action.payload;
      if (state.entries[userId]) {
        state.entries[userId] = [];
        state.lastResultByUser[userId] = null;
      }
      persist(state);
    },
  },
});

export const { addResult, clearResults } = resultsSlice.actions;

export const selectResultsForUser = (state, userId) => state.results.entries[userId] ?? [];

export const selectLastResultForUser = (state, userId) => {
  const entries = state.results.entries[userId];
  if (!entries || entries.length === 0) return null;
  return entries[0];
};

export default resultsSlice.reducer;


