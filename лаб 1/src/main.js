import { createApp } from "./app.js";

const boot = () => {
  const container = document.querySelector("#app");

  if (!container) {
    throw new Error("Не знайдено контейнер #app для рендеру застосунку.");
  }

  const app = createApp();
  app.init(container);
};

boot();


