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
// Edit this array to put your own skills. Each card is a title + list of items.
const SKILL_CARDS = [
    {
        id: 1,
        title: "Core Abilities",
        items: [
            "Responsive Web Design",
            "Component Architecture (React Hooks, Context API)",
            "RESTful API Integration",
            "State Management (Redux, Context)",
            "Debugging & Optimization",
            "UI/UX Collaboration (Figma)",
        ],
    },
    {
        id: 2,
        title: "Technical Skills",
        items: [
            "JavaScript (ES6+)",
            "React.js / Next.js",
            "Node.js / Express",
            "Python · C++ · C#",
            "HTML5 / CSS3 / SCSS",
            "SQL / NoSQL",
        ],
    },
    {
        id: 3,
        title: "Tools & Cloud",
        items: [
            "Git / GitHub",
            "ClickUp · Postman",
            "Vite · Webpack",
            "AWS Cloud Foundations",
            "Intro to Generative AI",
        ],
    },
    {
        id: 4,
        title: "Soft Skills",
        items: [
            "Problem Solving",
            "Adaptability",
            "Collaboration",
            "Documentation",
        ],
    },
];

function CharacterDesktop() {
    const [skillsRef, skillsW] = useElemWidth();
    const [portraitsRef, portraitsW] = useElemWidth();

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
    ]
    // Text cards built from the SKILL_CARDS data above (edit that array in code).
    const cardsData = SKILL_CARDS.map((card) => ({
        id: card.id,
        content: (
            <div className="skill-card">
                <h4 className="skill-card-title">{card.title}</h4>
                <ul className="skill-card-list">
                    {card.items.map((item, ii) => (
                        <li key={ii}>{item}</li>
                    ))}
                </ul>
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
                style={{ minHeight: stackReserve(fitCardWidth(400, skillsW), 1.4) }}
            >
                <Stack
                    randomRotation={true}
                    sensitivity={180}
                    sendToBackOnClick={false}
                    cardDimensions={{
                        width: fitCardWidth(550, skillsW),
                        height: Math.round(fitCardWidth(550, skillsW) * 1.4),
                    }}
                    cardsData={cardsData}
                />
            </div>

            <div
                className="portraits"
                ref={portraitsRef}
                style={{ minHeight: stackReserve(fitCardWidth(550, portraitsW), 1.2) }}
            >
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