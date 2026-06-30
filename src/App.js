import React, { Suspense, lazy } from "react";
import "./App.css";
import Navbar from "./components/Navbar";
import Hero from "./components/Hero";
import Highlights from "./components/Highlights";
import Section from "./components/Section";
import Footer from "./components/Footer";
import Character from "./pages/Character";
import Resume from "./components/Resume";
import Adventures from "./pages/Adventures";
import TechStack from "./components/TechStack";
import Services from "./components/Services";
import Testimonials from "./components/Testimonials";
import Contact from "./components/Contact";

// Code-split the Arena: it pulls in three.js / react-three-fiber for the 3D
// dice, which is the heaviest part of the bundle. Loading it as a separate
// chunk keeps the initial JS small so the rest of the page paints faster.
const MiniDnDGame = lazy(() => import("./components/Game"));

export default function App() {
  return (
    <div className="app-root">
      <Navbar />

      <main>
        <Hero />

        <Highlights />

        <Section
          id="about"
          tone="light"
          eyebrow="Chapter I"
          title="My Character"
          subtitle="Stats, skills, and the story so far."
        >
          <Character />
        </Section>

        <Section
          id="resume"
          tone="light"
          eyebrow="The Royal Record"
          title="The Chronicle"
          subtitle="Deeds, training, and titles — the formal résumé, in scroll form."
        >
          <Resume />
        </Section>

        <Section
          id="stack"
          tone="dark"
          eyebrow="The Armory"
          title="Arsenal"
          subtitle="The languages, frameworks, and tools I wield."
        >
          <TechStack />
        </Section>

        <Section
          id="experience"
          tone="dark"
          eyebrow="Chapter II"
          title="The Quest Board"
          subtitle="Experience, projects, and the realms I've journeyed through."
        >
          <Adventures />
        </Section>

        <Section
          id="services"
          tone="light"
          eyebrow="The Artificer's Offerings"
          title="Commissions"
          subtitle="What I can forge for you — and the proof it works."
        >
          <Services />
        </Section>

        <Section
          id="testimonials"
          tone="dark"
          eyebrow="Words from the Realm"
          title="Tales of My Patrons"
          subtitle="What those I've quested alongside have to say. (Translated for convenience)"
        >
          <Testimonials />
        </Section>

        <Section
          id="game"
          tone="light"
          eyebrow="Interlude"
          title="The Arena"
          subtitle="Choose your class and try to slay the dragon - a little something I built for fun."
        >
          <Suspense fallback={<div style={{ minHeight: "60vh" }} />}>
            <MiniDnDGame />
          </Suspense>
        </Section>

        <Section
          id="contact"
          tone="dark"
          eyebrow="The Rookery"
          title="Send a Raven"
          subtitle="Have a quest for me, a role to fill, or just want to roll some dice? Let's talk."
          keepMounted
        >
          <Contact />
        </Section>
      </main>

      <Footer />
    </div>
  );
}
