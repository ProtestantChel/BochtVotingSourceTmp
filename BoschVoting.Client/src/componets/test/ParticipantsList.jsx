import { useContext, useEffect, useState } from "react";
import { Context } from "../../Context";
import { CloseButton, Table } from "react-bootstrap";
import axios from "axios";
export default function ParticipantsList() {
    const { ws, setRegistration} = useContext(Context);
    const [participants, setParticipants] = useState([]);
    const [seats, setSeats] = useState([]);
    const [participantSeats, setParticipantSeats] = useState([]);
    const [participantsList, setParticipantsList] = useState([]);
    const [seatVotingResults, setSeatVotingResults] = useState([]);

    useEffect(() => {
        ws.send({
            messageId: 0,
            operation: "getParticipants",
            parameters: {}
        });
        ws.send({
            messageId: 0,
            operation: "getParticipantSeats",
            parameters: {}
        });
        ws.send({
            messageId: 0,
            operation: "getSeatVotingResults",
            parameters: {}
        });
        ws.send({
            messageId: 0,
            operation: "getSeats",
            parameters: {}
        });
        ws.ws.addEventListener('message', (event) => {
            let request = JSON.parse(event.data)
            if (request.operation === "getParticipants") {
                setParticipants(request.parameters.participants)
            }
            if (request.operation === "getParticipantSeats") {
                setParticipantSeats(request.parameters.participantSeats)
            }
            if (request.operation === "getSeatVotingResults") {
                setSeatVotingResults(request.parameters.votingResults)

            }

            if (request.operation === "getSeats") {
                setSeats(request.parameters.seats)
            }


        });
    }, [])

    useEffect(() => {
        const timer = setInterval(async () => {
            await axios.get('/api/Values/participantsList')
                .then(response => {
                    setParticipantsList(response.data)
                }).catch(err => console.log(err));
        }, 1000);
        return () => clearInterval(timer);
    });

    const [h, setH] = useState("auto");
    useEffect(() => {
        setH((document.querySelector(".drawing").offsetHeight) + "px")
        window.addEventListener('resize', () => {
            setH((document.querySelector(".drawing").offsetHeight) + "px");
        })
    }, [])
    return (
        <div className="participants-list" style={{ height: h }}>
            <div style={{ width: "100%", height: "30px", backgroundColor: "#d5d4d4", display: "flex" }}>
                <div style={{ width: "100%", fontSize: "1.2rem", fontWeight: "600" }}>Регистрация</div>
                <CloseButton style={{ position: "absolute", right: "5px", top: "2px" }} onClick={() => setRegistration(false)} />
            </div>
            <div style={{ display: "block", marginTop: "3px", padding: "3px" }}>
                <Table className="table-participants" bordered size="sm">
                    <thead>
                        <tr>
                            <th>Не зарегистрированы</th>
                        </tr>
                    </thead>
                    <tbody>
                        {
                            participantsList.filter(f => f.isPresent && participantSeats.filter(ff => ff.seatedSeatId === "").map(m => m.participantId).includes(f.participantId)).sort((a, b) => b.lastName < a.lastName ? 1 : b.lastName > a.lastName ? -1 : 0).map((p) => (
                                <tr>
                                    <td >
                                        {p.lastName + " " + p.firstName + " " + p.middleName}
                                    </td>
                                </tr>
                            ))
                        }
                    </tbody>
                </Table>
                <Table className="table-participants" bordered size="sm">
                    <thead>
                        <tr>
                            <th>Не голосовало</th>
                        </tr>
                    </thead>
                    <tbody>
                        {
                            participants.filter(f => f.canVote && participantSeats.filter(fs => fs.seatedSeatId !== "" && !seatVotingResults.map(m => m.seatId).includes(fs.seatedSeatId)).map(m => m.participantId).includes(f.participantId)).sort((a, b) => b.lastName < a.lastName ? 1 : b.lastName > a.lastName ? -1 : 0).map((p) => (
                                <tr>
                                    <td >
                                        {p.lastName + " " + p.firstName + " " + p.middleName}
                                    </td>
                                </tr>
                            ))
                        }
                    </tbody>
                </Table>
                {/* {participantSeats.length > 0 &&
                    <Table className="table-participants" bordered size="sm">
                        <thead>
                        <tr>
                            <th style={{backgroundColor:"#c9f699"}}>Зарегистрированы</th>
                        </tr>
                        </thead>
                        <tbody>
                        {
                            participants.filter(f => participantSeats.filter(ff => ff.seatedSeatId !== "").map(m => m.participantId).includes(f.participantId)).map((p) => (
                                <tr>
                                    <td style={{backgroundColor: "#c9f699"}}>
                                        {p.lastName + " " + p.firstName + " " +p.middleName}
                                    </td>
                                </tr>
                            ))
                        }
                        </tbody>
                    </Table>
                } */}
            </div>

        </div>
    )
}