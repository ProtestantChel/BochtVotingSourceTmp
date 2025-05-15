
import {useEffect, useState} from "react";
import VotingResult from "./VotingResult";
import { Column } from "@ant-design/plots";

export default function ChartDraw({ ws }) {

    const [data, setData] = useState([
        { type: 'ЗА', value: 0 },
        { type: 'ПРОТИВ', value: 0 },
        { type: 'ВОЗДЕРЖАЛИСЬ', value: 0 },
        { type: 'НЕ ГОЛОСОВАЛИ', value: 0 },
    ]);
    const [noVote, setNoVote] = useState(0)
    const config = {
        data,
        height: 600,
        xField: 'type',
        yField: 'value',

        axis: {
            x: {
                labelFontSize: 20,
                labelFill: 'rgb(0,0,0)',
                labelFontWeight: 600,
                labelFillOpacity: 2,
                labelSpacing: 10,
                grid: false,
            },
            y: {
                label: false,
                tick: false,
                grid: false,
            },
        },
        style: {
            fill: ({ type }) => {
                if (type === 'ЗА') {
                    return '#20ab42';
                }
                if (type === 'ПРОТИВ') {
                    return 'rgb(255,65,66)';
                }
                if (type === 'ВОЗДЕРЖАЛИСЬ') {
                    return '#f9fa62';
                }
                if (type === 'НЕ ГОЛОСОВАЛИ') {
                    return '#c7c6c6';
                }
                return '#2989FF';
            },
        },
        label: {
            text: (originData) => {
                if (originData.value > 0) {
                    return originData.value
                }
                return '';
              },
            shadowOffsetY: 10,
            fillOpacity: 1,
            textBaseline: 'top',
            fontSize: 20,
            fontWeight: 800,
            color: '#171e62',

        },
        legend: false,

    };
    const [vote, setVote] = useState(0)
    const [subject, setSubject] = useState("")
    const [opened, setOpened] = useState(true)
    const [voteState, setVoteState] = useState("")
    const [participants, setParticipants] = useState([]);
    const [ratio, setRatio] = useState(0);
    const [votingInfo, setVotingInfo] = useState({})

    useEffect(() => {
        document.title = "Голосование"
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
                    operation: "getVotingResults",
                    parameters: {}
                });
                ws.send({
                    messageId: 0,
                    operation: "getVotingInfo",
                    parameters: {}
                });
                ws.send({
                    messageId: 0,
                    operation: "getVotingState",
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
                    operation: "getParticipants",
                    parameters: {}
                });
            }
            if (request.operation === "getVotingResults") {
                if (request.parameters?.votingResults.length > 0) {
                    let a = request.parameters?.votingResults.find(f => f.answer === "for").count
                    let b = request.parameters?.votingResults.find(f => f.answer === "against").count
                    let c = request.parameters?.votingResults.find(f => f.answer === "abstain").count
                    let d = a + b + c
                    setNoVote(d)
                    setData(data.map(m => {
                        if (m.type === 'ЗА') {
                            m.value = a;
                        }
                        if (m.type === 'ПРОТИВ') {
                            m.value = b;
                        }
                        if (m.type === 'ВОЗДЕРЖАЛИСЬ') {
                            m.value = c;
                        }
                        return m;
                    }))
                }


            }
            if (request.operation === "getVotingInfo") {
                setSubject(request.parameters?.votingInfo.subject)
                setVotingInfo(request.parameters.votingInfo)
            }
            if (request.operation === "getVotingState") {
                setVoteState(request.parameters?.votingState)
                if (request.parameters?.votingState === "opened" || request.parameters?.votingState === "closed")
                    setOpened(true)
                if (request.parameters?.votingState === "accepted" || request.parameters?.votingState === "rejected")
                    setOpened(false)
            }

            if (request.operation === "getParticipantSeats") {
                // setParticipantSeats(request.parameters.participantSeats)
                // let count = request.parameters.participantSeats.length
                // setNotVote(count)
            }

            if (request.operation === "getSeatVotingResults") {
                let count = request.parameters.votingResults.length
                console.log(count)
                setVote(count)
            }
            if (request.operation === "getParticipants") {
                setParticipants(request.parameters.participants.filter(f => f.canVote))

            }

        });
    }, [])


    useEffect(() => {
        opened ? document.querySelector("body").style.backgroundColor = '#73c0e7' : document.querySelector("body").style.backgroundColor = "#29245e"
    }, [opened])

    useEffect(() => {

        console.log(data, document.querySelector(".chart-dev"))
        if (document.querySelector(".chart-dev") !== null && document.querySelector(".chart-dev") !== undefined && document.querySelector(".chart-dev")?.offsetHeight !== null && document.querySelector(".chart-dev").offsetHeight !== 600) {
            if (data.find(f => f.type === 'НЕ ГОЛОСОВАЛИ').value > 0)
                document.querySelector(".chart-dev").style.height = "600px";
            if (data.find(f => f.type === 'НЕ ГОЛОСОВАЛИ').value === 0 && (data.find(f => f.type === 'ЗА').value > 0 || data.find(f => f.type === 'ПРОТИВ').value > 0 || data.find(f => f.type === 'ВОЗДЕРЖАЛИСЬ').value > 0)) {
                document.querySelector(".chart-dev").style.height = "600px";
            }
        }
    }, [data])
    useEffect(() => {
        const majority = votingInfo.voteMajorityInfo?.majorityThresholdExpression
        if (majority !== null && majority !== undefined) {
            const a = parseFloat(majority.replace(",", "."))
            const b = participants.length * a
            console.log(b,a)
            setRatio(b)
        }


    }, [votingInfo, participants])

    useEffect(() => {
        setData(data.map(m => {
            if (m.type === 'НЕ ГОЛОСОВАЛИ') {
                m.value = participants.filter(f => f.isAuthenticated).length - vote;
            }
            return m;
        }))
    }, [participants])

    return (
        opened ?
            <div className="chart-main">
                <div style={{
                    textAlign: 'left',
                    marginLeft: '10px',
                    fontSize: '3rem',
                    fontWeight: '600',
                    fontFamily: "sans-serif",
                    letterSpacing: '0.02em',
                }}
                ><p>{subject}</p>
                </div>
                <div
                    style={{
                        textAlign: 'center',
                        fontSize: '3rem',
                        fontWeight: '400',
                        fontFamily: "sans-serif",
                        letterSpacing: '0.02em',
                    }}
                ><p >ИДЁТ ГОЛОСОВАНИЕ</p>
                    <hr style={{
                        border: "none",
                        backgroundColor: "black",
                        height: "3px",
                        opacity: '1'
                    }} />
                </div>
                <div className="chart-dev">
                    <Column {...config} />
                </div>
                <div>
                    <div style={{ backgroundColor: data.find(f => f.type === 'ЗА').value > ratio ? "#188554" : "#db3545", height: "30px", borderRadius: "4px" }}></div>
                </div>
            </div> : <VotingResult data={data} vote={vote} subject={subject} noVote={noVote} participants={participants} voteState={voteState} />
    );
}