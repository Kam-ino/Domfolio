import { useEffect, useState } from "react";
import "./Navbar.css";

const LINKS = [
  { id: "about", label: "About Me" },
  { id: "stack", label: "Arsenal" },
  { id: "experience", label: "My Adventures" },
  { id: "game", label: "The Arena" },
  { id: "contact", label: "Contact" },
];

function scrollToId(id) {
  const el = document.getElementById(id);
  if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
}

export default function Navbar() {
  const [active, setActive] = useState("");
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  // Shrink/solidify the bar once the user scrolls past the hero
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 60);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Scroll-spy: highlight the section currently in view
  useEffect(() => {
    const sections = LINKS.map((l) => document.getElementById(l.id)).filter(Boolean);
    if (!sections.length) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) setActive(entry.target.id);
        });
      },
      { rootMargin: "-45% 0px -50% 0px", threshold: 0 }
    );

    sections.forEach((s) => observer.observe(s));
    return () => observer.disconnect();
  }, []);

  const handleClick = (e, id) => {
    e.preventDefault();
    setMenuOpen(false);
    scrollToId(id);
  };

  return (
    <nav className={`nav ${scrolled ? "nav--scrolled" : ""}`}>
      <a
        href="#top"
        className="site-title"
        onClick={(e) => handleClick(e, "top")}
      >
        DOMFOLIO
      </a>

      <button
        className={`nav-toggle ${menuOpen ? "is-open" : ""}`}
        aria-label="Toggle navigation"
        aria-expanded={menuOpen}
        onClick={() => setMenuOpen((o) => !o)}
      >
        <span />
        <span />
        <span />
      </button>

      <ul className={menuOpen ? "is-open" : ""}>
        {LINKS.map((l) => (
          <li key={l.id} className={active === l.id ? "active" : ""}>
            <a href={`#${l.id}`} onClick={(e) => handleClick(e, l.id)}>
              {l.label}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  );
}
