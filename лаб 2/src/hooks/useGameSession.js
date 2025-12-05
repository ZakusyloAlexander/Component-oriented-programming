import { createEmptySession } from "../state/appState.js";

const shuffle = (array) => {
  const copy = [...array];
  for (let i = copy.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
};

const formatDuration = (ms) => {
  if (!ms || ms < 0) {
    return "--:--";
  }
  const totalSeconds = Math.round(ms / 1000);
  const minutes = String(Math.floor(totalSeconds / 60)).padStart(2, "0");
  const seconds = String(totalSeconds % 60).padStart(2, "0");
  return `${minutes}:${seconds}`;
};

const calculateAccuracy = (matches, moves) => {
  if (!moves) return 0;
  return Math.round((matches / moves) * 100);
};

const buildDeck = (pool, pairs) => {
  const shuffledPool = shuffle(pool);
  const selection = shuffledPool.slice(0, pairs);
  const duplicated = selection.flatMap((emoji, idx) => [
    { id: `a-${idx}`, emoji },
    { id: `b-${idx}`, emoji },
  ]);
  return shuffle(duplicated);
};

const elapsedMs = (session) => {
  if (!session.startedAt) return 0;
  const end = session.finishedAt ?? Date.now();
  return end - session.startedAt;
};

export const useGameSession = ({ state, updateState, onComplete }) => {
  const PAIRS_COUNT = 10; // фіксована кількість пар для лаби 2

  const buildSession = () => ({
    ...createEmptySession(),
    deck: buildDeck(state.emojiPool, PAIRS_COUNT),
  });

  const startSession = () => {
    updateState((draft) => {
      draft.session = buildSession();
    });
  };

  if (!state.session.deck.length) {
    // Ініціалізуємо сесію синхронно, щоб уникнути проміжних плейсхолдерів.
    state.session = buildSession();
  }

  const handleCardFlip = (cardId) => {
    const currentSession = state.session;
    if (currentSession.isLocked) return;
    if (currentSession.flippedIds.includes(cardId)) return;
    if (currentSession.matchedIds.includes(cardId)) return;

    updateState((draft) => {
      draft.session = {
        ...currentSession,
        flippedIds: [...currentSession.flippedIds, cardId],
        startedAt: currentSession.startedAt ?? Date.now(),
      };
    });

    const updatedSession = state.session;
    if (updatedSession.flippedIds.length < 2) {
      return;
    }

    const [firstId, secondId] = updatedSession.flippedIds;
    const firstCard = updatedSession.deck.find((card) => card.id === firstId);
    const secondCard = updatedSession.deck.find((card) => card.id === secondId);
    if (!firstCard || !secondCard) return;

    updateState((draft) => {
      draft.session = {
        ...state.session,
        isLocked: true,
      };
    });

    window.setTimeout(() => {
      const snapshot = state.session;
      const isMatch = firstCard.emoji === secondCard.emoji;
      const moves = snapshot.moves + 1;
      const matchedIds = isMatch ? Array.from(new Set([...snapshot.matchedIds, firstId, secondId])) : snapshot.matchedIds;
      const matches = isMatch ? snapshot.matches + 1 : snapshot.matches;
      const isFinished = matchedIds.length === snapshot.deck.length;
      const finishedAt = isFinished ? Date.now() : snapshot.finishedAt;

      updateState((draft) => {
        draft.session = {
          ...snapshot,
          flippedIds: [],
          matchedIds,
          matches,
          moves,
          isLocked: false,
          finishedAt,
        };
      });

      if (isFinished) {
        const duration = finishedAt - (snapshot.startedAt ?? finishedAt);
        const formattedDuration = formatDuration(duration);
        const accuracy = calculateAccuracy(matches, moves);

        updateState((draft) => {
          const prevStats = draft.stats;
          const shouldUpdateBest = !prevStats.bestDurationMs || duration < prevStats.bestDurationMs;

          draft.stats = {
            ...prevStats,
            moves,
            accuracy,
            lastDuration: formattedDuration,
            bestDurationMs: shouldUpdateBest ? duration : prevStats.bestDurationMs,
            bestTime: shouldUpdateBest ? formattedDuration : prevStats.bestTime,
          };
        });

        if (typeof onComplete === "function") {
          onComplete();
        }
      }
    }, 600);
  };

  return {
    deck: state.session.deck.map((card) => ({
      ...card,
      isFlipped: state.session.flippedIds.includes(card.id),
      isMatched: state.session.matchedIds.includes(card.id),
    })),
    moves: state.session.moves,
    matches: state.session.matches,
    elapsedTime: formatDuration(elapsedMs(state.session)),
    isLocked: state.session.isLocked,
    handleCardFlip,
    restart: startSession,
  };
};

