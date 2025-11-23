import React, { useState } from "react";
import "./Adventures.css";

const regions = [
  {
    name: "⚙️ Dominion of Reactoria",
    subtitle: "Front-End Kingdom",
    description:
      "A radiant empire of elegant design and modular architecture. Its artisans turn mockups into living, breathing interfaces powered by ancient React crystals.",
  },
  {
    name: "🔥 Infernal Forge of Nodeheim",
    subtitle: "Backend Realm",
    description:
      "Glowing caverns where Forgemasters build and maintain the world’s infrastructure. Echoes of compiled logic and API invocations fill the halls.",
  },
  {
    name: "📜 Scripted Isles of Syntaxia",
    subtitle: "Languages Archipelago",
    description:
      "Scattered islands of Elvish JavaScript, Dwarvish Python, and Ancient C++. Home to the Polyglot Sages who decipher the runes of code itself.",
  },
  {
    name: "☁️ Celestial Plane of Cloudspire",
    subtitle: "Cloud Realm",
    description:
      "A skybound world of endless data and scalability. Only those who master AWS and Azure may safely traverse its infinite mists.",
  },
  {
    name: "🧠 College of Computa",
    subtitle: "Academy of Knowledge",
    description:
      "Atop Mount Algorithm, the College trains all future code mages in the arts of data structures, debugging, and computational sorcery.",
  },
  {
    name: "🕯️ Guild of Collaboration",
    subtitle: "Human Network",
    description:
      "A hub-city beneath the Sacred Git Trees. Developers meet here to merge ideas, resolve conflicts, and push new builds to creation.",
  },
  {
    name: "🏛️ Ancient Core",
    subtitle: "Legacy Lands",
    description:
      "Dusty plains powered by primal code — C, C++, and C#. The old gods of computation still dwell here, maintaining the foundation of all frameworks.",
  },
];

export default function WorldMap() {
  const [activeRegion, setActiveRegion] = useState(null);

  return (
    <div className="world-map">
      <h1 className="map-title">🌍 Realm of Logicodea</h1>
      <p className="map-intro">
        A world forged from logic, creativity, and caffeine.  
        Click or hover over a region to reveal its lore.
      </p>

      <div className="map-scroll">
        {regions.map((region, index) => (
          <div
            key={index}
            className={`region-card ${
              activeRegion === index ? "active" : ""
            }`}
            onMouseEnter={() => setActiveRegion(index)}
            onMouseLeave={() => setActiveRegion(null)}
            onClick={() =>
              setActiveRegion(activeRegion === index ? null : index)
            }
          >
            <h2>{region.name}</h2>
            <h3>{region.subtitle}</h3>
            <p className="region-description">{region.description}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
