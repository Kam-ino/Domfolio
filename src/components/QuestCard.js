// src/components/QuestCard.jsx
import React from "react";
import "./QuestBoard.css"; // small file for card-specific overrides if you want (optional)

const difficultyColors = {
  "SS+": { border: "#d4af37", glow: "#f5e6a7" }, // Mythic Gold
  SS:   { border: "#b22222", glow: "#f8d7d7" }, // Ruby/Crimson
  S:    { border: "#ffd700", glow: "#fff4cc" }, // Gold
  A:    { border: "#0f52ba", glow: "#dfe8ff" }, // Sapphire
  B:    { border: "#ffbf00", glow: "#fff3d6" }, // Amber
  C:    { border: "#8b5a2b", glow: "#f0e4d1" }, // Leather Brown
  D:    { border: "#c9b59d", glow: "#f6f0e7" }, // Dusty Beige
  E:    { border: "#e6dccb", glow: "#fbf7ef" }  // Pale Parchment
};

export default function QuestCard({ quest, onOpen }) {
  const color = difficultyColors[quest.difficulty] || difficultyColors["C"];
  return (
    <div
      className="quest-card"
      style={{
        borderColor: color.border,
        boxShadow: `0 8px 20px rgba(0,0,0,0.25), 0 0 16px ${color.glow}66 inset`
      }}
      onClick={() => onOpen(quest)}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => e.key === "Enter" && onOpen(quest)}
    >
      <div className="quest-ribbon" style={{ background: color.border }}>
        <span className="ribbon-text">{quest.difficulty}</span>
      </div>

      <h3 className="quest-title">{quest.title}</h3>
      <div className="quest-sub">{quest.subtitle}</div>
      <ul className="quest-preview">
        {quest.details.slice(0, 3).map((d, i) => (
          <li key={i}>{d}</li>
        ))}
      </ul>
      <div className="quest-footer">
        <small>{quest.timeline || ""}</small>
        <span className="reward">{quest.reward}</span>
      </div>
    </div>
  );
}
