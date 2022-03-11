import React, { useState } from 'react';
import Home from './Components/Home';
import 'bootstrap/dist/css/bootstrap.min.css';
import Navbar from 'react-bootstrap/Navbar';
import Container from 'react-bootstrap/Container';
import './App.css';
import { FaPills } from "react-icons/fa";

function App() {

  // const [theme, setTheme] = useState('light');

  return (
    <div>
      <Navbar className="red">
        <Container>
          <Navbar.Brand href="#home" className="text-light"><FaPills /> Mom's Meds</Navbar.Brand>
          <Navbar.Toggle />
          <Navbar.Collapse className="justify-content-end">
            <Navbar.Text className="text-light">
              
            </Navbar.Text>
          </Navbar.Collapse>
        </Container>
      </Navbar>
      <Home />
    </div>
  );
}

export default App;
