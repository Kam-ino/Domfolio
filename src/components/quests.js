    // src/quests.js
    // All quests derived from your CV (work, education, projects, certs).
    // Difficulty: SS+, SS, S, A, B, C, D, E
    const quests = [
    // MAIN QUESTS
    {
        id: "mq1",
        title: "Forging the Centennial Clock",
        subtitle: "Lead Programmer — ARISE",
        type: "Main",
        difficulty: "A",
        timeline: "Dec 2023 – Jan 2024",
        details: [
        "Led a guild of JavaScript apprentices to craft a digital clock for Mapúa University's 100th anniversary.",
        "Maintained ARISE's GitHub repository and organized contributions.",
        "Mentored new recruits in HTML, CSS, and JavaScript fundamentals."
        ],
        reward: "Leadership +3, Teaching Proficiency +2, GitHub Mastery +1",
        images: ["AriseLogo.jpg","CCArise.jpg","CCTeam.jpg"] 
    },

    {
        id: "mq2",
        title: "Building the Next Era of Campus Tech",
        subtitle: "Full Stack Developer — ARISE",
        type: "Main",
        difficulty: "S",
        timeline: "Jun 2025 – Present",
        details: [
        "Developed a full-stack website (React frontend, Node.js backend) for user interactions.",
        "Designed responsive UI/UX prototypes in Figma.",
        "Managed code review and deployment workflows using GitHub."
        ],
        reward: "Full-Stack Skill +4, System Architecture +3, UI/UX Insight +2"
    },

    {
        id: "mq3",
        title: "The AWS Cloudfront Expedition",
        subtitle: "Frontend Developer — AWS Cloud Club (Mapúa)",
        type: "Main",
        difficulty: "A",
        timeline: "Jan 2025 – Jun 2025",
        details: [
        "Built React-based pages for the AWS Cloud Club website.",
        "Worked in a startup-like, cloud-focused environment and used ClickUp for PM.",
        "Improved cross-team collaboration between designers and backend."
        ],
        reward: "React Mastery +3, Cloud Literacy +2, Agile Adaptability +1"
    },

    {
        id: "mq4",
        title: "Travels of the Independent Coder",
        subtitle: "Freelance Programmer",
        type: "Main",
        difficulty: "B",
        timeline: "Aug 2022 – Mar 2024",
        details: [
        "Completed client projects in Python, JavaScript, C#, and SQL.",
        "Delivered apps, data analysis solutions, and database queries.",
        "Built client communication and time-management skills."
        ],
        reward: "Multiclass Proficiency +2, Adaptability +1"
    },

    {
        id: "mq5",
        title: "The Engineering Pilgrimage",
        subtitle: "B.S. Computer Engineering — Mapúa University",
        type: "Main",
        difficulty: "SS+",
        timeline: "Expected Graduation: Aug 2026",
        details: [
        "Specialized in Low-Code Web App Development.",
        "Thesis: AI-Driven E. coli Detection using YOLOv9 (unpublished).",
        "Research: LIDAR & ATmega328P overhead obstacle detection (unpublished)."
        ],
        reward: "AI Knowledge +4, Embedded Systems +2, Low-Code Mastery +2"
    },

    // SIDE QUESTS (Projects)
    {
        id: "sq1",
        title: "The Neighborhood Watch Network",
        subtitle: "React Native • FastAPI • ML",
        type: "Side",
        difficulty: "S",
        details: [
        "Mobile app that ranks post urgency via sentiment analysis (0–5).",
        "Implements a simulated police DB for testing.",
        "Combines mobile frontend with ML-based urgency scoring."
        ],
        reward: "ML Experience +3, Mobile Dev +2",
        images: ["Network.jpg"]
    },

    {
        id: "sq2",
        title: "The Simple Accountant",
        subtitle: "React • Neon DB • Expo",
        type: "Side",
        difficulty: "A",
        details: [
        "Personal finance tracker with serverless Neon DB.",
        "Adapts budgeting suggestions based on income/expense trends.",
        "React app runnable with Expo Go."
        ],
        reward: "Full-Stack Awareness +2, Data Handling +1",
        images: ["Accounting.jpg","AccountingCom.jpg"]
    },

    {
        id: "sq3",
        title: "The Financial Oracle Bot",
        subtitle: "Python • Discord API • Sentiment Analysis",
        type: "Side",
        difficulty: "S",
        details: [
        "Aggregates market data via yfinance and web scraping.",
        "Performs sentiment analysis on news to predict stock trends.",
        "Interfaces via Gemini API as a conversational bot."
        ],
        reward: "Python Proficiency +3, Automation +2",
        images: ["KMNBot.jpg","KMNBotTest.jpg"]
    },

    {
        id: "sq4",
        title: "The Enrollment Forge",
        subtitle: "Flet • Python • JSON",
        type: "Side",
        difficulty: "B",
        details: [
        "Built faculty frontend using Flet; prepared a temporary JSON DB.",
        "Coordinated future backend integration via FastAPI."
        ],
        reward: "Flet Skill +2, API Prep +1",
        images: ["Enrollment.jpg","EnrollmentCode.png"]
        
    },

    {
        id: "sq5",
        title: "Circuits of the Old Kingdom",
        subtitle: "Logic Circuit Design & Fabrication",
        type: "Side",
        difficulty: "B",
        details: [
        "Designed and fabricated logic circuits for clients.",
        "Built hardware solutions using ICs and electrical components."
        ],
        reward: "Circuit Crafting +3, Hardware Knowledge +1",
        images: ["Tronics.jpg","TronicsBuild.jpg","TronicsScreen.jpg" ]
    },

    // GUILD CONTRACTS (Certs)
    {
        id: "gc1",
        title: "AWS Cloud Series",
        subtitle: "Certifications & Intro Courses",
        type: "Guild",
        difficulty: "C",
        details: [
        "AWS Academy Cloud Foundations; AWS Educate Cloud 101",
        "Machine Learning Foundations; Intro to Generative AI"
        ],
        reward: "Cloud Literacy +2, ML Basics +1"
    },

    {
        id: "gc2",
        title: "Coursera ML Track",
        subtitle: "Applied ML + Data Visualization",
        type: "Guild",
        difficulty: "C",
        details: [
        "Applied Machine Learning in Python",
        "Applied Plotting, Charting & Data Representation"
        ],
        reward: "ML Techniques +2"
    },

    {
        id: "gc3",
        title: "Cisco Networking Series",
        subtitle: "CCNA Courses",
        type: "Guild",
        difficulty: "B",
        details: [
        "Intro to Networks; Switching/Routing/Wireless essentials",
        "Enterprise Networking, Security & Automation"
        ],
        reward: "Networking +2, Security Awareness +1"
    }
    ];

    export default quests;
