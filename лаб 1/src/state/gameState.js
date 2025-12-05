const difficultyPresets = {
  easy: { label: "Легка", pairs: 6 },
  normal: { label: "Середня", pairs: 10 },
  hard: { label: "Складна", pairs: 16 },
};

const emojiPool = ["😀", "😎", "🤖", "👾", "🐱", "🌟", "🍀", "🍩", "⚡", "🎧", "🎯", "🚀", "🧠", "🐸", "🪐", "🎨"];

export const createGameState = () => ({
  screen: "start",
  difficulty: "easy",
  presets: difficultyPresets,
  emojiPool,
  stats: {
    moves: 0,
    accuracy: 0,
    bestTime: "--:--",
  },
});


