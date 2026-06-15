import React, { useState } from "react";
import D4 from "./dice/D4";
import D6 from "./dice/D6";
import D8 from "./dice/D8";
import D10 from "./dice/D10";
import D12 from "./dice/D12";
import D20 from "./dice/D20";

export default function DiceModal({ diceSides, onRollComplete, ability }) {
  const diceMap = {
    4: D4,
    6: D6,
    8: D8,
    10: D10,
    12: D12,
    20: D20,
  };

  const DiceComponent = diceMap[diceSides];

  const handleRollComplete = (value, ability) => {
    setTimeout(() => {
      onRollComplete(value, ability);
    }, 2500);                // delay for dice-to-UI sync
  };


  // Drop your art at public/images/dice-bg.webp to show it behind the roll.
  // Runtime URL (not a CSS url()) so a missing file just falls back to the
  // dark backdrop instead of failing the build.
  return (
    <div
      className="dice-modal-overlay"
      style={{ backgroundImage: "url('/images/dice-bg.webp')" }}
    >
      <div className="dice-modal-container">
        <DiceComponent
          onRollComplete={(value) => handleRollComplete(value, ability)}
        />
      </div>
    </div>
  );
}
