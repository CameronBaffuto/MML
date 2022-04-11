import React from 'react';
import Home from './Components/Home';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'ui-neumorphism/dist/index.css';
import Navbar from 'react-bootstrap/Navbar';
import Container from 'react-bootstrap/Container';
import './App.css';
import { FaPills } from "react-icons/fa";

function App() {

  return (
    <div>
      <Navbar>
        <Container>
          <Navbar.Brand href="#home" className="text-light"><FaPills /> Barbara's Meds</Navbar.Brand>
        </Container>
      </Navbar>
      <Home />
    </div>
  );
}

export default App;
