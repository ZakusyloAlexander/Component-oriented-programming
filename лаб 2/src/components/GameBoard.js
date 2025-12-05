import { useGameSession } from "../hooks/useGameSession.js";

const createCardNode = (card, onFlip, isLocked) => {
  const cardBtn = document.createElement("button");
  cardBtn.type = "button";
  const isVisible = card.isFlipped || card.isMatched;
  cardBtn.className = `card${isVisible ? " is-open" : ""}${card.isMatched ? " is-matched" : ""}`;
  cardBtn.textContent = isVisible ? card.emoji : "❓";
  cardBtn.disabled = isLocked || card.isMatched;
  cardBtn.addEventListener("click", () => onFlip(card.id));
  return cardBtn;
};

export const renderGameBoard = ({ state, navigate, updateState }) => {
  const session = useGameSession({
    state,
    updateState,
    onComplete: () => navigate("results"),
  });

  const wrapper = document.createElement("section");
  wrapper.className = "screen game-screen";

  const header = document.createElement("header");
  header.innerHTML = `
    <p class="screen__subtitle">Режим: стандартне поле</p>
    <h1 class="screen__title">Поле гри</h1>
    <p>Відкривай дві однакові емодзі, щоб очистити поле якнайшвидше.</p>
  `;

  wrapper.appendChild(header);

  const quickStats = document.createElement("div");
  quickStats.className = "stats";
  quickStats.innerHTML = `
    <article class="stat-card">
      <p class="stat-card__label">Ходи</p>
      <p class="stat-card__value">${session.moves}</p>
    </article>
    <article class="stat-card">
      <p class="stat-card__label">Однакових пар</p>
      <p class="stat-card__value">${session.matches}</p>
    </article>
    <article class="stat-card">
      <p class="stat-card__label">Час</p>
      <p class="stat-card__value">${session.elapsedTime}</p>
    </article>
  `;
  wrapper.appendChild(quickStats);

  const grid = document.createElement("div");
  grid.className = "card-grid card-grid--normal";

  session.deck.forEach((card) => {
    grid.appendChild(createCardNode(card, session.handleCardFlip, session.isLocked));
  });

  wrapper.appendChild(grid);

  const actions = document.createElement("div");
  actions.className = "actions";

  const restartBtn = document.createElement("button");
  restartBtn.className = "btn-secondary";
  restartBtn.textContent = "Перезапустити";
  restartBtn.addEventListener("click", () => session.restart());

  const exitBtn = document.createElement("button");
  exitBtn.className = "btn-secondary";
  exitBtn.textContent = "На старт";
  exitBtn.addEventListener("click", () => navigate("start"));

  actions.append(restartBtn, exitBtn);
  wrapper.appendChild(actions);

  return wrapper;
};

