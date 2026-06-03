import { motion } from "motion/react";
import "./Footer.css";

const contact = {
  email: "dominicguevarra08@gmail.com",
  resume: "https://drive.google.com/file/d/16SPsT7gw2MgRJkKQ3aOUJpnngh_EEcCw/view?usp=sharing",
  github: "https://github.com/Kam-ino",
  linkedin: "https://www.linkedin.com/in/dominic-guevarra-110b11285/"
};

export default function Footer() {
  return (
    <footer id="contact" className="footer">
      <motion.div
        className="footer-inner"
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.4 }}
        transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
      >
        <h2 className="footer-title">Send a Raven</h2>
        <p className="footer-text">
          Have a quest for me, or just want to roll some dice? Let's connect.
        </p>

        <div className="footer-links">
          <a href={`mailto:${contact.email}`} className="footer-link">
            <span className="footer-link-icon">✉️</span>
            {contact.email}
          </a>
          <a href={contact.github} target="_blank" rel="noreferrer" className="footer-link">
            <span className="footer-link-icon">🗡️</span>
            GitHub
          </a>
          <a href={contact.linkedin} target="_blank" rel="noreferrer" className="footer-link">
            <span className="footer-link-icon">📓</span>
            LinkedIn
          </a>
          <a href={contact.resume} target="_blank" rel="noreferrer" className="footer-link">
            <span className="footer-link-icon">📜</span>
            Formal Resumé
          </a>
        </div>

        <div className="footer-rule" aria-hidden="true">
          <span>✦</span>
        </div>

        <p className="footer-note">
          &copy; {new Date().getFullYear()} Dominic Guevarra &middot; Forged with React &amp; Three.js
        </p>
      </motion.div>
    </footer>
  );
}
