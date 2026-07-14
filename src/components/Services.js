import { motion } from "motion/react";
import { scrollToSection } from "../lib/sectionNav";
import "./Services.css";

const SERVICES = [
  {
    icon: "🏰",
    title: "Conjuring of Realms",
    subtitle: "Full-Stack Web Apps",
    desc: "End-to-end React + Node.js applications, taken from first commit to production — responsive, fast, and maintainable.",
    deliverables: [
      "Responsive React / Next.js interfaces",
      "REST & GraphQL APIs on Node.js",
      "Auth, databases (SQL / NoSQL) & deployment",
    ],
    proof: "Shipped full-stack builds for ARISE & other clients",
  },
  {
    icon: "🤖",
    title: "Summoning of Constructs",
    subtitle: "AI Automation & Agents",
    desc: "Tireless AI workers that handle support, data, and busywork — so your team can focus on what matters.",
    deliverables: [
      "Support & sales chat agents",
      "n8n / workflow automations",
      "LLM integrations (Gemini, Claude, Ollama)",
    ],
    proof: "An AI support agent that cut customer returns 25%",
  },
  {
    icon: "🛒",
    title: "Fortifying the Bazaar",
    subtitle: "Shopify & E-commerce",
    desc: "Custom Shopify apps and checkout tuning that lift conversion and cut the cost of bloated paid apps.",
    deliverables: [
      "Custom Shopify Apps (replace paid ones)",
      "Checkout & CVR optimization",
      "Liquid theming · Shopify Plus",
    ],  
    proof: "+15% checkout CVR · −5% app spend for a client",
  },
  {
    icon: "✨",
    title: "Arcane Instruments",
    subtitle: "AI-Powered Tools",
    desc: "Generative content and localization pipelines that produce production-ready creative at scale.",
    deliverables: [
      "Ad & content generation systems",
      "Image localization (7+ languages)",
      "Vision / OCR & prompt engineering",
    ],
    proof: "Built AdFactory & LocAds creative pipelines",
  },
  {
    icon: "🎨",
    title: "Raiment of the Bazaar",
    subtitle: "Shopify Theme Design & UI/UX",
    desc: "Custom storefront themes crafted end-to-end — the shop's whole look, feel, and buying flow, tuned to convert and easy for merchants to edit.",
    deliverables: [
      "Custom Shopify themes (design → Liquid)",
      "Editor-manageable Online Store 2.0 sections",
      "Mobile-first product, collection & cart UX",
    ],
    proof: "Shipped a full custom storefront theme, brief to handoff",
  }
];

const card = {
  hidden: { opacity: 0, y: 30 },
  show: (i) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.55, delay: i * 0.08, ease: [0.22, 1, 0.36, 1] },
  }),
};

export default function Services() {
  return (
    <div className="services">
      <ul className="services-grid">
        {SERVICES.map((s, i) => (
          <motion.li
            className="service-card"
            key={s.title}
            custom={i}
            variants={card}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, amount: 0.2 }}
          >
            <div className="service-head">
              <span className="service-icon" aria-hidden="true">
                {s.icon}
              </span>
              <div>
                <h3 className="service-title">{s.title}</h3>
                <p className="service-subtitle">{s.subtitle}</p>
              </div>
            </div>

            <p className="service-desc">{s.desc}</p>

            <ul className="service-deliverables">
              {s.deliverables.map((d, di) => (
                <li key={di}>{d}</li>
              ))}
            </ul>

            <p className="service-proof">
              <span aria-hidden="true">🏅</span> {s.proof}
            </p>
          </motion.li>
        ))}
      </ul>

      <div className="services-cta">
        <p className="services-cta-text">
          Have a quest in mind? Let's forge something together.
        </p>
        <button
          type="button"
          className="services-cta-btn"
          onClick={() => scrollToSection("contact")}
        >
          <span aria-hidden="true">✉️</span> Commission a Quest
        </button>
      </div>
    </div>
  );
}
