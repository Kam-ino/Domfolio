import React from "react";
import "./Character.css"
import Collapsible from "../components/Collapsible";

function CharacterDesktop() {
    const stats = [
        { file: 'Stat 1.png', label: 'STR' },
        { file: 'Stat 2.png', label: 'DEX' },
        { file: 'Stat 3.png', label: 'CON' },
        { file: 'Stat 4.png', label: 'INT' },
        { file: 'Stat 5.png', label: 'WIS' },
        { file: 'Stat 6.png', label: 'CHA' },
    ];
    
    return (
        <div className="character-sheet">
            <div className="character">
                <div className="cgrid">
                    <p className="cname">Dominic Santiago Guevarra</p>
                    <p className="ctext">Class & Level: Frontend Developer, Lvl 3</p>
                    <p className="ctext">Land of Origin: Marikina City, Philippines</p>
                    <p className="ctext">Background: Computer Engineering at Mapua University</p>
                    <p className="ctext">Specialization: Web Application Development</p>
                    <p className="ctext">Expected Graduation: August 2026</p>
                    <p className="ctext">Date of Birth: 25 December, 2003</p>
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
                    <p>“I am a Computer Engineering undergraduate with hands-on experience in full stack and frontend development using React, JavaScript, and Node.js. From my university and organization projects, I gained strong foundations in programming, system design, and problem solving, which I am eager to apply in real-world projects. I am looking for an opportunity to work in a collaborative environment where I can continue to grow and sharpen my technical skills while contributing to meaningful applications. My goal is to grow into a well-rounded developer who delivers efficient, user-focused solutions while learning from experienced professionals."</p>
                    <p style={{marginTop:"15px"}}>Alignment: Neutral Good – always striving to improve code and collaborate fairly.</p>
                    <p style={{marginTop:"15px"}}>Special Trait: “Design Adaptation” – gains +2 bonus to Implementing Designs into Code.</p>
                </div>
            </div>

            <div className="snp">
                <h1>Skills & Proficiencies:</h1>
                <h2>🧭 Core Abilities</h2>
                <ul className="snp-text">
                    <li>🎯 Responsive Web Design</li>
                    <li>🧱 Component Architecture (React Hooks, Context API)</li>
                    <li>🧮 Data Handling & RESTful API Integration</li>
                    <li>🧵 State Management (Redux, Context API)</li>
                    <li>🧠 Debugging, Troubleshooting & Optimization</li>
                    <li>🪶 UI/UX Collaboration with Designers (Figma)</li>
                    <li>🗂️ Project Management (ClickUp / Trello)</li>
                    <li>🧰 Toolchain Familiarity (Vite, Webpack, npm)</li>
                </ul>
                <h2 className="snp-text">☁️ Tool & Technical Proficiencies</h2>
                <ul className="snp-text">
                    <li>☁️ AWS Cloud Foundations</li>
                    <li>🤖 AWS Machine Learning Foundations</li>
                    <li>🗃️ SQL / NoSQL Databases</li>
                    <li>🧾 JSON / API Handling</li>
                    <li>🔧 Postman, Replit, Glitch, VS Code</li>
                </ul>
                <h2 className="snp-text">⚔️ Weapon Proficiencies</h2>
                <ul className="snp-text">
                    <li>⚙️ React.js / Next.js — Quick, elegant front-end builds</li>
                    <li>💻 JavaScript (ES6+) — Fluent in modern scripting magic</li>
                    <li>🧩 Node.js / Express — Backend and API wizardry</li>
                    <li>🎨 HTML5 / CSS3 / SCSS — Visual alchemy and layout spells</li>
                    <li>🧠 Python / C++ / C# — Logical and algorithmic dueling</li>
                    <li>🧰 Git / GitHub / CLI — Battle-ready with version control</li>
                </ul>
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