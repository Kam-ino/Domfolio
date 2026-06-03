import React from "react";
import "./App.css";
import Navbar from "./components/Navbar";
import Hero from "./components/Hero";
import Section from "./components/Section";
import Footer from "./components/Footer";
import Character from "./pages/Character";
import Adventures from "./pages/Adventures";
import MiniDnDGame from "./components/Game";

export default function App() {
  return (
    <div className="app-root">
      <Navbar />

      <main>
        <Hero />

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
          id="experience"
          tone="dark"
          eyebrow="Chapter II"
          title="The Quest Board"
          subtitle="Experience, projects, and the realms I've journeyed through."
        >
          <Adventures />
        </Section>

        <Section
          id="game"
          tone="light"
          eyebrow="Interlude"
          title="The Arena"
          subtitle="Choose your class and try to slay the dragon - a little something I built for fun."
        >
          <MiniDnDGame />
        </Section>
      </main>

      <Footer />
    </div>
  );
}
