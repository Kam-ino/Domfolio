import { motion, useMotionValue, useTransform } from 'motion/react';
import { useState, useMemo } from 'react';
import './CardStack.css';

function CardRotate({ children, onSendToBack, sensitivity }) {
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const rotateX = useTransform(y, [-100, 100], [60, -60]);
  const rotateY = useTransform(x, [-100, 100], [-60, 60]);

  function handleDragEnd(_, info) {
    if (Math.abs(info.offset.x) > sensitivity || Math.abs(info.offset.y) > sensitivity) {
      onSendToBack();
    } else {
      x.set(0);
      y.set(0);
    }
  }

  return (
    <motion.div
      className="card-rotate"
      style={{ x, y, rotateX, rotateY }}
      /* Horizontal-only drag: this sets touch-action:pan-y so a vertical swipe
         on a card scrolls the PAGE instead of being captured as a drag (which
         made tall cards impossible to scroll past on mobile). Swipe left/right
         to flip the stack. */
      drag="x"
      dragConstraints={{ left: 0, right: 0 }}
      dragElastic={0.6}
      whileTap={{ cursor: 'grabbing' }}
      onDragEnd={handleDragEnd}
    >
      {children}
    </motion.div>
  );
}

export default function Stack({
  randomRotation = false,
  sensitivity = 200,
  cardDimensions = { width: 500, height: 500 },
  cardsData = [],
  animationConfig = { stiffness: 260, damping: 20 },
  sendToBackOnClick = false,
  // Degrees of fan between successive cards, and the pivot they rotate/scale
  // around. On narrow screens a smaller fan + a bottom-CENTER origin keeps the
  // stack from sprawling off to the right (it otherwise overflows the column).
  fanDegrees = 4,
  cardOrigin = "90% 90%",
  // When true, cards are sized to their own content height (the container grows
  // to the tallest) instead of all sharing cardDimensions.height. Used by the
  // skill stack so each card hugs its content.
  adaptiveHeight = false
}) {
  const [cards, setCards] = useState(
    cardsData.length
      ? cardsData
      : [
          { id: 1, img: 'https://images.unsplash.com/photo-1480074568708-e7b720bb3f09?q=80&w=500&auto=format' },
          { id: 2, img: 'https://images.unsplash.com/photo-1449844908441-8829872d2607?q=80&w=500&auto=format' },
          { id: 3, img: 'https://images.unsplash.com/photo-1452626212852-811d58933cae?q=80&w=500&auto=format' },
          { id: 4, img: 'https://images.unsplash.com/photo-1572120360610-d971b9d7767c?q=80&w=500&auto=format' }
        ]
  );

  const sendToBack = id => {
    setCards(prev => {
      const newCards = [...prev];
      const index = newCards.findIndex(card => card.id === id);
      const [card] = newCards.splice(index, 1);
      newCards.unshift(card);
      return newCards;
    });
  };

  // A random-but-STABLE rotation for each stack position, so the fan looks like
  // a naturally-tossed pile instead of a perfect fan. Memoised so it doesn't
  // re-randomise (and jitter) on every render; only re-rolls if the card count
  // or fan settings change. The fan still grows toward the back, with each
  // card's angle jittered by up to ±fanDegrees when randomRotation is on.
  const fanAngles = useMemo(
    () =>
      Array.from({ length: cards.length }, (_, i) => {
        const depth = cards.length - i - 1; // 0 = top card, larger = further back
        const jitter = randomRotation ? (Math.random() * 2 - 1) * fanDegrees : 0;
        return depth * fanDegrees + jitter;
      }),
    [cards.length, fanDegrees, randomRotation]
  );

  return (
    <div
      className={`stack-container${adaptiveHeight ? " stack-container--adaptive" : ""}`}
      style={{
        width: cardDimensions.width,
        height: adaptiveHeight ? undefined : cardDimensions.height,
        perspective: 600
      }}
    >
      {cards.map((card, index) => {
        return (
            <CardRotate key={card.id} onSendToBack={() => sendToBack(card.id)} sensitivity={sensitivity}>
            <motion.div
                className="card"
                onClick={() => sendToBackOnClick && sendToBack(card.id)}
                animate={{
                    rotateZ: fanAngles[index] ?? 0,
                    scale: 1 + index * 0.06 - cards.length * 0.06,
                    transformOrigin: cardOrigin,
                }}
                initial={false}
                transition={{
                    type: "spring",
                    stiffness: animationConfig.stiffness,
                    damping: animationConfig.damping,
                }}
                style={{
                    width: cardDimensions.width,
                    height: adaptiveHeight ? undefined : cardDimensions.height,
                }}
                >
                <div className="card-content">{card.content}</div>
                </motion.div>
            </CardRotate>
        );
        })}

    </div>
  );
}
