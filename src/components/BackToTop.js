import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import "./BackToTop.css";

/**
 * A floating wax-seal button that appears once the visitor has scrolled past
 * the hero, and carries them back to the summit. (The footer has the same
 * action for those who reach the very end; this one saves the long climb from
 * the middle of the page.)
 */
export default function BackToTop() {
  const [show, setShow] = useState(false);

  useEffect(() => {
    let ticking = false;
    const onScroll = () => {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(() => {
        setShow(window.scrollY > window.innerHeight * 1.2);
        ticking = false;
      });
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <AnimatePresence>
      {show && (
        <motion.button
          type="button"
          className="back-to-top"
          aria-label="Back to the summit"
          title="Back to the Summit"
          onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
          initial={{ opacity: 0, y: 18, scale: 0.7 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 18, scale: 0.7 }}
          transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
          whileHover={{ y: -4 }}
          whileTap={{ scale: 0.9 }}
        >
          <span className="back-to-top-arrow" aria-hidden="true">
            ↑
          </span>
        </motion.button>
      )}
    </AnimatePresence>
  );
}
