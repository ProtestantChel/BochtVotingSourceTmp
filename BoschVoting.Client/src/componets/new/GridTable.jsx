import {Form, Table, InputGroup} from "react-bootstrap";
import {Search} from "react-bootstrap-icons";
import { useState, useEffect } from "react";

import axios from "axios";
export default function GridTable({ws}) {

    const [participantsList, setParticipantsList] = useState([]);
    const [title, setTitle] = useState('');

    useEffect(() => {
        const timer = setInterval(async () => {
            await axios.get('/api/Values/participantsList')
                .then(response => {
                    if (response.data.length > 0) {
                        setParticipantsList(response.data)
                    }
                }).catch(err => console.log(err));
        }, 1000);
        return () => clearInterval(timer);
    });
    useEffect(() => {
        document.title = "Посещаемость"
        document.getElementById("root").style.height = window.innerHeight + 'px';
        document.getElementById("root").style.width = window.innerWidth < 1200 ? '1200px' : window.innerWidth + 'px';
        window.addEventListener('resize', () => {
            document.getElementById("root").style.height = window.innerHeight + 'px';
            document.getElementById("root").style.width = window.innerWidth < 1200 ? '1200px' : window.innerWidth + 'px';

        })
        axios.get('/api/Values/participantsTitle')
            .then(response => {
                setTitle(response.data)
            }).catch(err => {
                console.log(err)
            });
        ws.ws.addEventListener('message', (event) => {
            let request = JSON.parse(event.data)
            if (request.operation === "registerEvents") {
                ws.send({
                    messageId: 0,
                    operation: "getParticipants",
                    parameters: {}
                });
            }
            if (request.operation === "getParticipants") {
                axios.get('/api/Values/participantsList')
                    .then(response => {
                        if (response.data.length > 0) {
                            const arr = request.parameters.participants.filter(f => !response.data.map(m => m.participantId).includes(f.participantId))
                            if (arr.length > 0) {
                                const pt = request.parameters.participants.map(m => {
                                    m.isPresent = false
                                    return m;
                                })
                                axios.post('/api/Values/participantsList', pt)
                                    .then(response => console.log(response))
                                    .catch(err => console.log(err));
                                setParticipantsList(pt)
                            } else {
                                setParticipantsList(response.data)
                            }

                        } else {
                            const pt = request.parameters.participants.map(m => {
                                m.isPresent = false
                                return m;
                            })
                            setParticipantsList(pt)
                            axios.post('/api/Values/participantsList', pt)
                                .then(response => console.log(response))
                                .catch(err => console.log(err));
                        }
                    }).catch(err => {
                        console.log(err)
                        setParticipantsList(request.parameters.participants.map(m => {
                            m.isPresent = false
                            return m;
                        }))
                    });
            }
        });
      
    }, [])

    const changePart = (e, p) => {
        const pt = participantsList.map(m => {
            if (m.participantId === p.participantId)
                m.isPresent = e.target.checked;
            return m;
        })
        axios.post('/api/Values/participantsList', pt).then(response => console.log(response))
            .catch(err => console.log(err));
        setParticipantsList(pt)
        setSearchItem('')

    }

    const [searchItem, setSearchItem] = useState('')
    const change = (e) => {
        let value = e.target.value;
        setSearchItem(value)
    }
    return (
        <div style={{marginTop: "10px", fontFamily: "Arial"}}>

            <h1>{title}</h1>
            <div style={{padding: "10px",  display: "flex", flexDirection: "column"}}>
                <div style={{ padding: "10px", display: "inline-block" }}>
                    <div style={{ float: "left" }}>
                        <div>Выдано: {participantsList.filter(f => f.isPresent).length}</div>
                    </div>
                    <div style={{ float: "right" }}>
                        <InputGroup className="mb-3">
                            <InputGroup.Text id="basic-addon1"><Search /></InputGroup.Text>
                            <Form.Control
                                placeholder="Поиск"
                                aria-label="Поиск"
                                aria-describedby="basic-addon1"
                                onChange={change}
                                value={searchItem}
                            />
                        </InputGroup>
                    </div>

                </div>
                <Table bordered>
                    <thead>
                    <tr>
                        <th style={{width: "100px"}}>#</th>
                        <th>Фамилия</th>
                        <th>Имя</th>
                        <th>Отчество</th>
                    </tr>
                    </thead>
                    <tbody>
                    {
                            participantsList.length > 0 ? participantsList.filter(f => f.lastName.toLowerCase().indexOf(searchItem.toLowerCase()) !== -1).sort((a, b) => b.lastName < a.lastName ? 1 : b.lastName > a.lastName ? -1 : 0).map((p) => (
                            <tr>
                                    <td><Form.Check className="check-input-reg" type="checkbox" checked={p.isPresent}  onChange={(e) => changePart(e,p)} /></td>
                                    <td>{p.lastName}</td>
                                    <td>{p.firstName}</td>
                                    <td>{p.middleName}</td>
                            </tr>
                            )) : ""
                    }
                    </tbody>
                </Table>
            </div>
        </div>
    )
}