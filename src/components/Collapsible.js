import React, { useState } from "react";
import "./Collapsible.css";

export default function Collapsible({ title, children }) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="collapsible-horizontal">
      <button
        className="collapsible-header"
        onClick={() => setIsOpen(!isOpen)}
      >
        <span>{title}</span>
        <span className={`arrow ${isOpen ? "open" : ""}`}>&#9656;</span>
      </button>

      <div className={`collapsible-panel ${isOpen ? "open" : ""}`}>
        <div className="content-inner">{children}</div>
      </div>
    </div>
  );
}
