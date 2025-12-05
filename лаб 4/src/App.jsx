import React, { useMemo } from "react";
import { Route, Routes, useNavigate, useParams } from "react-router-dom";
import styled from "styled-components";
import { GameSettingsProvider, useGameSettings } from "./contexts/GameSettingsContext.jsx";
import { SettingsForm } from "./components/SettingsForm.jsx";
import { GameBoard } from "./components/GameBoard.jsx";
import { StatsPanel } from "./components/StatsPanel.jsx";
import "./styles/base.css";

const Shell = styled.main`
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 32px 16px;
`;

const Container = styled.div`
  width: min(1024px, 100%);
  display: flex;
  flex-direction: column;
  gap: 32px;
  align-items: center;
  margin: 0 auto;
`;

const HomeCard = styled.section`
  background: #0f172a;
  color: #e5e7eb;
  border-radius: 28px;
  padding: 48px 40px;
  display: flex;
  flex-direction: column;
  gap: 20px;
  box-shadow: 0 30px 60px -12px rgba(15, 23, 42, 0.65);
  width: min(640px, 100%);
  min-height: 360px;
`;

const Input = styled.input`
  padding: 10px 14px;
  border-radius: 999px;
  border: none;
  outline: none;
  font-size: 16px;
  width: 100%;
`;

const PrimaryButton = styled.button`
  background: linear-gradient(135deg, #22c55e, #16a34a);
  color: #fff;
  border-radius: 999px;
  padding: 10px 18px;
  border: none;
  font-weight: 600;
  cursor: pointer;
  margin-top: 8px;
  opacity: ${(props) => (props.disabled ? 0.6 : 1)};
`;

const GuestButton = styled.button`
  background: transparent;
  color: #a5b4fc;
  border: 1px solid rgba(165, 180, 252, 0.4);
  border-radius: 999px;
  padding: 10px 18px;
  font-weight: 600;
  cursor: pointer;
  margin-top: 12px;
`;

const ErrorText = styled.p`
  color: #fca5a5;
  margin: 8px 0 0;
  font-size: 14px;
`;

const Home = () => {
  const navigate = useNavigate();
  const [value, setValue] = React.useState("");
  const [error, setError] = React.useState("");

  const trimmed = value.trim();
  const canStart = trimmed.length > 0;

  const handleSubmit = (event) => {
    event.preventDefault();
    if (!canStart) {
      setError("Будь ласка, введіть ім'я або ID користувача.");
      return;
    }
    navigate(`/users/${encodeURIComponent(trimmed)}/settings`);
  };

  return (
    <Shell>
      <Container>
        <HomeCard>
          <h1>Matching Emojis · Лаб 4</h1>
          <p>Введи свій ID користувача, щоб зберігати персональні налаштування та статистику.</p>
          <form onSubmit={handleSubmit}>
            <Input
              placeholder="Наприклад, ivan123"
              value={value}
              onChange={(e) => {
                setValue(e.target.value);
                if (error && e.target.value.trim()) {
                  setError("");
                }
              }}
            />
            <PrimaryButton type="submit" disabled={!canStart}>
              Перейти до гри
            </PrimaryButton>
            {error && <ErrorText>{error}</ErrorText>}
          </form>
          <GuestButton type="button" onClick={() => navigate("/users/guest/settings")}>
            Грати як гість
          </GuestButton>
        </HomeCard>
      </Container>
    </Shell>
  );
};

const StartScreen = ({ userId, onStart }) => {
  const { lastStats } = useGameSettings();

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
        <p className="screen__subtitle">Користувач: {userId}</p>
        <h1 className="screen__title">Matching Emojis</h1>
        <p>Налаштуй складність та швидкість, збережи їх у localStorage та вирушай у новий тур.</p>
      </header>

      <SettingsForm onStart={onStart} />
      <StatsPanel items={summary} />
    </section>
  );
};

const ResultsScreen = ({ userId, stats, onReplay, onConfig }) => (
  <section className="screen results-screen">
    <header>
      <p className="screen__subtitle">Користувач: {userId}</p>
      <h1 className="screen__title">Результати</h1>
      <p>Дані збережено для цього ID. Ти можеш повернутися до налаштувань або спробувати ще раз.</p>
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

const UserRoutes = () => {
  const { userId } = useParams();
  const navigate = useNavigate();
  const { settings, lastStats, setLastStats } = useGameSettings();

  return (
    <Shell>
      <Container>
        <Routes>
          <Route
            path="settings"
            element={<StartScreen userId={userId} onStart={() => navigate(`/users/${userId}/game`)} />}
          />
          <Route
            path="game"
            element={
              <GameBoard
                settings={settings}
                onExit={() => navigate(`/users/${userId}/settings`)}
                onRoundComplete={(stats) => {
                  setLastStats(stats);
                  navigate(`/users/${userId}/results`);
                }}
              />
            }
          />
          <Route
            path="results"
            element={
              <ResultsScreen
                userId={userId}
                stats={lastStats}
                onReplay={() => navigate(`/users/${userId}/game`)}
                onConfig={() => navigate(`/users/${userId}/settings`)}
              />
            }
          />
        </Routes>
      </Container>
    </Shell>
  );
};

const NotFound = () => (
  <Shell>
    <Container>
      <section className="screen">
        <h1 className="screen__title">404</h1>
        <p>Сторінку не знайдено. Повернись на головну.</p>
      </section>
    </Container>
  </Shell>
);

const AppInner = () => (
  <Routes>
    <Route path="/" element={<Home />} />
    <Route path="/users/:userId/*" element={<UserRoutes />} />
    <Route path="*" element={<NotFound />} />
  </Routes>
);

const App = () => (
  <GameSettingsProvider>
    <AppInner />
  </GameSettingsProvider>
);

export default App;



