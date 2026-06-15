import React, { Suspense, lazy } from "react";
// Lazy-loaded (three.js) — shares the dice chunk with the Character section.
const D4 = lazy(() => import("./dice/D4"));
const D6 = lazy(() => import("./dice/D6"));
const D8 = lazy(() => import("./dice/D8"));
const D10 = lazy(() => import("./dice/D10"));
const D12 = lazy(() => import("./dice/D12"));
const D20 = lazy(() => import("./dice/D20"));

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
        <Suspense fallback={null}>
          <DiceComponent
            onRollComplete={(value) => handleRollComplete(value, ability)}
          />
        </Suspense>
      </div>
    </div>
  );
}
