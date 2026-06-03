// src/components/QuestModal.jsx
import React, { useState } from "react";
import { createPortal } from "react-dom";
import "./QuestBoard.css";

export default function QuestModal({ quest, onClose }) {
  // Filename of the image currently hovered (shows the centered preview).
  const [hoverImg, setHoverImg] = useState(null);

  if (!quest) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-parchment" onClick={(e) => e.stopPropagation()}>

        {/* Wax Seal = Close Button */}
        <button className="modal-wax-button" onClick={onClose}>
          <img src="/images/wax-seal.png" alt="close seal" className="wax-img" />
        </button>

        <h2 className="modal-title">{quest.title}</h2>
        <h4 className="modal-sub">{quest.subtitle}</h4>
        <p className="modal-time">{quest.timeline}</p>
        {quest.images && quest.images.length > 0 && (
        <div className="modal-images">
            {quest.images.map((img, i) => (
            <img
                key={i}
                src={`/images/${img}`}
                alt={`quest-img-${i}`}
                className="quest-image"
                onMouseEnter={() => setHoverImg(img)}
                onMouseLeave={() => setHoverImg(null)}
            />
            ))}
        </div>
        )}
        <div className="modal-details">
          <ul>
            {quest.details.map((d, i) => (
              <li key={i}>{d}</li>
            ))}
          </ul>
        </div>

        <div className="modal-reward">
          <strong>Reward:</strong> {quest.reward}
        </div>

        <div className="modal-actions">
          <a className="btn" href="/#">View Project</a>
          <a
            className="btn ghost"
            href="file:///mnt/data/Dominic Santiago Guevarra CV (1).pdf"
            target="_blank"
            rel="noreferrer"
          >
            Download CV
          </a>
        </div>
      </div>

      {/* Centered hover preview — capped at 600px tall, ignores the pointer so
          the thumbnail keeps :hover (no flicker) and clicks still close.
          Portaled to <body> so it centers against the real viewport rather
          than the overlay's backdrop-filter containing block. */}
      {hoverImg &&
        createPortal(
          <img
            src={`/images/${hoverImg}`}
            alt="quest preview"
            className="quest-image-preview"
          />,
          document.body
        )}
    </div>
  );
}
