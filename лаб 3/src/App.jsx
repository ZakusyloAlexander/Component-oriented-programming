import React, { useMemo, useState } from "react";
import { GameSettingsProvider, useGameSettings } from "./contexts/GameSettingsContext.jsx";
import { SettingsForm } from "./components/SettingsForm.jsx";
import { GameBoard } from "./components/GameBoard.jsx";
import { StatsPanel } from "./components/StatsPanel.jsx";
import "./styles/base.css";

const StartScreen = ({ onStart, lastStats }) => {
  const summary = useMemo(
    () => [
      { label: "Останній час", value: lastStats?.elapsed ?? "--:--" },
      { label: "Останні ходи", value: lastStats?.moves ?? "--" },
      { label: "Остання точність", value: lastStats?.accuracy ? `${lastStats.accuracy}%` : "--" },
    ],
    [lastStats],
  );

  return (
    <section className="screen start-screen">
      <header>
        <p className="screen__subtitle">Лаб 3 · Налаштування + портали</p>
        <h1 className="screen__title">Matching Emojis</h1>
        <p>Налаштуй складність та швидкість, збережи їх у localStorage та вирушай у новий тур.</p>
      </header>

      <SettingsForm onStart={onStart} />
      <StatsPanel items={summary} />
    </section>
  );
};

const ResultsScreen = ({ stats, onReplay, onConfig }) => (
  <section className="screen results-screen">
    <header>
      <p className="screen__subtitle">Підсумки останнього туру</p>
      <h1 className="screen__title">Результати</h1>
      <p>Дані збережено локально, ти можеш повернутися до форми налаштувань або спробувати ще раз.</p>
    </header>
    <StatsPanel
      items={[
        { label: "Час", value: stats?.elapsed ?? "--:--" },
        { label: "Ходи", value: stats?.moves ?? "--" },
        { label: "Точність", value: stats?.accuracy ? `${stats.accuracy}%` : "--" },
      ]}
    />
    <div className="actions">
      <button className="btn-primary" onClick={onReplay}>
        Грати ще раз
      </button>
      <button className="btn-secondary" onClick={onConfig}>
        До налаштувань
      </button>
    </div>
  </section>
);

const AppContent = () => {
  const { settings } = useGameSettings();
  const [screen, setScreen] = useState("start");
  const [lastStats, setLastStats] = useState(null);

  return (
    <main className="app-shell">
      {screen === "start" && <StartScreen lastStats={lastStats} onStart={() => setScreen("game")} />}

      {screen === "game" && (
        <GameBoard
          onExit={() => setScreen("start")}
          onRoundComplete={(stats) => {
            setLastStats(stats);
            setScreen("results");
          }}
        />
      )}

      {screen === "results" && <ResultsScreen stats={lastStats} onReplay={() => setScreen("game")} onConfig={() => setScreen("start")} />}

      <footer className="footer-note">
        Дані налаштувань зберігаються у localStorage ({settings.difficulty}, {settings.pairs * 2} карток, затримка {settings.flipDelay} мс).
      </footer>
    </main>
  );
};

const App = () => (
  <GameSettingsProvider>
    <AppContent />
  </GameSettingsProvider>
);

export default App;


