import React, { useEffect, useRef } from "react";

export default function Dice({ sides, isRolling, rollResult, colorMain, colorAccent }) {
  const diceRef = useRef();

  useEffect(() => {
    if (isRolling && diceRef.current) {
      // Randomize rotation on roll
      const x = Math.floor(Math.random() * 360);
      const y = Math.floor(Math.random() * 360);
      const z = Math.floor(Math.random() * 360);
      diceRef.current.style.transform = `rotateX(${x}deg) rotateY(${y}deg) rotateZ(${z}deg)`;
    }
  }, [isRolling]);

  return (
    <div className="dice-container">
      <div
        ref={diceRef}
        className={`dice dice-${sides}`}
        style={{ "--main": colorMain, "--accent": colorAccent }}
      >
        {[...Array(sides)].map((_, i) => (
          <div key={i} className="face">
            {i + 1}
          </div>
        ))}
      </div>
      <p className="dice-label">D{sides}</p>
    </div>
  );
}
