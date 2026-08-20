    // Each quest may optionally declare real links that surface as buttons in
    // the modal (QuestModal.js). Add either/both to any entry - they only
    // render when present, so proprietary client work can safely omit them:
    //   liveUrl: "https://your-live-demo.com",   // → "Visit the Realm"
    //   repoUrl: "https://github.com/Kam-ino/...", // → "Read the Source"
    const quests = [

    // ====================================================================
    // MAIN QUESTS (Work Experience)
    // ====================================================================
    {
        id: "mq1",
        title: "Forging the Centennial Clock",
        subtitle: "Lead Programmer - ARISE",
        type: "Main",
        difficulty: "C",
        timeline: "Dec 2023 – Jan 2024",
        details: [
        "Led a guild of JavaScript apprentices to craft a digital clock for Mapúa University's 100th anniversary.",
        "Maintained ARISE's GitHub repository and organized contributions.",
        "Mentored new recruits in HTML, CSS, and JavaScript fundamentals."
        ],
        reward: "Leadership +3, Teaching Proficiency +2, GitHub Mastery +1",
        images: ["AriseLogo.webp","CCArise.webp","CCTeam.webp"]
    },

    {
        id: "mq2",
        title: "Full-Stack Developer of Many Tools",
        subtitle: "'Full-Fledged' Full-Time Full-Stack Developer",
        type: "Main",
        difficulty: "SS+",
        timeline: "Oct 2025 – Present",
        details: [
            "Developed the Invoice Checker App to validate client invoices and streamline internal workflows.",
            "Engineered an automated Aftersales Service Email System, drastically reducing manual response time.",
            "Performed prompt engineering to generate realistic AI-powered video advertisements.",
            "Currently automating the end-to-end process of Ad Video Generation.",
            "Building an Advertisement Translation App for multilingual campaign support.",
            "Developing a Shopify Bundle App to enhance e-commerce performance and user experience.",
            "Apps Built: Invoice Checker, Recast, AdFactory, EmailMaker, Forklane"
        ],
        reward: "Intelligence +4, Dexterity +3, Automation Mastery +2, API Integration +1, Shopify Engineering +1",
        images: [ "Forklane.webp","Wautomation.webp","Wmodel.webp","Winvoice.webp", "LocAdsWIP.webp", "AdFactory1.webp", "AdFactory2.webp", "AdFactory3.webp", "LocAdsProcessing.webp", "EmailMaker.webp", "Recast.webp",  ]
    },

    {
        id: "mq3",
        title: "The AWS Cloudfront Expedition",
        subtitle: "Frontend Developer - AWS Cloud Club (Mapúa)",
        type: "Main",
        difficulty: "A",
        timeline: "Jan 2025 – Jun 2025",
        details: [
        "Built React-based pages for the AWS Cloud Club website.",
        "Worked in a startup-like, cloud-focused environment and used ClickUp for PM.",
        "Improved cross-team collaboration between designers and backend."
        ],
        reward: "React Mastery +3, Cloud Literacy +2, Agile Adaptability +1",
        images: [ "AWSCCLP.webp","AWSCCTeam.webp","AWSCCTeamPage.webp" ]
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
        reward: "Multiclass Proficiency +2, Adaptability +1",
        images: []
    },
    {
        id: "mq5",
        title: "E-commerce UI/UX",
        subtitle: "Shopify Theme Developer",
        type: ["Main","Forge"],
        difficulty: "B",
        timeline: "June 2026 – August 2026",
        details: [
            "Designed and built a custom Shopify theme end-to-end, shaping the storefront's entire look, feel, and shopping flow.",
            "Crafted responsive Liquid sections and Online Store 2.0 JSON templates, so the merchant can rearrange the whole bazaar from the theme editor. No code required.",
            "Reworked the product, collection, and cart journeys mobile-first: clearer hierarchy, stronger calls-to-action, and accessible components.",
            "Kept the theme lean and swift. Optimized media, and minimal JavaScript to protect page speed and checkout conversion.",
            "Delivered a merchant-friendly settings schema (colors, typography, section toggles) so the shop's look stays editable long after handoff.",
        ],
        reward: "UI/UX Design +3, E-commerce Shop +2",
        images: ["ShopifyTheme.webp","ShopifyTheme2.webp","ShopifyTheme3.webp","ShopifyTheme4.webp","ShopifyTheme5.webp","ShopifyTheme6.webp","ShopifyTheme7.webp"]

    },

    // ====================================================================
    // SIDE QUESTS (Other Roles & Experience)
    // ====================================================================
    {
        id: "sq1",
        title: "The Simple Accountant",
        subtitle: "React • Neon DB • Expo",
        type: ["Side","Forge"],
        difficulty: "A",
        details: [
        "Personal finance tracker with serverless Neon DB.",
        "Adapts budgeting suggestions based on income/expense trends.",
        "React app runnable with Expo Go."
        ],
        reward: "Full-Stack Awareness +2, Data Handling +1",
        images: ["Accounting.webp","AccountingCom.webp"]
    },

    {
        id: "sq2",
        title: "The Financial Oracle Bot",
        subtitle: "Python • Discord API • Sentiment Analysis",
        type: ["Side", "Forge"],
        difficulty: "S",
        details: [
        "Aggregates market data via yfinance and web scraping.",
        "Performs sentiment analysis on news to predict stock trends.",
        "Interfaces via Gemini API as a conversational bot."
        ],
        reward: "Python Proficiency +3, Automation +2",
        images: ["KMNBot.webp","KMNBotTest.webp"]
    },

    {
        id: "sq3",
        title: "Voice of the Customer",
        subtitle: "Aftersales Call Center Agent - Pre-Dev Era",
        type: "Side",
        difficulty: "D",
        timeline: "Sept 2025 - Nov 2025",
        details: [
            "Handled high-volume inbound and outbound customer service calls, resolving concerns with professionalism and empathy.",
            "Utilized negotiation and upselling techniques to meet and exceed service or sales targets.",
            "Collaborated closely with team members and supervisors to maintain queue performance and call quality standards.",
            "Demonstrated strong problem-solving and conflict resolution skills in high-pressure call environments.",
        ],
        reward: "Charisma +3, Patience +4, Negotiation +2, Teamwork +2, Calm Under Pressure +3",
        images: [ ]
    },

    {
        id: "sq5",
        title: "The Many-Tongued Banner",
        subtitle: "Ads Translation Specialist",
        type: "Side",
        difficulty: "C",
        timeline: "Oct 2025 – Nov 2025",
        details: [
            "Translated ad graphics from English into five languages: Polish, Czech, Spanish, German, and Finnish.",
            "Ensured cultural accuracy and language appropriateness for each target region while preserving brand tone and message clarity.",
            "Coordinated with the design team to recreate visual assets in Canva, maintaining layout integrity, readability, and visual appeal across all versions.",
            "Adapted phrasing to improve engagement and marketing effectiveness for each language group.",
            "Delivered consistent, multi-language ad sets within fast turnaround times."
        ],
        reward: "Linguistics +3, Cultural Insight +2, Precision +2, Marketing Adaptation +1",
        images: [ ]
    },

    {
        id: "sq6",
        title: "Forging the SEA Beacon",
        subtitle: "Triple AI/ML Integration",
        type: ["Side","Forge"],
        difficulty: "S",
        timeline: "April 2026 – July 2026",
        details: [
            "PLACED TOP 2 OUT OF 40. Moving on to Semi-Finals",
            "Created a Startup level Application with a team of aspiring AI and ML Engineers for ASEAN AI Hackathon 2026",
            "Pitched an AI-driven Disaster Alert System based on Flood Threshold Data, Typhoon Trajectory Prediction, and Sentiment Analysis of News & Social Media Posts",
            "Custom alert messages powered by Google Gemini and localized to Thai, Vietnamese, and Filipino through Google Cloud Platform",
            "Ended the journey in the Semi-finals"
        ],
        reward: "AI Integration +6, Cloud Computing +2, Full Stack Development +5, Charisma(Marketing) +3",
        images: [ "SEABeaconTop40.webp","SEABeaconDemo.webp","SEABeaconMeeting.webp", "SEABeaconLogo.webp", "certificate_Dominic_Santiago_Guevarra.webp", "SEABeaconTeam.webp" ]
    },
    {
        id: "sq7",
        title: "Unprompted",
        subtitle: "Open AI Buildathon",
        type: ["Side","Forge"],
        difficulty: "B",
        timeline: "July 18, 2026",
        details: [
            "Built an AI-powered reverse-prompt game where players reconstruct the hidden prompts behind generated images.",
            "Implemented real-time multiplayer matchmaking, synchronized 60-second duels, and a seamless solo fallback using Socket.IO.",
            "Integrated OpenAI-powered judging with explainable scores for subject, setting, mood, style, and visual details.",
            "Created Prompt Lab, a guided learning mode that generates images from player prompts and provides targeted coaching.",
            "Deployed a full-stack Turborepo architecture using Next.js, Fastify, PostgreSQL, Prisma, Cloudflare R2, Docker, and Caddy.",
        ],
        reward: "AI Integration +6, Cloudflare +2, Full Stack Development +1, OpenAI Codex +3",
        images: [ "unprompted (1).webp","unprompted (2).webp","unprompted (3).webp","unprompted (4).webp","unprompted (5).webp","unprompted (6).webp", ]
    },

    // ====================================================================
    // GUILD CONTRACTS (Education & Certifications)
    // ====================================================================
    {
        id: "gq1",
        title: "The Neighborhood Watch Network",
        subtitle: "React Native • FastAPI • ML",
        type: ["Guild","Forge"],
        difficulty: "S",
        details: [
        "Mobile app that ranks post urgency via sentiment analysis (0–5).",
        "Implements a simulated police DB for testing.",
        "Combines mobile frontend with ML-based urgency scoring."
        ],
        reward: "ML Experience +3, Mobile Dev +2",
        images: ["Network.webp"]
    },

    {
        id: "gq2",
        title: "The Enrollment Forge",
        subtitle: "Flet • Python • JSON",
        type: ["Guild","Forge"],
        difficulty: "B",
        details: [
        "Built faculty frontend using Flet; prepared a temporary JSON DB.",
        "Coordinated future backend integration via FastAPI."
        ],
        reward: "Flet Skill +2, API Prep +1",
        images: ["Enrollment.webp","EnrollmentCode.webp"]

    },

    {
        id: "gq3",
        title: "AWS Cloud Series",
        subtitle: "Certifications & Intro Courses",
        type: "Guild",
        difficulty: "A",
        details: [
        "AWS Academy Cloud Foundations",
        "AWS Educate Cloud 101",
        "Machine Learning Foundations",
        "Intro to Generative AI"
        ],
        reward: "Cloud Literacy +2, ML Basics +1",
        images: [ "AWSCF.webp","AWSCC101.webp","AWSMLF.webp","AWSIGAI.webp" ]
    },

    {
        id: "gq4",
        title: "Coursera ML Track",
        subtitle: "Applied ML + Data Visualization",
        type: "Guild",
        difficulty: "C",
        details: [
        "Applied Machine Learning in Python",
        "Applied Plotting, Charting & Data Representation"
        ],
        reward: "ML Techniques +2",
        images: ["COURSEMatrix.webp","COURSEML.webp","COURSEDataRep.webp","COURSEGenAI.webp" ]
    },

    {
        id: "gq5",
        title: "Cisco Networking Series",
        subtitle: "CCNA Courses",
        type: "Guild",
        difficulty: "B",
        details: [
        "Intro to Networks; Switching/Routing/Wireless essentials",
        "Enterprise Networking, Security & Automation"
        ],
        reward: "Networking +2, Security Awareness +1",
        images: ["CISCOIntro.webp","CISCOEnterprise.webp","CISCOSwitching.webp","CISCOCyberSec.webp" ]
    },

    {
        id: "gq6",
        title: "Circuits of the Old Kingdom",
        subtitle: "Logic Circuit Design & Fabrication",
        type: "Guild",
        difficulty: "B",
        details: [
        "Designed and fabricated logic circuits for clients.",
        "Built hardware solutions using ICs and electrical components."
        ],
        reward: "Circuit Crafting +3, Hardware Knowledge +1",
        images: ["Tronics.webp","TronicsBuild.webp","TronicsScreen.webp", "Design2.webp", "Design3.webp" ]
    },

    {
        id: "gq7",
        title: "The Engineering Pilgrimage",
        subtitle: "B.S. Computer Engineering - Mapúa University",
        type: ["Guild","Main"],
        difficulty: "SS",
        timeline: "2021 - Present",
        details: [
        "Specialized in Low-Code Web App Development.",
        "Thesis: AI-Driven E. coli Detection using YOLOv9 (unpublished).",
        "Research: LIDAR & ATmega328P overhead obstacle detection (unpublished)."
        ],
        reward: "AI Knowledge +4, Embedded Systems +2, Low-Code Mastery +2",
        images: ["Thesis1.webp","Thesis2.webp","Thesis3.webp", 
            "ThesisCase.webp", "Design2.webp", "Thesis4.webp", 
            "Design1.webp","Enrollment.webp","EnrollmentCode.webp",
            "Network.webp",
            ]
    },

    {
        id: "gq8",
        title: "HackerRank Role Certifications",
        subtitle: "",
        type: ["Guild","Main"],
        difficulty: "A",
        timeline: "August 2026",
        details: [
            "Software Engineer Role",
            "Frontend Developer (React) Role",
        ],
        reward: "",
        images: ["HackerrankSWEcert.webp","HackerrankFDRcert.webp"]
    },
    

    // ====================================================================
    // FORGE (Projects)
    // ====================================================================
    {
        id: "fp1",
        title: "Transmutation of Runic Paintings",
        subtitle: "Full-Stack Developer (LocAds)",
        type: "Forge",
        difficulty: "A",
        timeline: "April 2026 - May 2026",
        details: [
        "Built a web app that translates English advertising creatives into 7 European languages: DE, ES, FR, PL, PT, CS, and EL.",
        "Preserved original layouts, fonts, colors, and photographic backgrounds pixel-for-pixel during localization.",
        "Developed a Next.js + FastAPI pipeline using Google Cloud Vision for OCR, Gemini 2.5 Flash for advertising-quality translation, and FLUX.1-Fill / Imagen 3 / LaMa for generative inpainting.",
        "Implemented adaptive typography matching across 13 font categories with variable-font weight detection so localized copy visually matched the original brand style.",
        "Added locale-aware formatting and brand-glossary protection to keep translated creatives accurate, consistent, and production-ready."
        ],
        reward: "AI Knowledge +2, Full-Stack Development +3, Localization +3, AI Imaging +2, GCP Mastery +2",
        images: ["LocAdsWIP.webp", "LocAdsProcessing.webp",]
    },

    {
        id: "fp2",
        title: "Self Writing Book of Creative Scripts",
        subtitle: "Full-Stack Developer (AdFactory)",
        type: "Forge",
        difficulty: "A",
        timeline: "April 2026 - June 2026",
        details: [
        "Built AdFactory, a static-ad generation system for e-commerce focused on producing fewer, higher-quality creatives instead of large batches of weak outputs.",
        "Designed two strategic generation lanes: Iterate for exploiting known winners and Big Swing for exploring new creative concepts.",
        "Implemented Kill Criteria to define when iteration should stop instead of endlessly generating more variants.",
        "Added a 10-gate compliance check on every prompt before image generation to reduce wasted credits on policy-violating outputs.",
        "Generates 25 production-ready Nano Banana prompts per run, gated by required avatar research that the system refuses to skip.",
        ],
        reward: "Digital Marketing +4, Web Scraping +2, Prompt Engineering +2, Creative Strategy +3",
        images: ["AdFactory1.webp","AdFactory2.webp","AdFactory3.webp"]
    },

    {
        id: "fp3",
        title: "Forge of the Self-Sending Scrolls",
        subtitle: "Full-Stack Developer (EmailMaker)",
        type: "Forge",
        difficulty: "B",
        timeline: "June 2026 - August 2026",
        details: [
            "Built a full React + TypeScript web app that turns brand reference images into ready-to-send, Klaviyo-compatible email flows.",
            "Used Google Cloud Vision to detect a reference layout's colors and sections, then auto-generated a library of styled, reusable email modules (hero, product, comparison, testimonial, USP banners, footer, and more).",
            "Designed a drag-and-drop canvas with inline editing inspired by level-creation games like Super Mario Maker, Dungeon Maker, and Fallout Shelter for composing emails module by module.",
            "Integrated Google's Nano Banana (Gemini) image model to swap in AI-generated imagery, and supported Klaviyo dynamic tags like {{ first_name }}.",
            "Exported clean, table-based, inline-styled HTML that drops straight into Klaviyo, with a flow panel managing multi-email sequences (e.g. a 6-step welcome series with send timing).",
            "Added a brand kit that instantly regenerates the entire series for any brand, discount code, and accent color.",

        ],
        reward: "Full-Stack Development +4, AI Imaging +2, Computer Vision +2, UX Design +2, Email Sorcery +2",
        images: ["EmailMaker.webp"]
    },
    {
        id: "fp4",
        title: "Palentra, Maker of Kings",
        subtitle: "Brand Identity Creator",
        type: "Forge",
        difficulty: "S",
        timeline: "July 13 2026 – 15 July 2026",
        details: [
            "Joined another Hackathon after Semi-finals of ASEAN AI Hackathon",
            "First exposure to Codex by OpenAI before building for OpenAI Build Week Community Buildathon - Manila",
        ],
        reward: "Full Stack Development +1, Codex-assisted Coding +3, Claude Design Frontend +2",
        images: [ "Palentra.webp","Palentra (1).webp","Palentra (2).webp","Palentra (3).webp","Palentra (4).webp","Palentra (5).webp","Palentra (6).webp","Palentra (7).webp","Palentra (8).webp","Palentra (9).webp" ]
    },
    {
        id: "fp5",
        title: "Forklane",
        subtitle: "Shopify Split Testing Software",
        type: "Forge",
        difficulty: "A",
        timeline: "July 2026 – Present",
        details: [
            "Built a full-stack experimentation platform for running controlled A/B tests across Shopify cart and checkout experiences.",
            "Developed deterministic weighted assignment that keeps each shopper in the same control or treatment variant throughout their journey.",
            "Integrated Shopify OAuth, Checkout UI and Web Pixel extensions, a storefront loader, and public configuration and event-ingestion APIs.",
            "Created configurable treatment components including testimonials, sale countdowns, guarantees, branded headers, image columns, and trust grids.",
            "Implemented Supabase-backed tracking for exposures, checkout starts, completions, and verified Shopify order revenue with event deduplication.",
            "Designed an analytics dashboard for monitoring conversion rate, relative lift, confidence, revenue, experiment trends, and tracking-pipeline health."
        ],
        reward: "Full Stack Development +4, Shopify Backend Development +5, Claude Design Frontend +5",
        images: [ "Forklane Branding.webp","Forklane.webp"]
    },
    {
        id: "fp6",
        title: "Recast",
        subtitle: "In-Browser Image Format Converter",
        type: "Forge",
        difficulty: "C",
        timeline: "April 2026",
        details: [
            "Built a fully client-side React app that batch-converts images between PNG, JPEG, and WebP, encoding entirely in the browser with the HTML Canvas API. No server, no upload.",
            "Added HEIC/HEIF decoding via heic2any so iPhone photos convert cleanly, with quality control for lossy formats and a background-fill option when flattening transparency.",
            "Implemented ZIP support with JSZip: uploaded archives are unpacked into their images automatically, and every converted result can be downloaded as a single ZIP with collision-safe filenames.",
            "Redesigned the interface into a premium dark identity with drag-and-drop upload, before-to-after previews, live size-savings, and a full token-based design system.",
            "Kept the whole pipeline private by design, since files never leave the browser, requiring no account and no backend."
        ],
        reward: "Frontend Development +3, Browser Image Processing +3, UX Design +2, Claude Design Frontend +2",
        images: [ "Recast.webp"]
    },
    {
        id: "fp7",
        title: "ToolHub",
        subtitle: "Internal Operator Tool Hub",
        type: "Forge",
        difficulty: "C",
        timeline: "July 2026",
        details: [
            "Built a single hub for internal operator tools, launching with a ROAS Calculator ported from a battle-worn Excel workbook into a proper web app.",
            "Developed a React 19 + Vite TypeScript frontend over a FastAPI backend, with a Supabase-powered tool registry as the source of truth.",
            "Wired a private Google Sheet as the live source for product presets, so operators pick a product and every field prefills straight from the sheet.",
            "Implemented fully keyless Google auth: service-account impersonation via ADC locally and Workload Identity Federation on Vercel - no key files anywhere.",
            "Added multi-currency support with a cached FX API, and an explicit 'Set as active offer' flow so calculations never silently overwrite records.",
        ],
        reward: "Full-Stack Development +2, GCP Mastery +2, Spreadsheet Taming +2, Cloud Security +1",
        images: ["ToolHub.webp"]
    },
    {
        id: "fp8",
        title: "Teardown",
        subtitle: "AI Creative-Intelligence Workspace",
        type: "Forge",
        difficulty: "A",
        timeline: "July 2026 - Present",
        details: [
            "Built a private creative-intelligence workspace that accepts an image or video ad and runs a 14-part winning-ad deconstruction through Gemini on Vertex AI.",
            "Engineered the full pipeline: FastAPI ingestion → GCS asset store → Cloud Tasks → Gemini 2.5 Pro → deterministic workbook parser → Google Sheets projection, with every job tracked in Supabase.",
            "Validated all media by file signature and hardened URL ingestion with redirect-by-redirect public-host checks to limit SSRF and memory risk.",
            "Shipped a complete simulation mode - fixture responses, local persistence, idempotent CSV projection - so the whole workflow runs without any live cloud credentials.",
            "Held the line on quality gates: 90% backend test coverage with ruff + mypy, and 80% frontend coverage.",
        ],
        reward: "AI Integration +4, Cloud Architecture +3, Pipeline Engineering +3, Test Discipline +2",
        images: ["Teardown.webp"]
    },
    {
        id: "fp9",
        title: "CelluCall",
        subtitle: "Shopify Call-List Sync Engine",
        type: "Forge",
        difficulty: "B",
        timeline: "August 2026 - Present",
        details: [
            "Built a sync engine that pulls abandoned checkouts and recently delivered orders from multiple Shopify stores into Supabase, then mirrors them into a call-center lead sheet in Google Sheets.",
            "Handled multi-store sync across UK, USA, and Canada with per-store credentials, namespaced record ids, and per-store failure isolation so one store's outage never sinks the rest.",
            "Root-caused a nasty Shopify Admin GraphQL landmine: unquoted date filters silently drop the upper bound, doubling counts - fixed with quoted ISO-UTC windows and verified with 4-way parallel syncs.",
            "Respected a strict sheet contract: the app writes only its own columns and never touches the manager's call-tracking columns, with dedup by order number and raw appends so phone numbers survive intact.",
            "Deployed with a React + Vite dashboard, keyless Google auth, and configurable delivery-window knobs for the client.",
        ],
        reward: "Shopify API Mastery +4, Data Sync Engineering +3, Debugging Tenacity +3, Client Contracts +2",
        images: ["CelluCall.webp"]
    },
    ];

    export default quests;
