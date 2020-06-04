import React from "react";
import "./css/App.css";
import { BrowserAction } from "./components/BrowserAction";
import { Navigation } from './components/Navigation'

function App() {
  return (
    <div className="App">
      <Navigation />
      <BrowserAction />
    </div>
  );
}

export default App;
