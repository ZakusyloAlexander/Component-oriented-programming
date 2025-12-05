import React from "react";
import { useEmojiSession } from "../hooks/useEmojiSession.js";
import { useGameSettings } from "../contexts/GameSettingsContext.jsx";
import { StatsPanel } from "./StatsPanel.jsx";
import { ResultsModal } from "./ResultsModal.jsx";

const Card = ({ card, onFlip, disabled }) => (
  <button
    type="button"
    className={`card${card.isFlipped ? " is-open" : ""}${card.isMatched ? " is-matched" : ""}`}
    onClick={() => onFlip(card.id)}
    disabled={disabled || card.isMatched}
  >
    {card.isFlipped ? card.emoji : "❓"}
  </button>
);

export const GameBoard = ({ onExit, onRoundComplete }) => {
  const { settings, presets } = useGameSettings();
  const session = useEmojiSession(settings);
  const gridMode = settings.pairs <= 8 ? "easy" : settings.pairs <= 12 ? "normal" : "hard";
  const difficultyLabel = presets[settings.difficulty]?.label ?? settings.difficulty;

  return (
    <section className="screen game-screen">
      <header>
        <p className="screen__subtitle">Режим: {difficultyLabel}</p>
        <h1 className="screen__title">Поле гри</h1>
        <p>Знайди всі пари емодзі якомога швидше.</p>
      </header>

      <StatsPanel
        items={[
          { label: "Ходи", value: session.moves },
          { label: "Збігів", value: session.matches },
          { label: "Час", value: session.elapsed },
        ]}
      />

      <div className={`card-grid card-grid--${gridMode}`}>
        {session.cards.map((card) => (
          <Card key={card.id} card={card} onFlip={session.handleCardFlip} disabled={session.isLocked} />
        ))}
      </div>

      <div className="actions">
        <button className="btn-secondary" onClick={session.restart}>
          Перезапустити
        </button>
        <button className="btn-secondary" onClick={onExit}>
          До налаштувань
        </button>
      </div>

      <ResultsModal
        isOpen={session.hasWon}
        stats={session.stats}
        onReplay={session.restart}
        onNext={() => onRoundComplete?.(session.stats)}
      />
    </section>
  );
};


