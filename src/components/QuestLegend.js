// src/components/QuestLegend.jsx
// A hover-reveal legend tab, pinned to the top-right of the quest board.
// Its panel floats over the board (CSS) instead of pushing layout down.
import React from "react";
import "./QuestLegend.css";

const CATEGORIES = [
  { tab: "Main", icon: "⚔️", title: "Main Quests", sub: "Work Experience" },
  { tab: "Side", icon: "🗺️", title: "Side Quests", sub: "Other Roles & Experience" },
  { tab: "Guild", icon: "📜", title: "Guild Contracts", sub: "Education & Certifications" },
  { tab: "Forge", icon: "🔨", title: "Forge", sub: "Projects" },
];

export default function QuestLegend() {
  return (
    <div className="quest-legend">
      <button
        type="button"
        className="quest-legend_trigger"
        aria-haspopup="true"
      >
        <span className="quest-legend_book" aria-hidden="true">📖</span>
        <span className="quest-legend_label">Quest Log Guide</span>
        <span className="quest-legend_arrow" aria-hidden="true">
          &#9656;
        </span>
      </button>

      <div
        className="quest-legend_panel"
        role="region"
        aria-label="Quest categories"
      >
        <ul className="quest-legend_list">
          {CATEGORIES.map((c) => (
            <li key={c.tab} className="quest-legend_item">
              <span className="quest-legend_icon" aria-hidden="true">
                {c.icon}
              </span>
              <span className="quest-legend_text">
                <span className="quest-legend_title">{c.title}</span>
                <span className="quest-legend_sub">{c.sub}</span>
              </span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
