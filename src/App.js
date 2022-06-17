import React, { useState, useEffect } from 'react'
import Home from './Components/Home';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'ui-neumorphism/dist/index.css';
import Navbar from 'react-bootstrap/Navbar';
import Container from 'react-bootstrap/Container';
import './App.css';
import { FaPills } from "react-icons/fa";
import { auth } from './firebase.js';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { TextField } from 'ui-neumorphism';
import { Button } from 'ui-neumorphism';
import Modal from 'react-bootstrap/Modal';

function App() {

const [email, setEmail] = useState('')
const [password, setPassword] = useState('')
const [isUser, setIsUser] = useState(false);

const [show, setShow] = useState(false);

const handleClose = () => setShow(false);
const handleShow = () => setShow(true);

useEffect(() => {
    auth.onAuthStateChanged(user => {
        if (user) {
            setIsUser(true);
        }
    })
})

  const handleSignIn = () => {
    signInWithEmailAndPassword(auth, email, password)
      .then(result => {
        console.log(result)
        setEmail("")
        setPassword("")
        handleClose()
      })
      .catch(error => {
        alert(error)
      })
  }

  const handleSignOut = () => {
    auth.signOut()
      .then(result => {
        console.log(result)
        window.location.reload(false);

      })
      .catch(error => {
        console.log(error)
      })
  }

  return (
    <div>
      <Navbar>
        <Container>
          <Navbar.Brand href="#home" className="text-light"><FaPills /> Barbara's Meds</Navbar.Brand>
        </Container>
        {
          isUser ? (
            <Button dark className="float-end m-2" onClick={handleSignOut}>Sign Out</Button>
          ): (
            <Button dark className="float-end m-2" onClick={handleShow}>Sign In</Button>
          )
        }
      </Navbar>
      <Home />
      
      <Modal show={show} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>Login</Modal.Title>
        </Modal.Header>
        <Modal.Body>
            <TextField dark autofocus bordered type="text" label="Email" value={email} onChange={(e) => setEmail(e.value)} />
            <TextField dark autofocus bordered type="password" label="Password" value={password} onChange={(e) => setPassword(e.value)} />
        </Modal.Body>
        <Modal.Footer>
          <Button dark onClick={handleSignIn}>
            Login
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
}

export default App;
