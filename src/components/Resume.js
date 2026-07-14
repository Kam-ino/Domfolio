import { motion } from "motion/react";
import "./Resume.css";

// Same résumé the footer/quest-modal link to.
const RESUME_URL =
  "https://drive.google.com/file/d/16SPsT7gw2MgRJkKQ3aOUJpnngh_EEcCw/view?usp=sharing";

const SUMMARY =
  "Computer Engineering undergraduate specializing in web application development, AI automation, and e-commerce solutions. Experienced in building React and Node.js applications, developing custom Shopify components, improving checkout and customer-support workflows, and using AI-assisted development tools to streamline debugging, refactoring, and implementation. Skilled in JavaScript, Python, SQL, cloud fundamentals, prompt engineering, and UI/UX collaboration.";

const EXPERIENCE = [
  {
    role: "Freelance Full-Stack Developer",
    date: "Oct 2025 – Present",
    bullets: [
      "Built an AI automation system (Helpwave AI agent) handling refunds, returns, order exchanges, and presale questions - cut customer returns by 25% and converted 200+ presale customers in one month.",
      "Developed custom Shopify apps to replace paid ones, reducing the company's expenses by 5%.",
      "Reworked checkout pages across all client stores, increasing CVR by 15%.",
      "Created AdFactory - a hybrid web-crawler + generative-AI system producing 20–30 marketing scripts and static ads per run.",
      "Created LocAds - localizes static ads into 7 European languages with 1:1 translation that preserves the original styles, fonts, and formats.",
    ],
  },
  {
    role: "Full-Stack Developer · ARISE",
    date: "Jun 2025 – Oct 2025",
    bullets: [
      "Developed a full-stack website using React (frontend) and Node.js (backend).",
      "Designed responsive UI/UX prototypes in Figma and managed version control in GitHub.",
    ],
  },
  {
    role: "Frontend Developer · AWSCC-MU Website",
    date: "Jan 2025 – Jun 2025",
    bullets: [
      "Built pages of mapua.awsccph.org using React.js component-based architecture.",
      "Collaborated with a startup-like team using ClickUp for project management.",
    ],
  },
  {
    role: "Lead Programmer · ARISE",
    date: "Dec 2023 – Jan 2024",
    bullets: [],
  },
  {
    role: "Freelancer · Programmer",
    date: "Aug 2022 – Mar 2024",
    bullets: [],
  },
];

const SKILLS = [
  {
    label: "Technical",
    items:
      "React · Node.js · Python · JavaScript · TypeScript · GraphQL · SQL · HTML · CSS · Flet · Git · Figma · Shopify CLI · Liquid · Shopify Plus",
  },
  {
    label: "Cloud · AI · Automation",
    items:
      "AWS (Cloud Foundations) · Machine Learning · Generative AI · Prompt Engineering · AI-Assisted Programming · AI Agent Automation · n8n · Claude Code · Ollama",
  },
  {
    label: "Soft Skills",
    items:
      "Problem Solving · Adaptability · Collaboration · Project Management · Patience · Conflict Resolution · Customer Negotiation",
  },
];

const EDUCATION = {
  degree: "B.S. Computer Engineering",
  school: "Mapúa University",
  notes: [
    "Thesis - “Water Quality Analysis: Microscopic Image Processing & AI-Driven E. coli Detection using YOLOv9” (unpublished research).",
    "R&D for Great Sierra Development Corp. - “Overhead Obstacle Detection Alarm for 18-Wheeler Trucks using LIDAR & ATmega328P” (unpublished research).",
    "Represented the school at the ASEAN AI Hackathon 2026.",
  ],
};

const CERTIFICATES = [
  "AWS Educate - Introduction to Cloud 101",
  "AWS Educate - Machine Learning Foundations",
  "AWS Educate - Introduction to Generative AI",
  "AWS Academy - Cloud Foundations",
  "Introduction to Generative AI & Prompt Engineering",
  "Applied Machine Learning in Python",
  "Applied Plotting, Charting & Data Representation in Python",
];

const CONTACT = {
  location: "Marikina, NCR, Philippines",
  phone: "+63 994 637 8582",
  email: "dominicguevarra08@gmail.com",
};

const panel = {
  hidden: { opacity: 0, y: 30 },
  show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] } },
};

function Panel({ icon, title, children, className = "" }) {
  return (
    <motion.div
      className={`resume-panel ${className}`}
      variants={panel}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, amount: 0.2 }}
    >
      <h3 className="resume-panel-title">
        <span className="resume-panel-icon" aria-hidden="true">
          {icon}
        </span>
        {title}
      </h3>
      {children}
    </motion.div>
  );
}

export default function Resume() {
  return (
    <div className="resume">
      {/* Herald's contact + the download CTA */}
      <div className="resume-toolbar">
        <div className="resume-contact">
          <span>
            <span aria-hidden="true">📍</span> {CONTACT.location}
          </span>
          <a href={`tel:${CONTACT.phone.replace(/\s/g, "")}`}>
            <span aria-hidden="true">📞</span> {CONTACT.phone}
          </a>
          <a href={`mailto:${CONTACT.email}`}>
            <span aria-hidden="true">✉️</span> {CONTACT.email}
          </a>
        </div>
        <a
          className="resume-download"
          href={RESUME_URL}
          target="_blank"
          rel="noreferrer"
        >
          <span aria-hidden="true">📜</span> Download the Full Decree
        </a>
      </div>

      <div className="resume-grid">
        {/* Main column: the charge + the campaign log */}
        <div className="resume-main">
          <Panel icon="✒️" title="The Charge" className="resume-summary">
            <p>{SUMMARY}</p>
          </Panel>

          <Panel icon="⚔️" title="Campaigns &amp; Contracts">
            <ol className="resume-exp">
              {EXPERIENCE.map((job) => (
                <li className="resume-exp-item" key={job.role}>
                  <div className="resume-exp-head">
                    <span className="resume-role">{job.role}</span>
                    <span className="resume-date">{job.date}</span>
                  </div>
                  {job.bullets.length > 0 && (
                    <ul>
                      {job.bullets.map((b, i) => (
                        <li key={i}>{b}</li>
                      ))}
                    </ul>
                  )}
                </li>
              ))}
            </ol>
          </Panel>
        </div>

        {/* Side column: proficiencies, schooling, sealed scrolls */}
        <aside className="resume-aside">
          <Panel icon="🛡️" title="Proficiencies">
            {SKILLS.map((s) => (
              <div className="resume-skill" key={s.label}>
                <div className="resume-skill-label">{s.label}</div>
                <div className="resume-skill-items">{s.items}</div>
              </div>
            ))}
          </Panel>

          <Panel icon="🎓" title="The Academy">
            <div className="resume-edu-degree">{EDUCATION.degree}</div>
            <div className="resume-edu-school">{EDUCATION.school}</div>
            <ul className="resume-bullets">
              {EDUCATION.notes.map((n, i) => (
                <li key={i}>{n}</li>
              ))}
            </ul>
          </Panel>

          <Panel icon="📜" title="Sealed Scrolls">
            <ul className="resume-bullets">
              {CERTIFICATES.map((c, i) => (
                <li key={i}>{c}</li>
              ))}
            </ul>
          </Panel>
        </aside>
      </div>

      <div className="resume-cta-row">
        <a
          className="resume-download"
          href={RESUME_URL}
          target="_blank"
          rel="noreferrer"
        >
          <span aria-hidden="true">📜</span> Download the Full Decree
        </a>
      </div>
    </div>
  );
}
