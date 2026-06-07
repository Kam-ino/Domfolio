import { useEffect, useLayoutEffect, useMemo, useRef, useState } from "react";
import { gsap } from "gsap";

import "./Masonry.css";

const useMeasure = () => {
  const ref = useRef(null);
  const [size, setSize] = useState({ width: 0, height: 0 });

  useLayoutEffect(() => {
    if (!ref.current) return;
    const ro = new ResizeObserver(([entry]) => {
      const { width, height } = entry.contentRect;
      setSize({ width, height });
    });
    ro.observe(ref.current);
    return () => ro.disconnect();
  }, []);

  return [ref, size];
};

// Preload images and capture each one's aspect ratio (height / width).
const preloadImages = async (urls) => {
  const ratios = {};
  await Promise.all(
    urls.map(
      (src) =>
        new Promise((resolve) => {
          const img = new Image();
          img.src = src;
          img.onload = () => {
            ratios[src] = img.naturalHeight / img.naturalWidth || 1;
            resolve();
          };
          img.onerror = () => {
            ratios[src] = 1;
            resolve();
          };
        })
    )
  );
  return ratios;
};

const Masonry = ({
  items,
  ease = "power3.out",
  duration = 0.6,
  stagger = 0.05,
  animateFrom = "bottom",
  scaleOnHover = true,
  hoverScale = 0.95,
  blurToFocus = true,
  colorShiftOnHover = false,
  onItemEnter,
  onItemLeave,
  onItemClick,
}) => {
  const [containerRef, { width }] = useMeasure();
  const [ratios, setRatios] = useState(null);

  // Column count is driven by the container width (this lives inside a modal,
  // not the full viewport) and capped by the number of items.
  const columns = useMemo(() => {
    if (!width) return 1;
    const byWidth = Math.max(1, Math.min(4, Math.floor(width / 170)));
    return Math.max(1, Math.min(byWidth, items.length));
  }, [width, items.length]);

  const getInitialPosition = (item) => {
    const containerRect = containerRef.current?.getBoundingClientRect();
    if (!containerRect) return { x: item.x, y: item.y };

    let direction = animateFrom;
    if (animateFrom === "random") {
      const dirs = ["top", "bottom", "left", "right"];
      direction = dirs[Math.floor(Math.random() * dirs.length)];
    }

    switch (direction) {
      case "top":
        return { x: item.x, y: -200 };
      case "bottom":
        return { x: item.x, y: window.innerHeight + 200 };
      case "left":
        return { x: -200, y: item.y };
      case "right":
        return { x: window.innerWidth + 200, y: item.y };
      case "center":
        return {
          x: containerRect.width / 2 - item.w / 2,
          y: containerRect.height / 2 - item.h / 2,
        };
      default:
        return { x: item.x, y: item.y + 100 };
    }
  };

  useEffect(() => {
    preloadImages(items.map((i) => i.img)).then(setRatios);
  }, [items]);

  // Masonry layout: place each item in the shortest column, height from aspect.
  const { grid, containerHeight } = useMemo(() => {
    if (!width || !ratios) return { grid: [], containerHeight: 0 };

    const colHeights = new Array(columns).fill(0);
    const columnWidth = width / columns;

    const placed = items.map((child) => {
      const col = colHeights.indexOf(Math.min(...colHeights));
      const x = columnWidth * col;
      const ratio = ratios[child.img] ?? (child.height ? child.height / 600 : 1);
      const h = columnWidth * ratio; // aspect-preserving tile height
      const y = colHeights[col];
      colHeights[col] += h;
      return { ...child, x, y, w: columnWidth, h };
    });

    return { grid: placed, containerHeight: Math.max(0, ...colHeights) };
  }, [columns, items, width, ratios]);

  const hasMounted = useRef(false);

  useLayoutEffect(() => {
    if (!ratios) return;

    grid.forEach((item, index) => {
      const selector = `[data-key="${item.id}"]`;
      const animationProps = { x: item.x, y: item.y, width: item.w, height: item.h };

      if (!hasMounted.current) {
        const initialPos = getInitialPosition(item);
        const initialState = {
          opacity: 0,
          x: initialPos.x,
          y: initialPos.y,
          width: item.w,
          height: item.h,
          ...(blurToFocus && { filter: "blur(10px)" }),
        };

        gsap.fromTo(selector, initialState, {
          opacity: 1,
          ...animationProps,
          ...(blurToFocus && { filter: "blur(0px)" }),
          duration: 0.8,
          ease: "power3.out",
          delay: index * stagger,
        });
      } else {
        gsap.to(selector, {
          ...animationProps,
          duration,
          ease,
          overwrite: "auto",
        });
      }
    });

    hasMounted.current = true;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [grid, ratios, stagger, animateFrom, blurToFocus, duration, ease]);

  const handleMouseEnter = (e, item) => {
    const selector = `[data-key="${item.id}"]`;
    if (scaleOnHover) {
      gsap.to(selector, { scale: hoverScale, duration: 0.3, ease: "power2.out" });
    }
    if (colorShiftOnHover) {
      const overlay = e.currentTarget.querySelector(".color-overlay");
      if (overlay) gsap.to(overlay, { opacity: 0.3, duration: 0.3 });
    }
    onItemEnter?.(item);
  };

  const handleMouseLeave = (e, item) => {
    const selector = `[data-key="${item.id}"]`;
    if (scaleOnHover) {
      gsap.to(selector, { scale: 1, duration: 0.3, ease: "power2.out" });
    }
    if (colorShiftOnHover) {
      const overlay = e.currentTarget.querySelector(".color-overlay");
      if (overlay) gsap.to(overlay, { opacity: 0, duration: 0.3 });
    }
    onItemLeave?.(item);
  };

  return (
    <div ref={containerRef} className="list" style={{ height: containerHeight }}>
      {grid.map((item) => (
        <div
          key={item.id}
          data-key={item.id}
          className="item-wrapper"
          onClick={() =>
            onItemClick
              ? onItemClick(item)
              : item.url && window.open(item.url, "_blank", "noopener")
          }
          onMouseEnter={(e) => handleMouseEnter(e, item)}
          onMouseLeave={(e) => handleMouseLeave(e, item)}
        >
          <div className="item-img" style={{ backgroundImage: `url(${item.img})` }}>
            {colorShiftOnHover && <div className="color-overlay" />}
          </div>
        </div>
      ))}
    </div>
  );
};

export default Masonry;
