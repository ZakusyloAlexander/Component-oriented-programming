import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { emojiPool } from "../state/constants.js";

const createDeck = (pairs) => {
  const shuffledPool = [...emojiPool].sort(() => Math.random() - 0.5);
  const picked = shuffledPool.slice(0, pairs);
  const duplicated = picked.flatMap((emoji, idx) => [
    { id: `a-${idx}`, emoji },
    { id: `b-${idx}`, emoji },
  ]);
  return duplicated.sort(() => Math.random() - 0.5);
};

const formatDuration = (ms) => {
  if (!ms) return "00:00";
  const totalSeconds = Math.round(ms / 1000);
  const minutes = String(Math.floor(totalSeconds / 60)).padStart(2, "0");
  const seconds = String(totalSeconds % 60).padStart(2, "0");
  return `${minutes}:${seconds}`;
};

export const useEmojiSession = (settings) => {
  const [deck, setDeck] = useState(() => createDeck(settings.pairs));
  const [flipped, setFlipped] = useState([]);
  const [matched, setMatched] = useState([]);
  const [moves, setMoves] = useState(0);
  const [matches, setMatches] = useState(0);
  const [sessionKey, setSessionKey] = useState(0);
  const [startedAt, setStartedAt] = useState(null);
  const [finishedAt, setFinishedAt] = useState(null);
  const [isLocked, setIsLocked] = useState(false);

  useEffect(() => {
    setDeck(createDeck(settings.pairs));
    setFlipped([]);
    setMatched([]);
    setMoves(0);
    setMatches(0);
    setStartedAt(null);
    setFinishedAt(null);
    setIsLocked(false);
  }, [settings, sessionKey]);

  const timer = useRef(null);
  const [elapsed, setElapsed] = useState("00:00");

  useEffect(() => {
    if (!startedAt || finishedAt) return;
    timer.current = window.setInterval(() => {
      setElapsed(formatDuration(Date.now() - startedAt));
    }, 500);
    return () => window.clearInterval(timer.current);
  }, [startedAt, finishedAt]);

  useEffect(() => {
    if (!startedAt) setElapsed("00:00");
    if (finishedAt) {
      setElapsed(formatDuration(finishedAt - startedAt));
      window.clearInterval(timer.current);
    }
  }, [startedAt, finishedAt]);

  const cardsById = useMemo(() => {
    const map = new Map();
    deck.forEach((card) => map.set(card.id, card));
    return map;
  }, [deck]);

  const handleCardFlip = useCallback(
    (cardId) => {
      if (isLocked) return;
      if (flipped.includes(cardId)) return;
      if (matched.includes(cardId)) return;

      const nextFlipped = [...flipped, cardId];
      setFlipped(nextFlipped);
      if (!startedAt) setStartedAt(Date.now());

      if (nextFlipped.length < 2) {
        return;
      }

      setIsLocked(true);
      setMoves((prev) => prev + 1);

      const [firstId, secondId] = nextFlipped;
      const firstCard = cardsById.get(firstId);
      const secondCard = cardsById.get(secondId);
      const isMatch = firstCard?.emoji === secondCard?.emoji;

      window.setTimeout(() => {
        if (isMatch) {
          setMatched((prev) => [...prev, firstId, secondId]);
          setMatches((prev) => prev + 1);
        }

        setFlipped([]);
        setIsLocked(false);
      }, isMatch ? 200 : settings.flipDelay);
    },
    [cardsById, flipped, isLocked, matched, settings.flipDelay, startedAt],
  );

  const totalCards = deck.length;
  const hasWon = matched.length === totalCards && totalCards > 0;

  useEffect(() => {
    if (hasWon && !finishedAt) {
      setFinishedAt(Date.now());
    }
  }, [hasWon, finishedAt]);

  const restart = () => {
    setSessionKey((prev) => prev + 1);
  };

  const accuracy = moves ? Math.round((matches / moves) * 100) : 0;
  const lastDuration = finishedAt && startedAt ? finishedAt - startedAt : null;

  const cards = deck.map((card) => ({
    ...card,
    isFlipped: flipped.includes(card.id) || matched.includes(card.id),
    isMatched: matched.includes(card.id),
  }));

  return {
    cards,
    moves,
    matches,
    accuracy,
    elapsed,
    isLocked,
    hasWon,
    stats: hasWon
      ? {
          moves,
          accuracy,
          elapsed: formatDuration(lastDuration),
        }
      : null,
    handleCardFlip,
    restart,
  };
};


