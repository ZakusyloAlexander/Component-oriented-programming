const createDifficultyOption = ({ key, preset, activeDifficulty, onSelect }) => {
  const option = document.createElement("button");
  option.className = `difficulty-option${activeDifficulty === key ? " is-active" : ""}`;
  option.type = "button";
  option.innerHTML = `
    <strong>${preset.label}</strong>
    <p>${preset.pairs * 2} карток</p>
  `;
  option.addEventListener("click", () => onSelect(key));
  return option;
};

export const renderStartScreen = ({ state, navigate, updateState }) => {
  const wrapper = document.createElement("section");
  wrapper.className = "screen start-screen";
  wrapper.innerHTML = `
    <header>
      <p class="screen__subtitle">Лаб 1 · Емоційні пари</p>
      <h1 class="screen__title">Matching Emojis</h1>
      <p>Обирай складність та тренуй уважність у грі на запам’ятовування емодзі.</p>
    </header>
  `;

  const difficultyGroup = document.createElement("div");
  difficultyGroup.className = "difficulty-group";

  Object.entries(state.presets).forEach(([key, preset]) => {
    const option = createDifficultyOption({
      key,
      preset,
      activeDifficulty: state.difficulty,
      onSelect: (difficulty) => {
        updateState({ difficulty });
        [...difficultyGroup.children].forEach((child) => child.classList.remove("is-active"));
        option.classList.add("is-active");
      },
    });

    difficultyGroup.appendChild(option);
  });

  wrapper.appendChild(difficultyGroup);

  const actions = document.createElement("div");
  actions.className = "actions";

  const startBtn = document.createElement("button");
  startBtn.className = "btn-primary";
  startBtn.textContent = "Почати гру";
  startBtn.addEventListener("click", () => navigate("game"));

  const resultsBtn = document.createElement("button");
  resultsBtn.className = "btn-secondary";
  resultsBtn.textContent = "Переглянути останні результати";
  resultsBtn.addEventListener("click", () => navigate("results"));

  actions.append(startBtn, resultsBtn);
  wrapper.appendChild(actions);

  return wrapper;
};


