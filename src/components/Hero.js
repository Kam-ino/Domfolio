import { motion } from "motion/react";
import "./Hero.css";

const container = {
  hidden: {},
  show: {
    transition: { staggerChildren: 0.14, delayChildren: 0.1 },
  },
};

const item = {
  hidden: { opacity: 0, y: 28 },
  show: { opacity: 1, y: 0, transition: { duration: 0.7, ease: [0.22, 1, 0.36, 1] } },
};

export default function Hero() {
  const scrollToAbout = () => {
    const el = document.getElementById("about");
    if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return (
    <header id="top" className="hero">
      <div className="hero-vignette" aria-hidden="true" />

      <motion.div
        className="hero-content"
        variants={container}
        initial="hidden"
        animate="show"
      >
        <motion.span className="hero-eyebrow" variants={item}>
          ⚔️ A Developer's Character Sheet ⚔️
        </motion.span>

        <motion.h1 className="hero-name" variants={item}>
          Dominic Santiago Guevarra
        </motion.h1>

        <motion.p className="hero-title" variants={item}>
          Frontend Developer &middot; Level 5
        </motion.p>

        <motion.p className="hero-tagline" variants={item}>
          Computer Engineering undergraduate forging living, breathing interfaces
          from React crystals. Roll for initiative and explore my quest log.
        </motion.p>

        <motion.div className="hero-actions" variants={item}>
          <button className="hero-btn hero-btn--primary" onClick={scrollToAbout}>
            Begin the Adventure
          </button>
          <a
            className="hero-btn hero-btn--ghost"
            href="https://github.com/Kam-ino"
            target="_blank"
            rel="noreferrer"
          >
            View the Codex (GitHub)
          </a>
        </motion.div>
      </motion.div>

      <motion.button
        type="button"
        className="hero-scroll-cue"
        onClick={scrollToAbout}
        aria-label="Scroll to next section"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.2, duration: 0.8 }}
      >
        <span className="hero-scroll-text">Scroll</span>
        <span className="hero-scroll-arrow">⌄</span>
      </motion.button>
    </header>
  );
}
