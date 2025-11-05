import React from "react";
import "./App.css";
import Navbar from "./components/Navbar";
import Adventures from "./pages/Adventures";
import Character from "./pages/Character";
import D4 from "./components/D4";
import D6 from "./components/D6";
import D8 from "./components/D8";
import D12 from "./components/D12";
import D20 from "./components/D20";


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
      <D4/>
      <D6/>
      <D8/>
      <D12/>
      <D20/>
    </div>
  );
}
