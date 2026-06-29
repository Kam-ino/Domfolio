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
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.4 }}
            transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          >
            {eyebrow && <span className="section-eyebrow">{eyebrow}</span>}
            <h2 className="section-title">{title}</h2>
            {subtitle && <p className="section-subtitle">{subtitle}</p>}
            <div className="section-rule" aria-hidden="true">
              <span className="section-rule-icon">⚔️</span>
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
