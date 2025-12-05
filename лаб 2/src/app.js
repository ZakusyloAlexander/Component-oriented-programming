import { renderStartScreen } from "./components/StartScreen.js";
import { renderGameBoard } from "./components/GameBoard.js";
import { renderResultsScreen } from "./components/ResultsScreen.js";
import { createAppState } from "./state/appState.js";

const screens = {
  start: renderStartScreen,
  game: renderGameBoard,
  results: renderResultsScreen,
};

export const createApp = () => {
  const state = createAppState();
  let root = null;

  const render = () => {
    if (!root) return;
    root.innerHTML = "";

    const screenBuilder = screens[state.screen];
    if (!screenBuilder) {
      console.warn(`Екран "${state.screen}" не знайдено. Повернення до старту.`);
      state.screen = "start";
      return render();
    }

    const node = screenBuilder({
      state,
      navigate,
      updateState,
    });

    root.appendChild(node);
  };

  const updateState = (patch) => {
    if (typeof patch === "function") {
      patch(state);
    } else {
      Object.assign(state, patch);
    }

    render();
  };

  const navigate = (screen) => {
    state.screen = screen;
    render();
  };

  return {
    init(container) {
      root = container;
      render();
    },
  };
};


