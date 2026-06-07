// src/components/QuestModal.jsx
import React, { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import Masonry from "./Masonry";
import "./QuestBoard.css";

export default function QuestModal({ quest, onClose }) {
  // Hovered image -> centered enlarge preview (desktop only; touch has no hover)
  const [hoverImg, setHoverImg] = useState(null);
  const [isMobile, setIsMobile] = useState(
    () => typeof window !== "undefined" && window.matchMedia("(max-width: 720px)").matches
  );
  useEffect(() => {
    const mq = window.matchMedia("(max-width: 720px)");
    const update = () => setIsMobile(mq.matches);
    update();
    mq.addEventListener("change", update);
    return () => mq.removeEventListener("change", update);
  }, []);

  if (!quest) return null;

  const masonryItems =
    quest.images?.map((img, i) => {
      const src = `/images/${img}`;
      return { id: `${quest.id}-${i}`, img: src, url: src, height: 600 };
    }) ?? [];

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-parchment" onClick={(e) => e.stopPropagation()}>

        {/* Wax Seal = Close Button (stays outside the scroll area) */}
        <button className="modal-wax-button" onClick={onClose}>
          <img src="/images/wax-seal.png" alt="close seal" className="wax-img" />
        </button>

        <div className="modal-scroll">
          <h2 className="modal-title">{quest.title}</h2>
          <h4 className="modal-sub">{quest.subtitle}</h4>
          <p className="modal-time">{quest.timeline}</p>
          {masonryItems.length > 0 && (
            <div className="modal-masonry">
              <Masonry
                items={masonryItems}
                animateFrom="bottom"
                duration={0.6}
                stagger={0.06}
                scaleOnHover={true}
                hoverScale={0.97}
                blurToFocus={true}
                colorShiftOnHover={false}
                onItemEnter={isMobile ? undefined : (it) => setHoverImg(it.img)}
                onItemLeave={isMobile ? undefined : () => setHoverImg(null)}
                onItemClick={isMobile ? (it) => window.open(it.img, "_blank", "noopener") : () => {}}
              />
              <p className="modal-masonry-hint">
                {isMobile ? "Tap an image to view it full size" : "Hover over an image to enlarge"}
              </p>
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
      </div>

      {/* Centered enlarge preview on hover (desktop). pointer-events:none keeps
          the tile hovered (no flicker). Portaled to <body> so it centers on the
          real viewport. */}
      {!isMobile &&
        hoverImg &&
        createPortal(
          <img src={hoverImg} alt="quest preview" className="quest-image-preview" />,
          document.body
        )}
    </div>
  );
}
