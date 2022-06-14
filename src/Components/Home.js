import React, { useEffect, useState } from "react";
import { db } from "../firebase.js";
import { set, ref, onValue, remove, update } from "firebase/database";
import { uid } from "uid";
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import { Card } from 'ui-neumorphism'
import { CardContent, H5 } from 'ui-neumorphism'
import { CardHeader } from 'ui-neumorphism'
import { Button } from 'ui-neumorphism'
import { Fab } from 'ui-neumorphism';
import Stack from 'react-bootstrap/Stack';
import Modal from 'react-bootstrap/Modal';
import { BsTrashFill } from "react-icons/bs";
import { BsPencilFill } from "react-icons/bs";
import { TextField } from 'ui-neumorphism'
import { Divider } from 'ui-neumorphism'
import { FaCloudDownloadAlt } from "react-icons/fa";
import { CSVLink } from "react-csv";

function Home() {
    const [meds, setMeds] = useState([]);
    const [name, setName] = useState("");
    const [mg, setMg] = useState("");
    const [type, setType] = useState("");
    const [frequency, setFrequency] = useState("");
    const [query, setQuery] = useState("")
    const [showAdd, setShowAdd] = useState(false);
    const [showDelete, setShowDelete] = useState(false);
    const [showEdit, setShowEdit] = useState(false);

    const handleCloseAdd = () => setShowAdd(false);
    const handleShowAdd = () => setShowAdd(true);
    const handleCloseDelete = () => setShowDelete(false);
    const handleShowDelete = () => setShowDelete(true);
    const handleCloseEdit = () => setShowEdit(false);
    const handleShowEdit = () => setShowEdit(true);

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
          frequency: frequency,
          uidd: uidd,
        });

        setName("");
        setMg("");
        setType("");
        setFrequency("");
        setShowAdd(false);
      }

    const deleteItem = (uid) => {
        remove(ref(db, `/meds/${uid}`));
        setShowDelete(false);
    }

    const editItem = (med) => {
        setName(med.name);
        setMg(med.mg);
        setType(med.type);
        setFrequency(med.frequency);
        setShowEdit(true);
  }

    const confirmEdit = (uid) => {
      update(ref(db, `/meds/${uid}`), {
        name: name,
        mg: mg,
        type: type,
        frequency: frequency,
      });
      setShowEdit(false);
    }
    
    const amount = meds.length;
    // console.log(amount);

    const getday = meds.filter(med => med.frequency === 'Day');
    const daytime = getday.length;

    const getnight = meds.filter(med => med.frequency === 'Night');
    const nighttime = getnight.length;

    const getboth = meds.filter(med => med.frequency === 'Day & Night');
    const bothdn = getboth.length;

    const getasneed = meds.filter(med => med.frequency === 'As Needed');
    const asneed = getasneed.length;

    const headers = [
        { label: 'Name', key: 'name' },
        { label: 'Mg', key: 'mg' },
        { label: 'Type', key: 'type' },
        { label: 'Frequency', key: 'frequency' },
    ]

    const data = meds.map(med => ({
        name: med.name,
        mg: med.mg,
        type: med.type,
        frequency: med.frequency,
    }));

  return (
    <div>
<Divider dark dense elevated />
        <Modal show={showAdd} onHide={handleCloseAdd} dark>
          <Modal.Header closeButton>
            <Modal.Title>Add New Med</Modal.Title>
          </Modal.Header>
          <Modal.Body>
         
              <TextField dark autofocus bordered type="text" label="Name" value={name} onChange={(e) => setName(e.value)} />
            
              <TextField dark autofocus bordered type="text" label="Mg" value={mg} onChange={(e) => setMg(e.value)} />
           
              <TextField dark autofocus bordered type="text" label="Type" value={type} onChange={(e) => setType(e.value)} />

              <TextField dark autofocus bordered type="text" label="Frequency" value={frequency} onChange={(e) => setFrequency(e.value)} />
            
          </Modal.Body>
          <Modal.Footer>
            <Button dark onClick={writeToDatabase}>
              Submit
            </Button>
          </Modal.Footer>
        </Modal>
        
        <Container className="pb-5">
          <Button dark className="my-3 float-end" onClick={handleShowAdd}>Add New Drug</Button>

          <Fab dark className="my-2 mx-4 float-end">
            <CSVLink
              data={data}
              headers={headers}
              filename={"BarbaraMeds.csv"}
              target="_blank"
              >
                <FaCloudDownloadAlt style={{ color: '#fff', fontSize: '20px'}}/>
            </CSVLink>
          </Fab>

          <h5 className="my-3 mx-3">Number of Drugs: {amount}</h5>
          <p className="my-3 mx-3">Day: {daytime} | Night: {nighttime} | Both: {bothdn} | As Needed: {asneed}</p>

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
                            <div className="vr" />
                            <H5 dark>{med.frequency}</H5>
                            </Stack>
                            <Button dark className="float-end m-1" onClick={handleShowDelete}><BsTrashFill /></Button>
                            <Button dark className="float-end m-1" onClick={() => editItem(med)}><BsPencilFill /></Button>
                            <br/>
                          </CardContent>
                        </Card>

                      <Modal show={showDelete} onHide={handleCloseDelete} dark>
                        <Modal.Header closeButton>
                          <Modal.Title>Delete?</Modal.Title>
                        </Modal.Header>
                        <Modal.Body>
                      
                            <h4>Are you sure you want to delete?</h4>

                        </Modal.Body>
                        <Modal.Footer>
                            <Button dark onClick={() => deleteItem(med.uidd)}>Delete</Button>
                            <Button dark onClick={handleCloseDelete}>Cancel</Button>
                        </Modal.Footer>
                      </Modal>

                      <Modal show={showEdit} onHide={handleCloseEdit} dark>
                        <Modal.Header closeButton>
                          <Modal.Title>Edit</Modal.Title>
                        </Modal.Header>
                        <Modal.Body>
                      
                        <TextField dark autofocus bordered type="text" label="Name" value={name} onChange={(e) => setName(e.value)} />
            
                        <TextField dark autofocus bordered type="text" label="Mg" value={mg} onChange={(e) => setMg(e.value)} />
                    
                        <TextField dark autofocus bordered type="text" label="Type" value={type} onChange={(e) => setType(e.value)} />

                        <TextField dark autofocus bordered type="text" label="Frequency" value={frequency} onChange={(e) => setFrequency(e.value)} />

                        </Modal.Body>
                        <Modal.Footer>
                            <Button dark onClick={() => confirmEdit(med.uidd)}>Save</Button>
                            <Button dark onClick={handleCloseEdit}>Cancel</Button>
                        </Modal.Footer>
                      </Modal>
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