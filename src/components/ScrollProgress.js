import { motion, useScroll, useSpring } from "motion/react";
import "./ScrollProgress.css";

/**
 * A thin gilded "journey" bar along the very top of the page that fills as the
 * visitor scrolls the tale. Scroll-linked (not autonomous), so it's fine under
 * prefers-reduced-motion; the spring only smooths the value.
 */
export default function ScrollProgress() {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 180,
    damping: 30,
    mass: 0.4,
    restDelta: 0.001,
  });

  return (
    <motion.div className="scroll-progress" style={{ scaleX }} aria-hidden="true" />
  );
}
