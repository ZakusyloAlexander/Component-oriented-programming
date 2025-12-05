import { createApp } from "./app.js";

const boot = () => {
  const container = document.querySelector("#app");

  if (!container) {
    throw new Error("Контейнер #app не знайдено.");
  }

  const app = createApp();
  app.init(container);
};

boot();


