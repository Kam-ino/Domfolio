import React from "react";
import "./Experience.css";

/**
 * Replace image paths (parchment.jpg, seal.png) with actual files in /public or import them.
 * Update the `data` object with your real info, project images, links, and dates.
 */

const data = {
  name: "Dominic Santiago Guevarra",
  title: "Frontend Developer, Lvl 3",
  origin: "Marikina City, Philippines",
  background: "Computer Engineering at Mapúa University",
  specialization: "Web Application Development",
  dob: "25 December, 2003",
  expectedGrad: "August 2026",
  summary:
    "I am a Computer Engineering undergraduate with hands-on experience in full stack and frontend development using React, JavaScript, and Node.js. From my university and organization projects, I gained strong foundations in programming, system design, and problem solving, which I am eager to apply in real-world projects. I am looking for an opportunity to work in a collaborative environment where I can continue to grow and sharpen my technical skills.",
  stats: {
    STR: 14,
    DEX: 17,
    CON: 15,
    INT: 16,
    WIS: 14,
    CHA: 13,
  },
  skills: {
    core: [
      "Responsive Web Design",
      "Component Architecture (React Hooks, Context API)",
      "RESTful API Integration",
      "State Management (Redux, Context)",
      "Debugging & Optimization",
      "UI/UX Collaboration (Figma)",
    ],
    tech: [
      "JavaScript (ES6+)",
      "React.js",
      "Node.js / Express",
      "Python",
      "C++ / C#",
      "HTML5 / CSS3 / SCSS",
      "SQL / NoSQL",
    ],
    tools: ["Git / GitHub", "ClickUp", "Postman", "Vite", "Webpack"],
    cloud: ["AWS Cloud Foundations", "Intro to Generative AI", "ML Basics"],
    soft: ["Problem Solving", "Adaptability", "Collaboration", "Documentation"],
  },
  proficiencies: [
    "Frontend Development (React)",
    "Full-stack (Node.js)",
    "Data handling & APIs",
    "Version control & CI basics",
  ],
  equipment: {
    laptop: "AMD Ryzen 7, 16GB RAM, NVIDIA GPU",
    certs: ["AWS Academy Cloud Foundations", "Applied ML in Python"],
  },
  projects: [
    {
      title: "NeighborhoodWatch App",
      subtitle: "React Native • FastAPI • ML",
      img: "/images/placeholder1.png",
      desc: "App that rates urgency using sentiment analysis.",
    },
    {
      title: "Financial Advisor Discord Bot",
      subtitle: "Python • Web scraping • Sentiment analysis",
      img: "/images/placeholder2.png",
      desc: "Aggregates market data and analyzes news sentiment.",
    },
  ],
};

function StatCircle({ label, value }) {
  return (
    <div className="stat-circle">
      <div className="stat-value">{value}</div>
      <div className="stat-label">{label}</div>
    </div>
  );
}

function Panel({ title, children }) {
  return (
    <div className="panel">
      <div className="panel-title">{title}</div>
      <div className="panel-body">{children}</div>
    </div>
  );
}

export default function Portfolio() {
  return (
    <div className="portfolio-root">
      <div className="sheet">
        {/* Header block (name + metadata) */}
        <header className="header">
          <div className="title-box">
            <h1 className="char-name">{data.name}</h1>
            <div className="meta-line">
              <span className="meta-left">{`Class & Level: ${data.title}`}</span>
              <span className="meta-right">{`Date of Birth: ${data.dob}`}</span>
            </div>
            <div className="meta-line small">
              <span>{`Background: ${data.background}`}</span>
              <span>{`Specialization: ${data.specialization}`}</span>
            </div>
          </div>
        </header>

        <div className="layout">
          {/* Left column: stats & small panels */}
          <aside className="left-column">
            <div className="portrait-slot">
              {/* Replace with your portrait image */}
              <div className="portrait-placeholder">Portrait</div>
            </div>

            <div className="stats-column">
              <StatCircle label="STR" value={data.stats.STR} />
              <StatCircle label="DEX" value={data.stats.DEX} />
              <StatCircle label="CON" value={data.stats.CON} />
              <StatCircle label="INT" value={data.stats.INT} />
              <StatCircle label="WIS" value={data.stats.WIS} />
              <StatCircle label="CHA" value={data.stats.CHA} />
            </div>

            <Panel title="Short Info">
              <p>
                <strong>Origin:</strong> {data.origin}
              </p>
              <p>
                <strong>Expected Grad:</strong> {data.expectedGrad}
              </p>
            </Panel>

            <Panel title="Equipment">
              <p>
                <strong>Laptop:</strong> {data.equipment.laptop}
              </p>
              <p>
                <strong>Certifications:</strong>
              </p>
              <ul className="small-list">
                {data.equipment.certs.map((c, i) => (
                  <li key={i}>{c}</li>
                ))}
              </ul>
            </Panel>
          </aside>

          {/* Right column: summary, skills, projects */}
          <main className="right-column">
            <Panel title="Summary">
              <p className="summary-text">{data.summary}</p>
            </Panel>

            <div className="two-panels">
              <Panel title="Skills & Proficiencies">
                <div className="skill-grid">
                  <div>
                    <h5 className="small-heading">Core Abilities</h5>
                    <ul>
                      {data.skills.core.map((s, i) => (
                        <li key={i}>{s}</li>
                      ))}
                    </ul>
                  </div>

                  <div>
                    <h5 className="small-heading">Technical</h5>
                    <ul>
                      {data.skills.tech.map((s, i) => (
                        <li key={i}>{s}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              </Panel>

              <Panel title="Other Proficiencies & Languages">
                <h5 className="small-heading">Tools & Cloud</h5>
                <ul>
                  {data.skills.tools.map((s, i) => (
                    <li key={i}>{s}</li>
                  ))}
                </ul>
                <h5 className="small-heading">Soft Skills</h5>
                <ul>
                  {data.skills.soft.map((s, i) => (
                    <li key={i}>{s}</li>
                  ))}
                </ul>
              </Panel>
            </div>

            <Panel title="Projects & Quests">
              <div className="projects">
                {data.projects.map((p, i) => (
                  <div key={i} className="project-row">
                    <div className="project-thumb">
                      <img
                        src={p.img}
                        alt={p.title}
                        onError={(e) => {
                          e.currentTarget.src = "/images/placeholder-square.png";
                        }}
                      />
                    </div>
                    <div className="project-info">
                      <h4>{p.title}</h4>
                      <small className="muted">{p.subtitle}</small>
                      <p>{p.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </Panel>

            <Panel title="Saving Throws">
              <ul>
                <li>Concentration: Keeps calm during major debugging sessions</li>
                <li>Patience: Handles long deploy cycles</li>
                <li>Adaptability: Learns new stacks quickly</li>
              </ul>
            </Panel>
          </main>
        </div>

        {/* Footer with small stat block */}
        <footer className="footer-block">
          <div className="stat-summary">
            <strong>Stats:</strong>{" "}
            {`STR ${data.stats.STR} | DEX ${data.stats.DEX} | CON ${data.stats.CON} | INT ${data.stats.INT} | WIS ${data.stats.WIS} | CHA ${data.stats.CHA}`}
          </div>
        </footer>
      </div>
    </div>
  );
}
