export const renderStartScreen = ({ state, navigate, updateState }) => {
  const wrapper = document.createElement("section");
  wrapper.className = "screen start-screen";

  wrapper.innerHTML = `
    <header>
      <p class="screen__subtitle">Лаб 2 · Кастомні хуки</p>
      <h1 class="screen__title">Matching Emojis</h1>
      <p>Грай у Matching Emojis з фіксованим полем та відстеженням статистики.</p>
    </header>
  `;

  const statsHint = document.createElement("div");
  statsHint.className = "stats";
  statsHint.innerHTML = `
    <article class="stat-card">
      <p class="stat-card__label">Останній час</p>
      <p class="stat-card__value">${state.stats.lastDuration}</p>
    </article>
    <article class="stat-card">
      <p class="stat-card__label">Найкращий час</p>
      <p class="stat-card__value">${state.stats.bestTime}</p>
    </article>
  `;

  wrapper.appendChild(statsHint);

  const actions = document.createElement("div");
  actions.className = "actions";

  const startBtn = document.createElement("button");
  startBtn.className = "btn-primary";
  startBtn.textContent = "Почати гру";
  startBtn.addEventListener("click", () => navigate("game"));

  const resultsBtn = document.createElement("button");
  resultsBtn.className = "btn-secondary";
  resultsBtn.textContent = "Підсумки";
  resultsBtn.addEventListener("click", () => navigate("results"));

  actions.append(startBtn, resultsBtn);
  wrapper.appendChild(actions);

  return wrapper;
};

