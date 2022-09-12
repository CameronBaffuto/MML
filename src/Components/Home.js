import React, { useEffect, useState } from "react";
import { auth, db } from "../firebase.js";
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
import { RadioGroup } from 'ui-neumorphism';
import { Radio } from 'ui-neumorphism';
import Image from 'react-bootstrap/Image'
import Zoom from 'react-medium-image-zoom'
import 'react-medium-image-zoom/dist/styles.css'


function Home() {
    const [meds, setMeds] = useState([]);
    const [name, setName] = useState("");
    const [mg, setMg] = useState("");
    const [type, setType] = useState("");
    const [medImage, setMedImage] = useState("")
    const [frequency, setFrequency] = useState("");
    const [query, setQuery] = useState("")
    const [showAdd, setShowAdd] = useState(false);
    const [showEdit, setShowEdit] = useState(false);
    const [tempUidd, setTempUidd] = useState("");
    const [isUser, setIsUser] = useState(false);

    const handleCloseAdd = () => setShowAdd(false);
    const handleShowAdd = () => {
        setName("");
        setMg("");
        setType("");
        setFrequency("");
        setShowAdd(true);
    }
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

    useEffect(() => {
        auth.onAuthStateChanged(user => {
            if (user) {
                setIsUser(true);
                }
            })
    })

    const writeToDatabase = () => {
        const uidd = uid();
        set(ref(db, `/meds/${uidd}`), {
          name: name,
          mg: mg,
          type: type,
          medImage: medImage,
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
    }

    const editItem = (med) => {
        setName(med.name);
        setMg(med.mg);
        setType(med.type);
        setFrequency(med.frequency);
        setTempUidd(med.uidd);
        setMedImage(med.medImage);
        setShowEdit(true);
  }

    const confirmEdit = () => {
      update(ref(db, `/meds/${tempUidd}`), {
        name: name,
        mg: mg,
        type: type,
        medImage: medImage,
        frequency: frequency,
        tempUidd: tempUidd,
      });
      setShowEdit(false);
      setName("");
      setMg("");
      setType("");
      setFrequency("");
      setMedImage("");
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

              <TextField dark autofocus bordered type="text" label="Image URL" value={medImage} onChange={(e) => setMedImage(e.value)} />

              <RadioGroup vertical value={frequency} dark onChange={(e) => setFrequency(e.value)}>
                 <Radio value='Day' label='Day' color='yellow' />
                 <Radio value='Night' label='Night' color='blue' />
                 <Radio value='Day & Night' label='Day & Night' color='purple' />
                 <Radio value='As Needed' label='As Needed' color='green' />
              </RadioGroup>
            
          </Modal.Body>
          <Modal.Footer>
            <Button dark onClick={writeToDatabase}>
              Submit
            </Button>
          </Modal.Footer>
        </Modal>
        
        <Container className="pb-5">
          {
            isUser ? (
              <Button dark className="my-3 float-end" onClick={handleShowAdd}>Add New Drug</Button>
            ) : (
              <></>
            )
          }

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
            .filter(med => med.name.toLowerCase().includes(query.toLowerCase()) || med.frequency.toLowerCase().includes(query.toLowerCase()))
            .sort((a, b) => a.name.localeCompare(b.name))
            .map(med => {
                return (
                  
                      <Col xs={12} md={6}>
                        <Card dark rounded className="my-3 mx-2 p-3">
                          <CardContent>
                            <CardHeader>
                              <Zoom>
                                <Image className="mx-3" rounded fluid src={med.medImage} width={150}/>  { med.name }
                              </Zoom>
                                
                            </CardHeader>
                            <Stack direction="horizontal" gap={3}>
                            <H5 dark>{med.mg} Mg</H5>
                            <div className="vr" />
                            <H5 dark>{med.type}</H5>
                            <div className="vr" />
                            <H5 dark>{med.frequency}</H5>
                            </Stack>
                            {
                              isUser ? (
                              <>
                                <Button dark className="float-end m-1" onClick={() => deleteItem(med.uidd)}><BsTrashFill /></Button>
                                <Button dark className="float-end m-1" onClick={() => editItem(med)}><BsPencilFill /></Button>
                                <br/>
                              </>
                            ) : (
                              <></>
                            )}
                          </CardContent>
                        </Card>


                      <Modal show={showEdit} onHide={handleCloseEdit} dark>
                        <Modal.Header closeButton>
                          <Modal.Title>Edit {name}</Modal.Title>
                        </Modal.Header>
                        <Modal.Body>
                      
                        <TextField dark autofocus bordered type="text" label="Name" value={name} onChange={(e) => setName(e.value)} />
            
                        <TextField dark autofocus bordered type="text" label="Mg" value={mg} onChange={(e) => setMg(e.value)} />
                    
                        <TextField dark autofocus bordered type="text" label="Type" value={type} onChange={(e) => setType(e.value)} />

                        <TextField dark autofocus bordered type="text" label="Image URL" value={medImage} onChange={(e) => setMedImage(e.value)} />

                        <RadioGroup vertical value={frequency} dark onChange={(e) => setFrequency(e.value)}>
                            <Radio value='Day' label='Day' color='yellow' />
                            <Radio value='Night' label='Night' color='blue' />
                            <Radio value='Day & Night' label='Day & Night' color='purple' />
                            <Radio value='As Needed' label='As Needed' color='green' />
                        </RadioGroup>

                        </Modal.Body>
                        <Modal.Footer>
                            <Button dark onClick={confirmEdit}>Save</Button>
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
