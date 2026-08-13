import React, { useEffect, useMemo, useRef, useState } from "react";
import DiceModal from "./DiceModal";
import "./Game.css";

const COOLDOWN_SECONDS = 10;
const ENEMY_FADE_MS = 650;
const ENEMY_ATTACK_DELAY_MS = 900;

function randInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function shuffle(arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

export default function Game() {
  const baseEnemies = useMemo(
    () => [
      { name: "Goblin", hp: 15, maxHp: 15, dice: 6, image: "https://mmylzwtzvdhwtwhfvlam.supabase.co/storage/v1/object/public/images/Goblin.webp", isDead: false },
      { name: "Orc", hp: 28, maxHp: 28, dice: 12, image: "https://mmylzwtzvdhwtwhfvlam.supabase.co/storage/v1/object/public/images/Orc.webp", isDead: false },
      { name: "Skeleton", hp: 12, maxHp: 12, dice: 10, image: "https://mmylzwtzvdhwtwhfvlam.supabase.co/storage/v1/object/public/images/Skeleton.webp", isDead: false },
    ],
    []
  );

  const boss = useMemo(
    () => ({ name: "Dragon", hp: 50, maxHp: 50, dice: 20, image: "https://mmylzwtzvdhwtwhfvlam.supabase.co/storage/v1/object/public/images/Dragon.webp", isDead: false }),
    []
  );

  const classes = useMemo(
    () => ({
      Wizard: { hp: 35, image: "https://mmylzwtzvdhwtwhfvlam.supabase.co/storage/v1/object/public/images/CharacterSprite (1).webp" },
      Warrior: { hp: 60, image: "https://mmylzwtzvdhwtwhfvlam.supabase.co/storage/v1/object/public/images/CharacterSprite (2).webp" },
      Rogue: { hp: 50, image: "https://mmylzwtzvdhwtwhfvlam.supabase.co/storage/v1/object/public/images/CharacterSprite (3).webp" },
    }),
    []
  );

  const abilities = useMemo(
    () => ({
      Rogue: {
        "Sneak Attack": { dice: "D12", successCondition: 9 },
        "Trap": { dice: "D6", successCondition: 3 },
        "Escape": { dice: "D20", successCondition: 18 },
        "Critical Strike": { dice: "D10", successCondition: 7 },
      },
      Warrior: {
        "Shield Bash": { dice: "D8", successCondition: 5 },
        "Whirlwind": { dice: "D12", successCondition: 7 },
        "Fortify": { dice: "D6", successCondition: 2 },
        "Executioner’s Strike": { dice: "D20", successCondition: 12 },
      },
      Wizard: {
        "Fireball": { dice: "D12", successCondition: 6 },
        "Arcane Shield": { dice: "D10", successCondition: 4 },
        "Lightning Bolt": { dice: "D8", successCondition: 5 },
        "Teleport": { dice: "D20", successCondition: 10 },
      },
    }),
    []
  );

  const [playerClass, setPlayerClass] = useState(null);
  const [player, setPlayer] = useState(null);

  const [enemyOrder, setEnemyOrder] = useState([]); // 3 shuffled + boss
  const [enemyIndex, setEnemyIndex] = useState(0);
  const [enemy, setEnemy] = useState(null);

  const [log, setLog] = useState([]);
  const [diceModal, setDiceModal] = useState(null);

  const [currentAttacker, setCurrentAttacker] = useState("player");
  const [enemyFade, setEnemyFade] = useState("");

  // Global cooldown
  const [cooldownUntil, setCooldownUntil] = useState(0);
  const cooldownLeft = Math.max(0, Math.ceil((cooldownUntil - Date.now()) / 1000));

  // ✅ Flask item (all classes)
  const [flasksLeft, setFlasksLeft] = useState(3);

  // ---- Battle FX ------------------------------------------------------------
  // A visual-only layer: floating damage/heal numbers and short-lived sprite
  // classes (lunge/flash). It never touches combat logic, HP math, or timers —
  // the fragile turn machinery above stays exactly as it is.
  const [fx, setFx] = useState([]); // {id, target:"player"|"enemy", kind:"hit"|"heal", text, drift}
  const fxIdRef = useRef(0);
  const spawnFx = (target, kind, text) => {
    const id = ++fxIdRef.current;
    const drift = Math.round(Math.random() * 36 - 18); // px, so repeats don't stack
    setFx((list) => [...list, { id, target, kind, text, drift }]);
  };
  const removeFx = (id) => setFx((list) => list.filter((f) => f.id !== id));

  // Transient animation classes; cleared onAnimationEnd so the same class can
  // re-trigger next turn ("" -> class always restarts the keyframes).
  const [playerSprite, setPlayerSprite] = useState(""); // "sprite-attack" | "sprite-hit" | ""
  const [enemySprite, setEnemySprite] = useState("");

  // Damage/heal the player WITH the matching effects. Used by ability
  // self-damage and heals; the enemy's own attack keeps its bespoke path in
  // applyEnemyDamageToPlayer (it logs differently).
  const hurtPlayer = (amount) => {
    if (amount <= 0) return;
    setPlayer((prev) => (prev ? { ...prev, hp: Math.max(0, prev.hp - amount) } : prev));
    spawnFx("player", "hit", `-${Math.round(amount)}`);
    setPlayerSprite("sprite-hit");
  };
  const healPlayer = (amount) => {
    const shown = Math.round(amount);
    if (shown <= 0) return;
    setPlayer((prev) => (prev ? { ...prev, hp: Math.min(prev.maxHp, prev.hp + amount) } : prev));
    spawnFx("player", "heal", `+${shown}`);
  };

  // Green above half, amber to a quarter, red (pulsing) below that.
  const hpTone = (unit) => {
    const p = unit.hp / unit.maxHp;
    return p <= 0.25 ? "hp-low" : p <= 0.5 ? "hp-mid" : "";
  };

  // Win/Lose
  const [gameState, setGameState] = useState("playing"); // "playing" | "win" | "lose"
  const gameStateRef = useRef("playing");
  useEffect(() => {
    gameStateRef.current = gameState;
  }, [gameState]);

  // Refs to prevent stale enemy + cancel timers
  const logContainerRef = useRef(null);

  const enemyRef = useRef(null);
  useEffect(() => {
    enemyRef.current = enemy; // keep FULL enemy state (hp/isDead) live
  }, [enemy]);

  const enemyIdentityTokenRef = useRef(0);
  useEffect(() => {
    // bump ONLY when identity changes
    enemyIdentityTokenRef.current += 1;
  }, [enemyIndex]);

  const enemyAttackTimeoutRef = useRef(null);
  const afterAttackTimeoutRef = useRef(null);
  const playerToEnemyTimeoutRef = useRef(null);

  const clearEnemyTimers = () => {
    if (enemyAttackTimeoutRef.current) clearTimeout(enemyAttackTimeoutRef.current);
    if (afterAttackTimeoutRef.current) clearTimeout(afterAttackTimeoutRef.current);
    if (playerToEnemyTimeoutRef.current) clearTimeout(playerToEnemyTimeoutRef.current);

    enemyAttackTimeoutRef.current = null;
    afterAttackTimeoutRef.current = null;
    playerToEnemyTimeoutRef.current = null;
  };

  useEffect(() => {
    if (!logContainerRef.current) return;
    logContainerRef.current.scrollTop = logContainerRef.current.scrollHeight;
  }, [log]);

  // Player death -> GAME OVER (red)
  useEffect(() => {
    if (!player) return;
    if (gameStateRef.current !== "playing") return;

    if (player.hp <= 0) {
      clearEnemyTimers();
      setPlayer((p) => (p ? { ...p, hp: 0 } : p));
      setLog((l) => [...l, "You have fallen... GAME OVER."]);
      setGameState("lose");
    }
  }, [player?.hp]);

  const fadeToEnemy = (nextEnemy) => {
    setEnemyFade("fade-out");
    setTimeout(() => {
      setEnemy(nextEnemy);
      setEnemyFade("fade-in");
      setTimeout(() => setEnemyFade(""), ENEMY_FADE_MS);
    }, ENEMY_FADE_MS);
  };

  const startGame = (cls) => {
    clearEnemyTimers();
    setGameState("playing");

    const p = classes[cls];

    const shuffled = shuffle(baseEnemies).map((e) => ({
      ...e,
      maxHp: e.hp,
      isDead: false,
    }));

    const order = [...shuffled, { ...boss, maxHp: boss.hp, isDead: false }];

    setEnemyOrder(order);
    setEnemyIndex(0);
    setEnemy(order[0]);

    setPlayer({ ...p, maxHp: p.hp, hp: p.hp });
    setPlayerClass(cls);

    setCurrentAttacker("player");
    setCooldownUntil(0);
    setDiceModal(null);

    // ✅ reset flasks each run
    setFlasksLeft(3);

    // fresh FX slate
    setFx([]);
    setPlayerSprite("");
    setEnemySprite("");

    setLog([
      `Fellow ${cls}, you have embarked on an adventure to slay the dragon.`,
      `As you descend into the cave, you encounter a dark and eerie atmosphere.`,
      `You have heard tales of the fearsome Dragon that awaits you at the end of the cave.`,
      `But first, you must face the creatures lurking within...`,
      `You have encountered ${order[0].name}!`,
      `It is your turn. What would you like to do?`,
    ]);
  };

  const applyEnemyDamageToPlayer = (damage) => {
    if (gameStateRef.current !== "playing") return;

    const e = enemyRef.current;
    if (!e) return;

    setLog((l) => [...l, `${e.name} attacked you for ${damage} damage!`]);

    // FX: enemy lunges in, the blow lands on the hero
    setEnemySprite("sprite-attack");
    setPlayerSprite("sprite-hit");
    spawnFx("player", "hit", `-${damage}`);

    setPlayer((prev) => {
      if (!prev) return prev;
      return { ...prev, hp: Math.max(0, prev.hp - damage) };
    });
  };

  const startEnemyTurn = () => {
    if (gameStateRef.current !== "playing") return;

    const e = enemyRef.current;
    if (!e || e.isDead || e.hp <= 0) return;

    clearEnemyTimers();

    const token = enemyIdentityTokenRef.current;

    setCurrentAttacker("enemy");
    setLog((l) => [...l, `It is ${e.name}'s turn!`]);

    enemyAttackTimeoutRef.current = setTimeout(() => {
      if (gameStateRef.current !== "playing") return;
      if (enemyIdentityTokenRef.current !== token) return;

      const liveEnemy = enemyRef.current;
      if (!liveEnemy || liveEnemy.isDead || liveEnemy.hp <= 0) return;

      const dmg = randInt(1, liveEnemy.dice);
      applyEnemyDamageToPlayer(dmg);

      afterAttackTimeoutRef.current = setTimeout(() => {
        if (gameStateRef.current !== "playing") return;
        if (enemyIdentityTokenRef.current !== token) return;

        const stillAlive = enemyRef.current;
        if (!stillAlive || stillAlive.isDead || stillAlive.hp <= 0) return;

        setCurrentAttacker("player");
        setLog((l) => [...l, `It is your turn!`]);
      }, 450);
    }, ENEMY_ATTACK_DELAY_MS);
  };

  // Damage without logging defeat/win (we want ability log first)
  const dealEnemyDamage = (amount) => {
    const e = enemyRef.current;
    if (!e || e.isDead) return { lethal: false, name: e?.name ?? "Enemy" };

    const name = e.name;
    const lethal = e.hp - amount <= 0;

    // FX: hero lunges, the enemy takes the hit
    setPlayerSprite("sprite-attack");
    setEnemySprite("sprite-hit");
    spawnFx("enemy", "hit", `-${Math.round(amount)}`);

    // If lethal, cancel any queued enemy turn BEFORE it can fire
    if (lethal) {
      clearEnemyTimers();
      setCurrentAttacker("player");
    }

    setEnemy((prev) => {
      if (!prev) return prev;
      const nextHp = Math.max(0, prev.hp - amount);
      return { ...prev, hp: nextHp, isDead: prev.isDead || nextHp <= 0 };
    });

    return { lethal, name };
  };

  const logDefeatIfNeeded = (name, lethal) => {
    if (!lethal) return;

    setLog((l) => [...l, `${name} has been defeated!`]);

    if (name === "Dragon") {
      setLog((l) => [...l, "The Dragon is slain. YOU WIN!"]);
      setGameState("win");
    }
  };

  const advanceToNextEnemy = () => {
    clearEnemyTimers();

    // 25% rest between fights (maxHp never changes after start, so reading the
    // closure's player here is safe)
    if (player) healPlayer(player.maxHp * 0.25);

    const nextIndex = enemyIndex + 1;
    setEnemyIndex(nextIndex);

    const nextEnemy = enemyOrder[nextIndex];
    if (!nextEnemy) {
      setGameState("win");
      return;
    }

    if (nextEnemy.name === "Dragon") {
      setLog((l) => [...l, `The Dragon roars! Prepare for battle!`]);
    }

    fadeToEnemy({ ...nextEnemy, hp: nextEnemy.maxHp, isDead: false });

    setTimeout(() => {
      setLog((l) => [...l, `You have encountered ${nextEnemy.name}!`, `It is your turn!`]);
      setCurrentAttacker("player");
    }, ENEMY_FADE_MS + 150);
  };

  const canUseAbility =
    gameState === "playing" &&
    currentAttacker === "player" &&
    enemy &&
    !enemy.isDead &&
    enemy.hp > 0 &&
    cooldownLeft === 0 &&
    !diceModal;

  // ✅ Flask availability
  const canUseFlask =
    gameState === "playing" &&
    currentAttacker === "player" &&
    player &&
    enemy &&
    !enemy.isDead &&
    enemy.hp > 0 &&
    !diceModal &&
    flasksLeft > 0;

  const handleUseAbility = (ability) => {
    if (!canUseAbility) return;

    const diceSides = Number(abilities[playerClass][ability].dice.replace("D", ""));
    // setCooldownUntil(Date.now() + COOLDOWN_SECONDS * 1000);
    setLog((l) => [...l, `You used ${ability}!`]);

    setDiceModal({ diceSides, ability });
  };

  // ✅ Flask roll (D12) to heal
  const handleUseFlask = () => {
    if (!canUseFlask) return;

    setLog((l) => [...l, `You used Flask! (${flasksLeft - 1} left after this)`]);
    setDiceModal({ diceSides: 12, ability: "Flask" });
  };

  const handleDiceRollComplete = (value, ability) => {
    setDiceModal(null);
    setLog((l) => [...l, `Rolled a ${value}.`]);

    if (gameStateRef.current !== "playing") return;

    const e = enemyRef.current;
    if (!e || e.isDead || e.hp <= 0) return;

    // ✅ Flask resolution (does not use successCondition logic)
    if (ability === "Flask") {
      setFlasksLeft((n) => Math.max(0, n - 1));

      const baseHeal = value;
      const healAmount = value >= 11 ? Math.ceil(baseHeal * 1.2) : baseHeal;

      healPlayer(healAmount);

      if (value >= 11) {
        setLog((l) => [...l, `Flask heals you for ${healAmount}! (1.2x bonus)`]);
      } else {
        setLog((l) => [...l, `Flask heals you for ${healAmount}.`]);
      }

      // Flask consumes the turn -> enemy goes next
      clearEnemyTimers();
      playerToEnemyTimeoutRef.current = setTimeout(() => {
        if (gameStateRef.current !== "playing") return;

        const liveEnemy = enemyRef.current;
        if (!liveEnemy || liveEnemy.isDead || liveEnemy.hp <= 0) return;

        startEnemyTurn();
      }, 450);

      return;
    }

    // Ability resolution
    const { successCondition } = abilities[playerClass][ability];
    const success = value > successCondition;

    let shouldStartEnemyTurn = true;

    if (success) {
      switch (ability) {
        // Rogue
        case "Sneak Attack": {
          const dmg = 15;
          const { lethal, name } = dealEnemyDamage(dmg);

          setLog((l) => [...l, `Sneak Attack succeeds! You dealt ${dmg} damage.`]);
          logDefeatIfNeeded(name, lethal);

          if (lethal) shouldStartEnemyTurn = false;
          break;
        }
        case "Trap": {
          const dmg = 5;
          const { lethal, name } = dealEnemyDamage(dmg);

          setLog((l) => [...l, `Trap succeeds! You dealt ${dmg} damage.`]);
          logDefeatIfNeeded(name, lethal);

          if (lethal) shouldStartEnemyTurn = false;
          break;
        }
        case "Escape": {
          setLog((l) => [...l, `Escape succeeds! You slip past ${e.name}.`]);
          shouldStartEnemyTurn = false;
          advanceToNextEnemy();
          break;
        }
        case "Critical Strike": {
          const dmg = value * 5;
          const { lethal, name } = dealEnemyDamage(dmg);

          setLog((l) => [...l, `Critical Strike succeeds! You dealt ${dmg} damage.`]);
          logDefeatIfNeeded(name, lethal);

          if (lethal) shouldStartEnemyTurn = false;
          break;
        }

        // Warrior
        case "Shield Bash": {
          const dmg = 5 + value*0.5;
          const { lethal, name } = dealEnemyDamage(dmg);

          setLog((l) => [...l, `Shield Bash succeeds! You dealt ${dmg} damage.`]);
          logDefeatIfNeeded(name, lethal);

          if (lethal) shouldStartEnemyTurn = false;
          break;
        }
        case "Whirlwind": {
          const dmg = value * 2;
          const { lethal, name } = dealEnemyDamage(dmg);

          setLog((l) => [...l, `Whirlwind succeeds! You dealt ${dmg} damage.`]);
          logDefeatIfNeeded(name, lethal);

          if (lethal) shouldStartEnemyTurn = false;
          break;
        }
        case "Fortify": {
          healPlayer(10);
          setLog((l) => [...l, `Fortify succeeds! You gained 10 HP.`]);
          break;
        }
        case "Executioner’s Strike": {
          const dmg = 25;
          const { lethal, name } = dealEnemyDamage(dmg);

          setLog((l) => [...l, `Executioner’s Strike succeeds! You dealt ${dmg} damage.`]);
          logDefeatIfNeeded(name, lethal);

          if (lethal) shouldStartEnemyTurn = false;
          break;
        }

        // Wizard
        case "Fireball": {
          const dmg = value + 10;
          const { lethal, name } = dealEnemyDamage(dmg);

          setLog((l) => [...l, `Fireball succeeds! You dealt ${dmg} fire damage.`]);
          logDefeatIfNeeded(name, lethal);

          if (lethal) shouldStartEnemyTurn = false;
          break;
        }
        case "Arcane Shield": {
          setLog((l) => [...l, `Arcane Shield succeeds!`]);
          break;
        }
        case "Lightning Bolt": {
          const dmg = value * 3;
          const { lethal, name } = dealEnemyDamage(dmg);

          setLog((l) => [...l, `Lightning Bolt succeeds! You dealt ${dmg} damage.`]);
          logDefeatIfNeeded(name, lethal);

          if (lethal) shouldStartEnemyTurn = false;
          break;
        }
        case "Teleport": {
          healPlayer(5);
          setLog((l) => [...l, `Teleport succeeds! You healed 5 HP and dodged the enemy’s turn.`]);
          shouldStartEnemyTurn = false;
          break;
        }
        default:
          break;
      }
    } else {
      // FAILURES
      switch (ability) {
        // Rogue
        case "Sneak Attack": {
          const selfDmg = Math.max(0, 12 - value);
          hurtPlayer(selfDmg);
          setLog((l) => [...l, `Sneak Attack fails! You take ${selfDmg} damage.`]);
          break;
        }
        case "Trap": {
          setLog((l) => [...l, `Trap fails! Nothing happens...`]);
          break;
        }
        case "Escape": {
          hurtPlayer(value);
          setLog((l) => [...l, `Escape fails! You take ${value} damage.`]);
          break;
        }
        case "Critical Strike": {
          const { lethal, name } = dealEnemyDamage(value);

          setLog((l) => [...l, `Critical Strike fails! You only dealt ${value} damage.`]);
          logDefeatIfNeeded(name, lethal);

          if (lethal) shouldStartEnemyTurn = false;
          break;
        }

        // Warrior
        case "Shield Bash": {
          hurtPlayer(3);
          setLog((l) => [...l, `Shield Bash fails! You take 3 damage.`]);
          break;
        }
        case "Whirlwind": {
          setLog((l) => [...l, `Whirlwind fails! You overextend...`]);
          break;
        }
        case "Fortify": {
          setLog((l) => [...l, `Fortify fails!`]);
          break;
        }
        case "Executioner’s Strike": {
          hurtPlayer(8);
          setLog((l) => [...l, `Executioner’s Strike fails! You take 8 recoil damage.`]);
          break;
        }

        // Wizard
        case "Fireball": {
          hurtPlayer(5);
          setLog((l) => [...l, `Fireball fails! You take 5 burn damage.`]);
          break;
        }
        case "Arcane Shield": {
          setLog((l) => [...l, `Arcane Shield fails!`]);
          break;
        }
        case "Lightning Bolt": {
          const selfDmg = Math.max(0, 8 - value);
          hurtPlayer(selfDmg);
          setLog((l) => [...l, `Lightning Bolt fails! You take ${selfDmg} damage.`]);
          break;
        }
        case "Teleport": {
          const selfDmg = Math.max(0, 10 - value);
          hurtPlayer(selfDmg);
          setLog((l) => [...l, `Teleport fails! You take ${selfDmg} damage.`]);
          break;
        }
        default:
          break;
      }
    }

    // Schedule enemy turn safely (and cancellable)
    clearEnemyTimers();
    playerToEnemyTimeoutRef.current = setTimeout(() => {
      if (gameStateRef.current !== "playing") return;
      if (!shouldStartEnemyTurn) return;

      const liveEnemy = enemyRef.current;
      if (!liveEnemy || liveEnemy.isDead || liveEnemy.hp <= 0) return;

      startEnemyTurn();
    }, 450);
  };

  const resetGame = () => {
    clearEnemyTimers();
    setPlayerClass(null);
    setPlayer(null);
    setEnemyOrder([]);
    setEnemyIndex(0);
    setEnemy(null);
    setLog([]);
    setDiceModal(null);
    setCurrentAttacker("player");
    setEnemyFade("");
    setCooldownUntil(0);
    setGameState("playing");
    setFlasksLeft(3);
    setFx([]);
    setPlayerSprite("");
    setEnemySprite("");
  };

  if (!playerClass) {
    return (
      <div className="game" style={{overflow: "hidden"}}>
        <div className="class-select-screen">
          <h2>Select Your Class</h2>
          <div className="class-buttons">
            {Object.keys(classes).map((cls, i) => (
              <button
                key={cls}
                onClick={() => startGame(cls)}
                /* staggered rise-in, one hero at a time */
                style={{ animationDelay: `${i * 110}ms` }}
              >
                <img src={classes[cls].image} alt="" className="class-icon" loading="lazy" decoding="async" />
                <span style={{ fontFamily: "IM Fell English SC", fontSize: "25px" }}>{cls}</span>
              </button>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="game">
      {/* WIN/LOSE OVERLAY */}
      {gameState !== "playing" && (
        <div
          className="go-overlay"
          style={{
            position: "fixed",
            inset: 0,
            zIndex: 9999,
            background: "rgba(0,0,0,0.85)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            flexDirection: "column",
            gap: 16,
            pointerEvents: "auto",
          }}
        >
          <div
            className={`go-title ${gameState === "win" ? "go-title--win" : "go-title--lose"}`}
            style={{
              fontFamily: "IM Fell English SC",
              fontSize: 64,
              letterSpacing: 2,
              color: gameState === "win" ? "#FFD700" : "#FF3B3B",
              textShadow:
                gameState === "win"
                  ? "0 0 18px rgba(255, 215, 0, 0.55)"
                  : "0 0 18px rgba(255, 59, 59, 0.55)",
            }}
          >
            {gameState === "win" ? "YOU WIN" : "GAME OVER"}
          </div>

          <button
            className="go-btn"
            onClick={resetGame}
            style={{
              padding: "12px 18px",
              borderRadius: 12,
              border: "1px solid rgba(255,255,255,0.25)",
              background: "rgba(255,255,255,0.08)",
              color: "#fff",
              fontFamily: "IM Fell English SC",
              fontSize: 22,
              cursor: "pointer",
            }}
          >
            Play Again
          </button>
        </div>
      )}

      <div className="game-background">
        <div className="game-layout">
          {/* LOGS */}
          <div className="log-box" ref={logContainerRef}>
            {log.map((entry, i) => (
              <div className="log-line" key={i}>
                {entry}
              </div>
            ))}
          </div>

          {/* ABILITY GRID */}
          <div className="ability-grid">
            {enemy && !enemy.isDead && enemy.hp > 0 ? (
              <>
                {Object.keys(abilities[playerClass]).map((ability) => (
                  <button
                    key={ability}
                    className="ability-btn"
                    disabled={!canUseAbility}
                    onClick={() => handleUseAbility(ability)}
                    title={
                      cooldownLeft > 0
                        ? `Cooldown: ${cooldownLeft}s`
                        : currentAttacker !== "player"
                        ? "Wait for your turn"
                        : ""
                    }
                  >
                    {ability}
                  </button>
                ))}

                {/* ✅ Flask item button */}
                <button
                  className="ability-btn"
                  disabled={!canUseFlask}
                  onClick={handleUseFlask}
                  title={flasksLeft > 0 ? `Flasks left: ${flasksLeft}` : "No flasks left"}
                  style={{ gridColumn: "span 2" }}
                >
                  Flask ({flasksLeft})
                </button>
              </>
            ) : (
              <button
                className="moveon-btn"
                disabled={gameState !== "playing"}
                onClick={() => {
                  setLog((l) => [...l, `Moving on...`]);
                  advanceToNextEnemy();
                }}
              >
                MOVE ON
              </button>
            )}

            {enemy && !enemy.isDead && cooldownLeft > 0 && (
              <div style={{ gridColumn: "span 2", color: "#fff", fontFamily: "IM Fell English SC" }}>
                Cooldown: {cooldownLeft}s
              </div>
            )}
          </div>

          {/* FIGHT AREA */}
          <div className="fight">
            {/* PLAYER */}
            {player && (
              <div
                className={`player-section ${
                  currentAttacker === "player" && gameState === "playing" ? "is-turn" : ""
                }`}
              >
                {fx
                  .filter((f) => f.target === "player")
                  .map((f) => (
                    <span
                      key={f.id}
                      className={`fx-float fx-${f.kind}`}
                      style={{ "--drift": `${f.drift}px` }}
                      onAnimationEnd={() => removeFx(f.id)}
                      aria-hidden="true"
                    >
                      {f.text}
                    </span>
                  ))}
                <img
                  className={`player-visual ${playerSprite} ${player.hp <= 0 ? "is-dead" : ""}`}
                  src={player.image}
                  alt=""
                  onAnimationEnd={() => setPlayerSprite("")}
                />
                <div className="hp-bar">
                  <div
                    className={`hp-fill ${hpTone(player)}`}
                    style={{ width: `${(player.hp / player.maxHp) * 100}%` }}
                  />
                </div>
                <h3 className="name-label" style={{ color: "#DDDDDD" }}>
                  {playerClass}
                </h3>
              </div>
            )}

            {/* ENEMY — stays mounted when slain so the defeat animation plays
                (the ability grid's MOVE ON logic has its own liveness checks) */}
            {enemy && (
              <div
                className={`enemy-section ${
                  currentAttacker === "enemy" && gameState === "playing" ? "is-turn" : ""
                }`}
              >
                {fx
                  .filter((f) => f.target === "enemy")
                  .map((f) => (
                    <span
                      key={f.id}
                      className={`fx-float fx-${f.kind}`}
                      style={{ "--drift": `${f.drift}px` }}
                      onAnimationEnd={() => removeFx(f.id)}
                      aria-hidden="true"
                    >
                      {f.text}
                    </span>
                  ))}
                <img
                  className={`enemy-visual ${enemyFade} ${enemySprite} ${
                    enemy.isDead ? "is-dead" : ""
                  }`}
                  src={enemy.image}
                  alt=""
                  onAnimationEnd={() => setEnemySprite("")}
                />
                <div className="hp-bar">
                  <div
                    className={`hp-fill ${hpTone(enemy)}`}
                    style={{ width: `${(enemy.hp / enemy.maxHp) * 100}%` }}
                  />
                </div>
                <h3 className="name-label" style={{ color: "#DDDDDD" }}>
                  {enemy.name}
                </h3>
              </div>
            )}
          </div>

          {/* DICE MODAL */}
          {diceModal && (
            <DiceModal
              diceSides={diceModal.diceSides}
              ability={diceModal.ability}
              onRollComplete={(value, ab) => handleDiceRollComplete(value, ab)}
            />
          )}
        </div>
      </div>
    </div>
  );
}
