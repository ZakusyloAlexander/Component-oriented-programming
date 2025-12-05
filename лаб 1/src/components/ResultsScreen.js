export const renderResultsScreen = ({ state, navigate }) => {
  const wrapper = document.createElement("section");
  wrapper.className = "screen results-screen";

  wrapper.innerHTML = `
    <header>
      <p class="screen__subtitle">Підсумки сесії</p>
      <h1 class="screen__title">Результати</h1>
      <p>Тут буде виводитися реальна статистика після впровадження логіки зіставлення карток.</p>
    </header>
  `;

  const stats = document.createElement("div");
  stats.className = "stats";

  const statItems = [
    { label: "Ходи", value: state.stats.moves ?? "--" },
    { label: "Точність", value: state.stats.accuracy ? `${state.stats.accuracy}%` : "--" },
    { label: "Найкращий час", value: state.stats.bestTime ?? "--:--" },
  ];

  statItems.forEach((item) => {
    const card = document.createElement("article");
    card.className = "stat-card";
    card.innerHTML = `
      <p class="stat-card__label">${item.label}</p>
      <p class="stat-card__value">${item.value}</p>
    `;
    stats.appendChild(card);
  });

  wrapper.appendChild(stats);

  const actions = document.createElement("div");
  actions.className = "actions";

  const retryBtn = document.createElement("button");
  retryBtn.className = "btn-primary";
  retryBtn.textContent = "Грати ще раз";
  retryBtn.addEventListener("click", () => navigate("game"));

  const homeBtn = document.createElement("button");
  homeBtn.className = "btn-secondary";
  homeBtn.textContent = "На старт";
  homeBtn.addEventListener("click", () => navigate("start"));

  actions.append(retryBtn, homeBtn);
  wrapper.appendChild(actions);

  return wrapper;
};


