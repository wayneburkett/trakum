import React from "react";
import BrowserAction from "./BrowserAction";
import "./App.css";
import Navbar from "react-bootstrap/Navbar";

function App() {
  return (
    <div className="App">
      <Navbar bg="light" expand="lg" variant="light">
        <Navbar.Brand href="#home">Trakum</Navbar.Brand>
      </Navbar>
      <BrowserAction />
    </div>
  );
}

export default App;
