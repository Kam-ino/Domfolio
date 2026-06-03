import { motion } from "motion/react";
import "./Section.css";

/**
 * A full-width page section with a decorated header and a scroll-reveal
 * animation. Content fades/slides up the first time it enters the viewport.
 */
export default function Section({ id, eyebrow, title, subtitle, children, tone = "light" }) {
  return (
    <section id={id} className={`section section--${tone}`}>
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
    </section>
  );
}
