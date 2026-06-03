// src/QuestBoard.jsx — full-bleed board, random placement, count-based scaling
import React, { useState, useMemo, useRef, useEffect } from "react";
import quests from "./quests";
import QuestCard from "./QuestCard";
import QuestModal from "./QuestModal";
import QuestTabs from "./QuestTabs";
import "./QuestBoard.css";

const BOARD_H = 1000; // px (matches .scatter-board height)
const EDGE_PAD = 28; // keep scrolls off the wooden frame
const MAX_OVERLAP = 0.2; // allow scrolls to overlap up to ~20%
const CARD_W = 300; // nominal scroll width used to decide column count
const COL_GAP = 36; // nominal gap between columns

// Scroll width shrinks as more scrolls land on the board.
function scrollWidth(n) {
  const w = 360 - (n - 3) * 12;
  return Math.max(185, Math.min(360, Math.round(w)));
}

// Deterministic RNG so a given tab always scatters the same way (and doesn't
// re-randomise on every render / resize), while still looking random.
function hashStr(s) {
  let h = 2166136261;
  for (let i = 0; i < s.length; i++) {
    h ^= s.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return h >>> 0;
}
function mulberry32(a) {
  return function () {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

export default function QuestBoard() {
  const [activeTab, setActiveTab] = useState("Main");
  const [openQuest, setOpenQuest] = useState(null);
  const [boardW, setBoardW] = useState(0);
  const boardRef = useRef(null);

  useEffect(() => {
    const el = boardRef.current;
    if (!el) return;
    const update = () => setBoardW(el.clientWidth);
    update();
    const ro = new ResizeObserver(update);
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  const filtered = useMemo(
    () =>
      activeTab === "All" ? quests : quests.filter((q) => q.type === activeTab),
    [activeTab]
  );

  // === RANDOM PLACEMENT WITH BOUNDED OVERLAP ===
  const layout = useMemo(() => {
    const n = filtered.length;
    const width = boardW || 1200;
    const cols = Math.max(1, Math.min(3, Math.floor(width / (CARD_W + COL_GAP))));

    // Stack the scrolls in a tidy column on phones/tablets/narrow panes — the
    // random scatter only reads well when the board is genuinely wide. Below
    // ~820px it would cram and overlap, so stack instead.
    if (width < 820) {
      const cardW = Math.min(340, Math.max(200, width - 56));
      const positions = filtered.map((_, i) => ({
        rotation: (mulberry32(hashStr(activeTab) ^ (i * 2654435761))() - 0.5) * 6,
      }));
      return { cardW, positions, stacked: true };
    }

    const cardW = scrollWidth(n);
    const cardH = Math.round(cardW * 1.2); // approx scroll height for placement
    const maxX = Math.max(0, width - cardW - EDGE_PAD * 2);
    const maxY = Math.max(0, BOARD_H - cardH - EDGE_PAD * 2);

    const rng = mulberry32(hashStr(activeTab) ^ (n * 2654435761));

    const overlapFrac = (a, b) => {
      const ox = Math.max(0, Math.min(a.x + cardW, b.x + cardW) - Math.max(a.x, b.x));
      const oy = Math.max(0, Math.min(a.y + cardH, b.y + cardH) - Math.max(a.y, b.y));
      return (ox * oy) / (cardW * cardH);
    };

    const placed = [];
    for (let i = 0; i < n; i++) {
      let best = null;
      let bestScore = Infinity;
      for (let t = 0; t < 280; t++) {
        const cand = { x: EDGE_PAD + rng() * maxX, y: EDGE_PAD + rng() * maxY };
        let mx = 0;
        for (const p of placed) {
          const ov = overlapFrac(cand, p);
          if (ov > mx) mx = ov;
          if (mx > MAX_OVERLAP) break;
        }
        if (mx <= MAX_OVERLAP) {
          best = cand;
          break;
        }
        if (mx < bestScore) {
          bestScore = mx;
          best = cand;
        }
      }
      best.rotation = (rng() - 0.5) * 18; // -9° .. +9°
      placed.push(best);
    }

    return { cardW, positions: placed, stacked: false };
  }, [filtered, activeTab, boardW]);

  return (
    <div className="qb-root">
      {/* <header className="qb-header">
        <h1>🛡️ Quest Board — Adventures of Dominic Guevarra</h1>
        <p className="qb-sub">Pinned notices scattered are my previous work experiences.</p>
      </header> */}

      <QuestTabs active={activeTab} setActive={setActiveTab} />

      <div
        className={`scatter-board ${layout.stacked ? "scatter-board--stack" : ""}`}
        ref={boardRef}
      >
        {filtered.map((quest, index) => {
          const pos = layout.positions[index];
          const style = layout.stacked
            ? { width: `${layout.cardW}px`, transform: `rotate(${pos.rotation}deg)` }
            : {
                left: `${pos.x}px`,
                top: `${pos.y}px`,
                width: `${layout.cardW}px`,
                transform: `rotate(${pos.rotation}deg)`,
              };
          return (
            <div key={quest.id} className="scatter-item" style={style}>
              <QuestCard
                quest={quest}
                cardW={layout.cardW}
                onOpen={() => setOpenQuest(quest)}
              />
            </div>
          );
        })}
      </div>

      <QuestModal quest={openQuest} onClose={() => setOpenQuest(null)} />
    </div>
  );
}
