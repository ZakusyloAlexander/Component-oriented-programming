import React, { useEffect, useRef } from "react";
import { useDispatch } from "react-redux";
import { useEmojiSession } from "../hooks/useEmojiSession.js";
import { StatsPanel } from "./StatsPanel.jsx";
import { ResultsModal } from "./ResultsModal.jsx";
import { addResult } from "../store/resultsSlice.js";

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

export const GameBoard = ({ userId, settings, difficultyLabel, onExit, onRoundComplete }) => {
  const dispatch = useDispatch();
  const session = useEmojiSession(settings);
  const gridMode = settings.pairs <= 8 ? "easy" : settings.pairs <= 12 ? "normal" : "hard";
  const reportedRef = useRef(false);

  useEffect(() => {
    if (session.hasWon && session.stats && !reportedRef.current) {
      dispatch(addResult({ userId, stats: session.stats }));
      reportedRef.current = true;
    }
    if (!session.hasWon) {
      reportedRef.current = false;
    }
  }, [session.hasWon, session.stats, dispatch, userId]);

  return (
    <section className="screen game-screen">
      <header>
        <p className="screen__subtitle">Користувач: {userId}</p>
        <h1 className="screen__title">Поле гри ({difficultyLabel})</h1>
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


