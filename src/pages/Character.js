import React, { useRef, useState, useEffect, useLayoutEffect, Suspense, lazy } from "react";
import "./Character.css"
import Collapsible from "../components/Collapsible";
import Stack from "../components/CardStack";
// Lazy-loaded: the 3D dice pull in three.js. Splitting them into an on-demand
// chunk keeps three.js out of the initial bundle.
const D4 = lazy(() => import("../components/dice/D4"));
const D6 = lazy(() => import("../components/dice/D6"));
const D8 = lazy(() => import("../components/dice/D8"));
const D10 = lazy(() => import("../components/dice/D10"));
const D12 = lazy(() => import("../components/dice/D12"));
const D20 = lazy(() => import("../components/dice/D20"));

// Measure an element's width so the (fixed-size) card stacks can be sized to
// fit their column on any screen instead of overflowing on narrow ones.
function useElemWidth() {
  const ref = useRef(null);
  const [width, setWidth] = useState(0);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const update = () => setWidth(el.clientWidth);
    update();
    const ro = new ResizeObserver(update);
    ro.observe(el);
    return () => ro.disconnect();
  }, []);
  return [ref, width];
}

// Cards fan out from a corner, so the rendered stack is wider than one card.
// On wide columns subtract a small margin; on narrow ones leave ~28% headroom
// so the fanned, rotated cards still fit without being clipped.
function fitCardWidth(base, w) {
    if (!w) return base;
    const target = w > 520 ? w - 40 : Math.round(w * 0.72);
    return Math.max(160, Math.min(base, target));
}

// Sizes a single skill card to its content with a minimum 1:2 aspect ratio and
// a 500px floor. If the content is shorter than that floor, the card stays at
// the floor and the typography is scaled up (via the --skill-scale CSS variable)
// so it fills the card instead of leaving empty space. If the content is taller,
// the card grows to fit it (no scrolling).
function useFitSkillCard(cardRef, bodyRef, width) {
  useLayoutEffect(() => {
    const card = cardRef.current;
    const body = bodyRef.current;
    if (!card || !body) return;
    let raf = 0;

    const fit = () => {
      card.style.setProperty("--skill-scale", "1");
      card.style.height = "auto";
      card.style.minHeight = "0"; // measure true content height (CSS floors at 500)

      const w = card.offsetWidth || width || 400;

      // Phones: scale the card down so a dense one can't fill the screen and
      // block scrolling. Cap the height (~58% of the viewport, max 440px) and
      // let the body scroll for any overflow; keep the base font size.
      if (window.matchMedia("(max-width: 600px)").matches) {
        const cap = Math.min(Math.round(window.innerHeight * 0.58), 440);
        const natural = card.offsetHeight;
        card.style.height = `${Math.min(natural, cap)}px`;
        return;
      }

      const floor = Math.max(500, Math.round(w * 2)); // min 500px, min 1:2 aspect
      const natural = card.offsetHeight;

      if (natural >= floor) {
        // Content already exceeds the floor — grow the card to fit it.
        card.style.height = `${natural}px`;
        return;
      }

      // Lock to the floor and scale the type up until the content fills it.
      card.style.height = `${floor}px`;
      if (body.clientHeight <= 0) return;
      let lo = 1, hi = 1.9, best = 1;
      for (let i = 0; i < 10; i++) {
        const mid = (lo + hi) / 2;
        card.style.setProperty("--skill-scale", String(mid));
        // Re-read clientHeight each pass: the title scales too, changing the
        // body's available height.
        if (body.scrollHeight <= body.clientHeight) {
          best = mid;
          lo = mid;
        } else {
          hi = mid;
        }
      }
      card.style.setProperty("--skill-scale", best.toFixed(3));
    };

    const schedule = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(fit);
    };

    fit();
    window.addEventListener("resize", schedule);
    // The display webfont changes text metrics once loaded — re-fit then.
    if (document.fonts && document.fonts.ready) {
      document.fonts.ready.then(schedule).catch(() => {});
    }
    return () => {
      window.removeEventListener("resize", schedule);
      cancelAnimationFrame(raf);
    };
  }, [cardRef, bodyRef, width]);
}

function SkillCard({ card, width }) {
  const cardRef = useRef(null);
  const bodyRef = useRef(null);
  useFitSkillCard(cardRef, bodyRef, width);

  // Fade only the edge(s) that have scrolled-away content (drives the mask in
  // Character.css). Recomputed on scroll/resize and a moment after mount so it
  // settles after the fit hook has sized the card.
  useEffect(() => {
    const body = bodyRef.current;
    if (!body) return;
    const FADE = 26;
    const update = () => {
      const { scrollTop, scrollHeight, clientHeight } = body;
      const scrollable = scrollHeight - clientHeight > 2;
      body.style.setProperty(
        "--fade-top",
        scrollable && scrollTop > 2 ? `${FADE}px` : "0px"
      );
      body.style.setProperty(
        "--fade-bottom",
        scrollable && scrollTop < scrollHeight - clientHeight - 2 ? `${FADE}px` : "0px"
      );
    };
    update();
    body.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize", update);
    const raf = requestAnimationFrame(update);
    const timer = setTimeout(update, 320);
    return () => {
      body.removeEventListener("scroll", update);
      window.removeEventListener("resize", update);
      cancelAnimationFrame(raf);
      clearTimeout(timer);
    };
  }, []);

  return (
    <div className="skill-card" ref={cardRef}>
      <h4 className="skill-card-title">{card.title}</h4>
      <div className="skill-card-body" ref={bodyRef}>
        {card.sections.map((sec, si) => (
          <div className="skill-section" key={si}>
            <h5 className="skill-section-heading">{sec.heading}</h5>
            <ul className="skill-card-list">
              {sec.items.map((item, ii) => (
                <li key={ii}>{item}</li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </div>
  );
}

// ---- Skill cards (shown in the "skills" stack) ----
// Edit this array to put your own skills. Each card has a title and one or more
// sections (a heading + list of items).
const SKILL_CARDS = [
    {
        id: 1,
        title: "Skills & Proficiencies",
        sections: [
            {
                heading: "Core Abilities",
                items: [
                    "Responsive Web Design",
                    "Component Architecture (React Hooks, Context API)",
                    "Data Handling & RESTful API Integration",
                    "State Management (Redux, Context API)",
                    "Debugging, Troubleshooting & Optimization",
                    "AI-Assisted Programming (Claude Code)",
                    "UI/UX Collaboration with Designers (Figma)",
                    "Project Management (ClickUp / Trello)",
                    "Toolchain Familiarity (Vite, Webpack, NPM)",
                    "Marketing Strategy Generation"
                ],
            },
        ],
    },
    {
        id: 2,
        title: "Other Proficiencies & Languages",
        sections: [
            {
                heading: "Soft Skills & Traits",
                items: [
                    "Quick Learner - Gains +2 bonus when learning new frameworks",
                    "Team Collaborator - Advantage on pair-programming checks",
                    "Persistence - Immune to “Compilation Errors: Panic Attack”",
                    "Critical Debugger - 20% chance to fix bugs by intuition alone",
                ],
            },
            {
                heading: "Languages Known",
                items: [
                    "Common (English, Tagalog, Japanese)",
                    "Elvish (JavaScript, TypeScript)",
                    "Dwarvish (Python)",
                    "Celestial (Linux)",
                ],
            },
            {
                heading: "Tools of the Trade",
                items: [
                    "GitHub (Version Control)",
                    "ClickUp (Project Management)",
                    "VS Code / Postman",
                    "Figma / Canva (Design Space)",
                    "Claude Code (Coding Assistant)",
                ],
            },
        ],
    },
    {
        id: 3,
        title: "Equipment",
        sections: [
            {
                heading: "Weapon (Laptop)",
                items: [
                    "Intel Core i7",
                    "32GB RAM",
                    "NVIDIA GeForce RTX 5060 GPU",
                    "2TB Storage",
                ],
            },
            {
                heading: "Scrolls (Certifications)",
                items: [
                    "AWS Educate Introduction to Cloud 101",
                    "AWS Educate Machine Learning Foundations",
                    "AWS Educate Introduction to Generative AI",
                    "AWS Academy Cloud Foundations",
                    "Introduction to Generative AI and Prompt Engineering",
                    "Applied Machine Learning in Python",
                    "Applied Plotting, Charting and Data Representation in Python",
                    "Cisco Introduction to Cybersecurity",
                    "CCNA: Switching, Routing, and Wireless Essentials",
                    "CCNA: Introduction to Networks",
                    "CCNA: Enterprise Networking, Security, and Automation",
                ],
            },
        ],
    },
    {
        id: 4,
        title: "Mastery",
        sections: [
            {
                heading: "Weapon Proficiencies",
                items: [
                    "Lvl 5: React.js / Next.js (Quick, elegant front-end builds)",
                    "Lvl 5: JavaScript / TypeScript (Fluent in modern scripting magic)",
                    "Lvl 2: Node.js / Python (Backend and API wizardry)",
                    "Lvl 4: Git / GitHub / CLI (Battle-ready with version control)",
                    "Lvl 3: MySQL / MongoDB / Supabase (Keeper of relational and document archives)",
                    "Lvl 3: Data Structures / Algorithms (Mastery of computational tactics)",
                    "Lvl 5: Component-based Design (Crafts interfaces with user empathy)",
                    "Lvl 5: Debugging & Optimization (Hunts bugs with precision)",
                    "Lvl 3: Agile Development (Navigates projects through iterative quests)",
                ],
            },
        ],
    },
    {
        id: 5,
        title: "Mastery",
        sections: [
            {
                heading: "Tools & Technical Proficiencies",
                items: [
                    "AWS Cloud Foundations",
                    "AWS Machine Learning Foundations",
                    "Google Cloud Platform / Gemini Integration",
                    "SQL / NoSQL / Postgress / GraphQL Databases",
                    "JSON / API Handling",
                    "Postman, Replit, Glitch, VS Code",
                    "Vercel / Render Deployment",
                    "Claude Code / Magnific / Gemini",
                    "Nano Banana / Seedance / Grok"
                ],
            },
        ],
    },
                
];

function CharacterDesktop() {
    const [skillsRef, skillsW] = useElemWidth();
    const [portraitsRef, portraitsW] = useElemWidth();

    // Cards are a uniform 400 x 800 on desktop; on the single-column phone /
    // tablet layout they shrink to fit the column (keeping the 1:2 ratio) so
    // they don't get clipped.
    const [narrow, setNarrow] = useState(
        () => typeof window !== "undefined" && window.matchMedia("(max-width: 960px)").matches
    );
    useEffect(() => {
        const mq = window.matchMedia("(max-width: 960px)");
        const update = () => setNarrow(mq.matches);
        update();
        mq.addEventListener("change", update);
        return () => mq.removeEventListener("change", update);
    }, []);
    const skillCardW = narrow ? fitCardWidth(500, skillsW) : 400;
    // Portrait, but sized to hug the typical card's content so short cards
    // aren't mostly empty. The stack is uniform-height, so the densest cards
    // (e.g. the cert list) still scroll their body; the rest fit. ~1.25 ratio
    // on narrow, a trimmer 600 on desktop (was a too-tall 650).
    const skillCardH = narrow ? Math.round(skillCardW * 1.25) : 600;

    // Bounty posters shrink a touch on narrow screens so their wider fan (the
    // opaque poster hides back cards, so it needs more spread) still fits the
    // column centered instead of sprawling off the edge.
    const posterW = narrow
        ? Math.round(fitCardWidth(550, portraitsW) * 0.82)
        : fitCardWidth(550, portraitsW);

    const stats = [
        { file: 'Stat 1.webp', label: 'STR' },
        { file: 'Stat 2.webp', label: 'DEX' },
        { file: 'Stat 3.webp', label: 'CON' },
        { file: 'Stat 4.webp', label: 'INT' },
        { file: 'Stat 5.webp', label: 'WIS' },
        { file: 'Stat 6.webp', label: 'CHA' },
    ];
    
    const pics = [
        {
        id: 1,
        content: (
            <div className="portrait">
                <img src="https://mmylzwtzvdhwtwhfvlam.supabase.co/storage/v1/object/public/images/Poster (1).webp" alt="Me 1" loading="lazy" decoding="async"/>
            </div>
        ),
        },
        {
        id: 2,
        content: (
            <div className="portrait">
                <img src="https://mmylzwtzvdhwtwhfvlam.supabase.co/storage/v1/object/public/images/Poster (2).webp" alt="Me 2" loading="lazy" decoding="async"/>
            </div>
        ),
        },
        {
        id: 3,
        content: (
            <div className="portrait">
                <img src="https://mmylzwtzvdhwtwhfvlam.supabase.co/storage/v1/object/public/images/Poster (3).webp" alt="Me 3" loading="lazy" decoding="async"/>
            </div>
        ),
        },
        {
        id: 4,
        content: (
            <div className="portrait">
                <img src="https://mmylzwtzvdhwtwhfvlam.supabase.co/storage/v1/object/public/images/Poster (4).webp" alt="Me 4" loading="lazy" decoding="async"/>
            </div>
        ),
        },
        {
        id: 5,
        content: (
            <div className="portrait">
                <img src="https://mmylzwtzvdhwtwhfvlam.supabase.co/storage/v1/object/public/images/Poster (5).webp" alt="Me 5" loading="lazy" decoding="async"/>
            </div>
        ),
        },
        {
        id: 6,
        content: (
            <div className="portrait">
                <img src="https://mmylzwtzvdhwtwhfvlam.supabase.co/storage/v1/object/public/images/Poster (6).webp" alt="Me 6" loading="lazy" decoding="async"/>
            </div>
        ),
        },
        {
        id: 7,
        content: (
            <div className="portrait">
                <img src="https://mmylzwtzvdhwtwhfvlam.supabase.co/storage/v1/object/public/images/Poster (7).webp" alt="Me 7" loading="lazy" decoding="async"/>
            </div>
        ),
        },
    ]
    // Text cards built from the SKILL_CARDS data above (edit that array in code).
    // Each card sizes itself to its content (see SkillCard / useFitSkillCard).
    const cardsData = SKILL_CARDS.map((card) => ({
        id: card.id,
        content: <SkillCard card={card} width={skillCardW} />,
    }));

    return (
        <div className="character-sheet">
            <div className="character">
                <div className="cgrid">
                    <div className="cformat">
                        <p className="cname">Dominic Santiago Guevarra</p>
                        <p className="ctext">Class & Level: Frontend Developer, Lvl 5</p>
                        <p className="ctext">Land of Origin: Marikina City, Philippines</p>
                        <p className="ctext">Bounty: 50,000</p>                       
                    </div>
                    <div className="cformat">
                        <p className="ctext">Background: Computer Engineering at Mapua University</p>
                        <p className="ctext">Specialization: Web Application Development</p>
                        <p className="ctext">Expected Graduation: August 2026</p>
                        <p className="ctext">Date of Birth: 25 December, 2003</p>
                    </div>

                </div>
            </div>

            <div className="stats-column">
                {stats.map((stat, index) => (
                    <div key={index} className="stat-bubble">
                    <img
                        src={`https://mmylzwtzvdhwtwhfvlam.supabase.co/storage/v1/object/public/images/${stat.file}`}
                        alt={stat.label}
                        className="stat-img"
                        loading="lazy"
                        decoding="async"
                    />
                    <p className="stat-label">{stat.label}</p>
                    </div>
                ))}
            </div> 

            <div className="guide">
                <Collapsible title="Stat Guide">
                    <h2>Character Stats Explained</h2>
                    <p>STR (Strength): Technical Endurance & Debugging Power<br/>DEX (Dexterity): Frontend Finesse & Code Precision<br/>CON (Constitution): Resilience & Focus<br/>INT (Intelligence): Problem-Solving & Technical Knowledge<br/>WIS (Wisdom): Judgment & Design Intuition<br/>CHA (Charisma): Collaboration & Communication<br/></p>
                </Collapsible>
            </div>
            <div className="summary-box">
                <div className="summary-format">
                    <h1>Summary:</h1>
                    <p className="summary-text" >Hailing from the city-state of Marikina, Dominic Santiago Guevarra is a full-stack artificer equally at home in two realms — the radiant kingdom of Reactoria, where he shapes living interfaces from React crystals, and the smoldering Forge of Nodeheim, where he bends servers and APIs to his will. Of late he has taken to summoning tireless constructs — automations that greet merchants' patrons, mend broken checkouts, and spin marketing scrolls through the night — and to fortifying the grand bazaars of commerce until their coffers overflow. Fluent in Elvish (JavaScript &amp; TypeScript) and Dwarvish (Python), and counseled by arcane oracles that quicken his craft, he wanders ever onward in search of the next worthy quest.</p>
                    <p className="summary-text" style={{marginTop:"10px", color:"#8A9A5B"}}>Alignment: Neutral Good – always striving to improve code and collaborate fairly.</p>
                    <p className="summary-text" style={{marginTop:"10px", color:"#0F52BA"}}>Special Trait: “Design Adaptation” – gains +2 bonus to Implementing Designs into Code.</p>
                </div>
            </div>

            <div
                className="skills"
                ref={skillsRef}
                // style={{ minHeight: stackReserve(skillCardW, 2) }}
            >
                <p>Swipe from the Titles to flip the stack</p>
                <Stack
                    randomRotation={true}
                    sensitivity={180}
                    sendToBackOnClick={false}
                    adaptiveHeight={true}
                    /* Tighter fan + bottom-center pivot on narrow screens so the
                       stack stays centered instead of sprawling off the right. */
                    fanDegrees={narrow ? 3.5 : 4}
                    cardOrigin={narrow ? "50% 100%" : "90% 90%"}
                    /* width is uniform; each card's height adapts to its content
                       (min 500px, min 1:2 aspect) — see SkillCard. */
                    cardDimensions={{ width: skillCardW, height: skillCardH }}
                    cardsData={cardsData}
                />
            </div>

            <div
                className="portraits"
                ref={portraitsRef}
                // style={{ minHeight: stackReserve(fitCardWidth(550, portraitsW), 1.2) }}
            >
                <p>My Bounty Posters</p>
                <Stack
                    randomRotation={true}
                    sensitivity={180}
                    sendToBackOnClick={false}
                    fanDegrees={narrow ? 7.5 : 4}
                    cardOrigin={narrow ? "50% 100%" : "90% 90%"}
                    cardDimensions={{
                        width: posterW,
                        height: Math.round(posterW * 1.2),
                    }}
                    cardsData={pics}
                />
            </div>
            
            <div className="saving">
                <h2 className="saving-text">Saving Throws</h2>
                <ul className="saving-text">
                    <li data-icon="🧘‍♂️">Concentration: Keeps calm during major debugging crises</li>
                    <li data-icon="⏳">Patience: Survives multi-hour compile times</li>
                    <li data-icon="🌊">Adaptability: Able to learn new tech stacks on the fly</li>
                    <li data-icon="🛡️">Error Recovery: Quickly rebounds from failed builds and crashes</li>
                    <li data-icon="🧠">Logic Resistance: Maintains clear reasoning under complex system constraints</li>
                    <li data-icon="⚖️">Trade-off Judgment: Balances speed, quality, and maintainability</li>
                    <li data-icon="🔍">Bug Awareness: Detects subtle issues before they reach production</li>
                    <li data-icon="🕯️">Focus Endurance: Maintains productivity during long development sessions</li>         
                </ul>
            </div>

            <div className="dice-case">
                <Suspense fallback={null}>
                <D4 bounce={false} />
                <D6 bounce={false} />
                <D8 bounce={false} />
                <D10 bounce={false} />
                <D12 bounce={false} />
                <D20 bounce={false} />
                </Suspense>
            </div>
        </div>
    );
}

function Character() {
  return <CharacterDesktop />;
}

export default Character;