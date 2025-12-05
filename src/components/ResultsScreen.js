import { useResults } from "../hooks/useResults.js";

export const renderResultsScreen = ({ state, navigate }) => {
  const { summary } = useResults({ state });

  const wrapper = document.createElement("section");
  wrapper.className = "screen results-screen";

  wrapper.innerHTML = `
    <header>
      <p class="screen__subtitle">Підсумок останньої сесії</p>
      <h1 class="screen__title">Результати</h1>
      <p>Статистика розрахована кастомними хуками — компонент відповідає тільки за відображення.</p>
    </header>
  `;

  const statsGrid = document.createElement("div");
  statsGrid.className = "stats";

  summary.forEach((item) => {
    const stat = document.createElement("article");
    stat.className = "stat-card";
    stat.innerHTML = `
      <p class="stat-card__label">${item.label}</p>
      <p class="stat-card__value">${item.value}</p>
    `;
    statsGrid.appendChild(stat);
  });

  wrapper.appendChild(statsGrid);

  const actions = document.createElement("div");
  actions.className = "actions";

  const restartBtn = document.createElement("button");
  restartBtn.className = "btn-primary";
  restartBtn.textContent = "Грати ще";
  restartBtn.addEventListener("click", () => navigate("game"));

  const homeBtn = document.createElement("button");
  homeBtn.className = "btn-secondary";
  homeBtn.textContent = "На старт";
  homeBtn.addEventListener("click", () => navigate("start"));

  actions.append(restartBtn, homeBtn);
  wrapper.appendChild(actions);

  return wrapper;
};


