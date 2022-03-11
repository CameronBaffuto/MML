import React, { useEffect, useState } from "react";
import { db } from "../firebase.js";
import { set, ref, onValue, remove } from "firebase/database";
import { uid } from "uid";
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Card from 'react-bootstrap/Card';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import Stack from 'react-bootstrap/Stack';
import Modal from 'react-bootstrap/Modal';
import { BsTrashFill } from "react-icons/bs";

function Home() {
    const [meds, setMeds] = useState([]);
    const [name, setName] = useState("");
    const [mg, setMg] = useState("");
    const [type, setType] = useState("");
    const [query, setQuery] = useState("")
    const [show, setShow] = useState(false);

    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);

    useEffect(() => {
            // read
            onValue(ref(db, `/meds/`), (snapshot) => {
              setMeds([]);
              const data = snapshot.val();
              if (data !== null) {
                Object.values(data).map((meds) => {
                  setMeds((oldArray) => [...oldArray, meds]);
                });
              }
            });
            }, []);

    const writeToDatabase = () => {
        const uidd = uid();
        set(ref(db, `/meds/${uidd}`), {
          name: name,
          mg: mg,
          type: type,
          uidd: uidd,
        });

        setName("");
        setMg("");
        setType("");
        setShow(false);
      }

    const deleteItem = (uid) => {
        remove(ref(db, `/meds/${uid}`));
    } 

  return (
    <div>

        <Modal show={show} onHide={handleClose}>
          <Modal.Header closeButton>
            <Modal.Title>Add New Med</Modal.Title>
          </Modal.Header>
          <Modal.Body>
          <Form>
            <Form.Group className="mb-3" controlId="formBasicEmail">
              <Form.Label>Drug Name</Form.Label>
              <Form.Control type="text" placeholder="Name" value={name} onChange={(e) => setName(e.target.value)} />
            </Form.Group>

            <Form.Group className="mb-3" controlId="formBasicEmail">
              <Form.Label>Mg</Form.Label>
              <Form.Control type="text" placeholder="Mg" value={mg} onChange={(e) => setMg(e.target.value)} />
            </Form.Group>

            <Form.Group className="mb-3" controlId="formBasicEmail">
              <Form.Label>Type</Form.Label>
              <Form.Control type="text" placeholder="Type" value={type} onChange={(e) => setType(e.target.value)} />
            </Form.Group>
          </Form>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="green" onClick={writeToDatabase}>
              Submit
            </Button>
          </Modal.Footer>
        </Modal>
        
        <Container className="pb-5">
          <Button variant="green" className="my-3 float-end" onClick={handleShow}>Add New Drug</Button>
            <Row>
              <Col></Col>
        <Form className="py-2">
          <Form.Group className="mb-3 text-center" controlId="search">
            <input type="text" className="searchBar form-control rounded-pill py-1 text-light" placeholder="Search..." onChange={event => setQuery(event.target.value)}/>
          </Form.Group>
        </Form>  

        
        {
            meds
            .filter(med => med.name.toLowerCase().includes(query.toLowerCase()))
            .sort((a, b) => a.name.localeCompare(b.name))
            .map(med => {
                return (
                  
                      <Col xs={12} md={6}>
                        <Card className="red my-3 mx-2">
                          <Card.Body>
                            <Card.Title as="h2">{med.name}</Card.Title>
                            <Stack direction="horizontal" gap={3}>
                            <Card.Text as="h5">{med.mg} Mg</Card.Text>
                            <div className="vr" />
                            <Card.Text as="h5">{med.type}</Card.Text>
                            <Button variant="red" className="ms-auto text-light" size="lg" onClick={() => deleteItem(med.uidd)}><BsTrashFill /></Button>
                            </Stack>
                          </Card.Body>
                        </Card>
                      </Col>
                )
            })
        }
        <Col></Col>
            </Row>
        </Container>
    </div>
  )
}

export default Home