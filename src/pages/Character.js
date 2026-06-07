import React, { useRef, useState, useEffect } from "react";
import "./Character.css"
import Collapsible from "../components/Collapsible";
import Stack from "../components/CardStack";
import D4 from "../components/dice/D4";
import D6 from "../components/dice/D6";
import D8 from "../components/dice/D8";
import D10 from "../components/dice/D10";
import D12 from "../components/dice/D12";
import D20 from "../components/dice/D20";

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

// Vertical space a fanned stack needs: the card height (width * aspect) plus
// headroom for the rotated cards that fan up and out, so it never overlaps the
// panels above/below it.
function stackReserve(cardW, aspect) {
    return Math.round(cardW * aspect + cardW * 0.7);
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
            {
                heading: "Tools & Technical Proficiencies",
                items: [
                    "AWS Cloud Foundations",
                    "AWS Machine Learning Foundations",
                    "Google Cloud Platform / Gemini Integration",
                    "SQL / NoSQL / Postgress / GraphQL Databases",
                    "JSON / API Handling",
                    "Postman, Replit, Glitch, VS Code",
                    "Vercel / Render Deployment"
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
                    "Lvl 5: HTML5 / CSS3 (Visual alchemy and layout spells)",
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
    const skillCardH = 650;

    const stats = [
        { file: 'Stat 1.png', label: 'STR' },
        { file: 'Stat 2.png', label: 'DEX' },
        { file: 'Stat 3.png', label: 'CON' },
        { file: 'Stat 4.png', label: 'INT' },
        { file: 'Stat 5.png', label: 'WIS' },
        { file: 'Stat 6.png', label: 'CHA' },
    ];
    
    const pics = [
        {
        id: 1,
        content: (
            <div className="portrait">
                <img src="./images/Poster (1).png" alt="Me 1"/>
            </div>
        ),
        },
        {
        id: 2,
        content: (
            <div className="portrait">
                <img src="/images/Poster (2).png" alt="Me 2"/>
            </div>
        ),
        },
        {
        id: 3,
        content: (
            <div className="portrait">
                <img src="/images/Poster (3).png" alt="Me 3"/>
            </div>
        ),
        },
        {
        id: 4,
        content: (
            <div className="portrait">
                <img src="/images/Poster (4).png" alt="Me 4"/>
            </div>
        ),
        },
        {
        id: 5,
        content: (
            <div className="portrait">
                <img src="/images/Poster (5).png" alt="Me 5"/>
            </div>
        ),
        },
        {
        id: 6,
        content: (
            <div className="portrait">
                <img src="/images/Poster (6).png" alt="Me 5"/>
            </div>
        ),
        },
        {
        id: 7,
        content: (
            <div className="portrait">
                <img src="/images/Poster (7).png" alt="Me 5"/>
            </div>
        ),
        },
    ]
    // Text cards built from the SKILL_CARDS data above (edit that array in code).
    const cardsData = SKILL_CARDS.map((card) => ({
        id: card.id,
        content: (
            <div className="skill-card">
                <h4 className="skill-card-title">{card.title}</h4>
                <div className="skill-card-body">
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
        ),
    }));

    return (
        <div className="character-sheet">
            <div className="character">
                <div className="cgrid">
                    <div className="cformat">
                        <p className="cname">Dominic Santiago Guevarra</p>
                        <p className="ctext">Class & Level: Frontend Developer, Lvl 5</p>
                        <p className="ctext">Land of Origin: Marikina City, Philippines</p>                       
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
                        src={`/images/${stat.file}`} // Adjust path if needed
                        alt={stat.label}
                        className="stat-img"
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
                    <p className="summary-text" >“I am a Computer Engineering undergraduate with hands-on experience in full stack and frontend development using React, JavaScript, and Node.js. From my university and organization projects, I gained strong foundations in programming, system design, and problem solving, which I am eager to apply in real-world projects. I am looking for an opportunity to work in a collaborative environment where I can continue to grow and sharpen my technical skills while contributing to meaningful applications. My goal is to grow into a well-rounded developer who delivers efficient, user-focused solutions while learning from experienced professionals."</p>
                    <p className="summary-text" style={{marginTop:"10px"}}>Alignment: Neutral Good – always striving to improve code and collaborate fairly.</p>
                    <p className="summary-text" style={{marginTop:"10px"}}>Special Trait: “Design Adaptation” – gains +2 bonus to Implementing Designs into Code.</p>
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
                    /* Uniform 400 x 800 (shrinks to fit on narrow screens) */
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
                    cardDimensions={{
                        width: fitCardWidth(550, portraitsW),
                        height: Math.round(fitCardWidth(550, portraitsW) * 1.2),
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
                <D4 bounce={false} />
                <D6 bounce={false} />
                <D8 bounce={false} />
                <D10 bounce={false} />
                <D12 bounce={false} />
                <D20 bounce={false} />
            </div>
        </div>
    );
}

function Character() {
  return <CharacterDesktop />;
}

export default Character;