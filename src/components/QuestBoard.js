// src/QuestBoard.jsx (Scatter Layout with Anti-Overlap)
import React, { useState, useMemo, useRef } from "react";
import quests from "./quests";
import QuestCard from "./QuestCard";
import QuestModal from "./QuestModal";
import QuestTabs from "./QuestTabs";
import "./QuestBoard.css";

export default function QuestBoard() {
  const [activeTab, setActiveTab] = useState("Main");
  const [openQuest, setOpenQuest] = useState(null);

  const BOARD_WIDTH = 100;  // percent width
  const BOARD_HEIGHT = 100; // percent height
  const CARD_WIDTH = 22;    // percent width of each card approx
  const CARD_HEIGHT = 25;   // percent height approx

  const filtered = useMemo(() => {
    return activeTab === "All"
      ? quests
      : quests.filter((q) => q.type === activeTab);
  }, [activeTab]);

  // === ANTI-OVERLAP SCATTER ALGORITHM ===
  const questPositions = useMemo(() => {
    const positions = [];

    const hasCollision = (x, y) => {
      return positions.some((p) => {
        const colX = Math.abs(p.x - x) < CARD_WIDTH;
        const colY = Math.abs(p.y - y) < CARD_HEIGHT;
        return colX && colY;
      });
    };

    for (let i = 0; i < filtered.length; i++) {
      let x, y, tries = 0;

      do {
        x = Math.random() * (BOARD_WIDTH - CARD_WIDTH - 5) + 4;
        y = Math.random() * (BOARD_HEIGHT - CARD_HEIGHT - 5) + 4;
        tries++;
        // If it tries too many times, relax overlap rules slightly
        if (tries > 30) break;
      } while (hasCollision(x, y));

      positions.push({
        x,
        y,
        rotation: Math.random() * 30 - 15 // -15° to +15°
      });
    }

    return positions;
  }, [filtered]);

  return (
    <div className="qb-root">
      <header className="qb-header">
        <h1>🛡️ Quest Board — Adventures of Dominic Guevarra</h1>
        <p className="qb-sub">Pinned notices scattered are my previous work experiences.</p>
      </header>

      <QuestTabs active={activeTab} setActive={setActiveTab} />

      <div className="scatter-board">
        {filtered.map((quest, index) => {
          const pos = questPositions[index];
          return (
            <div
              key={quest.id}
              className="scatter-item"
              style={{
                left: `${pos.x}%`,
                top: `${pos.y}%`,
                transform: `rotate(${pos.rotation}deg)`
              }}
            >
              <QuestCard quest={quest} onOpen={() => setOpenQuest(quest)} />
            </div>
          );
        })}
      </div>

      <QuestModal quest={openQuest} onClose={() => setOpenQuest(null)} />
    </div>
  );
}
