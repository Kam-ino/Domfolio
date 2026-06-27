import React from "react";
import "./Adventures.css";
import QuestBoard from "../components/QuestBoard";

// The Adventures section is the scattered "quest board" of experience,
// projects, education and certifications. All of that content lives in
// src/components/quests.js and is rendered/laid out by <QuestBoard />.
export default function Adventures() {
  return <QuestBoard />;
}
