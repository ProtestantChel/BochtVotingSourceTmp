import '../../../node_modules/react-vis/dist/style.css';
import {useEffect, useState} from "react";


export default function TestBarChart ({ws}){
    const [participantSeats, setParticipantSeats] = useState([]);

    useEffect(() => {
        ws.ws.addEventListener('message', (event) => {
            let request = JSON.parse(event.data)
            if (request.operation === "getParticipantSeats") {
                setParticipantSeats(request.parameters.participantSeats)
            }
            if (request.operation === "getVotingResults") {
                console.log(request)
            }
        });
    }, []);

    return (
        <div style={{display: 'flex', flexDirection: 'row', width: '1200px'}}>
            <div className="div_test">
                <h2>Discussion List</h2>
                <hr/>
                <div>{}</div>
            </div>
            <div className="div_test">
                <h2>Зарегистрировано</h2>
                <hr/>
                <div>{participantSeats.filter(f => f.seatedSeatId !== "")}</div>
            </div>
            <div className="div_test">
                <h2>Не зарегистрировано</h2>
                <hr/>
                <div>{}</div>
            </div>
        </div>
    );
}