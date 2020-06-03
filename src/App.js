import React from "react";
import BrowserAction from "./components/BrowserAction";
import "./App.css";
import Navbar from "react-bootstrap/Navbar";
import { GlobalProvider } from './context/GlobalState';

function App() {
  return (
    <GlobalProvider>
      <div className="App">
        <Navbar bg="dark" expand="lg" variant="dark">
          <Navbar.Brand href="#home">Trakum</Navbar.Brand>
        </Navbar>
        <BrowserAction />
      </div>
    </GlobalProvider>
  );
}

export default App;
