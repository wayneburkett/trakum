import React, { useContext } from "react"
import Nav from "react-bootstrap/Nav"
import Navbar from "react-bootstrap/Navbar"
import { GlobalContext } from '../context/GlobalState'

export function Navigation() {
  const { selectedKey, selectKey } = useContext(GlobalContext)

  return (
    <Navbar bg="dark" variant="dark">
      <Navbar.Brand eventKey="home">Trakum</Navbar.Brand>
      <Nav className="mr-auto" activeKey={selectedKey} onSelect={selectKey}>
        <Nav.Link eventKey="current">Current</Nav.Link>
        <Nav.Link eventKey="all">All</Nav.Link>
        <Nav.Link eventKey="new">New</Nav.Link>
      </Nav>
    </Navbar>
  )
}
