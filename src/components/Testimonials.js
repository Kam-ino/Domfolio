import { motion } from "motion/react";
import "./Testimonials.css";

// Real (anonymized) testimonials. `project` ties each quote to the work it's
// about — the values below are inferred from each role/context, so adjust them
// to the exact project names if needed.
const TESTIMONIALS = [
  {
    quote:
      "you did it. without telling me? this is insane. i love it. is very accurate",
    author: "F**** K****",
    role: "Founder · Dream Team",
    project: "AI Powered Size Calculator",
    rune: "🛒",
  },
  {
    quote:
      "it looks great. better than old checkout. higher conversion rate",
    author: "F**** K****",
    role: "Founder · Dream Team",
    project: "Shopify Checkout Rework",
    rune: "🛒",
  },
  {
    quote:
      "The automation's solid bro, you're a genius. THANKS A LOT LEGIT",
    author: "A****** C*********",
    role: "Marketing Localization Manager · Dream Team",
    project: "LocAds",
    rune: "🤖",
  },
  {
    quote:
      "Fast, communicative, and the code was clean. Shipped exactly what we scoped and more, on time, and was a pleasure to work with.",
    author: "M*** N****",
    role: "President · ARISE",
    project: "ARISE Full-Stack Website",
    rune: "⚔️",
  },
  {
    quote:
      "Yeah you are very good. i'm checking ur progression. i think i mistaken on you all this time",
    author: "F**** K****",
    role: "Founder · Dream Team",
    project: "Custom Shopify Themes",
    rune: "🛒",
  },
  {
    quote:
      "Solid! Thanks bro, I haven't done frontend in a while HAHAHAHAH",
    author: "J***** Y***",
    role: "Co-Captain · AWSCC-MU",
    project: "AWSCC-MU Website",
    rune: "☁️ ",
  },
];

// Fisher–Yates: unbiased, unlike the sort(() => random - 0.5) trick.
function shuffle(arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

// Shuffled ONCE per page load (module scope), so each visit leads with a
// different patron's tale. Deliberately not shuffled inside the component:
// the Section wrapper de-mounts/remounts this section while scrolling, and a
// per-mount shuffle would visibly reorder the cards mid-visit.
const SHUFFLED = shuffle(TESTIMONIALS);

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
      {SHUFFLED.map((t, i) => (
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
          {t.project && (
            <div className="testimonial-project">
              <span className="testimonial-project-icon" aria-hidden="true">
                ⚒
              </span>
              <span className="testimonial-project-label">{t.project}</span>
            </div>
          )}
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
