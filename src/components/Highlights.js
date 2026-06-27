import { useEffect, useRef, useState } from "react";
import { motion } from "motion/react";
import "./Highlights.css";

/**
 * A compact, torch-lit credibility band that sits directly below the hero.
 * Its job is instant proof: it surfaces the strongest signals (a hackathon
 * placement, years shipping, products delivered, AI depth) that were otherwise
 * buried inside individual quest details.
 *
 * Numeric stats count up the first time the band scrolls into view; the count
 * is skipped entirely under prefers-reduced-motion.
 */

const prefersReduced =
  typeof window !== "undefined" &&
  window.matchMedia("(prefers-reduced-motion: reduce)").matches;

// Edit these to taste — `to`/`suffix` drive the count-up; `value` is shown
// verbatim for non-numeric highlights.
const STATS = [
  {
    icon: "🏆",
    value: "Top 2 / 40",
    label: "ASEAN AI Hackathon",
    sub: "Advanced to semi-finals",
  },
  {
    icon: "⏳",
    to: 3,
    suffix: "+ yrs",
    label: "Building & shipping",
    sub: "Freelance since 2022",
  },
  {
    icon: "🛠️",
    to: 8,
    suffix: "+",
    label: "Products shipped",
    sub: "Full-stack, end-to-end",
  },
  {
    icon: "🧠",
    to: 6,
    suffix: "+",
    label: "AI-powered builds",
    sub: "Gemini · Vision · ML",
  },
];

// Fire once when the element first enters the viewport.
function useInViewOnce(ref, { threshold = 0.3 } = {}) {
  const [inView, setInView] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInView(true);
          io.disconnect();
        }
      },
      { threshold }
    );
    io.observe(el);
    return () => io.disconnect();
  }, [ref, threshold]);
  return inView;
}

function CountUp({ to, suffix = "", duration = 1200, start }) {
  const [val, setVal] = useState(0);
  useEffect(() => {
    if (!start) return;
    if (prefersReduced) {
      setVal(to);
      return;
    }
    let raf;
    const t0 = performance.now();
    const tick = (now) => {
      const p = Math.min(1, (now - t0) / duration);
      const eased = 1 - Math.pow(1 - p, 3); // easeOutCubic
      setVal(Math.round(eased * to));
      if (p < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [start, to, duration]);
  return (
    <>
      {val}
      {suffix}
    </>
  );
}

// Under prefers-reduced-motion the cards appear in place (no slide/fade), so
// the band still respects the user's motion preference like the count-up does.
const cardVariants = {
  hidden: prefersReduced ? { opacity: 1, y: 0 } : { opacity: 0, y: 28 },
  show: (i) => ({
    opacity: 1,
    y: 0,
    transition: prefersReduced
      ? { duration: 0 }
      : { duration: 0.6, delay: i * 0.1, ease: [0.22, 1, 0.36, 1] },
  }),
};

export default function Highlights() {
  const ref = useRef(null);
  const inView = useInViewOnce(ref);

  return (
    <section className="highlights" aria-label="Career highlights" ref={ref}>
      <div className="highlights-inner">
        <ul className="highlights-grid">
          {STATS.map((s, i) => (
            <motion.li
              className="highlight-card"
              key={s.label}
              custom={i}
              variants={cardVariants}
              initial="hidden"
              animate={inView ? "show" : "hidden"}
            >
              <span className="highlight-icon" aria-hidden="true">
                {s.icon}
              </span>
              <span className="highlight-value">
                {s.to != null ? (
                  <CountUp to={s.to} suffix={s.suffix} start={inView} />
                ) : (
                  s.value
                )}
              </span>
              <span className="highlight-label">{s.label}</span>
              <span className="highlight-sub">{s.sub}</span>
            </motion.li>
          ))}
        </ul>
      </div>
    </section>
  );
}
