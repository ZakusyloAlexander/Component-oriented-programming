export const useResults = ({ state }) => {
  const stats = state.stats;

  const summary = [
    { label: "Ходи", value: stats.moves || 0 },
    { label: "Точність", value: stats.accuracy ? `${stats.accuracy}%` : "0%" },
    { label: "Тривалість", value: stats.lastDuration || "--:--" },
    { label: "Найкращий час", value: stats.bestTime || "--:--" },
  ];

  return {
    stats,
    summary,
  };
};

