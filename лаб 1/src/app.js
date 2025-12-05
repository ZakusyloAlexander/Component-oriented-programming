import { renderStartScreen } from "./components/StartScreen.js";
import { renderGameBoard } from "./components/GameBoard.js";
import { renderResultsScreen } from "./components/ResultsScreen.js";
import { createGameState } from "./state/gameState.js";

const screens = {
  start: renderStartScreen,
  game: renderGameBoard,
  results: renderResultsScreen,
};

export const createApp = () => {
  const state = createGameState();
  let rootElement = null;

  const navigate = (nextScreen, payload = {}) => {
    state.screen = nextScreen;

    if (payload.difficulty) {
      state.difficulty = payload.difficulty;
    }

    if (payload.stats) {
      state.stats = { ...state.stats, ...payload.stats };
    }

    render();
  };

  const render = () => {
    if (!rootElement) {
      return;
    }

    rootElement.innerHTML = "";

    const screenBuilder = screens[state.screen];

    if (!screenBuilder) {
      console.warn(`Екран "${state.screen}" не знайдено. Повернення до старту.`);
      state.screen = "start";
      return render();
    }

    const node = screenBuilder({
      state,
      navigate,
      updateState(partial) {
        Object.assign(state, partial);
      },
    });

    rootElement.appendChild(node);
  };

  return {
    init(container) {
      rootElement = container;
      render();
    },
  };
};


