import React, { useEffect, useState } from "react";
import { db } from "../firebase.js";
import { set, ref, onValue, remove } from "firebase/database";
import { uid } from "uid";
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import { Card } from 'ui-neumorphism'
import { CardContent, H5 } from 'ui-neumorphism'
import { CardHeader } from 'ui-neumorphism'
import { Button } from 'ui-neumorphism'
import Stack from 'react-bootstrap/Stack';
import Modal from 'react-bootstrap/Modal';
import { BsTrashFill } from "react-icons/bs";
import { TextField } from 'ui-neumorphism'
import { Divider } from 'ui-neumorphism'

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
    
    const amount = meds.length;
    console.log(amount);

  return (
    <div>
<Divider dark dense elevated />
        <Modal show={show} onHide={handleClose} dark>
          <Modal.Header closeButton>
            <Modal.Title>Add New Med</Modal.Title>
          </Modal.Header>
          <Modal.Body>
         
              <TextField dark type="text" label="Name" value={name} onChange={(e) => setName(e.value)} />
            
              <TextField dark type="text" label="Mg" value={mg} onChange={(e) => setMg(e.value)} />
           
              <TextField dark type="text" label="Type" value={type} onChange={(e) => setType(e.value)} />
            
          </Modal.Body>
          <Modal.Footer>
            <Button dark onClick={writeToDatabase}>
              Submit
            </Button>
          </Modal.Footer>
        </Modal>
        
        <Container className="pb-5">
          <Button dark className="my-3 float-end" onClick={handleShow}>Add New Drug</Button>
          <h5 className="my-3 mx-3">Number of Drugs: {amount}</h5>
            <Row>
              <Col></Col>
               
                <TextField dark autofocus bordered type="text" label="Search..." value={query} onChange={(e) => setQuery(e.value)} />
    
        {
            meds
            .filter(med => med.name.toLowerCase().includes(query.toLowerCase()))
            .sort((a, b) => a.name.localeCompare(b.name))
            .map(med => {
                return (
                  
                      <Col xs={12} md={6}>
                        <Card dark rounded className="my-3 mx-2 p-3">
                          <CardContent>
                            <CardHeader>{med.name}</CardHeader>
                            <Stack direction="horizontal" gap={3}>
                            <H5 dark>{med.mg} Mg</H5>
                            <div className="vr" />
                            <H5 dark>{med.type}</H5>
                            <Button dark className="ms-auto" onClick={() => deleteItem(med.uidd)}><BsTrashFill /></Button>
                            </Stack>
                          </CardContent>
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