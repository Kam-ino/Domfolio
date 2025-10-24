import React from "react";
import "./App.css";
import Navbar from "./components/Navbar";
import Adventures from "./pages/Experience";
import Character from "./pages/Character";

export default function App() {
  let page
  // eslint-disable-next-line default-case
  switch (window.location.pathname){
    case "/about":
      page = <Character/>
      break
        case "/experience":
          page = <Adventures/>
          break
  }
  return (
    <div>
      <Navbar/>
      {page}
    </div>
  );
}
