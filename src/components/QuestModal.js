// src/components/QuestModal.jsx
import React, { useState, useEffect, useRef } from "react";
import { createPortal } from "react-dom";
import { AnimatePresence, motion } from "motion/react";
import Masonry from "./Masonry";
import { scrollToSection } from "../lib/sectionNav";
import "./QuestBoard.css";

// Real, working résumé link (the same one the footer uses). The previous
// "Download CV" button pointed at a local file:/// path that only resolved on
// the author's machine.
const RESUME_URL =
  "https://drive.google.com/file/d/16SPsT7gw2MgRJkKQ3aOUJpnngh_EEcCw/view?usp=sharing";

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

  // Lock background scrolling while the modal is open, so the wheel scrolls the
  // modal (not the page behind it). Pad for the removed scrollbar to avoid a jump.
  useEffect(() => {
    if (!quest) return;
    const { body, documentElement: html } = document;
    const scrollbar = window.innerWidth - html.clientWidth;
    const prevOverflow = body.style.overflow;
    const prevPad = body.style.paddingRight;
    body.style.overflow = "hidden";
    if (scrollbar > 0) body.style.paddingRight = `${scrollbar}px`;
    return () => {
      body.style.overflow = prevOverflow;
      body.style.paddingRight = prevPad;
    };
  }, [quest]);

  // Closing the modal (Escape/overlay/seal) can skip onItemLeave, which would
  // leave a stale enlarge-preview behind for the next open — clear it.
  useEffect(() => {
    if (!quest) setHoverImg(null);
  }, [quest]);

  // Escape closes the scroll, like any well-mannered dialog.
  useEffect(() => {
    if (!quest) return;
    const onKey = (e) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [quest, onClose]);

  // Move keyboard focus into the dialog on open, and give it back on close.
  const sealRef = useRef(null);
  const lastFocused = useRef(null);
  useEffect(() => {
    if (quest) {
      lastFocused.current = document.activeElement;
      const t = setTimeout(() => sealRef.current?.focus(), 80);
      return () => clearTimeout(t);
    }
    if (lastFocused.current) {
      lastFocused.current.focus?.();
      lastFocused.current = null;
    }
  }, [quest]);

  const masonryItems =
    quest?.images?.map((img, i) => {
      const src = `/images/${img}`;
      return { id: `${quest.id}-${i}`, img: src, url: src, height: 600 };
    }) ?? [];

  // Portaled to <body> so the fixed overlay is positioned against the real
  // viewport, not the transformed Section ancestor (which would let the board
  // behind it show through / move when scrolling). AnimatePresence keeps the
  // scroll mounted through its exit animation after `quest` goes null.
  return createPortal(
    <AnimatePresence>
      {quest && (
        <motion.div
          className="modal-overlay"
          onClick={onClose}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0, transition: { duration: 0.2, ease: "easeIn" } }}
          transition={{ duration: 0.25, ease: "easeOut" }}
        >
          <motion.div
            className="modal-parchment"
            role="dialog"
            aria-modal="true"
            aria-label={quest.title}
            onClick={(e) => e.stopPropagation()}
            initial={{ opacity: 0, y: -34, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{
              opacity: 0,
              y: 18,
              scale: 0.97,
              transition: { duration: 0.18, ease: "easeIn" },
            }}
            transition={{ type: "spring", stiffness: 300, damping: 26 }}
          >

        {/* Wax Seal = Close Button (stays outside the scroll area) */}
        <button
          className="modal-wax-button"
          onClick={onClose}
          aria-label="Close"
          ref={sealRef}
        >
          <img
            src="/images/wax-seal.webp"
            alt=""
            aria-hidden="true"
            className="wax-img"
          />
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
            {/* Only shown when the quest declares a real link (see quests.js).
                Proprietary client work simply omits these. */}
            {quest.liveUrl && (
              <a
                className="btn"
                href={quest.liveUrl}
                target="_blank"
                rel="noreferrer"
              >
                <span aria-hidden="true">⚔️</span> Visit the Realm
              </a>
            )}
            {quest.repoUrl && (
              <a
                className="btn ghost"
                href={quest.repoUrl}
                target="_blank"
                rel="noreferrer"
              >
                <span aria-hidden="true">🗡️</span> Read the Source
              </a>
            )}
            <a
              className="btn ghost"
              href={RESUME_URL}
              target="_blank"
              rel="noreferrer"
            >
              <span aria-hidden="true">📜</span> Download CV
            </a>
            <button
              type="button"
              className="btn"
              onClick={() => {
                onClose();
                // Let the modal unmount before scrolling to the contact section.
                requestAnimationFrame(() => scrollToSection("contact"));
              }}
            >
              <span aria-hidden="true">✉️</span> Send a Raven
            </button>
          </div>
        </div>
          </motion.div>

          {/* Centered enlarge preview on hover (desktop). pointer-events:none
              keeps the tile hovered (no flicker). Portaled to <body> so it
              centers on the real viewport. */}
          {!isMobile &&
            hoverImg &&
            createPortal(
              <img src={hoverImg} alt="" className="quest-image-preview" />,
              document.body
            )}
        </motion.div>
      )}
    </AnimatePresence>,
    document.body
  );
}
