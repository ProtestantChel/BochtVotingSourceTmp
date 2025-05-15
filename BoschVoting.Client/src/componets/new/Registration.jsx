import {useEffect, useState} from "react";
export default function Registration({ws}){
    const [participants, setParticipants] = useState([]);
    const [participantSeats, setParticipantSeats] = useState([]);
    const [meetingInfo, setMeetingInfo] = useState({
        agendaList: [],
        autoOpenOnActivate: true,
        autoStartAgendaOnOpen: false,
        defaultDiscussionId: "",
        description: "",
        documentationRef: "",
        identificationMethod: "",
        isDefault: false,
        meetingEndDate: "",
        meetingId: "",
        meetingStartDate: "",
        state: "",
        title: "",
        verificationMethod: ""
    })
    const [quorumResult, setQuorumResult] = useState({
        comparisonOperator: "",
        denominatorValue: 0,
        isEnabled: false,
        numeratorValue: 0,
        status: "",
        thresholdValue: 0
    });
    useEffect(() => {
        document.title = "Регистрация"
        document.getElementById("root").style.height = window.innerHeight + 'px';
        document.getElementById("root").style.width = window.innerWidth < 1200 ? '1200px' : window.innerWidth + 'px';
        window.addEventListener('resize', () => {
            document.getElementById("root").style.height = window.innerHeight + 'px';
            document.getElementById("root").style.width = window.innerWidth < 1200 ? '1200px' : window.innerWidth + 'px';

        })

        ws.ws.addEventListener('message', (event) => {
            let request = JSON.parse(event.data)
            if (request.operation === "registerEvents") {
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
                    operation: "getQuorumResult",
                    parameters: {}
                });
                ws.send({
                    messageId: 0,
                    operation: "getMeetingInfo",
                    parameters: {}
                });
            }
            if (request.operation === "getParticipants") {
                setParticipants(request.parameters.participants.filter(f => f.canVote))
            }
            if (request.operation === "getParticipantSeats") {
                setParticipantSeats(request.parameters.participantSeats)
            }
            if (request.operation === "getQuorumResult") {
                if (request.parameters.quorumResult !== null) {
                    setQuorumResult(request.parameters.quorumResult)
                } else {
                    setQuorumResult({
                        comparisonOperator: "",
                        denominatorValue: 0,
                        isEnabled: false,
                        numeratorValue: 0,
                        status: "",
                        thresholdValue: 0
                    })
                }

                    
            }
            if (request.operation === "getMeetingInfo") {
                setMeetingInfo(request.parameters.meetingInfo)
                console.log(request.parameters.meetingInfo)
            }
        });

    }, []);
    const res = (a) => {
        if (a === 1) return "депутат"
        if (a === 2 || a === 3 || a === 4) return "депутата"

        return "депутатов"
    }
    const ratio = (r) => {
        if (r === 0) return r;
        if (r % 1 === 0) return r + 1;
        return Math.ceil(r)
    }
    return (
        <div className="registration">
            <div className="registration_item_1">{meetingInfo.agendaList.length > 0 && meetingInfo.state === "opened" ? meetingInfo.title: "Повестка дня"} </div>

            <div style={{height: "80px"}}></div>

            <div className="registration_item_2">
                <h1 style={{fontWeight: "600", fontSize: "4rem"}}>РЕГИСТРАЦИЯ</h1>
                <span style={{ fontStyle: "italic" }}>
                    Кворум {ratio(participants.length * quorumResult.thresholdValue)} {res(Math.round(participants.length * quorumResult.thresholdValue) % 10)}  (более {quorumResult.thresholdValue * 100}%)
                </span>
            </div>

            <div className="registration_item_3">
                <div className="registration_item_list">
                    <div className="registration_item_list_row">
                        <div style={{background: "#fafd01"}}></div>
                        <div style={{marginLeft: "20px", display: "flex", flexDirection: "row", justifyContent: "space-between", textAlign: 'left'}}>
                            <div style={{ width: '500px' }}>Всего депутатов</div>
                            <div style={{marginLeft: '50px', width: '30px'}}>{participants.length}</div>
                            <div style={{marginLeft: '70px'}}>(100%)</div>
                        </div>
                    </div>
                    <div className="registration_item_list_row">
                        <div style={{background: "#009b26"}}></div>
                        <div style={{marginLeft: "20px", display: "flex", flexDirection: "row", justifyContent: "space-between", textAlign: 'left'}}>
                            <span style={{ width: '500px' }}>Присутствует</span>
                            <span style={{ marginLeft: '50px', width: '30px' }}>{participants.filter(m => m.isAuthenticated).length}</span>
                            <span style={{ marginLeft: '70px' }}>({participants.length > 0 ? Math.round((participants.filter(m => m.isAuthenticated).length * 100) / participants.length) : 0}%)</span>
                        </div>
                    </div>
                    <div className="registration_item_list_row">
                        <div style={{background: "#fc0001"}}></div>
                        <div style={{marginLeft: "20px", display: "flex", flexDirection: "row", justifyContent: "space-between", textAlign: 'left'}}>
                            <span style={{ width: '500px' }}>Отсутствуют</span>
                            <span style={{marginLeft: '50px', width: '30px'}}>{participants.filter(m => !m.isAuthenticated).length}</span>
                            <span style={{ marginLeft: '70px' }}>({participants.length > 0 ? 100 - Math.round((participants.filter(m => m.isAuthenticated).length * 100) / participants.length) : 0}%)</span>

                        </div>
                    </div>
                </div>
            </div>
            <div className="registration_item_4">
                {
                    quorumResult.status === "True" ?
                        <span style={{color: "#06cf66"}}> КВОРУМ ЕСТЬ</span>
                        :
                        <span style={{color: "#fc0001"}}> КВОРУМА НЕТ</span>
                }
            </div>
        </div>
    );
}