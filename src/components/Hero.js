import { useEffect, useRef, useState } from "react";
import { motion, useReducedMotion } from "motion/react";
import { scrollToSection } from "../lib/sectionNav";
import "./Hero.css";

// Resolved against PUBLIC_URL so the <img> src always matches the LCP preload
// in public/index.html (which uses %PUBLIC_URL%), even on a sub-path deploy.
const HERO_PHOTO = "https://mmylzwtzvdhwtwhfvlam.supabase.co/storage/v1/object/public/images/Hero.webp";

// Pre-computed ember field (fixed values so they don't re-randomise on every
// render). Each ember drifts up and fades on its own loop. Hidden on small
// screens via CSS to save paint/battery.
const EMBERS = [
  { left: 6, delay: 0, dur: 9, size: 4 },
  { left: 14, delay: 2.6, dur: 11, size: 3 },
  { left: 23, delay: 5.1, dur: 8.5, size: 5 },
  { left: 31, delay: 1.4, dur: 12, size: 3 },
  { left: 39, delay: 3.8, dur: 10, size: 4 },
  { left: 47, delay: 6.2, dur: 9.5, size: 3 },
  { left: 55, delay: 0.8, dur: 11.5, size: 5 },
  { left: 63, delay: 4.4, dur: 8.8, size: 4 },
  { left: 71, delay: 2.0, dur: 12.5, size: 3 },
  { left: 79, delay: 5.7, dur: 9.2, size: 4 },
  { left: 87, delay: 1.1, dur: 10.6, size: 5 },
  { left: 94, delay: 3.3, dur: 11.2, size: 3 },
];

const container = {
  hidden: {},
  show: {
    transition: { staggerChildren: 0.12, delayChildren: 0.1 },
  },
};

const item = {
  hidden: { opacity: 0, y: 28 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.7, ease: [0.22, 1, 0.36, 1] },
  },
};

export default function Hero() {
  const reduceMotion = useReducedMotion();
  const heroRef = useRef(null);
  const [paused, setPaused] = useState(false);

  // Pause the decorative loops (embers, torch, photo float) while the hero is
  // scrolled out of view, so they don't burn compositor/battery on long pages.
  useEffect(() => {
    const el = heroRef.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([entry]) => setPaused(!entry.isIntersecting),
      { threshold: 0 }
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <header
      id="top"
      ref={heroRef}
      className={`hero ${paused ? "is-paused" : ""}`}
    >
      <div className="hero-vignette" aria-hidden="true" />
      <div className="hero-torch" aria-hidden="true" />

      {/* Drifting embers (decorative; disabled under reduced-motion, hidden on
          small screens via CSS) */}
      {!reduceMotion && (
        <div className="hero-embers" aria-hidden="true">
          {EMBERS.map((e, i) => (
            <span
              key={i}
              className="ember"
              style={{
                left: `${e.left}%`,
                width: `${e.size}px`,
                height: `${e.size}px`,
                animationDelay: `${e.delay}s`,
                animationDuration: `${e.dur}s`,
              }}
            />
          ))}
        </div>
      )}

      <div className="hero-inner">
        <motion.div
          className="hero-content"
          variants={container}
          initial="hidden"
          animate="show"
        >
          <motion.span className="hero-badge" variants={item}>
            <span className="hero-badge-dot" aria-hidden="true" />
            Open to full-time roles &amp; freelance quests
          </motion.span>

          <motion.h1 className="hero-name" variants={item}>
            <span className="hero-sigil" aria-hidden="true">
              ✦
            </span>
            Dominic Santiago Guevarra
          </motion.h1>

          <motion.p className="hero-title" variants={item}>
            Full-Stack Engineer &middot; React &middot; Node &middot; AI
          </motion.p>

          <motion.p className="hero-valueprop" variants={item}>
            I take products from first commit to production. Fast, Polished,
            and Built to ship.
          </motion.p>

          <motion.p className="hero-tagline" variants={item}>
            <span aria-hidden="true">⚔ </span>
            Roll for initiative and explore the quest log.
          </motion.p>

          <motion.div className="hero-actions" variants={item}>
            <button
              type="button"
              className="hero-btn hero-btn--primary"
              onClick={() => scrollToSection("about")}
            >
              Begin the Adventure
            </button>
            <button
              type="button"
              className="hero-btn hero-btn--gold"
              onClick={() => scrollToSection("contact")}
            >
              <span aria-hidden="true">✉️</span> Send a Raven
            </button>
            <a
              className="hero-textlink"
              href="https://github.com/Kam-ino"
              target="_blank"
              rel="noreferrer"
            >
              View the Codex <span aria-hidden="true">→</span>
            </a>
          </motion.div>
        </motion.div>

        <motion.div
          className="hero-photo"
          initial={{ opacity: 0, scale: 0.94, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1], delay: 0.35 }}
        >
          <div className="hero-photo-frame">
            <img
              className="hero-photo-img"
              src={HERO_PHOTO}
              alt="Dominic Santiago Guevarra"
              width="420"
              height="525"
              fetchpriority="high"
              decoding="async"
            />
            <span className="frame-corner frame-corner--tl" aria-hidden="true" />
            <span className="frame-corner frame-corner--tr" aria-hidden="true" />
            <span className="frame-corner frame-corner--bl" aria-hidden="true" />
            <span className="frame-corner frame-corner--br" aria-hidden="true" />
          </div>
        </motion.div>
      </div>

      <motion.button
        type="button"
        className="hero-scroll-cue"
        onClick={() => scrollToSection("about")}
        aria-label="Scroll to next section"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.2, duration: 0.8 }}
      >
        <span className="hero-scroll-text">Scroll</span>
        <span className="hero-scroll-arrow" aria-hidden="true">
          ⌄
        </span>
      </motion.button>
    </header>
  );
}
