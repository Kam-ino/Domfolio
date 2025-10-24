import React, { useState } from "react";
import Dice from "./Dice";
import "./Dice.css";

export default function DiceRoller() {
  const [rollResult, setRollResult] = useState(null);
  const [rolling, setRolling] = useState(false);
  const diceTypes = [4, 6, 8, 10, 12, 20];

  function rollDice(sides) {
    if (rolling) return;
    setRolling(true);

    const result = Math.floor(Math.random() * sides) + 1;
    setRollResult(result);

    setTimeout(() => setRolling(false), 2000);
  }

  return (
    <div className="dice-roller-container">
      <h1 className="dice-title">🎲 3D Dice Roller</h1>
      <div className="dice-grid">
        {diceTypes.map((sides) => (
          <Dice
            key={sides}
            sides={sides}
            isRolling={rolling}
            rollResult={rollResult}
            colorMain="#760C10"
            colorAccent="#D7B82B"
          />
        ))}
      </div>

      <div className="dice-controls">
        {diceTypes.map((sides) => (
          <button
            key={sides}
            onClick={() => rollDice(sides)}
            disabled={rolling}
          >
            Roll D{sides}
          </button>
        ))}
      </div>

      {rollResult && <p className="dice-result">Result: {rollResult}</p>}
    </div>
  );
}
