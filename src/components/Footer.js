import "./Footer.css";

const contact = {
  email: "dominicguevarra08@gmail.com",
  resume:
    "https://drive.google.com/file/d/16SPsT7gw2MgRJkKQ3aOUJpnngh_EEcCw/view?usp=sharing",
  github: "https://github.com/Kam-ino",
  linkedin: "https://www.linkedin.com/in/dominic-guevarra-110b11285/",
};

const LINKS = [
  { label: "Email", icon: "✉️", href: `mailto:${contact.email}` },
  { label: "GitHub", icon: "🗡️", href: contact.github },
  { label: "LinkedIn", icon: "📓", href: contact.linkedin },
  { label: "Résumé", icon: "📜", href: contact.resume },
];

export default function Footer() {
  const toTop = () =>
    window.scrollTo({ top: 0, behavior: "smooth" });

  return (
    <footer className="footer">
      <div className="footer-inner">
        <button type="button" className="footer-brand" onClick={toTop}>
          DOMFOLIO
        </button>

        <nav className="footer-links" aria-label="Contact links">
          {LINKS.map((l) => (
            <a
              key={l.label}
              href={l.href}
              target={l.href.startsWith("http") ? "_blank" : undefined}
              rel={l.href.startsWith("http") ? "noreferrer" : undefined}
            >
              <span className="footer-link-icon" aria-hidden="true">
                {l.icon}
              </span>
              {l.label}
            </a>
          ))}
        </nav>

        <button type="button" className="footer-totop" onClick={toTop}>
          Back to the Summit <span aria-hidden="true">↑</span>
        </button>
      </div>

      <p className="footer-note">
        &copy; {new Date().getFullYear()} Dominic Guevarra &middot; Forged with
        React &amp; Three.js
      </p>
    </footer>
  );
}
