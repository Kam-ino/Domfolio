import React, { useState } from "react";
import "./Adventures.css";
import QuestBoard from "../components/QuestBoard";

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
      "Dusty plains powered by primal code - C, C++, and C#. The old gods of computation still dwell here, maintaining the foundation of all frameworks.",
  },
];

export default function WorldMap() {
  const [activeRegion, setActiveRegion] = useState(null);

  return (
    <div>
      <QuestBoard/>
    </div>
  );
}
