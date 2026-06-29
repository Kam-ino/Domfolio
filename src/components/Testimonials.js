import { motion } from "motion/react";
import "./Testimonials.css";

/**
 * ⚠️ PLACEHOLDER testimonials — these are a ready-to-fill scaffold, NOT real
 * quotes. Replace each `quote`, `author`, and `role` with genuine ones once you
 * have client/colleague permission. The "Client Name" attributions make it
 * obvious they're templates if any are left un-edited.
 */
const TESTIMONIALS = [
  {
    quote:
      "Dominic rebuilt our checkout and conversion climbed almost overnight. He simply understands e-commerce.",
    author: "Client Name",
    role: "Founder · D2C Brand",
    rune: "🛒",
  },
  {
    quote:
      "The AI support agent he set up now handles the bulk of our tickets — refunds, returns, presales. It saves us hours every single day.",
    author: "Client Name",
    role: "Operations Lead · Shopify Store",
    rune: "🤖",
  },
  {
    quote:
      "Fast, communicative, and the code was clean. He shipped exactly what we scoped, on time, and was a pleasure to work with.",
    author: "Client Name",
    role: "Project Manager · ARISE",
    rune: "⚔️",
  },
];

const card = {
  hidden: { opacity: 0, y: 30 },
  show: (i) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.55, delay: i * 0.1, ease: [0.22, 1, 0.36, 1] },
  }),
};

export default function Testimonials() {
  return (
    <ul className="testimonials">
      {TESTIMONIALS.map((t, i) => (
        <motion.li
          className="testimonial"
          key={i}
          custom={i}
          variants={card}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.2 }}
        >
          <span className="testimonial-quotemark" aria-hidden="true">
            &ldquo;
          </span>
          <blockquote className="testimonial-quote">{t.quote}</blockquote>
          <footer className="testimonial-author">
            <span className="testimonial-seal" aria-hidden="true">
              {t.rune}
            </span>
            <span className="testimonial-author-text">
              <span className="testimonial-name">{t.author}</span>
              <span className="testimonial-role">{t.role}</span>
            </span>
          </footer>
        </motion.li>
      ))}
    </ul>
  );
}
