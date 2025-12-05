import React from "react";
import ReactDOM from "react-dom";

export const ResultsModal = ({ isOpen, stats, onReplay, onNext }) => {
  if (!isOpen) return null;

  const modalRoot = document.getElementById("modal-root");
  if (!modalRoot) return null;

  return ReactDOM.createPortal(
    <div className="modal-overlay" role="dialog" aria-modal="true">
      <div className="modal">
        <h2>Гру завершено!</h2>
        <p>Час: {stats?.elapsed ?? "--:--"}</p>
        <p>Ходи: {stats?.moves ?? 0}</p>
        <p>Точність: {stats?.accuracy ?? 0}%</p>

        <div className="actions">
          <button className="btn-primary" onClick={onNext}>
            Наступний тур
          </button>
          <button className="btn-secondary" onClick={onReplay}>
            Повторити
          </button>
        </div>
      </div>
    </div>,
    modalRoot,
  );
};



