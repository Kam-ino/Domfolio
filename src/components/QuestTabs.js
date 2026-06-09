// src/components/QuestTabs.jsx
import React from "react";

export default function QuestTabs({ active, setActive }) {
  const tabs = ["Main", "Side", "Guild", "Forge", "All"];

  return (
    <div className="quest-tabbed">
      <div className="quest-tab-labels">
        {tabs.map((t) => (
          <label
            key={t}
            className={`quest-tab-label ${active === t ? "active" : ""}`}
            onClick={() => setActive(t)}
          >
            {t}
          </label>
        ))}
      </div>
    </div>
  );
}

    