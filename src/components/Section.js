import { useEffect, useRef, useState } from "react";
import { motion } from "motion/react";
import { isForcedMount, subscribeForcedMount } from "../lib/sectionNav";
import "./Section.css";

/**
 * A full-width page section with a decorated header and a scroll-reveal
 * animation. Content fades/slides up the first time it enters the viewport.
 *
 * The section also "de-loads" itself: its contents are only mounted while it
 * (or its immediate neighbour) is near the viewport, and replaced by a
 * same-height placeholder otherwise. This keeps heavy sections (3D dice, the
 * quest board) out of the DOM when you're nowhere near them — at most the
 * on-screen section and the one being scrolled toward are mounted at once.
 *
 * Pass `keepMounted` to opt a section out (e.g. one that holds important state).
 */

// Header choreography: eyebrow → title → subtitle rise in sequence, then the
// divider lines draw outward from the centre sigil. All variants-driven, so
// one whileInView on the <header> orchestrates the lot (and MotionConfig's
// reducedMotion="user" silences it for users who prefer less motion).
const EASE = [0.22, 1, 0.36, 1];
const headerStagger = {
  hidden: {},
  show: { transition: { staggerChildren: 0.12 } },
};
const riseIn = {
  hidden: { opacity: 0, y: 26 },
  show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: EASE } },
};
const ruleDrawL = {
  hidden: { opacity: 0, scaleX: 0 },
  show: { opacity: 1, scaleX: 1, transition: { duration: 0.7, ease: EASE } },
};
const ruleDrawR = ruleDrawL;
const iconPop = {
  hidden: { opacity: 0, scale: 0.3, rotate: -35 },
  show: {
    opacity: 1,
    scale: 1,
    rotate: 0,
    transition: { type: "spring", stiffness: 320, damping: 18 },
  },
};

export default function Section({
  id,
  eyebrow,
  title,
  subtitle,
  children,
  tone = "light",
  keepMounted = false,
  // Space reserved before a section has ever been measured, so the page doesn't
  // collapse (which would break scrolling and the navbar scroll-spy).
  placeholderMinHeight = "100vh",
}) {
  const ref = useRef(null);
  const measured = useRef(null); // last real height, remembered across unmounts

  // Mount when within ~half a viewport of the section; unmount when farther.
  const [inView, setInView] = useState(keepMounted);
  useEffect(() => {
    if (keepMounted) return;
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([entry]) => setInView(entry.isIntersecting),
      { rootMargin: "120px 0px 120px 0px" }
    );
    io.observe(el);
    return () => io.disconnect();
  }, [keepMounted]);

  // While a nav jump is in flight, every section force-mounts so the page height
  // stays stable and the scroll lands accurately (see lib/sectionNav).
  const [forced, setForced] = useState(isForcedMount);
  useEffect(() => subscribeForcedMount(setForced), []);

  const near = keepMounted || forced || inView;

  // While mounted, keep the latest rendered height so the placeholder can hold
  // the same space when we unmount the contents (prevents scroll jumps).
  useEffect(() => {
    const el = ref.current;
    if (!el || !near) return;
    const update = () => {
      measured.current = el.offsetHeight;
    };
    update();
    const ro = new ResizeObserver(update);
    ro.observe(el);
    return () => ro.disconnect();
  }, [near]);

  const style = near
    ? undefined
    : { minHeight: measured.current ? `${measured.current}px` : placeholderMinHeight };

  return (
    <section id={id} ref={ref} className={`section section--${tone}`} style={style}>
      {near && (
        <div className="section-inner">
          <motion.header
            className="section-header"
            variants={headerStagger}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, amount: 0.4 }}
          >
            {eyebrow && (
              <motion.span className="section-eyebrow" variants={riseIn}>
                {eyebrow}
              </motion.span>
            )}
            <motion.h2 className="section-title" variants={riseIn}>
              {title}
            </motion.h2>
            {subtitle && (
              <motion.p className="section-subtitle" variants={riseIn}>
                {subtitle}
              </motion.p>
            )}
            <div className="section-rule" aria-hidden="true">
              <motion.span
                className="section-rule-line section-rule-line--l"
                variants={ruleDrawL}
              />
              <motion.span className="section-rule-icon" variants={iconPop}>
                ⚔️
              </motion.span>
              <motion.span
                className="section-rule-line section-rule-line--r"
                variants={ruleDrawR}
              />
            </div>
          </motion.header>

          <motion.div
            className="section-body"
            initial={{ opacity: 0, y: 60 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.1 }}
            transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1], delay: 0.1 }}
          >
            {children}
          </motion.div>
        </div>
      )}
    </section>
  );
}
