import React from "react";

export const StatsPanel = ({ items }) => (
  <div className="stats">
    {items.map((item) => (
      <article className="stat-card" key={item.label}>
        <p className="stat-card__label">{item.label}</p>
        <p className="stat-card__value">{item.value}</p>
      </article>
    ))}
  </div>
);


