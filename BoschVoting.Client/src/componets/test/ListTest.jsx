import {ArrowBarLeft, ArrowBarRight} from "react-bootstrap-icons";
import {useContext, useEffect, useRef, useState} from "react";
import {Context} from "../../Context";
import axios from "axios";
import '../../jquery-ui.min.js'
import '../../jquery.ui.sortable-animation.js';
export default function ListTest(){
    const configureRef = useRef(null);
    const [h, setH] = useState((document.querySelector(".drawing").offsetHeight) + "px");

    const {arrSeats, setArrSeats, seatCanvas, setSeatCanvas} = useContext(Context)
    useEffect(() => {
        window.addEventListener('resize', () => {
            setH((document.querySelector(".drawing").offsetHeight) + "px");
        })
    },[])

    const mousedown = (event) => {
        const list = configureRef.current;
        let shiftX = event.clientX - list.getBoundingClientRect().left;

        document.addEventListener('mousemove', onMouseMove);
        document.addEventListener('mouseup', onMouseUp);

        function onMouseMove(event) {
            let newLeft = event.clientX - shiftX

            if (newLeft < 0) {
                newLeft = 0;
            }
            let rightEdge = document.querySelector(".drawing").offsetWidth - list.offsetWidth;
            if (newLeft > rightEdge) {
                newLeft = rightEdge;
            }


            list.style.left = newLeft + 'px';
        }

        function onMouseUp() {
            document.removeEventListener('mouseup', onMouseUp);
            document.removeEventListener('mousemove', onMouseMove);
        }

    };


    useEffect(()=>{
        $("#container-seat").sortable({
            animation: 200
        })
        console.log($("#container-seat"))

    },[])


    return (
        <div className="configure-list" style={{height: h}} ref={configureRef} >
            <div style={{
                height: '40px',
                backgroundColor: '#eaeaea',
                borderBottom: '1px solid',
                display: "flex",
                justifyContent: "space-between",
                cursor: 'e-resize'
            }}
                 onMouseDown={mousedown} >
                <ArrowBarLeft width="30px" height="40px"/>
                <ArrowBarRight width="30px" height="40px"/>
            </div>

            <div id="container-seat" >
                {
                    arrSeats?.sort((a, b) => a.index - b.index)
                        ?.map((item) => (
                                    <div
                                        className="seatName"
                                        id={item.seatId}
                                        onMouseUp={(event) => {
                                            event.target.hidden = true
                                            let elemBelow = document.elementFromPoint(event.clientX, event.clientY);
                                            let e = event.currentTarget
                                            if (elemBelow.className === "drawing" || elemBelow.tagName === "CANVAS") {
                                                console.log(seatCanvas)
                                                //let arr_1 = []
                                                //for (let i = 0; i < seatCanvas.length; i++) {
                                                //    arr_1.push(seatCanvas[i])
                                                //}
                                                //arr_1.push({
                                                //    id: item.seatId,
                                                //    seatedParticipantId: item.seatedParticipantId,
                                                //    left: (event.clientX - 45 / 2),
                                                //    top: (event.clientY - 45 / 2),
                                                //    text: item.screenLine
                                                //})
                                                 let arr_1 = [...seatCanvas, {
                                                     id: item.seatId,
                                                     seatedParticipantId: item.seatedParticipantId,
                                                     left: (event.clientX - 45/2),
                                                     top: (event.clientY - 45/2),
                                                     text: item.screenLine,
                                                     isMute: 0
                                                 }]
                                                setSeatCanvas(arr_1)
                                                console.log(arr_1)
                                                axios.post('/api/Values/seatCanvas', arr_1)
                                                    .then(response => console.log(response))
                                                    .catch(err => console.log(err));

                                                let arr_2 = arrSeats.filter(f => f.seatId !== e.id)

                                                axios.post('/api/Values/seatList', arr_2.sort((a, b) => {
                                                    let textA = a.seatName.toUpperCase();
                                                    let textB = b.seatName.toUpperCase();
                                                    return (textA < textB) ? -1 : (textA > textB) ? 1 : 0;
                                                }))
                                                    .then(response => console.log(response))
                                                    .catch(err => console.log(err));
                                                setArrSeats(arr_2)
                                                // localStorage.setItem("seatList", JSON.stringify(arr_2))
                                            }
                                            event.target.hidden = false

                                        }}
                                        style={{ backgroundColor: item.seatedParticipantId !== `""`? 'white' :'#c9f699'}}
                                    >
                                        {item.screenLine}
                                    </div>
                            )
                        )
                }
            </div>
        </div>
    );
}