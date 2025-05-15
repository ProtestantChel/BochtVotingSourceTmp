import {useEffect, useState} from "react";

export default function VotingResult({data, vote, noVote, subject, participants, voteState}){

    const [for_p, setFor_p] = useState(0)
    useEffect(() => {
        document.title = "Голосование"
        document.getElementById("root").style.height = window.innerHeight + 'px';
        window.addEventListener('resize', () => {
            document.getElementById("root").style.height = window.innerHeight + 'px';

        })



    }, [])

    useEffect(() => {
        const a = Math.round(participants.length > 0 ? (data.find(f => f.type === 'ПРОТИВ').value * 100) / participants.filter(m => m.canVote).length : 0)
        const b = Math.round(participants.length > 0 ? (data.find(f => f.type === 'ВОЗДЕРЖАЛИСЬ').value * 100) / participants.filter(m => m.canVote).length : 0)
        const c = Math.round(participants.length > 0 ? (noVote * 100) /  participants.filter(m => m.canVote).length : 0)
        console.log(a,b,c, participants.filter(m => m.canVote).length)

        setFor_p(c - a - b)

    }, [participants])
    return (
        <div className="registration">
            <div className="registration_item_1">{subject}</div>

            <div style={{height: "80px"}}></div>

            <div className="registration_item_2">
                <h1 style={{fontWeight: "600", fontSize: "4rem"}}>ГОЛОСОВАНИЕ ОКОНЧЕНО</h1>
            </div>

            <div className="registration_item_3">
                <div className="registration_item_list">
                    <div className="registration_item_list_row">
                        <div style={{background: "#009b26"}}></div>
                        <div style={{marginLeft: "20px", display: "flex", flexDirection: "row", justifyContent: "space-between", textAlign: 'left'}}>
                            <div style={{width: '500px'}}>За</div>
                            <div style={{ marginLeft: '50px', width: '30px' }}>{data.find(f => f.type === 'ЗА').value}</div>
                            <div style={{marginLeft: '70px'}}>({for_p}%)</div>
                        </div>
                    </div>
                    <div className="registration_item_list_row">
                        <div style={{background: "#fc0001"}}></div>
                        <div style={{marginLeft: "20px", display: "flex", flexDirection: "row", justifyContent: "space-between", textAlign: 'left'}}>
                            <span style={{width: '500px'}}>Против</span>
                            <span style={{ marginLeft: '50px', width: '30px' }}>{data.find(f => f.type === 'ПРОТИВ').value}</span>
                            <span style={{ marginLeft: '70px' }}>({Math.round(participants.length > 0 ? (data.find(f => f.type === 'ПРОТИВ').value *100) / participants.filter(m => m.canVote).length : 0)}%)</span>
                        </div>
                    </div>
                    <div className="registration_item_list_row">
                        <div style={{background: "#fafd01"}}></div>
                        <div style={{marginLeft: "20px", display: "flex", flexDirection: "row", justifyContent: "space-between", textAlign: 'left'}}>
                            <span style={{width: '500px'}}>Воздержались</span>
                            <span style={{ marginLeft: '50px', width: '30px' }}>{data.find(f => f.type === 'ВОЗДЕРЖАЛИСЬ').value}</span>
                            <span style={{ marginLeft: '70px' }}>({Math.round(participants.length > 0 ? (data.find(f => f.type === 'ВОЗДЕРЖАЛИСЬ').value *100) / participants.filter(m => m.canVote).length : 0)}%)</span>

                        </div>
                    </div>
                </div>
            </div>
            <div className="registration_item_4">
                <div style={{
                    display: "flex",
                    width: "100%",
                    fontSize: "3rem",
                    fontWeight: 600,
                    justifyContent: "center"
                }}>
                    <div style={{
                        display: "flex",
                        flexDirection: "row"
                    }}>
                        <div style={{width: '500px', textAlign: 'left'}}>Голосовало</div>
                        <span style={{ marginLeft: '50px', width: '30px' }}>{noVote}</span>
                        <span
                            style={{ marginLeft: '70px' }}>({participants.length > 0 ? Math.round((noVote * 100) / participants.filter(m => m.canVote).length) : 0}%)</span>

                    </div>
                </div>
                <span> {voteState === "accepted" ? "РЕШЕНИЕ ПРИНЯТО" : voteState === "rejected" && "РЕШЕНИЕ НЕ ПРИНЯТО"}</span>

            </div>
        </div>
    );
}