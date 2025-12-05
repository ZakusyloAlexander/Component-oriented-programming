const emojiPool = [
  "😀",
  "😎",
  "🤖",
  "👾",
  "🐱",
  "🌟",
  "🍀",
  "🍩",
  "⚡",
  "🎧",
  "🎯",
  "🚀",
  "🧠",
  "🐸",
  "🪐",
  "🎨",
  "🔥",
  "💎",
  "🍉",
  "🥑",
];

export const createEmptySession = () => ({
  deck: [],
  flippedIds: [],
  matchedIds: [],
  moves: 0,
  matches: 0,
  isLocked: false,
  startedAt: null,
  finishedAt: null,
});

export const createAppState = () => ({
  screen: "start",
  emojiPool,
  session: createEmptySession(),
  stats: {
    moves: 0,
    accuracy: 0,
    bestTime: "--:--",
    lastDuration: "--:--",
    bestDurationMs: null,
  },
});

