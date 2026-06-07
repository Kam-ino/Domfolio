import { motion } from "motion/react";
import "./TechStack.css";

// Tech grouped by category. `icon` is a Devicon class (loaded via CDN in
// public/index.html). Monochrome brand icons omit "colored" so they inherit
// the light default and stay visible on the dark armory background.
const STACK = [
  {
    group: "Languages",
    items: [
      { name: "JavaScript", icon: "devicon-javascript-plain colored" },
      { name: "TypeScript", icon: "devicon-typescript-plain colored" },
      { name: "Python", icon: "devicon-python-plain colored" },
      { name: "C++", icon: "devicon-cplusplus-plain colored" },
      { name: "C#", icon: "devicon-csharp-plain colored" },
      { name: "HTML5", icon: "devicon-html5-plain colored" },
      { name: "CSS3", icon: "devicon-css3-plain colored" },
    ],
  },
  {
    group: "Frontend",
    items: [
      { name: "React", icon: "devicon-react-original colored" },
      { name: "Next.js", icon: "devicon-nextjs-plain" },
      { name: "React Native", icon: "devicon-react-original colored" },
      { name: "Tailwind CSS", icon: "devicon-tailwindcss-plain colored" },
    ],
  },
  {
    group: "Backend & Data",
    items: [
      { name: "Node.js", icon: "devicon-nodejs-plain colored" },
      { name: "Express", icon: "devicon-express-original" },
      { name: "FastAPI", icon: "devicon-fastapi-plain colored" },
      { name: "PostgreSQL", icon: "devicon-postgresql-plain colored" },
      { name: "MySQL", icon: "devicon-mysql-plain colored" },
      { name: "MongoDB", icon: "devicon-mongodb-plain colored" },
      { name: "GraphQL", icon: "devicon-graphql-plain colored" },
      { name: "Supabase", icon: "devicon-supabase-plain colored" },
    ],
  },
  {
    group: "Cloud & AI",
    items: [
      { name: "AWS", icon: "devicon-amazonwebservices-plain-wordmark" },
      { name: "Google Cloud", icon: "devicon-googlecloud-plain colored" },
    ],
  },
  {
    group: "Tools",
    items: [
      { name: "Git", icon: "devicon-git-plain colored" },
      { name: "GitHub", icon: "devicon-github-original" },
      { name: "VS Code", icon: "devicon-vscode-plain colored" },
      { name: "Postman", icon: "devicon-postman-plain colored" },
      { name: "Vite", icon: "devicon-vitejs-plain colored" },
      { name: "Figma", icon: "devicon-figma-plain colored" },
      { name: "Canva", icon: "devicon-canva-original colored" },
    ],
  },
];

export default function TechStack() {
  return (
    <div className="techstack">
      {STACK.map((group) => (
        <div className="tech-group" key={group.group}>
          <h3 className="tech-group-title">{group.group}</h3>
          <div className="tech-grid">
            {group.items.map((it, i) => (
              <motion.div
                className="tech-chip"
                key={`${it.name}-${i}`}
                initial={{ opacity: 0, y: 18 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.4 }}
                transition={{ duration: 0.4, delay: i * 0.03 }}
                whileHover={{ y: -5, scale: 1.06 }}
              >
                <i className={`tech-icon ${it.icon}`} aria-hidden="true" />
                <span className="tech-name">{it.name}</span>
              </motion.div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
