// Shared section-navigation helper.
//
// <Section> de-loads (unmounts) its contents when scrolled away and reserves a
// placeholder of *estimated* height. That makes the document height change while
// you scroll, so a plain `scrollIntoView` to a far anchor computes a target Y
// that's stale by the time it arrives — you land in the wrong place.
//
// Fix: before scrolling we force every Section to mount (so heights are stable),
// then ease toward the target while RE-MEASURING its position every frame (so we
// track it even if something still shifts), then release the force. As a bonus,
// the forced mount lets each Section record an accurate placeholder height for
// next time.

let forced = false;
const subscribers = new Set();

export function isForcedMount() {
  return forced;
}

export function subscribeForcedMount(fn) {
  subscribers.add(fn);
  return () => subscribers.delete(fn);
}

function setForced(value) {
  if (forced === value) return;
  forced = value;
  subscribers.forEach((fn) => fn(forced));
}

// ---- URL <-> section sync ----------------------------------------------------
// Sections that get their own path segment (e.g. "/about"). The hero ("top")
// maps to the base path ("/").
export const SECTION_IDS = [
  "about",
  "resume",
  "stack",
  "experience",
  "services",
  "game",
  "contact",
];

// Respect a sub-path deploy (e.g. GitHub Pages "/Domfolio"). In dev this is "".
const BASE = (process.env.PUBLIC_URL || "").replace(/\/$/, "");

// Reflect the active section in the address bar without reloading. replaceState
// (not push) keeps the back button leaving the site normally and avoids spamming
// history while scrolling.
export function setSectionUrl(id) {
  const path = id && id !== "top" ? `${BASE}/${id}` : `${BASE}/`;
  if (window.location.pathname !== path) {
    try {
      window.history.replaceState(null, "", path + window.location.hash);
    } catch {
      /* ignore (e.g. file:// or sandboxed) */
    }
  }
}

// Parse the current path back into a known section id (or null).
export function sectionFromPath() {
  let p = window.location.pathname;
  if (BASE && p.startsWith(BASE)) p = p.slice(BASE.length);
  const seg = p.replace(/^\/+/, "").split("/")[0];
  return SECTION_IDS.includes(seg) ? seg : null;
}

// Sticky-nav height (re-measured each frame since the bar shrinks once scrolled).
function navOffset() {
  const nav = document.querySelector(".nav");
  return (nav ? nav.getBoundingClientRect().height : 72) + 10;
}

// Identifies the latest in-flight scroll so a newer click cancels an older one
// (no dueling animations).
let activeScroll = 0;

export function scrollToSection(id) {
  const el = document.getElementById(id);
  if (!el) return;

  const token = ++activeScroll;
  setForced(true);
  setSectionUrl(id); // reflect the destination in the URL immediately

  const html = document.documentElement;
  // Override the CSS `scroll-behavior: smooth` so our per-frame scrollTo is
  // instant; clearing it on finish restores the stylesheet value.
  html.style.scrollBehavior = "auto";

  const finish = () => {
    if (token !== activeScroll) return; // a newer scroll owns the state now
    html.style.scrollBehavior = "";
    setForced(false);
  };

  const destOf = () =>
    Math.max(0, window.scrollY + el.getBoundingClientRect().top - navOffset());

  const prefersReduced = window.matchMedia(
    "(prefers-reduced-motion: reduce)"
  ).matches;

  // Wait two frames so the just-forced sections mount and lay out first.
  requestAnimationFrame(() =>
    requestAnimationFrame(() => {
      if (token !== activeScroll) return;

      if (prefersReduced) {
        window.scrollTo(0, destOf());
        finish();
        return;
      }

      const start = performance.now();
      let stable = 0;

      const tick = (now) => {
        if (token !== activeScroll) return; // superseded by a newer click

        const dest = destOf();
        const current = window.scrollY;
        const diff = dest - current;

        if (Math.abs(diff) < 1) stable += 1;
        else stable = 0;

        // Arrived (and the layout has settled for a few frames) or timed out.
        if (stable >= 3 || now - start > 2600) {
          window.scrollTo(0, dest);
          finish();
          return;
        }

        window.scrollTo(0, current + diff * 0.2); // ease toward the live target
        requestAnimationFrame(tick);
      };

      requestAnimationFrame(tick);
    })
  );
}
