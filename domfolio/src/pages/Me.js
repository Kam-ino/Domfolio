const profileData = {
      name: "Dominic Santiago Guevarra",
      title: "Frontend Developer",
      school: "Mapua",
      location: "Marikina, Philippines",
      contact: {
        email: "dominicguevarra08@gmail.com",
        phone: "+63 994 637 8582",
        github: "https://github.com/Kam-ino",
      },
      summary:
        "I am a Computer Engineering undergraduate with hands-on experience in full stack and frontend development using React, JavaScript, and Node.js. From my university and organization projects, I gained strong foundations in programming, system design, and problem solving, which I am eager to apply in real-world projects. I am looking for an opportunity to work in a collaborative environment where I can continue to grow and sharpen my technical skills while contributing to meaningful applications. My goal is to grow into a well-rounded developer who delivers efficient, user-focused solutions while learning from experienced professionals.",
      skills: [
        "React",
        "JavaScript (ES6+)",
        "HTML5 & CSS3",
        "Node.js",
        "Python",
        "Git / GitHub",
        "Figma",
      ],
      experience: [
        {
          role: "Full Stack Developer – ARISE",
          date: "Jun 2025 – Present",
          bullets: [
            "Developed a full-stack website using Angular and Node.js.",
            "Created responsive UI and managed GitHub collaboration.",
          ],
        },
        {
          role: "Frontend Developer – AWS Cloud Club",
          date: "Jan 2025 – Jun 2025",
          bullets: [
            "Built component-based React pages for AWS Cloud Club Mapúa website.",
            "Collaborated with cross-functional teams via ClickUp.",
          ],
        },
        {
          role: "Lead Programmer – Commissioned Project",
          date: "Dec 2023 – Jan 2024",
          bullets: [
            "Led development of a digital clock for Mapúa University’s Centennial.",
            "Supervised code reviews and taught modern HTML/CSS practices.",
          ],
        },
      ],
      projects: [
        {
          title: "NeighborhoodWatch App",
          subtitle: "React Native • FastAPI • ML (Sentiment Analysis)",
          img: "PLACEHOLDER_PROJECT_IMAGE_1",
          desc: "Mobile app that rates neighborhood safety using ML-powered sentiment analysis.",
        },
        {
          title: "Financial Advisor Discord Bot",
          subtitle: "Python • Web scraping • sentiment analysis",
          img: "PLACEHOLDER_PROJECT_IMAGE_2",
          desc: "A Discord bot that aggregates financial data and user sentiment for stock advice.",
        },
      ],
    };

export default function Me() {
    return(
        <div className="sheet">
        <header className="header-banner">
          <h1>{profileData.name}</h1>
          <h2>Class & Level: {profileData.title}, Lvl 5</h2>
          <p className="location"> Land of Origin:📍{profileData.location}</p>
          <p className="location">Race: Mapuan</p>
        </header>

        <div className="stat-section">
          <div className="stat-circle">INT</div>
          <div className="stat-circle">WIS</div>
          <div className="stat-circle">DEX</div>
          <div className="stat-circle">CON</div>
          <div className="stat-circle">CHA</div>
        </div>

        <section className="panel">
          <h3 className="heading">Summary</h3>
          <p>{profileData.summary}</p>
        </section>

        <section className="panel">
          <h3 className="heading">Skills & Proficiencies</h3>
          <div className="skills">
            {profileData.skills.map((s) => (
              <span key={s} className="skill-tag">
                {s}
              </span>
            ))}
          </div>
        </section>

        <section className="panel">
          <h3 className="heading">Experience</h3>
          {profileData.experience.map((exp, idx) => (
            <div key={idx} className="exp-card">
              <h4>{exp.role}</h4>
              <p className="date">{exp.date}</p>
              <ul>
                {exp.bullets.map((b, i) => (
                  <li key={i}>{b}</li>
                ))}
              </ul>
            </div>
          ))}
        </section>

        <section className="panel">
          <h3 className="heading">Projects & Quests</h3>
          <div className="projects">
            {profileData.projects.map((p, idx) => (
              <div key={idx} className="project-card">
                <div className="project-image">📜 Image Placeholder</div>
                <h4>{p.title}</h4>
                <small>{p.subtitle}</small>
                <p>{p.desc}</p>
              </div>
            ))}
          </div>
        </section>

        <footer className="footer-note">
          <p>
            Contact: {profileData.contact.email} |{" "}
            <a href={profileData.contact.github} target="_blank" rel="noreferrer">
              GitHub
            </a>{" "}
            | {profileData.contact.phone}
          </p>
        </footer>
      </div>

    )
}