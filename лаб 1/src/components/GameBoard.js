const placeholderDeck = (emojiPool, pairs) => {
  const available = emojiPool.slice(0, pairs);
  const doubled = available.flatMap((emoji, index) => [
    { id: `a-${index}`, emoji },
    { id: `b-${index}`, emoji },
  ]);

  return doubled.map((card, idx) => ({
    ...card,
    order: idx + 1,
  }));
};

export const renderGameBoard = ({ state, navigate }) => {
  const wrapper = document.createElement("section");
  wrapper.className = "screen game-screen";

  const header = document.createElement("header");
  header.innerHTML = `
    <p class="screen__subtitle">Режим: ${state.presets[state.difficulty].label}</p>
    <h1 class="screen__title">Поле гри</h1>
    <p>Каркас гри показує майбутню сітку карток. Логіку порівняння буде додано пізніше.</p>
  `;
  wrapper.appendChild(header);

  const grid = document.createElement("div");
  grid.className = `card-grid card-grid--${state.difficulty}`;

  const cards = placeholderDeck(state.emojiPool, state.presets[state.difficulty].pairs);

  cards.forEach((card) => {
    const cardNode = document.createElement("div");
    cardNode.className = "card";
    cardNode.textContent = card.emoji;
    grid.appendChild(cardNode);
  });

  wrapper.appendChild(grid);

  const actions = document.createElement("div");
  actions.className = "actions";

  const backBtn = document.createElement("button");
  backBtn.className = "btn-secondary";
  backBtn.textContent = "До старту";
  backBtn.addEventListener("click", () => navigate("start"));

  const finishBtn = document.createElement("button");
  finishBtn.className = "btn-primary";
  finishBtn.textContent = "Завершити сесію";
  finishBtn.addEventListener("click", () =>
    navigate("results", {
      stats: {
        moves: cards.length / 2,
        accuracy: 80,
        bestTime: "01:32",
      },
    }),
  );

  actions.append(backBtn, finishBtn);
  wrapper.appendChild(actions);

  return wrapper;
};


