import React from "react";
import BrowserAction from "./components/BrowserAction";
import "./css/App.css";
import Navbar from "react-bootstrap/Navbar";

function App() {
  return (
    <div className="App">
      <Navbar bg="dark" expand="lg" variant="dark">
        <Navbar.Brand href="#home">Trakum</Navbar.Brand>
      </Navbar>
      <BrowserAction />
    </div>
  );
}

export default App;
