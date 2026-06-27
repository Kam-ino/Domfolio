import React, { useEffect, useId, useLayoutEffect, useMemo, useRef, useState } from "react";
import "./Collapsible.css";

export default function Collapsible({
  title,
  children,
  defaultOpen = false,
  isOpen: controlledOpen,
  onOpenChange,
  className = "",
  side = "auto",
  width = 520,
  offset = 12,
  staggerMs = 55,
}) {
  const reactId = useId();
  const panelId = useMemo(() => `staggered-menu-${reactId}`, [reactId]);

  const isControlled = typeof controlledOpen === "boolean";
  const [uncontrolledOpen, setUncontrolledOpen] = useState(defaultOpen);
  const open = isControlled ? controlledOpen : uncontrolledOpen;

  const rootRef = useRef(null);
  const buttonRef = useRef(null);

  // On phones and tablets (<=960px, where the character sheet is single-column)
  // we drop the slide-out trigger entirely and show the content inline.
  const [isMobile, setIsMobile] = useState(
    () => typeof window !== "undefined" && window.matchMedia("(max-width: 960px)").matches
  );
  useEffect(() => {
    const mq = window.matchMedia("(max-width: 960px)");
    const update = () => setIsMobile(mq.matches);
    update();
    mq.addEventListener("change", update);
    return () => mq.removeEventListener("change", update);
  }, []);

  const [resolvedSide, setResolvedSide] = useState(side === "auto" ? "right" : side);

  const setOpen = (next) => {
    if (!isControlled) setUncontrolledOpen(next);
    onOpenChange?.(next);
  };

  useLayoutEffect(() => {
    if (!open) return;
    if (side !== "auto") {
      setResolvedSide(side);
      return;
    }
    const btn = buttonRef.current;
    if (!btn) return;

    const rect = btn.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const mid = window.innerWidth / 2;

    setResolvedSide(centerX < mid ? "right" : "left");
  }, [open, side]);

  useEffect(() => {
    if (!open) return;

    const handler = () => {
      if (side !== "auto") return;
      const btn = buttonRef.current;
      if (!btn) return;

      const rect = btn.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const mid = window.innerWidth / 2;

      setResolvedSide(centerX < mid ? "right" : "left");
    };

    window.addEventListener("resize", handler);
    window.addEventListener("scroll", handler, true);
    return () => {
      window.removeEventListener("resize", handler);
      window.removeEventListener("scroll", handler, true);
    };
  }, [open, side]);

  useEffect(() => {
    if (!open) return;

    const onPointerDown = (e) => {
      const root = rootRef.current;
      if (!root) return;
      if (root.contains(e.target)) return;
      setOpen(false);
    };

    document.addEventListener("mousedown", onPointerDown, true);
    document.addEventListener("touchstart", onPointerDown, true);

    return () => {
      document.removeEventListener("mousedown", onPointerDown, true);
      document.removeEventListener("touchstart", onPointerDown, true);
    };
  }, [open, isControlled]);

  useEffect(() => {
    if (!open) return;

    const onKey = (e) => {
      if (e.key === "Escape") setOpen(false);
    };

    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open]);

  const childArray = React.Children.toArray(children);

  // Mobile: no button - just the open parchment panel with the content.
  if (isMobile) {
    return (
      <div ref={rootRef} className={`staggerMenu staggerMenu--static ${className}`}>
        <div className="staggerMenu__static" role="region" aria-label={title}>
          {childArray.map((node, i) => (
            <div key={i} className="staggerMenu__item" style={{ ["--i"]: i }}>
              {node}
            </div>
          ))}
        </div>
      </div>
    );
  }

  // ✅ KEY FIX: make closed transform start behind trigger by canceling triggerOverlap
  const nudge = 14;
  const fromX =
    resolvedSide === "right"
      ? `calc(var(--triggerOverlap) - ${nudge}px)`
      : `calc(var(--triggerOverlap) + ${nudge}px)`;

  return (
    <div
      ref={rootRef}
      className={`staggerMenu ${className}`}
      style={{
        ["--menuWidth"]: `${width}px`,
        ["--menuOffset"]: `${offset}px`,
        ["--staggerMs"]: `${staggerMs}ms`,
      }}
    >
      <button
        ref={buttonRef}
        type="button"
        className="staggerMenu__trigger"
        aria-expanded={open}
        aria-controls={panelId}
        onClick={() => setOpen(!open)}
      >
        <span className="staggerMenu__title">{title}</span>
        <span className={`staggerMenu__arrow ${open ? "open" : ""}`} aria-hidden="true">
          &#9656;
        </span>
      </button>

      <div
        id={panelId}
        className={`staggerMenu__panel ${open ? "open" : ""} ${
          resolvedSide === "left" ? "from-left" : "from-right"
        }`}
        style={{
          ["--fromX"]: fromX,
        }}
        role="region"
        aria-label={title}
      >
        {childArray.map((node, i) => (
          <div key={i} className="staggerMenu__item" style={{ ["--i"]: i }}>
            {node}
          </div>
        ))}
      </div>
    </div>
  );
}
