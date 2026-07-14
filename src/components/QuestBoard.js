// src/QuestBoard.jsx - full-bleed board, random placement, count-based scaling
import React, { useState, useMemo, useRef, useEffect } from "react";
import quests from "./quests";
import QuestCard from "./QuestCard";
import QuestModal from "./QuestModal";
import QuestTabs from "./QuestTabs";
import QuestLegend from "./QuestLegend";
import "./QuestBoard.css";

const BOARD_H = 800; // px (matches .scatter-board height)
const EDGE_PAD = 28; // keep scrolls off the wooden frame
const MAX_OVERLAP = 0.3; // HARD ceiling: no two scrolls may overlap more than 30%

// Scroll width shrinks as more scrolls land on the board.
function scrollWidth(n) {
  const w = 360 - (n - 2) * 12;
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

  // A quest's `type` may be a single string ("Main") or an array of strings
  // (["Main", "Forge"]) so one quest can appear under multiple tabs.
  const hasType = (q, tab) =>
    Array.isArray(q.type) ? q.type.includes(tab) : q.type === tab;

  const filtered = useMemo(
    () =>
      activeTab === "All" ? quests : quests.filter((q) => hasType(q, activeTab)),
    [activeTab]
  );

  // === RANDOM PLACEMENT WITH BOUNDED OVERLAP ===
  const layout = useMemo(() => {
    const n = filtered.length;
    const width = boardW || 1200;
    const isNarrow = width < 820;

    // Card width is count-based (like desktop) but capped to a share of the
    // board so on a narrow phone board the scrolls scale down and still
    // scatter (instead of stacking into one column).
    const edge = Math.max(12, Math.min(EDGE_PAD, Math.round(width * 0.05)));
    const maxOverlap = isNarrow ? 0.12 : MAX_OVERLAP;

    // The board height stays the SAME on every tab. On a narrow board we keep a
    // fixed height and instead scale the scroll size to the count, so a busy tab
    // packs tighter (smaller scrolls) without ever changing the board's size.
    let cardW, cardH, boardH;
    if (isNarrow) {
      const NARROW_H = 800; // fixed phone board height (consistent per tab)
      const RATIO = 1.4;     // narrow scrolls are taller (text wraps more)
      const FILL = 0.5;      // target scroll-area / board-area
      const ideal = Math.sqrt((FILL * width * NARROW_H) / (Math.max(1, n) * RATIO));
      cardW = Math.round(Math.max(110, Math.min(width * 0.5, ideal)));
      cardH = Math.round(cardW * RATIO);
      boardH = NARROW_H;
    } else {
      cardW = Math.min(scrollWidth(n), Math.round(width * 0.55));
      cardH = Math.round(cardW * 1.2);
      boardH = BOARD_H;
    }

    const maxX = Math.max(0, width - cardW - edge * 2);

    const overlapFrac = (a, b) => {
      const ox = Math.max(0, Math.min(a.x + cardW, b.x + cardW) - Math.max(a.x, b.x));
      const oy = Math.max(0, Math.min(a.y + cardH, b.y + cardH) - Math.max(a.y, b.y));
      return (ox * oy) / (cardW * cardH);
    };

    // Scatter all n scrolls on a board of height h. Each candidate spot is
    // scored by its TRUE worst overlap against every placed scroll. (The old
    // version bailed at the first neighbour over the cap and recorded that
    // partial value as the score, so a spot overlapping one scroll 21% and
    // another 95% counted as "21%" — that's how near-total pile-ups got in.)
    const TRIES = 500;
    const placeAll = (h, seed) => {
      const rng = mulberry32(seed);
      const maxY = Math.max(0, h - cardH - edge * 2);
      const placed = [];
      let worst = 0;
      for (let i = 0; i < n; i++) {
        let best = null;
        let bestScore = Infinity;
        for (let t = 0; t < TRIES; t++) {
          const cand = { x: edge + rng() * maxX, y: edge + rng() * maxY };
          let mx = 0;
          for (const p of placed) {
            const ov = overlapFrac(cand, p);
            if (ov > mx) mx = ov;
            if (mx >= bestScore) break; // provably no better than the current best
          }
          if (mx < bestScore) {
            bestScore = mx;
            best = cand;
          }
          // First spot under the cap wins — keeps the scatter looking random
          // instead of packing everything into a tidy minimum-overlap grid.
          if (bestScore <= maxOverlap) break;
        }
        worst = Math.max(worst, bestScore);
        best.rotation = (rng() - 0.5) * 18; // -9° .. +9°
        placed.push(best);
      }
      return { placed, worst };
    };

    // The cap is a guarantee, not a suggestion: if a tab is too crowded for
    // maxOverlap at this height, grow the board ~20% and re-scatter until the
    // ceiling holds (bounded so a pathological case can't loop forever).
    const baseSeed = hashStr(activeTab) ^ (n * 2654435761);
    let h = boardH;
    let result = placeAll(h, baseSeed);
    for (let attempt = 1; result.worst > maxOverlap && attempt <= 6; attempt++) {
      h = Math.round(h * 1.2);
      result = placeAll(h, baseSeed ^ (attempt * 0x9e3779b9));
    }

    return { cardW, positions: result.placed, boardH: h };
  }, [filtered, activeTab, boardW]);

  return (
    <div className="qb-root">
      {/* <header className="qb-header">
        <h1>🛡️ Quest Board - Adventures of Dominic Guevarra</h1>
        <p className="qb-sub">Pinned notices scattered are my previous work experiences.</p>
      </header> */}

      {/* Full-bleed stage: tabs (top-left) + legend (top-right) + board share
          one positioning context so the legend can float over the board. */}
      <div className="qb-stage">
        <QuestTabs active={activeTab} setActive={setActiveTab} />

        <QuestLegend />

        <div
          className="scatter-board"
          ref={boardRef}
          style={{ height: `${layout.boardH}px` }}
        >
          {filtered.map((quest, index) => {
            const pos = layout.positions[index];
            return (
              <div
                key={quest.id}
                className="scatter-item"
                style={{
                  left: `${pos.x}px`,
                  top: `${pos.y}px`,
                  width: `${layout.cardW}px`,
                  transform: `rotate(${pos.rotation}deg)`,
                }}
              >
                <QuestCard
                  quest={quest}
                  cardW={layout.cardW}
                  onOpen={() => setOpenQuest(quest)}
                />
              </div>
            );
          })}
        </div>
      </div>

      <QuestModal quest={openQuest} onClose={() => setOpenQuest(null)} />
    </div>
  );
}
