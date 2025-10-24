import React from "react";
import "./Character.css"
import Collapsible from "../components/Collapsible";
import Stack from "../components/CardStack";
import DiceRoller from "../components/DiceRoller";

function CharacterDesktop() {
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
    const cardsData = [
        {
        id: 1,
        content: (
            <div className="snp">
            <h1>Skills & Proficiencies:</h1>
            <h2>🧭 Core Abilities</h2>
            <ul className="snp-text">
                <li data-icon="🎯">Responsive Web Design</li>
                <li data-icon="🧱">Component Architecture (React Hooks, Context API)</li>
                <li data-icon="🧮">Data Handling & RESTful API Integration</li>
                <li data-icon="🧵">State Management (Redux, Context API)</li>
                <li data-icon="🧠">Debugging, Troubleshooting & Optimization</li>
                <li data-icon="🪶">UI/UX Collaboration with Designers (Figma)</li>
                <li data-icon="🗂️">Project Management (ClickUp / Trello)</li>
                <li data-icon="🧰">Toolchain Familiarity (Vite, Webpack, npm)</li>
            </ul>

            <h2 className="snp-text">☁️ Tool & Technical Proficiencies</h2>
            <ul className="snp-text">
                <li data-icon="☁️">AWS Cloud Foundations</li>
                <li data-icon="🤖">AWS Machine Learning Foundations</li>
                <li data-icon="🗃️">SQL / NoSQL Databases</li>
                <li data-icon="🧾">JSON / API Handling</li>
                <li data-icon="🔧">Postman, Replit, Glitch, VS Code</li>
            </ul>
            </div>
        ),
        },
        {
        id: 2,
        content: (
            <div className="snp">
            <h1>Other Proficiencies & Languages:</h1>
            <h2>🛡️ Soft Skills & Traits</h2>
            <ul className="snp-text">
                <li data-icon="⚡🧠">Quick Learner — Gains +2 bonus when learning new frameworks</li>
                <li data-icon="🤝💻">Team Collaborator — Advantage on pair-programming checks</li>
                <li data-icon="💪🔥">Persistence — Immune to “Compilation Errors: Panic Attack”</li>
                <li data-icon="🎯🐞">Critical Debugger — 20% chance to fix bugs by intuition alone</li>
            </ul>

            <h2 className="snp-text">🧙‍♂️ Languages Known</h2>
            <ul className="snp-text">
                <li data-icon="🌏">Common (English, Tagalog, Japanese)</li>
                <li data-icon="🧝‍♂️">Elvish (JavaScript)</li>
                <li data-icon="⚒️">Dwarvish (Python)</li>
                <li data-icon="☁️">Celestial (React)</li>
                <li data-icon="🔥">Infernal (Node.js)</li>
                <li data-icon="📜">Ancient Script (C / C++ / C#)</li>
            </ul>
            <h2 className="snp-text">Tools of the Trade</h2>
            <ul className="snp-text">
                <li data-icon="🧰">GitHub</li>
                <li data-icon="🗂️">ClickUp (Project Management)</li>
                <li data-icon="💻">VS Code / Postman</li>
                <li data-icon="🎨">Figma / Canva</li>
                <li data-icon="🤖">ChatGPT / Claude (Coding Assistant)</li>
                <li data-icon="📘">StackOverflow (Debugging)</li>
            </ul>
            </div>
        ),
        },
        {
        id: 3,
        content: (
            <div className="snp">
            <h1>Equipment:</h1>
            <h2>💻 Weapon (Laptop)</h2>
            <ul className="snp-text">
                <li data-icon="⚙️">AMD Ryzen 7</li>
                <li data-icon="⚙️">64GB RAM</li>
                <li data-icon="⚙️">NVIDIA GeForce RTX 4050 GPU</li>
                <li data-icon="⚙️">512GB Storage</li>
            </ul>

            <h2 className="snp-text">Scrolls (Certifications)</h2>
            <ul className="snp-text">
                <li data-icon="📜">AWS Educate Introduction to Cloud 101</li>
                <li data-icon="📜">AWS Educate Machine Learning Foundations</li>
                <li data-icon="📜">AWS Educate Introduction to Generative AI</li>
                <li data-icon="📜">AWS Academy Cloud Foundations</li>
                <li data-icon="📜">Introduction to Generative AI and Prompt Engineering</li>
                <li data-icon="📜">Applied Machine Learning in Python</li>
                <li data-icon="📜">Applied Plotting, Charting and Data Representation in Python</li>
                <li data-icon="📜">Cisco Introduction to Cybersecurity</li>
                <li data-icon="📜">CCNA: Switching, Routing, and Wireless Essentials</li>
                <li data-icon="📜">CCNA: Introduction to Networks</li>
                <li data-icon="📜">CCNA: Enterprise Networking, Security, and Automation</li>
            </ul>
            </div>
        ),
        },
        {
        id: 4,
        content: (
            <div className="snp">
            <h1>Mastery:</h1>
            <h2 className="snp-text">⚔️ Weapon Proficiencies</h2>
            <ul className="snp-text">
                <li data-icon="⚙️">Lvl 5: React.js / Next.js (Quick, elegant front-end builds)</li>
                <li data-icon="💻">Lvl 5: JavaScript (ES6+) (Fluent in modern scripting magic)</li>
                <li data-icon="🧩">Lvl 2: Node.js (Backend and API wizardry)</li>
                <li data-icon="🎨">Lvl 5: HTML5 / CSS3 (Visual alchemy and layout spells)</li>
                <li data-icon="🧠">Lvl 5: Python / C++ / C# (Logical and algorithmic dueling)</li>
                <li data-icon="🧰">Lvl 4: Git / GitHub / CLI (Battle-ready with version control)</li>
                <li data-icon="🗄️">Lvl 3: MySQL / MongoDB (Keeper of relational and document archives)</li>
                <li data-icon="🧮">Lvl 3: Data Structures / Algorithms (Mastery of computational tactics)</li>
                <li data-icon="📐">Lvl 5: Component-based Design (Crafts interfaces with user empathy)</li>
                <li data-icon="🔍">Lvl 5: Debugging & Optimization (Hunts bugs with precision)</li>
                <li data-icon="🧭">Lvl 2: Agile Development (Navigates projects through iterative quests)</li>
            </ul>
            </div>
        ),
        },
    ];

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
                
                <Collapsible title="Stat Guide">
                    <h2>Character Stats Explained</h2>
                    <p>STR (Strength): Technical Endurance & Debugging Power<br/>DEX (Dexterity): Frontend Finesse & Code Precision<br/>CON (Constitution): Resilience & Focus<br/>INT (Intelligence): Problem-Solving & Technical Knowledge<br/>WIS (Wisdom): Judgment & Design Intuition<br/>CHA (Charisma): Collaboration & Communication<br/></p>
                </Collapsible>
                {/**/}
            </div> 

            <div className="summary-box">
                <div className="summary-format">
                    <h1>Summary:</h1>
                    <p className="summary-text" style={{fontSize:"28px"}}>“I am a Computer Engineering undergraduate with hands-on experience in full stack and frontend development using React, JavaScript, and Node.js. From my university and organization projects, I gained strong foundations in programming, system design, and problem solving, which I am eager to apply in real-world projects. I am looking for an opportunity to work in a collaborative environment where I can continue to grow and sharpen my technical skills while contributing to meaningful applications. My goal is to grow into a well-rounded developer who delivers efficient, user-focused solutions while learning from experienced professionals."</p>
                    <p className="summary-text" style={{marginTop:"10px"}}>Alignment: Neutral Good – always striving to improve code and collaborate fairly.</p>
                    <p className="summary-text" style={{marginTop:"10px"}}>Special Trait: “Design Adaptation” – gains +2 bonus to Implementing Designs into Code.</p>
                </div>
            </div>

            <div className="skills">
                <Stack
                    randomRotation={true}
                    sensitivity={180}
                    sendToBackOnClick={false}
                    cardDimensions={{ width: 550}}
                    cardsData={cardsData}
                />
            </div>

            <div className="portraits">
                <Stack
                    randomRotation={true}
                    sensitivity={180}
                    sendToBackOnClick={false}
                    cardDimensions={{ width: 550}}
                    cardsData={pics}
                />
            </div>
            
            <div className="saving">
                <h2 className="saving-text">Saving Throws</h2>
                <ul className="saving-text">
                    <li data-icon="🧘‍♂️">Concentration: Keeps calm during major debugging crises</li>
                    <li data-icon="⏳">Patience: Survives multi-hour compile times</li>
                    <li data-icon="🌊">Adaptability: Able to learn new tech stacks on the fly</li>
                    <li data-icon="🧹">Refactoring: Turns spaghetti code into readable work</li>
                    <li data-icon="📜">Documentation: Actually writes it </li>
                </ul>
            </div>

            <div className="dice-roll">
                <DiceRoller/>
            </div>
        </div>
    );
}

// function CharacterMobile() {
//   return (
//     <div className="bg-[rgba(255,248,220,0.9)] relative rounded-[15px] size-full" data-name="Character">
//       <div aria-hidden="true" className="absolute border-4 border-[#7a5a33] border-solid inset-0 pointer-events-none rounded-[15px] shadow-[0px_4px_4px_0px_rgba(0,0,0,0.25)]" />
//       <div className="size-full">
//         <div className="box-border font-['IM_FELL_English_SC:Regular',_sans-serif] gap-[5px] grid grid-cols-[300px] grid-rows-[32px_minmax(0px,_1fr)_36px_36px_minmax(0px,_1fr)_minmax(0px,_1fr)_minmax(0px,_1fr)] leading-[normal] not-italic px-[15px] py-[25px] relative size-full text-black">
//           <p className="[grid-area:1_/_1] self-start shrink-0 sticky text-[32px] top-0">Dominic S. Guevarra</p>
//           <p className="[grid-area:3_/_1] self-start shrink-0 sticky text-[16px] top-0">Background: Computer Engineering at Mapua University</p>
//           <p className="[grid-area:4_/_1] self-start shrink-0 sticky text-[16px] top-0">Specialization: Web Application Development</p>
//           <p className="[grid-area:2_/_1] self-start shrink-0 sticky text-[16px] top-0">{`Class & Level: Frontend Developer, Lvl 3`}</p>
//           <p className="[grid-area:7_/_1] shrink-0 sticky text-[16px] text-nowrap top-0 whitespace-pre">Land of Origin: Marikina City, Philippines</p>
//           <p className="[grid-area:5_/_1] h-[20px] shrink-0 sticky text-[16px] top-0 w-[271px]">Expected Graduation: August 2026</p>
//           <p className="[grid-area:6_/_1] self-start shrink-0 sticky text-[16px] top-0 w-[271px]">Date of Birth: 25 December, 2003</p>
//         </div>
//       </div>
//     </div>
//   );
// }

function Character() {
  return <CharacterDesktop />;
}

export default Character;