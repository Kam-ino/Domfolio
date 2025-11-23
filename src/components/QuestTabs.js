// src/components/QuestTabs.jsx
import React from "react";

export default function QuestTabs({ active, setActive }) {
  const tabs = ["Main", "Side", "Guild", "All"];
  return (
    <div className="quest-tabs">
      {tabs.map((t) => (
        <button
          key={t}
          className={`tab ${active === t ? "active" : ""}`}
          onClick={() => setActive(t)}
        >
          {t}
        </button>
      ))}
    </div>
  );
}
    